# 手撕 Promise 与异步编程

> **本页关键词**：Promise 状态机、then 链式调用、微任务、Promise.all / race、async/await、事件循环

---

## 实现路线图

```
Step 1 ─ 构造函数          定义三属性 + resolve/reject + 执行 executor
  │
Step 2 ─ then 方法         参数校验 → 返回新 Promise → 微任务 → 处理 pending
  │
Step 3 ─ catch             then(undefined, onRejected) 的语法糖
  │
Step 4 ─ 静态方法          resolve / reject（了解即可）
  │                        all / race（必须会写）
  │                        allSettled / any（知道原理）
  │
Step 5 ─ async/await       Promise 的语法糖，同步写法处理异步
```

---

## 面试手撕优先级

| 内容 | 优先级 | 说明 |
|------|--------|------|
| Promise 构造函数 + then | 必须会 | 核心中的核心 |
| Promise.all | 必须会 | 高频手撕题 |
| Promise.race | 必须会 | 简单但常考 |
| Promise.allSettled | 知道原理 | 偶尔追问 |
| Promise.any | 知道原理 | 加压题 |
| Promise.resolve / reject | 了解即可 | 几乎不单独考 |

> **面试要点**：面试官真正想看的不是你背 API，而是你是否理解**并发控制**、**聚合结果**、**失败策略**这三个底层思维。

---

## 一、Promise 基础概念

### 为什么需要 Promise

传统回调函数导致**回调地狱**：代码横向嵌套、异常处理困难、请求与处理逻辑耦合。

Promise 通过**链式调用**将嵌套变为线性，通过**状态机**统一管理异步结果。

### 三种状态与状态机规则

```
pending ──resolve()──→ fulfilled
   │
   └──reject() / throw──→ rejected
```

- 状态只能改变一次，不可逆
- 改变方式：调用 `resolve()`、调用 `reject()`、抛出异常

### 核心属性

| 属性 | 作用 |
|------|------|
| `PromiseState` | 当前状态（pending / fulfilled / rejected） |
| `PromiseResult` | 结果值（resolve 的值或 reject 的原因） |
| `callbacks` | 回调队列（pending 时暂存，状态改变后依次执行） |

---

## 二、手撕构造函数

**实现思路**：初始化三属性 → 定义 resolve/reject（箭头函数绑 this）→ 立即执行 executor 并 try-catch。

```javascript
function Promise(executor) {
    this.PromiseState = 'pending';
    this.PromiseResult = undefined;
    this.callbacks = [];

    const resolve = value => {
        if (this.PromiseState !== 'pending') return;
        this.PromiseState = 'fulfilled';
        this.PromiseResult = value;
        this.callbacks.forEach(cb => cb.onFulfilled());
    };

    const reject = reason => {
        if (this.PromiseState !== 'pending') return;
        this.PromiseState = 'rejected';
        this.PromiseResult = reason;
        this.callbacks.forEach(cb => cb.onRejected());
    };

    try {
        executor(resolve, reject);
    } catch (error) {
        reject(error);
    }
}
```

**关键设计决策**：

- **箭头函数定义 resolve/reject**：resolve/reject 会被传给 executor 由用户调用，箭头函数确保 this 始终指向 Promise 实例
- **executor 同步执行**：`new Promise` 时 executor 立即执行，但内部可以包含异步操作（如 setTimeout）
- **回调队列用数组**：一个 Promise 可以多次调用 then，需要保存所有回调

<details>
<summary>Q: executor 同步执行，那 then 的回调什么时候注册？</summary>

executor 同步执行完后，如果内部有异步操作（如 setTimeout），Promise 状态仍是 pending。此时调用 then 会将回调存入 callbacks 数组。等异步操作完成调用 resolve/reject 时，遍历执行所有已保存的回调。

```javascript
const p = new Promise(resolve => {
    setTimeout(() => resolve('数据'), 1000);  // 异步，状态暂时是 pending
});
p.then(v => console.log(v));  // 此时 pending，回调存入队列
// 1秒后 resolve 被调用，执行队列中的回调
```

</details>

---

## 三、手撕 then 方法

**实现思路**：参数校验（值穿透/异常穿透）→ 返回新 Promise → 用 queueMicrotask 包裹回调 → 根据当前状态分三路处理。

