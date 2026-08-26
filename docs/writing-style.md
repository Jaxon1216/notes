# 写作规范

本文用于约束仓库里的 Markdown/MDX 内容，重点覆盖 `content/docs/` 下的公开文章。目标是让多人提交 PR 时保持目录清晰、标题层级稳定、Fumadocs 渲染一致。

## 文件位置

新增笔记时放到最接近主题的目录：

- 知识八股：`content/docs/<direction>/knowledge/`
- 面经：`content/docs/<direction>/interview/`
- 优质文章和项目：`content/docs/<direction>/resources/`
- Agent 应用工程：`content/docs/agent/knowledge/agent/`
- LLM 原理：`content/docs/agent/knowledge/llm/`
- 算法基础和刷题复盘：`content/docs/algorithm/basics/` 或 `content/docs/algorithm/leetcode/`
- 零散技巧、读书笔记和未归档资料：`content/docs/dev/notes/`

目录名优先使用英文。页面展示名放在 `meta.json` 或文章标题里维护。

## 文件命名

- 文件名使用清晰标题，可以用数字前缀控制排序，例如 `01-核心概念.md`。
- 同一专题下的系列文章建议统一前缀，例如 `01-`、`02-`、`03-`。
- 图片放到当前专题附近的 `img/` 目录，并使用相对路径引用。
- 不提交构建产物、临时文件、截图草稿和个人编辑器状态。

## 标题层级

推荐结构：

```markdown
# 文章标题

## 一级正文章节

### 二级正文小节

#### 细节说明
```

约束规则：

- 普通文章推荐使用一个 `#` 作为文章标题。
- 同一篇文章最多只能有一个 `#`。
- 如果文章已经用 frontmatter `title` 或文件名作为页面标题，正文可以直接从 `##` 开始。
- `##` 表示正文主章节，`###` 表示章节内的小节，`####` 表示更细的解释。
- 标题必须逐级下降，不能从 `##` 直接跳到 `####`。
- 标题中不要直接写 Markdown 链接，链接放到标题下面的正文里。
- 问答型长文使用 `## 题目`、`### 回答重点`、`### 扩展知识`、`### 面试官追问`。
- 指向其他 Markdown/MDX 页面的相对路径需要写成 Markdown 链接，例如 `[LLM 原理](../llm/LLM原理.md)`；不要只写成 `` `../llm/LLM原理.md` ``，否则前端会渲染为不可点击的代码文本。

这样做的原因是 Fumadocs 会根据标题生成目录和锚点。多个 H1、标题跳级、标题里嵌套链接都容易导致右侧目录和锚点渲染不稳定。

## Frontmatter

普通文章可以不写 frontmatter，页面标题会从文件名或正文 H1 推导。需要覆盖展示标题或描述时再写：

```md
---
title: 自定义标题
description: 页面描述
---
```

不要为了排序在 frontmatter 里维护重复信息。排序优先使用文件名前缀和 `meta.json`。

## 内容结构

知识型文章建议按这个顺序组织：

```markdown
# 主题名称

## 核心结论

## 背景和概念

## 代码示例

## 常见误区

## 扩展阅读
```

面试题文章建议按这个顺序组织：

```markdown
# 主题名称

## 题目

### 回答重点

### 扩展知识

### 面试官追问
```

项目推荐文章必须包含：

- 原文或项目链接
- 推荐理由
- 标签

## 代码块

- 代码块必须标注语言，例如 ` ```ts `、` ```js `、` ```bash `。
- 代码块里的示例可以保留注释；正文不要用未围栏的代码片段冒充标题。
- 终端命令用 `bash`，配置文件按实际格式标注，例如 `json`、`ts`、`yaml`。

## 本地检查

提交前至少运行：

```bash
npm run check:content
npm run docs:build
```

如果改了 Vue 笔记中的 HTML/Vue 示例，额外运行：

```bash
npm run check:vue:tags
```

完整 PR 自检运行：

```bash
npm run validate
```

`check:content` 目前会检查 `content/docs`、`docs`、`README.md` 和 `AGENTS.md`：

- 文章正文至少有标题，`content/docs/index.mdx` 除外。
- 同一篇文章最多一个 H1。
- H1 只能作为第一个标题出现。
- 第一个标题不能从 H3 或更深层级开始。
- 标题层级不能跳级。
- 标题中不能直接写 Markdown 链接。
- 相对 Markdown/MDX 路径不能只写在 inline code 里；需要跳转时必须使用 Markdown 链接。
