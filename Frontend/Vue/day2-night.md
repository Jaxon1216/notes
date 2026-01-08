# 课程笔记：Vue3 组件通信与 Pinia 高级特性详解

---

## 一、Pinia 的 Getters：数据加工与计算属性

### 知识点讲解

**Getters 的作用**

当 `state` 中的数据需要经过处理后再使用时，可以使用 `getters` 配置。Getters 类似于 Vue 组件中的 **computed 计算属性**，具有以下特点：

* 对原始 state 进行逻辑加工
* 结果会被缓存，依赖未变化时不会重新计算
* 可以在其他 getters 或组件中使用

---

### Getters 的两种写法

#### 1️⃣ 接收 state 参数（推荐用箭头函数）

```ts
// 引入defineStore用于创建store
import {defineStore} from 'pinia'

// 定义并暴露一个store
export const useCountStore = defineStore('count',{
  // 状态
  state(){
    return {
      sum:1,
      school:'atguigu'
    }
  },
  // 计算
  getters:{
    // 方式一：接收 state 作为参数
    bigSum:(state):number => state.sum * 10,
  }
})
```

**说明：**

* `state` 参数是 Pinia 自动传入的
* 箭头函数写法简洁，适合简单计算
* 必须指定返回值类型（TypeScript）

---

#### 2️⃣ 使用 this 访问（必须用普通函数）

```ts
getters:{
  bigSum:(state):number => state.sum * 10,
  // 方式二：使用 this 访问整个 store
  upperSchool():string{
    return this.school.toUpperCase()
  }
}
```

**说明：**

* 使用 `this` 可以访问 **state、其他 getters、甚至 actions**
* 必须用**普通函数**（箭头函数的 this 不指向 store）
* 适合需要访问多个 state 或其他 getters 的场景

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

// 使用 storeToRefs 解构，保持响应式
let { sum, school, bigSum, upperSchool } = storeToRefs(countStore)
</script>
```

**关键点：**

* Getters 和 state 一样需要用 `storeToRefs` 解构
* 在模板中可以直接使用，无需 `.value`
* Getters 会自动跟踪依赖，state 变化时自动更新

---

### 📝 要点测验

<details>
<summary>Getters 与直接在组件中用 computed 计算有什么区别？</summary>
Getters 定义在 store 中，可以被多个组件复用；而 computed 定义在组件内，只能在当前组件使用。如果多个组件需要相同的计算逻辑，应该使用 Getters。
</details>

<details>
<summary>为什么使用 this 时必须用普通函数而不能用箭头函数？</summary>
箭头函数的 this 是词法作用域，指向定义时的上下文；而普通函数的 this 由 Pinia 绑定为当前 store 实例，才能访问到 state、getters 和 actions。
</details>

---

## 二、$subscribe：状态变化监听与持久化

### 知识点讲解

**$subscribe 的作用**

通过 store 的 `$subscribe()` 方法可以侦听 `state` 及其变化。这是 Pinia 提供的一个强大工具，常用于：

* **数据持久化**（同步到 localStorage）
* 日志记录
* 数据变化的副作用处理

---

### 基本用法

```ts
import { useTalkStore } from '@/store/loveTalk'

const talkStore = useTalkStore()

// 订阅 state 的变化
talkStore.$subscribe((mutate, state) => {
  console.log('LoveTalk', mutate, state)
  // 将数据同步到 localStorage
  localStorage.setItem('talk', JSON.stringify(state.talkList))
})
```

**参数说明：**

* **`mutate`**：变化的详细信息对象，包含：
  * `type`：变化类型（`'direct'` | `'patch object'` | `'patch function'`）
  * `storeId`：store 的标识符
  * `events`：具体的变化事件
* **`state`**：变化后的完整 state 对象

---

### 实际应用场景：结合 localStorage

```ts
// 在 store 定义时从 localStorage 读取初始数据
export const useTalkStore = defineStore('talk', {
  state() {
    return {
      talkList: JSON.parse(localStorage.getItem('talkList') || '[]')
    }
  },
  actions: {
    async getATalk() {
      // ... 获取数据的逻辑
    }
  }
})
```

```ts
// 在组件中订阅变化，实时同步
import { useTalkStore } from '@/store/loveTalk'

const talkStore = useTalkStore()

