
---

## Watch / watchEffect

* `watch`：显式指定被监听的响应式源（可监听 ref、reactive、getter、数组等）。适合在“需获得旧值/新值或做异步／副作用清理”的场景。
* `watchEffect`：立即执行一次，自动收集在回调中读取的响应式依赖；当依赖变化时自动重新运行。便捷但无法直接拿到旧值，需要显式停止返回的 `stop`。

### watchEffect 示例

```vue
<template>
  <div>
    <h3 id="demo">水温：{{ temp }} ℃，水位：{{ height }} cm</h3>
    <button @click="temp += 10">温度 +10</button>
    <button @click="height += 1">水位 +1</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'

const temp = ref(0)
const height = ref(0)

// watch：明确监听数组里的值
watch([temp, height], (values, oldValues) => {
  const [newTemp, newHeight] = values
  if (newTemp >= 50 || newHeight >= 20) {
    console.log('watch: 联系服务器')
  }
})

// watchEffect：自动跟踪依赖
const stop = watchEffect(() => {
  if (temp.value >= 50 || height.value >= 20) {
    console.log('watchEffect: 联系服务器')
  }
  // 示例：当达到极限时停止监控
  if (temp.value >= 100 || height.value >= 50) {
    console.log('watchEffect: 停止监控')
    stop()
  }
})
</script>
```

---

## ref（模板引用）—— HTML 元素 与 组件 的差别；`defineExpose`

* 把 `ref` 放在普通 DOM 标签上，得到 DOM 节点引用（`titleRef.value` 是 DOM）。
* 把 `ref` 放在子组件标签上，得到子组件实例（默认实例有 `proxy` 成员和暴露的属性/方法）。
* 组件想让父组件通过 `ref` 访问内部值/方法，需在子组件中用 `defineExpose` 明确暴露。

### DOM ref 示例

```vue
<template>
  <div>
    <h1 ref="titleRef">标题</h1>
    <input ref="inputRef" />
    <button @click="logRefs">打印 refs</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const titleRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

function logRefs() {
  console.log('DOM title:', titleRef.value?.innerText)
  console.log('input value:', inputRef.value?.value)
}
</script>
```

### 组件 ref + defineExpose 示例

```vue
<!-- Child.vue -->
<script setup lang="ts">
import { ref, defineExpose } from 'vue'
const name = ref('张三')
const age = ref(18)

function greet() { return `Hello ${name.value}` }

// 暴露给父组件
defineExpose({ name, age, greet })
</script>

<template>
  <div>{{ name }} - {{ age }}</div>
</template>
```

```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import Child from './Child.vue'
const childRef = ref<any>(null)

function inspectChild() {
  console.log('child name:', childRef.value?.name)       // '张三'
  console.log('child greet:', childRef.value?.greet())   // 'Hello 张三'
}
</script>

<template>
  <Child ref="childRef" />
  <button @click="inspectChild">检查子组件</button>
</template>
```

> 注意：模板 `ref="qwe"` 与把某个变量当 prop 传入是不同概念。`ref` 是模板引用指令，不会当作组件 prop 自动传递。

---

## TypeScript：接口（interface）、类型（type）、泛型、export

* `interface` / `type`：用来声明数据结构与复用类型。`export` 导出以便组件/模块间复用。
* 泛型（generic）：使类型可参数化，提高复用性。可以用于 `reactive<T>()`、函数等。
* 在 Props、hooks、API 返回值等处都推荐显式声明类型。

### 类型与泛型示例

```ts
// types.ts
export interface PersonInter {
  id: string
  name: string
  age: number
}

export type Persons = PersonInter[]

// 泛型示例：reactive 指定类型
import { reactive } from 'vue'
const persons = reactive<Persons>([
  { id: 'a1', name: '张三', age: 18 }
])

// 可选字段 & 默认值：x?: number
export interface MaybeNumber {
  x?: number
}
```

---

## Props（`defineProps` / `withDefaults`）—— 接收、类型限制、默认值、必要性

