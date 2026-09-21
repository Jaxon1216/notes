import { validateLinkEntries, type LinkEntry } from '@/lib/link-entry'

export type FriendLink = LinkEntry & {
  trackingEvent?: string
}

// 友链以互链关系为前提，因此不从资源推荐或外部搜索结果自动同步。
// 新增时请同时确认对方站点可访问、内容定位清晰且已放置本站链接。
export const FRIEND_LINKS: FriendLink[] = [
  {
    title: 'Magic Resume',
    scenario: '准备求职简历、针对目标岗位优化经历，或练习模拟面试时。',
    description:
      'AI 原生简历工作台：提供可审核的岗位化修改建议，支持模板排版、双语、模拟面试，以及 PDF / JSON 导出。',
    href: 'https://magic-resume.cn',
    trackingEvent: 'magic_resume_link_click',
  },
]

export function validateFriendLinks(links: readonly FriendLink[]) {
  return validateLinkEntries(links, 'friendLinks')
}
