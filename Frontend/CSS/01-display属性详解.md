# display 属性详解

> **本页关键词**：block、inline、inline-block、内容撑开、flex、grid

---

## 一、总览表

| display 值      | 常叫法   | 是否独占一行 | 是否可设宽高 | 是否由内容撑开    |
| -------------- | ----- | ------ | ------ | ---------- |
| `block`        | 块级元素  | 是      | 是      | 否（默认占满父元素） |
| `inline`       | 行内元素  | 否      | 否      | 是          |
| `inline-block` | 行内块   | 否      | 是      | 是（默认）      |
| `none`         | 不显示   | —      | —      | —          |
| `flex`         | 弹性盒   | 是      | 是      | 否          |
| `inline-flex`  | 行内弹性盒 | 否      | 是      | 是          |
| `grid`         | 网格    | 是      | 是      | 否          |

---

## 二、三大基础形态

### 块级元素 `display: block`

**典型元素**：

```html
div p h1 ul li section
```

**特征**：

* 独占一行
* 默认宽度：**100% 父元素**
* 可以设置 `width / height`
* **不是由内容撑开的**

```css
div {
  display: block;
}
```

> 即使里面只有一个字，它也会横向占满整行。

---

### 行内元素 `display: inline`

**典型元素**：

```html
span a em strong
```

**特征**：

* 不独占一行
* **宽高设置无效**
* 宽度完全由内容撑开
* `margin-top / bottom` 无效

```css
span {
  display: inline;
}
```

> 行内元素是"文字级"的存在。

---

### 行内块 `display: inline-block`

**特征**：看起来像行内元素（不换行），行为上像块级元素（可设宽高）。

* 不独占一行（可以并排）
* **可以设置 `width / height`**
* 默认大小：**由内容撑开**
* 可以设置 `margin / padding`

```css
button {
  display: inline-block;
}
```

`button`、`input`、`img` 天生就是行内块。

> **面试要点**：inline-block 是最容易混淆的一种，本质是「行内 + 可设宽高」。

---

## 三、由内容撑开 vs 不由内容撑开

### 由内容撑开的

* `inline`
* `inline-block`
* `inline-flex`

```html
<span>abc</span>
<span>abcdef</span>
```

宽度随文字变化。

---

### 不由内容撑开的

* `block`
* `flex`
* `grid`

```html
<div>abc</div>
```

宽度仍然是父元素 100%。

---

## 四、不写 display 时的默认值

### 每个 HTML 标签都有默认 display

| 标签       | 默认 display           |
| -------- | -------------------- |
| `div`    | `block`              |
| `p`      | `block`              |
| `span`   | `inline`             |
| `a`      | `inline`             |
| `img`    | `inline-block`       |
| `button` | `inline-block`       |
| `input`  | `inline-block`       |
| `li`     | `list-item`（≈ block） |

> **不写 display** ≠ 没有 display，而是使用浏览器默认样式。

---

### img 不会被挤成一行文字的原因

```css
img {
  display: inline-block; /* 浏览器默认 */
}
```

既能并排，又能有宽高。

---

## 五、易踩坑对比

### 行内元素不能设置宽高

```css
span {
  width: 100px; /* 无效 */
  height: 100px;
}
```

改为 `display: inline-block` 后即可生效。

---

### 行内元素上下 margin 不生效

```css
a {
  margin-top: 20px; /* 无效 */
}
```

行内块 / 块级均可生效。

> **面试要点**：行内元素 width/height、margin-top/bottom 无效，是高频考点。

---

## 六、工程中怎么选

| 场景          | 推荐 display       |
| ----------- | ---------------- |
| 普通布局        | `block` / `flex` |
| 文字修饰        | `inline`         |
| 按钮、标签       | `inline-block`   |
| 水平排列 + 可控尺寸 | `inline-block`   |
| 一维布局        | `flex`           |
| 二维布局        | `grid`           |

---

## 七、一句话总结

> * `block`：独占一行，占满父元素
> * `inline`：内容撑开，不能设宽高
> * `inline-block`：内容撑开 + 可设宽高
> * 不写 `display`：使用标签的默认 display
