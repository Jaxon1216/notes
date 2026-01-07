## day1DOM元素获取与操作
- DOM对象，DOM树
- 获取`querySelectorALL`,`queryselector`
- 属性`innerText`不解析标签,`innnerHTML`解析标签
- `style`属性,宽高背景色等
- 类名或者`classList`控制css，追加类名，`add,remove,toggle(classname)`
- 表单属性`value` ,`type`
- 自定义属性`data-id`,`对象.dataset.id`，获取的时候别忘记`#`号
- 间歇函数`setInterval`,m级别单位set对应clear
- 案例：轮播图定时版，注意li标签下标从1开始 

## day2DOM事件基础
- 事件监听`addEventListener`
- 事件类型:`click,mouseenter,mouseleave`,表单`focus,blur`,键盘`Keydown,keyup`,表单输入触发`input`
- 事件对象：回调函数的第一个参数，一般命名`event,ev,e`比如
```JavaScript
元素.addEventListener(`click`,fuction(e){

})
```
> 部分属性
> - type,clientX,clientY,offset/offsetY,key

- 环境对象this
- 回调函数
- tab栏目切换案例：
    - `href = javascript:;`
    - a标签专门用来存图片
    - `querySelectorALL`得到伪数组，有下标


## day3DOM进阶
1. 表单全选反选案例：
    - 如果点了大框框那用循环给所有小框打true or false，对于大框框绑定点击事件，函数：`cks[i].checked = checkedAll.checked//or this.checked`
    - css伪类选择器，`.ck:checked`，只选择了被勾选的复选框,所以小复选框的状态都被勾了，那就大框也true
    ```JavaScript
    for..
        cks[i].addEventListener('click',function(){
        checkAll.checked = document.querySelectorAll('.ck:checked').length === cks.length;
        //小框框选满了就给大框框打上true
        })
2. 事件冒泡
- 当一个元素的事件被触发时，同样的事件会被依次在祖先元素被触发
- 事件冒泡的必要性：

3. 事件委托
- 减少注册提升性能，给父元素
- 找到真正触发的元素`e.target`,其属性有个`tagName`
案例：
```JavaScript
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
  const ul = document.querySelector('#tabs')
  const items = document.querySelectorAll('#contents .item')

  // 事件委托：事件绑定在 ul 上
  ul.addEventListener('click', function (e) {
    // 只处理 a 标签
    if (e.target.tagName !== 'A') return

    // tab 切换（排他）
    document.querySelector('#tabs .active').classList.remove('active')
    e.target.classList.add('active')

    // 内容切换
    const i = +e.target.dataset.id
    document.querySelector('#contents .active').classList.remove('active')
    items[i].classList.add('active')
  })
</script>
//这就是事件委托，一个监听器，处理所有 a
```
- 在事件委托中，e.target 可以是 this（或 e.currentTarget）内部的任意后代元素——包括子元素、孙子元素、曾孙元素。
- 采用事件委托，将 click 事件绑定在父元素 ul 上，利用事件冒泡机制在回调中通过 e.target 获取真实触发元素。通过判断 tagName 过滤事件源，并借助 data-id 建立 tab 与内容区的映射关系，使用排他思想完成 tab 切换。
4. 阻止冒泡 
- 需要阻止什么时间传递就给这个区域最大的盒子注册该事件`e.stopPropagation()`
5. 阻止元素默认行为
```JavaScript
dom.addEventListener('submit',function(e){
  e.preventDefault();
})
```
6. 页面加载
- `scrollWidth,scrollLeft,scrollTop,scrollHeight`,可读写，无单位
```JavaScript
document.documentElement.scrollTop = 800
window.addEventListener('scroll',function(){
  const n = document.documentElement.scrollTop//中间是返回html标签，body就直接是body
})
```
- 返回顶部两种方法，一是`document.documentElement.scrllTop = 0`, 二是`window.scrollTo(0,0)`

7. client 家族
- resize事件
- 获取可视宽高offsetWidth,offsetHeight
- offsetLeft/Top 是只读属性，受定位影响，看最近有定位的祖先元素


8. 电梯导航案例
- 初次点击没有可移除的`active`:获取A，判断再移除，没有就null
- 小盒子和大盒子有类似的自定义属性；
```JavaScript
const elevator = document.querySelector('.xtx-elevator-list')

