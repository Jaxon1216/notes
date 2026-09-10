# 项目架构

本文记录 Easton Notes 的工程结构、渲染链路和主要维护边界。涉及技术栈、目录、首页、导航、搜索、构建或协作规则的改动，优先同步更新本文。

## 技术栈

- Next.js App Router：负责应用路由、页面渲染、构建和静态生成。
- React + TypeScript：负责页面和组件实现。
- Fumadocs：负责 Markdown/MDX 内容加载、文档布局、文档树和搜索源。
- Zod：基于 Fumadocs `pageSchema` 校验统一的文档 frontmatter。
- Tailwind CSS v4：通过 `app/global.css` 引入全局样式能力。
- ReactBits LogoLoop：负责首页技术栈横向循环动效。
- particles.js：复用个人主页同款浅色粒子背景。
- Simple Icons：负责首页技术栈 LogoLoop 的品牌图标来源。
- AI SDK：负责文档页 AI 解释挂件的 OpenAI-compatible 模型调用和流式输出。
- Vitest：独立运行 TypeScript 单元测试，不参与 Next.js 的开发或生产构建。
- Vercel Analytics：仅在 Vercel 环境中启用访问统计。
- Husky + commitlint：本地提交信息校验。

## 目录分层

```text
app/
  page.tsx                    # 首页
  layout.tsx                  # 全站根布局和 Fumadocs RootProvider
  global.css                  # 全局样式和 Fumadocs 样式引入
  robots.ts                   # 搜索引擎抓取规则
  sitemap.ts                  # 首页与全部文档 URL
  api/search/route.ts         # Fumadocs 搜索接口
  api/ai/explain/route.ts     # AI 解释挂件的模型调用转发接口
  docs/
    layout.tsx                # 文档区布局
    [[...slug]]/page.tsx      # 文档动态路由

components/
  ai/                         # 文档页 AI 解释挂件
  home/                       # 首页模块组件
  docs/                       # 文档页可复用目录与空态组件
  reactbits/                  # ReactBits 动效组件落地代码
  site/                       # 全站共享导航
  mdx.tsx                     # MDX 组件覆盖，例如图片渲染

content/docs/
  meta.json                   # Fumadocs 根文档树配置
  index.mdx                   # 文档总览页
  frontend/                   # 前端内容
  backend/                    # 服务端内容
  algorithm/                  # 算法内容
  agent/                      # Agent 应用开发内容
    knowledge/agent/
      Agent应用开发.md         # Agent 应用开发专题总览，保留稳定入口
      agent-development/      # 按主题拆分的 Agent 应用开发文章
  dev/                        # 个人开发常用内容

lib/
  ai/config.ts                # AI 挂件共享类型、提示词和限制配置
  ai/explain-request.ts       # AI 请求体读取、结构校验和字段限制
  ai/fixed-window-rate-limit.ts # 进程内 best-effort 固定窗口限流
  ai/provider-url.ts          # Provider URL、allowlist、DNS 和私网校验
  frontmatter.ts              # 基于 Zod 的共享文档 frontmatter schema
  site-url.ts                 # 部署环境与本地环境的站点 URL 解析
  source.ts                   # Fumadocs 内容源
  content.ts                  # 首页统计和首篇文章链接
  resource-directory.ts       # 优质资源文章/项目目录数据与校验
  site-navigation.ts          # 顶部导航受控状态与当前领域解析
  layout.shared.tsx           # 导航等共享布局配置

scripts/
  check-content-style.cjs     # Markdown/MDX 写作结构检查
  check-images.cjs            # Markdown/MDX 图片引用检查
  check-html-tags.cjs         # Vue 笔记 HTML 标签闭合检查

tests/                        # 业务逻辑、配置边界和静态回归单元测试
vitest.config.ts              # Vitest 路径别名配置

public/
  favicon.svg                 # 浏览器标签页矢量图标
  site-icon.png               # 180x180 Apple Touch Icon，路径保持兼容

vercel.json                   # Vercel 安装和构建命令

docs/
  architecture.md             # 项目架构
  writing-style.md            # 写作规范
  pull-request.md             # PR 规范和流程
  agent-index.md              # Agent 协作索引
  changelog.md                # 仓库级变更记录
  todo.md                     # 长期目标和阶段任务
  qa/                         # 常见问题和自检经验
```

