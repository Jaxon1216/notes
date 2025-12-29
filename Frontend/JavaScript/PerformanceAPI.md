
## 一、Performance API 总览

### 1. Performance API 是什么？

**Performance API** 是浏览器提供的一组用于**高精度测量网页性能数据**的接口集合。

它解决的问题是：

> “浏览器在**什么时候**、**做了什么**、**花了多长时间**？”

与 `Date.now()` 不同，Performance API：

* 精度更高（微秒级）
* 以浏览器内部时间轴为基准
* 可测量网络、渲染、JS 执行等关键阶段

---

### 2. Performance API 能做什么？

Performance API 可以用来：

* 分析页面加载慢的原因（DNS / TCP / TTFB / DOM）
* 衡量用户真实体验（首屏、可交互时间）
* 做性能监控、性能埋点、性能报警
* 评估优化是否真正生效

**它是所有前端性能优化的“数据基础”。**

---

## 二、Performance API 的核心对象

### 1. `window.performance`

```js
console.log(window.performance)
```

这是 Performance API 的入口对象，主要包含：

* 时间基准
* 性能记录访问接口
* 性能记录管理接口

---

### 2. 高精度时间：`performance.now()`

```js
performance.now()
```

特点：

* 返回一个 **相对时间**（从页面开始加载算起）
* 单位是毫秒，但精度高于 `Date.now()`
* 不受系统时间修改影响

常用于：

* JS 函数执行耗时
* 动画帧间隔测量
* 算法性能对比

---

## 三、Performance Entry（核心概念）

### 1. 什么是 Performance Entry？

**Performance Entry** 是浏览器记录的一条“性能事件”。

例如：

* 加载了一个 JS 文件
* 页面发生了一次导航
* 开发者手动打了一个点

这些都会变成一条 **Entry 记录**。

---

### 2. Entry 的通用结构

所有 Entry 都至少包含：

```ts
{
  name: string
  entryType: string
  startTime: number
  duration: number
}
```

不同类型的 Entry，会在此基础上扩展字段。

---

## 四、`performance.getEntries*` 系列方法

### 1. `performance.getEntries()`

```js
performance.getEntries()
```

* 返回 **所有类型的 Entry**
* 很少直接使用（数据太杂）

---

### 2. `performance.getEntriesByType(type)`

```js
performance.getEntriesByType('resource')
performance.getEntriesByType('navigation')
performance.getEntriesByType('mark')
performance.getEntriesByType('measure')
```

这是**最常用的方法**。

> 根据 Entry 类型获取对应的性能记录数组。

---

### 3. `performance.getEntriesByName(name, type?)`

```js
performance.getEntriesByName('my-mark', 'mark')
```

用于获取特定名称的 Entry。

---

## 五、Navigation Timing（页面加载性能）

### 1. `navigation` Entry 是什么？

```js
performance.getEntriesByType('navigation')
```

返回的是：

```ts
PerformanceNavigationTiming[]
```

它描述的是：

> **当前文档是如何被加载的**

---

### 2. 为什么返回数组？

* Performance API 统一设计为“Entry 列表”
* 理论上可能存在多条 navigation 记录
* 与 resource / mark / measure 保持一致

在**普通页面中通常只有一个**，但不能假设一定存在。

---

### 3. 常用字段（重点）

```js
const nav = performance.getEntriesByType('navigation')[0]
```

| 字段                      | 含义                               |
| ----------------------- | -------------------------------- |
| `startTime`             | 通常为 0                            |
| `type`                  | navigate / reload / back_forward |
| `domainLookupStart/End` | DNS 查询                           |
| `connectStart/End`      | TCP 建立                           |
| `requestStart`          | 请求发出                             |
| `responseEnd`           | 响应完成                             |
| `domInteractive`        | DOM 可交互                          |
| `loadEventEnd`          | 页面完全加载                           |

---

## 六、Resource Timing（资源加载性能）

### 1. resource Entry 是什么？

```js
performance.getEntriesByType('resource')
```

用于分析：

* JS / CSS / 图片加载是否慢
* 哪些资源阻塞页面
* CDN 是否生效

---

