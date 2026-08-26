# Todo

本文件记录仓库长期技术目标、架构方向和阶段任务。普通文章选题和零散内容 TODO 优先放在对应笔记目录，不放这里。

## 技术目标

### P0: 文档站技术栈迁移

- [x] 基于现有 75 篇 Markdown 内容完成 `Next.js App Router + React + TypeScript + Fumadocs + MDX` 迁移验证。
- [x] 保留现有一级信息架构名称：`frontend/`、`backend/`、`algorithm/`、`agent/`、`dev/`，内容根目录迁到 `content/docs/`。
- [x] 设计新的内容数据层，使用 `lib/content.ts` 替代 `scripts/generate-dashboard.cjs` 拼接首页 HTML 的方式。
- [x] 确认 Markdown/MDX 兼容规则，先通过宽松 frontmatter schema、远程图片跳过尺寸抓取和少量语法修正保证现有文章可构建。
- [x] 输出迁移后的本地开发、构建、预览命令，并更新 `README.md` 与 `AGENTS.md`。

### P1: 首页与阅读体验

- [x] 将首页改为正常 React 路由页面 `app/page.tsx`，而不是生成 `index.md`。
- [ ] 首页模块组件化：最近更新、精选知识、轮播推荐。
- [ ] 引入统一样式体系：Tailwind CSS 精细主题、shadcn/ui、Radix UI、lucide-react。
- [ ] 评估使用 Motion 为首页和局部组件提供轻量动效，避免影响阅读性能。
- [ ] 打磨文章阅读页排版：标题层级、代码块、表格、引用、目录、移动端阅读体验。

### P2: 搜索、统计与互动能力

- [x] 接入 Fumadocs 基础搜索 route；后续按规模继续评估 Orama 静态索引或 Algolia。
- [x] 建立基础内容统计：文章数、栏目数、已有内容方向。
- [x] 沿用 Vercel Analytics；后续再评估更完整的访问统计看板。
- [ ] 第一阶段评论优先评估 Giscus，降低后端维护成本。
- [ ] 后续如需要点赞、收藏、用户资料和阅读进度，评估 Supabase Auth + Postgres 或 Clerk + 数据库。

### P3: 内容工程化

- [ ] 为文章 frontmatter 设计统一 schema，例如标题、描述、标签、状态、更新时间、精选标记。
- [x] 增加基础内容校验脚本，提前发现缺失标题、多个 H1、标题跳级和标题链接等结构问题。
- [ ] 扩展内容校验脚本，继续覆盖坏链接、无效 frontmatter、图片引用和 MDX 语法问题。
- [ ] 评估接入 ESLint，用于 React/TypeScript 组件代码的风格和潜在问题检查。
- [ ] 为 AI/Agent 阅读生成结构化索引，例如 `llms.txt` 或站点内容 manifest。

<br />

<br />

## 个人想法

- github链接：<https://www.fumadocs.dev/docs/ui/components/github-info> &#x20;
- 知识图谱：<https://www.fumadocs.dev/docs/ui/components/graph-view>
- 文档站提供PR强引导：<https://www.fumadocs.dev/docs/ui/components/steps>
- 导航栏
- 主页
- 友链

