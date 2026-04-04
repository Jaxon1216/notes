## 11~25 【超高频 · 看思路能写】

## Promise.all | 生/熟/秒: 
计数器，全部resolve才resolve，任一reject直接reject。用索引赋值保证顺序。
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let count = 0;
    if (!promises.length) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val; // 索引赋值保证顺序
        if (++count === promises.length) resolve(results);
      }, reject);
    });
  });
}
```

## 垂直居中N种方法 | 生/熟/秒: 
面试说出 flex / absolute+transform / grid 三种即可。
```css
/* 1. flex（最常用） */
.parent { display: flex; align-items: center; justify-content: center; }
/* 2. absolute + transform（不需要知道子元素宽高） */
.child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
/* 3. absolute + margin auto（需设宽高） */
.child { position: absolute; inset: 0; margin: auto; width: 100px; height: 100px; }
/* 4. grid */
.parent { display: grid; place-items: center; }
```

## 两栏布局N种方法 | 生/熟/秒: 
左固定右自适应。优先答 flex，再答 float。
```css
/* 1. flex */
.container { display: flex; }
.left { width: 200px; }
.right { flex: 1; }
/* 2. float + margin */
.left { float: left; width: 200px; }
.right { margin-left: 200px; }
/* 3. float + BFC */
.left { float: left; width: 200px; }
.right { overflow: hidden; } /* 触发BFC，不与浮动重叠 */
```

## 三栏布局N种方法 | 生/熟/秒: 
左右固定中间自适应。flex 最简洁，圣杯/双飞翼是经典考点。
```css
/* 1. flex */
.container { display: flex; }
.left { width: 200px; }
.center { flex: 1; }
.right { width: 200px; }
/* 2. absolute 定位 */
.left { position: absolute; left: 0; width: 200px; }
.right { position: absolute; right: 0; width: 200px; }
.center { margin: 0 200px; }
/* 3. float（注意HTML中center要放最后） */
.left { float: left; width: 200px; }
.right { float: right; width: 200px; }
.center { margin: 0 200px; }
```

## Promise.race | 生/熟/秒: 
谁先settle用谁的结果。比 all 简单得多。
```js
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => Promise.resolve(p).then(resolve, reject));
  });
}
```

## 发布订阅 EventEmitter | 生/熟/秒: 
核心四方法：on/off/emit/once。once 用 wrapper 包一层自动 off。
```js
class EventEmitter {
  constructor() { this.events = {}; }
  on(event, fn) {
    (this.events[event] ||= []).push(fn);
  }
  off(event, fn) {
    this.events[event] = (this.events[event] || []).filter(f => f !== fn);
  }
  emit(event, ...args) {
    (this.events[event] || []).forEach(fn => fn(...args));
  }
  once(event, fn) {
    const wrapper = (...args) => { fn(...args); this.off(event, wrapper); };
    this.on(event, wrapper);
  }
}
```

## 数组转树 | 生/熟/秒: 
用 map 存 id→node 引用，一次遍历建映射，二次遍历挂 children。
```js
function arrayToTree(items) {
  const map = {};
  const roots = [];
  items.forEach(item => map[item.id] = { ...item, children: [] });
  items.forEach(item => {
    if (item.parentId == null) roots.push(map[item.id]);
    else map[item.parentId].children.push(map[item.id]);
  });
  return roots;
}
```

## LRU缓存 | 生/熟/秒: 
Map 保持插入顺序，get 时删除再 set 实现"移到最新"。
```js
class LRUCache {
  constructor(capacity) { this.capacity = capacity; this.cache = new Map(); }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val); // 删再插 = 移到最新
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity)
      this.cache.delete(this.cache.keys().next().value); // 淘汰最久未用
  }
}
```

## 深度比较 deepEqual | 生/熟/秒: 
递归对比，先判 ===，再判 null/类型，再比 key 数量，最后逐 key 递归。
```js
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') return false;
  const keysA = Object.keys(a), keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => deepEqual(a[key], b[key]));
}
```

## 柯里化 curry | 生/熟/秒: 
收集参数，够了就执行，不够继续返回函数。靠 fn.length 判断。
```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}
```

## 闭包加法 add(1)(2)(3) | 生/熟/秒: 
链式调用 + valueOf 隐式转换。每次返回新函数，valueOf 返回累加值。
```js
function add(a) {
  function sum(b) { return add(a + b); }
  sum.valueOf = () => a;
  return sum;
}
// add(1)(2)(3) + 0 === 6
```

## 四大排序 | 生/熟/秒: 
冒泡/选择/插入 O(n²)，快排 O(nlogn)。快排必会，其余看思路。
```js
// 冒泡：相邻比较交换，大的往后冒
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++)
    for (let j = 0; j < arr.length - 1 - i; j++)
      if (arr[j] > arr[j+1]) [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
  return arr;
}
// 选择：每轮找最小放前面
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) if (arr[j] < arr[min]) min = j;
    [arr[i], arr[min]] = [arr[min], arr[i]];
  }
  return arr;
}
// 插入：把当前元素插到前面已排序部分的正确位置
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j-1] > arr[j]) { [arr[j-1], arr[j]] = [arr[j], arr[j-1]]; j--; }
  }
  return arr;
}
// 快排：选基准，分左右，递归
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x <= pivot);
  const right = arr.slice(1).filter(x => x > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

## Flex固定+自适应 | 生/熟/秒: 
固定一侧设 width，另一侧 flex:1 填满剩余。万能搭配。
```css
.container { display: flex; }
.fixed { width: 200px; }
.adaptive { flex: 1; }
```

## lodash get | 生/熟/秒: 
路径字符串转数组，逐层取值，取不到返默认值。注意 `[0]` 转 `.0`。
```js
function get(obj, path, defaultVal) {
  const keys = Array.isArray(path) ? path : path.replace(/\[(\d+)]/g, '.$1').split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return defaultVal;
  }
  return result;
}
```

## getType 类型判断 | 生/熟/秒: 
Object.prototype.toString 是最准确的类型判断，typeof 区分不了 null/array/date。
```js
function getType(val) {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
  // "number" / "string" / "array" / "null" / "regexp" / "date" ...
}
```
