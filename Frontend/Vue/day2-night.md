# 课程笔记：Vue 3 组件通信与 Pinia 状态管理深度解析

## 一、 Pinia 核心机制与组合式写法

Pinia 是 Vue 3 的状态管理库，充当“全局数据仓库”，实现跨组件数据共享。

### 1. Getters：数据的“加工厂”

`getters` 用于对 `state` 进行加工。它可以接收 `state` 作为参数（推荐搭配箭头函数），也可以通过 `this` 访问整个 Store 实例（必须使用普通函数）。

```javascript
getters: {
  // 方式一：接收 state，适合简单计算
  bigSum: state => state.sum * 10,
  // 方式二：使用 this，可访问其他 getter
  upperSchool(): string {
    return this.school.toUpperCase()
  }
}

```

### 2. $subscribe：状态持久化监听

通过 `$subscribe` 可以侦听 Store 中数据的变化，常用于将数据实时同步到 `localStorage`。

```javascript
talkStore.$subscribe((mutate, state) => {
  console.log('数据变化了', mutate, state);
  localStorage.setItem('talkList', JSON.stringify(state.talkList));
});

```

### 3. Store 组合式（Setup）写法

组合式写法将 Store 定义为函数。使用 `ref/reactive` 定义 State，`function` 定义 Actions，`computed` 定义 Getters。**注意：必须通过 `return` 暴露需要给外部使用的属性和方法。**

```javascript
export const useTalkStore = defineStore('talk', () => {
  // talkList 就是 state
  const talkList = reactive(JSON.parse(localStorage.getItem('talkList') || '[]'));

  // getATalk 函数相当于 action
  async function getATalk() {
    let { data: { content: title } } = await axios.get('https://api.uomg.com/api/rand.qinghua?format=json');
    talkList.unshift({ id: nanoid(), title });
  }

  return { talkList, getATalk }; // 必须暴露
});

```

### 📝 要点测验

<details>
<summary>Pinia 中 Getters 的作用是什么？它与普通 State 有何区别？</summary>
Getters 类似于 Vue 的计算属性，用于对原始 State 进行逻辑加工并缓存结果。区别在于 State 存储原始数据，而 Getters 衍生出新的、依赖于 State 的值。
</details>
<details>
<summary>在组合式 Store 中，如何定义一个 Action？</summary>
直接在 `defineStore` 的回调函数内定义一个普通的 `function`（同步或异步均可），并将其在 `return` 对象中导出即可。
</details>

---

## 二、 组件通信：基础与双向绑定

### 1. Props 与自定义事件

* **Props：** 父传子（传数据），子传父（传回调函数）。
* **自定义事件：** 子组件通过 `emit` 触发，父组件监听。

```vue
<Child @send-toy="toy = $event"/> <button @click="toy = $event">原生事件</button> 
```

### 2. v-model 的组件化本质
在组件上使用 `v-model` 是 `:modelValue` 属性和 `@update:modelValue` 事件的简写。通过自定义参数，可以在一个组件上绑定多个 `v-model`。

```js
<AtguiguInput v-model:ming="username" v-model:mima="password"/>

<input :value="ming" @input="emit('update:ming', $event.target.value)">
<script setup>
  defineProps(['ming', 'mima']);
  const emit = defineEmits(['update:ming', 'update:mima']);
</script>
```
### 📝 要点测验

<details>
<summary>原生 DOM 事件和自定义事件中，$event 分别代表什么？</summary>
在原生事件中，`$event`  是包含页面坐标、目标元素等信息的事件对象；在自定义事件中， `$event`是`emit`触发时传递的具体数据（可以是任意类型）。 </details> <details> <summary>如何在子组件内部修改父组件通过 v-model 传来的值？</summary> 子组件不能直接修改 Props，必须通过`emit('update:propName', newValue)\` 触发事件，通知父组件进行修改。
</details>

---

## 三、 组件通信：跨级、工具与实例操作

### 1. $attrs：属性透传

用于祖孙组件通信。`$attrs` 包含了父组件传过来但没被子组件 `props` 接收的所有属性。

```vue
<GrandChild v-bind="$attrs"/>

```

### 2. provide 与 inject：深层供应

祖先组件通过 `provide` 提供数据，后代组件通过 `inject` 注入，中间层无需参与。

```javascript
// 祖先提供
provide('moneyContext', { money, updateMoney });
// 孙辈接收
let { money, updateMoney } = inject('moneyContext');

```

### 3. mitt：全局事件总线

适用于任意组件间通信。通过 `on` 绑定，`emit` 触发，`off` 解绑。

```javascript
// emitter.ts 暴露实例
import mitt from "mitt";
const emitter = mitt();
export default emitter;

// 组件内：注意在卸载前解绑
emitter.on('send-toy', value => console.log(value));
onUnmounted(() => emitter.off('send-toy'));

```

### 📝 要点测验

<details>
<summary>为什么在组件卸载时建议调用 emitter.off()？</summary>
如果不解绑，事件监听器会一直驻留在内存中，导致内存泄漏或在组件重新挂载时产生重复监听的逻辑错误。
</details>
<details>
<summary>provide/inject 传值时，如何保证数据是响应式的？</summary>
应该传递 `ref` 或 `reactive` 对象。这样当祖先组件修改数据时，所有 inject 该数据的后代组件都会自动更新。
</details>

---

## 四、 插槽 (Slot)：结构自定义

插槽决定了“数据在子组件，结构由父组件定”。

* **默认插槽：** `<slot></slot>` 占位。
* **具名插槽：** 使用 `name` 属性，父组件通过 `#name` 指定填充位置。
* **作用域插槽：** 子组件通过插槽向父组件传递数据，让父组件根据数据渲染结构。

```vue
<slot :games="games" a="哈哈"></slot>

<Game v-slot="params">
  <ul>
    <li v-for="g in params.games" :key="g.id">{{ g.name }}</li>
  </ul>
</Game>

```

### 📝 要点测验

<details>
<summary>作用域插槽的典型应用场景是什么？</summary>
当数据逻辑由子组件维护（如列表数据），但每一项具体的显示样式（是列表、表格还是卡片）需要由父组件动态决定时，使用作用域插槽。
</details>

---

