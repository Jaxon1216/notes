import { defineConfig } from 'vitepress'
import { spawn } from 'child_process'
import { createRequire } from 'module'
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
  dir: string
  title: string
}

type SiteSection = {
  dir: string
  title: string
  navTitle?: string
  children: SiteChild[]
}

// Helper to find first MD file for nav links
function findFirstFile(dir: string): string | null {
  try {
    const items = fs.readdirSync(dir)
    // Sort items: lowercase first, then alphabetically
    items.sort((a, b) => {
      const aLower = a[0] === a[0].toLowerCase()
      const bLower = b[0] === b[0].toLowerCase()
      if (aLower && !bLower) return -1
      if (!aLower && bLower) return 1
      return a.localeCompare(b)
    })
    
    // First, try to find a direct MD file (prefer files over directories)
    for (const item of items) {
      if (shouldIgnore(item)) continue
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      if (!stat.isDirectory() && item.endsWith('.md')) {
        return fullPath
      }
    }
    
    // If no direct MD file, recurse into directories
    for (const item of items) {
      if (shouldIgnore(item)) continue
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        const found = findFirstFile(fullPath)
        if (found) return found
      }
    }
  } catch (e) {
    return null
  }
  return null
}

function shouldIgnore(item: string): boolean {
  return (
    item.startsWith('.') ||
    IGNORE_NAMES.has(item) ||
    item.endsWith('.cpp') ||
    item.endsWith('.exe')
  )
}

function getLinkForDir(dirName: string): string | null {
  const root = process.cwd()
  const fullPath = path.join(root, dirName)
  if (fs.existsSync(fullPath)) {
    const file = findFirstFile(fullPath)
    if (file) {
      return '/' + path.relative(root, file).replace(/\\/g, '/').replace(/\.md$/, '')
    }
  }
  return null
}

// Helper to get configured child directories for dropdown
function getDirDropdownItems(section: SiteSection): Array<{text: string, link: string}> {
  const root = process.cwd()
  const dropdown: Array<{text: string, link: string}> = []
  
  section.children.forEach(child => {
    const dirName = childPath(section, child)
    const itemPath = path.join(root, dirName)
    if (!fs.existsSync(itemPath) || !fs.statSync(itemPath).isDirectory()) return

    const link = getLinkForDir(dirName)
    if (link) dropdown.push({ text: child.title, link })
  })
  
  return dropdown
}

// Auto-generate navigation from the shared IA model.
function generateNav() {
  const root = process.cwd()
  const nav: Array<any> = [{ text: 'Home', link: '/' }]

  SITE_SECTIONS.forEach((section: SiteSection) => {
    const fullPath = path.join(root, section.dir)
    const sectionExists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()

    const dropdownItems = getDirDropdownItems(section)
    if (dropdownItems.length === 0) {
      const firstLink = sectionExists ? getLinkForDir(section.dir) : null

      nav.push({
        text: section.navTitle || section.title,
        link: firstLink || `/#${section.dir}`,
      })
      return
    }

    nav.push({
      text: section.navTitle || section.title,
      items: dropdownItems,
    })
  })

  return nav
}

function getSidebarTitle(base: string, item: string): string {
  const parts = base.split('/').filter(Boolean)
  const section = parts[0] ? findSectionByDir(parts[0]) : undefined
  if (!section) return item

  if (parts.length === 1) {
    const child = findChildByDir(section, item)
    if (child) return child.title
  }

  return item
}

function getSidebarItems(dir: string, base: string): Array<any> {
  const items = fs.readdirSync(dir)
  const result: Array<any> = []

  // Sort items: directories first, then files
  items.sort((a, b) => {
    const aPath = path.join(dir, a)
    const bPath = path.join(dir, b)
    const aIsDir = fs.statSync(aPath).isDirectory()
    const bIsDir = fs.statSync(bPath).isDirectory()
    if (aIsDir && !bIsDir) return -1
    if (!aIsDir && bIsDir) return 1
    return a.localeCompare(b)
  })

  items.forEach(item => {
    if (shouldIgnore(item) || item === 'draft.cpp') return
    
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      const children = getSidebarItems(fullPath, `${base}${item}/`)
      // Only add directory if it has children
      if (children.length > 0) {
        result.push({
          text: getSidebarTitle(base, item),
          collapsed: true,
          items: children
        })
      }
    } else if (item.endsWith('.md')) {
      result.push({
        text: fileTitle(item),
        link: `${base}${item.replace('.md', '')}`
      })
    }
  })
  return result
}

function generateSidebar() {
  const root = process.cwd()
  
  const sidebar: Record<string, Array<any>> = {}
  
  sidebar['/'] = []

  SITE_SECTIONS.forEach((section: SiteSection) => {
    const fullPath = path.join(root, section.dir)
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) return

    const items = getSidebarItems(fullPath, `/${section.dir}/`)
    if (items.length > 0) sidebar[`/${section.dir}/`] = items
  })
  
  return sidebar
}

function getGitTimestampWithFollow(file: string): Promise<number> {
  return new Promise((resolve) => {
    const cwd = process.cwd()
    const child = spawn(
      'git',
      ['log', '-1', '--follow', '--pretty=%ai', '--', path.relative(cwd, file)],
      { cwd }
    )
    let output = ''
    child.stdout.on('data', (d: Buffer) => (output += String(d)))
    child.on('close', () => resolve(+new Date(output) || 0))
    child.on('error', () => resolve(0))
  })
}

export default defineConfig({
  title: "Easton Notes",
  description: "面向前端、服务端与 Agent 应用开发的个人技术知识库",
  ignoreDeadLinks: true, // Avoid build errors for missing links
  lastUpdated: true,
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      href: 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap',
      rel: 'stylesheet'
    }],
  ],
  
  transformPageData: async (pageData) => {
    const filePath = path.join(process.cwd(), pageData.relativePath)
    const timestamp = await getGitTimestampWithFollow(filePath)
    if (timestamp) {
      pageData.lastUpdated = timestamp
    }
  },

  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: generateNav(),
    sidebar: generateSidebar(),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Jaxon1216/cpp-notes' }
    ],
    outline: {
      level: [2, 3],
      label: 'Page Navigation'
    },
    lastUpdated: {
      text: 'Last Updated',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  }
})