talkStore.$subscribe((mutate, state) => {
  localStorage.setItem('talkList', JSON.stringify(state.talkList))
})
```

**工作流程：**

1. 页面首次加载时，从 localStorage 读取数据初始化 state
2. 用户操作导致 state 变化
3. `$subscribe` 监听到变化，立即同步到 localStorage
4. 下次打开页面时，数据依然存在

---

### 📝 要点测验

<details>
<summary>$subscribe 和 Vue 的 watch 有什么区别？</summary>
`$subscribe` 是 Pinia 专门用于监听整个 store 变化的 API，会在任何 state 变化时触发；而 `watch` 需要明确指定监听的响应式数据。`$subscribe` 更适合全局持久化等场景。
</details>

<details>
<summary>如果在多个组件中都调用了 $subscribe，会执行几次？</summary>
会执行多次。每次调用 `$subscribe` 都会注册一个新的监听器。因此建议在应用入口或根组件中调用一次即可。
</details>

---

## 三、Store 组合式（Setup）写法

### 知识点讲解

**组合式写法的优势**

除了选项式写法（Options API），Pinia 还支持**组合式写法**（Composition API），这种写法：

* 与 Vue3 的 `<script setup>` 风格一致
* 代码更加灵活和简洁
* 可以直接使用 Vue3 的组合式 API（ref、reactive、computed）

---

### 组合式写法的核心规则

在组合式写法中：

* 使用 **`ref()` 或 `reactive()`** 定义 state
* 使用 **`computed()`** 定义 getters
* 使用 **`function`** 定义 actions
* **必须通过 `return` 暴露** 需要给外部使用的属性和方法

---

### 完整示例

```ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { reactive } from 'vue'

export const useTalkStore = defineStore('talk', () => {
  // talkList 就是 state
  const talkList = reactive(
    JSON.parse(localStorage.getItem('talkList') as string) || []
  )

  // getATalk 函数相当于 action
  async function getATalk() {
    // 发请求，下面这行的写法是：连续解构赋值+重命名
    let { data: { content: title } } = await axios.get('https://api.uomg.com/api/rand.qinghua?format=json')
    // 把请求回来的字符串，包装成一个对象
    let obj = { id: nanoid(), title }
    // 放到数组中
    talkList.unshift(obj)
  }

  // 必须 return 暴露给外部
  return { talkList, getATalk }
})
```

**代码解析：**

* `const talkList = reactive(...)` → 定义响应式 state
* `async function getATalk()` → 定义异步 action
* `return { talkList, getATalk }` → 暴露给组件使用
* 这里没有 getters，如果需要可以用 `computed()`

---

### 选项式 vs 组合式对照表

| 类型 | 选项式写法 | 组合式写法 |
|------|-----------|-----------|
| **State** | `state() { return {...} }` | `ref()` 或 `reactive()` |
| **Getters** | `getters: {...}` | `computed()` |
| **Actions** | `actions: {...}` | 普通 `function` |
| **暴露** | 自动暴露 | 需要 `return { }` |

---

### 组件中的使用（完全相同）

```vue
<script setup lang="ts">
import { useTalkStore } from '@/store/loveTalk'
import { storeToRefs } from 'pinia'

const talkStore = useTalkStore()
const { talkList } = storeToRefs(talkStore)
const { getATalk } = talkStore
</script>
```

**关键点：**

* 使用方式与选项式写法**完全一致**
* 组件无需关心 store 内部用的哪种写法
* 这体现了 Pinia 的良好封装性

---

### 📝 要点测验

<details>
<summary>组合式写法中，为什么必须 return？</summary>
因为组合式写法本质是一个函数，函数内部的变量默认是局部的。只有通过 `return` 暴露的属性和方法，才能被组件访问到。
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

相比 Vue2，Vue3 在组件通信方面有以下重要变化：

| 变化类型 | Vue2 | Vue3 |
|---------|------|------|
| **事件总线** | `$bus` | 移除，使用 `mitt` 代替 |
| **状态管理** | `Vuex` | 推荐使用 `Pinia` |
| **双向绑定** | `v-model` + `.sync` | 统一为 `v-model`（支持多个） |
| **属性透传** | `$attrs` + `$listeners` | 合并为 `$attrs` |
| **子组件访问** | `$children` | 移除，使用 `ref` |

---

### 常见通信方式与适用场景

<!-- ![组件通信方式](images/image-20231119185900990.png) -->

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
| **pinia** | 任意组件 | 全局状态管理，适合跨组件共享状态 |
| **slot** | 父 → 子 | 内容分发，父组件定制子组件结构 |

---

## 五、Props：最基础的父子通信

### 知识点讲解

**Props 的核心特点**

Props 是使用频率最高的一种通信方式，用于实现**父子组件间的数据传递**：

* **父传子**：属性值是**非函数**（数据）
* **子传父**：属性值是**函数**（回调）

---

### 父传子：传递数据

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

// 数据
const car = ref('奔驰')
const toy = ref()

// 方法（用于接收子组件传来的数据）
function getToy(value: string) {
  toy.value = value
}
</script>
```

