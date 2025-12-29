import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// Directory name mapping (English -> Chinese)
const DIR_MAPPING = {
  'HDU': '数据结构',
  'Leetcode': 'Leetcode',
  'PTA': 'PTA',
  'STL': 'STL',
  'JavaScript': 'JavaScript',
  'CSS': 'CSS',
  'articles': '文章',
  'Miscellaneous': '杂项',
  'PurpleBook': '紫书',
  'TipsAndTricks': '技巧',
  'BinarySearch': '二分查找',
  'SlidingWindow': '滑动窗口',
  'DataStructure': '数据结构',
  'Intro': '入门题单',
  'String': '串',
  'SinglyLinkedList': '单向链表',
  'Stack': '栈',
  'StackAndQueue': '栈和队列',
  'Queue': '队列',
  'SequentialList': '顺序表',
  'Frontend': '前端',
  'cs-core': '计算机基础',
  'Misc': '其他',
  'dataStruct': '数据结构',
  'networks': '计算机网络',
  'os': '操作系统'
}

// Directories to ignore
const IGNORE = ['.vitepress', 'node_modules', '.git', 'scripts', 'package.json', 'package-lock.json', 'README.md', 'index.md', '.gitignore', '.DS_Store']

function getDisplayName(name: string): string {
  return DIR_MAPPING[name] || name
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
        dropdown.push({ text: getDisplayName(item), link: link })
      }
    }
  })
  
  return dropdown
}

// Auto-generate navigation from root directories
function generateNav() {
  const root = process.cwd()
  const items = fs.readdirSync(root)
  const nav: Array<any> = [{ text: '首页', link: '/' }]

  // Sort directories
  const dirs = items.filter(item => {
    if (IGNORE.includes(item) || item.startsWith('.')) return false
    const fullPath = path.join(root, item)
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()
  }).sort()

  dirs.forEach(dir => {
    const dropdownItems = getDirDropdownItems(dir)
    const firstLink = getLinkForDir(dir)
    
    if (firstLink === '/') return // Skip empty directories

    if (dropdownItems.length > 0) {
      // Has subdirectories, create dropdown menu
      nav.push({
        text: getDisplayName(dir),
        items: [
          { text: '概览', link: firstLink },
          ...dropdownItems
        ]
      })
    } else {
      // No subdirectories, simple link
      nav.push({
        text: getDisplayName(dir),
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
          text: getDisplayName(item),
          collapsed: true,
          items: children
        })
      }
    } else if (item.endsWith('.md')) {
      let text = item.replace('.md', '')
      if (text === 'note') text = '笔记'
      if (text === 'README') text = '简介'
      
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
  
  // Default sidebar for root
  sidebar['/'] = []

  const items = fs.readdirSync(root)
  
  items.forEach(item => {
    if (IGNORE.includes(item) || item.startsWith('.')) return
    const fullPath = path.join(root, item)
    if (!fs.existsSync(fullPath)) return
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      sidebar[`/${item}/`] = getSidebarItems(fullPath, `/${item}/`)
    }
  })
  
  return sidebar
}

export default defineConfig({
  title: "学习笔记",
  description: "Personal Algorithm & CPP Notes",
  ignoreDeadLinks: true, // Avoid build errors for missing links
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
      label: '页面导航'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  }
})