elevator.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    // 切换 active
    document.querySelector('.xtx-elevator-list .active')?.classList.remove('active')
    e.target.classList.add('active')

    // 滚动到对应楼层
    const index = e.target.dataset.name
    const floorTop = document.querySelector(`.xtx_goods_${index}`).offsetTop
    document.documentElement.scrollTop = floorTop
  }
})

```
-  滚动条丝滑滚动
```css
html {
  scroll-behavior: smooth;
}
```
- 页面滚动，根据大盒子，改动小盒子的高亮
```JavaScript
window.addEventListener('scroll',function(){
  const old = document.querySelector('... .active')
  if(old) old.classList.remove('active')
  ...
  if .. scrollTop >= a.offsetTop && ..< b.offsetTop{
    ..selector('[data-name=new]').classList.add('active')//属性选择器
  }
  })
```
- 属性选择器
```html
...
input[type=text] {
  ...
}
<input type = "text" value = "123" ...>...
<input type = "password">
...
slector..('input[value]')
```



## day4DOM节点&移动端滑动

1. 日期对象
- 实例化`const date = new date()`;
  - 实例化之后可以用方法`get`+`Fullyear`/`Month`/`Date`/`Day`/`Hours`/`Minutes`/`Seconds`,边界从0开始；
  - 老外星期0就是星期天
  - 借助三目运算符，加上`+`号的隐式转换来自动补零`'0'`;
  - 定时器来自动刷新，隔一秒调用一次
  - tolocal系列函数
- 时间戳，直接隐式转换`+new date()`/实例化之后`dom.getTime()`/当前`dom.now()`
  - 倒计时涉及`setInterval`
  - 注意是ms级别，不要忘记`/1000`
  - 定时器前面调用一下获取时间的函数可以取消默认数值

2. 节点操作
- DOM节点
  - 元素节点：所有标签，主要操作这个，增删改查
  - 属性节点：链接，id，calss
  - 文本节点
- 查找节点，基于dom树呈现的关系
  - parentNode，跟链表里的`cur->next`差不多
  - 子节点`childNodes`/一般用`children`但是不是节点，得到的是**伪数组**
  - 兄弟节点`nextElementSibiling`，也可以改成`previous`
- 创建节点`document.createElement('div')`
  - `father.appendChild(son)`,`father.insertBefore(son,beforewhich?)`
  - 应用：之前做的学成在线案例，现在不需要在html里面画盒子了，可以直接把数组搞到数组，for循环到length，创建盒子
```JavaScript
// 1. 获取ul元素
const ul = document.querySelector('.box-bd ul')

// 2. 遍历数据数组
for (let i = 0; i < data.length; i++) {
    // 创建li元素
    const li = document.createElement('li')
    
    // 使用模板字符串填充内容
    li.innerHTML = `
        <a href="#">
            <img src=${data[i].src} alt="">
            <h4>${data[i].title}</h4>
            <div class="info">
                <span>高级</span> • <span>${data[i].num}</span>人在学习
            </div>
        </a>
    `
    
    // 将li添加到ul中
    ul.appendChild(li)
}
```
我的疑问：怎么确定下来每行多少个盒子？
```css
/* 容器设置 */
.box-bd ul {
    width: 1225px;  /* ul的宽度 */
}

