# AGENTS.md

本仓库是一个基于 Next.js App Router + Fumadocs 的个人技术知识库。协作时优先保持目录清晰、渲染链路稳定、内容可增量维护。

## Agent 文档索引

- Agent 开始任务前先读 `docs/agent-index.md`，再按任务类型读取对应维护文档。
- 项目架构、Fumadocs 接入点和配置边界见 `docs/architecture.md`。
- Markdown/MDX 写作规范和标题层级规则见 `docs/writing-style.md`。
- PR 流程、commit message、hooks 和自检命令见 `docs/pull-request.md`。

## 维护记录

- `docs/changelog.md` 记录仓库级重大改动、架构决策和维护规则变更。
- `docs/todo.md` 记录长期技术目标、架构方向和阶段任务。
- `docs/qa/` 记录常见问题和大改动后的自检经验。
- 涉及技术栈、构建链路、信息架构、首页、导航、全站样式、统计、评论、用户系统或协作规则的重大改动时，主动检查并按需更新这两个文件。
- 普通文章内容的小修小补不需要写入 `docs/changelog.md`；零散文章选题优先放在对应专题目录，不写入 `docs/todo.md`。

## 本地命令

- 启动开发服务：`npm run docs:dev`
- 生产构建：`npm run docs:build`
- 预览构建产物：`npm run docs:preview`
- 内容结构检查：`npm run check:content`
- 检查 Vue 笔记中的 HTML 标签闭合：`npm run check:vue:tags`
- TypeScript 检查：`npm run typecheck`
- PR 总检查：`npm run validate`

`docs:dev` 和 `docs:build` 直接运行 Next.js，不再生成 `index.md`。

## 信息架构

一级方向由 `site.config.ts` 统一维护：

- `content/docs/frontend/`：前端
- `content/docs/backend/`：服务端
- `content/docs/algorithm/`：算法
- `content/docs/agent/`：Agent 应用开发
- `content/docs/dev/`：个人开发常用

新增一级方向、调整子栏目名称、修改导航展示文案时，先改 `site.config.ts`，再改对应目录和 `content/docs/**/meta.json`。不要在 `app/page.tsx`、`lib/content.ts`、`README.md` 中各写一份重复配置。

## 首页与导航

- 首页源码在 `app/page.tsx`。
- 首页内容统计和首篇文章链接逻辑在 `lib/content.ts`。
- 文档内容源在 `lib/source.ts`，Fumadocs 路由在 `app/docs/[[...slug]]/page.tsx`。
- 文档布局在 `app/docs/layout.tsx`。
- 目录顺序和目录中文名优先维护对应的 `meta.json`。
- 基础样式在 `app/global.css`；第一阶段保持轻量样式，后续再做系统化视觉升级。
- 空栏目仍应在首页保留可见入口，但 docs sidebar 只保证已有内容可导航。

## 内容贡献

新增笔记时选择最贴近的目录：

- 知识八股：`content/docs/<direction>/knowledge/`
- 面经：`content/docs/<direction>/interview/`
- 优质好文项目：`content/docs/<direction>/resources/`
- Agent 知识八股再分两层：偏应用工程放 `content/docs/agent/knowledge/agent/`，偏 LLM 原理放 `content/docs/agent/knowledge/llm/`
- 算法基础和刷题复盘：`content/docs/algorithm/basics/` 或 `content/docs/algorithm/leetcode/`
- 零散技巧、读书笔记和未归档资料：`content/docs/dev/notes/`

优质好文项目推荐必须包含原文或项目链接、推荐理由和标签。避免只提交链接列表。

## 编辑约束

- 保持目录名为英文，页面展示名为中文。
- 文件名可以使用数字前缀控制排序，例如 `01-核心概念.md`。
- 问答型长文使用 `## 题目`、`### 回答重点/扩展知识/面试官追问` 的标题层级，保证 Fumadocs 右侧目录可渲染题目。
- 图片放在当前专题附近的 `img/` 目录，并使用相对路径引用。
- 大改动后参考 `docs/qa/` 做常见问题自检；遇到大家都可能遇到的问题时，按 `docs/qa/template.md` 主动补充。
- 不要把 `MathModelAgent/` 自动纳入公开导航，除非明确要整理到 `content/docs/agent/resources/`。
- 不要删除或恢复用户未说明的改动。
- 除非用户明确要求，不要自主提交 commit；完成修改后提醒用户可提交的文件和建议 commit message。

## 验证

新增或修改文章时，至少运行：

```bash
npm run check:content
```

涉及导航、首页、目录或样式时，至少运行：

```bash
npm run docs:build
```

如果只改 Vue 笔记里的 HTML/Vue 示例，也可以额外运行：

```bash
npm run check:vue:tags
```

PR 前建议运行完整检查：

```bash
npm run validate
```
