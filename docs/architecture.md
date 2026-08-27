# 项目架构

本文记录 Easton Notes 的工程结构、渲染链路和主要维护边界。涉及技术栈、目录、首页、导航、搜索、构建或协作规则的改动，优先同步更新本文。

## 技术栈

- Next.js App Router：负责应用路由、页面渲染、构建和静态生成。
- React + TypeScript：负责页面和组件实现。
- Fumadocs：负责 Markdown/MDX 内容加载、文档布局、文档树和搜索源。
- Tailwind CSS v4：通过 `app/global.css` 引入全局样式能力。
- AI SDK：负责文档页 AI 解释挂件的 OpenAI-compatible 模型调用和流式输出。
- Vercel Analytics：仅在 Vercel 环境中启用访问统计。
- Husky + commitlint：本地提交信息校验。

## 目录分层

```text
app/
  page.tsx                    # 首页
  layout.tsx                  # 全站根布局和 Fumadocs RootProvider
  global.css                  # 全局样式和 Fumadocs 样式引入
  api/search/route.ts         # Fumadocs 搜索接口
  api/ai/explain/route.ts     # AI 解释挂件的模型调用转发接口
  docs/
    layout.tsx                # 文档区布局
    [[...slug]]/page.tsx      # 文档动态路由

components/
  ai/                         # 文档页 AI 解释挂件
  mdx.tsx                     # MDX 组件覆盖，例如图片渲染

content/docs/
  meta.json                   # Fumadocs 根文档树配置
  index.mdx                   # 文档总览页
  frontend/                   # 前端内容
  backend/                    # 服务端内容
  algorithm/                  # 算法内容
  agent/                      # Agent 应用开发内容
  dev/                        # 个人开发常用内容

lib/
  ai/config.ts                # AI 挂件共享类型、提示词和限制配置
  source.ts                   # Fumadocs 内容源
  content.ts                  # 首页统计和首篇文章链接
  layout.shared.tsx           # 导航等共享布局配置

scripts/
  check-content-style.cjs     # Markdown/MDX 写作结构检查
  check-images.cjs            # Markdown/MDX 图片引用检查
  check-html-tags.cjs         # Vue 笔记 HTML 标签闭合检查

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

## AI 解释挂件

文档页提供一个桌面端 AI 解释挂件，核心文件：

- `components/ai/ai-explain-widget.tsx`：文档 AI 挂件总入口，组合选区监听、触发浮标和右侧栏。
- `components/ai/use-text-selection.ts`：监听正文区域选中文本，只响应 `[data-ai-doc-content]` 内部选区。
- `components/ai/ai-selection-trigger.tsx`：选区旁的 AI 解释触发按钮。
- `components/ai/ai-explain-sidebar.tsx`：最右侧解释侧栏，负责会话 UI、流式输出和继续追问。
- `components/ai/ai-settings-form.tsx`：用户模型配置表单。
- `components/ai/ai-config-storage.ts`：浏览器 localStorage 配置读写。
- `lib/ai/config.ts`：共享类型、默认问题、内置提示词和长度限制。
- `app/api/ai/explain/route.ts`：Next.js Route Handler，使用 AI SDK 转发到用户配置的 OpenAI-compatible 模型服务。

挂件只在 `/docs/**` 文档布局中挂载。用户配置项包括 `baseURL`、`apiKey` 和 `model`，只保存在当前浏览器的 `localStorage:easton-ai-config-v1` 中；每次请求会随请求体传给 `/api/ai/explain`，服务端仅用于本次转发，不持久化密钥。

`/api/ai/explain` 只支持 OpenAI-compatible 模型服务。生产环境会限制 `baseURL` 为 HTTPS，并要求域名在内置允许列表或 `AI_ALLOWED_BASE_URL_HOSTS` 环境变量中；本地开发环境允许 `localhost` 和 `127.0.0.1`，便于调试 LM Studio/Ollama 兼容接口。接口还会解析域名并拦截本机、内网、链路本地等地址，模型请求不跟随重定向。

第一版只把用户选中的文本作为引用上下文，不自动读取附近段落、整篇文章或全站内容。移动端小于 `1024px` 时隐藏入口和侧栏。

## 内容渲染链路

1. 作者在 `content/docs/**` 下新增或修改 Markdown/MDX。
2. Fumadocs MDX macro 在构建期读取 `content/docs/**/*.md(x)` 和 `meta.json`。
3. `lib/source.ts` 将文档内容转换为 Fumadocs source。
4. `app/docs/[[...slug]]/page.tsx` 根据 URL slug 找到对应 page，生成 metadata 并渲染 MDX。
5. `app/docs/layout.tsx` 用 `source.getPageTree()` 生成文档树和侧边栏。
6. `app/api/search/route.ts` 基于同一个 source 生成搜索数据。

## 首页数据链路

首页不走 Fumadocs 文档树，而是使用独立的数据统计逻辑：

1. `site.config.ts` 维护一级方向、子栏目名称和描述。
2. `lib/content.ts` 扫描 `content/docs/<section>` 下的 Markdown/MDX 文件。
3. `app/page.tsx` 用统计结果渲染首页栏目入口、文章数和首篇文章链接。

新增一级方向或调整栏目时，不要在多个页面重复写配置。先改 `site.config.ts`，再补对应目录和 `meta.json`。

## 配置边界

- 信息架构：`site.config.ts`
- 文档树顺序和目录标题：`content/docs/**/meta.json`
- 文档内容源：`lib/source.ts`
- 文档路由：`app/docs/[[...slug]]/page.tsx`
- 文档布局：`app/docs/layout.tsx`
- AI 解释接口：`app/api/ai/explain/route.ts`
- AI 挂件 UI：`components/ai/`
- 首页：`app/page.tsx`、`lib/content.ts`
- 全局样式：`app/global.css`
- 共享导航：`lib/layout.shared.tsx`
- 写作结构检查：`scripts/check-content-style.cjs`
- Vercel 部署命令：`vercel.json`

## 本地检查

常用命令：

```bash
npm run check:content
npm run check:images
npm run check:vue:tags
npm run typecheck
npm run docs:build
npm run validate
```

`npm run validate` 是 PR 前的总检查入口。它会依次执行内容结构检查、图片引用检查、Vue 笔记标签检查、TypeScript 检查和生产构建。

## 部署

Vercel 通过 `vercel.json` 固定安装和构建命令：

```json
{
  "installCommand": "npm ci",
  "buildCommand": "npm run validate"
}
```

这样 Preview Deployment 和 Production Deployment 都会先跑内容规范、Vue 标签闭合、TypeScript 和 Next.js 构建。不要在 Vercel 面板里配置旧的 VitePress 输出目录；Next.js 项目不需要手动设置 Output Directory。
