const fs = require('fs')
const path = require('path')
const {
  SITE_SECTIONS,
  IGNORE_NAMES,
  childPath,
} = require('../site.config.cjs')

const ROOT = path.resolve(__dirname, '..')

function shouldIgnore(name) {
  return name.startsWith('.') || IGNORE_NAMES.has(name)
}

function getMdFiles(dir, files = []) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return files

  const names = fs.readdirSync(dir)
    .sort((a, b) => a.localeCompare(b))
    .filter((name) => !shouldIgnore(name) && !name.endsWith('.cpp') && !name.endsWith('.exe'))

  names.forEach((name) => {
    const fullPath = path.join(dir, name)
    const stat = fs.statSync(fullPath)
    if (!stat.isDirectory() && name.endsWith('.md')) {
      files.push(fullPath)
    }
  })

  names.forEach((name) => {
    const fullPath = path.join(dir, name)
    if (fs.statSync(fullPath).isDirectory()) {
      getMdFiles(fullPath, files)
    }
  })

  return files
}

function firstMarkdownLink(dir) {
  const files = getMdFiles(path.join(ROOT, dir))
  if (files.length === 0) return ''

  return toLink(files[0])
}

function toLink(absPath) {
  return '/' + path.relative(ROOT, absPath).replace(/\\/g, '/').replace(/\.md$/, '')
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderChildCard(section, child) {
  const dir = childPath(section, child)
  const files = getMdFiles(path.join(ROOT, dir))
  const link = files.length > 0 ? toLink(files[0]) : ''
  const status = files.length > 0 ? `${files.length} 篇` : '待补充'
  const tag = child.contributionHint ? '<span class="home-tag">可贡献</span>' : ''
  const title = escapeHtml(child.title)
  const description = escapeHtml(child.description)

  if (!link) {
    return `      <div class="home-child is-empty">
        <div>
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
        <span>${status}</span>
      </div>`
  }

  return `      <a class="home-child" href="${link}">
        <div>
          <h3>${title}${tag}</h3>
          <p>${description}</p>
        </div>
        <span>${status}</span>
      </a>`
}

function sectionStats(section) {
  const files = getMdFiles(path.join(ROOT, section.dir))
  const childCount = section.children.length
  const firstLink = section.children
    .map((child) => firstMarkdownLink(childPath(section, child)))
    .find(Boolean) || ''

  return {
    files,
    fileCount: files.length,
    childCount,
    firstLink,
  }
}

function renderSection(section) {
  const stats = sectionStats(section)
  const title = escapeHtml(section.title)
  const description = escapeHtml(section.description)
  const children = section.children.map((child) => renderChildCard(section, child)).join('\n')
  const href = stats.firstLink || `/${section.dir}/`
  const emptyClass = stats.fileCount === 0 ? ' is-empty' : ''
  const sectionAction = stats.firstLink
    ? `<a class="home-section-link" href="${href}">进入栏目</a>`
    : '<span class="home-section-link is-disabled">等待内容</span>'

  return `  <section class="home-section${emptyClass}" id="${escapeHtml(section.dir)}">
    <div class="home-section-main">
      <div>
        <p class="home-kicker">${escapeHtml(section.dir)}</p>
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
      ${sectionAction}
    </div>
    <div class="home-section-meta">
      <span>${stats.childCount} 个方向</span>
      <span>${stats.fileCount} 篇文章</span>
    </div>
    <div class="home-child-grid">
${children}
    </div>
  </section>`
}

function renderQuickLinks(sections) {
  return sections
    .map((section) => {
      const stats = sectionStats(section)
      const label = escapeHtml(section.navTitle || section.title)
      return `<a href="${stats.firstLink || `#${section.dir}`}">${label}</a>`
    })
    .join('\n        ')
}

function generateDashboard() {
  const totalFiles = SITE_SECTIONS.reduce((count, section) => count + sectionStats(section).fileCount, 0)
  const activeSections = SITE_SECTIONS.filter((section) => sectionStats(section).fileCount > 0).length
  const sections = SITE_SECTIONS.map(renderSection).join('\n\n')
  const quickLinks = renderQuickLinks(SITE_SECTIONS)

  const content = `---
layout: doc
---

<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.classList.add('homepage')
})

onUnmounted(() => {
  document.body.classList.remove('homepage')
})
</script>

<div class="home-page">
  <header class="home-hero">
    <div>
      <p class="home-kicker">Easton Notes</p>
      <h1>工程实践知识库</h1>
    </div>
    <p class="home-subtitle">前端、服务端、Agent 应用开发、个人开发常用资料统一入口。</p>
    <div class="home-stats" aria-label="站点统计">
      <div><strong>${totalFiles}</strong><span>篇文章</span></div>
      <div><strong>${SITE_SECTIONS.length}</strong><span>主栏目</span></div>
      <div><strong>${activeSections}</strong><span>已有内容</span></div>
    </div>
  </header>

  <nav class="home-quick" aria-label="快速入口">
        ${quickLinks}
  </nav>

  <main class="home-layout">
${sections}
  </main>

  <section class="home-contribute">
    <div>
      <p class="home-kicker">Contribution</p>
      <h2>欢迎补充优质好文和项目</h2>
      <p>新增内容时优先放进对应方向的 <code>resources</code> 目录；暂时没有合适分类时，可以先补充到 <code>dev/notes</code>，再在后续重整。</p>
    </div>
    <a href="/README">查看贡献方式</a>
  </section>
</div>
`

  fs.writeFileSync(path.join(ROOT, 'index.md'), content)
  console.log('Dashboard generated at index.md')
  console.log(`  · ${SITE_SECTIONS.length} sections, ${totalFiles} articles`)
}

generateDashboard()
