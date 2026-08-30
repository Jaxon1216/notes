# 开源贡献指南

## 可以贡献什么

Easton Notes 欢迎围绕现有信息架构做增量贡献，优先补充这些内容：

- 前端、服务端、算法、Agent 应用开发和个人开发常用方向的知识笔记。
- 面试复盘、题目整理和表达素材。
- 值得精读的文章、开源项目和实战案例。
- 已有文章中的错别字、失效链接、标题层级和图片引用问题。

新增内容请优先放到最贴近的目录，不要为了单篇文章新增一级方向。

## 优质好文和项目推荐格式

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

## 内容放置规则

- 知识八股放到 `content/docs/<direction>/knowledge/`。
- 面经放到 `content/docs/<direction>/interview/`。
- 优质好文项目放到 `content/docs/<direction>/resources/`。
- Agent 知识八股按主题继续拆分：应用工程放到 `content/docs/agent/knowledge/agent/`，LLM 原理放到 `content/docs/agent/knowledge/llm/`。
- 算法基础和刷题复盘放到 `content/docs/algorithm/basics/` 或 `content/docs/algorithm/leetcode/`。
- 零散技巧、读书笔记和未归档资料放到 `content/docs/dev/notes/`。
- 图片放在当前专题附近的 `img/` 目录，并使用相对路径引用。

## 提交前检查

普通内容改动至少运行：

```bash
npm run check:content
npm run check:images
```

涉及首页、导航、目录、样式或构建链路时，至少运行：

```bash
npm run docs:build
```

PR 前建议运行完整检查：

```bash
npm run validate
```

## 不建议提交的内容

- 没有推荐理由的链接堆叠。
- 明显重复、质量较低或无法打开的资源。
- 与当前目录结构无关的文件。
- 未经说明的大规模目录调整。
- 只在首页、导航、README 或配置文件里重复维护同一份栏目信息。
