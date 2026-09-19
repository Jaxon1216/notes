import { validateLinkEntries, type LinkEntry } from '@/lib/link-entry'

export type ResourceKind = 'blog' | 'project' | 'tool'

export type ResourceEntry = LinkEntry & {
  kind: ResourceKind
}

export const RESOURCE_KIND_LABELS: Record<ResourceKind, string> = {
  blog: '优质博客',
  project: '项目',
  tool: '工具',
}

export const RESOURCE_ENTRIES: ResourceEntry[] = [
  {
    title: '江旭的技术博客',
    scenario: '系统学习前端、Agent 与工程实践，或寻找可深入阅读的中文技术文章时。',
    description: '持续整理浏览器、JavaScript、Agent 与工程实践等主题的技术文章。',
    href: 'https://www.jiangxu.net/blog',
    kind: 'blog',
  },
]

export function filterResourceEntries(
  entries: readonly ResourceEntry[],
  kind: ResourceKind,
) {
  return entries.filter((entry) => entry.kind === kind)
}

export function validateResourceDirectory(
  entries: readonly ResourceEntry[],
) {
  return validateLinkEntries(entries, 'resources')
}
