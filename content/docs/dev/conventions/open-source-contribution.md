# 参与文档贡献

Easton Notes 的源码和文档维护在 GitHub：

- 项目地址：<https://github.com/Jaxon1216/notes>
- PR 目标：`Jaxon1216/notes` 的 `main` 分支

面经、八股草稿和资料通常保存在自己的电脑上，因此本站推荐在本地完成整理、审查和校验后，再通过
Fork 提交 PR。使用 AI 时，请先阅读仓库内的
[AI 协作贡献规范](https://github.com/Jaxon1216/notes/blob/main/docs/ai-contribution.md)。

## 可以贡献什么

- 前端、服务端、算法、Agent 应用开发和个人开发常用方向的知识笔记。
- 带有上下文、追问和复盘的面经。
- 值得精读的文章、开源项目和实战案例。
- 已有文章中的错别字、失效链接、标题层级和图片引用问题。

新增内容请放到最贴近的目录，不要为了单篇文章新增一级方向。

## 路径一：推荐使用 AI 协作提交 PR

### 1. Fork 并克隆仓库

先在 GitHub 项目页点击 **Fork**，再克隆自己的仓库：

```bash
git clone https://github.com/<你的 GitHub 用户名>/notes.git
cd notes
git remote add upstream https://github.com/Jaxon1216/notes.git
```

### 2. 创建本次贡献的分支

```bash
git switch main
git pull --ff-only upstream main
git switch -c docs/topic-name
```

分支名建议使用 `docs/<topic>`、`fix/<topic>`、`feat/<topic>`、`refactor/<topic>` 或
`chore/<topic>`。

### 3. 让 AI 整理本机材料

把原始材料和 `docs/ai-contribution.md` 中的可复制提示词交给已打开该仓库的 AI 编程工具。AI 应先说明
归档位置和计划修改的文件；确认后再整理内容。面经必须忠实保留原始问题、追问和不确定信息，八股和资源
推荐也必须遵守对应模板。

### 4. 人工审查并运行检查

AI 不能替代事实和隐私审查。先检查：

- `git diff` 只包含本次主题的改动。
- 面经没有被补写答案或改变题目顺序，敏感信息已经处理。
- 内容目录、标题层级、代码块、图片和链接符合站内规范。

然后运行：

```bash
npm run validate
```

### 5. 提交并创建 PR

```bash
git add content/docs
git diff --cached
git commit -m "docs(scope): add topic"
git push -u origin docs/topic-name
```

回到 GitHub 创建 Pull Request，目标仓库选择 `Jaxon1216/notes`，目标分支选择 `main`。完整填写 PR
模板，并等待 GitHub Actions 的 `Docs Checks` 通过。

## 路径二：手工本地提交 PR

不使用 AI 时，同样先 Fork、克隆仓库并创建独立分支。再按
[写作规范](https://github.com/Jaxon1216/notes/blob/main/docs/writing-style.md) 将内容放到合适目录：

- 知识八股：`content/docs/<direction>/knowledge/`
- 面经：`content/docs/<direction>/interview/`
- 优质文章和项目：`content/docs/<direction>/resources/`
- 算法基础和刷题复盘：`content/docs/algorithm/basics/` 或 `content/docs/algorithm/leetcode/`
- 零散技巧和未归档资料：`content/docs/dev/notes/`

完成后检查 `git diff`，运行 `npm run validate`，再按上述命令提交、推送并创建目标为 `main` 的 PR。

## PR 规范

- 一个 PR 只处理一个主题，不混合文章新增、目录重构和样式调整。
- Commit 使用 Conventional Commits：`<type>(optional-scope): <subject>`。可使用的 type 包括
  `feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`chore`、`revert` 和 `build`。
- 新增目录时同步补充必要的 `meta.json`，确认侧边栏顺序。
- 修改一级方向或导航文案时先更新 `site.config.ts`；涉及首页、导航、构建链路或协作规则时同步更新
  `docs/changelog.md`。
- 不提交构建产物、临时文件、编辑器配置或与当前主题无关的改动。

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
