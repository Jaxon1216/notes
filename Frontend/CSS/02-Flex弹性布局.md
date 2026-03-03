# Flex 弹性布局

> **本页关键词**：Flex 容器、Flex 项目、主轴、交叉轴、justify-content、align-items

---

## 一、核心思想与术语

Flexbox 的核心是创建一个 **Flex 容器**，并控制其内部 **Flex 项目** 的排列方式。

* **Flex 容器**：设置了 `display: flex` 或 `display: inline-flex` 的元素
* **Flex 项目**：Flex 容器内的**直接子元素**
* **主轴**：项目排列的主要方向（默认水平，从左到右）
* **交叉轴**：与主轴垂直的方向（默认垂直，从上到下）

---

## 二、Flex 容器属性（父元素）

### display

```css
.container {
  display: flex; /* 块级 Flex 容器 */
  /* 或 */
  display: inline-flex; /* 行内 Flex 容器 */
}
```

### flex-direction

定义**主轴方向**。

```css
.container {
  flex-direction: row; /* 默认：主轴水平，从左到右 */
  flex-direction: row-reverse; /* 水平，从右到左 */
  flex-direction: column; /* 垂直，从上到下 */
  flex-direction: column-reverse; /* 垂直，从下到上 */
}
```

### flex-wrap

定义项目是否换行。

```css
.container {
  flex-wrap: nowrap; /* 默认：不换行，项目可能被压缩 */
  flex-wrap: wrap; /* 换行，第一行在上方 */
  flex-wrap: wrap-reverse; /* 换行，第一行在下方 */
}
```

### justify-content

项目在**主轴**上的对齐方式。

```css
.container {
  justify-content: flex-start; /* 默认 */
  justify-content: flex-end;
  justify-content: center;
  justify-content: space-between; /* 两端对齐，项目间间隔相等 */
  justify-content: space-around; /* 每项目两侧间隔相等 */
  justify-content: space-evenly; /* 间隔完全相等 */
}
```

### align-items

项目在**交叉轴**上的对齐方式（单行）。

```css
.container {
  align-items: stretch; /* 默认：拉伸填满 */
  align-items: flex-start;
  align-items: flex-end;
  align-items: center;
  align-items: baseline; /* 按基线对齐 */
}
```

### align-content

**多行项目**在交叉轴上的对齐（需 `flex-wrap: wrap` 且有多行时生效）。

```css
.container {
  align-content: stretch | flex-start | flex-end | center | space-between | space-around;
}
```

---

## 三、Flex 项目属性（子元素）

### order

排列顺序，数值越小越靠前。默认 0。

```css
.item {
  order: 1;
}
```

### flex-grow

放大比例，剩余空间如何分配。默认 0（不放大）。

```css
.item {
  flex-grow: 1; /* 等分剩余空间 */
}
```

### flex-shrink

缩小比例，空间不足时如何缩小。默认 1，设为 0 则不缩小。

```css
.item {
  flex-shrink: 0;
}
```

### flex-basis

分配多余空间之前的初始大小。默认 `auto`。

```css
.item {
  flex-basis: 200px;
}
```

### flex（缩写）

`flex-grow`、`flex-shrink`、`flex-basis` 的简写。

```css
.item {
  flex: 1; /* 等同于 flex: 1 1 0 */
  flex: 0 0 200px; /* 固定宽度 */
  flex: auto; /* 等同于 flex: 1 1 auto */
  flex: none; /* 等同于 flex: 0 0 auto */
}
```

### align-self

单个项目覆盖容器的 `align-items`。

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

---

## 四、记忆口诀与经典场景

**口诀**：
* 主轴怎么排：`flex-direction` + `justify-content`
* 交叉轴怎么对齐：`align-items`（单行）或 `align-content`（多行）
* 项目怎么伸缩：`flex: grow shrink basis`

### 水平垂直居中

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 等分导航栏

```css
.nav {
  display: flex;
}
.nav-item {
  flex: 1;
  text-align: center;
}
```

### 圣杯布局（头部 / 尾部 / 内容区）

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.header, .footer { flex: 0 0 auto; }
.content { flex: 1; }
```

### 固定侧边栏 + 自适应内容

```css
.container {
  display: flex;
}
.sidebar {
  flex: 0 0 250px;
}
.main {
  flex: 1;
}
```

> **面试要点**：Flex 适用于一维布局；二维布局用 Grid。两者结合是现代 CSS 布局最佳实践。

---

## 五、总结

**核心优势**：简单、响应式、方向灵活。

**适用场景**：一维布局——导航栏、工具栏、卡片列表、表单控件组等。