---

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

// 接收父组件传来的 props
defineProps(['car', 'getToy'])
</script>
```

**工作原理：**

1. 父组件通过 `:car="car"` 传递数据给子组件
2. 父组件通过 `:getToy="getToy"` 传递函数给子组件
3. 子组件用 `defineProps` 接收
4. 子组件调用 `getToy(toy)` 把数据传回父组件

---

### 📝 要点测验

<details>
<summary>为什么说"子传父"时传的是函数？</summary>
因为数据的所有权在父组件，子组件不能直接修改父组件的数据。通过传递函数，子组件可以调用这个函数并传入参数，从而间接地让父组件更新自己的数据。
</details>

<details>
<summary>defineProps 返回的对象可以解构吗？</summary>
不建议直接解构，因为会失去响应式。如果必须解构，需要使用 `toRefs(props)`。但在模板中可以直接使用 props 的属性名。
</details>

---

## 六、自定义事件：更语义化的子传父

### 知识点讲解

**自定义事件的特点**

自定义事件是另一种实现**子 → 父**通信的方式，比 props 传函数更加语义化。

---

### 原生事件 vs 自定义事件

**关键区别：`$event` 的含义不同**

| 事件类型 | `$event` 的含义 | 示例 |
|---------|----------------|------|
| **原生事件** | 事件对象（包含 `pageX`、`pageY`、`target`、`keyCode` 等） | `@click="handler"` |
| **自定义事件** | `emit` 触发时传递的数据（任意类型） | `@send-toy="toy = $event"` |

---

### 完整示例

**父组件：**

```vue
<template>
  <div class="father">
    <h3>父组件</h3>
    <h4>儿子给的玩具：{{ toy }}</h4>
    
    <!-- 监听自定义事件 send-toy -->
    <Child @send-toy="toy = $event"/>
    
    <!-- 对比：原生事件中的 $event -->
    <button @click="toy = $event">测试</button>
  </div>
</template>

<script setup lang="ts" name="Father">
import Child from './Child.vue'
import { ref } from "vue";

const toy = ref('')
</script>
```

---

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

// 声明要触发的事件
const emit = defineEmits(['send-toy'])
</script>
```

**工作流程：**

1. 子组件通过 `defineEmits` 声明事件
2. 子组件调用 `emit('send-toy', toy)` 触发事件
3. 父组件通过 `@send-toy` 监听事件
4. `$event` 就是 emit 的第二个参数（这里是 `toy`）

---

### 📝 要点测验

<details>
<summary>自定义事件相比 props 传函数有什么优势？</summary>
语义更清晰，代码可读性更好。`@send-toy` 明确表达了"发送玩具"的意图，而 `:getToy="getToy"` 在语义上不够直观。
</details>

<details>
<summary>原生 DOM 事件中，$event 是什么？</summary>
是事件对象（Event），包含事件的详细信息，如鼠标坐标、按键代码、触发元素等。在自定义事件中，`$event` 是 emit 传递的具体数据。
</details>

---

## 七、Mitt：全局事件总线

### 知识点讲解

**Mitt 的作用**

Mitt 是一个轻量级的事件总线库，功能类似于 Vue2 的 `$bus`，可以实现**任意组件间通信**，特别适合：

* 兄弟组件通信
* 层级相隔较远的组件通信
* 不想使用 Pinia 的简单场景

---

### 安装与配置

**第一步：安装 mitt**

```bash
npm i mitt
```

---

**第二步：创建 emitter 实例**

新建文件 `src/utils/emitter.ts`：

```ts
// 引入mitt 
import mitt from "mitt";

// 创建 emitter
const emitter = mitt()

/*
  // 基本用法示例：
  
  // 绑定事件
  emitter.on('abc', (value) => {
    console.log('abc事件被触发', value)
  })
  emitter.on('xyz', (value) => {
    console.log('xyz事件被触发', value)
  })

  setInterval(() => {
    // 触发事件
    emitter.emit('abc', 666)
    emitter.emit('xyz', 777)
  }, 1000);

  setTimeout(() => {
    // 清理所有事件
    emitter.all.clear()
  }, 3000); 
*/

// 创建并暴露 mitt
export default emitter
```

---

### 使用流程

**第三步：接收数据的组件 - 绑定事件**

```vue
<script setup lang="ts" name="Child2">
import emitter from "@/utils/emitter";
import { onUnmounted } from "vue";
import { ref } from "vue";

const toy = ref('')

// 绑定事件
emitter.on('send-toy', (value) => {
  console.log('send-toy事件被触发', value)
  toy.value = value as string
})

// 组件卸载前解绑事件
onUnmounted(() => {
  emitter.off('send-toy')
})
</script>
```

