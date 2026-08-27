# Changelog

本文件记录仓库级重大改动、架构决策和维护规则变更。普通笔记内容的小修小补不需要记录。

## 2026-08-27

- 更新 `docs/writing-style.md` 的文件命名规范，明确连续课程型、独立主题集合和混合型目录的命名取舍，避免同一目录无说明地混用数字前缀和普通标题。
- 补充 `meta.json`、Markdown/MDX 和图片资源维护规则；新增 `scripts/check-images.cjs` 与 `npm run check:images`，并接入 `pre-commit` 和 `validate` 检查链路。

## 2026-08-26

- 新增 `docs/changelog.md` 作为重大改动记录入口。
- 新增 `docs/todo.md` 作为长期技术目标和阶段任务清单。
- 更新 `AGENTS.md`，要求后续协作在涉及架构、技术栈、构建链路、导航、首页、样式或协作规则的重大改动时，同步维护本文件与 `docs/todo.md`。
- 将站点工程从 VitePress 迁移到 Next.js App Router + Fumadocs，文档路由统一为 `/docs/...`。
- 将原 `frontend/`、`backend/`、`algorithm/`、`agent/`、`dev/` 内容目录整体迁移到 `content/docs/` 下，并保留一级信息架构名称。
- 用 `app/page.tsx` 和 `lib/content.ts` 替代旧的 `scripts/generate-dashboard.cjs` + `index.md` 首页生成链路。
- 停用 VitePress 配置和主题入口，默认开发、构建、预览命令改为 Next.js。
- 新增 `docs/qa/` 作为常见问题和大改动自检经验入口，后续遇到通用问题时按简版模板增量记录。
- 新增 `docs/architecture.md`、`docs/writing-style.md`、`docs/pull-request.md` 和 `docs/agent-index.md`，沉淀项目架构、写作规范、PR 流程和 Agent 协作索引。
- 新增 `scripts/check-content-style.cjs` 和 `npm run check:content`，用于检查 Markdown/MDX 标题层级、H1 数量和标题链接等渲染风险。
- 扩展 `check:content`，检查相对 Markdown/MDX 路径被误写成 inline code 导致前端不可点击的问题。
- 新增 `npm run typecheck` 和 `npm run validate`，统一 PR 前本地检查入口。
- 新增 `.husky/pre-commit`，在提交前运行内容结构检查和 Vue 标签闭合检查；保留 `.husky/commit-msg` 的 commitlint 校验。
- 新增 GitHub Actions `Docs Checks` 和 PR 模板，推动外部 PR 统一执行内容规范和构建检查。
- 新增 `vercel.json`，让 Vercel 部署阶段使用 `npm run validate` 作为统一构建门禁。
- 新增项目级 `.npmrc`，固定依赖安装使用 npm 公网源，并清理 `package-lock.json` 中的内网源地址，避免 Vercel `npm ci` 在公网环境解析内网域名失败。
