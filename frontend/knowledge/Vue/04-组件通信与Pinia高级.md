# Vue3 组件通信与 Pinia 高级

> **本页关键词**：Getters、$subscribe、Store 组合式、props、自定义事件、mitt、v-model 组件、$attrs、$refs/$parent、provide/inject、插槽

---

## 一、Pinia 的 Getters：数据加工与计算属性

### 知识点讲解

**Getters 的作用**

当 `state` 中的数据需经处理后再使用时，可使用 `getters` 配置。Getters 类似于 Vue 组件中的 **computed 计算属性**：

* 对原始 state 进行逻辑加工
* 结果会被缓存，依赖未变化时不会重新计算
* 可在其他 getters 或组件中使用

---

### Getters 的两种写法

#### 1. 接收 state 参数（推荐用箭头函数）

```ts
import { defineStore } from 'pinia'

export const useCountStore = defineStore('count', {
  state() {
    return {
      sum: 1,
      school: 'atguigu'
    }
  },
  getters: {
    bigSum: (state): number => state.sum * 10
  }
})
```

#### 2. 使用 this 访问（必须用普通函数）

```ts
getters: {
  bigSum: (state): number => state.sum * 10,
  upperSchool(): string {
    return this.school.toUpperCase()
  }
}
```

使用 `this` 可访问 state、其他 getters、甚至 actions；必须用**普通函数**（箭头函数的 this 不指向 store）。

---

### 组件中使用 Getters

```vue
<template>
  <div>
    <h3>原始sum：{{ sum }}</h3>
    <h3>放大后的sum：{{ bigSum }}</h3>
    <h3>学校：{{ school }}</h3>
    <h3>大写学校：{{ upperSchool }}</h3>
  </div>
</template>

<script setup lang="ts">
import { useCountStore } from '@/store/count'
import { storeToRefs } from 'pinia'

const countStore = useCountStore()
let { sum, school, bigSum, upperSchool } = storeToRefs(countStore)
</script>
```

---

<details>
<summary>Getters 与直接在组件中用 computed 计算有什么区别？</summary>
Getters 定义在 store 中，可被多个组件复用；computed 定义在组件内，只能在当前组件使用。若多个组件需要相同计算逻辑，应使用 Getters。
</details>

<details>
<summary>为什么使用 this 时必须用普通函数而不能用箭头函数？</summary>
箭头函数的 this 是词法作用域，指向定义时的上下文；普通函数的 this 由 Pinia 绑定为当前 store 实例，才能访问到 state、getters 和 actions。
</details>

---

## 二、$subscribe：状态变化监听与持久化

### 知识点讲解

通过 store 的 `$subscribe()` 方法可侦听 `state` 及其变化。常用于：数据持久化（同步到 localStorage）、日志记录、数据变化的副作用处理。

### 基本用法

```ts
import { useTalkStore } from '@/store/loveTalk'

const talkStore = useTalkStore()

talkStore.$subscribe((mutate, state) => {
  console.log('LoveTalk', mutate, state)
  localStorage.setItem('talk', JSON.stringify(state.talkList))
})
```

**参数说明：**

* **`mutate`**：变化的详细信息（`type`、`storeId`、`events`）
* **`state`**：变化后的完整 state 对象

---

<details>
<summary>$subscribe 和 Vue 的 watch 有什么区别？</summary>
`$subscribe` 是 Pinia 专门用于监听整个 store 变化的 API，会在任何 state 变化时触发；`watch` 需明确指定监听的响应式数据。`$subscribe` 更适合全局持久化等场景。
</details>

<details>
<summary>如果在多个组件中都调用了 $subscribe，会执行几次？</summary>
会执行多次。每次调用 `$subscribe` 都会注册一个新的监听器。建议在应用入口或根组件中调用一次即可。
</details>

---

## 三、Store 组合式（Setup）写法

### 知识点讲解

