# Knowledge Site UI and Information Architecture Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the VitePress notes site into a four-section knowledge base with a compact directory-first homepage and clear contribution docs.

**Architecture:** Introduce one shared site information architecture module consumed by both VitePress config and the dashboard generator. Migrate Markdown files into stable English directories, then generate navigation, sidebar, and homepage from the shared model. Keep visual styling quiet and focused on fast content entry.

**Tech Stack:** VitePress 1.6, Vue 3 in Markdown SFC blocks, Node/CommonJS scripts, TypeScript VitePress config.

---

## File Structure

- Create: `site.config.cjs`
  - Shared information architecture, display names, helper functions, and ignore rules.
- Modify: `.vitepress/config.mts`
  - Replace `SHOW_DIRS`, hardcoded display behavior, and old nav/sidebar generation with the shared section model.
- Modify: `scripts/generate-dashboard.cjs`
  - Replace terminal/dashboard homepage with compact directory index generated from the shared section model.
- Modify: `.vitepress/theme/custom.css`
  - Keep the existing documentation theme, but reduce gradient-heavy typography and align homepage-adjacent styles with the simpler UI.
- Modify: `README.md`
  - Document the new structure, local commands, contribution rules, and curated resource format.
- Move content:
  - `Frontend/Knowledge/**` -> `frontend/knowledge/**`
  - `Frontend/Handwrite/**` -> `frontend/knowledge/handwrite/**`
  - `Frontend/Project/**` -> `frontend/resources/projects/**`
  - `Misc/interview/**` -> `frontend/interview/**`
  - `Misc/tools/Linux.md` -> `dev/linux/linux.md`
  - `Misc/tools/git.md` -> `dev/git/git.md`
  - `Misc/tools/docker.md` -> `dev/tools/docker.md`
  - `Misc/tools/markdwon.md` -> `dev/tools/markdown.md`
  - `Misc/tools/lexicon.md` -> `dev/notes/lexicon.md`
  - `Misc/tricks/**` -> `dev/notes/**`
  - `Misc/articles/algorithm/**` and `Leetcode/**` -> `dev/notes/algorithm/**`
  - `Misc/books/**` -> `dev/notes/books/**`
  - `Misc/articles/bugs/**` -> `dev/notes/bugs/**`
  - `Misc/articles/ptojects/**` -> `dev/notes/projects/**`
- Leave empty for now unless new content is added:
  - `backend/knowledge/`
  - `backend/interview/`
  - `backend/resources/`
  - `agent/knowledge/`
  - `agent/interview/`
  - `agent/resources/`
  - `dev/conventions/`

## Task 1: Capture Baseline and Add Shared IA Module

**Files:**
- Create: `site.config.cjs`
- Read-only check: `package.json`

- [ ] **Step 1: Check current working tree**

Run:

```bash
git status --short --branch
```

Expected: no unexpected uncommitted source changes except work intentionally started for this plan. If `MathModelAgent` files reappear, do not modify them in this task.

- [ ] **Step 2: Create `site.config.cjs`**

Add:

