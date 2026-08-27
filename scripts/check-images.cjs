#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const DEFAULT_TARGET = path.join('content', 'docs')
const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', '.source', 'dist', 'out'])
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'])
const IMAGE_FILE_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*\.(png|jpg|jpeg|webp|gif|svg)$/

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

function isRemoteUrl(value) {
  return /^(?:https?:)?\/\//i.test(value) || /^(?:data|mailto|tel):/i.test(value)
}

function stripUrlSuffix(value) {
  return value.split(/[?#]/)[0]
}

function isImagePath(value) {
  return IMAGE_EXTENSIONS.has(path.extname(stripUrlSuffix(value)).toLowerCase())
}

function issue(code, filePath, line, message) {
  return {
    code,
    filePath: toPosix(path.relative(process.cwd(), filePath)),
    line,
    message,
  }
}

function scanMarkdownImages(filePath, lines, issues, isIgnoredLine) {
  const markdownImagePattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g

  for (let index = 0; index < lines.length; index += 1) {
    if (isIgnoredLine(index)) continue

    const line = lines[index]
    const lineNumber = index + 1
    for (const match of line.matchAll(markdownImagePattern)) {
      const alt = match[1].trim()
      const src = match[2].trim()

      if (!alt && !isRemoteUrl(src)) {
        issues.push(issue('image-alt-empty', filePath, lineNumber, 'Markdown 图片需要填写有意义的 alt 文案。'))
      }

      checkImageSource(filePath, lineNumber, src, issues)
    }
  }
}

function scanHtmlImages(filePath, lines, issues, isIgnoredLine) {
  const htmlImagePattern = /<img\b[^>]*\bsrc=(?:"([^"]+)"|'([^']+)')[^>]*>/gi

  for (let index = 0; index < lines.length; index += 1) {
    if (isIgnoredLine(index)) continue

    const line = lines[index]
    const lineNumber = index + 1
    for (const match of line.matchAll(htmlImagePattern)) {
      const src = (match[1] || match[2] || '').trim()
      if (src && isImagePath(src)) {
        checkImageSource(filePath, lineNumber, src, issues)
      }
    }
  }
}

function checkImageSource(filePath, lineNumber, src, issues) {
  if (isRemoteUrl(src) || src.startsWith('/')) return
  if (!isImagePath(src)) return

  const cleanSrc = stripUrlSuffix(src)

  if (!src.startsWith('./img/')) {
    issues.push(
      issue(
        'image-path-not-local-img',
        filePath,
        lineNumber,
        `本地图片 \`${src}\` 应放在当前专题的 img/ 目录，并使用 \`./img/xxx\` 引用。`,
      ),
    )
  }

  const absoluteImagePath = path.resolve(path.dirname(filePath), cleanSrc)
  if (!fs.existsSync(absoluteImagePath)) {
    issues.push(issue('image-not-found', filePath, lineNumber, `本地图片 \`${src}\` 指向的文件不存在。`))
    return
  }

  const imageFileName = path.basename(cleanSrc)
  if (!IMAGE_FILE_NAME_PATTERN.test(imageFileName)) {
    issues.push(
      issue(
        'image-file-name',
        filePath,
        lineNumber,
        `图片文件名 \`${imageFileName}\` 建议使用英文小写、数字和短横线。`,
      ),
    )
  }
}

function createIgnoredLinePredicate(lines) {
  const ignoredLines = new Set()
  let inFence = false
  let fenceChar = ''
  let fenceLength = 0
  let inFrontmatter = lines[0]?.trim() === '---'

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const trimmed = line.trim()
    const lineNumber = index + 1

    if (inFrontmatter) {
      ignoredLines.add(index)
      if (lineNumber > 1 && trimmed === '---') {
        inFrontmatter = false
      }
      continue
    }

    const fenceMatch = /^(`{3,}|~{3,})/.exec(trimmed)
    if (fenceMatch) {
      ignoredLines.add(index)
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

    if (inFence) ignoredLines.add(index)
  }

  return (index) => ignoredLines.has(index)
}

function checkFile(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  const issues = []
  const isIgnoredLine = createIgnoredLinePredicate(lines)

  scanMarkdownImages(filePath, lines, issues, isIgnoredLine)
  scanHtmlImages(filePath, lines, issues, isIgnoredLine)

  return issues
}

function main() {
  const targets = process.argv.slice(2).filter((arg) => !arg.startsWith('-'))
  const scanTargets = targets.length > 0 ? targets : [DEFAULT_TARGET]
  const files = scanTargets.flatMap((target) => walk(path.resolve(target))).sort()
  const issues = files.flatMap(checkFile)

  if (issues.length === 0) {
    console.log(`Image reference check passed (${files.length} files).`)
    return
  }

  console.error(`Image reference check failed with ${issues.length} issue(s):`)
  for (const item of issues) {
    console.error(`${item.filePath}:${item.line} [${item.code}] ${item.message}`)
  }

  process.exit(1)
}

main()