Pinia 支持**组合式写法**（Composition API），与 Vue3 的 `<script setup>` 风格一致，可直接使用 ref、reactive、computed。

**核心规则：**

* 使用 **`ref()` 或 `reactive()`** 定义 state
* 使用 **`computed()`** 定义 getters
* 使用 **`function`** 定义 actions
* **必须通过 `return` 暴露**需要给外部使用的属性和方法

### 完整示例

```ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { reactive } from 'vue'

export const useTalkStore = defineStore('talk', () => {
  const talkList = reactive(
    JSON.parse(localStorage.getItem('talkList') as string) || []
  )

  async function getATalk() {
    let { data: { content: title } } = await axios.get('https://api.uomg.com/api/rand.qinghua?format=json')
    let obj = { id: nanoid(), title }
    talkList.unshift(obj)
  }

  return { talkList, getATalk }
})
```

### 选项式 vs 组合式对照表

| 类型 | 选项式写法 | 组合式写法 |
|------|-----------|-----------|
| **State** | `state() { return {...} }` | `ref()` 或 `reactive()` |
| **Getters** | `getters: {...}` | `computed()` |
| **Actions** | `actions: {...}` | 普通 `function` |
| **暴露** | 自动暴露 | 需要 `return { }` |

---

<details>
<summary>组合式写法中，为什么必须 return？</summary>
组合式写法本质是一个函数，函数内部的变量默认是局部的。只有通过 `return` 暴露的属性和方法，才能被组件访问到。
</details>

<details>
<summary>如果要在组合式 store 中定义 getter，应该怎么写？</summary>

使用 Vue 的 `computed()` API：

```ts
import { computed } from 'vue'

const bigSum = computed(() => sum.value * 10)
return { sum, bigSum }
```

</details>

---

## 四、组件通信概述与变化

### Vue3 组件通信的变化

| 变化类型 | Vue2 | Vue3 |
|---------|------|------|
| **事件总线** | `$bus` | 移除，使用 `mitt` 代替 |
| **状态管理** | `Vuex` | 推荐使用 `Pinia` |
| **双向绑定** | `v-model` + `.sync` | 统一为 `v-model`（支持多个） |
| **属性透传** | `$attrs` + `$listeners` | 合并为 `$attrs` |
| **子组件访问** | `$children` | 移除，使用 `ref` |

### 常见通信方式与适用场景

| 方式 | 适用关系 | 说明 |
|------|---------|------|
| **props** | 父 ↔ 子 | 最常用，父传子用数据，子传父用函数 |
| **自定义事件** | 子 → 父 | 子组件通过 emit 向父组件发送消息 |
| **v-model** | 父 ↔ 子 | 双向绑定语法糖，支持多个绑定 |
| **$attrs** | 祖 → 孙 | 属性透传，跨层级传递 props |
| **$refs** | 父 → 子 | 父组件直接访问子组件实例 |
| **$parent** | 子 → 父 | 子组件访问父组件实例 |
| **provide/inject** | 祖 ↔ 孙 | 依赖注入，祖先向后代提供数据 |
| **mitt** | 任意组件 | 事件总线，适合兄弟或远距离组件 |
| **pinia** | 任意组件 | 全局状态管理 |
| **slot** | 父 → 子 | 内容分发，父组件定制子组件结构 |

---

## 五、Props：最基础的父子通信

### 知识点讲解

Props 用于**父子组件间的数据传递**：

* **父传子**：属性值是**非函数**（数据）
* **子传父**：属性值是**函数**（回调）

**父组件：**

```vue
<template>
  <div class="father">
    <h3>父组件</h3>
    <h4>我的车：{{ car }}</h4>
    <h4>儿子给的玩具：{{ toy }}</h4>
    <Child :car="car" :getToy="getToy"/>
  </div>
</template>

<script setup lang="ts" name="Father">
import Child from './Child.vue'
import { ref } from "vue";

const car = ref('奔驰')
const toy = ref()

function getToy(value: string) {
  toy.value = value
}
</script>
```

