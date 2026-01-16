# 课程笔记：手撕 Promise 与异步编程
![](../img/promise.svg)
## 一、Promise 基础概念与问题背景

### 为什么需要 Promise？

在 JavaScript 异步编程中，传统的回调函数会导致**回调地狱**问题：

```javascript
// 回调地狱示例
let xhr = new XMLHttpRequest();
xhr.open('get', 'url1');
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        // 第一个请求成功，发起第二个请求
        let xhr2 = new XMLHttpRequest();
        xhr2.open('get', 'url2?param=' + xhr.responseText);
        xhr2.send();
        xhr2.onreadystatechange = function() {
            if (xhr2.readyState === 4 && xhr2.status >= 200) {
                // 第三个请求...嵌套继续
            }
        }
    }
}
```

**问题**：
- 代码横向发展，难以阅读和维护
- 异常处理困难
- 无法清晰区分数据请求与数据处理逻辑

### Promise 是什么？

**Promise** 是异步编程的一种解决方案，比传统回调函数更合理、更强大。

**核心特性**：
- **三种状态**：`pending`（进行中）、`fulfilled`（已成功）、`rejected`（已失败）
- **状态不可逆**：只能从 pending → fulfilled 或 pending → rejected，且只能改变一次
- **三个核心属性**：
  - `PromiseState`：状态
  - `PromiseResult`：结果值
  - `callbacks`：回调队列（支持多个 then）

### 关键概念对比

| 概念 | 类型 | 含义 | 示例 |
|------|------|------|------|
| **fulfilled** | 字符串 | 状态："已成功" | `PromiseState = 'fulfilled'` |
| **rejected** | 字符串 | 状态："已失败" | `PromiseState = 'rejected'` |
| **onFulfilled** | 函数 | 成功时的回调 | `then(onFulfilled, ...)` |
| **onRejected** | 函数 | 失败时的回调 | `then(..., onRejected)` |

**记忆口诀**：没有 on 的 = 状态（字符串），有 on 的 = 回调（函数）

### 📝 要点测验

<details>
<summary>Q1: Promise 解决了什么问题？有哪些优势？</summary>

**答案**：
1. **解决回调地狱**：通过链式调用让异步代码更清晰
2. **更灵活的回调指定**：可以在异步任务启动后或完成后指定回调
3. **支持多个回调**：一个 Promise 可以多次调用 then
4. **异常穿透**：错误可以一直传递到最后的 catch 统一处理
5. **明确的状态管理**：pending/fulfilled/rejected 三态不可逆
</details>

<details>
<summary>Q2: Promise 的状态有哪些？状态改变的规则是什么？</summary>

**答案**：
- **三种状态**：pending（初始）、fulfilled（成功）、rejected（失败）
- **改变规则**：
  1. 只能从 pending → fulfilled 或 pending → rejected
  2. 状态一旦改变，不可再变
  3. 改变方式：调用 resolve()、调用 reject()、抛出异常
</details>

---

## 二、手撕 Promise - 搭建基础结构

### 步骤 1：初始化结构与三个核心属性

**为什么用 IIFE（立即执行函数）？**
- 创建独立作用域，避免污染全局
- 通过参数 `window` 暴露接口

**为什么用箭头函数定义 resolve 和 reject？**
- 箭头函数没有自己的 this，继承外层的 this
- resolve/reject 会被传出去调用，但 this 依然指向 Promise 实例

```javascript
(function (window) {
    function Promise(executor) {
        // ===== 1. 初始化三个核心属性 =====
        this.PromiseState = 'pending';      // 状态
        this.PromiseResult = undefined;     // 结果值
        this.callbacks = [];                // 回调队列
        
        // ===== 2. 定义 resolve 函数（箭头函数保证 this 指向） =====
        const resolve = value => {
            if (this.PromiseState !== 'pending') return;  // 状态只能改变一次
            
            this.PromiseState = 'fulfilled';
            this.PromiseResult = value;
            
            // 执行所有成功回调
            this.callbacks.forEach(cb => cb.onFulfilled());
        }
        
        // ===== 3. 定义 reject 函数 =====
        const reject = reason => {
            if (this.PromiseState !== 'pending') return;
            
            this.PromiseState = 'rejected';
            this.PromiseResult = reason;
            
            // 执行所有失败回调
            this.callbacks.forEach(cb => cb.onRejected());
        }
        
        // ===== 4. 立即执行 executor，并捕获异常 =====
        try {
            executor(resolve, reject);  // executor 接收两个参数
        } catch (error) {
            reject(error);  // 异常自动调用 reject
        }
    }
    
    window.Promise = Promise;
})(window);
```

**关键点解析**：

1. **executor 是什么**：
   - executor 是用户传入的函数：`(resolve, reject) => { ... }`
   - Promise 构造函数会立即同步执行 executor
   - 用户在 executor 中决定何时调用 resolve 或 reject

