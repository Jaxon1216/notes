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
  {
    title: "🍔hamburger's Notebook",
    scenario: '关注前端工程实践与界面设计细节，想看个人化的探索与折腾时。',
    description: '一位前端开发者的个人博客，记录前端工程实践与设计探索。',
    href: 'https://woleigefou.xyz',
    kind: 'blog',
  },
  {
    title: 'kunxing-blog',
    scenario: '深入学习 Redis 数据类型、持久化与分布式锁等后端存储主题时。',
    description: '困醒的个人学习博客，聚焦 Redis 等后端存储主题的系统笔记与实践复盘。',
    href: 'https://kunxing-blog.top',
    kind: 'blog',
  },
  {
    title: "acye's blog",
    scenario: '研究 Node.js、前端工程化与 CI/CD 等全栈工程主题时。',
    description:
      'acye 的个人技术博客，覆盖前端工程化、Node.js、BFF 与 AI Coding 等主题。',
    href: 'https://ye-guan-xing.github.io/',
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