**子组件：**

```vue
<template>
  <div class="child">
    <h3>子组件</h3>
    <h4>我的玩具：{{ toy }}</h4>
    <h4>父给我的车：{{ car }}</h4>
    <button @click="getToy(toy)">玩具给父亲</button>
  </div>
</template>

<script setup lang="ts" name="Child">
import { ref } from "vue";

const toy = ref('奥特曼')
defineProps(['car', 'getToy'])
</script>
```

---

<details>
<summary>为什么说"子传父"时传的是函数？</summary>
因为数据的所有权在父组件，子组件不能直接修改父组件的数据。通过传递函数，子组件可以调用并传入参数，从而间接让父组件更新自己的数据。
</details>

<details>
<summary>defineProps 返回的对象可以解构吗？</summary>
不建议直接解构，因为会失去响应式。若必须解构，需使用 `toRefs(props)`。在模板中可直接使用 props 的属性名。
</details>

---

## 六、自定义事件：更语义化的子传父

### 知识点讲解

自定义事件实现**子 → 父**通信，比 props 传函数更语义化。

**关键区别：`$event` 的含义不同**

| 事件类型 | `$event` 的含义 | 示例 |
|---------|----------------|------|
| **原生事件** | 事件对象（pageX、pageY、target、keyCode 等） | `@click="handler"` |
| **自定义事件** | `emit` 触发时传递的数据（任意类型） | `@send-toy="toy = $event"` |

**父组件：**

```vue
<template>
  <div class="father">
    <h3>父组件</h3>
    <h4>儿子给的玩具：{{ toy }}</h4>
    <Child @send-toy="toy = $event"/>
  </div>
</template>

<script setup lang="ts" name="Father">
import Child from './Child.vue'
import { ref } from "vue";
const toy = ref('')
</script>
```

**子组件：**

```vue
<template>
  <div class="child">
    <h3>子组件</h3>
    <h4>我的玩具：{{ toy }}</h4>
    <button @click="emit('send-toy', toy)">玩具给父亲</button>
  </div>
</template>

<script setup lang="ts" name="Child">
import { ref } from "vue";
const toy = ref('奥特曼')
const emit = defineEmits(['send-toy'])
</script>
```

---

<details>
<summary>自定义事件相比 props 传函数有什么优势？</summary>
语义更清晰，可读性更好。`@send-toy` 明确表达"发送玩具"的意图。
</details>

---

## 七、Mitt：全局事件总线

### 知识点讲解

Mitt 是轻量级事件总线库，类似 Vue2 的 `$bus`，可实现**任意组件间通信**，适合兄弟组件、层级相隔较远的组件、不想用 Pinia 的简单场景。

### 安装与配置

```bash
npm i mitt
```

新建 `src/utils/emitter.ts`：

```ts
import mitt from "mitt";
const emitter = mitt()
export default emitter
```

### 使用流程

**接收方 - 绑定事件：**

```vue
<script setup lang="ts" name="Child2">
import emitter from "@/utils/emitter";
import { onUnmounted } from "vue";
import { ref } from "vue";

const toy = ref('')

emitter.on('send-toy', (value) => {
  toy.value = value as string
})

onUnmounted(() => {
  emitter.off('send-toy')
})
</script>
```

**发送方 - 触发事件：**

```vue
<script setup lang="ts" name="Child1">
import emitter from "@/utils/emitter";
import { ref } from "vue";

const toy = ref('奥特曼')

function sendToy() {
  emitter.emit('send-toy', toy.value)
}
</script>
```

### 核心 API

| API | 说明 |
|-----|------|
| `emitter.on(event, handler)` | 绑定事件监听 |
| `emitter.emit(event, data)` | 触发事件 |
| `emitter.off(event)` | 解绑指定事件 |
| `emitter.all.clear()` | 清空所有事件 |

