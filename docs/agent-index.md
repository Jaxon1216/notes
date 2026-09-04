# Agent 文档索引

本文是 Agent 参与 Easton Notes 维护时的上下文入口。开始任何改动前，先读 `AGENTS.md`，再按任务类型读取本文列出的文档。

## 必读顺序

1. `AGENTS.md`：仓库级协作规则、目录约束和验证要求。
2. `docs/agent-index.md`：当前文档索引和任务路由。
3. 按任务类型读取下方对应文档。

## 任务路由

| 任务类型 | 先读文档 | 重点 |
| --- | --- | --- |
| 新增或修改文章 | `docs/writing-style.md` | 标题层级、目录位置、图片位置、代码块规则 |
| 修改首页、导航、文档路由、搜索 | `docs/architecture.md` | Fumadocs 接入点、首页数据链路、配置边界 |
| 准备 PR 或提交前自检 | `docs/pull-request.md` | commit message、检查命令、review checklist |
| 修改长期方向或阶段任务 | `docs/todo.md` | P0/P1/P2/P3 目标和待办 |
| 记录架构决策或构建链路变化 | `docs/changelog.md` | 仓库级重大变更记录 |
| 遇到渲染、构建、内容兼容问题 | `docs/qa/` | 已知问题、排查方式和复盘模板 |

## 关键文件索引

| 文件 | 用途 |
| --- | --- |
| `site.config.ts` | 一级方向、子栏目、首页展示文案 |
| `lib/source.ts` | Fumadocs 内容源和 MDX 配置 |
| `lib/content.ts` | 首页文章统计和首篇文章链接 |
| `app/page.tsx` | 首页 UI |
| `app/docs/layout.tsx` | 文档区布局和侧边栏 |
| `app/docs/[[...slug]]/page.tsx` | 文档页面渲染 |
| `app/api/search/route.ts` | Fumadocs 搜索接口 |
| `components/mdx.tsx` | MDX 组件覆盖 |
| `scripts/check-content-style.cjs` | 文章标题结构检查 |
| `scripts/check-html-tags.cjs` | Vue 笔记 HTML 标签闭合检查 |
| `commitlint.config.cjs` | commit message 规则 |

## 常用工作流

新增文章：

```text
读取 AGENTS.md -> 读取 writing-style.md -> 选择 content/docs 目录 -> 新增文章 -> 更新必要的 meta.json -> npm run check:content -> npm run check:images -> npm run build
```

修改信息架构：

```text
读取 AGENTS.md -> 读取 architecture.md -> 修改 site.config.ts -> 调整 content/docs 目录和 meta.json -> 更新 changelog/todo -> npm run validate
```

修改构建或脚本：

```text
读取 AGENTS.md -> 读取 architecture.md 和 pull-request.md -> 修改 package.json/scripts/.github/.husky -> 更新 changelog -> npm run validate
```

## 验证入口

最小内容检查：

```bash
npm run check:content
npm run check:images
```

完整 PR 检查：

```bash
npm run validate
```

涉及导航、首页、目录、样式、Fumadocs 配置或构建链路时，必须至少运行：

```bash
npm run build
```