```js
const path = require('path')

const SITE_SECTIONS = [
  {
    key: 'frontend',
    dir: 'frontend',
    title: '前端',
    navTitle: '前端',
    description: '沉淀 Web 框架、工程化、浏览器基础和前端项目实践。',
    children: [
      {
        key: 'knowledge',
        dir: 'knowledge',
        title: '知识八股',
        description: '框架原理、浏览器机制、手写题和高频基础知识。',
      },
      {
        key: 'interview',
        dir: 'interview',
        title: '面经',
        description: '面试复盘、题目整理和表达素材。',
      },
      {
        key: 'resources',
        dir: 'resources',
        title: '优质好文项目',
        description: '值得精读的文章、开源项目和实战案例。',
        contributionHint: '欢迎通过 PR 补充优质文章和项目。',
      },
    ],
  },
  {
    key: 'backend',
    dir: 'backend',
    title: '服务端',
    navTitle: '服务端',
    description: '整理 API、数据库、服务治理和后端工程实践。',
    children: [
      {
        key: 'knowledge',
        dir: 'knowledge',
        title: '知识八股',
        description: '网络、数据库、缓存、并发和系统设计基础。',
      },
      {
        key: 'interview',
        dir: 'interview',
        title: '面经',
        description: '服务端方向的面试复盘与问题清单。',
      },
      {
        key: 'resources',
        dir: 'resources',
        title: '优质好文项目',
        description: '后端工程与架构方向的优质内容收藏。',
        contributionHint: '欢迎通过 PR 补充优质文章和项目。',
      },
    ],
  },
  {
    key: 'agent',
    dir: 'agent',
    title: 'Agent 应用开发',
    navTitle: 'Agent',
    description: '记录 Agent 产品、工具调用、工作流和应用开发经验。',
    children: [
      {
        key: 'knowledge',
        dir: 'knowledge',
        title: '知识八股',
        description: 'LLM、RAG、工具调用、多 Agent 和评测基础。',
      },
      {
        key: 'interview',
        dir: 'interview',
        title: '面经',
        description: 'Agent 与 AI 应用方向的面试材料。',
      },
      {
        key: 'resources',
        dir: 'resources',
        title: '优质好文项目',
        description: 'Agent 应用、框架、案例和工程实践推荐。',
        contributionHint: '欢迎通过 PR 补充优质文章和项目。',
      },
    ],
  },
  {
    key: 'dev',
    dir: 'dev',
    title: '个人开发常用',
    navTitle: '开发常用',
    description: '放置日常开发中反复会用到的规范、命令和工具笔记。',
    children: [
      {
        key: 'conventions',
        dir: 'conventions',
        title: '开发规范',
        description: '提交、命名、文档和协作约定。',
      },
      {
        key: 'linux',
        dir: 'linux',
        title: 'Linux 常用命令',
        description: 'Shell、文件、进程、网络和排障命令。',
      },
      {
        key: 'git',
        dir: 'git',
        title: 'Git 基础',
        description: '分支、提交、回滚、冲突和协作流程。',
      },
      {
        key: 'tools',
        dir: 'tools',
        title: '工具配置',
        description: 'Docker、编辑器、Markdown 和常用工具。',
      },
      {
        key: 'notes',
        dir: 'notes',
        title: '随手记',
        description: '还没有形成专题但值得保存的经验和资料。',
      },
    ],
  },
]

const IGNORE_NAMES = new Set([
  'node_modules',
  '.git',
  '.DS_Store',
  '.vitepress',
  'README.md',
])

function sectionPath(section) {
  return section.dir
}

function childPath(section, child) {
  return path.posix.join(section.dir, child.dir)
}

function stripNumberPrefix(name) {
  return name.replace(/^\d+[-.]/, '')
}

function fileTitle(fileName) {
  return stripNumberPrefix(fileName.replace(/\.md$/, ''))
}

function findSectionByDir(dir) {
  return SITE_SECTIONS.find((section) => section.dir === dir)
}

function findChildByDir(section, dir) {
  return section.children.find((child) => child.dir === dir)
}

module.exports = {
  SITE_SECTIONS,
  IGNORE_NAMES,
  sectionPath,
  childPath,
  stripNumberPrefix,
  fileTitle,
  findSectionByDir,
  findChildByDir,
}
```

- [ ] **Step 3: Verify the module loads**

Run:

```bash
node -e "const { SITE_SECTIONS } = require('./site.config.cjs'); console.log(SITE_SECTIONS.map(s => s.dir).join(','))"
```

Expected output:

```text
frontend,backend,agent,dev
```

- [ ] **Step 4: Commit shared config**

Run:

```bash
git add site.config.cjs
git commit -m "feat: add shared site information architecture"
```

Expected: commit succeeds.

## Task 2: Migrate Markdown Content Into New Directories

**Files:**
- Move Markdown files from old content directories into `frontend/` and `dev/`.
- Do not edit `.vitepress/config.mts` or `scripts/generate-dashboard.cjs` in this task.

- [ ] **Step 1: Create destination directories**

Run:

