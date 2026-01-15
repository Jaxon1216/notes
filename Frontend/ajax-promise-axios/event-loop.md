# 事件循环 (Event Loop)

## 一、什么是事件循环？

JavaScript 是**单线程**语言，这意味着同一时间只能执行一个任务。但我们经常需要处理异步操作（网络请求、定时器、文件读取等），如果一直等待这些操作完成，页面就会卡死。

**事件循环**就是 JavaScript 在单线程环境下实现"异步并发"的调度机制。它让 JS 能够：
- 执行同步代码
- 处理异步任务
- 在适当的时候执行回调函数
- 保持页面响应

## 二、核心组件

事件循环由四个核心部分组成：

### 1. 调用栈 (Call Stack)
- **作用**：执行同步代码的地方
- **工作方式**：函数进栈 → 执行 → 出栈
- **特点**：遵循"后进先出"(LIFO) 原则

```js
function first() {
  console.log('1');
  second();
  console.log('3');
}
function second() {
  console.log('2');
}
first();
// 输出顺序: 1 → 2 → 3
// 调用栈: first() 入栈 → second() 入栈 → second() 出栈 → first() 出栈
```

### 2. Web APIs（浏览器环境）/ Node APIs
- **作用**：提供异步能力
- **包括**：定时器 (setTimeout/setInterval)、DOM 事件、网络请求 (fetch)、I/O 操作等
- **特点**：这些操作**不在 JS 引擎的调用栈中执行**，而是由浏览器/Node 环境提供

### 3. 宏任务队列 (Macrotask Queue / Task Queue)
- **存放内容**：
  - `setTimeout` / `setInterval` 的回调
  - DOM 事件回调 (click、scroll 等)
  - I/O 回调
  - `setImmediate` (Node.js)
- **特点**：每次事件循环**只执行一个**宏任务

### 4. 微任务队列 (Microtask Queue / Job Queue)
- **存放内容**：
  - `Promise.then` / `Promise.catch` / `Promise.finally`
  - `queueMicrotask`
  - `MutationObserver`
  - `async/await` 中 await 之后的代码
- **特点**：每次事件循环会**清空所有**微任务

## 三、Promise 基础知识（补充）

理解事件循环前，需要先理解 Promise 的几个关键点：

### Promise 的三种状态
```js
// 1. Pending (进行中) - 初始状态
const p1 = new Promise((resolve, reject) => {
  // 还未调用 resolve 或 reject
});

// 2. Fulfilled (已成功) - resolve 被调用
const p2 = Promise.resolve('成功');

// 3. Rejected (已失败) - reject 被调用
const p3 = Promise.reject('失败');
```

### Promise.then 何时执行？
```js
console.log('1');

Promise.resolve().then(() => {
  console.log('2');  // 这是微任务
});

console.log('3');
// 输出: 1 → 3 → 2
```

**关键点**：
- `Promise.resolve()` 创建一个**已完成**的 Promise
- `.then()` 的回调函数**不会立即执行**，而是被放入**微任务队列**
- 同步代码执行完后，才会执行微任务

### Promise 链式调用
```js
Promise.resolve()
  .then(() => {
    console.log('第一个 then');
    return 'hello';
  })
  .then((value) => {
    console.log('第二个 then:', value);
  });
```

**重要**：每个 `.then()` 都会返回一个新的 Promise，形成链式调用。

## 四、事件循环规则

事件循环按照以下步骤不断循环：

```
┌─────────────────────────┐
│  1. 执行同步代码         │
│     (直到调用栈为空)     │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  2. 清空所有微任务       │
│     (Promise.then 等)    │  ←─┐
└───────────┬─────────────┘    │
            ↓                  │
┌─────────────────────────┐    │
│  3. 执行一个宏任务       │    │
│     (setTimeout 等)      │    │
└───────────┬─────────────┘    │
            │                  │
            └──────────────────┘
            不断重复循环
```

**核心规则**：
1. **同步代码优先**：所有同步代码先执行
2. **微任务优先于宏任务**：每个宏任务执行完，立即清空所有微任务
3. **宏任务逐个执行**：每次只取一个宏任务执行
4. **微任务一次性清空**：会把微任务队列中的所有任务都执行完

**为什么微任务优先级更高？**
这样设计可以保证 Promise 的回调能够尽快执行，避免被大量宏任务阻塞。

## 五、常见误区

❌ **错误认知**：`Promise.then` 是同步的
✅ **正确理解**：`.then()` 的回调永远是异步的，即使 Promise 已经 fulfilled

```js
const p = Promise.resolve();
p.then(() => console.log('Promise'));
console.log('同步');
// 输出: 同步 → Promise
```

❌ **错误认知**：所有异步任务优先级相同
✅ **正确理解**：微任务 > 宏任务

### 示例代码
```js
function delay(duration = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

/* 情况一：直接调用 delay() 之后的 then */
delay().then(() => {
  console.log('【A】我是 delay().then 里的打印')
  Promise.resolve().then(() => {
    console.log('【B】我是 A 里面 Promise.then 的打印')
  })
})

/* 情况二：Promise.resolve().then(delay) 这条链 */
Promise.resolve()
  .then(delay)
  .then(() => {
    console.log('【C】我是 Promise.then(delay) 后面的打印')
  })

/* 同步代码 */
console.log('【D】我是最外层同步打印')

```