---

**第四步：发送数据的组件 - 触发事件**

```vue
<script setup lang="ts" name="Child1">
import emitter from "@/utils/emitter";
import { ref } from "vue";

const toy = ref('奥特曼')

function sendToy() {
  // 触发事件
  emitter.emit('send-toy', toy.value)
}
</script>
```

---

### 核心 API

| API | 说明 | 示例 |
|-----|------|------|
| `emitter.on(event, handler)` | 绑定事件监听 | `emitter.on('test', fn)` |
| `emitter.emit(event, data)` | 触发事件 | `emitter.emit('test', 123)` |
| `emitter.off(event)` | 解绑指定事件 | `emitter.off('test')` |
| `emitter.all.clear()` | 清空所有事件 | `emitter.all.clear()` |

---

### ⚠️ 重要注意事项

**必须在组件卸载前解绑事件**

```ts
onUnmounted(() => {
  emitter.off('send-toy')
})
```

**原因：**

* 如果不解绑，事件监听器会一直驻留在内存中
* 导致**内存泄漏**
* 组件重新挂载时可能产生**重复监听**的逻辑错误

---

### 📝 要点测验

<details>
<summary>Mitt 和 Pinia 都能实现任意组件通信，如何选择？</summary>
* **Mitt**：适合简单的消息通知、事件触发场景
* **Pinia**：适合需要持久化、复杂状态管理的场景
* 如果只是传递一次性数据，用 Mitt；如果数据需要被多个组件共享和修改，用 Pinia
</details>

<details>
<summary>为什么 emitter 要单独建一个文件？</summary>
因为需要确保整个应用使用的是**同一个 emitter 实例**。如果每个组件都 `mitt()`，会创建多个独立的实例，无法实现通信。
</details>

---

## 八、v-model：双向绑定的组件化应用

### 知识点讲解

**v-model 的本质**

在原生 HTML 元素上，`v-model` 是 `:value` + `@input` 的语法糖：

```vue
<!-- 使用 v-model 指令 -->
<input type="text" v-model="userName">

<!-- v-model 的本质是下面这行代码 -->
<input 
  type="text" 
  :value="userName" 
  @input="userName = (<HTMLInputElement>$event.target).value"
>
```

---

**在组件上使用 v-model**

在组件标签上，`v-model` 的本质是 `:modelValue` + `@update:modelValue`：

```vue
<!-- 组件标签上使用 v-model 指令 -->
<AtguiguInput v-model="userName"/>

<!-- 组件标签上 v-model 的本质 -->
<AtguiguInput 
  :modelValue="userName" 
  @update:modelValue="userName = $event"
/>
```

---

### 实现双向绑定的组件

**父组件：**

```vue
<template>
  <div class="father">
    <h3>父组件</h3>
    <h4>用户名：{{ userName }}</h4>
    
    <!-- 使用 v-model -->
    <AtguiguInput v-model="userName"/>
  </div>
</template>

<script setup lang="ts" name="Father">
import AtguiguInput from './AtguiguInput.vue'
import { ref } from "vue";

const userName = ref('张三')
</script>
```

---

**子组件 AtguiguInput：**

```vue
<template>
  <div class="box">
    <!-- 将接收的 modelValue 赋给 input 元素的 value 属性 -->
    <!-- 给 input 绑定原生 input 事件，触发时发出 update:modelValue 事件 -->
    <input 
      type="text" 
      :value="modelValue" 
      @input="emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>

<script setup lang="ts" name="AtguiguInput">
// 接收 props
defineProps(['modelValue'])
// 声明事件
const emit = defineEmits(['update:modelValue'])
</script>
```

**工作原理：**

1. 父组件通过 `:modelValue="userName"` 传递数据
2. 子组件将 `modelValue` 绑定到 input 的 value
3. 用户输入时触发原生 input 事件
4. 子组件 emit `update:modelValue` 事件
5. 父组件接收事件，更新 `userName`

---

### 自定义 v-model 参数名

**可以将 `modelValue` 改成其他名称：**

```vue
<!-- 使用自定义参数名 abc -->
<AtguiguInput v-model:abc="userName"/>

<!-- 上面代码的本质如下 -->
<AtguiguInput 
  :abc="userName" 
  @update:abc="userName = $event"
/>
```

**子组件中对应修改：**

```vue
<template>
  <div class="box">
    <input 
      type="text" 
      :value="abc" 
      @input="emit('update:abc', $event.target.value)"
    >
  </div>
</template>

<script setup lang="ts" name="AtguiguInput">
defineProps(['abc'])
const emit = defineEmits(['update:abc'])
</script>
```