```bash
mkdir -p frontend/knowledge/React frontend/knowledge/Vue frontend/knowledge/ajax-promise-axios frontend/knowledge/handwrite frontend/resources/projects/vue3rabbit frontend/interview dev/linux dev/git dev/tools dev/notes dev/notes/algorithm dev/notes/books dev/notes/bugs dev/notes/projects
```

Expected: directories exist.

- [ ] **Step 2: Move front-end knowledge files**

Run:

```bash
git mv Frontend/Knowledge/React frontend/knowledge/React
git mv Frontend/Knowledge/Vue frontend/knowledge/Vue
git mv Frontend/Knowledge/ajax-promise-axios frontend/knowledge/ajax-promise-axios
git mv Frontend/Handwrite frontend/knowledge/handwrite
git mv Frontend/Project/vue3rabbit frontend/resources/projects/vue3rabbit
```

Expected: old `Frontend/Knowledge`, `Frontend/Handwrite`, and `Frontend/Project/vue3rabbit` paths are staged as renames.

- [ ] **Step 3: Move interview and dev utility files**

Run:

```bash
git mv Misc/interview frontend/interview
git mv Misc/tools/Linux.md dev/linux/linux.md
git mv Misc/tools/git.md dev/git/git.md
git mv Misc/tools/docker.md dev/tools/docker.md
git mv Misc/tools/markdwon.md dev/tools/markdown.md
git mv Misc/tools/lexicon.md dev/notes/lexicon.md
git mv Misc/tricks/tips.md dev/notes/tips.md
```

Expected: files are staged under the new English paths.

- [ ] **Step 4: Move algorithm and miscellaneous article files into dev notes**

Run:

```bash
git mv Leetcode dev/notes/algorithm/leetcode
git mv Misc/articles/algorithm dev/notes/algorithm/articles
git mv Misc/books dev/notes/books
git mv Misc/articles/bugs dev/notes/bugs
git mv Misc/articles/ptojects dev/notes/projects
```

Expected: old `Leetcode` content and miscellaneous article folders are staged under `dev/notes`.

- [ ] **Step 5: Remove empty old top-level content directories if Git leaves them empty**

Run:

```bash
find Frontend Misc -type d -empty -delete
```

Expected: empty directories are removed from the working tree. This is safe because Git does not track empty directories.

- [ ] **Step 6: Inspect moved files**

Run:

```bash
find frontend dev -type f -name '*.md' | sort | sed -n '1,220p'
```

Expected: all previous Markdown notes appear under `frontend/` or `dev/`; `backend/` and `agent/` may still be empty.

- [ ] **Step 7: Commit content migration**

Run:

```bash
git status --short
git add frontend dev
git commit -m "refactor: migrate notes into new knowledge structure"
```

Expected: commit succeeds and primarily records renames. If unrelated files appear, stop and inspect before committing.

## Task 3: Generate Navigation and Sidebar From Shared IA

**Files:**
- Modify: `.vitepress/config.mts`

- [ ] **Step 1: Replace hardcoded directory constants and helpers**

In `.vitepress/config.mts`, replace the current `SHOW_DIRS`, `findFirstFile`, `getLinkForDir`, `getDirDropdownItems`, `generateNav`, `getSidebarItems`, and `generateSidebar` implementation with this structure:

