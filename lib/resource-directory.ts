export type ResourceKind = 'articles' | 'projects'

export type ResourceSection = 'frontend' | 'backend' | 'agent'

export type ResourceEntry = {
  title: string
  href: string
  description: string
  recommendation: string
  tags: string[]
}

export type ResourceDirectoryData = {
  title: string
  articles: ResourceEntry[]
  projects: ResourceEntry[]
}

export const RESOURCE_DIRECTORIES: Record<ResourceSection, ResourceDirectoryData> = {
  frontend: {
    title: '前端优质好文项目',
    articles: [
      {
        title: '深入理解浏览器渲染原理',
        href: 'https://www.jiangxu.net/blog/browserRendering',
        description: 'HTML 解析、样式计算、布局分层、绘制合成与页面性能原理。',
        tags: ['浏览器', '性能'],
        recommendation: '从 HTML 解析到合成逐层串起渲染链路，适合把重排、重绘和 transform 的取舍放回完整上下文。',
      },
      {
        title: '深入理解事件循环',
        href: 'https://www.jiangxu.net/blog/eventLoop',
        description: '从浏览器进程、线程和消息队列重新理解异步执行。',
        tags: ['JavaScript', '异步'],
        recommendation: '不只背宏任务/微任务，而是回到浏览器线程和消息队列解释异步执行。',
      },
      {
        title: 'Promise 手撕教程',
        href: 'https://www.jiangxu.net/blog/promiseTutorial',
        description: '从状态机与回调队列出发拆解 Promise 链式调用。',
        tags: ['JavaScript', 'Promise'],
        recommendation: '从状态机和回调队列拆解链式调用，适合在阅读实现前建立前置知识。',
      },
    ],
    projects: [
      {
        title: 'TodoMVC 框架对比',
        href: 'https://github.com/Jaxon1216/todomvc',
        description: '同一 TodoMVC 业务在 Vanilla JS、Vue 与 React 中的实现对照。',
        tags: ['TypeScript', 'Vue', 'React'],
        recommendation: '同一个业务问题横向对照 Vanilla JS、Vue 和 React，便于理解框架的真实取舍。',
      },
      {
        title: '学习笔记站',
        href: 'https://github.com/Jaxon1216/notes',
        description: '基于 Next.js、Fumadocs 与 MDX 的个人技术知识库。',
        tags: ['Next.js', '文档'],
        recommendation: '当前站点的源码与内容工程实践，可结合本文档的导航、MDX 和检查链路阅读。',
      },
    ],
  },
  agent: {
    title: 'Agent 优质好文项目',
    articles: [
      {
        title: 'Prompt 优化的七条主线：会写、会推、会持续改',
        href: 'https://www.jiangxu.net/blog/prompt-engineering-techniques',
        description: '从前端开发者视角梳理 Prompt、Skill 和 AGENTS.md 的工程实践。',
        tags: ['Prompt', 'Agent'],
        recommendation: '把 Prompt、Skill、AGENTS.md 和 Vibe Coding 串成可落地的工程方法。',
      },
      {
        title: 'Claude Code 使用技巧',
        href: 'https://www.jiangxu.net/blog/tips-for-using-claudecode',
        description: '整理上下文管理、MCP 扩展和 Subagent 并行等进阶用法。',
        tags: ['Claude Code', 'MCP'],
        recommendation: '覆盖上下文管理、MCP 与 Subagent 协作，适合从日常使用升级到工作流设计。',
      },
    ],
    projects: [
      {
        title: '项目分析 Skill',
        href: 'https://github.com/Jaxon1216/interview-analyzer-skill',
        description: '自动分析项目结构并输出学习路线、难点与亮点的 Agent Skill。',
        tags: ['Python', 'Shell', 'Skill'],
        recommendation: '自动分析项目结构并输出学习路线、难点与亮点，是 Skill 工程化的可读样例。',
      },
      {
        title: 'GenBI 智能数据分析平台',
        href: 'https://github.com/Jaxon1216/genBI',
        description: '支持自然语言生成图表的智能数据分析平台。',
        tags: ['React', 'Spring Boot', 'AI'],
        recommendation: '以自然语言生成图表为目标，展示 AI 能力嵌入业务系统的端到端形态。',
      },
    ],
  },
  backend: {
    title: '服务端优质好文项目',
    articles: [],
    projects: [
      {
        title: 'GenBI 智能数据分析平台',
        href: 'https://github.com/Jaxon1216/genBI',
        description: '以 Spring Boot 为后端基础的智能数据分析项目。',
        tags: ['Spring Boot', 'AI', '数据分析'],
        recommendation: '可从服务端 API、数据处理和 AI 编排的边界切入，后续补充架构复盘文章。',
      },
    ],
  },
}

export function validateResourceDirectory(
  directories: Record<ResourceSection, ResourceDirectoryData>,
) {
  const errors: string[] = []

  for (const [section, directory] of Object.entries(directories) as [
    ResourceSection,
    ResourceDirectoryData,
  ][]) {
    for (const kind of ['articles', 'projects'] as const) {
      for (const [index, entry] of directory[kind].entries()) {
        const prefix = `${section}.${kind}[${index}]`

        if (!entry.title.trim()) errors.push(`${prefix} 缺少 title`)
        if (!entry.href.startsWith('https://')) errors.push(`${prefix} 缺少 href`)
        if (!entry.description.trim()) errors.push(`${prefix} 缺少 description`)
        if (!entry.recommendation.trim()) errors.push(`${prefix} 缺少 recommendation`)
        if (!entry.tags.length) errors.push(`${prefix} 缺少 tags`)
      }
    }
  }

  return errors
}