* `defineProps<T>()`：用于在 `script setup` 中声明 props 的类型。
* `withDefaults(defineProps<...>(), { ... })`：指定默认值（当 props 可选时）。
* `defineProps` 也可以传字符串数组或对象来做更细的校验（TS 下更常用泛型/类型声明）。

### 常见写法

```vue
<script setup lang="ts">
import { withDefaults, defineProps } from 'vue'
import type { Persons } from '@/types'

// 1) 只接收（不建议，缺乏类型）
// const props = defineProps(['list'])

// 2) 接收 + TS 类型限制
// const props = defineProps<{ list: Persons }>()

// 3) 接收 + 类型可选 + 默认值
const props = withDefaults(
  defineProps<{ list?: Persons }>(),
  {
    list: () => [{ id: 'default01', name: '默认', age: 99 }]
  }
)
</script>

<template>
  <ul>
    <li v-for="item in props.list" :key="item.id">{{ item.name }} - {{ item.age }}</li>
  </ul>
</template>
```

### 关于 `ref` 作为 prop 传递

* `ref` 是模板引用指令，不是 prop。若需要把某个 `ref` 的值传给子组件，使用 `:value="myRef"`（注意这将传入 `ref` 本身或 `.value`，取决于你如何传）。
* 若要传响应式对象，直接 `:data="reactiveObj"` 或 `:count="count"` 即可；在子组件 `defineProps` 中声明相应类型。

---

## 生命周期（Vue3 钩子与执行顺序）

* Vue 生命周期四阶段：**创建（setup） → 挂载 → 更新 → 卸载**。
* Vue3 对应钩子（每阶段前后各一个）：

  * 创建：`setup`（执行最先）
  * 挂载：`onBeforeMount`、`onMounted`
  * 更新：`onBeforeUpdate`、`onUpdated`
  * 卸载：`onBeforeUnmount`、`onUnmounted`
* 子组件挂载通常先于父组件 `onMounted`（父后子先？要注意实际顺序：父创建 -> 子创建 -> 子挂载 -> 父挂载）。

### 生命周期示例

```vue
<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue'

const sum = ref(0)
function inc() { sum.value++ }

console.log('setup 执行')

onBeforeMount(() => console.log('onBeforeMount'))
onMounted(() => console.log('onMounted'))
onBeforeUpdate(() => console.log('onBeforeUpdate'))
onUpdated(() => console.log('onUpdated'))
onBeforeUnmount(() => console.log('onBeforeUnmount'))
onUnmounted(() => console.log('onUnmounted'))
</script>

<template>
  <div>
    <p>sum: {{ sum }}</p>
    <button @click="inc">+1</button>
  </div>
</template>
```

---

## 自定义 Hook（复用逻辑 / 封装副作用）

* 本质：把 `setup` 中的组合逻辑封装为函数（通常放 `src/hooks`），返回数据与方法以供组件使用。
* 优点：解耦、复用、单元测试友好。

### 简单 Hook 示例（useSum / useDog）

```ts
// src/hooks/useSum.ts
import { ref, onMounted } from 'vue'
export default function useSum() {
  const sum = ref(0)
  const increment = () => sum.value++
  const decrement = () => sum.value--
  onMounted(() => increment())
  return { sum, increment, decrement }
}
```

```ts
// src/hooks/useDog.ts
import { reactive, onMounted } from 'vue'
import axios from 'axios'

export default function useDog() {
  const dogList = reactive<{ urlList: string[]; isLoading: boolean }>({
    urlList: [],
    isLoading: false
  })

  async function getDog() {
    dogList.isLoading = true
    try {
      const { data } = await axios.get('https://dog.ceo/api/breed/pembroke/images/random')
      dogList.urlList.push(data.message)
    } catch (err) {
      console.error(err)
    } finally {
      dogList.isLoading = false
    }
  }

  onMounted(getDog)
  return { dogList, getDog }
}
```