## Fumadocs 接入点

这个项目没有单独的 `fumadocs.config.ts`。Fumadocs 分散接入在几个关键文件里：

- `next.config.mjs`：通过 `createMDX` 接入 Fumadocs MDX，并指定 macro 入口 `./lib/source.ts`。
- `lib/source.ts`：通过 `defineDocs` 声明 `content/docs` 为文档源，通过 `loader` 输出 Fumadocs source。
- `app/docs/layout.tsx`：通过 `DocsLayout` 渲染文档区布局和侧边栏。
- `app/docs/[[...slug]]/page.tsx`：通过 `source.getPage` 读取页面，再用 Fumadocs 的 `DocsPage`、`DocsTitle`、`DocsBody` 渲染。
- `app/api/search/route.ts`：通过 `createFromSource(source)` 暴露搜索接口。
- `components/mdx.tsx`：复用 `fumadocs-ui/mdx` 默认组件，并覆盖远程图片渲染逻辑。
- `app/global.css`：引入 `fumadocs-ui/css/neutral.css` 和 `fumadocs-ui/css/preset.css`。

因此，调整 Fumadocs 内容、路由、MDX 行为或文档样式时，优先从这些文件查起。

## 站点 Metadata 与图标

`lib/site-url.ts` 统一解析站点源地址，依次读取 `NEXT_PUBLIC_SITE_URL`、
`VERCEL_PROJECT_PRODUCTION_URL` 和 `VERCEL_URL`，自动补全 Vercel 域名的 HTTPS
协议并移除尾部斜杠；本地未配置时明确回退到 `http://localhost:3000`。

`app/layout.tsx` 统一维护 `metadataBase`、首页 canonical、基础 OpenGraph/Twitter
Metadata 和图标。文档动态路由使用各自的 Fumadocs 页面 URL 生成 canonical 与
OpenGraph URL，避免所有文章继承首页地址。`app/robots.ts` 开放全站抓取并声明
sitemap，`app/sitemap.ts` 通过 `source.getPages()` 动态输出首页和全部文档 URL。

普通浏览器 favicon 指向轻量的 `/favicon.svg`；Apple Touch Icon 指向规范的
180x180 PNG `/site-icon.png`。后者保留原公开路径以兼容旧引用，资源用途和尺寸约束
记录在 `public/README.md`。

## AI 解释挂件

文档页提供一个桌面端 AI 解释挂件，核心文件：

- `components/ai/ai-explain-widget.tsx`：文档 AI 挂件总入口，组合选区监听、触发浮标和右侧栏。
- `components/ai/use-text-selection.ts`：监听正文区域选中文本，只响应 `[data-ai-doc-content]` 内部选区。
- `components/ai/ai-selection-trigger.tsx`：选区旁的 AI 解释触发按钮。
- `components/ai/ai-explain-sidebar.tsx`：最右侧解释侧栏，负责会话 UI、流式输出和继续追问。
- `components/ai/ai-settings-form.tsx`：用户模型配置表单。
- `components/ai/ai-config-storage.ts`：浏览器 localStorage 配置读写。
- `lib/ai/config.ts`：共享类型、默认问题、内置提示词和长度限制。
- `lib/ai/explain-request.ts`：请求体字节限制、消息结构和字段长度校验。
- `lib/ai/fixed-window-rate-limit.ts`：无外部依赖的进程内固定窗口限流。
- `lib/ai/provider-url.ts`：Provider URL allowlist、DNS 解析和非公网地址校验。
- `app/api/ai/explain/route.ts`：Next.js Route Handler，使用 AI SDK 转发到用户配置的 OpenAI-compatible 模型服务。

挂件只在 `/docs/**` 文档布局中挂载。用户配置项包括 `baseURL`、`apiKey` 和 `model`，只保存在当前浏览器的 `localStorage:easton-ai-config-v1` 中；每次请求会随请求体传给 `/api/ai/explain`，服务端仅用于本次转发，不持久化密钥。

