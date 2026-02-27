# HTML 面试题

> **本页关键词**：DOCTYPE、语义化、head、行内/块级元素、src/href、meta、defer/async、srcset、iframe、Canvas/SVG、Service Worker、离线存储

---

## 1.DOCTYPE的作用是什么

<details>
<summary>答案</summary>

`DOCTYPE` 是文档类型声明，用来告诉浏览器当前页面采用哪种 HTML 规范进行解析，它不是 HTML 标签，而是位于文档最顶部的声明指令。

它最核心的作用是决定浏览器采用**标准模式（Standards mode）**还是**怪异模式（Quirks mode）**进行渲染。如果缺失或写错，浏览器可能进入怪异模式，导致 CSS 盒模型、布局甚至部分 JS 行为出现差异。

在 HTML5 中统一使用：

```html
<!DOCTYPE html>
```

这一声明会让浏览器以标准模式解析页面，是现代开发的默认写法。

</details>

## 2.HTML语义化是什么

<details>
<summary>答案</summary>

HTML 语义化是指根据内容的结构和含义选择合适的标签，用正确的标签表达正确的内容，而不是一味用 `div`。

它的优点主要有两方面：一是对机器友好，比如有利于 SEO、提高可访问性，方便搜索引擎和屏幕阅读器理解页面结构；二是对开发者友好，提升代码可读性和可维护性，方便团队协作。

常见的语义化标签包括 `header`、`nav`、`main`、`section`、`article`、`aside`、`footer` 等，它们分别用于表示页面头部、导航、主体内容、内容区块、独立文章、侧边内容和底部信息。

</details>

## 3.head标签有什么作用，其中哪些标签必不可少

<details>
<summary>答案</summary>

`head` 标签用于存放页面的元数据和资源引用信息，包括字符编码、页面标题、样式、脚本和 SEO 相关信息等。

其中规范要求必须包含 `title` 标签；在实际开发中通常还会包含 `meta charset` 和 `viewport` 等标签以保证页面正常解析和移动端适配。

</details>

## 4.b与strong、title与h1、i与em的区别

<details>
<summary>答案</summary>

`<b>` 只是视觉加粗，没有语义；`<strong>` 具有强调语义，表示内容的重要性，更符合语义化开发。

`title` 是页面标题，写在 `head` 中，主要影响 SEO 和浏览器标签显示；`h1` 是页面主体内容的一级标题，写在 `body` 中，用于结构语义。

`<i>` 与 `<em>` 同理：`<i>` 仅表示视觉斜体，`<em>` 表示语义上的强调。

</details>

::: tip 面试要点
核心考点是**视觉表现与语义的区分**。现代开发优先使用语义化标签（strong、em），视觉效果交给 CSS 控制。
:::

## 5.行内元素有哪些？块级元素有哪些？

<details>
<summary>答案</summary>

HTML 元素从默认表现上可以分为行内元素、块级元素和空元素。

行内元素不会独占一行，只占内容本身宽度，主要用于包裹文本或小范围内容，比如 `span`、`a`、`strong`、`img`、`input` 等。

块级元素会独占一行，默认宽度撑满父容器，通常用于页面结构布局，比如 `div`、`p`、`h1~h6`、`ul`、`li`、`section` 等。

空元素是指没有结束标签、不能包含内容的元素，比如 `img`、`br`、`hr`、`input`、`meta`、`link` 等。

需要注意的是，行内和块级是默认 display 行为，可以通过 CSS 修改，而空元素是语法层面的定义。

</details>

## 6.label标签的作用

<details>
<summary>答案</summary>

`label` 用于为表单控件添加说明文字，并通过 `for` 属性与表单元素建立关联关系。点击 `label` 可以触发对应的表单控件（如聚焦输入框、切换复选框），同时有助于提高可访问性和用户体验。

</details>

> 补充：`label` 有两种关联方式：一是通过 `for` + `id` 显式关联（最常用），二是将表单控件嵌套在 `label` 内部实现隐式关联。常见错误是只写 `placeholder` 而不写 `label`，这在无障碍规范上是不合格的。

