好的，Flexible Box 布局（Flexbox）是现代CSS中**最重要、最实用**的布局模型之一，它专门用于解决**一维方向**（水平或垂直）上的布局问题，让复杂布局变得简单直观。

---

### **一、核心思想与术语**

Flexbox 的核心是创建一个 **Flex 容器**，并控制其内部 **Flex 项目的**排列方式。

*   **Flex 容器**： 设置了 `display: flex;` 或 `display: inline-flex;` 的元素。
*   **Flex 项目**： Flex 容器内的**直接子元素**。
*   **主轴**： 项目排列的主要方向（默认为**水平方向**，从左到右）。
*   **交叉轴**： 与主轴垂直的方向（默认为**垂直方向**，从上到下）。



---

### **二、Flex 容器属性（父元素上设置）**

这些属性决定了项目的排列“规则”。

#### **1. `display`**
定义容器类型。
```css
.container {
  display: flex; /* 块级 Flex 容器 */
  /* 或 */
  display: inline-flex; /* 行内 Flex 容器 */
}
```

#### **2. `flex-direction`**
定义**主轴方向**，即项目的排列方向。
```css
.container {
  flex-direction: row; /* 默认值：主轴水平，从左到右 */
  flex-direction: row-reverse; /* 主轴水平，从右到左 */
  flex-direction: column; /* 主轴垂直，从上到下 */
  flex-direction: column-reverse; /* 主轴垂直，从下到上 */
}
```

#### **3. `flex-wrap`**
定义项目是否换行（默认不换行）。
```css
.container {
  flex-wrap: nowrap; /* 默认：不换行，项目可能被压缩 */
  flex-wrap: wrap; /* 换行，第一行在上方 */
  flex-wrap: wrap-reverse; /* 换行，第一行在下方 */
}
```

#### **4. `justify-content`**
定义项目在**主轴**上的对齐方式。
```css
.container {
  justify-content: flex-start; /* 默认：从主轴起点对齐 */
  justify-content: flex-end; /* 从主轴终点对齐 */
  justify-content: center; /* 居中对齐 */
  justify-content: space-between; /* 两端对齐，项目间间隔相等 */
  justify-content: space-around; /* 每个项目两侧间隔相等（视觉上项目间间隔是两侧间隔的两倍） */
  justify-content: space-evenly; /* 项目与项目、项目与边框的间隔完全相等 */
}
```

#### **5. `align-items`**
定义项目在**交叉轴**上的对齐方式（单行情况）。
```css
.container {
  align-items: stretch; /* 默认：项目被拉伸以填满容器高度/宽度 */
  align-items: flex-start; /* 项目在交叉轴起点对齐（顶部/左侧） */
  align-items: flex-end; /* 项目在交叉轴终点对齐（底部/右侧） */
  align-items: center; /* 在交叉轴居中对齐 */
  align-items: baseline; /* 按项目的第一行文字的基线对齐 */
}
```

#### **6. `align-content`**
定义**多行项目**在**交叉轴**上的对齐方式（当 `flex-wrap: wrap` 且有多行时才生效）。
```css
.container {
  align-content: stretch; /* 默认：拉伸行以占据剩余空间 */
  align-content: flex-start;
  align-content: flex-end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
  /* 值与 justify-content 类似，但作用于交叉轴的多行 */
}
```

---

### **三、Flex 项目属性（子元素上设置）**

这些属性用于微调单个项目的表现。

#### **1. `order`**
定义项目的排列顺序。数值越小，排列越靠前。**默认值为 0**。
```css
.item {
  order: 1; /* 数字，可以为负数 */
}
```

#### **2. `flex-grow`**
定义项目的“放大比例”。当容器有剩余空间时，项目如何分配这些空间。**默认值为 0**（不放大）。
```css
.item {
  flex-grow: 1; /* 如果所有项目都为1，则等分剩余空间 */
}
/* 项目1为2，项目2为1，则项目1分到的剩余空间是项目2的2倍 */
```

#### **3. `flex-shrink`**
定义项目的“缩小比例”。当容器空间不足时，项目如何缩小。**默认值为 1**（等比例缩小）。值为 0 时，该项目不缩小。
```css
.item {
  flex-shrink: 0; /* 空间不足时，该项目不缩小 */
}
```

#### **4. `flex-basis`**
定义项目在分配多余空间之前的“初始大小”。**默认值为 `auto`**（项目本来的大小）。可以设为像 `px`， `%`， `rem` 这样的长度值。
```css
.item {
  flex-basis: 200px; /* 项目的基础宽度/高度（取决于主轴方向） */
}
```

#### **5. `flex` (缩写属性)**
是 `flex-grow`, `flex-shrink`, `flex-basis` 的简写。最常用。
```css
.item {
  flex: 1; /* 相当于 flex: 1 1 0; */
  flex: 0 0 200px; /* 相当于 flex-grow: 0; flex-shrink: 0; flex-basis: 200px; (常见固定宽度布局) */
  flex: auto; /* 相当于 flex: 1 1 auto; */
  flex: none; /* 相当于 flex: 0 0 auto; (项目尺寸固定，不伸缩) */
}
```

#### **6. `align-self`**
允许单个项目有与其他项目不一样的**交叉轴**对齐方式，会覆盖容器的 `align-items` 属性。
```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

---

### **四、实用记忆口诀与场景**

*   **“主轴怎么排？”**： `flex-direction` + `justify-content`
*   **“交叉轴怎么对齐？”**： `align-items`（单行） 或 `align-content`（多行）
*   **“项目怎么伸缩？”**： `flex: grow shrink basis`

#### **经典场景示例：**

1.  **水平垂直居中（最常用）**
    ```css
    .container {
      display: flex;
      justify-content: center; /* 主轴居中 */
      align-items: center;     /* 交叉轴居中 */
    }
    ```

2.  **等分导航栏**
    ```css
    .nav {
      display: flex;
    }
    .nav-item {
      flex: 1; /* 所有项目自动等分容器宽度 */
      text-align: center;
    }
    ```

3.  **圣杯布局（头部、尾部、中间内容区）**
    ```css
    .page {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .header, .footer { flex: 0 0 auto; } /* 不伸缩，固定高度 */
    .content { flex: 1; } /* 占据所有剩余空间 */
    ```

4.  **固定侧边栏 + 自适应内容**
    ```css
    .container {
      display: flex;
    }
    .sidebar {
      flex: 0 0 250px; /* 不伸缩，固定宽度250px */
    }
    .main {
      flex: 1; /* 占据剩余所有空间 */
    }
    ```

---

### **总结**

**Flexbox 的核心优势**：
1.  **简单**：几行代码就能实现过去需要复杂 hack 的布局（如垂直居中）。
2.  **响应式**：通过 `flex-wrap` 和项目的伸缩属性，能轻松适配不同屏幕。
3.  **方向无关**：通过 `flex-direction` 可以轻松切换主轴方向，布局更灵活。

**适用场景**：**一维布局**，例如导航栏、工具栏、卡片列表、表单控件组等，凡是需要沿某个方向对齐、分布、居中的场景，Flexbox 都是首选方案。

对于更复杂的**二维布局**（同时需要控制行和列），则需要学习 **CSS Grid**。将 Flexbox（用于组件内部的一维排列）和 Grid（用于页面整体的二维架构）结合使用，是现代 CSS 布局的最佳实践。


## 补充

### gap


### margin