> **面试要点**：必须在组件卸载前解绑事件，否则导致内存泄漏和重复监听。

---

<details>
<summary>Mitt 和 Pinia 都能实现任意组件通信，如何选择？</summary>
* **Mitt**：适合简单的消息通知、事件触发
* **Pinia**：适合需要持久化、复杂状态管理的场景
</details>

<details>
<summary>为什么 emitter 要单独建一个文件？</summary>
需要确保整个应用使用**同一个 emitter 实例**。若每个组件都 `mitt()`，会创建多个独立实例，无法实现通信。
</details>

---

## 八、v-model：双向绑定的组件化应用

### 知识点讲解

**在组件上使用 v-model**

本质是 `:modelValue` + `@update:modelValue`：

```vue
<AtguiguInput v-model="userName"/>
<!-- 等价于 -->
<AtguiguInput 
  :modelValue="userName" 
  @update:modelValue="userName = $event"
/>
```

**子组件实现：**

```vue
<template>
  <div class="box">
    <input 
      type="text" 
      :value="modelValue" 
      @input="emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>

<script setup lang="ts" name="AtguiguInput">
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>
```

### 自定义 v-model 参数名与多 v-model

```vue
<AtguiguInput v-model:abc="userName"/>
<!-- 子组件：defineProps(['abc'])、emit('update:abc', ...) -->
```

```vue
<AtguiguInput v-model:ming="userName" v-model:mima="password"/>
```

> **面试要点**：Vue3 的 v-model 支持自定义参数名和多个绑定；子组件不能直接修改 modelValue，必须通过 emit。

---

<details>
<summary>为什么 Vue3 的 v-model 比 Vue2 更强大？</summary>
Vue2 中一个组件只能有一个 v-model，多个需用 `.sync`。Vue3 统一为 v-model，支持自定义参数名，一个组件可绑定多个。
</details>

<details>
<summary>子组件能直接修改 modelValue 吗？</summary>
不能。Props 是单向数据流，必须通过 emit 触发 `update:modelValue` 事件通知父组件更新。
</details>

---

## 九、$attrs：属性透传机制

### 知识点讲解

`$attrs` 用于**祖 → 孙**通信。包含所有父组件传入的标签属性，**自动排除** `props` 中声明的属性。可通过 `v-bind="$attrs"` 一次性透传。

**中间层子组件：**

```vue
<template>
  <div class="child">
    <GrandChild v-bind="$attrs"/>
  </div>
</template>

<script setup lang="ts" name="Child">
import GrandChild from './GrandChild.vue'
</script>
```

若子组件声明了 `defineProps(['a', 'b'])`，则 `$attrs` 中不包含 `a`、`b`。

---

<details>
<summary>$attrs 和 provide/inject 都能实现祖孙通信，如何选择？</summary>
* **$attrs**：适合属性透传，中间组件不需要使用这些数据
* **provide/inject**：适合深层依赖注入，多个后代都要用
</details>

<details>
<summary>Vue3 的 $attrs 相比 Vue2 有什么变化？</summary>
Vue2 有 `$attrs` 和 `$listeners`；Vue3 将事件监听器合并到 `$attrs` 中，统一管理。
</details>

---

## 十、$refs 与 $parent：实例访问

### 知识点讲解

| 属性 | 方向 | 说明 |
|------|------|------|
| `$refs` | 父 → 子 | 父组件访问子组件实例 |
| `$parent` | 子 → 父 | 子组件访问父组件实例 |

子组件必须用 `defineExpose` 暴露数据；父组件通过 `ref` 属性标记子组件。`$parent` 在模板中直接使用，`<script setup>` 中不可用；会导致强耦合，不推荐频繁使用。

---

<details>
<summary>为什么 script setup 中的数据默认不对外暴露？</summary>
Vue3 的设计：组件应封装，只暴露必要接口。`defineExpose` 显式暴露可防止外部随意访问内部状态。
</details>

