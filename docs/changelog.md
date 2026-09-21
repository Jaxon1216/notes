# Changelog

本文件记录仓库级重大改动、架构决策和维护规则变更。普通笔记内容的小修小补不需要记录。

## 2026-09-21

- 新增“域名可能变更，及时 Fork”资源位：文档侧栏在“站点动态”卡片下方新增 `components/site/docs-sidebar-fork.tsx` 横条（`app/docs/layout.tsx` 的 `searchToggle.components.lg` 内挂载），顶部导航右侧同步新增 `.site-header__repo` 的 GitHub 源码图标并带 hover/聚焦 tooltip；两处均指向 `https://github.com/Jaxon1216/notes`，用 Umami `data-umami-event`（`sidebar_fork_link_click` / `header_fork_link_click`）埋点。动效遵循“默认安静、hover 才活跃”：横条 hover 触发一道斜向扫光加箭头右移，图标 hover 变站点蓝，均随 `prefers-reduced-motion` 降级为静态；图标复用 lucide 的 `GitFork`（当前 lucide-react 无 `Github` 品牌图标）。
- 删除 `public/favicon.svg`，浏览器 favicon 与 Apple Touch Icon 统一改用 `public/site-icon.png`（180x180 PNG）；同步更新 `app/layout.tsx` 图标配置、`tests/site-icons.test.ts` 断言、`public/README.md` 与 `docs/architecture.md`。

## 2026-09-19

- 内容质量整改（分支 `docs/content-quality-pass`）：删除 `content/docs/dev/notes/`（原“杂记与读书”，含 `tips.md` 与半成品读书笔记 `PurpleBook.md`），并同步清理 `site.config.ts`、`content/docs/dev/meta.json`、`README.md`、`docs/writing-style.md`、`AGENTS.md`、`open-source-contribution.md` 中对该目录的引用与归档指引。`dev` 一级方向自此不再保留零散笔记的兜底目录。
- 统一命名与目录元信息：`axios.md → 04-axios.md`、算法总览 `Basic1.md → 00-总览.md`（消除同目录数字前缀混用，并修复总览页排序落到末尾的问题，注意这两页线上 URL 变化）；为 `React/`、`Vue/`、`Express/` 补中文 `meta.json`；删除 `agent-development`、`js2go` 中与文件名前缀重复的 `pages` 列表；修复 React 学习路线与算法总览页的 Obsidian `[[]]` 双链为标准 Markdown 链接。
- 精简 `dev/git/git.md`：去掉“要点测验”问答与冗长的 Conventional Commits 章节（改为链接到开源贡献规范），聚焦 add/commit/push/pull/fetch、branch/checkout（含 `-b`/`-t`）、merge/rebase，并推荐 VS Code 插件 Git Graph。
- 重排 `dev/linux/linux.md` 主命令表为“左场景 / 右命令”，按前端日常使用频率排序。
- 修正确定性技术错误与去重：docker 挂载路径 `/user→/usr`、算法示例缺失的函数闭合与 `vector` 初始化、STL 变量重名、Agent 文档中 BGE 归属（智源）、GPT-4 上下文窗口、Computer Use 原理、LangChain 分层、Express HTTP/2 示例、HTTP 202 状态码标签等；合并 Agent 与 LLM 文档中整段重复的题目（CoT、System Prompt、PEFT），并对 React 合成事件绑定层级、`csurf`、Mongoose 连接选项、IE 缓存等过时内容补充版本说明。（mineru-interview 七篇的 OCR 清洗留待单独一轮处理。）

- 将原单页“资源推荐”升级为资源中心：Fumadocs 侧边栏提供总览、优质博客、开源项目、工具与平台、友情链接五个入口；首批收录江旭的技术博客与 Magic Resume。
- 新增通用站点目录结构：`title`、`scenario`、`description`、`href` 由 `lib/link-entry.ts` 集中校验，资源与友链复用同一 flex 卡片组件；卡片在桌面为三列、超宽屏为四列。友链不从资源推荐或搜索结果自动同步，避免将编辑精选与互链关系混为一谈。
- Magic Resume 友链使用 Umami 的 `data-umami-event` 属性记录 `friend_link_click`，并附带站点名称和目标地址；埋点配置随单条友链数据维护，其他友链默认不采集该事件。复用现有生产环境统计脚本，不新增客户端脚本或服务端接口。