2. **resolve/reject 的参数和返回值**：
   - **参数**：resolve 接收成功值，reject 接收失败原因
   - **返回值**：无（它们通过修改 this 的属性来改变状态）
   - **作用**：改变 Promise 状态、保存结果值、触发回调队列

3. **为什么 executor 接收两个参数**：
   - 第一个参数 resolve：用户调用它来标记异步操作成功
   -第二个参数 reject：用户调用它来标记异步操作失败
   - 这是 Promise 规范约定的接口

4. **回调队列为什么用数组**：
   - 一个 Promise 可以多次调用 then
   - 需要保存所有回调函数，状态改变时依次执行

```javascript
// 示例：一个 Promise，多个 then
const p = new Promise(resolve => {
    setTimeout(() => resolve('数据'), 1000);
});
p.then(v => console.log('第1个then'));
p.then(v => console.log('第2个then'));
p.then(v => console.log('第3个then'));
// 1秒后三个回调都会执行
```

### 📝 要点测验

<details>
<summary>Q1: 为什么 resolve 和 reject 要用箭头函数而不是普通函数？</summary>

**答案**：
- **箭头函数没有自己的 this**，会继承外层（Promise 构造函数）的 this
- resolve 和 reject 会被传给 executor，由用户代码调用
- 如果用普通函数，调用时 this 会丢失（变成 undefined 或 window）
- 箭头函数确保无论在哪调用，this 始终指向 Promise 实例

```javascript
// ❌ 普通函数：this 会丢失
function resolve(value) {
    this.PromiseState = 'fulfilled';  // this 是谁？
}

// ✅ 箭头函数：this 继承外层
const resolve = value => {
    this.PromiseState = 'fulfilled';  // this = Promise 实例
}
```
</details>

<details>
<summary>Q2: executor 函数的执行时机是同步还是异步？</summary>

**答案**：
- **executor 是同步执行的**，在 new Promise 时立即执行
- 但 executor 内部可以包含异步操作（如 setTimeout、ajax）
- then 的回调才是异步执行的（微任务）

```javascript
console.log('1');
new Promise((resolve) => {
    console.log('2');  // executor 同步执行
    resolve();
}).then(() => {
    console.log('3');  // then 回调异步执行
});
console.log('4');
// 输出：1 2 4 3
```
</details>

---

## 三、手撕 Promise - 实现 then 方法

### then 方法的五个核心功能

1. 参数校验和值穿透
2. 返回新 Promise 实现链式调用
3. 使用微任务队列（queueMicrotask）
4. 处理 pending 状态（异步场景）
5. 根据回调返回值决定新 Promise 的状态

### 完整实现

```javascript
Promise.prototype.then = function(onFulfilled, onRejected) {
    // ===== 1. 参数校验和值穿透 =====
    if (typeof onFulfilled !== 'function') {
        onFulfilled = value => value;  // 值穿透
    }
    if (typeof onRejected !== 'function') {
        onRejected = reason => { throw reason };  // 异常穿透
    }
    
    // ===== 2. 返回新 Promise =====
    return new Promise((resolve, reject) => {
        
        // ===== 3. 封装处理函数 =====
        const handleFulfilled = () => {
            queueMicrotask(() => {  // 微任务
                try {
                    const result = onFulfilled(this.PromiseResult);
                    
                    // 根据返回值决定新 Promise 状态
                    if (result instanceof Promise) {
                        result.then(resolve, reject);  // 等待内部 Promise
                    } else {
                        resolve(result);  // 普通值直接 resolve
                    }
                } catch (error) {
                    reject(error);  // 异常则 reject
                }
            });
        };
        
        const handleRejected = () => {
            queueMicrotask(() => {
                try {
                    const result = onRejected(this.PromiseResult);
                    if (result instanceof Promise) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);  // 注意：失败回调返回值也会 resolve
                    }
                } catch (error) {
                    reject(error);
                }
            });
        };
        
        // ===== 4. 根据当前状态执行对应逻辑 =====
        if (this.PromiseState === 'fulfilled') {
            handleFulfilled();
        } else if (this.PromiseState === 'rejected') {
            handleRejected();
        } else {
            // ===== 5. pending 状态：保存回调 =====
            this.callbacks.push({
                onFulfilled: handleFulfilled,
                onRejected: handleRejected
            });
        }
    });
}
```

### 关键点详解

**1. 值穿透与异常穿透**

```javascript
// 值穿透
Promise.resolve(1)
    .then()  // 没传回调
    .then()  // 没传回调
    .then(value => console.log(value));  // 输出：1

// 异常穿透
Promise.reject('错误')
    .then(v => v)  // 没处理错误
    .then(v => v)  // 没处理错误
    .catch(err => console.log(err));  // 捕获到：错误
```

**2. 为什么必须返回新 Promise？**

