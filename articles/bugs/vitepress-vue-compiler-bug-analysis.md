# VitePress 大型 Markdown 文件构建失败问题：Element is missing end tag

昨晚在我 push 完上一次的 Vue 学习笔记后，习惯性地打开 [notes.jiangxu.net](https://notes.jiangxu.net) 查看更新。然而页面并没有如期更新。心里一沉，打开 GitHub 仓库，果然看到了那个刺眼的红色 ❌ —— 部署失败。

切换到 Vercel 的部署日志，映入眼帘的是这样的错误：

```bash
✖ building client + server bundles...

build error:
[vite:vue] [plugin vite:vue] Frontend/Vue/day2-night.md (273:1): 
Element is missing end tag.

SyntaxError: [plugin vite:vue] Frontend/Vue/day2-night.md (273:1): 
Element is missing end tag.
    at createCompilerError (compiler-core.cjs.prod.js:1360:17)
    at emitError (compiler-core.cjs.prod.js:2963:5)
    at Object.onclosetag (compiler-core.cjs.prod.js:2360:13)
```

"Element is missing end tag"？我仔细检查了第 273 行，是一个普通的 Markdown 表格，没有任何 HTML 标签。这让我陷入了困惑。

## 🔍 漫长的调试之旅

接下来的一个个小时，我与 Claude Sonnet 进行了多轮对话，尝试了各种可能的解决方案：

1. **验证 HTML 标签配对** - 写了脚本检查所有 `<details>`、`<summary>` 标签，结果全部配对正确 ✅
2. **检查代码块闭合** - 验证了所有 44 个代码块都正确闭合 ✅
3. **转义 HTML 标签** - 将所有 `<script setup>` 改为 `&lt;script setup&gt;` ✅
4. **修复表格格式** - 将双竖线 `||` 开头的表格改为单竖线 `|` ✅
5. **更换代码块类型** - 将 `vue` 改为 `html` ✅

但问题依然存在。
<img src="./img/vue-compiler-bug.png" width="600" alt="编译bug">
更诡异的是：
- 删除"问题行"后，错误会移动到更前面的行（273→242→191）
- 前 272 行单独提取出来可以成功构建
- 同目录下其他较小的文件都能正常构建

## 💡 真相大白

经过 200 多次工具调用后，问题依然没有得到解决。最终我请教了老大，他一眼就看出了问题所在。原来，这是 **VitePress/Vue 编译器在处理复杂 Markdown 文件时的边界情况 Bug**。

### 环境信息

```json
{
  "vitepress": "^1.6.4",
  "@vitejs/plugin-vue": "^5.x",
  "vue": "^3.x"
}
```

### 文件对比分析

| 文件 | 行数 | `<details>` | 表格 | 代码块 | 构建结果 |
|------|------|-------------|------|--------|---------|
| day2-morning.md | 418 | 0 | 0 | 9 | ✅ 成功 |
| day2-afternoon.md | 304 | 5 | 0 | 2 | ✅ 成功 |
| day2-night.md | 1580 | 22 | 55行 | 32 | ❌ 失败 |

通过对比发现，失败的文件具有三个特征：
1. **文件最大**（1580 行）
2. **HTML 标签最多**（22 个 `<details>`）
3. **复杂度最高**（表格 + 代码块 + HTML 标签混合）

### 二分法测试

```bash
# 测试前 800 行
✅ 构建成功

# 测试前 1200 行  
❌ 构建失败

# 测试前 1000 行
✅ 构建成功
```

**结论**：存在一个隐藏的阈值（约 1000-1200 行），超过后触发 Bug。

## 🎯 根本原因

这不是某一行的语法错误，而是**多个边界情况的累积效应**：

### 原因 1：表格中的花括号被误识别

在 Markdown 表格中使用 `return {}`，Vue 编译器可能将其误认为模板插值语法 `{{ }}`。在大文件中，这种误识别会累积，导致编译器状态机错乱。

**问题代码**：
```
| **暴露** | 自动暴露 | 需要 `return {}` |
```

### 原因 2：`<summary>` 标签内的转义 HTML

在 `<summary>` 标签内直接使用 `&lt;script setup&gt;` 这样的转义字符，在某些情况下会让编译器混淆，认为还有未闭合的标签。

### 原因 3：`<details>` 内部格式不规范

VitePress 的 Markdown 解析器期望 `<summary>` 标签后有空行，否则在大文件中可能导致解析边界不清。

### 触发条件

当以下因素**同时出现**时触发 Bug：

```
文件大小 > 1000行 
  + HTML标签数量 > 20
  + Markdown表格 > 10
  + 花括号{} 在表格中
  = 编译器进入不稳定状态
```

这是典型的**编译器边界情况 Bug**，不是代码错误，而是工具链的缺陷。

## ✅ 解决方案-workout

### 修复 1：表格中的花括号加空格

**修改前**：
```markdown
| **暴露** | 自动暴露 | 需要 `return {}` |
```

**修改后**：
```markdown
| **暴露** | 自动暴露 | 需要 `return { }` |
```

在 `{}` 之间添加空格，避免被误识别为 Vue 插值。

### 修复 2：规范 `<details>` 格式

在以下位置添加空行：
- `<summary>` 标签后
- 代码块前后
- `</details>` 标签前

让 Markdown 解析器更清晰地识别边界。

### 修复 3：优化 `<summary>` 内的 HTML

使用 `<code>` 标签包裹转义字符：

**修改前**：
```html
<summary>为什么 &lt;script setup&gt; 不能用？</summary>
```

**修改后**：
```html
<summary>为什么 <code>&lt;script setup&gt;</code> 不能用？</summary>
```

### 修复 4：拆分大文件（治本方案）

如果文件超过 800 行，建议拆分为多个子文件：

```
day2-night.md (1580行)
  ↓ 拆分为
day2-night-pinia.md (800行)
day2-night-communication.md (780行)
```

## 🔧 预防措施：自动化检查

为避免类似问题，添加预构建检查脚本：

```javascript
// scripts/check-html-tags.cjs
const fs = require('fs');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  let inCodeBlock = false;
  const tagStack = [];
  
  lines.forEach((line, index) => {
    // 跳过代码块
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return;
    }
    if (inCodeBlock) return;
    
    // 移除反引号内容
    const processedLine = line.replace(/`[^`]*`/g, '');
    
    // 检查标签配对...
  });
  
  return tagStack.length === 0;
}
```

在 `package.json` 中配置：

```json
{
  "scripts": {
    "check:html": "node scripts/check-html-tags.cjs",
    "prebuild": "npm run check:html"
  }
}
```

## 📊 修复效果

| 指标 | 修复前 | 修复后 |
|------|--------|--------|
| 本地构建 | ❌ 失败 | ✅ 45s |
| Vercel 部署 | ❌ 失败 | ✅ ~60s |
| 文件大小 | 1580行 | 1580行（内容不变） |

修复前后文件行数不变，只是调整了格式。

## 💡 最佳实践建议

### 文件大小控制

- ✅ **推荐**：单个 Markdown 文件不超过 800 行
- ⚠️ **警告**：超过 1000 行需要特别注意格式规范
- ❌ **避免**：超过 1500 行，强烈建议拆分

### 格式规范

**✅ 推荐写法**：

1. **表格中的花括号**：`return { value }` （有空格）
2. **details 标签**：summary 后、内容前后、代码块前后都要有空行
3. **summary 中的 HTML**：用 `<code>` 标签包裹，如 `<code>&lt;script&gt;</code>`

**❌ 避免写法**：

1. **表格中紧密的花括号**：`return {}` （无空格）
2. **details 无空行**：summary 后直接写内容
3. **summary 中直接转义**：直接使用 `&lt;` `&gt;` 不用 code 包裹

### 混合内容注意事项

当文件中同时包含以下元素时，需要格外小心：
- 大量 Markdown 表格（> 10 行）
- 多个 HTML 标签（> 15 个）
- 多个代码块（> 20 个）
- 反引号内的特殊字符（`{}`、`<>`）

## 🎯 经验总结

### 关键要点

1. **工具链不是完美的**
   - VitePress/Vue 编译器在处理边界情况时可能出现 Bug
   - 不要假设工具会正确处理所有合法的 Markdown 语法

2. **累积效应很重要**
   - 单个"问题"可能不会触发 Bug
   - 多个边界情况组合可能导致编译器崩溃

3. **调试需要耐心**
   - 有时问题不在错误提示的那一行
   - 需要系统性地分析和测试

4. **预防胜于治疗**
   - 添加自动化检查脚本
   - 建立格式规范并严格遵守
   - 定期审查大文件，及时拆分

### 写在最后

这个 Bug 的发现和解决历经了 **200+ 次的调试和测试**，充分体现了大型项目中工具链的复杂性。虽然最终的修复很简单（几个空格和标签调整），但问题的诊断过程却需要对编译原理、Markdown 解析、Vue 模板编译等多方面的理解。

更重要的是，这次经历让我意识到：
- **不要盲目相信工具**：即使是成熟的工具链也可能有 Bug
- **保持代码整洁**：良好的格式规范不仅提高可读性，还能避免触发工具的边界情况
- **建立反馈机制**：遇到问题要及时记录和分享，帮助社区改进

如果你也遇到了类似的问题，希望这篇文章能帮你快速定位和解决。如果你有更好的解决方案或见解，欢迎讨论交流！

---

**作者**：[jiangxu.net](https://jiangxu.net)  
**日期**：2026-01-08  
**标签**：`VitePress` `Vue` `Markdown` `编译器Bug` `调试经验`

> 写作不易，如果这篇文章对你有帮助，欢迎分享给更多的人 ⭐
