# Todo

本文件记录仓库长期技术目标、架构方向和阶段任务。普通文章选题和零散内容 TODO 优先放在对应笔记目录，不放这里。

## 技术目标

### P0: 文档站技术栈迁移调研与 PoC

- [ ] 基于现有 75 篇 Markdown 内容验证 `Next.js App Router + React + TypeScript + Fumadocs + MDX` 迁移可行性。
- [ ] 保留现有一级信息架构：`frontend/`、`backend/`、`algorithm/`、`agent/`、`dev/`。
- [ ] 设计新的内容数据层，替代当前 `scripts/generate-dashboard.cjs` 拼接首页 HTML 的方式。
- [ ] 确认 Markdown/MDX 兼容规则，避免现有文章因 MDX 严格语法批量报错。
- [ ] 输出迁移后的本地开发、构建、预览命令，并更新 `README.md` 与 `AGENTS.md`。

### P1: 首页与阅读体验

- [ ] 将首页改为正常 React 路由页面，例如 `app/page.tsx`，而不是生成 `index.md`。
- [ ] 首页模块组件化：栏目入口、文章统计、最近更新、精选知识、轮播推荐。
- [ ] 引入统一样式体系：Tailwind CSS、shadcn/ui、Radix UI、lucide-react。
- [ ] 评估使用 Motion 为首页和局部组件提供轻量动效，避免影响阅读性能。
- [ ] 打磨文章阅读页排版：标题层级、代码块、表格、引用、目录、移动端阅读体验。

### P2: 搜索、统计与互动能力

- [ ] 接入文档全文搜索，优先评估 Fumadocs 内置 Orama，后续按规模考虑 Algolia。
- [ ] 建立内容统计：文章数、栏目数、最近更新、标签或专题分布。
- [ ] 建立访问统计：优先评估 Vercel Analytics 或 Umami。
- [ ] 第一阶段评论优先评估 Giscus，降低后端维护成本。
- [ ] 后续如需要点赞、收藏、用户资料和阅读进度，评估 Supabase Auth + Postgres 或 Clerk + 数据库。

### P3: 内容工程化

- [ ] 为文章 frontmatter 设计统一 schema，例如标题、描述、标签、状态、更新时间、精选标记。
- [ ] 增加内容校验脚本，提前发现坏链接、缺失标题、无效 frontmatter 和 MDX 语法问题。
- [ ] 为 AI/Agent 阅读生成结构化索引，例如 `llms.txt` 或站点内容 manifest。
