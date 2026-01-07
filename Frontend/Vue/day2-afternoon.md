# 课程笔记：Vue3 + Pinia 核心状态管理与数据交互整理

---

## 一、Pinia 的角色与基础结构

### 知识点讲解

Pinia 是 Vue3 官方推荐的**全局状态管理工具**，用于存放**多个组件需要共享的数据**。
其核心思想是：**组件不再自己保存公共数据，而是从 store 中读取和修改**。

一个 Pinia store 的最基本结构由三部分组成：

* **`defineStore`**：定义一个 store
* **`state`**：真正存放数据的地方（类似 `reactive`）
* **`actions`**：修改 state 的业务方法

示例代码（来自对话中的 LoveTalk store）：

```ts
import { defineStore } from 'pinia'

export const useTalkStore = defineStore('talk', {
  state() {
    return {
      talkList: [
        { id: 'ftrfasdf01', title: '今天你有点怪，哪里怪？怪好看的！' }
      ]
    }
  }
})
```

这段代码说明：

* `'talk'` 是 store 的唯一标识
* `state()` 返回的对象就是**全局共享的响应式数据**
* Pinia 内部已经帮你做了 `reactive`，所以可以直接读写

在组件中使用：

```ts
import { useTalkStore } from '@/store/loveTalk'

const talkStore = useTalkStore()
```

随后即可通过 `talkStore.talkList` 访问数据。

---

### 📝 要点测验

<details>
<summary>为什么 Pinia 的 state 要写成函数而不是对象？</summary>
因为需要保证每个 store 实例的数据独立，和 Vue 组件的 `data()` 原理一致。
</details>

---

## 二、通过 actions 修改 state（含异步）

### 知识点讲解

Pinia 中**推荐所有带业务逻辑的修改都放在 actions 中**，组件只负责“调用”。

典型场景包括：

* 条件判断
* 异步请求
* 多步数据处理

示例：在 LoveTalk 中通过 actions 发请求并更新列表描述：

```ts
import axios from 'axios'
import { nanoid } from 'nanoid'

export const useTalkStore = defineStore('talk', {
  actions: {
    async getATalk() {
      let { data: { content: title } } =
        await axios.get('https://api.uomg.com/api/rand.qinghua?format=json')

      let obj = { id: nanoid(), title }
      this.talkList.unshift(obj)
    }
  },
  state() {
    return {
      talkList: []
    }
  }
})
```

这段代码体现了几个关键点：

* **actions 中可以写 async / await**
* `this` 指向当前 store 实例
* axios 用于发请求，nanoid 用于生成唯一 id
* 组件中只需要调用 `talkStore.getATalk()`

组件中的使用方式：

```ts
function getLoveTalk() {
  talkStore.getATalk()
}
```

---

### 📝 要点测验

<details>
<summary>为什么不建议在组件中直接写 axios 请求修改 Pinia 的数据？</summary>
因为业务逻辑应集中在 store 中，避免组件臃肿，提升可维护性与复用性。
</details>

---

## 三、Pinia 中修改 state 的三种方式（重点）

### 知识点讲解

Pinia 中**一共有三种修改 state 的方式**，但推荐程度不同。

#### 1️⃣ 直接修改（不推荐）

```ts
countStore.sum += 1
```

说明：

* 能生效，因为 state 是响应式的
* 但逻辑分散在组件中，维护性差

---

#### 2️⃣ `$patch` 批量修改（多数据推荐）

```ts
countStore.$patch({
  sum: 888,
  school: '尚硅谷',
  address: '北京'
})
```

说明：

* 一次性修改多个 state 字段
* 语义清晰，适合**批量更新**
* DevTools 中会被视为一次完整变更

---

#### 3️⃣ actions 修改（最推荐）

```ts
export const useCountStore = defineStore('count', {
  actions: {
    increment(value) {
      if (this.sum < 10) {
        this.sum += value
      }
    }
  },
  state() {
    return {
      sum: 6
    }
  }
})
```

组件中调用：

```ts
countStore.increment(n.value)
```

说明：

* actions 是“业务动作”的集中地
* 可以写判断、限制、规则
* 组件只关心“触发”，不关心“如何改”

---

### 📝 要点测验

<details>
<summary>什么时候优先使用 `$patch` 而不是 actions？</summary>
当需要一次性、无复杂逻辑地修改多个 state 字段时，优先使用 `$patch`。
</details>

---

## 四、v-model 与 ref 在组件中的协作

### 知识点讲解

`v-model` 是 Vue 提供的**双向数据绑定语法糖**，常用于表单元素。

示例代码：

```html
<select v-model.number="n">
  <option value="1">1</option>
  <option value="2">2</option>
</select>
```

```ts
let n = ref(1)
```

关键点：

* `v-model` = `:value` + `@input / @change`
* `.number` 修饰符会自动把字符串转成数字
* 避免出现 `"1" + 1 = "11"` 这种隐性 bug
* 模板中可以直接使用 `n`，不需要 `.value`

---

### 📝 要点测验

<details>
<summary>为什么 select 的 value 需要 `.number` 修饰符？</summary>
因为原生表单值默认是字符串，`.number` 可避免数值运算时的隐式类型错误。
</details>

---

## 五、toRefs 与 storeToRefs：解构不丢响应式

### 知识点讲解

**直接解构 reactive 或 store 会丢失响应式**：

```ts
const { sum } = countStore // ❌
```

为了解决这个问题，Vue 提供了 `toRefs`：

```ts
import { toRefs } from 'vue'

const { sum } = toRefs(obj)
```

作用：

* 把 reactive 对象的每个属性都转成 ref
* 防止解构导致响应式断裂

但 **toRefs 用在 Pinia store 上代价很大**，因为：

* 会把 **所有属性（包括方法）** 都包成 ref
* 造成不必要的 ProxyRef 开销

---

### Pinia 的专用方案：`storeToRefs`

```ts
import { storeToRefs } from 'pinia'

const { sum, school, address } = storeToRefs(countStore)
```

特点总结：

* ✅ 只处理 **state / getters**
* ❌ 不会处理 actions（方法保持原样）
* 是 **Pinia 场景下的最优解**

模板中可以直接使用：

```html
<h2>{{ sum }}</h2>
```

---

### 📝 要点测验

<details>
<summary>为什么不推荐直接对 Pinia store 使用 toRefs？</summary>
因为 toRefs 会把 store 上的所有属性（包括方法）都转成 ref，代价高且无意义。
</details>

---

> **复习提示**
>
> * 普通 reactive：用 `toRefs`
> * Pinia store：用 `storeToRefs`
> * 数据解构用 refs，方法永远走 store