## 7.src与href的区别

<details>
<summary>答案</summary>

`src` 用来指定需要加载并嵌入当前页面的资源路径，常见于 `<script>`、`<img>` 等标签，浏览器解析到它时会发起资源请求，其中 `<script src>` 在默认情况下会阻塞 HTML 解析，直到脚本加载并执行完成。

`href` 用来指定超链接地址或建立文档与外部资源的关联，常见于 `<a>`、`<link>` 等标签，一般是并行加载，不会直接中断当前文档的解析流程。

</details>

## 8.常用的meta标签有哪些

<details>
<summary>答案</summary>

`<meta>` 标签用于定义页面的元信息，主要通过 `name`（或 `http-equiv`、`property`）和 `content` 两个属性描述页面的附加信息，比如字符编码、视口设置、SEO 描述等。这些信息不会直接显示在页面上，但会影响浏览器解析、搜索引擎抓取和社交平台展示。

常见的 `<meta>` 用法包括：

- `charset`：声明字符编码，通常是 `UTF-8`
- `viewport`：用于响应式布局，控制移动端缩放
- `description` 和 `keywords`：用于 SEO
- `robots`：控制搜索引擎是否索引页面
- `http-equiv="refresh"`：定时刷新或跳转
- Open Graph 和 Twitter Card：控制页面在社交平台分享时的展示效果

在现代开发中，`charset` 和 `viewport` 是几乎每个页面必备的，其它根据 SEO 或业务需求选择使用。

</details>

## 9.HTML5相比早期HTML有哪些更新

<details>
<summary>答案</summary>

HTML5 是 HTML 的最新标准，相比早期版本主要有三大提升：语义化增强、多媒体原生支持和更强的 Web 应用能力。

第一，语义化标签更加丰富，比如 `header`、`nav`、`section`、`article`、`footer` 等，使页面结构更清晰，有利于 SEO 和可访问性。

第二，原生支持音视频，通过 `audio` 和 `video` 标签无需插件即可播放多媒体内容，同时表单增强，新增 `email`、`date`、`number` 等类型，并支持 `required`、`pattern` 等内置校验。

第三，新增多种 API 和能力，比如 `localStorage`、`sessionStorage`、`WebSocket`、`Canvas`、`Geolocation` 等，使浏览器具备更强的交互能力和实时通信能力，更接近传统应用。

此外，HTML5 还移除了一些纯表现型标签，更强调结构与表现分离。

</details>

## 10.HTML4和HTML5的区别

<details>
<summary>答案</summary>

HTML5 是在 HTML4 基础上的升级版本，主要目的是让浏览器从文档展示工具升级为应用平台。

首先，在语义结构上，HTML5 新增了 `header`、`nav`、`section`、`article`、`footer` 等语义化标签，解决了 HTML4 大量使用 `div`、结构不清晰的问题，提高了 SEO 和可访问性。

其次，在多媒体支持上，HTML5 提供了 `audio` 和 `video` 标签，可以原生播放音视频，而 HTML4 需要依赖 Flash 等插件。

在表单方面，HTML5 增加了多种 `input` 类型，比如 `email`、`date`、`number`，并内置了部分表单校验能力，增强了交互体验。

同时，HTML5 新增了 `canvas`、`localStorage` 等 API，使浏览器具备图形绘制和本地存储能力，并支持离线和更丰富的前端应用场景。

另外，HTML5 简化了文档声明，只需要 `<!DOCTYPE html>`，而 HTML4 的声明较为复杂。

</details>

::: tip 面试要点
第 9 题和第 10 题角度不同但内容有重叠。第 9 题侧重"新增了什么"，第 10 题侧重"和 HTML4 对比差异"。面试时根据问法调整侧重点，避免两题答成一样。
:::

## 11.script标签的defer和async区别

<details>
<summary>答案</summary>

`defer` 和 `async` 都用于异步加载外部 JS 脚本，加载时不会阻塞 HTML 解析，但两者的**执行时机和顺序不同**。

