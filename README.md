# 学习笔记项目维护指南

本项目基于 [VitePress](https://vitepress.dev/) 构建，用于记录八股面试，日常学习，刷题的学习笔记。

## 🚀 快速开始

### 1. 启动本地开发服务器
此命令会先执行脚本生成首页 Dashboard，然后启动 VitePress 服务。
```bash
npm run docs:dev
```
> **注意**：当你添加了新文件或修改了目录结构后，需要**重启**此命令，以便重新生成侧边栏和首页索引。

### 2. 构建生产版本
```bash
npm run docs:build
```

---

## 🛠 常见开发场景

### 场景一：我想更改首页（Dashboard）的显示结构

首页内容（`index.md`）并非手动维护，而是由脚本自动生成的。

- **修改位置**：`scripts/generate-dashboard.cjs`
- **如何修改**：
  - 该脚本读取所有 `.md` 文件的修改时间，生成 "最近更新" 列表。
  - 可以在 `generateDashboard` 函数中修改 HTML 模板字符串，调整首页的布局、颜色或显示的文字。
  - 如果需要修改首页顶部的 Hero 区域（标题、按钮），也在该文件的 `content` 变量中修改 YAML Frontmatter 部分。

### 场景二：我想更改侧边栏（左侧栏）的显示文字

侧边栏是根据文件目录结构自动生成的，生成逻辑在配置文件中。

- **修改位置**：`.vitepress/config.mts`
- **如何修改**：
  1. **修改文件夹显示的名称**（如 `DataStructure` -> `数据结构`）：
     - 找到 `DIR_MAPPING` 常量。
     - 在对象中添加或修改映射关系，例如：`'MyFolder': '我的文件夹'`。
     - **注意**：最好同步修改 `scripts/generate-dashboard.cjs` 中的 `DIR_MAPPING`，以保证首页显示的分类名称一致。
  2. **修改文件显示的名称**：
     - 默认情况下，侧边栏直接显示文件名（不含 `.md` 后缀）。
     - 特殊处理：`note.md` 会显示为 "笔记"，`README.md` 会显示为 "简介"。
     - 若要修改其他文件的显示名称，目前最简单的方法是**重命名该 `.md` 文件**。

### 场景三：我想调整顶部导航栏（Navbar）

- **修改位置**：`.vitepress/config.mts`
- **如何修改**：
  - 找到 `themeConfig.nav` 数组。
  - 按需修改 `text`（显示文字）或 `link`（跳转链接）。
  - 下拉菜单可以通过 `items` 数组嵌套实现。

### 场景四：添加了新文章但侧边栏没显示

- **原因**：VitePress 的配置文件（包括侧边栏生成逻辑）通常只在服务启动时加载一次。
- **解决**：在终端中按 `Ctrl + C` 停止服务，然后再次运行 `npm run docs:dev`。

## 📂 目录结构说明

```text
.
├── .vitepress/
│   ├── config.mts          # 核心配置文件 (侧边栏、导航栏、网站标题等)
│   └── theme/              # 自定义主题样式
├── scripts/
│   └── generate-dashboard.cjs # 首页生成脚本
├── DataStructure/          # 数据结构笔记目录
├── Leetcode/               # Leetcode 刷题笔记目录
├── articles/               # 其他文章
└── package.json            # 项目依赖和脚本定义
```