```ts
import { defineConfig } from 'vitepress'
import { createRequire } from 'module'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const require = createRequire(import.meta.url)
const {
  SITE_SECTIONS,
  IGNORE_NAMES,
  childPath,
  fileTitle,
  findChildByDir,
  findSectionByDir,
} = require('../site.config.cjs')

type SiteChild = {
  key: string
  dir: string
  title: string
  description: string
  contributionHint?: string
}

type SiteSection = {
  key: string
  dir: string
  title: string
  navTitle: string
  description: string
  children: SiteChild[]
}

function shouldIgnore(item: string): boolean {
  return IGNORE_NAMES.has(item) || item.startsWith('.') || item.endsWith('.cpp') || item.endsWith('.exe')
}

function sortEntries(items: string[], dir: string): string[] {
  return items.sort((a, b) => {
    const aPath = path.join(dir, a)
    const bPath = path.join(dir, b)
    const aIsDir = fs.existsSync(aPath) && fs.statSync(aPath).isDirectory()
    const bIsDir = fs.existsSync(bPath) && fs.statSync(bPath).isDirectory()
    if (aIsDir && !bIsDir) return -1
    if (!aIsDir && bIsDir) return 1
    return a.localeCompare(b)
  })
}

function findFirstMarkdownFile(dir: string): string | null {
  if (!fs.existsSync(dir)) return null
  const items = sortEntries(fs.readdirSync(dir).filter((item) => !shouldIgnore(item)), dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (!stat.isDirectory() && item.endsWith('.md')) return fullPath
  }

  for (const item of items) {
    const fullPath = path.join(dir, item)
    if (fs.statSync(fullPath).isDirectory()) {
      const found = findFirstMarkdownFile(fullPath)
      if (found) return found
    }
  }

  return null
}

function fileToLink(file: string): string {
  return '/' + path.relative(process.cwd(), file).replace(/\\/g, '/').replace(/\.md$/, '')
}

function linkForDir(relativeDir: string): string | null {
  const firstFile = findFirstMarkdownFile(path.join(process.cwd(), relativeDir))
  return firstFile ? fileToLink(firstFile) : null
}

function generateNav() {
  const nav: Array<any> = [{ text: '首页', link: '/' }]

  ;(SITE_SECTIONS as SiteSection[]).forEach((section) => {
    const items = section.children
      .map((child) => {
        const link = linkForDir(childPath(section, child))
        return link ? { text: child.title, link } : null
      })
      .filter(Boolean)

    if (items.length === 0) return

    nav.push({
      text: section.navTitle || section.title,
      items,
    })
  })

  return nav
}

function displayNameForDir(item: string, base: string): string {
  const parts = base.split('/').filter(Boolean)
  if (parts.length === 0) {
    const section = findSectionByDir(item)
    return section?.title || item
  }

  if (parts.length === 1) {
    const section = findSectionByDir(parts[0])
    const child = section ? findChildByDir(section, item) : null
    return child?.title || item
  }

  return item
}

function getSidebarItems(dir: string, base: string): Array<any> {
  if (!fs.existsSync(dir)) return []

  const items = sortEntries(fs.readdirSync(dir).filter((item) => !shouldIgnore(item)), dir)
  const result: Array<any> = []

  items.forEach((item) => {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      const children = getSidebarItems(fullPath, `${base}${item}/`)
      if (children.length > 0) {
        result.push({
          text: displayNameForDir(item, base),
          collapsed: true,
          items: children,
        })
      }
    } else if (item.endsWith('.md')) {
      result.push({
        text: fileTitle(item),
        link: `${base}${item.replace(/\.md$/, '')}`,
      })
    }
  })

  return result
}

function generateSidebar() {
  const sidebar: Record<string, Array<any>> = {
    '/': [],
  }

  ;(SITE_SECTIONS as SiteSection[]).forEach((section) => {
    const fullPath = path.join(process.cwd(), section.dir)
    if (!fs.existsSync(fullPath)) return
    sidebar[`/${section.dir}/`] = getSidebarItems(fullPath, `/${section.dir}/`)
  })

  return sidebar
}
```

Keep the existing `getGitTimestampWithFollow` and `defineConfig` export, but update metadata:

```ts
export default defineConfig({
  title: 'Easton Notes',
  description: '面向前端、服务端与 Agent 应用开发的个人技术知识库',
  ignoreDeadLinks: true,
  lastUpdated: true,
  // keep existing head, transformPageData, and themeConfig shape
})
```

- [ ] **Step 2: Type-check VitePress config through build**

Run:

```bash
npm run docs:build
```

Expected: this may fail because `scripts/generate-dashboard.cjs` still points at old directories, but `.vitepress/config.mts` should not throw TypeScript or runtime import errors. If it fails before dashboard generation, fix the config before continuing.

- [ ] **Step 3: Commit config generation change**

Run:

```bash
git add .vitepress/config.mts
git commit -m "feat: generate docs navigation from site structure"
```

Expected: commit succeeds.

## Task 4: Replace Dashboard With Compact Directory Homepage