<details>
<summary>$refs 和 props 都能父传子，有什么区别？</summary>
* **props**：数据流清晰，单向传递（推荐）
* **$refs**：直接访问实例，可调用方法和修改数据，但强耦合
</details>

---

## 十一、provide 与 inject：依赖注入

### 知识点讲解

祖先通过 `provide` 提供数据，后代通过 `inject` 接收，**中间层无需参与**。

**祖先：**

```ts
provide('moneyContext', { money, updateMoney })
provide('car', car)
```

**后代：**

```ts
let { money, updateMoney } = inject('moneyContext', {
  money: 0,
  updateMoney: (x: number) => {}
})
let car = inject('car')
```

> **面试要点**：provide 时必须传递 `ref()` 或 `reactive()` 对象，不能传 `.value`，否则失去响应式。

---

<details>
<summary>provide/inject 和 Vuex/Pinia 有什么区别？</summary>
* **provide/inject**：组件树内依赖注入，作用域是"祖先及其后代"
* **Pinia**：全局状态管理，任意组件可访问
</details>

<details>
<summary>如何保证 inject 的数据是响应式的？</summary>
祖先 provide 时传递 `ref()` 或 `reactive()` 对象，而非 `.value`。
</details>

---

## 十二、插槽（Slot）：内容分发机制

### 核心理念

**数据在子组件，结构由父组件定**。子组件提供数据或布局框架，父组件决定如何展示，实现高度可定制化。

### 默认插槽

**父组件：**

```vue
<Category title="今日热门游戏">
  <ul>
    <li v-for="g in games" :key="g.id">{{ g.name }}</li>
  </ul>
</Category>
```

**子组件：**

```vue
<template>
  <div class="item">
    <h3>{{ title }}</h3>
    <slot></slot>
  </div>
</template>
```

### 具名插槽

**父组件：** `v-slot:s1` 或 `#s1`，必须用 `<template>` 包裹。

**子组件：** `<slot name="s1"></slot>`

### 作用域插槽（重点）

**数据在子组件，展示结构由父组件决定。** 子组件通过 `:games="games"` 向插槽传递数据，父组件用 `v-slot="params"` 或 `#default="params"` 接收。

**子组件：**

```vue
<slot :games="games" a="哈哈"></slot>
```

**父组件：**

```vue
<Game v-slot="{ games, a }">
  <ul>
    <li v-for="g in games" :key="g.id">{{ g.name }}</li>
  </ul>
  <p>{{ a }}</p>
</Game>
```

---

<details>
<summary>什么时候使用作用域插槽？</summary>
当子组件拥有数据，但不确定父组件要如何展示时。子组件负责提供数据，父组件负责定义展示结构。
</details>

<details>
<summary>作用域插槽和普通插槽的区别是什么？</summary>
* **普通插槽**：父组件提供内容，子组件只负责展示位置
* **作用域插槽**：子组件提供数据，父组件决定如何使用数据渲染内容
</details>

---

## 总结：组件通信方式速查表

| 通信方式 | 适用场景 | 数据方向 | 响应式 | 难度 |
|---------|---------|---------|--------|------|
| **props** | 父子组件 | 父 ↔ 子 | 是 | 低 |
| **自定义事件** | 父子组件 | 子 → 父 | - | 低 |
| **v-model** | 父子组件 | 父 ↔ 子 | 是 | 中 |
| **$attrs** | 祖孙组件 | 祖 → 孙 | 是 | 中 |
| **$refs/$parent** | 父子组件 | 父 ↔ 子 | 是 | 中 |
| **provide/inject** | 祖孙组件 | 祖 ↔ 孙 | 是 | 高 |
| **mitt** | 任意组件 | 任意方向 | - | 中 |
| **pinia** | 任意组件 | 全局共享 | 是 | 高 |
| **slot** | 父子组件 | 父 → 子 | 是 | 高 |
