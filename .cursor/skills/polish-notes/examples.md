# 润色示例

## 题目形式示例

### 润色前（原始笔记）

```markdown
## 1.src与href的区别
- `src` 用来指定需要加载并嵌入当前页面的资源路径，常见于 `<script>`、`<img>` 等标签，浏览器解析到它时会发起资源请求，其中 `<script src>` 在默认情况下会阻塞 HTML 解析，直到脚本加载并执行完成。

- `href` 用来指定超链接地址或建立文档与外部资源的关联，常见于 `<a>`、`<link>` 等标签，一般是并行加载，不会直接中断当前文档的解析流程。
## 4. script标签的defer和async区别
`defer` 和 `async` 都用于异步加载外部 JS 脚本，加载时不会阻塞 HTML 解析，但两者的**执行时机和顺序不同**。

`async` 是下载完成后立即执行，执行顺序不确定，可能打断 HTML 解析，因此适用于彼此独立、没有依赖关系的脚本，比如埋点、广告脚本等。

`defer` 会在 HTML 解析完成后、`DOMContentLoaded` 触发前按顺序执行，保证多个脚本按书写顺序执行，适合依赖 DOM 或存在前后依赖关系的脚本。

简单记忆就是：  
**async 快但乱，defer 稳且有序。**

> 补充：很好，终于问到本质了，而不是只背属性名字。

### 1️⃣ "外部 JS 脚本"是相对于什么？

这里的"外部"是相对于**内联脚本（inline script）**来说的。

- 内联脚本：

（...大段AI风格的讲解内容...）

`async` 和 `defer` **只对带 `src` 的外部脚本生效**，对内联脚本是没用的。因为内联脚本根本不存在"下载过程"，浏览器读到就直接执行了，没什么好"异步"的。

---

### 2️⃣ DOMContentLoaded 是什么？

`DOMContentLoaded` 是一个浏览器事件。

它表示：  
👉 **HTML 文档已经被完全解析成 DOM 树**  
👉 但不要求图片、CSS、视频等资源加载完成

（...大段AI风格讲解...）
```

### 润色后（目标输出）

```markdown
## 1.src与href的区别

<details>
<summary>答案</summary>

`src` 用来指定需要加载并嵌入当前页面的资源路径，常见于 `<script>`、`<img>` 等标签，浏览器解析到它时会发起资源请求，其中 `<script src>` 在默认情况下会阻塞 HTML 解析，直到脚本加载并执行完成。

`href` 用来指定超链接地址或建立文档与外部资源的关联，常见于 `<a>`、`<link>` 等标签，一般是并行加载，不会直接中断当前文档的解析流程。

</details>

## 4.script标签的defer和async区别

<details>
<summary>答案</summary>

`defer` 和 `async` 都用于异步加载外部 JS 脚本，加载时不会阻塞 HTML 解析，但两者的**执行时机和顺序不同**。

`async` 是下载完成后立即执行，执行顺序不确定，可能打断 HTML 解析，因此适用于彼此独立、没有依赖关系的脚本，比如埋点、广告脚本等。

`defer` 会在 HTML 解析完成后、`DOMContentLoaded` 触发前按顺序执行，保证多个脚本按书写顺序执行，适合依赖 DOM 或存在前后依赖关系的脚本。

简单记忆：**async 快但乱，defer 稳且有序。**

</details>

> 补充：`async` 和 `defer` 只对带 `src` 的外部脚本生效，内联脚本不存在下载过程，浏览器读到就直接执行，因此无需异步。
>
> `DOMContentLoaded` 表示 HTML 文档已被完全解析成 DOM 树，但不要求图片、CSS 等资源加载完成。与之对比，`load` 事件要求所有资源全部加载完成。`defer` 脚本在 HTML 解析完成后、`DOMContentLoaded` 触发前按顺序执行。
>
> | 事件 | 触发时机 |
> |------|----------|
> | DOMContentLoaded | HTML 解析完成 |
> | load | 所有资源加载完成 |

::: tip 面试要点
区分 async 和 defer 的核心在于执行时机：async 下载完立即执行（打断解析），defer 等解析完再按序执行。注意两者仅对外部脚本生效。
:::
```

---

## 笔记形式示例

### 润色后（目标输出）

参考 `Projects/vue3rabbit/01-基础与项目搭建.md` 的风格：

```markdown
# Pinia 核心用法

> **本页关键词**：defineStore、storeToRefs、组合式写法、单例模式、Flux 架构

---

## 一、为什么用 Pinia

多个组件需要共享同一份数据时（如用户登录信息、购物车、分类列表），如果用 props 层层传递会非常麻烦。Pinia 提供了一个「全局单例仓库」，任何组件都可以直接读写。

---

## 二、定义 Store（组合式写法）

Pinia 支持 Options API 和 Composition API 两种风格定义 Store。统一使用**组合式写法**，和组件内的写法完全一致 — `ref` 当 state，`computed` 当 getter，普通函数当 action：

代码示例...

**为什么需要 storeToRefs**：直接解构会丢失响应式。`storeToRefs` 把 store 内的 state/getter 转为独立的 ref，解构后仍能响应式更新。action 是普通函数，不需要响应式转换。

> **面试要点**：Pinia vs Vuex — 去掉了 mutation，天然支持 Composition API，每个 store 独立模块；Store 是单例模式，多个组件 `useXxxStore()` 拿到的是同一个实例。
```
