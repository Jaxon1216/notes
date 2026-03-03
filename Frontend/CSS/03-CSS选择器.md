# CSS 选择器

> **本页关键词**：基本选择器、组合选择器、伪类、伪元素、优先级、权重计算

---

## 一、基本选择器

### 元素选择器

```css
p { color: red; }
div { background: blue; }
table { border: 1px solid; }
```

### 类选择器

```html
<div class="box active">内容</div>
```

```css
.box { width: 100px; }
.active { color: green; }
```

### ID 选择器

```html
<div id="header">头部</div>
```

```css
#header { height: 60px; }
```

### 通用选择器

```css
* { margin: 0; padding: 0; }
```

---

## 二、组合选择器

### 后代选择器（空格）

```css
div p { color: blue; } /* 选择 div 内部所有 p（不限层级） */
table tr { height: 40px; }
```

### 子元素选择器（>）

```css
div > p { color: red; } /* 只选直接子元素 */
```

```html
<div>
  <p>选中</p>
  <section>
    <p>不选中</p>
  </section>
</div>
```

### 相邻兄弟选择器（+）

```css
h1 + p { font-weight: bold; } /* 紧接在 h1 后的第一个 p */
```

### 通用兄弟选择器（~）

```css
h1 ~ p { color: gray; } /* h1 后面的所有兄弟 p */
```

> **面试要点**：空格 vs `>` 的区别——后代不限层级，子选择器只要直接子元素。

---

## 三、属性选择器

```css
a[href] { color: blue; }                    /* 有该属性 */
input[type="text"] { border: 1px solid; }   /* 属性值等于 */
a[href*="baidu"] { color: red; }            /* 包含 */
a[href^="https"] { color: green; }          /* 以...开头 */
a[href$=".pdf"] { color: purple; }          /* 以...结尾 */
```

---

## 四、伪类选择器

### 结构伪类

```css
li:nth-child(1) { color: red; }
li:nth-child(odd) { background: #f0f0f0; }
li:nth-child(3n) { color: green; }
li:nth-child(3n+1) { color: orange; }

li:first-child { color: red; }
li:last-child { color: blue; }
li:only-child { color: green; }
```

**:nth-child vs :nth-of-type**：前者计数所有兄弟，后者只计数同类型。

```html
<div>
  <p>第一个p</p>        <!-- p:nth-child(1) 匹配 -->
  <span>span</span>
  <p>第二个p</p>        <!-- p:nth-of-type(2) 匹配 -->
</div>
```

### 动态伪类

```css
a:link { color: blue; }
a:visited { color: purple; }
a:hover { background: yellow; }
a:active { color: red; }
input:focus { border-color: blue; }
```

### 表单伪类

```css
input:checked { background: green; }
input:disabled { opacity: 0.5; }
input:required { border-color: red; }
```

---

## 五、伪元素选择器

```css
p::before {
  content: "★ ";
  color: gold;
}

p::after {
  content: "。";
  color: gray;
}

p::first-letter {
  font-size: 2em;
  color: red;
}

p::first-line {
  font-weight: bold;
}
```

---

## 六、组合技巧

### 多重选择器（逗号）

```css
h1, h2, h3 {
  font-family: Arial;
  color: #333;
}
```

### 否定伪类（:not）

```css
p:not(.first) { opacity: 0.8; }
tr:not(:first-child):hover { background-color: #eee; }
```

### 多重伪类组合

```css
tr:nth-child(odd):hover { background-color: yellow; }
p.intro:first-child { font-size: 1.2em; }
```

---

## 七、选择器优先级

### 优先级顺序（从高到低）

1. `!important`
2. 内联样式
3. ID 选择器
4. 类选择器 / 属性选择器 / 伪类选择器
5. 元素选择器 / 伪元素选择器
6. 通用选择器 / 子选择器 / 相邻选择器

### 权重计算示例

```css
#header .nav li.active a:hover  /* ID:1, 类:2, 元素:2, 伪类:1 */
div#header ul li a              /* ID:1, 元素:4 */
```

> **面试要点**：类选择器权重高于元素选择器；权重相同时，后定义的覆盖先定义的。

---

## 八、常见错误

```css
/* 错误：多余空格导致选择目标变化 */
table tr :first-child  /* 选 tr 内的 :first-child */
table tr:first-child   /* 正确：选第一个 tr */

/* 错误：不理解子元素计数 */
ul li:nth-child(2)    /* 选 ul 的第二个子元素，且必须是 li */

/* 优先级冲突 */
p { color: blue; }
.text { color: red; }  /* 类选择器覆盖元素选择器 */
```
