# 参与文档贡献

## 项目仓库

Easton Notes 的源码和文档都维护在 GitHub：

- 项目地址：<https://github.com/Jaxon1216/notes>
- PR 目标分支：`Jaxon1216/notes` 的 `main` 分支

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

## PR 提交流程

### 1. Fork 并克隆仓库

先在 GitHub 项目页点击 **Fork**，再克隆自己的仓库：

```bash
git clone https://github.com/<你的 GitHub 用户名>/notes.git
cd notes
git remote add upstream https://github.com/Jaxon1216/notes.git
```

### 2. 创建独立分支

从最新的 `main` 分支创建本次改动分支：

```bash
git switch main
git pull --ff-only upstream main
git switch -c docs/topic-name
```

分支名建议使用 `docs/<topic>`、`fix/<topic>`、`feat/<topic>`、`refactor/<topic>`
或 `chore/<topic>`。

### 3. 完成改动并提交

提交信息遵循 Conventional Commits 格式：

```text
<type>(optional-scope): <subject>
```

允许使用的 type 包括 `feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、
`chore`、`revert` 和 `build`。例如：

```bash
git add content/docs/frontend/knowledge/React
git commit -m "docs(react): add hooks interview notes"
```

本地 `commit-msg` hook 会使用 commitlint 检查提交信息，`pre-commit` hook 会运行基础内容检查。

### 4. 推送并创建 PR

```bash
git push -u origin docs/topic-name
```

然后在 GitHub 创建 Pull Request，目标仓库选择 `Jaxon1216/notes`，目标分支选择 `main`。

## PR 规范

- 一个 PR 只处理一个主题，避免把文章新增、目录重构和样式调整混在一起。
- PR 标题使用与 commit message 一致的简洁语义，例如
  `docs(react): add hooks interview notes`。
- PR 描述说明改了什么、为什么改，以及实际运行过哪些检查。
- 新增目录时同步补充 `meta.json`，并确认侧边栏顺序。
- 修改一级方向或导航文案时先更新 `site.config.ts`，不要在多个页面重复维护配置。
- 涉及首页、导航、构建链路或协作规则时，同步更新 `docs/changelog.md`。
- 不提交构建产物、临时文件、个人编辑器配置或与当前主题无关的改动。
- 提交前检查 PR diff，确认没有误删、移动或覆盖其他内容。

仓库已经提供 PR 模板。创建 PR 后请完整填写“改动说明”“改动类型”“自检”和“补充说明”，
并等待 GitHub Actions 的 `Docs Checks` 通过后再合并。

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
