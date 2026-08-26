# Easton Notes

一个基于 [Next.js](https://nextjs.org/) + [Fumadocs](https://www.fumadocs.dev/) 的个人技术知识库，面向前端、服务端、算法、Agent 应用开发和个人开发常用资料整理。

## 本地运行

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run docs:dev
```

生产构建：

```bash
npm run docs:build
```

本地预览构建产物：

```bash
npm run docs:preview
```

## 目录结构

内容统一放在 `content/docs/` 下，并保留五个一级方向：

```text
content/docs/
  frontend/
    knowledge/    # 前端知识八股
    interview/    # 前端面经
    resources/    # 前端优质好文项目

  backend/
    knowledge/    # 服务端知识八股
    interview/    # 服务端面经
    resources/    # 服务端优质好文项目

  agent/
    knowledge/    # Agent 与 LLM 知识八股
      agent/      # Agent 应用开发、RAG、工具调用和协议
      llm/        # LLM 原理、模型机制和微调
    interview/    # Agent 应用开发面经
    resources/    # Agent 应用开发优质好文项目

  algorithm/
    basics/       # 算法基础、STL 和 C++ 常用知识
    leetcode/     # LeetCode 专题与刷题复盘

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

1. 选择合适目录，例如 `content/docs/frontend/knowledge/React/`、`content/docs/agent/knowledge/agent/` 或 `content/docs/algorithm/leetcode/`。
2. 新增 Markdown 或 MDX 文件，文件名使用清晰标题，可带数字前缀控制排序，例如 `01-核心概念.md`。
3. 文章内图片放在当前专题附近的 `img/` 目录，并使用相对路径引用。
4. 如需调整侧边栏展示顺序或目录中文名，编辑对应目录下的 `meta.json`。
5. 提交前运行 `npm run docs:build`。

## 贡献优质好文项目

优质好文和项目推荐放在各方向的 `resources/` 目录下，例如：

```text
content/docs/frontend/resources/
content/docs/backend/resources/
content/docs/agent/resources/
```

推荐新增文章使用这个结构：

```markdown
# 推荐标题

## 链接

- 原文或项目：<https://example.com>

## 推荐理由

用 2-5 句话说明它解决了什么问题、适合谁读、为什么值得收录。

## 标签

- React
- 工程化
- 性能优化
```

请避免提交：

- 没有推荐理由的链接堆叠。
- 明显重复或质量较低的内容。
- 与当前目录结构无关的文件。
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
