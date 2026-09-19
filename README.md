# Easton Notes

一个基于 [Next.js](https://nextjs.org/) + [Fumadocs](https://www.fumadocs.dev/) 的个人技术知识库，面向前端、服务端、算法、Agent 应用开发和个人开发常用资料整理。

## 本地运行

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

本地预览构建产物：

```bash
npm run start
```

## 目录结构

内容统一放在 `content/docs/` 下：

```text
content/docs/
  frontend/
    tutorial/     # 前端教程
    bagu/         # 前端八股
    interview/    # 前端面经

  backend/
    tutorial/     # 服务端教程
    bagu/         # 服务端八股
    interview/    # 服务端面经

  agent/
    tutorial/     # Agent 教程
    bagu/         # Agent 与 LLM 八股
      agent/      # Agent 应用开发、RAG、工具调用和协议
      llm/        # LLM 原理、模型机制和微调
    interview/    # Agent 应用开发面经

  algorithm/
    basics/       # 算法基础、STL 和 C++ 常用知识
    leetcode/     # LeetCode 专题与刷题复盘

  resources/      # 资源中心：文章、项目、工具与友情链接

  dev/
    conventions/  # 开发规范
    linux/        # Linux 常用命令
    git/          # Git 基础
    tools/        # 工具配置
    notes/        # 杂记与读书
```

站点信息架构由 `site.config.ts` 统一维护。新增一级方向或调整栏目时，先更新 `site.config.ts`，再新增对应目录和 Fumadocs `meta.json`。

## 路由

- 首页：`/`，源码在 `app/page.tsx`。
- 文档总览：`/docs`，内容在 `content/docs/index.mdx`。
- 文档页面：`/docs/<section>/<path>`，由 `app/docs/[[...slug]]/page.tsx` 渲染。

## 新增笔记

1. 选择合适目录，例如 `content/docs/frontend/tutorial/React/`、`content/docs/agent/bagu/agent/` 或 `content/docs/algorithm/leetcode/`。
2. 新增 Markdown 或 MDX 文件，文件名使用清晰标题，可带数字前缀控制排序，例如 `01-核心概念.md`。
3. 文章内图片放在当前专题附近的 `img/` 目录并使用相对路径引用；截图优先使用 WebP，图示优先使用 SVG。
4. 如需调整侧边栏展示顺序或目录中文名，编辑对应目录下的 `meta.json`。
5. 提交前运行 `npm run build`。

首次参与项目请阅读 `CONTRIBUTING.md`；更完整的写作约束见 `docs/writing-style.md`，PR 流程见 `docs/pull-request.md`。

## 检查命令

```bash
npm run check:content
npm run check:images
npm run check:vue:tags
npm run test:unit
npm run typecheck
npm run build
npm run validate
```

当前项目的本地 hooks 会在 commit 前运行内容结构、图片引用和 Vue 标签闭合检查，在 commit message 阶段运行 commitlint。`npm run validate` 还会执行单元测试、类型检查和生产构建，作为 CI 与 Vercel 的统一门禁。

## 贡献资源推荐

优质博客、开源项目和工具统一维护在 `lib/resource-directory.ts`；友链维护在
`lib/friend-links.ts`。两个目录使用同一份固定字段结构，资源中心的页面会自动渲染卡片。

推荐条目结构：

```ts
{
  title: '站点名称',
  href: 'https://example.com',
  scenario: '适合在什么情况下使用或阅读。',
  description: '说明站点内容或工具能力。',
  kind: 'blog',
}
```

请避免提交：

- 没有推荐理由的链接堆叠。
- 明显重复或质量较低的内容。
- 与当前目录结构无关的文件。

友情链接独立维护在 `lib/friend-links.ts`，只收录已确认互链关系的技术站点或开源社区；不要把普通资源推荐直接复制为友链。友链数据不需要 `kind` 字段。
- 未经说明的大规模目录调整。

## 常见维护点

- 首页：`app/page.tsx`
- 首页内容统计：`lib/content.ts`
- 文档路由：`app/docs/[[...slug]]/page.tsx`
- 文档布局：`app/docs/layout.tsx`
- 内容源：`lib/source.ts`
- 站点信息架构：`site.config.ts`
- 基础样式：`app/global.css`
- 文档树顺序与目录标题：`content/docs/**/meta.json`

## License

本项目使用 [MIT License](LICENSE)。