### 2. resource Entry 示例

```js
{
  name: "https://cdn.xxx.com/app.js",
  entryType: "resource",
  initiatorType: "script",
  startTime: 123.4,
  responseEnd: 456.7
}
```

---

### 3. 常见 `initiatorType`

* `script`
* `link`
* `img`
* `fetch`
* `xmlhttprequest`

---

## 七、User Timing（自定义性能打点）

### 1. `performance.mark()`

```js
performance.mark('api-start')
```

用于记录一个时间点。

---

### 2. `performance.measure()`

```js
performance.measure('api-cost', 'api-start')
```

用于计算两个 mark 之间的耗时。

---

### 3. 获取自定义测量结果

```js
performance.getEntriesByType('measure')
```

这是**SPA 性能监控的核心手段**。

---

## 八、Performance Observer（监听性能事件）

### 1. 为什么需要 Observer？

`getEntriesByType` 是“事后获取”。

而 **PerformanceObserver 是实时监听**。

---

### 2. 示例

```js
const observer = new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    console.log(entry)
  }
})

observer.observe({ entryTypes: ['resource', 'navigation'] })
```

---

## 九、常见坑与注意事项

### 1. SPA 路由切换不会产生 navigation entry

* 因为没有真正的文档导航
* 需要用 mark / measure 自行打点

---

### 2. Entry 缓冲区可能被清空

```js
performance.clearResourceTimings()
```

---

### 3. 不同浏览器支持度不同

* 老浏览器可能没有 navigation timing level 2
* 永远做好兜底判断

---

## 十、工程级安全使用示例

```js
function getNavigationTimingSafe() {
  if (!window.performance?.getEntriesByType) return null

  const entries = performance.getEntriesByType('navigation')
  if (!entries.length) return null

  return entries[0]
}
```

---

## 十一、你现在应该掌握的核心认知

* Performance API 是 **性能数据源**
* 所有性能数据都是 **Entry**
* `getEntriesByType` 永远返回 **数组**
* Navigation ≠ SPA 路由
* User Timing 是 SPA 性能的关键

---

下面我给你做一次**“前端性能 + 页面形态扫盲表”**，目标是：
**看到名词 → 立刻知道它是什么、发生在什么时候、和 SPA 有没有关系。**

你可以把这张表当成 **性能 API / 面试 / 学习地图** 来用。

---

## 一、核心名词总览表（重点扫盲）

| 名词              | 全称 / 类型                       | 是什么（一句话）       | 发生阶段   | SPA 中是否会重复发生 |
| --------------- | ----------------------------- | -------------- | ------ | ------------ |
| DNS             | Domain Name System            | 把域名解析成 IP 地址   | 网络开始阶段 | ❌（通常只首屏）     |
| TCP             | Transmission Control Protocol | 与服务器建立可靠连接     | DNS 之后 | ❌（连接可复用）     |
| TLS / SSL       | Transport Layer Security      | HTTPS 加密握手     | TCP 之后 | ❌            |
| TTFB            | Time To First Byte            | 请求发出到收到第一个字节   | 请求阶段   | ❌            |
| HTML 下载         | Document Fetch                | 下载 HTML 文档     | 网络阶段   | ❌            |
| DOM 解析          | DOM Parsing                   | HTML → DOM 树   | 渲染阶段   | ❌            |
| CSSOM           | CSS Object Model              | CSS → CSSOM 树  | 渲染阶段   | ❌            |
| Render Tree     | 渲染树                           | DOM + CSSOM 合并 | 渲染阶段   | ❌            |
| Layout          | 回流                            | 计算元素位置大小       | 渲染阶段   | ❌            |
| Paint           | 绘制                            | 像素绘制到屏幕        | 渲染阶段   | ❌            |
| Load Event      | load                          | 所有资源加载完成       | 页面结束   | ❌            |
| SPA             | 单页应用                          | JS 控制页面切换      | 架构形态   | ——           |
| Router          | 前端路由                          | URL 变化但不刷新     | SPA 内部 | ✅            |
| AJAX / Fetch    | 异步请求                          | 后台拉数据          | 运行阶段   | ✅            |
| Resource Timing | 性能记录                          | JS/CSS/图片加载数据  | 加载阶段   | ✅            |
| User Timing     | 自定义打点                         | 手动测量性能         | 任意     | ✅            |
| iframe          | 内嵌文档                          | 页面里的“子页面”      | 独立上下文  | 部分           |