`/api/ai/explain` 只支持 OpenAI-compatible 模型服务。请求体按声明的 `Content-Length` 和实际读取的 UTF-8 字节双重限制为 128 KiB；只接受最多 24 条 `user`/`assistant` 文本消息，单条最多 8,000 字符、总计最多 24,000 字符，用户问题仍限制为 1,000 字符，引用仍限制为 4,000 字符。每条消息最多包含 8 个文本 part。`baseURL`、`apiKey`、`model`、各类 `id`、`pageTitle`、`pageUrl` 分别限制为 2,048、4,096、256、128、300、2,048 字符。

生产环境会限制 `baseURL` 为 HTTPS，并要求域名精确匹配内置允许列表或 `AI_ALLOWED_BASE_URL_HOSTS` 环境变量；多个自定义中转站域名使用逗号分隔，只填写 hostname，不带协议、端口或路径。本地开发环境只额外允许 `localhost` 和 `127.0.0.1` 使用 HTTP，便于调试 LM Studio/Ollama 兼容接口。接口还会解析域名并拦截本机、内网、链路本地及其他非公网地址，模型请求不跟随重定向。

接口按代理提供的客户端 IP 执行 best-effort 固定窗口限流：每个热实例内每个客户端每 60 秒最多 10 次请求，状态 Map 最多保留 10,000 个客户端；超过限制返回 `429` 和 `Retry-After`。该限制不依赖外部服务，因此不保证跨实例全局计数。Provider 调用错误统一转换为固定提示，不向客户端回显密钥或上游错误详情。

第一版只把用户选中的文本作为引用上下文，不自动读取附近段落、整篇文章或全站内容。移动端小于 `1024px` 时隐藏入口和侧栏。

## 内容渲染链路

1. 作者在 `content/docs/**` 下新增或修改 Markdown/MDX。
2. Fumadocs MDX macro 在构建期读取 `content/docs/**/*.md(x)` 和 `meta.json`，并
   使用 `lib/frontmatter.ts` 的共享 schema 校验可选元数据。
3. `lib/source.ts` 将校验后的文档内容转换为 Fumadocs source。
4. `app/docs/[[...slug]]/page.tsx` 根据 URL slug 找到对应 page，生成 metadata 并渲染 MDX。
5. `app/docs/layout.tsx` 用 `source.getPageTree()` 生成文档树和侧边栏。
6. `app/api/search/route.ts` 基于同一个 source 生成搜索数据。

大型连续专题优先保留一个稳定的总览页面，再将正文拆到带数字前缀的子目录中；专题子目录使用 `meta.json` 固定侧边栏顺序。`Agent应用开发.md` 采用这一结构承接原有 URL，具体内容位于 `agent-development/`。

## 首页数据链路

首页不走 Fumadocs 文档树，而是使用独立的数据统计逻辑：

1. `site.config.ts` 维护一级方向、子栏目名称和描述。
2. `lib/content.ts` 单次扫描 `content/docs/` 下的 Markdown/MDX 文件，再按一级方向和子栏目聚合统计；同一服务端渲染中的首页与导航通过 React `cache` 复用结果。
3. `app/page.tsx` 获取统计结果，并渲染导航栏下的全屏动效首屏。
4. `components/home/home-hero.tsx` 组合浅色粒子背景、轻量入口文案和技术栈 LogoLoop；`components/home/particles-config.ts` 集中维护桌面/移动端的粒子配置。
5. `lib/home-visuals.tsx` 维护首页技术栈 LogoLoop 图标白名单，不从正文自动扫描技术词。

新增一级方向或调整栏目时，不要在多个页面重复写配置。先改 `site.config.ts`，再补对应目录和 `meta.json`。
首页粒子和 LogoLoop 都是客户端逐帧动画：粒子数量按桌面/移动端分档，并在组件卸载时销毁；
两者在页面不可见或用户偏好减少动态效果时停止动画，避免后台标签页持续占用资源。
首页只为主要的“进入文档”入口保留 Next.js 路由预取；内容标签、次要贡献入口和
LogoLoop 中会被复制的技术栈链接关闭自动预取，避免首屏可见链接批量请求 RSC。

