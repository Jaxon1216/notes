# Web APIs 与 DOM 操作

> **本页关键词**：DOM 获取、事件监听、事件冒泡、事件委托、BOM、本地存储、正则校验

---

## 一、DOM 元素获取与操作

### 获取元素

- `querySelector`：返回单个元素
- `querySelectorAll`：返回伪数组

### 内容与样式

| 属性 / 方法 | 说明 |
|-------------|------|
| `innerText` | 不解析 HTML 标签 |
| `innerHTML` | 解析标签 |
| `style` | 读写行内样式（宽、高、背景色等） |
| `classList` | `add`、`remove`、`toggle(className)` |

### 表单与自定义属性

- 表单：`value`、`type`
- 自定义属性：`data-id`，通过 `元素.dataset.id` 获取（注意选择器中的 `#` 号）

### 定时器

```javascript
const id = setInterval(fn, ms);
clearInterval(id);
```

---

## 二、DOM 事件基础

### 事件监听

```javascript
元素.addEventListener('click', function (e) {
  // e 为事件对象
});
```

### 常用事件类型

| 类型 | 事件 |
|------|------|
| 鼠标 | `click`、`mouseenter`、`mouseleave` |
| 表单 | `focus`、`blur`、`input` |
| 键盘 | `keydown`、`keyup` |

### 事件对象常用属性

- `type`、`clientX`、`clientY`
- `offsetX`、`offsetY`
- `key`

### this 与回调函数

事件回调中 `this` 指向绑定事件的元素。

---

## 三、DOM 进阶：事件冒泡与委托

### 事件冒泡

子元素事件触发时，祖先元素上同类事件会依次被触发。

### 事件委托

将事件绑定到父元素，利用冒泡统一处理。通过 `e.target` 获取真实触发元素，`e.target.tagName` 可判断标签类型。

```javascript
<ul id="tabs">
  <li><a class="active" data-id="0" href="javascript:;">Tab 1</a></li>
  <li><a data-id="1" href="javascript:;">Tab 2</a></li>
  <li><a data-id="2" href="javascript:;">Tab 3</a></li>
</ul>

<div id="contents">
  <div class="item active">Content 1</div>
  <div class="item">Content 2</div>
  <div class="item">Content 3</div>
</div>

<script>
  const ul = document.querySelector('#tabs');
  const items = document.querySelectorAll('#contents .item');

  ul.addEventListener('click', function (e) {
    if (e.target.tagName !== 'A') return;

    document.querySelector('#tabs .active').classList.remove('active');
    e.target.classList.add('active');

    const i = +e.target.dataset.id;
    document.querySelector('#contents .active').classList.remove('active');
    items[i].classList.add('active');
  });
</script>
```

### 阻止冒泡与默认行为

```javascript
e.stopPropagation();  // 阻止冒泡
e.preventDefault();   // 阻止默认行为（如表单提交）
```

```javascript
dom.addEventListener('submit', function (e) {
  e.preventDefault();
});
```

### 滚动与 client 家族

- `scrollWidth`、`scrollLeft`、`scrollTop`、`scrollHeight` 可读写，无单位
- 返回顶部：`document.documentElement.scrollTop = 0` 或 `window.scrollTo(0, 0)`
- `resize` 事件、`offsetWidth` / `offsetHeight` 获取可视宽高
- `offsetLeft` / `offsetTop` 只读，受最近定位祖先影响

> **面试要点**：事件委托减少监听器数量，适合动态生成元素；`e.target` 可能是任意后代元素。

---

## 四、DOM 节点操作

### 节点类型

- 元素节点：标签，主要操作对象
- 属性节点：链接、id、class
- 文本节点

### 节点关系

| 属性 | 说明 |
|------|------|
| `parentNode` | 父节点 |
| `children` | 子元素集合（伪数组，非节点） |
| `childNodes` | 所有子节点 |
| `nextElementSibling` / `previousElementSibling` | 兄弟元素 |