---

### 一个组件绑定多个 v-model

**最强大的特性：一个组件可以同时绑定多个 v-model**

```vue
<template>
  <div class="father">
    <h3>父组件</h3>
    <h4>用户名：{{ userName }}</h4>
    <h4>密码：{{ password }}</h4>
    
    <!-- 同时绑定两个 v-model -->
    <AtguiguInput 
      v-model:ming="userName" 
      v-model:mima="password"
    />
  </div>
</template>
```

**子组件：**

```vue
<template>
  <div class="box">
    <input 
      type="text" 
      :value="ming" 
      @input="emit('update:ming', $event.target.value)"
      placeholder="用户名"
    >
    <input 
      type="password" 
      :value="mima" 
      @input="emit('update:mima', $event.target.value)"
      placeholder="密码"
    >
  </div>
</template>

<script setup lang="ts" name="AtguiguInput">
defineProps(['ming', 'mima'])
const emit = defineEmits(['update:ming', 'update:mima'])
</script>
```

---

### 📝 要点测验

<details>
<summary>为什么 Vue3 的 v-model 比 Vue2 更强大？</summary>
Vue2 中一个组件只能有一个 v-model，如需多个双向绑定需要用 `.sync` 修饰符。Vue3 统一为 v-model，且支持自定义参数名，一个组件可以绑定多个 v-model。
</details>

<details>
<summary>子组件能直接修改 modelValue 吗？</summary>
不能。Props 是单向数据流，子组件不能直接修改。必须通过 emit 触发 `update:modelValue` 事件，通知父组件更新。
</details>

---

## 九、$attrs：属性透传机制

### 知识点讲解

**$attrs 的作用**

`$attrs` 用于实现**当前组件的父组件**向**当前组件的子组件**通信（**祖 → 孙**）。

**核心特点：**

* `$attrs` 是一个对象，包含所有父组件传入的标签属性
* **自动排除** `props` 中声明的属性（已被"消费"）
* 可以通过 `v-bind="$attrs"` 一次性透传所有属性

---

### 完整示例

**父组件（祖先）：**

```vue
<template>
  <div class="father">
    <h3>父组件</h3>
    <Child 
      :a="a" 
      :b="b" 
      :c="c" 
      :d="d" 
      v-bind="{x:100, y:200}" 
      :updateA="updateA"
    />
  </div>
</template>

<script setup lang="ts" name="Father">
import Child from './Child.vue'
import { ref } from "vue";

let a = ref(1)
let b = ref(2)
let c = ref(3)
let d = ref(4)

function updateA(value) {
  a.value = value
}
</script>
```

---

**子组件（中间层）：**

```vue
<template>
  <div class="child">
    <h3>子组件</h3>
    <!-- 使用 v-bind="$attrs" 透传所有属性 -->
    <GrandChild v-bind="$attrs"/>
  </div>
</template>

<script setup lang="ts" name="Child">
import GrandChild from './GrandChild.vue'
</script>
```

**关键点：**

* 子组件**没有**用 `defineProps` 接收任何属性
* 所有属性都保留在 `$attrs` 中
* 通过 `v-bind="$attrs"` 全部传给孙组件

---

**孙组件：**

```vue
<template>
  <div class="grand-child">
    <h3>孙组件</h3>
    <h4>a：{{ a }}</h4>
    <h4>b：{{ b }}</h4>
    <h4>c：{{ c }}</h4>
    <h4>d：{{ d }}</h4>
    <h4>x：{{ x }}</h4>
    <h4>y：{{ y }}</h4>
    <button @click="updateA(666)">点我更新A</button>
  </div>
</template>

<script setup lang="ts" name="GrandChild">
// 孙组件接收所有透传的属性
defineProps(['a', 'b', 'c', 'd', 'x', 'y', 'updateA'])
</script>
```

---

### $attrs 的过滤机制

如果子组件声明了 props：

```vue
<script setup lang="ts" name="Child">
import GrandChild from './GrandChild.vue'

// 声明接收 a 和 b
defineProps(['a', 'b'])
</script>
```

那么 `$attrs` 中**不会包含** `a` 和 `b`，只包含 `c`、`d`、`x`、`y`、`updateA`。

---

### 📝 要点测验

<details>
<summary>$attrs 和 provide/inject 都能实现祖孙通信,如何选择？</summary>
* **$attrs**：适合属性透传，中间组件不需要使用这些数据
* **provide/inject**：适合深层依赖注入，祖先提供的数据可能被多层后代使用
* 如果只是简单透传给特定后代，用 $attrs；如果多个后代都要用，用 provide/inject
</details>