优质好文项目页由 `lib/resource-directory.ts` 提供三类领域的类型化文章/项目数据，并由 `components/docs/resource-directory.tsx` 渲染带键盘可用分段控件的资源表。每个已发布条目都必须有 HTTPS 链接、简介、推荐理由和至少一个标签；暂未筛到合适内容的维度使用明确空态。

## 导航链路

全站固定顶部导航由 `components/site/site-header.tsx` 提供，并在 `app/layout.tsx` 中挂载。导航使用 `lib/site-navigation.ts` 的受控状态，任一时刻仅保留一个展开菜单：悬浮会转移菜单归属，点击可固定/关闭，点击栏外、按 Escape 或路由变更都会关闭。当前阅读领域从 `/docs/<section>/...` 推导，并以低干扰的蓝色焦点提示显示；首页和 `/docs` 总览不高亮。CSS 使用首页唯一的 `.home-shell` 标记切换导航外观：首页导航固定覆盖在首屏上且背景透明，非首页导航保持 sticky 并使用不透明的 Fumadocs 主题背景。

`app/docs/layout.tsx` 通过 `DocsLayout.containerProps` 在文档根容器添加 `.docs-layout` 标记。桌面文档继续显示全站头部，并将 `--site-header-height` 传给 Fumadocs 的 `--fd-banner-height`；小于 Fumadocs `md` 断点时，仅隐藏 docs 页面上的全站头部，并在 `.docs-layout` 内把两个高度变量归零。首页移动端不受该规则影响，文档移动端继续使用 Fumadocs 自带的品牌、搜索、侧边栏触发器和页内目录。

Fumadocs `DocsLayout` 仍负责文档树、侧边栏、搜索和正文区域；`lib/layout.shared.tsx` 保留 Fumadocs 布局共享参数，但不再作为全站主导航的唯一入口。全站头部的品牌和栏目菜单保持 Next.js 默认预取；低频的 AI 解答教程与贡献入口关闭自动预取，但仍使用 `Link` 完成客户端导航。

## 配置边界

- 信息架构：`site.config.ts`
- 文档树顺序和目录标题：`content/docs/**/meta.json`
- 文档 frontmatter schema：`lib/frontmatter.ts`
- 文档内容源：`lib/source.ts`
- 文档路由：`app/docs/[[...slug]]/page.tsx`
- 站点 URL 与搜索引擎发现路由：`lib/site-url.ts`、`app/robots.ts`、`app/sitemap.ts`
- 文档布局：`app/docs/layout.tsx`
- AI 解释接口：`app/api/ai/explain/route.ts`
- AI 挂件 UI：`components/ai/`
- 首页：`app/page.tsx`、`lib/content.ts`
- 全站 Metadata 与图标：`app/layout.tsx`、`public/favicon.svg`、`public/site-icon.png`
- 全站固定导航：`components/site/site-header.tsx`，挂载在 `app/layout.tsx`
- 首页视觉配置：`components/home/home-hero.tsx`、`lib/home-visuals.tsx`
- 首页粒子配置：`components/home/particles-config.ts`
- 全局样式：`app/global.css`
- 资源目录数据与组件：`lib/resource-directory.ts`、`components/docs/resource-directory.tsx`
- 共享导航：`lib/layout.shared.tsx`
- 写作结构检查：`scripts/check-content-style.cjs`
- Vercel 部署命令：`vercel.json`

## 本地检查

常用命令：

```bash
npm run check:content
npm run check:images
npm run check:vue:tags
npm run test:unit
npm run typecheck
npm run build
npm run validate
```

`npm run validate` 是 PR 前的总检查入口。它会依次执行内容结构检查、图片引用检查、Vue 笔记标签检查、Vitest 单元测试、TypeScript 检查和生产构建。

## 部署

Vercel 通过 `vercel.json` 固定安装和构建命令：

```json
{
  "installCommand": "npm ci",
  "buildCommand": "npm run validate"
}
```

这样 Preview Deployment 和 Production Deployment 都会先跑内容规范、Vue 标签闭合、TypeScript 和 Next.js 构建。不要在 Vercel 面板里配置旧的 VitePress 输出目录；Next.js 项目不需要手动设置 Output Directory。
