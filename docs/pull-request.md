# PR 规范和流程

本文用于统一多人协作时的提交、检查和 Review 流程。只改普通文章内容时也要遵守写作规范；涉及技术栈、目录、首页、导航、构建链路或协作规则时，同步更新 `docs/changelog.md` 和必要文档。

使用 AI 编程工具整理本机面经、八股或资源时，先读 [AI 协作贡献规范](./ai-contribution.md)。AI 只能协助归档和排版；贡献者仍需审查事实、脱敏内容和 `git diff`，并运行本页要求的检查。

## 分支建议

分支名建议使用：

```text
docs/<topic>
feat/<topic>
fix/<topic>
refactor/<topic>
chore/<topic>
```

示例：

```text
docs/react-hooks-notes
fix/fumadocs-heading-render
chore/content-check-script
```

## Commit Message

项目使用 `commitlint` 校验 commit message，提交格式：

```text
<type>(optional-scope): <subject>
```

允许的 type：

```text
feat, fix, docs, style, refactor, perf, test, chore, revert, build
```

示例：

```text
docs(react): add hooks interview notes
fix(content): normalize heading levels
chore: add content style check
```

本地 `husky` 当前包含：

- `commit-msg`：运行 `commitlint --edit`，校验提交信息。
- `pre-commit`：运行内容结构、图片引用和 Vue 标签闭合检查。

如果需要临时跳过本地 hooks，可以使用 `HUSKY=0 git commit ...`，但 PR 仍必须通过 CI。

## PR 前检查

普通内容 PR 至少运行：

```bash
npm run check:content
npm run check:images
npm run docs:build
```

改动 Vue 笔记里的 HTML/Vue 示例时运行：

```bash
npm run check:vue:tags
```

完整自检运行：

```bash
npm run validate
```

`validate` 会依次执行：

```text
check:content -> check:images -> check:vue:tags -> typecheck -> docs:build
```

当前项目尚未接入 ESLint。TypeScript 和 Next.js 构建会覆盖编译错误；如果后续 React 组件和交互代码增多，再补 `eslint.config.mjs`、`lint` 脚本和 CI lint 阶段。

## CI 和 Vercel

GitHub Actions 会在 PR 和 `main` 分支 push 时运行：

```bash
npm run validate
```

Vercel 也通过 `vercel.json` 使用同一条构建命令：

```bash
npm run validate
```

因此，本地 commit hook 负责提前发现最常见的内容结构问题；CI 和 Vercel 负责最终阻断不符合规范或无法构建的 PR。

## PR 内容要求

- 一个 PR 只解决一个主题，避免同时提交文章、大规模目录调整和样式重构。
- 新增文章要放在合适的信息架构目录下。
- 新增目录时同步补 `meta.json`，并确认侧边栏顺序。
- 新增一级方向或修改导航文案时，先改 `site.config.ts`，再改内容目录。
- 图片放在当前专题附近的 `img/` 目录，正文使用相对路径。
- 项目推荐类文章必须包含链接、推荐理由和标签。
- 大改动后检查 `docs/qa/`，如果踩到通用问题，补一条 QA。

## Review Checklist

Review 时优先看这些点：

- 内容是否放到了正确目录。
- 标题层级是否符合 `docs/writing-style.md`。
- 是否存在多个 H1、标题跳级、标题里嵌套链接。
- 新目录是否有对应 `meta.json`。
- 图片是否放在当前专题 `img/` 目录，并使用 `./img/xxx` 引用。
- 首页、导航、搜索或 Fumadocs 配置是否被误改。
- 是否运行过必要检查，并在 PR 描述里写明结果。
- 大改动是否更新 `docs/changelog.md` 或 `docs/todo.md`。

## 合并建议

- 文档内容小改可以 squash merge。
- 架构、构建链路、脚本和目录迁移类改动建议保留清晰的 commit 语义。
- 合并前确保 CI 通过；不要只依赖本地预览。