```javascript
Promise.prototype.then = function(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function') onFulfilled = value => value;
    if (typeof onRejected !== 'function') onRejected = reason => { throw reason };

    return new Promise((resolve, reject) => {
        const handle = (callback) => {
            queueMicrotask(() => {
                try {
                    const result = callback(this.PromiseResult);
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
            handle(onFulfilled);
        } else if (this.PromiseState === 'rejected') {
            handle(onRejected);
        } else {
            this.callbacks.push({
                onFulfilled: () => handle(onFulfilled),
                onRejected: () => handle(onRejected)
            });
        }
    });
};
```

### then 的五个核心设计

| 设计 | 原因 |
|------|------|
| 参数校验 | 实现值穿透（`.then().then().then(v => ...)`）和异常穿透（错误一路传到 catch） |
| 返回新 Promise | 实现链式调用，每个 then 有独立的状态和结果 |
| queueMicrotask | Promise 回调必须异步执行（微任务），符合 Promise/A+ 规范 |
| 处理 pending | 异步场景下状态未确定，先存回调，状态改变时再执行 |
| 根据返回值决定状态 | 返回普通值 → resolve；返回 Promise → 跟随其状态；抛异常 → reject |

**容易踩的坑**：失败回调正常返回值时，新 Promise 是 **fulfilled** 而不是 rejected。因为错误已被处理，返回值代表恢复。

<details>
<summary>Q: 微任务和宏任务的执行顺序？</summary>

**同步代码 → 微任务 → 宏任务**

```javascript
setTimeout(() => console.log(1), 0);       // 宏任务
new Promise(resolve => {
    console.log(2);                         // 同步
    resolve();
}).then(() => console.log(3));              // 微任务
console.log(4);                             // 同步
// 输出：2 4 3 1
```

`queueMicrotask` 是真正的微任务，`setTimeout` 是宏任务。Promise 规范要求 then 回调以微任务执行。

</details>

---

## 四、catch 与静态方法

### catch

`then(undefined, onRejected)` 的语法糖：

```javascript
Promise.prototype.catch = function(onRejected) {
    return this.then(undefined, onRejected);
};
```

### Promise.all（必须会写）

**本质**：多个异步任务的聚合器 — 全部成功才成功，一个失败就失败。

**实现思路**：计数器 + 按索引存结果 + 任一失败立即 reject。

```javascript
Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        const results = new Array(promises.length);

        promises.forEach((p, index) => {
            Promise.resolve(p).then(value => {
                results[index] = value;
                if (++count === promises.length) resolve(results);
            }, reject);
        });
    });
};
```

**三个关键点**：
1. 用 `count` 计数而非 `results.length`（数组是稀疏的）
2. 用 `index` 保存结果，保证顺序与输入一致
3. 任何一个失败就立即 reject

### Promise.race（必须会写）

**本质**：谁先结束用谁的结果。

```javascript
Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach(p => Promise.resolve(p).then(resolve, reject));
    });
};
```

### Promise.allSettled（知道原理）

与 all 的区别：不管成功失败，全部执行完才 resolve，返回每个结果的状态对象。

```javascript
Promise.allSettled = function(promises) {
    return new Promise(resolve => {
        let count = 0;
        const results = new Array(promises.length);
        promises.forEach((p, index) => {
            Promise.resolve(p).then(
                value => {
                    results[index] = { status: 'fulfilled', value };
                    if (++count === promises.length) resolve(results);
                },
                reason => {
                    results[index] = { status: 'rejected', reason };
                    if (++count === promises.length) resolve(results);
                }
            );
        });
    });
};
```

### Promise.any（知道原理）

与 race 相反：只要一个成功就 resolve，全部失败才 reject（抛出 AggregateError）。

### 静态方法对比

| 方法 | 成功条件 | 失败条件 | 返回值 |
|------|----------|----------|--------|
| all | 全部成功 | 任一失败 | 结果数组（有序） |
| race | 任一完成 | 任一失败 | 第一个完成的结果 |
| allSettled | 全部完成 | 永不失败 | 状态对象数组 |
| any | 任一成功 | 全部失败 | 第一个成功的结果 |

---

## 五、async/await

async/await 是 Promise 的语法糖，让异步代码看起来像同步代码。

### 核心规则