.box-bd ul li {
    float: left;    /* 左浮动 */
    width: 228px;   /* 每个li的固定宽度 */
    margin-right: 15px;  /* 右侧间距 */
    margin-bottom: 15px; /* 底部间距 */
}
```

- 克隆与删除节点
  - `ul.appendChild(ul.children[0].cloneNode(true))`如果默认不写true，是浅克隆，只拿过来标签，
  - `removeChild(child)`

3. M端（mobile）事件
- `touchstart`/`touchend`/
- [www.swiper.com.cn](https://www.swiper.com.cn)
  - 选-下载-看文档-引入-调试

4. 案例：
- 录入模块：form，表单验证
  - 阻止submit事件，因为点击提交不需要跳转，button点击会冒泡到表单？否则页面刷新,数据直接丢失
  - 表单`reset`
  - 有一个空 → 整个提交失败 return 直接终止函数
```JavaScript
info.addEventListener('submit', function (e) {})
e.preventDefault()
for (...) {
  if (items[i].value === '') {
    return alert('输入内容不能为空')
  }
}
```
- 渲染模块：手写渲染函数，因为增加和删除都需要渲染
  - 清空`tbody`
  - 循环，模版字符串`tr.innerHTML`，对象属性
  - `tbody.appendChild(tr)`
  - 调用函数
```JavaScript
function render() {
  tbody.innerHTML = ''
  for (...) {
    const tr = document.createElement('tr')
    tr.innerHTML = `...`
    tbody.appendChild(tr)
  }
}
```
- 删除模块：
```html
<a data-id=${i}>删除</a>
```
- 事件委托:因为删除按钮是 动态生成的，不能提前给每个 a 绑定事件
```JavaScript
tbody.addEventListener('click', ...)//跟day3的电梯导航差不多
arr.splice(e.target.dataset.id, 1)
render()
```

## day5BOM
1. window对象
- `setTimeout(fn,time)`赋值返回一个🆔 /`clearTimeout(time)`
- JS执行机制
  - V8引擎，JS解析器
  - 单线程，同一时间只做一件事
  - 同步和异步，执行各个流程的顺序与排列顺序一致/不一致；
  -  同步任务，执行栈；异步任务，添加到任务队列中，通过回调函数实现，第一种事件click，resize等，第二种资源加载load，error，第三种定时器
  - JS里面没有调用栈
  - 先执行执行栈中的同步任务，再执行任务队列的异步任务；被读取的异步任务结束等待状态进入执行栈开始执行；成为事件循环
- location对象
  - 实现定时跳转`location.href`赋值操作
  - `search`属性,比如拿到提交表单后的`?`后面的内容
  - `location.hash`取html后面的`#`后面的内容
  - `location.reload(true)`方法
- navigator对象
  - 获取浏览器信息，`userAgent`属性，比如以下立即执行函数
```JavaScript
// 检测 userAgent（浏览器信息）
    !(function () {
      const userAgent = navigator.userAgent
      // 验证是否为Android或iPhone
      const android = userAgent.match(/(Android);?[\s\/]+([\d.]+)?/)
      const iphone = userAgent.match(/(iPhone\sOS)\s([\d_]+)/)
      // 如果是Android或iPhone，则跳转至移动站点
      if (android || iphone) {
        location.href = 'http://m.itcast.cn'
      }
    })();
    // !(function () { })();
    !function () { }()
```
通过立即执行函数，在页面加载时检测浏览器设备类型，并根据 userAgent 判断是否为移动端，从而实现 PC / 移动端页面自动跳转，同时体现了作用域隔离、正则匹配、浏览器对象模型和工程化写法。
````md
### IIFE 前为什么要加 ; 或 !

#### 问题
JS 有自动分号机制（ASI），但**不可靠**。  
如果上一行没分号，而下一行以 `(` 开头，JS 会把两行当成一行解析。

```js
var a = 10
(function () {})()   // ❌ 会被当成：10(...)
````
#### 解决
在 IIFE 前**主动断句**：
```js
var a = 10;
(function () {})()   // ✅ 分号断开
```
或使用一元运算符：
```js
var a = 10
!function () {}()    // ✅ 隐形分号，强制隔离
```
#### 结论
`;` 或 `!` 的唯一作用：
**防止 IIFE 被解析为上一行代码的继续**
- history对象
  - `back()`/`foward()`/`go`

2. 本地存储
- 差不多就是`<string,string>`类型的`unordered_map`
要记住的:
```js
localStorage.setItem(key, value)   // 增 / 改
localStorage.getItem(key)          // 查
localStorage.removeItem(key)       // 删
localStorage.clear()               // 全删
```
| 存储方式           | 是否持久     | 作用范围   |
| -------------- | -------- | ------ |
| localStorage   | ✅ 持久     | 同一域名   |
| sessionStorage | ❌ 关标签页失效 | 当前标签页  |
| cookie         | 可配置      | 可随请求发送 |


3. localStorage 存储复杂数据类型（对象 / 数组）

#### 核心限制
localStorage **只能存 string**，不能直接存对象或数组。

```js
localStorage.setItem('obj', obj) // ❌ "[object Object]"
```

#### 正确做法：JSON 序列化

#### 存（对象 → 字符串）

```js
localStorage.setItem('obj', JSON.stringify(obj))
```

#### 取（字符串 → 对象）

```js
const str = localStorage.getItem('obj')
const data = JSON.parse(str)
```

### 固定流程

```txt
对象 → JSON.stringify → localStorage
localStorage → JSON.parse → 对象
```

4. 数组map,join
- map可以把原元素改变值,`return ele + ...`,
- join可以把数组返回字符串，默认有`,`，可以改`

