
## 一、基础知识考察

### 1. **什么是响应式布局？核心原理是什么？**
**期望回答：**
- 响应式布局是一种网页设计方法，使网站能自动适应不同设备和屏幕尺寸
- 核心原理：使用**流体网格（Flex/Grid）、弹性图片和媒体查询**的组合
- 关键：同一套代码在不同设备上都能提供良好的用户体验

### 2. **请解释视口（viewport）及其作用**
**期望回答：**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
- `width=device-width`：让页面宽度等于设备屏幕宽度（否则手机浏览器默认会把页面当做 980px 宽的桌面网页来渲染，导致文字极小）。
- `initial-scale=1.0`：初始缩放比例为 1:1，不缩放。
- `user-scalable=no`：禁止用户手动缩放（现代网页通常不建议加，影响无障碍体验）。

### 3. **移动优先（Mobile First）与桌面优先的区别**
**期望回答：**

**移动优先（推荐）：**
```css
/* 1. 先写手机端样式（默认） */
.element { width: 100%; }

/* 2. 逐步增强到平板/桌面 */
@media (min-width: 768px) { 
  .element { width: 50%; } 
}
```
> **原理**：`min-width` 意为“最小宽度”，即“当屏幕宽于 768px 时生效”。这也是现代 CSS 框架（如 Tailwind, Bootstrap）的默认逻辑。

**桌面优先（传统）：**
```css
/* 1. 先写大屏样式 */
.element { width: 50%; }

/* 2. 逐步降级到手机 */
@media (max-width: 767px) { 
  .element { width: 100%; } 
}
```
> **原理**：`max-width` 意为“最大宽度”，即“当屏幕窄于 767px 时生效”。

**优势对比：**
- **移动优先**：代码量通常更少，浏览器渲染性能更好（手机端不加载复杂的大屏样式），符合“渐进增强”思想。
- **桌面优先**：符合旧版 PC 网站改造流程（“优雅降级”）。

## 二、核心技术深入

### 1. **媒体查询常用断点如何设置？**
> **断点（Breakpoint）**：布局发生突变的临界值（如手机变平板的那一瞬间）。

**期望回答：**
```css
/* --- 基于 Bootstrap 5 的标准断点 --- */

/* 1. < 576px (手机竖屏) */
/* 默认样式，不写媒体查询 */

/* 2. ≥ 576px (手机横屏 / 小平板) */
@media (min-width: 576px) { ... }

/* 3. ≥ 768px (iPad 竖屏 / 通用平板) —— 【最重要断点】 */
@media (min-width: 768px) { ... }

/* 4. ≥ 992px (小型笔记本 / iPad Pro 横屏) */
@media (min-width: 992px) { ... }

/* 5. ≥ 1200px (标准桌面显示器) */
@media (min-width: 1200px) { ... }

/* 6. ≥ 1400px (高清大屏) */
@media (min-width: 1400px) { ... }
```

### 2. **Flexbox vs Grid：响应式布局如何选择？**
**期望回答：**

**Flexbox（一维布局）：**
- **特点**：像穿糖葫芦，主要控制**一行**或**一列**。
- **场景**：导航栏、按钮组、标签列表、单向排列的卡片。
- **核心代码**：
```css
.container {
  display: flex;
  flex-wrap: wrap; /* 允许换行，否则会死命挤在一行 */
  gap: 20px;       /* 子元素间距 */
}
.item {
  /* flex: 放大 缩小 基础值 */
  flex: 1 1 200px; /* 空间够就放大，不够就缩小，基础宽 200px */
}
```

**Grid（二维布局）：**
- **特点**：像画棋盘，同时控制**行**和**列**，能实现不对称布局。
- **场景**：整个网页的骨架（Header + Side + Main）、复杂的图片墙、仪表盘。
- **核心代码**（一行实现响应式）：
```css
.container {
  display: grid;
  /* 魔法公式：自动填满，最小 250px，最大 1fr（均分剩余） */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
  gap: 20px;
}
```

### 3. **响应式图片实现方案有哪些？**
**期望回答：**

1. **简单粗暴方案（CSS）：**
```css
img {
  max-width: 100%; /* 图片永远不超过父容器宽度，防止撑爆屏幕 */
  height: auto;    /* 高度自动缩放，防止图片被压扁 */
}
```

2. **性能优化方案（HTML `srcset`）：**
让浏览器根据屏幕分辨率加载不同大小的图片（省流量）。
```html
<img 
  src="small.jpg" 
  srcset="medium.jpg 1000w, large.jpg 2000w" 
  alt="响应式图片"
>
<!-- 
  解释：告诉浏览器，我有一张 1000px 宽的图和一张 2000px 宽的图。
  如果你屏幕是高清屏（2x）或很宽，就去加载 large.jpg；否则加载 medium.jpg。
-->
```

3. **艺术指导方案（HTML `<picture>`）：**
在手机上显示竖图，在电脑上显示横图（不仅仅是缩放，而是**换图**）。
```html
<picture>
  <source media="(min-width: 800px)" srcset="desktop-wide.jpg">
  <img src="mobile-tall.jpg" alt="响应式图片">
</picture>
```

### 4. **rem、em、vw/vh、%单位在响应式中的区别**
**期望回答：**
- **px**：死单位，不响应。
- **rem** (root em)：**相对于 `html` 根字号**。
    - **技巧**：在媒体查询里只修改 `html { font-size: ... }`，页面里所有用 `rem` 的按钮、间距都会整体缩放。
- **em**：相对于**父元素**字号。适合局部组件（如图标配合文字的大小）。
- **vw/vh**：相对于**视口尺寸**。`100vw` = 屏幕满宽。适合做全屏 Banner。
- **%**：相对于**父容器**宽度。适合流体布局。