```javascript
// 实现链式调用
promise
    .then(v => v + 1)      // 返回 Promise2
    .then(v => v * 2)      // 返回 Promise3
    .then(v => console.log(v));  // 返回 Promise4
```

**3. 微任务 vs 宏任务**

```javascript
// queueMicrotask（推荐，真正的微任务）
queueMicrotask(() => console.log('微任务'));

// setTimeout（备选，宏任务，不太准确）
setTimeout(() => console.log('宏任务'), 0);

console.log('同步代码');

// 输出顺序：同步代码 → 微任务 → 宏任务
```

**4. pending 状态处理（异步场景）**

```javascript
// 异步场景：状态是 pending
const p = new Promise(resolve => {
    setTimeout(() => resolve('异步'), 1000);
});
p.then(v => console.log(v));  // 此时状态是 pending，保存回调
// 1秒后 resolve 被调用，执行保存的回调
```

**5. 回调返回值的四种情况**

```javascript
// 情况1：返回普通值
promise.then(value => 'hello');  // 新 Promise: fulfilled, 'hello'

// 情况2：返回 Promise
promise.then(value => new Promise(resolve => resolve('world')));
// 新 Promise: 等待内部 Promise 完成

// 情况3：抛出异常
promise.then(value => { throw new Error('错误') });
// 新 Promise: rejected, Error对象

// 情况4：失败回调返回值
promise.then(null, reason => 'handled');
// 注意：新 Promise 是 fulfilled（不是 rejected）
```

### 📝 要点测验

<details>
<summary>Q1: then 方法为什么必须返回新的 Promise？</summary>

**答案**：
- **实现链式调用**：`p.then().then().then()`
- **隔离状态**：每个 then 都有独立的状态和结果
- **符合 Promise/A+ 规范**：then 必须返回一个 promise

如果不返回新 Promise，链式调用会中断，且无法传递处理结果。
</details>

<details>
<summary>Q2: queueMicrotask 和 setTimeout 的区别？为什么推荐用 queueMicrotask？</summary>

**答案**：
- **queueMicrotask**：
  - 真正的微任务，在当前宏任务结束后、下一个宏任务前执行
  - 符合 Promise/A+ 规范
  - 优先级高于宏任务
  
- **setTimeout**：
  - 宏任务，放入宏任务队列
  - 执行时机晚于微任务
  - 兼容性更好，但不够准确

**执行顺序**：同步代码 → 微任务 → 宏任务
</details>

<details>
<summary>Q3: 为什么失败回调返回普通值，新 Promise 状态是 fulfilled 而不是 rejected？</summary>

**答案**：
- **错误被处理了**：失败回调成功执行并返回值，说明错误已被处理
- **返回值决定状态**：只要回调正常返回（没抛异常），新 Promise 就是 fulfilled
- **异常穿透机制**：只有抛出异常或返回 rejected 的 Promise，新 Promise 才是 rejected

```javascript
Promise.reject('错误')
    .then(null, err => {
        console.log('处理错误:', err);
        return '已恢复';
    })
    .then(value => console.log(value));  // 输出：已恢复（fulfilled）
```
</details>

---

## 四、手撕 Promise - catch 与静态方法

### 1. catch 方法

catch 是 then 的语法糖，专门用于处理失败情况。

```javascript
Promise.prototype.catch = function(onRejected) {
    return this.then(undefined, onRejected);
}
```

**使用示例**：

```javascript
Promise.reject('错误')
    .catch(err => console.log('捕获:', err));

// 等价于
Promise.reject('错误')
    .then(undefined, err => console.log('捕获:', err));
```

### 2. Promise.resolve

```javascript
Promise.resolve = function(value) {
    if (value instanceof Promise) {
        return value;  // Promise 对象直接返回
    }
    return new Promise(resolve => resolve(value));
}
```

### 3. Promise.reject

```javascript
Promise.reject = function(reason) {
    return new Promise((resolve, reject) => reject(reason));
}
```

### 4. Promise.all

**特点**：
- 所有 Promise 都成功才返回成功，返回结果数组
- 有一个失败就返回失败
- 结果数组顺序与输入数组顺序一致

```javascript
Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        const results = new Array(promises.length);
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
                value => {
                    count++;
                    results[index] = value;  // 按顺序保存
                    if (count === promises.length) {
                        resolve(results);
                    }
                },
                reason => reject(reason)  // 一个失败就 reject
            );
        });
    });
}
```

**使用场景**：同时请求多个接口，等待全部完成

```javascript
Promise.all([
    fetch('/api/users'),
    fetch('/api/banners'),
    fetch('/api/videos')
]).then(values => {
    console.log('所有数据:', values);
});
```

### 5. Promise.race

**特点**：返回最先完成的 Promise 的结果（无论成功还是失败）

```javascript
Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach(promise => {
            Promise.resolve(promise).then(resolve, reject);
        });
    });
}
```

**使用场景**：请求超时控制