**Files:**
- Modify: `scripts/generate-dashboard.cjs`
- Generated: `index.md`

- [ ] **Step 1: Replace dashboard script with directory generator**

Rewrite `scripts/generate-dashboard.cjs` around the shared config:

```js
const fs = require('fs')
const path = require('path')
const {
  SITE_SECTIONS,
  IGNORE_NAMES,
  childPath,
} = require('../site.config.cjs')

const ROOT = path.resolve(__dirname, '..')

function shouldIgnore(item) {
  return IGNORE_NAMES.has(item) || item.startsWith('.') || item.endsWith('.cpp') || item.endsWith('.exe')
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function fileToLink(absPath) {
  return '/' + path.relative(ROOT, absPath).replace(/\\/g, '/').replace(/\.md$/, '')
}

function sortEntries(items, dir) {
  return items.sort((a, b) => {
    const aPath = path.join(dir, a)
    const bPath = path.join(dir, b)
    const aIsDir = fs.existsSync(aPath) && fs.statSync(aPath).isDirectory()
    const bIsDir = fs.existsSync(bPath) && fs.statSync(bPath).isDirectory()
    if (aIsDir && !bIsDir) return -1
    if (!aIsDir && bIsDir) return 1
    return a.localeCompare(b)
  })
}

function findFirstMarkdownFile(dir) {
  if (!fs.existsSync(dir)) return null
  const items = sortEntries(fs.readdirSync(dir).filter((item) => !shouldIgnore(item)), dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (!stat.isDirectory() && item.endsWith('.md')) return fullPath
  }

  for (const item of items) {
    const fullPath = path.join(dir, item)
    if (fs.statSync(fullPath).isDirectory()) {
      const found = findFirstMarkdownFile(fullPath)
      if (found) return found
    }
  }

  return null
}

function countMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return 0
  return fs.readdirSync(dir).reduce((count, item) => {
    if (shouldIgnore(item)) return count
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) return count + countMarkdownFiles(fullPath)
    return count + (item.endsWith('.md') ? 1 : 0)
  }, 0)
}

function renderChild(section, child) {
  const relativeDir = childPath(section, child)
  const fullDir = path.join(ROOT, relativeDir)
  const firstFile = findFirstMarkdownFile(fullDir)
  const count = countMarkdownFiles(fullDir)
  const href = firstFile ? fileToLink(firstFile) : `/${relativeDir}/`
  const disabledClass = count === 0 ? ' is-empty' : ''
  const meta = count > 0 ? `${count} 篇` : '待补充'
  const hint = child.contributionHint ? `<span class="home-link-hint">${escapeHtml(child.contributionHint)}</span>` : ''

  return `<a class="home-link${disabledClass}" href="${escapeHtml(href)}">
    <span>
      <strong>${escapeHtml(child.title)}</strong>
      <small>${escapeHtml(child.description)}</small>
      ${hint}
    </span>
    <em>${escapeHtml(meta)}</em>
  </a>`
}

function renderSection(section) {
  const links = section.children.map((child) => renderChild(section, child)).join('\\n')

  return `<section class="home-section">
    <div class="home-section-head">
      <p>${escapeHtml(section.navTitle || section.title)}</p>
      <h2>${escapeHtml(section.title)}</h2>
      <span>${escapeHtml(section.description)}</span>
    </div>
    <div class="home-links">
      ${links}
    </div>
  </section>`
}

function generateDashboard() {
  const sections = SITE_SECTIONS.map(renderSection).join('\\n')

  const content = `---
layout: doc
---

<script setup>
import { onMounted, onUnmounted } from 'vue'
onMounted(() => document.body.classList.add('homepage'))
onUnmounted(() => document.body.classList.remove('homepage'))
</script>

<div class="home-shell">
  <header class="home-hero">
    <p class="home-kicker">Study Notes</p>
    <h1>Easton Notes</h1>
    <p class="home-subtitle">面向前端、服务端与 Agent 应用开发的个人技术知识库。</p>
  </header>

  <div class="home-grid">
    ${sections}
  </div>
