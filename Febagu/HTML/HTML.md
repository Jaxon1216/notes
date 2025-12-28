
## DOCTYPE 的作用

### 定义

DOCTYPE（Document Type Declaration，文档类型声明）用于**告诉浏览器当前 HTML 文档采用的规范版本**，以便浏览器按照对应标准解析和渲染页面。

### 核心作用

* 告知浏览器使用**哪种 HTML 规范**进行解析
* 决定浏览器采用**标准模式**还是**怪异模式**
* 影响浏览器对 **HTML / CSS / JavaScript** 的解析行为
* **必须写在 HTML 文档的第一行**

### HTML5 中的写法

```html
<!DOCTYPE html>
```

---

## 浏览器渲染页面的两种模式

### 1. CSS1 Compat（标准模式 / Strict Mode）

* 浏览器严格按照 **W3C 标准**解析渲染
* 使用浏览器支持的**最高标准**
* 现代网页开发推荐使用的模式

### 2. BackCompat（怪异模式 / 混杂模式 / Quirks Mode）

* 为了兼容早期旧网页
* 浏览器以**宽松、非标准方式**渲染
* 不同浏览器表现不一致

### 模式触发规则

* **DOCTYPE 不存在或声明不正确** → 进入怪异模式
* 会导致样式、布局、脚本表现差异巨大

### 总结

> 为了保证浏览器兼容性和页面一致性，**必须正确声明 DOCTYPE**

---

## HTML 语义化

### 概念

根据内容的**结构和含义**，选择**最合适的 HTML 标签**，而不是只使用 div + span。

### 优点

* **代码可读性高**，结构清晰，便于维护
* **对搜索引擎友好（SEO）**
* **对设备友好**（如屏幕阅读器、盲人辅助设备）
* **无 CSS 情况下仍具备良好结构**
* 有利于内容的**机器理解和智能分析**

### SEO 说明

SEO（Search Engine Optimization）：
通过合理的结构和语义，使网页在搜索引擎中排名更靠前，从而增加流量。

---

## 常见语义化标签

* `title`：页面主体内容标题
* `header`：页眉（logo、主导航、搜索框等）
* `nav`：导航区域（重要链接集合）
* `main`：页面主要内容（一个页面只能有一个）
* `section`：文档中的独立区块（章节、区域）
* `article`：独立、完整的内容（文章、帖子）
* `aside`：侧边栏、附加信息
* `footer`：页脚（父级是 body 时才是整页页脚）
* `address`：作者或组织的联系信息

---

## meta 标签

### 定义

`meta` 标签用于描述 HTML 文档的**元数据**，不会直接显示在页面中。

### 作用

* 搜索引擎优化（SEO）
* 定义页面字符集、语言
* 页面刷新与跳转
* 控制缓存策略
* 控制页面显示行为

---

## meta 标签分类

### 1. 页面描述信息（name）

常见属性：

* `keywords`：关键词
* `description`：页面描述
* `author`：作者
* `robots`：搜索引擎爬虫规则

### 2. HTTP 等价信息（http-equiv）

常见属性：

* `Expires`：缓存期限
* `Pragma`：缓存模式
* `Refresh`：页面刷新
* `Set-Cookie`：Cookie 设置
* `Content-Type`：字符集设置

### 3. content

* 配合 `name` 或 `http-equiv` 使用
* 填写具体内容

---

## HTML5 新特性

### 新增功能

* DOM 选择器

  * `document.querySelector`
  * `document.querySelectorAll`

* 多媒体支持

  * `video`、`audio`（替代 Flash）

* 本地存储

  * `localStorage`
  * `sessionStorage`

* 浏览器通知

  * Notifications API

* 语义化标签

  * `header`、`nav`、`section`、`article`、`footer`

* 地理位置

  * Geolocation（需用户授权）

* 离线应用

  * manifest

* 实时通信

  * WebSocket（全双工）

* 历史记录操作

  * `history` API

* 多线程

  * Web Worker（不阻塞主线程）

* 拖拽 API

* 增强表单控件

  * `url`、`date`、`time`、`email`、`search`

* 页面可见性

  * `visibilitychange`

* 跨窗口通信

  * `postMessage`

