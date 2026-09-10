#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const DEFAULT_TARGET = path.join('content', 'docs')
const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', '.source', 'dist', 'out'])
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg'])
const IMAGE_FILE_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*\.(png|jpg|jpeg|webp|avif|gif|svg)$/
const RECOMMENDED_MAX_IMAGE_BYTES = 500 * 1024
const HARD_MAX_IMAGE_BYTES = 1024 * 1024

function toPosix(filePath) {
  return filePath.split(path.sep).join('/')
}

function isMarkdownFile(filePath) {
  return /\.mdx?$/.test(filePath)
}

function walk(target, collected = { markdownFiles: [], imageFiles: [] }) {
  if (!fs.existsSync(target)) return collected

  const stat = fs.statSync(target)
  if (stat.isFile()) {
    if (isMarkdownFile(target)) collected.markdownFiles.push(target)
    if (isImagePath(target)) collected.imageFiles.push(target)
    return collected
  }

  if (!stat.isDirectory()) return collected

  for (const name of fs.readdirSync(target).sort((a, b) => a.localeCompare(b, 'zh-CN'))) {
    if (IGNORE_DIRS.has(name) || name.startsWith('.')) continue
    walk(path.join(target, name), collected)
  }

  return collected
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

function scanMarkdownImages(filePath, lines, issues, warnings, referencedImages, isIgnoredLine) {
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

      checkImageSource(filePath, lineNumber, src, issues, warnings, referencedImages)
    }
  }
}

function scanHtmlImages(filePath, lines, issues, warnings, referencedImages, isIgnoredLine) {
  const htmlImagePattern = /<img\b[^>]*\bsrc=(?:"([^"]+)"|'([^']+)')[^>]*>/gi

  for (let index = 0; index < lines.length; index += 1) {
    if (isIgnoredLine(index)) continue

    const line = lines[index]
    const lineNumber = index + 1
    for (const match of line.matchAll(htmlImagePattern)) {
      const src = (match[1] || match[2] || '').trim()
      if (src) {
        checkImageSource(filePath, lineNumber, src, issues, warnings, referencedImages)
      }
    }
  }
}

function checkImageSource(filePath, lineNumber, src, issues, warnings, referencedImages) {
  if (isRemoteUrl(src)) {
    if (/^(?:https?:)?\/\//i.test(src)) {
      warnings.push(
        issue(
          'remote-image',
          filePath,
          lineNumber,
          `远程图片 \`${src}\` 不经过 Next.js 本地图片优化，建议下载到当前专题的 \`img/\` 目录。`,
        ),
      )
    }
    return
  }

  if (src.startsWith('/')) return
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
  referencedImages.add(absoluteImagePath)

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

function formatImageSize(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`
}

function checkImageInventory(imageFiles, referencedImages, issues, warnings) {
  for (const filePath of imageFiles) {
    const size = fs.statSync(filePath).size

    if (!referencedImages.has(path.resolve(filePath))) {
      issues.push(
        issue(
          'image-orphan',
          filePath,
          null,
          '图片未被扫描范围内的 Markdown/MDX 引用，请删除或补充正文引用。',
        ),
      )
    }

    if (size > HARD_MAX_IMAGE_BYTES) {
      issues.push(
        issue(
          'image-size-limit',
          filePath,
          null,
          `图片大小为 ${formatImageSize(size)}，超过 1 MiB 上限，请压缩后再提交。截图优先使用 WebP，图示优先使用 SVG。`,
        ),
      )
    } else if (size > RECOMMENDED_MAX_IMAGE_BYTES) {
      warnings.push(
        issue(
          'image-size-warning',
          filePath,
          null,
          `图片大小为 ${formatImageSize(size)}，建议压缩到 500 KiB 以内。截图优先使用 WebP，图示优先使用 SVG。`,
        ),
      )
    }
  }
}

function formatIssue(item) {
  const location = item.line ? `${item.filePath}:${item.line}` : item.filePath
  return `${location} [${item.code}] ${item.message}`
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
  const warnings = []
  const referencedImages = new Set()
  const isIgnoredLine = createIgnoredLinePredicate(lines)

  scanMarkdownImages(filePath, lines, issues, warnings, referencedImages, isIgnoredLine)
  scanHtmlImages(filePath, lines, issues, warnings, referencedImages, isIgnoredLine)

  return { issues, warnings, referencedImages }
}

function main() {
  const targets = process.argv.slice(2).filter((arg) => !arg.startsWith('-'))
  const scanTargets = targets.length > 0 ? targets : [DEFAULT_TARGET]
  const collected = scanTargets.reduce(
    (result, target) => walk(path.resolve(target), result),
    { markdownFiles: [], imageFiles: [] },
  )
  const files = [...new Set(collected.markdownFiles)].sort()
  const imageFiles = [...new Set(collected.imageFiles)].sort()
  const issues = []
  const warnings = []
  const referencedImages = new Set()

  for (const filePath of files) {
    const result = checkFile(filePath)
    issues.push(...result.issues)
    warnings.push(...result.warnings)
    for (const imagePath of result.referencedImages) {
      referencedImages.add(imagePath)
    }
  }

  checkImageInventory(imageFiles, referencedImages, issues, warnings)

  if (warnings.length > 0) {
    console.warn(`Image reference check completed with ${warnings.length} warning(s):`)
    for (const item of warnings) {
      console.warn(formatIssue(item))
    }
  }

  if (issues.length === 0) {
    console.log(`Image reference check passed (${files.length} files, ${imageFiles.length} images).`)
    return
  }

  console.error(`Image reference check failed with ${issues.length} issue(s):`)
  for (const item of issues) {
    console.error(formatIssue(item))
  }

  process.exit(1)
}

main()