---

## 二、网络阶段名词详解（DNS / TCP / TTFB）

### 1. DNS（域名解析）

**你输入：**

```
www.example.com
```

浏览器要先问：

> “这个域名对应哪个 IP？”

这个过程叫 **DNS 查询**。

```txt
www.example.com → 93.184.216.34
```

📌 特点：

* 非常靠前
* 慢了会直接拖慢整个页面
* 可通过 DNS 缓存 / 预解析优化

---

### 2. TCP（建立连接）

有了 IP 后，浏览器要和服务器 **建立连接通道**。

* 三次握手
* 建立可靠连接

📌 特点：

* 一旦建立，通常可以复用
* HTTP/2 / HTTP/3 会更高效

---

### 3. TLS / SSL（HTTPS 握手）

如果是 HTTPS：

* 需要加密协商
* 确认身份
* 生成加密密钥

📌 特点：

* 比 HTTP 多一步
* HTTPS ≠ 慢（现代浏览器优化很多）

---

### 4. TTFB（重点）

**TTFB = Time To First Byte**

> 从“请求发出”到“收到服务器第一个字节”的时间

包含：

* 网络传输
* 服务器处理
* 后端逻辑执行

📌 判断问题归因：

| TTFB 慢 | 说明        |
| ------ | --------- |
| 高      | 后端慢 / 网络慢 |
| 低      | 前端渲染可能是瓶颈 |

---

## 三、渲染阶段名词扫盲

### DOM / CSSOM / Render Tree

浏览器渲染三部曲：

1. HTML → **DOM**
2. CSS → **CSSOM**
3. DOM + CSSOM → **Render Tree**

⚠️ JS 和 CSS 会阻塞渲染。

---

### Layout / Paint

* **Layout（回流）**：算位置
* **Paint（重绘）**：画像素

频繁触发 = 性能差。

---

## 四、SPA 相关名词集中解释

### 1. SPA（Single Page Application）

* 只有一个 HTML
* 页面切换靠 JS
* 不触发 navigation

---

### 2. Router（前端路由）

```js
history.pushState({}, '', '/profile')
```

* URL 变了
* 页面没刷新

---

### 3. SPA 为什么 DNS / TCP 不重复？

因为：

```txt
页面没刷新
连接没断
```

所以：

* navigation timing 不变
* 但 resource / fetch 会新增

---

## 五、iframe 是什么？（重点扫盲）

### 1. iframe 是什么？

```html
<iframe src="https://other-site.com"></iframe>
```

**iframe 是：**

> 页面里嵌套的一个“独立网页”

---

### 2. iframe 的关键特性

| 特性            | 说明                     |
| ------------- | ---------------------- |
| 独立 document   | 有自己的 DOM               |
| 独立 navigation | 有自己的 navigation timing |
| 独立 JS         | 有自己的全局作用域              |
| 安全隔离          | 跨域受限                   |

---

### 3. iframe 和 Performance API 的关系

* 主页面：一套 performance 数据
* iframe 页面：**自己的一套**

```js
iframe.contentWindow.performance.getEntriesByType('navigation')
```

---

## 六、Performance API 和这些名词的对应关系

| 名词        | Performance API 字段           |
| --------- | ---------------------------- |
| DNS       | domainLookupStart / End      |
| TCP       | connectStart / End           |
| TLS       | secureConnectionStart        |
| TTFB      | responseStart - requestStart |
| HTML 加载   | responseEnd                  |
| DOM Ready | domContentLoadedEventEnd     |
| 页面完成      | loadEventEnd                 |

---

## 七、一句话总复盘（非常重要）

> **DNS / TCP / TLS / TTFB 只发生在“真正加载页面”时，SPA 路由切换不会重复；iframe 是页面里的“独立小页面”，有自己完整的性能生命周期。**

---
