## 1~10 【顶级高频 · 闭眼秒写】

## 防抖 debounce | 生/熟/秒: 
延迟执行，重复触发就重置定时器。三步：timer → clearTimeout → setTimeout。
```js
function debounce(fn, delay) {
  let timer; // 闭包保存定时器ID
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args); // 箭头函数继承外层this
    }, delay);
  };
}
```

## 节流 throttle | 生/熟/秒: 
间隔内只执行一次。记录上次时间戳，差值 >= 间隔才执行。
```js
function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

## 深拷贝 deepClone | 生/熟/秒: 
递归复制，WeakMap 处理循环引用。三步：判断基本类型 → 创建容器 → 递归赋值。
```js
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj); // 处理循环引用
  let clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], map);
    }
  }
  return clone;
}
```

## Promise 完整实现 | 生/熟/秒: 
三状态 + callbacks 队列 + then 返回新 Promise 实现链式调用。
```js
class MyPromise {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.callbacks = [];
    const resolve = (value) => {
      if (this.status !== 'pending') return;
      this.status = 'fulfilled';
      this.value = value;
      setTimeout(() => this.callbacks.forEach(cb => cb.onFulfilled(value)));
    };
    const reject = (reason) => {
      if (this.status !== 'pending') return;
      this.status = 'rejected';
      this.value = reason;
      setTimeout(() => this.callbacks.forEach(cb => cb.onRejected(reason)));
    };
    try { executor(resolve, reject); } catch (e) { reject(e); }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = {
        onFulfilled: val => {
          try { resolve(onFulfilled(val)); } catch (e) { reject(e); }
        },
        onRejected: err => {
          try { resolve(onRejected(err)); } catch (e) { reject(e); }
        }
      };
      if (this.status === 'pending') this.callbacks.push(handle);
      else if (this.status === 'fulfilled') handle.onFulfilled(this.value);
      else handle.onRejected(this.value);
    });
  }
}
```

## 数组去重 | 生/熟/秒: 
Set 一行搞定；filter + indexOf 是手写思路。
```js
const unique = arr => [...new Set(arr)];
const unique2 = arr => arr.filter((v, i) => arr.indexOf(v) === i);
```

## 数组扁平化 flat | 生/熟/秒: 
reduce + concat + 递归。
```js
function flatten(arr) {
  return arr.reduce((acc, val) =>
    acc.concat(Array.isArray(val) ? flatten(val) : val), []
  );
}
```

## 数组方法实现 map/filter/reduce | 生/熟/秒: 
循环 + 回调，注意传入 (item, index, array) 三个参数。
```js
Array.prototype.myMap = function (fn) {
  let res = [];
  for (let i = 0; i < this.length; i++) res.push(fn(this[i], i, this));
  return res;
};

Array.prototype.myFilter = function (fn) {
  let res = [];
  for (let i = 0; i < this.length; i++) if (fn(this[i], i, this)) res.push(this[i]);
  return res;
};

Array.prototype.myReduce = function (fn, init) {
  let acc = init === undefined ? this[0] : init;
  let start = init === undefined ? 1 : 0;
  for (let i = start; i < this.length; i++) acc = fn(acc, this[i], i, this);
  return acc;
};
```

## call/apply/bind | 生/熟/秒: 
核心：把函数挂到 ctx 上调用实现 this 绑定。先写 call，apply/bind 基于它改。
```js
Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx || globalThis;
  const key = Symbol();
  ctx[key] = this;
  const res = ctx[key](...args);
  delete ctx[key];
  return res;
};

Function.prototype.myApply = function (ctx, args) {
  return this.myCall(ctx, ...(args || []));
};

Function.prototype.myBind = function (ctx, ...args) {
  const fn = this;
  return function (...newArgs) {
    return fn.apply(this instanceof fn ? this : ctx, [...args, ...newArgs]);
  };
};
```

## new/instanceof | 生/熟/秒: 
new：创建对象 → 连原型 → 执行构造函数 → 判断返回值。instanceof：沿原型链找 prototype。
```js
function myNew(constructor, ...args) {
  let obj = {};
  obj.__proto__ = constructor.prototype;
  const res = constructor.apply(obj, args);
  return typeof res === 'object' && res !== null ? res : obj;
}

function myInstanceof(obj, constructor) {
  let proto = obj.__proto__;
  while (proto) {
    if (proto === constructor.prototype) return true;
    proto = proto.__proto__;
  }
  return false;
}
```

## 继承 | 生/熟/秒: 
ES5 寄生组合：Parent.call(this) + Object.create(Parent.prototype)。ES6 直接 extends + super。
- ES5 原型链继承
```js
function Parent() { this.name = 'parent'; }
Parent.prototype.say = function () { console.log(this.name); };

function Child() { Parent.call(this); } // 继承实例属性
Child.prototype = Object.create(Parent.prototype); // 继承原型方法
Child.prototype.constructor = Child;
```
- ES6 class 继承
```js
class Parent {
  constructor() { this.name = 'parent'; }
  say() { console.log(this.name); }
}
class Child extends Parent {
  constructor() { super(); }
}
```
