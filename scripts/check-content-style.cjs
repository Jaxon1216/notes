#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const DEFAULT_TARGET = path.join('content', 'docs')
const ALLOW_NO_HEADINGS = new Set(['content/docs/index.mdx'])
const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  '.source',
  'dist',
  'out',
  'img',
])

function toPosix(filePath) {
  return filePath.split(path.sep).join('/')
}

function isMarkdownFile(filePath) {
  return /\.mdx?$/.test(filePath)
}

function walk(target, files = []) {
  if (!fs.existsSync(target)) return files

  const stat = fs.statSync(target)
  if (stat.isFile()) {
    if (isMarkdownFile(target)) files.push(target)
    return files
  }

  if (!stat.isDirectory()) return files

  for (const name of fs.readdirSync(target).sort((a, b) => a.localeCompare(b, 'zh-CN'))) {
    if (IGNORE_DIRS.has(name) || name.startsWith('.')) continue

    walk(path.join(target, name), files)
  }

  return files
}

function parseHeadings(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  const headings = []
  let inFence = false
  let fenceChar = ''
  let fenceLength = 0
  let inFrontmatter = lines[0]?.trim() === '---'

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const trimmed = line.trim()
    const lineNumber = index + 1

    if (inFrontmatter) {
      if (lineNumber > 1 && trimmed === '---') {
        inFrontmatter = false
      }
      continue
    }

    const fenceMatch = /^(`{3,}|~{3,})/.exec(trimmed)
    if (fenceMatch) {
      const marker = fenceMatch[1]
      const markerChar = marker[0]
      if (!inFence) {
        inFence = true
        fenceChar = markerChar
        fenceLength = marker.length
      } else if (markerChar === fenceChar && marker.length >= fenceLength) {
        inFence = false
        fenceChar = ''
        fenceLength = 0
      }
      continue
    }

    if (inFence) continue

    const headingMatch = /^(#{1,6})[ \t]+(.+?)\s*$/.exec(line)
    if (!headingMatch) continue

    headings.push({
      line: lineNumber,
      level: headingMatch[1].length,
      text: headingMatch[2].replace(/[ \t]+#+$/, '').trim(),
    })
  }

  return headings
}

function findInlineCodeMarkdownPaths(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  const issues = []
  let inFence = false
  let fenceChar = ''
  let fenceLength = 0
  let inFrontmatter = lines[0]?.trim() === '---'

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const trimmed = line.trim()
    const lineNumber = index + 1

    if (inFrontmatter) {
      if (lineNumber > 1 && trimmed === '---') {
        inFrontmatter = false
      }
      continue
    }

    const fenceMatch = /^(`{3,}|~{3,})/.exec(trimmed)
    if (fenceMatch) {
      const marker = fenceMatch[1]
      const markerChar = marker[0]
      if (!inFence) {
        inFence = true
        fenceChar = markerChar
        fenceLength = marker.length
      } else if (markerChar === fenceChar && marker.length >= fenceLength) {
        inFence = false
        fenceChar = ''
        fenceLength = 0
      }
      continue
    }

    if (inFence) continue

    const codeSpanPattern = /`([^`\n]+)`/g
    for (const match of line.matchAll(codeSpanPattern)) {
      const codeText = match[1].trim()
      if (/^\.{1,2}\/[^\s`)]*\.mdx?(?:#[^\s`)]*)?$/.test(codeText)) {
        issues.push(
          issue(
            'inline-markdown-path',
            filePath,
            lineNumber,
            `相对 Markdown 路径 \`${codeText}\` 会被渲染为代码文本；需要跳转时请写成 Markdown 链接。`,
          ),
        )
      }
    }
  }

  return issues
}

function issue(code, filePath, line, message) {
  return {
    code,
    filePath: toPosix(path.relative(process.cwd(), filePath)),
    line,
    message,
  }
}

function checkFile(filePath) {
  const relativePath = toPosix(path.relative(process.cwd(), filePath))
  const headings = parseHeadings(filePath)
  const issues = findInlineCodeMarkdownPaths(filePath)

  if (headings.length === 0) {
    if (!ALLOW_NO_HEADINGS.has(relativePath)) {
      issues.push(
        issue(
          'missing-heading',
          filePath,
          1,
          '文章正文至少需要一个标题；普通文章建议从一个 H1 或 H2 开始。',
        ),
      )
    }
    return issues
  }

  const h1Headings = headings.filter((heading) => heading.level === 1)

  if (h1Headings.length > 1) {
    issues.push(
      issue(
        'multiple-h1',
        filePath,
        h1Headings[1].line,
        '同一篇文章最多只能有一个 H1；页面标题之后的章节请从 H2 开始。',
      ),
    )
  }

  if (h1Headings.length === 1 && headings[0].level !== 1) {
    issues.push(
      issue(
        'late-h1',
        filePath,
        h1Headings[0].line,
        'H1 只能作为文章第一个标题出现；正文中间不要再使用 H1。',
      ),
    )
  }

  if (headings[0].level > 2) {
    issues.push(
      issue(
        'first-heading-too-deep',
        filePath,
        headings[0].line,
        `第一个标题不能从 H${headings[0].level} 开始；请使用 H1 或 H2。`,
      ),
    )
  }

  for (let index = 0; index < headings.length; index += 1) {
    const current = headings[index]
    const previous = headings[index - 1]
    const previousLevel = previous ? previous.level : 1

    if (current.level > previousLevel + 1) {
      issues.push(
        issue(
          'heading-level-jump',
          filePath,
          current.line,
          `标题从 H${previousLevel} 跳到 H${current.level}；请逐级使用标题层级。`,
        ),
      )
    }

    if (/\[[^\]]+\]\([^)]+\)/.test(current.text)) {
      issues.push(
        issue(
          'heading-link',
          filePath,
          current.line,
          '标题中不要直接写 Markdown 链接；把链接放到标题下面的正文里。',
        ),
      )
    }
  }

  return issues
}

function main() {
  const targets = process.argv.slice(2).filter((arg) => !arg.startsWith('-'))
  const scanTargets = targets.length > 0 ? targets : [DEFAULT_TARGET]
  const files = scanTargets.flatMap((target) => walk(path.resolve(target))).sort()
  const issues = files.flatMap(checkFile)

  if (issues.length === 0) {
    console.log(`Content style check passed (${files.length} files).`)
    return
  }

  console.error(`Content style check failed with ${issues.length} issue(s):`)
  for (const item of issues) {
    console.error(`${item.filePath}:${item.line} [${item.code}] ${item.message}`)
  }

  process.exit(1)
}

main()