```javascript
function request() {
    return new Promise(resolve => {
        setTimeout(() => resolve('请求成功'), 4000);
    });
}

function timeout() {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject('请求超时'), 3000);
    });
}

Promise.race([request(), timeout()])
    .then(v => console.log(v))
    .catch(err => console.log(err));  // 输出：请求超时
```

### 📝 要点测验

<details>
<summary>Q1: Promise.all 和 Promise.race 的区别？</summary>

**答案**：

| 特性 | Promise.all | Promise.race |
|------|-------------|--------------|
| **成功条件** | 所有 Promise 都成功 | 任意一个 Promise 完成 |
| **失败条件** | 任意一个 Promise 失败 | 任意一个 Promise 失败 |
| **返回结果** | 所有结果的数组 | 第一个完成的结果 |
| **使用场景** | 并发请求，需要所有结果 | 超时控制、快速响应 |
</details>

<details>
<summary>Q2: Promise.resolve 和 new Promise(resolve => resolve(value)) 有什么区别？</summary>

**答案**：
- **功能基本相同**：都返回 fulfilled 状态的 Promise
- **Promise.resolve 更高效**：
  - 如果参数已经是 Promise，直接返回（不创建新对象）
  - 如果是普通值，才创建新 Promise
- **使用场景**：快速将普通值转为 Promise，或确保返回值是 Promise

```javascript
const p = new Promise(resolve => resolve(1));
Promise.resolve(p) === p;  // true，直接返回原对象
```
</details>

---

## 五、async/await - 终极异步解决方案

### async 函数

**async** 是函数的修饰符，被 async 定义的函数会默认返回一个 Promise。

```javascript
// 返回非 Promise
async function fun1() {
    return 'hello';
}
fun1().then(v => console.log(v));  // hello

// 返回 Promise
async function fun2() {
    return new Promise(resolve => resolve('world'));
}
fun2().then(v => console.log(v));  // world

// 抛出异常
async function fun3() {
    throw new Error('错误');
}
fun3().catch(err => console.log(err));  // Error: 错误
```

### await 表达式

**await** 只能放在 async 函数内，作用是"等待"。

**特点**：
- await 修饰 Promise 对象：获取 resolve 的值，然后继续执行
- await 修饰非 Promise：将其作为 await 表达式的结果
- 如果 Promise 失败：抛出异常，需要 try...catch 捕获

```javascript
async function main() {
    // 1. 非 Promise
    let a = await 10;  // a = 10
    
    // 2. 成功的 Promise
    let b = await new Promise(resolve => {
        setTimeout(() => resolve('数据'), 1000);
    });  // b = '数据'（等待1秒后）
    
    // 3. 失败的 Promise（需要 try...catch）
    try {
        let c = await new Promise((resolve, reject) => {
            reject('错误');
        });
    } catch (e) {
        console.log('捕获:', e);  // 捕获: 错误
    }
}
```

### 对比：Promise 链 vs async/await

```javascript
// Promise 链式调用
function readFiles() {
    return readFile('./file1.txt')
        .then(data1 => {
            return readFile('./file2.txt').then(data2 => {
                return readFile('./file3.txt').then(data3 => {
                    return data1 + data2 + data3;
                });
            });
        });
}

// async/await（更清晰）
async function readFiles() {
    let data1 = await readFile('./file1.txt');
    let data2 = await readFile('./file2.txt');
    let data3 = await readFile('./file3.txt');
    return data1 + data2 + data3;
}
```

### 📝 要点测验

<details>
<summary>Q1: async 函数返回值的规则是什么？</summary>

**答案**：
- **返回非 Promise 值**：自动包装成 fulfilled 的 Promise
- **返回 Promise 对象**：返回该 Promise（不重复包装）
- **抛出异常**：返回 rejected 的 Promise

```javascript
async function test() {
    return 123;  // 等价于 return Promise.resolve(123)
}
```
</details>

<details>
<summary>Q2: await 和 Promise.then 有什么区别？</summary>

**答案**：

| 特性 | await | Promise.then |
|------|-------|--------------|
| **语法** | 同步风格 | 回调风格 |
| **错误处理** | try...catch | .catch() |
| **可读性** | 更像同步代码，清晰 | 链式调用，嵌套多时复杂 |
| **使用限制** | 必须在 async 函数内 | 无限制 |
| **本质** | 语法糖，底层仍是 Promise | Promise 原生 API |

**建议**：新代码优先使用 async/await，但需要理解 Promise 机制。
</details>

<details>
<summary>Q3: 如何处理 await 的异常？</summary>

**答案**：
使用 **try...catch** 包裹 await：

```javascript
async function fetchData() {
    try {
        const data = await fetch('/api/data');
        console.log(data);
    } catch (error) {
        console.log('请求失败:', error);
    }
}
```

或者在调用时用 .catch()：

```javascript
fetchData().catch(err => console.log('外层捕获:', err));
```
</details>

---

## 六、完整代码与核心总结

