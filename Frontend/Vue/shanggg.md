下面是**可直接复制的学习笔记总结**，已按你的要求整理为**最高并列标题为二级（##）**，**抓 Vue3 入门与 Composition API 的核心重点**，适合你从 **JS → Vue3** 的过渡阶段复习与背诵。

---

## 一、Vue3 工程创建方式总览

### 1. vue-cli（了解即可）

* 目前处于**维护模式**
* 官方**不再推荐新项目使用**
* 基于 webpack，启动慢、构建重

```bash
vue create vue_test
npm run serve
```

结论：**会看就行，不作为主线方案**

---

### 2. Vite（重点、主流）

* Vue3 官方推荐
* 基于 ES Module
* **冷启动极快**
* 按需编译（不打包就能跑）

```bash
npm create vue@latest
cd vue3_test
npm install
npm run dev
```

**核心认知：**

* `index.html` 是**真正的入口**
* `<script type="module">` 加载主 JS
* Vue3 通过 `createApp(App).mount('#app')` 启动应用

---

## 二、Vue3 项目基础结构认知（重点）

### 1. 单文件组件（SFC）

一个 `.vue` 文件 = 一个组件：

```vue
<template></template>
<script></script>
<style></style>
```

### 2. Vue3 模板特性

* 支持**多根节点**
* 模板本质是 JS 的语法糖

---

## 三、Options API vs Composition API（理解设计动机）

### 1. Options API（Vue2 风格）

```js
data() {}
methods() {}
computed() {}
```

**问题：**

* 同一功能逻辑分散
* 不利于复用与维护
* 大组件后期非常痛苦

---

### 2. Composition API（Vue3 核心）

* **按功能组织代码**
* 逻辑高度内聚
* 更适合复杂业务与工程化

**结论：Vue3 主线只学 Composition API**

---

## 四、setup —— Composition API 的入口

### 1. setup 是什么

* Vue3 新增的组件配置项
* **所有 Composition API 的舞台**
* 执行时机早于 `beforeCreate`

```js
setup() {
  return {}
}
```

### 2. setup 的核心规则（重点）

* `this === undefined`
* 返回的内容可直接在模板使用
* setup 中的数据**默认不是响应式**

---

### 3. setup 返回值形式

#### 返回对象（最常用）

```js
setup() {
  return { name, age, fn }
}
```

#### 返回函数（了解）

```js
setup() {
  return () => 'Hello Vue3'
}
```

---

## 五、setup 语法糖（必会）

### 1. script setup（Vue3 标准写法）

```vue
<script setup lang="ts">
import { ref } from 'vue'

let count = ref(0)
</script>
```

**特点：**

* 自动 return
* 更少样板代码
* 默认推荐写法

---

### 2. 组件命名问题解决方案

```bash
npm i vite-plugin-vue-setup-extend -D
```

```vue
<script setup lang="ts" name="Person">
</script>
```

---

## 六、ref —— 基本类型响应式（重点）

### 1. ref 的作用

* 定义**响应式变量**
* 适用于：**基本类型 / 对象**

```js
import { ref } from 'vue'

let age = ref(18)
```

### 2. ref 使用规则（必背）

* JS 中：`age.value`
* 模板中：`{{ age }}`
* 响应式的是 **value，不是变量名**

```js
age.value++
```

---

## 七、reactive —— 对象响应式（重点）

### 1. reactive 的作用

* 定义**响应式对象**
* 基于 Proxy
* **深层响应式**

```js
import { reactive } from 'vue'

let car = reactive({
  brand: '奔驰',
  price: 100
})
```

### 2. 注意点（必考）

* **不能用于基本类型**
* 重新赋值会丢失响应式

```js
// 错误
car = { brand: '宝马' }
```

---

## 八、ref vs reactive 对比（核心总结）

### 使用范围

| API      | 使用场景      |
| -------- | --------- |
| ref      | 基本类型 / 对象 |
| reactive | 对象        |

### 关键区别

* ref 需要 `.value`
* reactive 不需要
* reactive 不能整体替换对象

### 推荐原则（重点）

1. 基本类型 → `ref`
2. 浅层对象 → `ref` / `reactive`
3. 深层对象 → `reactive`

---

## 九、toRefs / toRef —— 解构不丢响应式（高频）

### 1. 问题背景

```js
const { name } = person // ❌ 失去响应式
```

### 2. 解决方案

```js
import { toRefs, toRef } from 'vue'

const { name, gender } = toRefs(person)
const age = toRef(person, 'age')
```

**结论：**

> 解构 reactive 对象时，必须使用 `toRefs / toRef`

---

## 十、computed —— 计算属性（必会）

### 1. 只读计算属性

```js
const fullName = computed(() => {
  return first.value + '-' + last.value
})
```

### 2. 可读可写计算属性

```js
const fullName = computed({
  get() {
    return first.value + '-' + last.value
  },
  set(val) {
    [first.value, last.value] = val.split('-')
  }
})
```

### 3. computed 核心特点

* 基于依赖缓存
* 只有依赖变化才重新计算
* 本质是 **特殊的 ref**

---

## 十一、当前阶段你需要掌握到什么程度

### 已完成（非常好）

* JS → Vue3 直接过渡
* setup / ref / reactive / computed
* Vite + script setup

### 下一步主线（建议）

1. 模板指令（v-if / v-for / v-model）
2. 组件通信（props / emits）
3. 生命周期（onMounted）
4. Vue Router
5. Pinia
