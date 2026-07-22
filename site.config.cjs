const path = require('path')

const SITE_SECTIONS = [
  {
    key: 'frontend',
    dir: 'frontend',
    title: '前端',
    navTitle: '前端',
    description: '沉淀 Web 框架、工程化、浏览器基础和前端项目实践。',
    children: [
      {
        key: 'knowledge',
        dir: 'knowledge',
        title: '知识八股',
        description: '框架原理、浏览器机制、手写题和高频基础知识。',
      },
      {
        key: 'interview',
        dir: 'interview',
        title: '面经',
        description: '面试复盘、题目整理和表达素材。',
      },
      {
        key: 'resources',
        dir: 'resources',
        title: '优质好文项目',
        description: '值得精读的文章、开源项目和实战案例。',
        contributionHint: '欢迎通过 PR 补充优质文章和项目。',
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
        key: 'knowledge',
        dir: 'knowledge',
        title: '知识八股',
        description: '网络、数据库、缓存、并发和系统设计基础。',
      },
      {
        key: 'interview',
        dir: 'interview',
        title: '面经',
        description: '服务端方向的面试复盘与问题清单。',
      },
      {
        key: 'resources',
        dir: 'resources',
        title: '优质好文项目',
        description: '后端工程与架构方向的优质内容收藏。',
        contributionHint: '欢迎通过 PR 补充优质文章和项目。',
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
    key: 'agent',
    dir: 'agent',
    title: 'Agent 应用开发',
    navTitle: 'Agent',
    description: '记录 Agent 产品、工具调用、工作流和应用开发经验。',
    children: [
      {
        key: 'knowledge',
        dir: 'knowledge',
        title: '知识八股',
        description: 'LLM、RAG、工具调用、多 Agent 和评测基础。',
      },
      {
        key: 'interview',
        dir: 'interview',
        title: '面经',
        description: 'Agent 与 AI 应用方向的面试材料。',
      },
      {
        key: 'resources',
        dir: 'resources',
        title: '优质好文项目',
        description: 'Agent 应用、框架、案例和工程实践推荐。',
        contributionHint: '欢迎通过 PR 补充优质文章和项目。',
      },
    ],
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

const IGNORE_NAMES = new Set([
  'node_modules',
  '.git',
  '.DS_Store',
  '.vitepress',
  'README.md',
])

function sectionPath(section) {
  return section.dir
}

function childPath(section, child) {
  return path.posix.join(section.dir, child.dir)
}

function stripNumberPrefix(name) {
  return name.replace(/^\d+[-.]/, '')
}

function fileTitle(fileName) {
  return stripNumberPrefix(fileName.replace(/\.md$/, ''))
}

function findSectionByDir(dir) {
  return SITE_SECTIONS.find((section) => section.dir === dir)
}

function findChildByDir(section, dir) {
  return section.children.find((child) => child.dir === dir)
}

module.exports = {
  SITE_SECTIONS,
  IGNORE_NAMES,
  sectionPath,
  childPath,
  stripNumberPrefix,
  fileTitle,
  findSectionByDir,
  findChildByDir,
}
