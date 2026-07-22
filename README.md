# Easton Notes

一个基于 [VitePress](https://vitepress.dev/) 的个人技术知识库，面向前端、服务端、算法、Agent 应用开发和个人开发常用资料整理。

## 本地运行

启动开发服务：

```bash
npm run docs:dev
```

这个命令会先根据当前目录重新生成首页 `index.md`，再启动 VitePress。新增文件或调整目录后，如果页面没有出现，重启开发服务即可。

生产构建：

```bash
npm run docs:build
```

本地预览构建产物：

```bash
npm run docs:preview
```

## 目录结构

```text
frontend/
  knowledge/    # 前端知识八股
  interview/    # 前端面经
  resources/    # 前端优质好文项目

backend/
  knowledge/    # 服务端知识八股
  interview/    # 服务端面经
  resources/    # 服务端优质好文项目

agent/
  knowledge/    # Agent 应用开发知识八股
  interview/    # Agent 应用开发面经
  resources/    # Agent 应用开发优质好文项目

algorithm/
  basics/       # 算法基础、STL 和 C++ 常用知识
  leetcode/     # LeetCode 专题与刷题复盘

dev/
  conventions/  # 开发规范
  linux/        # Linux 常用命令
  git/          # Git 基础
  tools/        # 工具配置
  notes/        # 杂记与读书
```

站点导航、侧边栏和首页入口由 `site.config.cjs` 统一描述。新增一级方向或调整栏目时，先更新 `site.config.cjs`，再新增对应目录。

## 新增笔记

1. 选择合适目录，例如 `frontend/knowledge/React/` 或 `algorithm/leetcode/`。
2. 新增 Markdown 文件，文件名使用清晰标题，可带数字前缀控制排序，例如 `01-核心概念.md`。
3. 文章内图片放在当前专题附近的 `img/` 目录，使用相对路径引用。
4. 运行 `npm run docs:dev` 检查首页、导航和侧边栏。
5. 提交前运行 `npm run docs:build`。

## 贡献优质好文项目

优质好文和项目推荐放在各方向的 `resources/` 目录下，例如：

```text
frontend/resources/
backend/resources/
agent/resources/
```

推荐新增文章使用这个结构：

```markdown
# 推荐标题

## 链接

- 原文或项目：<https://example.com>

## 推荐理由

用 2-5 句话说明它解决了什么问题、适合谁读、为什么值得收录。

## 标签

- React
- 工程化
- 性能优化
```

请避免提交：

- 没有推荐理由的链接堆叠。
- 明显重复或质量较低的内容。
- 与当前目录结构无关的文件。
- 未经说明的大规模目录调整。

## 提 PR 的建议流程

1. 从最新主分支创建分支。
2. 只改和本次贡献相关的 Markdown、图片或配置。
3. 本地运行 `npm run docs:build`。
4. PR 标题写清楚方向和内容，例如 `docs: add frontend performance resources`。
5. PR 描述里说明新增内容放在哪个目录、为什么值得收录。

## 常见维护点

- 首页生成：`scripts/generate-dashboard.cjs`
- 站点信息架构：`site.config.cjs`
- VitePress 配置：`.vitepress/config.mts`
- 主题样式：`.vitepress/theme/custom.css`
- 本地搜索：`.vitepress/config.mts` 的 `themeConfig.search`

