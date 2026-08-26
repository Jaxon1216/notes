# AGENTS.md

本仓库是一个基于 VitePress 的个人技术知识库。协作时优先保持目录清晰、生成链路稳定、内容可增量维护。

## 维护记录

- `docs/changelog.md` 记录仓库级重大改动、架构决策和维护规则变更。
- `docs/todo.md` 记录长期技术目标、架构方向和阶段任务。
- 涉及技术栈、构建链路、信息架构、首页、导航、全站样式、统计、评论、用户系统或协作规则的重大改动时，主动检查并按需更新这两个文件。
- 普通文章内容的小修小补不需要写入 `docs/changelog.md`；零散文章选题优先放在对应专题目录，不写入 `docs/todo.md`。

## 本地命令

- 启动开发服务：`npm run docs:dev`
- 生产构建：`npm run docs:build`
- 预览构建产物：`npm run docs:preview`
- 检查 Vue 笔记中的 HTML 标签闭合：`npm run check:vue:tags`

`docs:dev` 和 `docs:build` 都会先运行 `scripts/generate-dashboard.cjs` 重新生成 `index.md`。

## 信息架构

一级方向由 `site.config.cjs` 统一维护：

- `frontend/`：前端
- `backend/`：服务端
- `algorithm/`：算法
- `agent/`：Agent 应用开发
- `dev/`：个人开发常用

新增一级方向、调整子栏目名称、修改导航展示文案时，先改 `site.config.cjs`，再改目录和内容。不要在 `.vitepress/config.mts`、`scripts/generate-dashboard.cjs`、`README.md` 中各写一份重复配置。

## 首页与导航

- `index.md` 是生成产物，不要只手动修改 `index.md`。
- 首页结构改动应修改 `scripts/generate-dashboard.cjs`。
- 首页样式改动应修改 `.vitepress/theme/custom.css`。
- 顶部导航和侧边栏生成逻辑在 `.vitepress/config.mts`。
- 空栏目仍应保留可见入口，通常链接到首页对应锚点，例如 `/#backend`。

## 内容贡献

新增笔记时选择最贴近的目录：

- 知识八股：`<direction>/knowledge/`
- 面经：`<direction>/interview/`
- 优质好文项目：`<direction>/resources/`
- Agent 知识八股再分两层：偏应用工程放 `agent/knowledge/agent/`，偏 LLM 原理放 `agent/knowledge/llm/`
- 算法基础和刷题复盘：`algorithm/basics/` 或 `algorithm/leetcode/`
- 零散技巧、读书笔记和未归档资料：`dev/notes/`

优质好文项目推荐必须包含原文或项目链接、推荐理由和标签。避免只提交链接列表。

## 编辑约束

- 保持目录名为英文，页面展示名为中文。
- 文件名可以使用数字前缀控制排序，例如 `01-核心概念.md`。
- 问答型长文使用 `## 题目`、`### 回答重点/扩展知识/面试官追问` 的标题层级，保证 VitePress 右侧导航可渲染题目。
- 图片放在当前专题附近的 `img/` 目录，并使用相对路径引用。
- 不要把 `MathModelAgent/` 自动纳入公开导航，除非明确要整理到 `agent/resources/`。
- 不要删除或恢复用户未说明的改动。
- 除非用户明确要求，不要自主提交 commit；完成修改后提醒用户可提交的文件和建议 commit message。

## 验证

涉及导航、首页、目录或样式时，至少运行：

```bash
npm run docs:build
```

如果只改 Vue 笔记里的 HTML/Vue 示例，也可以额外运行：

```bash
npm run check:vue:tags
```