## 2026-09-18

- 接入 Umami 自托管访问统计：在 `app/layout.tsx` 中通过 `next/script` 注入 `script.js`，并与 Vercel Analytics 一样用 `process.env.VERCEL` 门禁，仅在 Vercel 部署环境加载，避免本地开发流量污染统计。`data-website-id` 作为公开标识内联在根布局中，未引入额外依赖。

## 2026-09-17

- 接入 Giscus 评论系统：新增可复用的 `components/comments/giscus-comments.tsx`，在文档页正文之后、页脚之前渲染；评论区通过 `IntersectionObserver` 在用户接近时才注入 `client.js`，并用 `MutationObserver` 观察 `<html>` 的 `.dark` class 通过 `postMessage` 同步 giscus iframe 明暗主题。仓库和分类 ID 作为公开标识内联在客户端组件中，未引入额外依赖。
- 新增前端与 Go 后端学习路线同级文档，并将“学习路线”及真实篇数接入顶部下拉导航；内容统计同时支持目录型栏目和同名 Markdown/MDX 单页。

## 2026-09-11

- 改进文档页 AI 解释挂件：支持在同一会话内连续追加正文引用，提高选区入口层级；流式回答仅在消息区位于底部时自动跟随，避免用户向上阅读时被拉回。
- 补齐 AI 回答的 GFM 表格边框、对齐和横向滚动样式，并为围栏代码块增加明暗主题语法高亮。
- 将消息标签样式限制到直接子元素，避免高亮代码 token 被排成多行；选区只在正文或其滚动容器移动时清空，避免侧栏自动滚动打断追加引用。

## 2026-09-10

- 关闭 Fumadocs 自动 layout tabs，修复新增顶级资源目录后 tab 层与正文占用同一 grid area、导致正文被不透明背景遮挡的问题；一级栏目继续由全站头部统一导航。
- 重构内容信息架构：前端、服务端和 Agent 统一使用“教程 / 八股 / 面经”三类目录；算法继续独立维护，资源推荐合并为一级入口并支持方向与类型筛选；为旧的 `knowledge` 和分散资源页 URL 增加永久重定向。
- 新增根目录贡献指南和 MIT License，明确协作者默认走 PR、管理员可直接处理低风险小改；PR 模板补充关联 Issue、实际验证结果、破坏性变更和公开 URL 变化说明；AI 贡献规范增加纯文本面经整理与仓库内落盘两套提示词，并强化题目顺序、回答引用、脱敏和提示注入边界。
- 清理未引用的历史图片，将 AI 解答教程截图无损转换为 WebP；扩展 `check:images`，阻止孤立图片和超过 1 MiB 的单图，对超过 500 KiB 或使用远程来源的图片给出压缩与本地化提示。
- 将 Vitest 单元测试接入 `npm run validate`、CI 和 Vercel 构建门禁，清理失效的 PR 自检命令，并移除未被站点引用的临时设计稿与本机 Agent Skills 报告。
- 将 113 个问题集中在单页的 `Agent应用开发.md` 改为稳定总览入口，并按 Agent 基础、框架编排、RAG、向量数据库、协议、可靠性和业务实践拆分为 15 篇有序专题文章，降低单页体积与目录复杂度。
- 收敛首页和全站头部的 Next.js 自动预取：保留主要“进入文档”入口，只关闭内容标签、LogoLoop、AI 教程和贡献入口等次要链接的 RSC 预取。
- 移动端文档页隐藏重复的全站头部并归零对应布局偏移，保留 Fumadocs 自带的品牌、搜索、侧边栏触发器和页内目录；首页移动端与桌面文档头部保持不变。
- 浏览器 favicon 改用轻量 SVG，并将保留原路径的 Apple Touch Icon 从 1080x1080 缩放为规范的 180x180 PNG，避免为标签页和 Apple 图标重复传输大图。
- 强化 `/api/ai/explain` 请求边界：增加请求体字节、严格消息结构和字段长度校验，引入有界的进程内 best-effort 限流，并将 SSRF 地址/域名规则拆为可单测模块；BYOK 配置和 `useChat` 流式交互保持不变。
- 新增统一站点 URL 解析、动态 `robots.txt`/`sitemap.xml`、页面级 canonical 与 OpenGraph/Twitter Metadata；以 Zod 扩展 Fumadocs `pageSchema`，集中校验可选文档 frontmatter，并将受影响的 `sharp` 锁定到安全版本。

