import { defineConfig } from 'vitepress'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

// ====== 白名单：只有列在这里的顶层文件夹才会出现在导航栏和侧边栏 ======
const SHOW_DIRS = [
  'Leetcode',
  'Frontend',
  'cs-core',
  'Projects',
  'Misc',
  // 'openclaw',   // 取消注释即可公开
  // 'img',        // 取消注释即可公开
]

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
      if (item.startsWith('.') || item.endsWith('.cpp') || item.endsWith('.exe')) continue
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      if (!stat.isDirectory() && item.endsWith('.md')) {
        return fullPath
      }
    }
    
    // If no direct MD file, recurse into directories
    for (const item of items) {
      if (item.startsWith('.') || item.endsWith('.cpp') || item.endsWith('.exe')) continue
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

function getLinkForDir(dirName: string): string {
  const root = process.cwd()
  const fullPath = path.join(root, dirName)
  if (fs.existsSync(fullPath)) {
    const file = findFirstFile(fullPath)
    if (file) {
      return '/' + path.relative(root, file).replace(/\\/g, '/').replace(/\.md$/, '')
    }
  }
  return '/'
}

// Helper to get direct children directories for dropdown
function getDirDropdownItems(dirName: string): Array<{text: string, link: string}> {
  const root = process.cwd()
  const fullPath = path.join(root, dirName)
  if (!fs.existsSync(fullPath)) return []
  
  const items = fs.readdirSync(fullPath)
  const dropdown: Array<{text: string, link: string}> = []
  
  items.forEach(item => {
    if (item.startsWith('.') || item.endsWith('.cpp') || item.endsWith('.exe')) return
    const itemPath = path.join(fullPath, item)
    const stat = fs.statSync(itemPath)
    
    if (stat.isDirectory()) {
      const link = getLinkForDir(path.join(dirName, item))
      if (link !== '/') {
        dropdown.push({ text: item, link: link })
      }
    }
  })
  
  return dropdown
}

// Auto-generate navigation from root directories
function generateNav() {
  const root = process.cwd()
  const items = fs.readdirSync(root)
  const nav: Array<any> = [{ text: 'Home', link: '/' }]

  const dirs = SHOW_DIRS.filter(dir => {
    const fullPath = path.join(root, dir)
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()
  })

  dirs.forEach(dir => {
    const dropdownItems = getDirDropdownItems(dir)
    const firstLink = getLinkForDir(dir)
    
    if (firstLink === '/') return // Skip empty directories

    if (dropdownItems.length > 0) {
      // Has subdirectories, create dropdown menu
      nav.push({
        text: dir,
        items: [
          { text: 'Overview', link: firstLink },
          ...dropdownItems
        ]
      })
    } else {
      // No subdirectories, simple link
      nav.push({
        text: dir,
        link: firstLink
      })
    }
  })

  return nav
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
    if (item.startsWith('.') || item === 'node_modules' || item === 'draft.cpp' || item.endsWith('.cpp') || item.endsWith('.exe')) return
    
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      const children = getSidebarItems(fullPath, `${base}${item}/`)
      // Only add directory if it has children
      if (children.length > 0) {
        result.push({
          text: item,
          collapsed: true,
          items: children
        })
      }
    } else if (item.endsWith('.md')) {
      let text = item.replace('.md', '')
      
      result.push({
        text: text,
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

  SHOW_DIRS.forEach(dir => {
    const fullPath = path.join(root, dir)
    if (!fs.existsSync(fullPath)) return
    sidebar[`/${dir}/`] = getSidebarItems(fullPath, `/${dir}/`)
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
  title: "Study Notes",
  description: "Personal Algorithm & CPP Notes",
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