### 完整实现（函数式）

```javascript
(function (window) {
    function Promise(executor) {
        this.PromiseState = 'pending';
        this.PromiseResult = undefined;
        this.callbacks = [];
        
        const resolve = value => {
            if (this.PromiseState !== 'pending') return;
            this.PromiseState = 'fulfilled';
            this.PromiseResult = value;
            this.callbacks.forEach(cb => cb.onFulfilled());
        }
        
        const reject = reason => {
            if (this.PromiseState !== 'pending') return;
            this.PromiseState = 'rejected';
            this.PromiseResult = reason;
            this.callbacks.forEach(cb => cb.onRejected());
        }
        
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    
    Promise.prototype.then = function(onFulfilled, onRejected) {
        if (typeof onFulfilled !== 'function') {
            onFulfilled = value => value;
        }
        if (typeof onRejected !== 'function') {
            onRejected = reason => { throw reason };
        }
        
        return new Promise((resolve, reject) => {
            const handleFulfilled = () => {
                queueMicrotask(() => {
                    try {
                        const result = onFulfilled(this.PromiseResult);
                        if (result instanceof Promise) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
            };
            
            const handleRejected = () => {
                queueMicrotask(() => {
                    try {
                        const result = onRejected(this.PromiseResult);
                        if (result instanceof Promise) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
            };
            
            if (this.PromiseState === 'fulfilled') {
                handleFulfilled();
            } else if (this.PromiseState === 'rejected') {
                handleRejected();
            } else {
                this.callbacks.push({
                    onFulfilled: handleFulfilled,
                    onRejected: handleRejected
                });
            }
        });
    }
    
    Promise.prototype.catch = function(onRejected) {
        return this.then(undefined, onRejected);
    }
    
    Promise.resolve = function(value) {
        if (value instanceof Promise) return value;
        return new Promise(resolve => resolve(value));
    }
    
    Promise.reject = function(reason) {
        return new Promise((resolve, reject) => reject(reason));
    }
    
    Promise.all = function(promises) {
        return new Promise((resolve, reject) => {
            let count = 0;
            const results = new Array(promises.length);
            promises.forEach((promise, index) => {
                Promise.resolve(promise).then(
                    value => {
                        count++;
                        results[index] = value;
                        if (count === promises.length) {
                            resolve(results);
                        }
                    },
                    reason => reject(reason)
                );
            });
        });
    }
    
    Promise.race = function(promises) {
        return new Promise((resolve, reject) => {
            promises.forEach(promise => {
                Promise.resolve(promise).then(resolve, reject);
            });
        });
    }
    
    window.Promise = Promise;
})(window);
```

### ES6 Class 实现（精简版）

```javascript
(function (window) {
    class Promise {
        constructor(executor) {
            this.PromiseState = 'pending';
            this.PromiseResult = undefined;
            this.callbacks = [];
            
            const resolve = value => {
                if (this.PromiseState !== 'pending') return;
                this.PromiseState = 'fulfilled';
                this.PromiseResult = value;
                this.callbacks.forEach(cb => cb.onFulfilled());
            }
            
            const reject = reason => {
                if (this.PromiseState !== 'pending') return;
                this.PromiseState = 'rejected';
                this.PromiseResult = reason;
                this.callbacks.forEach(cb => cb.onRejected());
            }
            
            try {
                executor(resolve, reject);
            } catch (error) {
                reject(error);
            }
        }
        
        then(onFulfilled, onRejected) {
            if (typeof onFulfilled !== 'function') {
                onFulfilled = value => value;
            }
            if (typeof onRejected !== 'function') {
                onRejected = reason => { throw reason };
            }
            
            return new Promise((resolve, reject) => {
                const handleFulfilled = () => {
                    queueMicrotask(() => {
                        try {
                            const result = onFulfilled(this.PromiseResult);
                            if (result instanceof Promise) {
                                result.then(resolve, reject);
                            } else {
                                resolve(result);
                            }
                        } catch (error) {
                            reject(error);
                        }
                    });
                };
                
                const handleRejected = () => {
                    queueMicrotask(() => {
                        try {
                            const result = onRejected(this.PromiseResult);
                            if (result instanceof Promise) {
                                result.then(resolve, reject);
                            } else {
                                resolve(result);
                            }
                        } catch (error) {
                            reject(error);
                        }
                    });
                };
                
                if (this.PromiseState === 'fulfilled') {
                    handleFulfilled();
                } else if (this.PromiseState === 'rejected') {
                    handleRejected();
                } else {
                    this.callbacks.push({
                        onFulfilled: handleFulfilled,
                        onRejected: handleRejected
                    });
                }
            });
        }
        
        catch(onRejected) {
            return this.then(undefined, onRejected);
        }
        
        static resolve(value) {
            if (value instanceof Promise) return value;
            return new Promise(resolve => resolve(value));
        }
        
        static reject(reason) {
            return new Promise((resolve, reject) => reject(reason));
        }
        
        static all(promises) {
            return new Promise((resolve, reject) => {
                let count = 0;
                const results = new Array(promises.length);
                promises.forEach((promise, index) => {
                    Promise.resolve(promise).then(
                        value => {
                            count++;
                            results[index] = value;
                            if (count === promises.length) {
                                resolve(results);
                            }
                        },
                        reason => reject(reason)
                    );
                });
            });
        }
        
        static race(promises) {
            return new Promise((resolve, reject) => {
                promises.forEach(promise => {
                    Promise.resolve(promise).then(resolve, reject);
                });
            });
        }
    }
    
    window.Promise = Promise;
})(window);
```

