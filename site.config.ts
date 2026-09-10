import path from 'node:path'

export const CONTENT_ROOT = 'content/docs'

export type SiteChild = {
  key: string
  dir: string
  title: string
  description: string
  contributionHint?: string
  children?: SiteChild[]
}

export type SiteSection = {
  key: string
  dir: string
  title: string
  navTitle?: string
  description: string
  children: SiteChild[]
}

export const SITE_SECTIONS: SiteSection[] = [
  {
    key: 'frontend',
    dir: 'frontend',
    title: '前端',
    navTitle: '前端',
    description: '沉淀 Web 框架、工程化、浏览器基础和前端项目实践。',
    children: [
      {
        key: 'tutorial',
        dir: 'tutorial',
        title: '教程',
        description: '系统讲解框架原理、浏览器机制、网络通信和工程实践。',
      },
      {
        key: 'bagu',
        dir: 'bagu',
        title: '八股',
        description: '前端高频题、手写题、回答重点和面试追问。',
      },
      {
        key: 'interview',
        dir: 'interview',
        title: '面经',
        description: '前端方向的真实面试过程、题目与复盘。',
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
        key: 'tutorial',
        dir: 'tutorial',
        title: '教程',
        description: '系统讲解服务端语言、网络、数据库、并发和工程实践。',
      },
      {
        key: 'bagu',
        dir: 'bagu',
        title: '八股',
        description: '服务端高频题、回答重点和面试追问。',
      },
      {
        key: 'interview',
        dir: 'interview',
        title: '面经',
        description: '服务端方向的真实面试过程、题目与复盘。',
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
        key: 'tutorial',
        dir: 'tutorial',
        title: '教程',
        description: 'Agent 应用开发的系统教程、学习路线和工程实践。',
      },
      {
        key: 'bagu',
        dir: 'bagu',
        title: '八股',
        description: 'Agent 应用开发与 LLM 原理的高频问答。',
      },
      {
        key: 'interview',
        dir: 'interview',
        title: '面经',
        description: 'Agent 与 AI 应用方向的真实面试过程、题目与复盘。',
      },
    ],
  },
  {
    key: 'algorithm',
    dir: 'algorithm',
    title: '算法',
    navTitle: '算法',
    description: '沉淀算法基础、C++ 常用知识和 LeetCode 刷题体系。',
    children: [
      {
        key: 'basics',
        dir: 'basics',
        title: '基础与 C++',
        description: '算法基础、STL、C++ 语法细节和常用模板。',
      },
      {
        key: 'leetcode',
        dir: 'leetcode',
        title: 'LeetCode 专题',
        description: '按题型和方法整理的刷题路线、题解和复盘。',
      },
    ],
  },
  {
    key: 'resources',
    dir: 'resources',
    title: '资源推荐',
    navTitle: '资源推荐',
    description: '按技术方向和资源类型筛选值得持续阅读与实践的内容。',
    children: [],
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
        title: '杂记与读书',
        description: '零散技巧、读书笔记和暂未归档的个人资料。',
      },
    ],
  },
]

export const IGNORE_NAMES = new Set([
  'node_modules',
  '.git',
  '.DS_Store',
  '.vitepress',
  'README.md',
  'meta.json',
])

export function sectionPath(section: SiteSection) {
  return section.dir
}

export function childPath(section: SiteSection, child: SiteChild) {
  return path.posix.join(section.dir, child.dir)
}

export function stripNumberPrefix(name: string) {
  return name.replace(/^\d+[-.]/, '')
}

export function fileTitle(fileName: string) {
  return stripNumberPrefix(fileName.replace(/\.mdx?$/, ''))
}

export function findSectionByDir(dir: string) {
  return SITE_SECTIONS.find((section) => section.dir === dir)
}

export function findChildByDir(section: SiteSection, dir: string) {
  return section.children.find((child) => child.dir === dir)
}