* 表单数据

  * `FormData`

* 绘图

  * `canvas`、`SVG`

---

## HTML5 移除的元素

### 纯表现元素

* `basefont`
* `big`
* `center`
* `font`
* `s`
* `strike`
* `tt`
* `u`

### 影响可用性的元素

* `frame`
* `frameset`
* `noframes`

---

## src 和 href 的区别

### src

* 表示**资源嵌入**
* 会**替换当前元素**
* 浏览器解析到时会 **下载、解析、执行**
* 会**阻塞页面渲染**
* 常见标签：`script`、`img`、`iframe`

### href

* 表示**资源引用**
* 建立当前文档与资源之间的关系
* **并行下载，不阻塞解析**
* 常见标签：`a`、`link`

### 总结

* `src`：必需资源，会嵌入页面
* `href`：引用资源，建立关联

---

## 行内元素与块级元素

---

## 元素分类

### 行内元素（Inline）

* 多个可在一行显示
* 宽度由内容决定
* 不能设置宽高
* 只能包含文本或行内元素

常见：

```html
a strong b em del span img input select
```

---

### 块级元素（Block）

* 独占一行
* 可设置宽高、内外边距
* 宽度默认撑满父容器
* 可包含任意元素

常见：

```html
div p h1~h6 ul ol li dl
```

---

### 空元素

```html
br hr img input link meta
```

---

## 行内与块级元素转换

```css
display: block;        /* 转为块级 */
display: inline;       /* 转为行内 */
display: inline-block; /* 行内块 */
```

---

## 行内元素和块级元素的区别

* 是否独占一行
* 是否可设置宽高
* 子元素容纳能力

---

## link 与 @import 的区别

### 语法

```html
<link rel="stylesheet" href="style.css">
```

```css
@import url(style.css);
```

### 区别对比

| 对比项    | link       | @import   |
| ------ | ---------- | --------- |
| 从属关系   | HTML 标签    | CSS 语法    |
| 加载顺序   | 页面加载同时加载   | 页面加载完成后加载 |
| 兼容性    | 无兼容问题      | IE5+      |
| DOM 控制 | 可用 JS 动态控制 | 不可        |
| 权重     | 高          | 低         |

### 结论

> 实际开发中 **推荐使用 link**

---

## 常见图片格式

| 格式   | 优点       | 缺点    | 使用场景    |
| ---- | -------- | ----- | ------- |
| GIF  | 支持动画     | 256 色 | 简单动图    |
| JPG  | 色彩丰富，体积小 | 有损压缩  | 照片      |
| PNG  | 无损，透明    | 体积较大  | logo    |
| WEBP | 高压缩率     | 兼容性一般 | WebView |

---

## iframe

### 定义

`iframe` 用于在当前页面中**嵌入另一个网页**

### 优点

* 加载第三方内容
* 提高代码复用

### 缺点

* 不利于 SEO
* 影响首屏加载
* 兼容性问题

---

## iframe 安全限制

### X-Frame-Options

* `deny`：禁止嵌套
* `sameorigin`：同源允许
* `allow-from url`：指定来源

### CSP（内容安全策略）

```http
Content-Security-Policy: frame-ancestors 'self'
```

### JS 判断

```js
window.top !== window.self
```

---

## defer 和 async

### 作用

在**不阻塞 HTML 解析**的前提下，控制脚本加载与执行。

---

## 浏览器渲染流程简述

1. 解析 HTML 构建 DOM
2. 解析 CSS 构建 CSSOM
3. 合成 Render Tree
4. 布局、绘制

---

## async

* 异步下载
* **下载完成立即执行**
* 执行顺序不确定
* 适合独立脚本

---

## defer

* 异步下载
* **DOM 解析完成后按顺序执行**
* 在 `DOMContentLoaded` 前执行
* 适合依赖 DOM 的脚本

---

## async 与 defer 对比总结

| 属性     | async    | defer     |
| ------ | -------- | --------- |
| 是否异步下载 | 是        | 是         |
| 是否阻塞解析 | 否        | 否         |
| 执行时机   | 下载完成立即执行 | DOM 解析完成后 |
| 顺序     | 无序       | 有序        |

