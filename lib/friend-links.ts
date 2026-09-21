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
  {
    title: 'GoClub',
    scenario: '准备 Go 后端面试、系统梳理八股与真题，或想参与开源共建时。',
    description:
      '社区共同维护的 Go 学习与面试知识库，汇总八股总结、面试真题、学习资源与配套文章。',
    href: 'https://goclub.space',
    trackingEvent: 'goclub_link_click',
  },
  {
    title: "🍔hamburger's Notebook",
    scenario: '关注前端工程实践与界面设计细节，想看个人化的探索与折腾时。',
    description: '一位前端开发者的个人博客，记录前端工程实践与设计探索。',
    href: 'https://woleigefou.xyz',
    trackingEvent: 'hamburger_notebook_link_click',
  },
  {
    title: 'kunxing-blog',
    scenario: '深入学习 Redis 数据类型、持久化与分布式锁等后端存储主题时。',
    description: '困醒的个人学习博客，聚焦 Redis 等后端存储主题的系统笔记与实践复盘。',
    href: 'https://kunxing-blog.top',
    trackingEvent: 'kunxing_blog_link_click',
  },
  {
    title: "acye's blog",
    scenario: '研究 Node.js、前端工程化与 CI/CD 等全栈工程主题时。',
    description:
      'acye 的个人技术博客，覆盖前端工程化、Node.js、BFF 与 AI Coding 等主题。',
    href: 'https://ye-guan-xing.github.io/',
    trackingEvent: 'acye_blog_link_click',
  },
]

export function validateFriendLinks(links: readonly FriendLink[]) {
  return validateLinkEntries(links, 'friendLinks')
}