`async` 是下载完成后立即执行，执行顺序不确定，可能打断 HTML 解析，因此适用于彼此独立、没有依赖关系的脚本，比如埋点、广告脚本等。

`defer` 会在 HTML 解析完成后、`DOMContentLoaded` 触发前按顺序执行，保证多个脚本按书写顺序执行，适合依赖 DOM 或存在前后依赖关系的脚本。

简单记忆：**async 快但乱，defer 稳且有序。**

</details>

> 补充：`async` 和 `defer` 只对带 `src` 的外部脚本生效，内联脚本不存在下载过程，浏览器读到就直接执行，因此无需异步。
>
> `DOMContentLoaded` 表示 HTML 文档已被完全解析成 DOM 树，但不要求图片、CSS 等资源加载完成。`defer` 脚本执行完毕后才会触发 `DOMContentLoaded`，这也是 `defer` 适合操作 DOM 的原因。
>
> | 事件 | 触发时机 |
> |------|----------|
> | DOMContentLoaded | HTML 解析完成 |
> | load | 所有资源（图片、CSS、iframe 等）全部加载完成 |

::: tip 面试要点
核心区分在于执行时机：async 下载完立即执行（可能打断解析），defer 等解析完再按序执行。追问时要能说清 DOMContentLoaded 与 load 的区别，以及为什么只对外部脚本生效。
:::

## 12.img标签的srcset属性的作用

<details>
<summary>答案</summary>

`srcset` 用于为 `<img>` 提供多个不同尺寸或分辨率的图片资源，浏览器会根据设备的屏幕宽度和像素密度自动选择最合适的图片，从而避免在小屏设备上加载过大的图片，提高性能并节省带宽。

通常会配合 `sizes` 一起使用，`sizes` 用来告诉浏览器在不同视口条件下图片实际的显示宽度，这样浏览器在选择资源时会更加精准。

`srcset` 主要解决**分辨率适配问题**，而 `<picture>` 则可以结合 `media` 条件实现更复杂的"艺术方向"适配，比如在不同屏幕尺寸下展示不同裁剪的图片。

一句话记忆：`srcset` 解决"加载哪张更合适"，`sizes` 告诉浏览器"页面里实际显示多大"，`picture` 解决"不同场景用不同图"。

</details>

> 补充：`srcset` 中的 `w` 是宽度描述符（width descriptor），表示图片资源的**物理像素宽度**，不是 CSS 单位。`sizes` 中的 `vw` 是 CSS 单位，表示视口宽度的百分比。浏览器通过 `显示宽度（sizes）× 设备像素比（DPR）` 来匹配最合适的 `w` 图片。
>
> | 写法 | 所属 | 含义 |
> |------|------|------|
> | 400w | srcset 专用 | 图片资源本身的物理宽度 |
> | 100vw | CSS 单位 | 图片在页面中显示的宽度 |
>
> `srcset + sizes` 示例：
>
> ```html
> <img
>   src="banner-800.jpg"
>   srcset="banner-400.jpg 400w, banner-800.jpg 800w, banner-1600.jpg 1600w"
>   sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 800px"
>   alt="网站横幅图"
> />
> ```
>
> `<picture>` 用于艺术方向适配（如手机用竖图、桌面用横图）：
>
> ```html
> <picture>
>   <source media="(min-width: 768px)" srcset="banner-desktop.jpg">
>   <img src="banner-mobile.jpg" alt="响应式横幅图">
> </picture>
> ```

## 13.iframe的优缺点

<details>
<summary>答案</summary>

`iframe` 用于在当前页面中嵌入一个独立的页面环境，拥有独立的 DOM 和 JS 作用域。

**优点：**

1. 内容隔离性强，嵌入页面和主页面互不影响
2. 安全性较高，受同源策略限制，可配合 `sandbox` 增强安全控制
3. 方便集成第三方系统，如视频、地图、支付页面等

**缺点：**