```vue
<!-- 组件使用 -->
<script setup lang="ts">
import useSum from '@/hooks/useSum'
import useDog from '@/hooks/useDog'

const { sum, increment, decrement } = useSum()
const { dogList, getDog } = useDog()
</script>
```

> 暴露形式：`export default function ...`（默认导出）或命名导出。使用时可以按需解构：`const { ... } = useXxx()`。

---

## 路由（vue-router 4）基础与要点

### 1) 基本概念

* 路由：路径（key）和组件（value）之间的映射关系。
* SPA（单页应用）：通过路由切换组件视图而不做完整页面刷新。

### 2) 安装与创建（TypeScript）

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import News from '@/pages/News.vue'
import About from '@/pages/About.vue'

const routes = [
  { path: '/home', name: 'home', component: Home },
  { path: '/news', name: 'news', component: News },
  { path: '/about', name: 'about', component: About }
]

const router = createRouter({
  history: createWebHistory(), // 或 createWebHashHistory()
  routes
})
export default router
```

在 `main.ts` 中安装：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
createApp(App).use(router).mount('#app')
```

`App.vue` 使用 `<RouterLink>` 与 `<RouterView>`：

```vue
<template>
  <nav>
    <RouterLink to="/home">首页</RouterLink>
    <RouterLink :to="{ name: 'news' }">新闻</RouterLink>
    <RouterLink to="/about">关于</RouterLink>
  </nav>
  <RouterView />
</template>
```

### 3) history vs hash

* `history`：更美观（无 `#`），需服务器支持路由重写（否则刷新 404）。
* `hash`：兼容更好，不需服务端配置，但 URL 会带 `#`。

### 4) 路由传参：query 与 params

* `query`（可选键值对，URL 中 `?a=1&b=2`）：接收用 `useRoute().query`。
* `params`（基于 path 占位符 `/detail/:id`）：传 `params` 时建议用命名路由（`name`），接收用 `useRoute().params`。

```vue
<!-- query 传参（对象写法） -->
<RouterLink :to="{ path: '/news/detail', query: { id: 1, title: 'xxx' } }">跳转</RouterLink>

<!-- params 传参（命名路由写法） -->
<RouterLink :to="{ name: 'detail', params: { id: 1 } }">详情</RouterLink>
```

### 5) 路由 props 配置（让组件更方便接收参数）

* `props: true`：将 `params` 作为 props。
* `props: (route) => ({ ...route.query })`：自定义转换。
* `props: { a: 1 }`：静态对象作为 props。

```ts
{
  name: 'detail',
  path: '/news/detail/:id',
  component: Detail,
  props: route => ({ id: route.params.id, q: route.query.q })
}
```

### 6) 嵌套路由

* 在父路由配置 `children: [...]`，子路由 path 不以 `/` 开头。
* 父组件中需包含 `<RouterView />` 作为子路由容器。

```ts
{
  path: '/news',
  component: News,
  children: [
    { path: 'detail', name: 'newsDetail', component: Detail }
  ]
}
```

### 7) 编程式导航 / replace / push

```ts
import { useRouter } from 'vue-router'
const router = useRouter()
router.push({ name: 'news' })        // 入栈
router.replace({ name: 'home' })     // 替换当前记录
```

---

## 额外常见问题与要点（汇总）

* `defineExpose`：父组件通过 `ref` 访问子组件时，子组件需显式暴露属性/方法。
* `defineProps` 与 `withDefaults`：常配合使用以提供类型与默认值。
* `ref` 在模板上是“引用”，不是 prop；要把值传下去需要 `:`（绑定）。
* 解构 `reactive` 的对象会导致响应性丢失，使用 `toRefs` / `toRef` 转换后再解构以保持响应性。
* 自定义 Hook 放 `src/hooks`，保持纯粹、低耦合。导出时尽量返回明确的对象（便于解构）。
* 路由组件通常放 `pages` 或 `views`，普通复用组件放 `components`。
* 使用 `history` 模式部署时，别忘了服务端的 fallback 配置（路由重写）。

---