<details>
<summary>Vue3 的 $attrs 相比 Vue2 有什么变化？</summary>
Vue2 中有 `$attrs` 和 `$listeners` 两个对象；Vue3 中将事件监听器也合并到了 `$attrs` 中，统一管理。
</details>

---

## 十、$refs 与 $parent：实例访问

### 知识点讲解

**核心概念**

| 属性 | 方向 | 说明 |
|------|------|------|
| `$refs` | 父 → 子 | 父组件访问子组件实例 |
| `$parent` | 子 → 父 | 子组件访问父组件实例 |

---

### $refs 的使用（父 → 子）

**父组件：**

```vue
<template>
  <div class="father">
    <h3>父组件</h3>
    <h4>房产：{{ house }}</h4>
    <button @click="changeToy">修改Child1的玩具</button>
    <button @click="changeComputer">修改Child2的电脑</button>
    
    <Child1 ref="c1"/>
    <Child2 ref="c2"/>
  </div>
</template>

<script setup lang="ts" name="Father">
import Child1 from './Child1.vue'
import Child2 from './Child2.vue'
import { ref } from "vue";

let house = ref(4)

// 通过 ref 获取子组件实例
let c1 = ref()
let c2 = ref()

// 修改 Child1 的数据
function changeToy() {
  c1.value.toy = '小猪佩奇'
}

// 修改 Child2 的数据
function changeComputer() {
  c2.value.computer = '华为'
}

// 向外暴露数据（供子组件访问）
defineExpose({ house })
</script>
```

---

**子组件 Child1：**

```vue
<template>
  <div class="child1">
    <h3>子组件1</h3>
    <h4>玩具：{{ toy }}</h4>
  </div>
</template>

<script setup lang="ts" name="Child1">
import { ref } from "vue";

let toy = ref('奥特曼')

// 向外暴露数据（供父组件访问）
defineExpose({ toy })
</script>
```

**关键点：**

* 子组件必须用 `defineExpose` 暴露数据
* 父组件通过 `ref` 属性标记子组件
* 通过 `c1.value` 访问子组件实例

---

### $parent 的使用（子 → 父）

**子组件：**

```vue
<template>
  <div class="child1">
    <h3>子组件1</h3>
    <h4>玩具：{{ toy }}</h4>
    <button @click="minusHouse($parent)">修改父组件房产</button>
  </div>
</template>

<script setup lang="ts" name="Child1">
import { ref } from "vue";

let toy = ref('奥特曼')

// 修改父组件的数据
function minusHouse(parent) {
  parent.house -= 1
}

defineExpose({ toy })
</script>
```

**注意：**

* 父组件也必须用 `defineExpose` 暴露数据
* `$parent` 在模板中直接使用，在 `<script setup>` 中不可用
* 这种方式会导致强耦合，不推荐频繁使用

---

### 📝 要点测验

<details>
<summary>为什么 <code>&lt;script setup&gt;</code> 中的数据默认不对外暴露？</summary>
这是 Vue3 的设计哲学：组件应该是封装的，只暴露必要的接口。如果不用 `defineExpose` 显式暴露，可以防止外部随意访问组件内部状态，提高组件的安全性和可维护性。
</details>

<details>
<summary>$refs 和 props 都能父传子，有什么区别？</summary>
* **props**：数据流清晰，单向传递，符合 Vue 设计理念（推荐）
* **$refs**：直接访问实例，可以调用方法和修改数据，但会导致强耦合（适合特殊场景）
</details>

---

## 十一、provide 与 inject：依赖注入

### 知识点讲解

**依赖注入的优势**

`provide` 和 `inject` 用于实现**祖孙组件**直接通信，其特点是：

* 祖先组件通过 `provide` 提供数据
* 后代组件通过 `inject` 接收数据
* **中间层无需参与**，不会产生 props 链式传递

---

### 完整示例

**第一步：父组件（祖先）提供数据**

```vue
<template>
  <div class="father">
    <h3>父组件</h3>
    <h4>资产：{{ money }}</h4>
    <h4>汽车：{{ car }}</h4>
    <button @click="money += 1">资产+1</button>
    <button @click="car.price += 1">汽车价格+1</button>
    <Child/>
  </div>
</template>

<script setup lang="ts" name="Father">
import Child from './Child.vue'
import { ref, reactive, provide } from "vue";

// 数据
let money = ref(100)
let car = reactive({
  brand: '奔驰',
  price: 100
})

// 用于更新 money 的方法
function updateMoney(value: number) {
  money.value += value
}

// 提供数据
provide('moneyContext', { money, updateMoney })
provide('car', car)
</script>
```