| 关键字 | 规则 |
|--------|------|
| `async` | 函数返回值自动包装为 Promise；抛异常则返回 rejected 的 Promise |
| `await` | 等待 Promise resolve 并取出值；Promise reject 则抛异常，需 try-catch |

### 对比：回调 → Promise 链 → async/await

```javascript
// Promise 链
getUserData(1)
    .then(user => getUserData(user.friendId))
    .then(friend => console.log(friend))
    .catch(err => console.error(err));

// async/await
async function main() {
    try {
        const user = await getUserData(1);
        const friend = await getUserData(user.friendId);
        console.log(friend);
    } catch (err) {
        console.error(err);
    }
}
```

> **面试要点**：async/await 与 Promise 性能相同，本质是语法糖。简单异步用 async/await，并发用 Promise.all，竞速用 Promise.race。

---

## 六、完整实现（Class 版）

```javascript
class MyPromise {
    constructor(executor) {
        this.PromiseState = 'pending';
        this.PromiseResult = undefined;
        this.callbacks = [];

        const resolve = value => {
            if (this.PromiseState !== 'pending') return;
            this.PromiseState = 'fulfilled';
            this.PromiseResult = value;
            this.callbacks.forEach(cb => cb.onFulfilled());
        };
        const reject = reason => {
            if (this.PromiseState !== 'pending') return;
            this.PromiseState = 'rejected';
            this.PromiseResult = reason;
            this.callbacks.forEach(cb => cb.onRejected());
        };

        try { executor(resolve, reject); }
        catch (e) { reject(e); }
    }

    then(onFulfilled, onRejected) {
        if (typeof onFulfilled !== 'function') onFulfilled = v => v;
        if (typeof onRejected !== 'function') onRejected = r => { throw r };

        return new MyPromise((resolve, reject) => {
            const handle = cb => {
                queueMicrotask(() => {
                    try {
                        const result = cb(this.PromiseResult);
                        result instanceof MyPromise
                            ? result.then(resolve, reject)
                            : resolve(result);
                    } catch (e) { reject(e); }
                });
            };

            if (this.PromiseState === 'fulfilled') handle(onFulfilled);
            else if (this.PromiseState === 'rejected') handle(onRejected);
            else this.callbacks.push({
                onFulfilled: () => handle(onFulfilled),
                onRejected: () => handle(onRejected)
            });
        });
    }

    catch(onRejected) { return this.then(undefined, onRejected); }

    static resolve(value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise(resolve => resolve(value));
    }
    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }
    static all(promises) {
        return new MyPromise((resolve, reject) => {
            let count = 0;
            const results = new Array(promises.length);
            promises.forEach((p, i) => {
                MyPromise.resolve(p).then(v => {
                    results[i] = v;
                    if (++count === promises.length) resolve(results);
                }, reject);
            });
        });
    }
    static race(promises) {
        return new MyPromise((resolve, reject) => {
            promises.forEach(p => MyPromise.resolve(p).then(resolve, reject));
        });
    }
}
```

---

## 七、高频面试题

<details>
<summary>Q1: 说出输出顺序并解释</summary>

```javascript
setTimeout(() => console.log(1), 0);
new Promise(resolve => {
    console.log(2);
    resolve();
}).then(() => {
    console.log(3);
}).then(() => {
    console.log(4);
});
console.log(5);
```

输出 `2 5 3 4 1`。executor 同步执行输出 2，同步代码输出 5，微任务队列依次输出 3、4，最后宏任务输出 1。

</details>

<details>
<summary>Q2: 如何中断 Promise 链？</summary>

返回一个永远 pending 的 Promise：

```javascript
.then(value => {
    return new Promise(() => {});  // 永不 resolve/reject
})
```

后续 then 不会执行，因为新 Promise 永远是 pending 状态。

</details>

<details>
<summary>Q3: Promise、Generator、async/await 的关系？</summary>

演化路径：`回调 → Promise → Generator + co → async/await`

- Promise 提供状态管理和链式调用
- Generator 可以暂停执行（yield），是 async/await 的底层原理
- async/await 是基于 Promise + Generator 的语法糖

</details>

<details>
<summary>Q4: Promise.all 中为什么用 count 而不是 results.length？</summary>

因为 `results[index] = value` 是按索引赋值，数组可能是稀疏的。比如先完成 index=2，此时 `results.length` 是 3 但实际只完成了 1 个。用独立计数器才能准确判断全部完成。

</details>