5. 综合案例
- DOM元素获取模块
```js
// 获取表格主体
const tbody = document.querySelector('tbody')

// 获取表单和表单字段
const info = document.querySelector('.info')
const items = info.querySelectorAll('[name]')//这个是
```

- 渲染模块
```js
const trArr = arr.map(function(item, i){//这个item就相当于cpp中的(auto & x : v）中的x;map会循环遍历，但是会返回新数组；
  return `
    <tr>
      <td>${item.stuId}</td>
      <td>${item.uname}</td>
      <td>${item.age}</td>
      <td>${item.gender}</td>
      <td>${item.salary}</td>
      <td>${item.city}</td>
      <td>
        <a href="javascript:" data-id=${i}>删除</a>
      </td>
    </tr>
  `
})

```
- 录入模块
```js
info.addEventListener('submit', function (e) {
  // 阻止表单默认提交行为
  e.preventDefault()
  
  // 创建新学生对象
  const obj = {}
  
  // 注意，生成序号：如果数组不为空，取最后一个学号+1，否则从1开始
  obj.stuId = arr.length ? arr[arr.length - 1].stuId + 1 : 1
  
// 遍历表单字段，收集数据并进行非空验证
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.value === '') {
      return alert('输入内容不能为空')
    }
    // 动态为对象添加属性
    obj[item.name] = item.value
  }
  // 将新数据添加到数组
  arr.push(obj)
  // 保存到本地存储
  localStorage.setItem('student-data', JSON.stringify(arr))
  // 重新渲染页面
  render()
  // 重置表单
  this.reset()
  ```

  - 删除模块
```js
tbody.addEventListener('click', function (e) {
  if (e.target.tagName === 'A') {
    // 获取要删除的数据索引（通过 data-id 属性）
    const index = e.target.dataset.id
    
    // 从数组中删除对应数据
    arr.splice(index, 1)
    
    // 更新本地存储
    localStorage.setItem('student-data', JSON.stringify(arr))
    
    // 重新渲染页面
    render()
  }
})
```


## day6
### 正则，元字符
#### 一个用户名/账号校验的经典前端场景：

用户在 input 中输入内容
失焦（blur）时触发校验
用正则判断是否合法
合法 → 绿色提示
不合法 → 红色提示

```js
const reg = /^[a-zA-Z0-9-_]{6,16}$/
```
| 符号  | 含义            |
| --- | ------------- |
| `^` | 匹配**字符串开始位置** |
| `$` | 匹配**字符串结束位置** |

- 正则的落地
```js
input.addEventListener('blur', function () {
    if (reg.test(this.value)) {
        span.innerHTML = '输入正确'
        span.className = 'right'
    } else {
        span.innerHTML = '请输入6~16位的英文数字下划线'
        span.className = 'error'
    }
})
```

### 综合案例
小兔鲜注册界面；
- 正则检测
```js
function verifyName() {
  const span = username.nextElementSibling // 获取输入框后的提示信息标签
  const reg = /^[a-zA-Z0-9-_]{6,10}$/      // 定义正则规则

  // 核心方法：reg.test() 返回 true/false
  if (!reg.test(username.value)) {
    span.innerText = '输入不合法,请输入6~10位'
    return false // 校验失败，告诉后面不要提交
  }
  
  span.innerText = '' // 校验成功，清空提示
  return true
}
```
- toggle
```js
const queren = document.querySelector('.icon-queren')
queren.addEventListener('click', function () {
  // 这里的 this 指向被点击的这个图标
  this.classList.toggle('icon-queren2')
})
```
- 提交拦截
```js
form.addEventListener('submit', function (e) {
  // 1. 拦截协议勾选
  if (!queren.classList.contains('icon-queren2')) {
    alert('请勾选同意协议')
    e.preventDefault() // 核心：阻止表单跳转/提交
  }

  // 2. 聚合校验：只要有一个返回 false，就阻止提交
  // 利用了逻辑非 (!) 和函数返回值
  if (!verifyName()) e.preventDefault()
  if (!verifyPhone()) e.preventDefault()
  if (!verifyCode()) e.preventDefault()
  if (!verifyPwd()) e.preventDefault()
  if (!verifyConfirm()) e.preventDefault()
})
```
## 阶段案例，几个模块
- h5新特性:require