## 2026-09-04

- 移除重复的 `docs:dev`、`docs:build` 和 `docs:preview` 脚本，统一使用 `dev`、`build` 和 `start` 运行 Next.js，并同步维护文档与 `validate` 构建链路。

## 2026-09-02

- 顶部导航改为受控的互斥展开状态，修复菜单触发区与面板之间的悬浮断层；点击固定的旧菜单会在悬浮新栏目时让位，并补充路由驱动的当前领域蓝色焦点提示。
- 首页粒子配置与个人主页对齐，提升粒子密度、颜色辨识度与画布清晰度，同时保留减少动态、页面隐藏暂停和卸载销毁的性能边界。
- AI 解答教程改为“选中文本 → 查看右侧解释”的两步实图引导；优质好文项目页升级为可复用的文章/项目双维度资源目录，服务端文章维度暂以明确空态保留编辑空间。

## 2026-09-01

- 移除顶部导航中与“参与文档贡献”入口重复的 GitHub 图标；贡献页改为本地优先的 AI 协作和手工 PR 两条路径，并新增 `docs/ai-contribution.md` 固定面经、八股和资源推荐的 AI 整理规范与审查要求。
- 下线整套 Vue3 小兔鲜项目跟练笔记和重复的灵神算法 01–08 整合草稿，首页内容标签改为指向现有 React 学习路线，避免推广入口落到失效页面。
- 导航一级入口默认进入已有知识内容，并提供二级栏目悬浮菜单；修正目录 `index.mdx` 被错误拼进 URL 导致的 404。AI 解答改为导航栏教程入口，移除固定悬浮引导，侧栏避开顶部导航。

## 2026-08-30

- 优化首页首屏文案、内容标签、粒子背景和技术栈 LogoLoop 的响应式排布；将主文案与底部滚动条纳入同一纵向 flex 容器，便于按视口高度调整首屏节奏。
- 调整全站顶部导航视觉，移除重复的 Docs 入口，新增可打开 Fumadocs 搜索弹窗的顶部搜索按钮，并统一贡献入口文案为“参与文档贡献”。
- 将文档页默认的 GitHub/主题切换工具从侧边栏底部收拢到全站顶部导航，并让顶部导航复用 Fumadocs 文档区的背景、边框和文字变量，降低正文区与顶部导航的视觉割裂。
- 首页导航改为覆盖首屏的透明样式，文档页继续使用不透明主题背景；补齐首页暗色视觉，并通过单次内容目录扫描、降低粒子密度、移除运动元素的模糊滤镜和后台暂停逐帧动画收敛性能开销。
- 补全“参与文档贡献”的项目仓库地址、Fork/分支/提交/PR 流程和 PR 检查清单，并统一全站仓库入口。

## 2026-08-29

- 新增全站固定顶部导航，统一首页和 `/docs/**` 的主入口，并用独立强调入口指向站内开源贡献指南。
- 首页改为导航栏下的全屏动效首屏，移除原占位用的站点能力亮点和内容地图模块，继续复用 `lib/content.ts` 的内容统计链路。
- 接入 ReactBits `LogoLoop` 和个人主页同款 `particles.js` 浅色粒子背景；`LogoLoop` 的图标来源改为 `lib/home-visuals.tsx` 中的技术栈白名单，并使用 `simple-icons` 提供品牌图标。
- 新增 `content/docs/dev/conventions/open-source-contribution.md`，将贡献内容、资源推荐格式和提交前检查沉淀为站内文档。

## 2026-08-27

- 新增文档页 AI 解释挂件方案，支持用户在浏览器本地配置 OpenAI-compatible `baseURL`、`apiKey` 和 `model`，选中文档正文后通过右侧栏流式解释引用内容。
- 新增 `/api/ai/explain` 作为 AI SDK serverless 转发接口，服务端不持久化用户密钥，并对 `baseURL`、引用长度和问题长度做校验；生产环境限制 HTTPS 和允许域名，并拦截本机、内网、链路本地地址及 provider 重定向。
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
