## 盒子模型

### 1. 什么是盒子模型？

在 CSS 中，所有的 HTML 元素都可以看作是一个矩形的盒子。CSS 盒子模型（Box Model）本质上是一个封装周围 HTML 元素的盒子，它包括：**边距（Margin）**、**边框（Border）**、**填充（Padding）** 和 **实际内容（Content）**。

![box-model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model/boxmodel-(1).png)

### 2. 标准盒模型 vs 怪异盒模型（IE 盒模型）

这是面试中最常问的 CSS 基础题之一。

| 特性 | 标准盒模型 (content-box) | 怪异盒模型 (border-box) |
| :--- | :--- | :--- |
| **触发方式** | `box-sizing: content-box` (默认) | `box-sizing: border-box` |
| **width 计算** | `width` = **Content** | `width` = **Content + Padding + Border** |
| **实际占用宽度** | Width + Padding + Border + Margin | Width + Margin |
| **特点** | 设置 padding/border 会把盒子撑大 | 设置 padding/border 不会撑大盒子，内容区会自动收缩 |

#### 面试话术：
> "标准盒模型的 `width` 只包含内容区域，如果你给一个 `width: 100px` 的盒子加上 `padding: 10px`，它实际占用的宽度会变成 120px，容易破坏布局。而怪异盒模型（IE 盒模型）的 `width` 包含了 padding 和 border，加 padding 不会撑大盒子，更符合直觉，在响应式布局中非常常用。"

---

## BFC (Block Formatting Context)

### 1. 什么是 BFC？

BFC 全称 **块级格式化上下文**。你可以把它理解为页面上一个**独立的渲染区域**，容器内的子元素不会影响到外面的元素，反之亦然。

### 2. 如何触发 BFC？

只要满足以下任意一个条件，就会触发 BFC：

*   **根元素** (`<html>`)
*   **浮动元素** (`float` 不为 `none`)
*   **绝对定位元素** (`position` 为 `absolute` 或 `fixed`)
*   **行内块元素** (`display` 为 `inline-block`)
*   **表格单元格** (`display` 为 `table-cell`)
*   **溢出元素** (`overflow` 不为 `visible`，常用 `overflow: hidden`)
*   **弹性盒/网格布局** (`display` 为 `flex` 或 `grid` 的直接子项)

### 3. BFC 解决了什么问题？（应用场景）

这也是面试重点，通常需要举例说明：

#### A. 解决外边距塌陷（Margin Collapse）
*   **现象**：两个垂直排列的 div，上面的 `margin-bottom: 10px` 和下面的 `margin-top: 20px` 会合并成 20px（取大值），而不是 30px。或者父子元素 margin 合并。
*   **解决**：给父元素触发 BFC（如 `overflow: hidden`），父子元素的 margin 就不会合并了。

#### B. 清除浮动（包含浮动元素）
*   **现象**：父元素高度塌陷。如果子元素都是浮动的，父元素高度会变成 0。
*   **解决**：给父元素设置 `overflow: hidden` 触发 BFC，父元素就能“看见”浮动的子元素，从而自动撑开高度。

#### C. 阻止元素被浮动元素覆盖（两栏布局）
*   **现象**：左边一个浮动元素，右边一个普通 div，普通 div 会“钻”到浮动元素下面。
*   **解决**：给右边的普通 div 触发 BFC（如 `overflow: hidden`），它就不会被遮挡，而是乖乖排在旁边，形成两栏自适应布局。