**实战 Calc 语法解释：**
```css
/* 一行放 4 个卡片，中间有 20px 间距 */
.card {
  /* 
     原理：总宽度(100%) 除以 4 = 25%。
     但在 CSS 盒模型里，如果不减去 gap(20px)，4个25%加起来再加上间距就会超过100%，导致换行。
     所以必须用 calc() 减去间距。
  */
  width: calc(25% - 20px); 
}
```

## 三、实战编码题

### 题1：实现一个响应式导航栏
**场景描述：**
- **电脑**：Logo 在左，菜单在右（水平排列）。
- **手机**：Logo 在中，菜单隐藏，出现汉堡按钮。

**代码思路：**
```css
.navbar {
  display: flex;
  justify-content: space-between; /* 电脑端两端对齐 */
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column; /* 手机端变成垂直排列 */
  }
  .menu {
    display: none; /* 默认隐藏菜单 */
  }
  .menu.active {
    display: flex; /* 点击后显示 */
  }
}
```

### 题2：实现响应式卡片网格
**场景描述：** 
- 大屏 4 列，中屏 2 列，小屏 1 列。

**推荐方案 (Grid)：**
```css
.grid {
  display: grid;
  gap: 20px;
  /* 
     auto-fit: 容器能塞几个就塞几个
     minmax(250px, 1fr): 
       - 尝试给每个卡片 1fr (平分空间)
       - 但如果 1fr 小于 250px，就强制换行
  */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

## 四、进阶问题

### 1. **如何处理响应式表格？**
表格在手机上很难显示完整。
- **方案 A（滚动）**：给表格外包一个 `div`，设置 `overflow-x: auto`，让它在内部横向滚动。
- **方案 B（变身）**：使用 CSS 将 `tr` 变成块级元素 (`display: block`)，让每一行数据变成一张“卡片”竖着排。

### 2. **性能优化考虑**
- **图片**：不要在手机上加载 4K 大图（用 `srcset` 或 CDN 动态裁剪）。
- **CSS**：尽量用 CSS 实现动画（如 `transform`），少用 JS 计算布局。
- **隐藏元素**：`display: none` 的图片虽然看不见，但有些浏览器**仍然会下载它**！如果是背景图，最好用媒体查询控制 `background-image`。

### 3. **如何测试响应式设计？**
1.  **Chrome DevTools**：按 F12 -> 点击左上角“手机图标” -> 自由拖动边界。
2.  **真机调试**：手机连接电脑，使用 USB 调试（最准确，尤其是触摸手感）。

## 五、综合场景题

### 题目：设计一个电商产品列表页
**考察点与回答思路：**
1.  **布局**：使用 Grid 实现 `auto-fit` 的商品卡片，自动适应宽屏。
2.  **图片**：商品图使用 `aspect-ratio: 1/1` 保持正方形，防止抖动；使用 `loading="lazy"` 懒加载。
3.  **文字**：标题使用 `clamp(16px, 2vw, 24px)`，让字体随屏幕无级缩放，而不是断崖式突变。
4.  **交互**：手机端按钮点击区域（Padding）要够大（至少 44x44px），方便手指点击。

## 六、面试官评价要点
1.  ✅ **理解断点**：知道 768px 是 iPad 竖屏的分界线。
2.  ✅ **会用 Grid**：能手写 `minmax` 语法解决布局问题。
3.  ✅ **关注体验**：知道手机上不能让用户左右滑页面（横向溢出是响应式大忌）。
4.  ✅ **懂单位**：知道什么时候用 `rem`（文字），什么时候用 `vw`（大屏海报）。

---

**面试提示：** 面试时如果被问到“如何实现响应式”，**先说 Grid/Flex 这种现代方案，再说 @media 查询作为兜底**，会显得你技术栈更新。

## 元素水平垂直居中的方法

这是一个 CSS 面试中的“送分题”，但能区分出候选人的技术栈新旧程度。

### 1. **Flexbox 居中（现代最推荐 ✅）**
**代码：**
```css
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
}
```
**适用场景：** 几乎所有场景（弹窗、图标文字对齐、Loading 圈）。
**优点：** 代码少，逻辑清晰，不依赖元素尺寸。

### 2. **Grid 居中（最简洁 🔥）**
**代码：**
```css
.container {
  display: grid;
  place-items: center; /* 一行搞定水平+垂直 */
}
```
**适用场景：** 全屏居中容器。
**优点：** 写法极致简洁。

### 3. **绝对定位 + Transform（经典老方案）**
**代码：**
```css
.container {
  position: relative;
}
.item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 向左上回退自身宽高的 50% */
}
```
**原理：** `top: 50%` 让元素左上角到达容器中心，`translate` 让元素中心点回到容器中心。
**适用场景：** 元素浮在其他内容之上（如模态框、悬浮球）。
**注意：** 如果元素宽高固定，也可以用 `margin-left: -一半宽度` 替代 transform（这种写法很老，面试不推荐首选）。

### 4. **Margin: auto（Flex/Grid 下的神奇用法）**
**代码：**
```css
.container {
  display: flex; /* 或 grid */
}
.item {
  margin: auto; /* 子元素自动占据剩余空间，自然居中 */
}
```
**优点：** 只有一行代码，不仅居中，还能处理溢出。

---

**面试话术总结：**
> "日常开发中我首选 **Flexbox** (`justify-content` + `align-items`)，因为它最通用。如果是简单的全屏居中，我会用 **Grid** 的 `place-items: center`，因为它代码最少。如果涉及到覆盖层（Overlay），我会考虑使用 **绝对定位 + Transform**。"
