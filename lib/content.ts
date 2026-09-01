import fs from 'node:fs'
import path from 'node:path'
import { cache } from 'react'

import {
  IGNORE_NAMES,
  SITE_SECTIONS,
  childPath,
  type SiteChild,
  type SiteSection,
} from '@/site.config'

const CONTENT_ABS_ROOT = path.join(process.cwd(), 'content', 'docs')

export type ChildStat = {
  child: SiteChild
  href: string
  fileCount: number
}

export type SectionStat = {
  section: SiteSection
  href: string
  fileCount: number
  childCount: number
  children: ChildStat[]
}

export type HomeData = {
  sections: SectionStat[]
  totalFiles: number
  activeSections: number
}

function isPlaceholderDoc(file: string) {
  const source = fs.readFileSync(file, 'utf8')
  return /^---\r?\n[\s\S]*?^placeholder:\s*true\s*$/m.test(source)
}

function shouldIgnore(name: string) {
  return (
    name.startsWith('.') ||
    IGNORE_NAMES.has(name) ||
    name.endsWith('.cpp') ||
    name.endsWith('.exe')
  )
}

function sortNames(a: string, b: string) {
  return a.localeCompare(b, 'zh-CN')
}

export function getMdFiles(dir: string, files: string[] = []) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return files

  const names = fs.readdirSync(dir).sort(sortNames)

  for (const name of names) {
    if (shouldIgnore(name)) continue

    const fullPath = path.join(dir, name)
    const stat = fs.statSync(fullPath)

    if (stat.isFile() && /\.mdx?$/.test(name)) {
      files.push(fullPath)
    }
  }

  for (const name of names) {
    if (shouldIgnore(name)) continue

    const fullPath = path.join(dir, name)

    if (fs.statSync(fullPath).isDirectory()) {
      getMdFiles(fullPath, files)
    }
  }

  return files
}

export function toDocHref(absPath: string) {
  const relativePath = path
    .relative(CONTENT_ABS_ROOT, absPath)
    .replace(/\\/g, '/')
    .replace(/\.mdx?$/, '')

  return `/docs/${relativePath}`
}

function childStats(
  section: SiteSection,
  child: SiteChild,
  routeFiles: string[],
  contentFiles: string[],
): ChildStat {
  const relativeDir = childPath(section, child)
  const childRouteFiles = routeFiles.filter((file) =>
    file.startsWith(`${relativeDir}/`),
  )
  const childContentFiles = contentFiles.filter((file) =>
    file.startsWith(`${relativeDir}/`),
  )

  return {
    child,
    href: childRouteFiles[0]
      ? `/docs/${childRouteFiles[0].replace(/\.mdx?$/, '')}`
      : '',
    fileCount: childContentFiles.length,
  }
}

function sectionStats(
  section: SiteSection,
  routeFiles: string[],
  contentFiles: string[],
): SectionStat {
  const sectionRouteFiles = routeFiles.filter((file) =>
    file.startsWith(`${section.dir}/`),
  )
  const sectionContentFiles = contentFiles.filter((file) =>
    file.startsWith(`${section.dir}/`),
  )
  const children = section.children.map((child) =>
    childStats(section, child, sectionRouteFiles, sectionContentFiles),
  )

  return {
    section,
    href: sectionRouteFiles[0]
      ? `/docs/${sectionRouteFiles[0].replace(/\.mdx?$/, '')}`
      : '',
    fileCount: sectionContentFiles.length,
    childCount: section.children.length,
    children,
  }
}

export const getHomeData = cache(function getHomeData(): HomeData {
  const files = getMdFiles(CONTENT_ABS_ROOT)
  const routeFiles = files.map((file) =>
    path.relative(CONTENT_ABS_ROOT, file).replace(/\\/g, '/'),
  )
  const contentFiles = files
    .filter((file) => !isPlaceholderDoc(file))
    .map((file) => path.relative(CONTENT_ABS_ROOT, file).replace(/\\/g, '/'))
  const sections = SITE_SECTIONS.map((section) =>
    sectionStats(section, routeFiles, contentFiles),
  )
  const totalFiles = sections.reduce((sum, section) => sum + section.fileCount, 0)
  const activeSections = sections.filter((section) => section.fileCount > 0).length

  return {
    sections,
    totalFiles,
    activeSections,
  }
})