</div>
`

  fs.writeFileSync(path.join(ROOT, 'index.md'), content)
  console.log('Directory homepage generated at index.md')
}

generateDashboard()
```

- [ ] **Step 2: Generate homepage**

Run:

```bash
node scripts/generate-dashboard.cjs
```

Expected output:

```text
Directory homepage generated at index.md
```

- [ ] **Step 3: Inspect generated homepage**

Run:

```bash
sed -n '1,220p' index.md
```

Expected: `index.md` contains `home-shell`, four generated sections, and no terminal animation CSS.

- [ ] **Step 4: Commit dashboard generator and generated homepage**

Run:

```bash
git add scripts/generate-dashboard.cjs index.md
git commit -m "feat: simplify homepage into directory index"
```

Expected: commit succeeds.

## Task 5: Align Theme CSS With the Simpler UI

**Files:**
- Modify: `.vitepress/theme/custom.css`

- [ ] **Step 1: Add homepage CSS**

Append this section to `.vitepress/theme/custom.css`:

```css
/* ---------- Directory Homepage ---------- */
body.homepage .VPDoc .container,
body.homepage .VPDoc .content,
body.homepage .VPDoc .content-container {
  max-width: none !important;
  padding: 0 !important;
}

body.homepage .VPDoc .aside,
body.homepage .VPDocFooter,
body.homepage .VPLastUpdated {
  display: none !important;
}

body.homepage .VPDoc,
body.homepage .vp-doc {
  padding: 0 !important;
}

.home-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 44px 24px 64px;
}

.home-hero {
  margin-bottom: 28px;
}

.home-kicker {
  margin: 0 0 10px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
}

.home-hero h1 {
  margin: 0;
  font-size: 38px;
  line-height: 1.15;
  letter-spacing: 0;
}

.home-subtitle {
  max-width: 680px;
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  font-size: 16px;
  line-height: 1.8;
}

.home-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.home-section {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-elv);
  padding: 20px;
}

.home-section-head {
  margin-bottom: 16px;
}

.home-section-head p {
  margin: 0 0 6px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
}

.home-section-head h2 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 22px;
  line-height: 1.25;
}

.home-section-head span {
  display: block;
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.home-links {
  display: grid;
  gap: 10px;
}

.home-link {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 13px 14px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.home-link:hover {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-soft);
}

.home-link strong {
  display: block;
  font-size: 15px;
  line-height: 1.4;
}

.home-link small,
.home-link-hint {
  display: block;
  margin-top: 4px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.home-link-hint {
  color: var(--vp-c-brand-1);
}

.home-link em {
  flex: none;
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-style: normal;
  line-height: 1.8;
}

.home-link.is-empty {
  opacity: 0.72;
}

@media (max-width: 760px) {
  .home-shell {
    padding: 32px 18px 48px;
  }

  .home-hero h1 {
    font-size: 32px;
  }

  .home-grid {
    grid-template-columns: 1fr;
  }

  .home-link {
    flex-direction: column;
    gap: 6px;
  }
}
```

- [ ] **Step 2: Reduce document heading gradient**

Replace the `.vp-doc h1` rule in `.vitepress/theme/custom.css` with:

```css
.vp-doc h1 {
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.15;
  color: var(--vp-c-text-1);
}
```

Expected: headings are simpler and no longer use a gradient text effect.

- [ ] **Step 3: Commit theme changes**

Run:

```bash
git add .vitepress/theme/custom.css
git commit -m "style: align docs theme with directory homepage"
```

Expected: commit succeeds.

## Task 6: Update README for Structure and Contributions

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace README content**

Replace `README.md` with:

```markdown
# Easton Notes

一个基于 VitePress 的个人技术知识库，面向前端、服务端、Agent 应用开发和个人开发常用资料整理。

## 本地运行

安装依赖后启动开发服务：

```bash
npm run docs:dev
```

这个命令会先重新生成首页 `index.md`，再启动 VitePress。

生产构建：

```bash
npm run docs:build
```

本地预览构建产物：

```bash
npm run docs:preview
```

## 目录结构

```text
frontend/
  knowledge/    # 前端知识八股
  interview/    # 前端面经
  resources/    # 前端优质好文项目