**说明：**

* `provide(key, value)` 提供数据
* key 是字符串标识符
* value 可以是任意类型（ref、reactive、普通值、函数等）
* 提供的 ref/reactive 对象是响应式的

---

**第二步：子组件（中间层）**

```vue
<template>
  <div class="child">
    <h3>子组件</h3>
    <GrandChild/>
  </div>
</template>

<script setup lang="ts" name="Child">
import GrandChild from './GrandChild.vue'
// 子组件不需要编写任何关于 provide 的代码
</script>
```

**关键点：中间组件完全不受打扰**

---

**第三步：孙组件接收数据**

```vue
<template>
  <div class="grand-child">
    <h3>我是孙组件</h3>
    <h4>资产：{{ money }}</h4>
    <h4>汽车：{{ car }}</h4>
    <button @click="updateMoney(6)">资产+6</button>
  </div>
</template>

<script setup lang="ts" name="GrandChild">
import { inject } from 'vue';

// 注入数据（提供默认值避免类型错误）
let { money, updateMoney } = inject('moneyContext', {
  money: 0,
  updateMoney: (x: number) => {}
})

let car = inject('car')
</script>
```

**说明：**

* `inject(key, defaultValue)` 接收数据
* 如果祖先没有 provide 对应的 key，会使用 defaultValue
* 注入的 ref 对象会保持响应式

---

### 响应式注意事项

**✅ 正确做法：提供 ref/reactive 对象**

```ts
let money = ref(100)
provide('money', money)  // money 是响应式的
```

**❌ 错误做法：提供 .value**

```ts
let money = ref(100)
provide('money', money.value)  // 100 是普通数值，失去响应式
```

---

### 📝 要点测验

<details>
<summary>provide/inject 和 Vuex/Pinia 有什么区别？</summary>
* **provide/inject**：用于组件树中的依赖注入，数据作用域是"祖先及其后代"
* **Pinia**：全局状态管理，任意组件都可以访问
* 如果数据只在某个组件树内使用，用 provide/inject；如果是全局共享，用 Pinia
</details>

<details>
<summary>如何保证 inject 的数据是响应式的？</summary>
祖先组件在 provide 时必须传递 `ref()` 或 `reactive()` 对象，而不是 `.value`。这样后代组件 inject 后，数据变化会自动同步。
</details>

---

## 十二、插槽（Slot）：内容分发机制

### 知识点讲解

**插槽的核心理念**

插槽（Slot）是 Vue 的内容分发机制，核心思想是：

> **数据在子组件，结构由父组件定**

使用场景：

* 子组件提供数据或布局框架
* 父组件决定如何展示内容
* 实现组件的高度可定制化

---

## 十三、默认插槽

### 基本用法

**父组件：**

```vue
<template>
  <div class="father">
    <h3>父组件</h3>
    <Category title="今日热门游戏">
      <ul>
        <li v-for="g in games" :key="g.id">{{ g.name }}</li>
      </ul>
    </Category>
  </div>
</template>

<script setup lang="ts" name="Father">
import Category from './Category.vue'
import { reactive } from "vue";

let games = reactive([
  { id: 'asgdytsa01', name: '英雄联盟' },
  { id: 'asgdytsa02', name: '王者荣耀' },
  { id: 'asgdytsa03', name: '红色警戒' },
  { id: 'asgdytsa04', name: '斗罗大陆' }
])
</script>
```

---

**子组件 Category：**

```vue
<template>
  <div class="item">
    <h3>{{ title }}</h3>
    <!-- 默认插槽 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="Category">
defineProps(['title'])
</script>
```

**效果：**

父组件的 `<ul>` 会被插入到子组件的 `<slot></slot>` 位置。

---

## 十四、具名插槽

### 知识点讲解

当一个组件需要多个插槽时，可以使用**具名插槽**，给每个插槽指定名称。

---

**父组件：**

```vue
<template>
  <div class="father">
    <h3>父组件</h3>
    <Category title="今日热门游戏">
      <!-- 使用 v-slot:name 指定插槽 -->
      <template v-slot:s1>
        <ul>
          <li v-for="g in games" :key="g.id">{{ g.name }}</li>
        </ul>
      </template>
      
      <!-- 简写形式 #name -->
      <template #s2>
        <a href="">更多</a>
      </template>
    </Category>
  </div>
</template>
```

---

**子组件：**

```vue
<template>
  <div class="item">
    <h3>{{ title }}</h3>
    <!-- 具名插槽 -->
    <slot name="s1"></slot>
    <slot name="s2"></slot>
  </div>
</template>

<script setup lang="ts" name="Category">
defineProps(['title'])
</script>
```