### 核心知识点总结

#### 1. this 指向
- 构造函数中的 this 指向实例对象
- 箭头函数没有自己的 this，继承外层的 this
- 使用箭头函数确保 resolve 和 reject 的 this 指向正确

#### 2. 状态管理
- Promise 有三种状态：pending、fulfilled、rejected
- 状态只能改变一次，且不可逆
- 状态改变后需要执行对应的回调队列

#### 3. 回调队列
- 使用数组存储多个回调函数
- pending 状态时保存回调
- 状态改变时遍历执行所有回调

#### 4. 微任务实现
- Promise 回调必须异步执行
- 推荐使用 `queueMicrotask`（微任务）
- 备选使用 `setTimeout`（宏任务，不够准确）

#### 5. then 方法核心
- 参数校验和值穿透
- 返回新 Promise 实现链式调用
- 根据回调返回值决定新 Promise 状态
- 处理三种状态（fulfilled、rejected、pending）

#### 6. 链式调用原理
- then 方法返回新的 Promise
- 回调函数的返回值决定新 Promise 的状态
- 支持值穿透和异常穿透

### 📝 综合测验

<details>
<summary>Q1: 说出以下代码的输出顺序并解释原因</summary>

```javascript
setTimeout(() => console.log(1), 0);
new Promise((resolve) => {
    console.log(2);
    resolve();
}).then(() => {
    console.log(3);
}).then(() => {
    console.log(4);
});
console.log(5);
```

**答案**：输出顺序 `2 5 3 4 1`

**解释**：
1. `setTimeout` 是宏任务，放入宏任务队列
2. Promise 构造函数中的代码同步执行，输出 `2`
3. `.then` 是微任务，放入微任务队列
4. 同步代码继续执行，输出 `5`
5. 当前宏任务结束，执行所有微任务：输出 `3 4`
6. 微任务清空，执行下一个宏任务：输出 `1`

**规则**：同步代码 → 微任务 → 宏任务
</details>

<details>
<summary>Q2: 如何中断 Promise 链？</summary>

**答案**：
在回调函数中**返回一个 pending 状态的 Promise**：

```javascript
new Promise((resolve) => resolve(1))
    .then(value => {
        console.log(value);  // 1
        return new Promise(() => {});  // pending 状态，永不改变
    })
    .then(value => {
        console.log('不会执行');
    });
```

**原理**：
- then 返回的新 Promise 状态取决于回调返回值
- 返回 pending 的 Promise，新 Promise 也会一直 pending
- pending 状态不会触发后续的 then
</details>

<details>
<summary>Q3: Promise、async/await、Generator 的关系是什么？</summary>

**答案**：
- **Promise**：异步编程的基础，提供状态管理和链式调用
- **Generator**：ES6 生成器函数，可以暂停执行（yield），是 async/await 的底层实现原理
- **async/await**：ES7 语法糖，基于 Promise 和 Generator，让异步代码看起来像同步代码

**演化历程**：
```
回调函数 → Promise → Generator + co库 → async/await
```

**建议**：
- 理解 Promise 机制是基础
- 日常开发优先使用 async/await
- 复杂场景可能需要结合使用
</details>

---

## 附录：常见面试题

### 1. Promise.all 的实现原理

```javascript
Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        const results = new Array(promises.length);
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
                value => {
                    count++;
                    results[index] = value;  // 按索引保存，保证顺序
                    if (count === promises.length) {
                        resolve(results);
                    }
                },
                reason => reject(reason)  // 一个失败立即 reject
            );
        });
    });
}
```

**关键点**：
- 用 `count` 计数而不是 `results.length`（因为数组是稀疏的）
- 用 `index` 保存结果，确保顺序正确
- 任何一个失败就立即 reject

### 2. 如何实现 Promise.allSettled？

```javascript
Promise.allSettled = function(promises) {
    return new Promise(resolve => {
        let count = 0;
        const results = new Array(promises.length);
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
                value => {
                    results[index] = { status: 'fulfilled', value };
                    count++;
                    if (count === promises.length) resolve(results);
                },
                reason => {
                    results[index] = { status: 'rejected', reason };
                    count++;
                    if (count === promises.length) resolve(results);
                }
            );
        });
    });
}
```