### 创建与插入

```javascript
const div = document.createElement('div');
father.appendChild(son);
father.insertBefore(son, beforeWhich);
```

### 克隆与删除

```javascript
ul.appendChild(ul.children[0].cloneNode(true));  // true 为深克隆
father.removeChild(child);
```

### 动态渲染示例

```javascript
const ul = document.querySelector('.box-bd ul');
for (let i = 0; i < data.length; i++) {
  const li = document.createElement('li');
  li.innerHTML = `
    <a href="#">
      <img src=${data[i].src} alt="">
      <h4>${data[i].title}</h4>
      <div class="info">
        <span>高级</span> • <span>${data[i].num}</span>人在学习
      </div>
    </a>
  `;
  ul.appendChild(li);
}
```

---

## 五、日期对象与 BOM

### 日期对象

```javascript
const date = new Date();
date.getFullYear();
date.getMonth();   // 0 起
date.getDate();
date.getDay();     // 0 为周日
date.getHours();
date.getMinutes();
date.getSeconds();
```

时间戳：`+new Date()`、`date.getTime()`、`Date.now()`。单位为 ms。

### window 与定时器

- `setTimeout(fn, time)` 返回 id，`clearTimeout(id)`
- 执行机制：同步任务先入执行栈，异步任务入任务队列，事件循环处理

### location

- `location.href`：赋值实现跳转
- `location.search`：`?` 后查询串
- `location.hash`：`#` 后内容
- `location.reload(true)`：刷新

### navigator

- `navigator.userAgent`：浏览器信息，可用于设备检测

### history

- `back()`、`forward()`、`go(n)`

> **面试要点**：IIFE 前加 `;` 或 `!` 防止被解析为上一行延续；`var a = 10` 后直接跟 `(function(){})()` 会解析错误。

---

## 六、本地存储

### 基本 API

```javascript
localStorage.setItem(key, value);
localStorage.getItem(key);
localStorage.removeItem(key);
localStorage.clear();
```

| 方式 | 持久化 | 作用范围 |
|------|--------|----------|
| localStorage | 持久 | 同源 |
| sessionStorage | 关标签失效 | 当前标签页 |
| cookie | 可配置 | 可随请求发送 |

### 存储对象 / 数组

localStorage 仅能存字符串，需 `JSON.stringify` 和 `JSON.parse`：

```javascript
localStorage.setItem('obj', JSON.stringify(obj));
const data = JSON.parse(localStorage.getItem('obj'));
```

---

## 七、正则表达式

### 元字符示例

```javascript
const reg = /^[a-zA-Z0-9-_]{6,16}$/;
```

| 符号 | 含义 |
|------|------|
| `^` | 字符串开始 |
| `$` | 字符串结束 |

### 校验落地

```javascript
input.addEventListener('blur', function () {
  if (reg.test(this.value)) {
    span.innerHTML = '输入正确';
    span.className = 'right';
  } else {
    span.innerHTML = '请输入6~16位的英文数字下划线';
    span.className = 'error';
  }
});
```

### matches 与 tagName

`e.target.matches('span, img')` 支持多标签、class、属性选择器；`tagName` 只能判断单个标签名。

---

## 八、阶段案例要点

### 顶部导航栏滑出

```javascript
const top = header.offsetTop + header.clientHeight;
window.addEventListener('scroll', function () {
  const scrollTop = document.documentElement.scrollTop;
  sticky.style.top = scrollTop >= top ? '0px' : '-80px';
});
```

### 放大镜（事件委托 + hover）

- 小图 hover 切换中图、大图背景
- 中图 / 大图用 `mouseenter`、`mouseleave` 控制显示，加防抖避免闪烁

### 单选链

```javascript
if (e.target.matches('span, img')) {
  container.querySelector('.active')?.classList.remove('active');
  e.target.classList.add('active');
}
```