backend/
  knowledge/    # 服务端知识八股
  interview/    # 服务端面经
  resources/    # 服务端优质好文项目

agent/
  knowledge/    # Agent 应用开发知识八股
  interview/    # Agent 应用开发面经
  resources/    # Agent 应用开发优质好文项目

dev/
  conventions/  # 开发规范
  linux/        # Linux 常用命令
  git/          # Git 基础
  tools/        # 工具配置
  notes/        # 随手记
```

站点导航、侧边栏和首页入口由 `site.config.cjs` 统一描述。新增一级方向或栏目时，先更新 `site.config.cjs`，再新增对应目录。

## 新增笔记

1. 选择合适目录，例如 `frontend/knowledge/React/`。
2. 新增 Markdown 文件，文件名使用清晰标题，可带数字前缀控制排序。
3. 运行 `npm run docs:dev` 重新生成首页并检查侧边栏。
4. 提交前运行 `npm run docs:build`。

## 贡献优质好文项目

优质好文项目放在各方向的 `resources/` 目录下，例如：

```text
frontend/resources/
backend/resources/
agent/resources/
```

推荐新增文章使用这个结构：

```markdown
# 推荐标题

## 链接

- 原文或项目：<https://example.com>

## 推荐理由

用 2-5 句话说明它解决了什么问题、适合谁读、为什么值得收录。

## 标签

- React
- 工程化
- 性能优化
```

请避免提交：

- 没有推荐理由的链接堆叠。
- 明显重复或质量较低的内容。
- 与当前目录结构无关的文件。
- 未经说明的大规模目录调整。

## 常见维护点

- 首页生成：`scripts/generate-dashboard.cjs`
- 站点信息架构：`site.config.cjs`
- VitePress 配置：`.vitepress/config.mts`
- 主题样式：`.vitepress/theme/custom.css`

如果新增文件或调整目录后页面没有出现，重启 `npm run docs:dev`。
```

- [ ] **Step 2: Commit README update**

Run:

```bash
git add README.md
git commit -m "docs: document notes structure and contribution flow"
```

Expected: commit succeeds.

## Task 7: Final Build Verification and Cleanup

**Files:**
- Generated/checked: `index.md`
- Checked: `.vitepress/dist/**`

- [ ] **Step 1: Regenerate and build**

Run:

```bash
npm run docs:build
```

Expected: build succeeds. `index.md` is regenerated from `scripts/generate-dashboard.cjs`.

- [ ] **Step 2: Inspect generated homepage links**

Run:

```bash
rg -n "href=\"/(frontend|backend|agent|dev)" index.md
```

Expected: homepage contains links for the four primary sections. Empty `backend` and `agent` child categories may link to their category paths until content is added.

- [ ] **Step 3: Check old top-level directories**

Run:

```bash
find Frontend Leetcode Misc -maxdepth 2 -type f -name '*.md'
```

Expected: command prints no files. If it errors because directories do not exist, that is acceptable.

- [ ] **Step 4: Review status**

Run:

```bash
git status --short
```

Expected: only intended generated build artifacts or no changes. If `.vitepress/dist` changes are tracked in this repo, decide whether to commit the build output based on the existing repo convention.

- [ ] **Step 5: Commit final generated changes if needed**

If `npm run docs:build` changed tracked files such as `index.md`, commit them:

```bash
git add index.md .vitepress/dist
git commit -m "chore: refresh generated docs output"
```

Expected: commit succeeds if there are generated tracked changes. If there are no changes, skip this step.

## Self-Review Notes

- Spec coverage: the plan covers shared IA, directory migration, homepage UI, theme simplification, README contribution docs, and build verification.
- Unresolved-marker scan: no task uses unresolved markers; empty future sections are explicitly allowed for `backend`, `agent`, and `dev/conventions`.
- Type consistency: shared config is CommonJS so both `.vitepress/config.mts` and `scripts/generate-dashboard.cjs` can consume it.
- Risk: moving every Markdown file changes URLs as approved. Internal Markdown links, if any, may need a follow-up pass after build if VitePress reports dead links.