**与 Promise.all 的区别**：
- 不会 reject，永远返回 fulfilled 的 Promise
- 返回所有 Promise 的状态和结果

### 3. 红绿灯问题

要求：红灯3秒亮一次，绿灯2秒亮一次，黄灯1秒亮一次，循环执行。

```javascript
function red() {
    console.log('红灯');
}
function green() {
    console.log('绿灯');
}
function yellow() {
    console.log('黄灯');
}

function light(fn, delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            fn();
            resolve();
        }, delay);
    });
}

async function loop() {
    while (true) {
        await light(red, 3000);
        await light(green, 2000);
        await light(yellow, 1000);
    }
}

loop();
```

---

## 七、实战应用 - 使用手写 Promise

### executor 是什么？

**executor 就是用户传入的函数**，在创建 Promise 时立即执行：

```javascript
// executor 就是这个箭头函数
const p = new Promise((resolve, reject) => {
    // 这里是 executor 函数体
    // resolve 和 reject 是 Promise 内部传给我们的
    console.log('executor 立即执行');
    resolve('成功');
});

// 输出顺序：
// executor 立即执行（同步）
// 然后才是 then 的回调（异步）
```

### 实战1：封装 AJAX 请求

使用我们手写的 Promise 封装一个真实的 ajax 请求：

```html
<!DOCTYPE html>
<html>
<head>
    <title>手写Promise - AJAX封装</title>
</head>
<body>
    <button id="btn">发送请求</button>
    
    <script src="./myPromise.js"></script>  <!-- 引入手写的Promise -->
    <script>
        // ===== 封装 ajax 函数，返回手写的Promise =====
        function ajax(url, method = 'GET') {
            // 返回一个Promise实例
            // 这里传入的箭头函数就是 executor
            return new Promise((resolve, reject) => {
                // executor 立即执行以下代码
                console.log('开始发送请求...');
                
                // 1. 创建 XMLHttpRequest 对象
                const xhr = new XMLHttpRequest();
                
                // 2. 打开连接
                xhr.open(method, url);
                
                // 3. 发送请求
                xhr.send();
                
                // 4. 监听状态变化
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            // 请求成功，调用 resolve
                            // resolve 会改变 Promise 状态为 fulfilled
                            resolve(xhr.responseText);
                        } else {
                            // 请求失败，调用 reject
                            // reject 会改变 Promise 状态为 rejected
                            reject(xhr.statusText);
                        }
                    }
                };
                
                // 5. 监听错误
                xhr.onerror = function() {
                    reject('网络错误');
                };
            });
        }
        
        // ===== 使用封装的 ajax 函数 =====
        document.getElementById('btn').onclick = function() {
            ajax('https://api.github.com/users/github')
                .then(data => {
                    console.log('请求成功:', data);
                    const user = JSON.parse(data);
                    console.log('用户名:', user.login);
                    console.log('头像:', user.avatar_url);
                    return user.login;  // 返回值传给下一个then
                })
                .then(username => {
                    console.log('处理用户名:', username);
                    // 发起第二个请求
                    return ajax(`https://api.github.com/users/${username}/repos`);
                })
                .then(repos => {
                    console.log('用户仓库:', repos);
                })
                .catch(error => {
                    console.error('请求失败:', error);
                });
        };
    </script>
</body>
</html>
```

**关键点解析**：

1. **executor 是我们传入的函数**：
   ```javascript
   new Promise((resolve, reject) => {
       // 这就是 executor
   })
   ```

2. **executor 立即执行**：
   - `new Promise` 时，executor 马上同步执行
   - 但 xhr.onreadystatechange 是异步回调
   - 这就是为什么需要回调队列

3. **resolve/reject 由 Promise 提供**：
   - 我们在 executor 中调用它们
   - 它们会改变 Promise 状态
   - 触发对应的 then 回调

### 实战2：解决回调地狱

**传统回调方式**（回调地狱）：

```javascript
// 传统方式：嵌套回调
function getUserData(userId, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/user/${userId}`);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(null, JSON.parse(xhr.responseText));
        } else {
            callback(xhr.statusText);
        }
    };
}

// 使用时：回调地狱
getUserData(1, (err, user) => {
    if (err) return console.error(err);
    
    getUserData(user.friendId, (err, friend) => {
        if (err) return console.error(err);
        
        getUserData(friend.friendId, (err, friendOfFriend) => {
            if (err) return console.error(err);
            
            console.log('终于拿到数据了...', friendOfFriend);
            // 继续嵌套...😱
        });
    });
});
```

**使用手写Promise改造**：

```javascript
// 用手写Promise改造
function getUserData(userId) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/user/${userId}`);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(xhr.statusText);
                }
            }
        };
    });
}