### 模块一：顶部导航栏自动划出（滑动监听）

```js
(function () {
  const sticky = document.querySelector('.sticky');
  const header = document.querySelector('.xtx_header .wrapper');

  const top = header.offsetTop + header.clientHeight;

  window.addEventListener('scroll', function () {
    const scrollTop = document.documentElement.scrollTop;
    sticky.style.top = scrollTop >= top ? '0px' : '-80px';
  });
})();
```
### 模块二：放大镜效果
- 事件委托
- hover 小图,中图切换,大图背景切换
```js
const small = document.querySelector('.small');
const middle = document.querySelector('.middle');
const large = document.querySelector('.large');

small.addEventListener('mouseover', function (e) {
  if (e.target.tagName === 'IMG') {
    this.querySelector('.active').classList.remove('active');
    e.target.parentNode.classList.add('active');

    middle.querySelector('img').src = e.target.src;
    large.style.backgroundImage = `url(${e.target.src})`;
  }
});
```

- 中图/大图的显示与隐藏
```js
let timer = null;

function show() {
  clearTimeout(timer);
  large.style.display = 'block';
}

function hide() {
  timer = setTimeout(() => {
    large.style.display = 'none';
  }, 200);
}

middle.addEventListener('mouseenter', show);
middle.addEventListener('mouseleave', hide);
large.addEventListener('mouseenter', show);
large.addEventListener('mouseleave', hide);
```
### 模块三：遮罩层移动 + 放大图联动（几何计算）
- 遮罩跟随鼠标
- 限制移动边界
- 大图按比例反向移动
```js
middle.addEventListener('mousemove', function (e) {
  let x = e.pageX - middle.getBoundingClientRect().left;
  let y = e.pageY - middle.getBoundingClientRect().top - document.documentElement.scrollTop;

  let mx = Math.min(Math.max(x - 100, 0), 200);
  let my = Math.min(Math.max(y - 100, 0), 200);

  layer.style.left = mx + 'px';
  layer.style.top = my + 'px';

  large.style.backgroundPositionX = -2 * mx + 'px';
  large.style.backgroundPositionY = -2 * my + 'px';
});
```

### 模版：单选链
- matches
- ?.运算符
```js
container.addEventListener('click', function (e) {
  if (e.target.matches('span, img')) {
    container.querySelector('.active')?.classList.remove('active');
    //这个?.运算符：如果左边有值，就继续往下执行；如果是 null / undefined，立刻停下，不报错。
    e.target.classList.add('active');
  }
});
```

| 需求 / 判断场景   | `matches` 写法                               | `tagName` 能否做到 | 说明                                |   |      |
| ----------- | ------------------------------------------ | -------------- | --------------------------------- | - | ---- |
| 判断是否为某个标签   | `e.target.matches('span')`                 | ✅ 可以           | 两者都能，但 `matches` 更统一              |   |      |
| 判断多种标签      | `e.target.matches('span, img')`            | ❌ 不行           | `tagName` 只能一个个 `                 |   | ` 判断 |
| 判断带某个 class | `e.target.matches('.item')`                | ❌ 不行           | `tagName` 完全不涉及 class             |   |      |
| 标签 + class  | `e.target.matches('span.item')`            | ❌ 不行           | `tagName` 只能判断标签名                 |   |      |
| 判断是否有属性     | `e.target.matches('[data-id]')`            | ❌ 不行           | 属性是 CSS 选择器能力                     |   |      |
| 判断属性具体值     | `e.target.matches('[type="button"]')`      | ❌ 不行           | `tagName` 无法读取属性规则                |   |      |
| 判断层级关系      | `e.target.matches('li > a')`               | ❌ 不行           | 需要 CSS 结构选择器                      |   |      |
| 排除某些状态      | `e.target.matches('.item:not(.disabled)')` | ❌ 不行           | 逻辑判断能力更强                          |   |      |
| 判断当前状态      | `e.target.matches('.active')`              | ❌ 不行           | 状态通常由 class 表达                    |   |      |
| 事件委托通用判断    | `e.target.matches('.tab-item')`            | ❌ 不行           | 工程化事件委托核心用法                       |   |      |
| 结构调整后无需改 JS | ✅ 是                                        | ❌ 否            | `matches` 面向“规则”，`tagName` 面向“结构” |   |      |
