
# 课程笔记：Vue3 核心指令与响应式机制入门（零 Vue2 基础版）

---

## 一、Vue 指令体系（v- 是什么 & 常见指令用法）

### 什么是 `v-`？

**`v-` 是 Vue 提供的“模板指令前缀”**，本质是：

> **在模板中，声明式地告诉 Vue：这个 DOM 要如何和 JS 数据产生关系**

Vue 会把这些 `v-` 指令 **编译成底层的 DOM 操作代码**。

你可以理解为：

```txt
v-指令 = Vue 帮你写好的 DOM 操作语法糖
```

---

### v-if / v-show（控制 DOM 显隐）

#### 1️⃣ v-if：控制 DOM 的「创建 / 销毁」

```vue
<p v-if="isLogin">欢迎你</p>
```

**等价 JS 行为（理解用）**：

```js
if (isLogin) {
  创建 DOM
} else {
  删除 DOM
}
```

**核心特点：**

* 条件为 `false` → **DOM 不存在**
* 切换时会触发生命周期（创建 / 卸载）
* **性能成本高，适合低频切换**

---

#### 2️⃣ v-show：控制 CSS 显示隐藏

```vue
<p v-show="isLogin">欢迎你</p>
```

**等价 JS 行为：**

```js
el.style.display = isLogin ? 'block' : 'none'
```

**核心特点：**

* DOM **始终存在**
* 只改 `display`
* **高频切换首选**

---

### v-on（事件绑定）

```vue
<button v-on:click="add">+</button>
<!-- 简写 -->
<button @click="add">+</button>
```

```js
function add() {
  count++
}
```

**等价 JS：**

```js
button.addEventListener('click', add)
```

---

### v-bind（属性绑定）

```vue
<img v-bind:src="imgUrl" />
<!-- 简写 -->
<img :src="imgUrl" />
```

**等价 JS 行为（注意不是 setAttribute 原样）**：

```js
img.src = imgUrl
```

⚠️ **重点纠正你的误区**：

> ❌ `setAttribute` 不是“提取 id 内容”
> ✅ `setAttribute` 是 **设置 HTML 属性**

```js
el.setAttribute('id', 'box') // 设置
el.getAttribute('id')        // 获取
```

Vue 内部会根据属性类型，**智能选择 property / attribute**，而不是傻用 `setAttribute`。

---

### v-model（双向绑定，重点）

#### 最基础用法（输入框）

```vue
<input v-model="username" />
<p>{{ username }}</p>
```

**发生了什么？**

```txt
1. v-bind:value="username"
2. v-on:input="username = $event.target.value"
```

👉 **v-model = v-bind + v-on 的语法糖**

---

#### 表单控件常见例子

##### 复选框

```vue
<input type="checkbox" v-model="agree" />
```

```js
agree = true / false
```

##### 单选框

```vue
<input type="radio" value="male" v-model="gender" />
<input type="radio" value="female" v-model="gender" />
```

```js
gender = 'male'
```

---

### 📝 要点测验

<details>
<summary>v-if 和 v-show 的核心区别是什么？</summary>

v-if 控制 DOM 的创建和销毁，切换成本高但初始性能好；
v-show 始终保留 DOM，仅通过 display 控制显示，适合频繁切换。

</details>

<details>
<summary>v-model 的底层本质是什么？</summary>

v-model 是 v-bind:value + v-on:input 的语法糖，实现数据与视图的双向同步。

</details>

---

## 二、Vue3 响应式进阶：toRaw / markRaw / customRef

### toRaw（拿回原始对象）

```js
const obj = reactive({ count: 0 })
const raw = toRaw(obj)
```

**作用：**

* 从 Proxy 中取出 **原始对象**
* **调试 / 传给第三方库**

⚠️ **不要用 raw 去修改数据**

---

### markRaw（让对象不被响应式处理）

```js
const map = markRaw(new Map())
```

**使用场景：**

* 第三方实例（ECharts、Map、播放器）
* 大对象，不需要响应式

```txt
markRaw = 告诉 Vue：别管它
```

---

### customRef（自定义响应式行为）

#### 场景：防抖输入

```js
function useDebouncedRef(value, delay = 500) {
  let timer
  return customRef((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        value = newValue
        trigger()
      }, delay)
    }
  }))
}
```

```js
const keyword = useDebouncedRef('')
```

**意义：**

* Vue 官方留给你的 **“响应式钩子”**
* 可把防抖 / 节流写进响应式系统

---

### 防抖 vs 节流（复习）

| 类型 | 核心思想     | 例子   |
| -- | -------- | ---- |
| 防抖 | 停下来才执行   | 搜索框  |
| 节流 | 一段时间执行一次 | 滚动监听 |

---

### 📝 要点测验

<details>
<summary>markRaw 和 toRaw 的区别？</summary>

markRaw 是“从一开始就不做响应式”；
toRaw 是“已经响应式了，再拿回原始对象”。

</details>

<details>
<summary>customRef 的核心价值是什么？</summary>

允许开发者自定义 get/set 行为，把防抖、节流等逻辑注入 Vue 响应式系统。

</details>

---

## 三、Vue2 → Vue3 必须知道的变化（零基础版）

### 全局 API 改变（重要）

#### Vue2（你只需要“知道它存在过”）

```js
Vue.component()
Vue.use()
Vue.mixin()
```

#### Vue3（必须会）

```js
const app = createApp(App)

app.component()
app.use()
app.mixin()
app.mount('#app')
```

👉 **所有全局能力都挂在 app 上**

---

### 响应式系统升级

| Vue2                  | Vue3  |
| --------------------- | ----- |
| Object.defineProperty | Proxy |
| 无法监听新增属性              | 完美支持  |
| 数组 hack               | 原生支持  |

---

### v-model 改动（你要记住的）

* Vue3 默认 `modelValue`
* 可多个 v-model

```vue
<MyComp v-model:title="title" />
```

---

### 生命周期变化（认识即可）

| Vue2          | Vue3          |
| ------------- | ------------- |
| beforeDestroy | beforeUnmount |
| destroyed     | unmounted     |

---

### 📝 要点测验

<details>
<summary>为什么 Vue3 不再直接用 Vue.component？</summary>

Vue3 使用 createApp 创建应用实例，避免全局污染，支持多应用并存。

</details>

<details>
<summary>Vue3 响应式为什么更强？</summary>

基于 Proxy，可拦截所有操作，支持新增属性、删除属性和数组变化。

</details>

---