// 使用时：链式调用，清晰易读
getUserData(1)
    .then(user => {
        console.log('用户1:', user);
        return getUserData(user.friendId);  // 返回新Promise
    })
    .then(friend => {
        console.log('用户2:', friend);
        return getUserData(friend.friendId);
    })
    .then(friendOfFriend => {
        console.log('用户3:', friendOfFriend);
    })
    .catch(error => {
        console.error('任何一步出错都会被捕获:', error);
    });
```

**进一步升级：使用 async/await**：

```javascript
async function fetchUserChain() {
    try {
        const user1 = await getUserData(1);
        console.log('用户1:', user1);
        
        const user2 = await getUserData(user1.friendId);
        console.log('用户2:', user2);
        
        const user3 = await getUserData(user2.friendId);
        console.log('用户3:', user3);
        
        return user3;
    } catch (error) {
        console.error('请求失败:', error);
    }
}

fetchUserChain();
```

### 实战3：并发请求多个接口

使用 Promise.all 同时请求多个接口：

```javascript
// 封装多个请求
function getUsers() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(['user1', 'user2']), 1000);
    });
}

function getBanners() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(['banner1', 'banner2']), 1500);
    });
}

function getVideos() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(['video1', 'video2']), 2000);
    });
}

// 页面初始化：并发请求所有数据
async function initPage() {
    console.log('开始加载页面数据...');
    
    try {
        // 使用 Promise.all 并发请求
        const [users, banners, videos] = await Promise.all([
            getUsers(),
            getBanners(),
            getVideos()
        ]);
        
        console.log('所有数据加载完成:');
        console.log('用户列表:', users);
        console.log('轮播图:', banners);
        console.log('视频列表:', videos);
        
        // 渲染页面...
    } catch (error) {
        console.error('加载失败:', error);
    }
}

initPage();
// 2秒后（最慢的请求完成）输出所有数据
```

### 实战4：请求超时控制

使用 Promise.race 实现超时控制：

```javascript
function request(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.responseText);
            }
        };
    });
}

function timeout(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error(`请求超时(${ms}ms)`));
        }, ms);
    });
}

// 请求与超时竞速
async function fetchWithTimeout(url, ms) {
    try {
        const result = await Promise.race([
            request(url),
            timeout(ms)
        ]);
        console.log('请求成功:', result);
    } catch (error) {
        console.error(error.message);  // 请求超时(3000ms)
    }
}

fetchWithTimeout('https://api.github.com/users/github', 3000);
```

### 📝 实战测验

<details>
<summary>Q1: 为什么 executor 要立即执行？</summary>

**答案**：
1. **符合用户预期**：用户在 `new Promise` 时就想启动异步操作
2. **及时捕获异常**：executor 中的同步代码错误可以被 try-catch 捕获
3. **状态初始化**：executor 中调用 resolve/reject 来初始化 Promise 状态

```javascript
// 如果 executor 不立即执行：
new Promise((resolve) => {
    // 何时执行？由谁调用？
    setTimeout(() => resolve('data'), 1000);
});
// 用户调用 then 时，executor 还没执行，无法注册回调！
```
</details>

<details>
<summary>Q2: 封装 ajax 时，为什么要在回调中调用 resolve/reject？</summary>

**答案**：
- **异步操作的本质**：ajax 请求是异步的，结果在将来某个时刻才返回
- **executor 立即执行完**：executor 执行完后，Promise 还是 pending 状态
- **回调中改变状态**：在 xhr.onreadystatechange 中调用 resolve/reject，才能在请求完成时改变状态

```javascript
new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    // executor 执行到这里就结束了，但请求还没完成
    // Promise 状态是 pending
    
    xhr.onreadystatechange = function() {
        // 这是异步回调，将来才执行
        if (xhr.readyState === 4) {
            resolve(data);  // 在这里改变状态
        }
    };
});
```
</details>

<details>
<summary>Q3: Promise 和 async/await 哪个性能更好？</summary>

**答案**：
- **性能基本相同**：async/await 是 Promise 的语法糖，底层就是 Promise
- **区别在于可读性**：async/await 更像同步代码，更易读
- **选择建议**：
  - 简单异步：优先用 async/await
  - 并发请求：使用 Promise.all
  - 竞速场景：使用 Promise.race
  - 复杂流程：结合使用

```javascript
// 性能相同，但 async/await 更清晰
// Promise 链
fetch('/api')
    .then(r => r.json())
    .then(data => process(data))
    .catch(err => handle(err));

// async/await
try {
    const r = await fetch('/api');
    const data = await r.json();
    process(data);
} catch (err) {
    handle(err);
}
```
</details>

---

**学习完成！** 🎉

记住：**Promise 是异步编程的基础，理解其状态管理和链式调用机制是关键。**

**核心要点回顾**：
1. executor 是用户传入的函数，立即同步执行
2. resolve/reject 由 Promise 提供，用户在 executor 中调用
3. then 返回新 Promise，实现链式调用
4. 回调必须异步执行（微任务）
5. async/await 是 Promise 的语法糖，本质相同
