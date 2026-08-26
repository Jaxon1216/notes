# Changelog

本文件记录仓库级重大改动、架构决策和维护规则变更。普通笔记内容的小修小补不需要记录。

## 2026-08-26

- 新增 `docs/changelog.md` 作为重大改动记录入口。
- 新增 `docs/todo.md` 作为长期技术目标和阶段任务清单。
- 更新 `AGENTS.md`，要求后续协作在涉及架构、技术栈、构建链路、导航、首页、样式或协作规则的重大改动时，同步维护本文件与 `docs/todo.md`。
- 将站点工程从 VitePress 迁移到 Next.js App Router + Fumadocs，文档路由统一为 `/docs/...`。
- 将原 `frontend/`、`backend/`、`algorithm/`、`agent/`、`dev/` 内容目录整体迁移到 `content/docs/` 下，并保留一级信息架构名称。
- 用 `app/page.tsx` 和 `lib/content.ts` 替代旧的 `scripts/generate-dashboard.cjs` + `index.md` 首页生成链路。
- 停用 VitePress 配置和主题入口，默认开发、构建、预览命令改为 Next.js。