**关键点：**

* `v-slot:s1` 可以简写为 `#s1`
* 必须用 `<template>` 包裹
* 子组件用 `<slot name="xxx">` 接收

---

## 十五、作用域插槽（重点）

### 知识点讲解

**作用域插槽的核心场景**

<span style="color:red">数据在组件自身，但根据数据生成的结构需要组件的使用者来决定。</span>

典型案例：

* 子组件提供列表数据
* 父组件决定用列表、表格还是卡片展示

---

### 完整示例

**子组件 Game：**

```vue
<template>
  <div class="category">
    <h2>今日游戏榜单</h2>
    <!-- 作用域插槽：向插槽传递数据 -->
    <slot :games="games" a="哈哈"></slot>
  </div>
</template>

<script setup lang="ts" name="Category">
import { reactive } from 'vue'

let games = reactive([
  { id: 'asgdytsa01', name: '英雄联盟' },
  { id: 'asgdytsa02', name: '王者荣耀' },
  { id: 'asgdytsa03', name: '红色警戒' },
  { id: 'asgdytsa04', name: '斗罗大陆' }
])
</script>
```

**说明：**

* `:games="games"` 将数据传递给插槽
* `a="哈哈"` 是额外的属性

---

**父组件：接收插槽数据**

```vue
<template>
  <div class="father">
    <h3>父组件</h3>
    
    <!-- 方式一：v-slot="params" -->
    <Game v-slot="params">
      <ul>
        <li v-for="g in params.games" :key="g.id">{{ g.name }}</li>
      </ul>
    </Game>
    
    <!-- 方式二：v-slot:default="params" -->
    <Game v-slot:default="params">
      <ol>
        <li v-for="g in params.games" :key="g.id">{{ g.name }}</li>
      </ol>
    </Game>
    
    <!-- 方式三：简写 #default="params" -->
    <Game #default="params">
      <h4 v-for="g in params.games" :key="g.id">{{ g.name }}</h4>
    </Game>
    
    <!-- 解构写法 -->
    <Game v-slot="{ games, a }">
      <ul>
        <li v-for="g in games" :key="g.id">{{ g.name }}</li>
      </ul>
      <p>{{ a }}</p>
    </Game>
  </div>
</template>
```

**关键点：**

* `v-slot="params"` 接收子组件传递的所有数据
* `params.games` 访问数据
* 支持解构：`v-slot="{ games, a }"`
* 默认插槽可以省略 `:default`

---

### 作用域插槽的三种写法对照

| 写法 | 说明 |
|------|------|
| `v-slot="params"` | 完整写法（默认插槽） |
| `v-slot:default="params"` | 显式指定默认插槽 |
| `#default="params"` | 简写形式 |

---

### 📝 要点测验

<details>
<summary>什么时候使用作用域插槽？</summary>
当子组件拥有数据，但不确定父组件想要如何展示这些数据时，使用作用域插槽。子组件负责提供数据，父组件负责定义展示结构。
</details>

<details>
<summary>作用域插槽和普通插槽的区别是什么？</summary>
* **普通插槽**：父组件提供内容，子组件只负责展示位置
* **作用域插槽**：子组件提供数据，父组件决定如何使用这些数据渲染内容
</details>

---

## 总结：组件通信方式速查表

| 通信方式 | 适用场景 | 数据方向 | 响应式 | 难度 |
|---------|---------|---------|--------|------|
| **props** | 父子组件 | 父 ↔ 子 | ✅ | ⭐ |
| **自定义事件** | 父子组件 | 子 → 父 | - | ⭐ |
| **v-model** | 父子组件 | 父 ↔ 子 | ✅ | ⭐⭐ |
| **$attrs** | 祖孙组件 | 祖 → 孙 | ✅ | ⭐⭐ |
| **$refs/$parent** | 父子组件 | 父 ↔ 子 | ✅ | ⭐⭐ |
| **provide/inject** | 祖孙组件 | 祖 ↔ 孙 | ✅ | ⭐⭐⭐ |
| **mitt** | 任意组件 | 任意方向 | - | ⭐⭐ |
| **pinia** | 任意组件 | 全局共享 | ✅ | ⭐⭐⭐ |
| **slot** | 父子组件 | 父 → 子 | ✅ | ⭐⭐⭐ |

---

> **学习建议**
>
> * 优先掌握：props、自定义事件、v-model
> * 重点理解：provide/inject、作用域插槽
> * 实战必备：mitt、pinia
> * 适度使用：$refs、$parent（会导致强耦合）