1. 性能开销大，每个 iframe 都是一次完整页面加载
2. SEO 不友好，搜索引擎通常不抓取 iframe 内内容
3. 跨域通信复杂，需要通过 `postMessage` 实现
4. 响应式适配较麻烦

总结：iframe 适合做第三方内容嵌入或系统隔离，不适合做主应用结构。

</details>

> 补充：iframe 相关的三个核心安全概念：
>
> **同源策略**：协议 + 域名 + 端口三者必须完全一致才算同源。浏览器禁止不同源页面互相访问 DOM、Cookie、localStorage 等数据，防止恶意网站窃取信息。
>
> **sandbox 属性**：给 iframe 施加额外安全限制。默认添加 `sandbox` 会禁止脚本执行、表单提交、弹窗等操作，可通过白名单方式开放权限：
>
> ```html
> <iframe sandbox="allow-scripts allow-same-origin"></iframe>
> ```
>
> **postMessage**：浏览器提供的跨域通信 API，用于不同源页面之间安全传递数据。接收端必须验证 `event.origin` 来确保消息来源可信：
>
> ```js
> // 发送
> iframe.contentWindow.postMessage("hello", "https://example.com");
> // 接收
> window.addEventListener("message", (event) => {
>   if (event.origin === "https://example.com") { /* 处理消息 */ }
> });
> ```

## 14.Canvas和SVG的区别

<details>
<summary>答案</summary>

Canvas 和 SVG 都可以在浏览器里绘制图形，但它们的工作方式完全不同。

Canvas 是基于像素的绘图，本质是一块画布，通过 JavaScript 把图形"画"上去，画完之后浏览器只记得像素结果，不会保留每个图形对象。如果想改某个图形，通常需要整块区域重新绘制。优点是性能高，适合大量图形和高频动画，比如游戏、粒子效果或复杂图表。

SVG 是基于矢量的，本质是 XML，每一个图形都是一个真实的 DOM 元素，可以单独绑定事件、修改样式、做动画。因为是矢量图，放大不会失真。缺点是当图形数量特别多时，DOM 数量暴涨，性能会下降。

简单说，Canvas 更像在画板上作画，强调渲染效率；SVG 更像在页面里摆积木，每个图形都有结构和身份。图形数量多、动画频繁时更适合 Canvas；图形数量少但交互要求高时更适合 SVG。

</details>

> 补充：SVG 本质是 XML 格式文件。XML（Extensible Markup Language）是一种用标签描述数据结构的文本格式，标签可以自定义（如 `<user><name>Jiang</name></user>`），语法严格（必须闭合、大小写敏感），早期广泛用于数据传输和配置文件，后来逐渐被 JSON 取代。

## 15.HTML5的离线存储怎么使用

<details>
<summary>答案</summary>

HTML5 早期提供了 **Application Cache** 实现离线缓存，但这个方案已经被废弃。现在主流做法是使用 **Service Worker** 来实现离线能力和资源缓存。

Service Worker 本质上是运行在浏览器后台的一个脚本，相当于一个"网络代理"，可以拦截请求、缓存资源、在离线时返回缓存内容。

它的基本流程包括：

1. 注册 Service Worker
2. `install` 阶段缓存静态资源
3. `activate` 阶段清理旧缓存
4. `fetch` 阶段拦截请求并决定走缓存还是走网络

常见的缓存策略：

- **Cache First**：优先走缓存，适合静态资源
- **Network First**：优先走网络，适合数据接口

需要注意的是，Service Worker 只能在 HTTPS 环境下运行。

</details>

> 补充：Service Worker 的实际应用场景——用户首次访问时，SW 在 `install` 阶段缓存首页 HTML、CSS、JS 等静态资源。当用户进入弱网或离线环境时，SW 拦截请求并从缓存中返回页面，保证基本可用性。对于数据接口，通常采用 Network First 策略（优先网络，失败再走缓存），既保证数据新鲜度又提供离线降级能力。
>
> 通过这种方式可以实现：离线访问、资源缓存加速、后台同步、推送通知等能力。

