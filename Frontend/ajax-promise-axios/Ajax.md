# 课程笔记：AJAX前端网络通信技术

![](../img/Ajax.svg)
## 一、HTTP协议基础

### 核心概念
HTTP（HyperText Transfer Protocol）超文本传输协议，是浏览器与Web服务器通信的规则约定。理解HTTP报文结构是掌握AJAX的基础。

**请求报文**由四部分组成：请求行（方法、URL、协议版本）、请求头（元数据）、空行（分隔符）、请求体（POST数据）。

**响应报文**同样包含：状态行（协议版本、状态码、状态文本）、响应头（元数据）、空行、响应体（实际数据）。

### 关键代码

```
请求报文格式：
POST  /s?ie=utf-8  HTTP/1.1 
Host: atguigu.com
Cookie: name=guigu
Content-type: application/x-www-form-urlencoded
User-Agent: chrome 83

username=admin&password=admin
```

```
响应报文格式：
HTTP/1.1  200  OK
Content-Type: text/html;charset=utf-8
Content-length: 2048
Content-encoding: gzip

<html><body>响应内容</body></html>
```

这段代码展示了HTTP通信的完整结构，请求行指明了请求方法和目标，请求头携带元数据，请求体包含提交的数据。响应报文则通过状态码告知请求结果，通过响应体返回数据。

### 📝 要点测验

<details>
<summary>HTTP常见状态码的含义及应用场景？</summary>

**状态码分类：**
- **200 OK**: 请求成功，这是最常见的成功响应
- **404 Not Found**: 请求的资源不存在，URL错误或资源已删除
- **403 Forbidden**: 服务器拒绝访问，通常是权限问题
- **401 Unauthorized**: 未授权，需要身份验证
- **500 Internal Server Error**: 服务器内部错误，代码异常

**面试要点：**
- 2xx表示成功，3xx表示重定向，4xx表示客户端错误，5xx表示服务器错误
- 实际开发中，判断成功通常用：`status >= 200 && status < 300`
</details>

<details>
<summary>GET和POST请求的主要区别？</summary>

**核心差异：**
1. **参数位置**: GET参数在URL中（?后面），POST参数在请求体中
2. **数据长度**: GET受URL长度限制（约2KB），POST理论上无限制
3. **安全性**: GET参数可见（URL中），POST相对隐蔽
4. **缓存**: GET请求会被浏览器缓存，POST不会
5. **语义**: GET用于获取数据（幂等），POST用于提交数据（非幂等）

**实践建议：**
- 查询、搜索等操作用GET
- 登录、注册、提交表单用POST
- 敏感信息必须用POST
</details>

## 二、Express服务器搭建

### 核心概念
Express是Node.js最流行的Web框架，提供简洁的API来创建服务器和路由。搭建AJAX测试环境的核心是理解路由的创建和跨域响应头的设置。

路由定义了服务器如何响应特定端点的请求。`app.get()`处理GET请求，`app.post()`处理POST请求，`app.all()`接收所有HTTP方法。

跨域资源共享（CORS）通过设置响应头`Access-Control-Allow-Origin`来告诉浏览器允许跨域访问。

### 关键代码

```javascript
const express = require('express');
const app = express();

// 创建GET路由
app.get('/server', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.send('HELLO AJAX');
});

// 接收所有类型的请求
app.all('/server', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.send('响应数据');
});

// 启动服务器
app.listen(8000, () => {
    console.log("服务已经启动, 8000 端口监听中....");
});
```

这段代码展示了Express的核心用法：引入模块、创建应用、定义路由、启动服务。关键点是设置CORS响应头，`*`表示允许所有源访问，生产环境应指定具体域名。

### 📝 要点测验

<details>
<summary>为什么需要设置Access-Control-Allow-Headers响应头？</summary>

**原因分析：**
当客户端使用`xhr.setRequestHeader()`设置自定义请求头时，浏览器会先发送预检请求（OPTIONS）询问服务器是否允许这些自定义头。如果服务器未设置`Access-Control-Allow-Headers`，浏览器会阻止实际请求。

**解决方案：**
```javascript
response.setHeader('Access-Control-Allow-Headers', '*');
// 或指定具体的头
response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

**实践要点：**
- 标准请求头（如Content-Type: application/x-www-form-urlencoded）不需要此设置
- 自定义请求头（如name, token等）必须设置
- 生产环境建议明确列出允许的头，而非使用`*`
</details>

<details>
<summary>app.get()和app.all()的使用场景区别？</summary>

**app.get(path, handler)**：
- 只处理GET请求
- 用于资源获取、查询操作
- 示例：获取用户列表、文章详情

**app.all(path, handler)**：
- 处理所有HTTP方法（GET、POST、PUT、DELETE等）
- 用于通用处理或测试接口
- 示例：统一的CORS处理、测试环境的万能接口

**最佳实践：**
- 生产环境应根据RESTful规范明确使用对应方法
- 测试环境可用app.all()简化配置
</details>

## 三、原生AJAX核心操作

### 核心概念
AJAX（Asynchronous JavaScript and XML）异步JavaScript和XML，实现无刷新页面更新数据的技术。核心对象是`XMLHttpRequest`，通过它可以在后台与服务器交换数据。

原生AJAX操作遵循固定的四步流程：创建XMLHttpRequest对象 → 初始化（设置请求方法和URL）→ 发送请求 → 监听状态变化处理响应。

`readyState`属性表示请求状态：0未初始化、1已打开、2已发送、3接收中、4完成。只有当`readyState === 4`且状态码在200-299之间时，才表示请求成功。

### 关键代码

**GET请求：**
```javascript
const xhr = new XMLHttpRequest();
// 参数拼接在URL后
xhr.open('GET', 'http://127.0.0.1:8000/server?a=100&b=200');
xhr.send();
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
        if(xhr.status >= 200 && xhr.status < 300){
            console.log(xhr.response); // 响应体
            console.log(xhr.status);   // 状态码
        }
    }
}
```

**POST请求：**
```javascript
const xhr = new XMLHttpRequest();
xhr.open('POST', 'http://127.0.0.1:8000/server');
// 设置请求头（必须在open之后，send之前）
xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
// 参数在send中传递
xhr.send('a=100&b=200&c=300');
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300){
        console.log(xhr.response);
    }
}
```

GET请求参数放在URL中，POST请求参数放在send()方法中。POST请求需要设置Content-Type请求头，标准格式为application/x-www-form-urlencoded。

### 📝 要点测验

<details>
<summary>为什么要判断xhr.readyState === 4？其他状态值代表什么？</summary>

**readyState状态值详解：**
- **0 (UNSENT)**: XMLHttpRequest对象已创建，但未调用open()
- **1 (OPENED)**: open()已调用，可以设置请求头
- **2 (HEADERS_RECEIVED)**: send()已调用，响应头已接收
- **3 (LOADING)**: 响应体下载中，responseText已有部分数据
- **4 (DONE)**: 请求完成，数据传输完毕或失败

**为什么判断4：**
只有状态4表示服务器响应完全接收完毕，此时xhr.response才包含完整数据。在状态3时数据可能不完整。

**实践技巧：**
现代开发中也可以用`xhr.onload`事件，它只在readyState为4且成功时触发，代码更简洁：
```javascript
xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status < 300){
        console.log(xhr.response);
    }
}
```
</details>

<details>
<summary>如果POST请求不设置Content-Type会怎样？</summary>

**影响分析：**
1. **请求仍能发送**: 浏览器不会阻止请求
2. **服务端解析问题**: 服务器不知道如何解析请求体数据
3. **默认值**: 如果不设置，某些浏览器会使用默认值`text/plain`

**常用Content-Type：**
- `application/x-www-form-urlencoded`: 表单默认格式（key1=value1&key2=value2）
- `application/json`: JSON格式数据
- `multipart/form-data`: 文件上传
- `text/plain`: 纯文本

**最佳实践：**
始终明确设置Content-Type，确保前后端对数据格式理解一致。发送JSON数据时：
```javascript
xhr.setRequestHeader('Content-Type','application/json');
xhr.send(JSON.stringify({name: 'zhangsan', age: 18}));
```
</details>

## 四、AJAX处理JSON数据

### 核心概念
JSON（JavaScript Object Notation）是轻量级数据交换格式，已成为前后端数据传输的事实标准。服务端使用`JSON.stringify()`将对象转为字符串，客户端使用`JSON.parse()`将字符串转为对象。

XMLHttpRequest提供了自动转换机制：设置`xhr.responseType = 'json'`后，服务器返回的JSON字符串会自动解析为JavaScript对象，无需手动调用JSON.parse()。

### 关键代码

**服务端返回JSON：**
```javascript
app.all('/json-server', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    const data = { name: 'atguigu', age: 18 };
    response.send(JSON.stringify(data)); // 转为字符串
});
```

**客户端接收JSON：**
```javascript
const xhr = new XMLHttpRequest();
// 设置响应体数据类型为json（自动转换）
xhr.responseType = 'json';
xhr.open('GET','http://127.0.0.1:8000/json-server');
xhr.send();
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300){
        // 方式1: 手动转换
        // let data = JSON.parse(xhr.response);
        // console.log(data.name);
        
        // 方式2: 自动转换（推荐）
        console.log(xhr.response.name); // 直接访问属性
    }
}
```

设置responseType为'json'后，xhr.response直接是JavaScript对象，无需手动解析。这是处理JSON的推荐方式，代码更简洁且不易出错。

### 📝 要点测验

<details>
<summary>为什么JSON成为前后端数据交换的主流格式？</summary>

**JSON优势：**
1. **轻量级**: 比XML更简洁，传输体积小
2. **易读性**: 接近自然语言，人类可读
3. **原生支持**: JavaScript原生支持，无需额外解析库
4. **跨语言**: 几乎所有编程语言都支持JSON
5. **结构清晰**: 支持对象和数组嵌套，表达能力强

**与XML对比：**
```xml
<!-- XML格式 -->
<user>
    <name>zhangsan</name>
    <age>18</age>
</user>
```
```json
// JSON格式
{"name": "zhangsan", "age": 18}
```

JSON体积更小，解析速度更快，已成为RESTful API的标准数据格式。
</details>

<details>
<summary>JSON.stringify()和JSON.parse()的注意事项？</summary>

**JSON.stringify(obj) - 对象转字符串：**
- undefined、函数会被忽略
- NaN、Infinity转为null
- Date对象转为ISO字符串
- 循环引用会报错

```javascript
JSON.stringify({name: 'test', fn: function(){}})
// 结果: {"name":"test"}  // 函数被忽略
```

**JSON.parse(str) - 字符串转对象：**
- 字符串必须是合法JSON格式
- 单引号、尾逗号都会导致解析失败
- 建议使用try-catch包裹

```javascript
try {
    const obj = JSON.parse(jsonString);
} catch(e) {
    console.error('JSON解析失败', e);
}
```

**实践建议：**
- 后端返回数据前务必验证JSON格式
- 前端接收后先检查数据完整性再使用
- 使用xhr.responseType='json'避免手动解析
</details>

## 五、AJAX高级特性

### 核心概念
在实际项目中，AJAX需要处理多种异常情况：IE浏览器缓存、网络超时、请求取消、重复请求等。掌握这些高级特性是开发健壮应用的关键。

**IE缓存问题**：IE浏览器会缓存GET请求结果，相同URL的请求直接返回缓存，导致数据不更新。解决方法是在URL后添加时间戳参数，使每次请求URL不同。

**超时处理**：通过`xhr.timeout`设置超时时间（毫秒），`xhr.ontimeout`监听超时事件。网络异常通过`xhr.onerror`监听。

**请求控制**：使用`xhr.abort()`可以取消正在进行的请求。结合标识变量可以实现防重复请求：检测到有未完成的请求时，先取消旧请求再发送新请求。

### 关键代码

**IE缓存解决：**
```javascript
const xhr = new XMLHttpRequest();
// 添加时间戳参数，确保URL每次不同
xhr.open("GET", 'http://127.0.0.1:8000/server?t=' + Date.now());
xhr.send();
```

**超时与网络异常：**
```javascript
const xhr = new XMLHttpRequest();
xhr.timeout = 2000; // 设置超时2秒
xhr.ontimeout = function(){
    alert("网络异常, 请稍后重试!");
};
xhr.onerror = function(){
    alert("你的网络似乎出了一些问题!");
};
xhr.open("GET", 'http://127.0.0.1:8000/delay');
xhr.send();
```

**防止重复请求：**
```javascript
let xhr = null;
let isSending = false; // 标识是否正在发送

button.onclick = function(){
    if(isSending) xhr.abort(); // 取消旧请求
    xhr = new XMLHttpRequest();
    isSending = true;
    xhr.open("GET", 'http://127.0.0.1:8000/delay');
    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            isSending = false; // 请求完成
        }
    }
}
```

IE缓存通过URL添加唯一标识解决；超时和网络异常分别用ontimeout和onerror监听；防重复请求用标识变量配合abort()方法。

### 📝 要点测验

<details>
<summary>为什么只有IE浏览器存在缓存问题？如何彻底解决？</summary>

**原因分析：**
IE浏览器（特别是IE6-IE10）对GET请求采用了激进的缓存策略。当发起相同URL的GET请求时，IE会直接返回缓存结果而不向服务器请求，即使服务端数据已更新。

**解决方案对比：**
1. **时间戳参数（推荐）**:
```javascript
xhr.open("GET", '/api/data?t=' + Date.now());
```

2. **随机数参数**:
```javascript
xhr.open("GET", '/api/data?r=' + Math.random());
```

3. **服务端设置响应头**:
```javascript
response.setHeader('Cache-Control', 'no-cache');
response.setHeader('Pragma', 'no-cache');
```

4. **改用POST请求**:
POST请求不会被缓存，但语义不符合RESTful规范。

**最佳实践：**
- 对于需要实时数据的接口，前端添加时间戳参数
- 服务端配置合理的Cache-Control响应头
- 现代浏览器（Chrome、Firefox、Edge）已不存在此问题
</details>

<details>
<summary>防重复请求的实现原理和应用场景？</summary>

**实现原理：**
使用标识变量`isSending`记录请求状态，发送新请求前检查该变量：
- 如果为true（有未完成的请求），先调用`xhr.abort()`取消旧请求
- 然后创建新请求，将isSending设为true
- 请求完成时（readyState=4），将isSending设为false

**核心逻辑：**
```javascript
if(isSending) xhr.abort(); // 防重复的关键
```

**应用场景：**
1. **搜索框实时搜索**: 用户快速输入时，取消之前的搜索请求
2. **按钮防重复点击**: 防止用户连续点击提交按钮
3. **滚动加载**: 滚动加载更多时，避免多次触发加载请求
4. **自动保存**: 编辑器自动保存时，只保留最新的保存请求

**进阶方案：**
实际项目中常使用防抖（debounce）或节流（throttle）函数优化：
```javascript
// 防抖：延迟执行，频繁触发只执行最后一次
function debounce(fn, delay) {
    let timer;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, arguments), delay);
    }
}
```

**面试要点：**
- 防重复请求：多次请求只保留最后一次（abort方式）
- 防抖：延迟执行，只执行最后一次
- 节流：固定时间间隔执行一次
</details>

<details>
<summary>xhr.abort()调用后会发生什么？</summary>

**调用效果：**
1. **请求立即终止**: 如果请求正在进行，浏览器会立即中断连接
2. **readyState变为4**: abort后readyState会变为UNSENT(0)或DONE(4)
3. **触发abort事件**: 会触发xhr.onabort事件（如果有设置）
4. **status变为0**: 响应状态码变为0

**代码示例：**
```javascript
const xhr = new XMLHttpRequest();
xhr.open("GET", 'http://example.com/api');
xhr.send();

xhr.onabort = function(){
    console.log('请求已取消');
};

xhr.onreadystatechange = function(){
    console.log('readyState:', xhr.readyState);
    console.log('status:', xhr.status); // 取消后为0
};

// 1秒后取消请求
setTimeout(() => xhr.abort(), 1000);
```

**注意事项：**
- abort()可以多次调用，重复调用不会报错
- 已完成的请求调用abort()无效
- abort()不会阻止onreadystatechange触发
- 取消后的xhr对象可以重新open()使用

**应用场景：**
- 组件卸载时取消未完成的请求（React/Vue中常见）
- 用户切换页面时取消当前页面的请求
- 请求超时后主动取消
</details>


## 六、Axios现代化AJAX库

### 核心概念
Axios是目前最流行的HTTP客户端库，基于Promise设计，支持浏览器和Node.js环境。相比jQuery AJAX，Axios专注于HTTP请求，体积更小（约13KB），功能更强大。

Axios提供了三种调用方式：`axios.get()`、`axios.post()`和通用方法`axios()`。所有方法都返回Promise，支持async/await语法。

响应对象结构统一为`{data, status, statusText, headers, config}`，data属性包含服务器返回的数据，已自动解析JSON。

### 关键代码

```javascript
// 配置默认baseURL
axios.defaults.baseURL = 'http://127.0.0.1:8000';

// GET请求
axios.get('/server', {
    params: {id: 100, vip: 7},  // URL参数
    headers: {name: 'atguigu'}   // 请求头
}).then(response => {
    console.log(response.data);   // 响应体数据
    console.log(response.status); // 状态码
});

// POST请求
axios.post('/server', 
    {username: 'admin', password: 'admin'}, // 请求体数据
    {
        params: {id: 200},      // URL参数
        headers: {token: 'xxx'}  // 请求头
    }
).then(response => {
    console.log(response.data);
});

// 通用方法
axios({
    method: 'POST',
    url: '/server',
    params: {vip: 10},          // URL参数
    data: {username: 'admin'},   // 请求体参数
    headers: {a: 100},           // 请求头
    timeout: 5000                // 超时时间
}).then(response => {
    console.log(response.status);
    console.log(response.data);
}).catch(error => {
    console.log('请求失败', error);
});
```

Axios的核心优势是Promise风格，支持.then()和.catch()链式调用，也可以使用async/await。响应数据在response.data中，已自动解析JSON。

### 📝 要点测验

<details>
<summary>Axios的params和data参数有什么区别？</summary>

**核心区别：**

**params参数：**
- 会被拼接到URL后面作为查询字符串
- 适用于GET、DELETE等请求
- 格式：`?key1=value1&key2=value2`

```javascript
axios.get('/api/users', {
    params: {id: 123, page: 1}
});
// 实际请求: /api/users?id=123&page=1
```

**data参数：**
- 会放在请求体（body）中
- 适用于POST、PUT、PATCH等请求
- 默认序列化为JSON格式

```javascript
axios.post('/api/users', {
    name: 'zhangsan',
    age: 18
});
// 请求体: {"name":"zhangsan","age":18}
```

**同时使用：**
POST请求可以同时使用params和data：
```javascript
axios.post('/api/users',
    {name: 'zhangsan'},  // 请求体
    {params: {type: 'new'}} // URL参数
);
// 请求: POST /api/users?type=new
// 请求体: {"name":"zhangsan"}
```

**面试要点：**
- params → URL查询参数（所有请求都可用）
- data → 请求体数据（POST/PUT/PATCH使用）
- GET请求的参数应该用params而非data
</details>

<details>
<summary>Axios如何进行全局配置和拦截器设置？</summary>

**全局配置：**
```javascript
// 基础URL
axios.defaults.baseURL = 'https://api.example.com';
// 超时时间
axios.defaults.timeout = 5000;
// 默认请求头
axios.defaults.headers.common['Authorization'] = 'Bearer token';
axios.defaults.headers.post['Content-Type'] = 'application/json';
```

**请求拦截器：**
在请求发送前统一处理（如添加token）：
```javascript
axios.interceptors.request.use(
    config => {
        // 发送请求前的处理
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // 请求错误处理
        return Promise.reject(error);
    }
);
```

**响应拦截器：**
在接收响应后统一处理（如统一错误处理）：
```javascript
axios.interceptors.response.use(
    response => {
        // 响应成功处理
        return response.data; // 只返回data部分
    },
    error => {
        // 响应错误处理
        if(error.response.status === 401){
            // 跳转到登录页
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

**创建实例：**
针对不同API创建不同配置的实例：
```javascript
const instance1 = axios.create({
    baseURL: 'https://api1.example.com',
    timeout: 3000
});

const instance2 = axios.create({
    baseURL: 'https://api2.example.com',
    timeout: 5000
});
```

**实际应用场景：**
- 请求拦截器：添加token、loading动画、请求日志
- 响应拦截器：统一错误处理、数据转换、关闭loading
- 创建实例：多个后端服务、不同超时配置
</details>

<details>
<summary>为什么Axios比jQuery AJAX更受欢迎？</summary>

**Axios优势对比：**

1. **基于Promise设计**:
```javascript
// Axios - 支持async/await
async function getUser(){
    const res = await axios.get('/api/user');
    return res.data;
}

// jQuery - 回调函数
$.ajax({
    url: '/api/user',
    success: function(data){
        // 回调地狱
    }
});
```

2. **体积更小**:
- Axios: ~13KB（仅HTTP功能）
- jQuery: ~30KB（包含DOM操作等）

3. **自动JSON转换**:
```javascript
// Axios自动转换
axios.post('/api', {name: 'test'});
// 自动转为JSON: {"name":"test"}

// jQuery需要手动处理
$.ajax({
    data: JSON.stringify({name: 'test'}),
    contentType: 'application/json'
});
```

4. **拦截器机制**:
Axios提供请求/响应拦截器，jQuery没有。

5. **防御XSRF**:
Axios内置XSRF防护，自动添加token。

6. **浏览器和Node.js通用**:
Axios可在Node.js环境使用，jQuery只能在浏览器。

7. **更好的错误处理**:
```javascript
axios.get('/api').catch(error => {
    console.log(error.response.status);
    console.log(error.response.data);
});
```

**现代项目推荐：**
- React/Vue/Angular项目首选Axios
- 不需要jQuery的DOM操作功能
- TypeScript支持更好
- 社区活跃，持续更新
</details>

## 七、Fetch原生API

### 核心概念
Fetch是浏览器原生提供的网络请求API，是XMLHttpRequest的现代替代品。Fetch基于Promise设计，语法简洁，无需引入任何库。

Fetch的调用方式为`fetch(url, options)`，返回Promise。需要注意的是，Fetch需要**两次.then()**：第一次处理响应对象，调用`response.json()`或`response.text()`；第二次获取实际数据。

与XMLHttpRequest不同，Fetch只有网络故障才会reject，HTTP错误状态（如404、500）仍然会resolve，需要手动检查`response.ok`属性。

### 关键代码

```javascript
fetch('http://127.0.0.1:8000/server?vip=10', {
    method: 'POST',              // 请求方法
    headers: {                   // 请求头
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token'
    },
    body: JSON.stringify({       // 请求体（必须是字符串）
        username: 'admin',
        password: 'admin'
    })
})
.then(response => {
    // 第一次then: 处理响应对象
    console.log(response.status);    // 状态码
    console.log(response.ok);        // 是否成功
    return response.json();          // 解析JSON
    // 或 return response.text();    // 解析文本
})
.then(data => {
    // 第二次then: 获取实际数据
    console.log(data);
})
.catch(error => {
    console.log('网络错误', error);
});
```

Fetch的body参数必须是字符串，发送JSON数据需要用JSON.stringify()转换。第一次.then()返回response.json()或response.text()，第二次.then()才能获取数据。

### 📝 要点测验

<details>
<summary>为什么Fetch需要两次.then()？</summary>

**原因分析：**
Fetch的设计采用了流式读取（Stream）的方式处理响应体，分两个阶段：

**第一阶段：接收响应头**
```javascript
fetch('/api').then(response => {
    // 此时只接收到响应头，响应体还在传输中
    console.log(response.status);  // 可以访问状态码
    console.log(response.headers); // 可以访问响应头
    // response.body是一个ReadableStream
    return response.json(); // 启动读取响应体
});
```

**第二阶段：读取响应体**
```javascript
.then(data => {
    // response.json()返回新的Promise
    // 该Promise在响应体完全读取并解析后resolve
    console.log(data); // 实际数据
});
```

**设计优势：**
1. **分离关注点**: 响应头和响应体分开处理
2. **支持流式读取**: 可以逐步处理大文件
3. **灵活性**: 可以选择不同的解析方式

```javascript
fetch('/api').then(response => {
    // 根据Content-Type选择解析方式
    const contentType = response.headers.get('content-type');
    if(contentType.includes('application/json')){
        return response.json();
    } else {
        return response.text();
    }
}).then(data => {
    console.log(data);
});
```

**简化写法（async/await）：**
```javascript
const response = await fetch('/api');
const data = await response.json();
console.log(data);
```
</details>

<details>
<summary>Fetch的错误处理有什么特殊之处？</summary>

**关键特性：**
Fetch只有在**网络故障**或**请求被阻止**时才会reject，HTTP错误状态码（4xx、5xx）仍然会resolve。

**问题示例：**
```javascript
fetch('/api/404')
    .then(response => {
        console.log('进入then'); // 即使404也会进入这里！
        console.log(response.ok); // false
        console.log(response.status); // 404
    })
    .catch(error => {
        console.log('不会进入catch');
    });
```

**正确的错误处理：**
```javascript
fetch('/api/users')
    .then(response => {
        // 检查响应是否成功
        if(!response.ok){
            throw new Error(`HTTP错误: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        // 现在可以捕获HTTP错误了
        console.log('错误:', error.message);
    });
```

**response.ok属性：**
- `response.ok`: 状态码在200-299之间时为true
- 等同于: `response.status >= 200 && response.status < 300`

**完整的错误处理方案：**
```javascript
async function fetchData(url){
    try {
        const response = await fetch(url);
        
        // 1. 检查HTTP状态
        if(!response.ok){
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // 2. 解析JSON
        const data = await response.json();
        return data;
        
    } catch(error) {
        // 3. 统一错误处理
        if(error.name === 'TypeError'){
            console.log('网络错误或CORS问题');
        } else {
            console.log('请求失败:', error.message);
        }
        throw error;
    }
}
```

**对比Axios：**
Axios会自动将4xx、5xx状态码视为错误，直接进入catch：
```javascript
axios.get('/api/404')
    .then(res => {
        console.log('不会进入这里');
    })
    .catch(error => {
        console.log('自动捕获404错误');
    });
```

**面试要点：**
- Fetch不自动reject HTTP错误状态
- 必须手动检查response.ok
- 只有网络故障才会reject
- 建议封装统一错误处理函数
</details>

<details>
<summary>Fetch与Axios、XMLHttpRequest的选择建议？</summary>

**三者对比：**

| 特性 | XMLHttpRequest | Fetch | Axios |
|------|---------------|-------|-------|
| 浏览器支持 | 所有浏览器 | 现代浏览器(IE不支持) | 所有浏览器 |
| Promise | ❌ | ✅ | ✅ |
| 拦截器 | ❌ | ❌ | ✅ |
| 自动JSON | ❌ | 需两次then | ✅ |
| 超时控制 | ✅ | 需AbortController | ✅ |
| 进度监控 | ✅ | ❌ | ✅ |
| XSRF防护 | ❌ | ❌ | ✅ |
| 取消请求 | xhr.abort() | AbortController | CancelToken |

**选择建议：**

**1. 推荐Axios - 适合大多数项目**
```javascript
// 功能最完整，开发体验最好
axios.get('/api').then(res => console.log(res.data));
```
- React/Vue/Angular等现代框架项目
- 需要拦截器、进度监控等高级功能
- 需要兼容IE浏览器

**2. 选择Fetch - 简单场景**
```javascript
// 原生API，无需安装
fetch('/api').then(r => r.json()).then(console.log);
```
- 不需要兼容老浏览器
- 简单的GET/POST请求
- 追求轻量，不想引入库

**3. 使用XMLHttpRequest - 特殊需求**
```javascript
// 上传文件时监控进度
xhr.upload.onprogress = e => {
    console.log(e.loaded / e.total * 100 + '%');
};
```
- 需要监听上传/下载进度
- 需要兼容非常老的浏览器
- 特殊的二进制数据处理

**实践建议：**
- **新项目首选Axios**：功能完整，社区成熟
- **轻量项目考虑Fetch**：原生支持，零依赖
- **老项目维护用XMLHttpRequest**：保持一致性

**Fetch的痛点及解决：**
```javascript
// 封装Fetch使其更像Axios
async function request(url, options = {}){
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });
    
    if(!response.ok){
        throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
}

// 使用
request('/api/users', {method: 'POST', body: JSON.stringify(data)})
    .then(data => console.log(data))
    .catch(error => console.log(error));
```
</details>

## 八、跨域问题与解决方案

### 核心概念
跨域是浏览器的同源策略（Same-Origin Policy）安全机制造成的限制。同源是指协议、域名、端口三者完全相同。不同源之间的AJAX请求、Cookie访问、DOM操作都会被浏览器阻止。

**同源策略**是浏览器最核心的安全功能，防止恶意网站读取其他网站的数据。但它也限制了合法的跨域通信，需要通过JSONP、CORS等技术解决。

**JSONP**（JSON with Padding）利用script标签不受同源策略限制的特点，通过动态创建script标签实现跨域。服务器返回的不是JSON数据，而是一段调用预定义函数的JavaScript代码。

**CORS**（Cross-Origin Resource Sharing）是W3C标准的跨域解决方案，通过服务器设置响应头`Access-Control-Allow-Origin`来允许特定源的跨域访问。

### 关键代码

**同源策略限制演示：**
```javascript
// 当前页面: http://127.0.0.1:5500
// 请求地址: http://127.0.0.1:8000
const xhr = new XMLHttpRequest();
xhr.open("GET", 'http://127.0.0.1:8000/server');
xhr.send();
// 浏览器报错: No 'Access-Control-Allow-Origin' header
```

**JSONP实现：**
```javascript
// 客户端
function handle(data) {
    console.log(data.name); // 处理返回的数据
}

// 动态创建script标签
const script = document.createElement('script');
script.src = 'http://127.0.0.1:8000/jsonp-server';
document.body.appendChild(script);

// 服务端（Express）
app.all('/jsonp-server', (request, response) => {
    const data = { name: '尚硅谷', age: 18 };
    let str = JSON.stringify(data);
    // 返回函数调用代码
    response.end(`handle(${str})`);
});
```

**CORS实现：**
```javascript
// 客户端代码无需改变
const xhr = new XMLHttpRequest();
xhr.open("GET", "http://127.0.0.1:8000/server");
xhr.send();

// 服务端设置CORS响应头
app.all('/server', (request, response) => {
    // 允许所有源访问
    response.setHeader('Access-Control-Allow-Origin', '*');
    // 允许所有请求头
    response.setHeader('Access-Control-Allow-Headers', '*');
    // 允许所有HTTP方法
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.send('hello CORS');
});
```

JSONP通过script标签的src属性实现跨域，服务器返回的是函数调用代码。CORS通过服务器响应头授权跨域访问，是现代标准解决方案。

### 📝 要点测验

<details>
<summary>什么情况下会触发跨域？如何判断是否同源？</summary>

**同源的定义：**
协议（protocol）、域名（domain）、端口（port）三者**完全相同**。

**跨域示例：**

| 当前页面 | 请求地址 | 是否跨域 | 原因 |
|---------|---------|---------|------|
| http://www.example.com | http://www.example.com/api | ❌ 同源 | 完全相同 |
| http://www.example.com | https://www.example.com | ✅ 跨域 | 协议不同(http vs https) |
| http://www.example.com | http://api.example.com | ✅ 跨域 | 域名不同(www vs api) |
| http://www.example.com:80 | http://www.example.com:8080 | ✅ 跨域 | 端口不同(80 vs 8080) |
| http://127.0.0.1:5500 | http://localhost:5500 | ✅ 跨域 | 域名不同(127.0.0.1 vs localhost) |

**同源策略限制的内容：**
1. **AJAX请求**: 无法读取跨域接口的响应
2. **Cookie/LocalStorage**: 无法读写跨域的存储
3. **DOM访问**: 无法操作跨域iframe的DOM
4. **Canvas污染**: 跨域图片会污染Canvas

**不受限制的跨域资源：**
1. **图片**: `<img src="跨域图片">`
2. **样式**: `<link href="跨域CSS">`
3. **脚本**: `<script src="跨域JS">`（JSONP原理基础）
4. **视频**: `<video src="跨域视频">`
5. **字体**: `@font-face`

**实际场景：**
```javascript
// 前端页面: http://localhost:3000
// API服务器: http://localhost:4000

fetch('http://localhost:4000/api/users')
    .then(response => response.json())
    .then(data => console.log(data));
// 浏览器报错: CORS policy阻止
```

**开发环境解决：**
- 开发时使用代理（Webpack DevServer、Vite等）
- 生产环境配置CORS响应头
</details>

<details>
<summary>JSONP的原理、优缺点及实现细节？</summary>

**原理详解：**
1. script标签的src属性不受同源策略限制
2. 服务器返回的不是JSON数据，而是一段JavaScript代码
3. 这段代码调用页面中预先定义的函数，并传入数据
4. script加载完成后自动执行，实现跨域数据传输

**完整实现：**
```javascript
// 1. 定义全局回调函数
function handleData(data){
    console.log('接收到数据:', data);
    document.getElementById('result').innerHTML = data.name;
}

// 2. 创建script标签
function jsonp(url, callbackName){
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        
        // 定义全局回调
        window[callbackName] = function(data){
            resolve(data);
            // 清理
            document.body.removeChild(script);
            delete window[callbackName];
        };
        
        // 设置src
        script.src = `${url}?callback=${callbackName}`;
        script.onerror = reject;
        
        // 插入DOM
        document.body.appendChild(script);
    });
}

// 3. 使用
jsonp('http://api.example.com/data', 'handleData')
    .then(data => console.log(data))
    .catch(error => console.log('JSONP失败', error));
```

**服务端实现（Express）：**
```javascript
app.get('/api/data', (req, res) => {
    const callbackName = req.query.callback; // 获取回调函数名
    const data = {name: '张三', age: 18};
    const jsonStr = JSON.stringify(data);
    
    // 返回函数调用代码
    res.send(`${callbackName}(${jsonStr})`);
});

// 返回内容示例: handleData({"name":"张三","age":18})
```

**jQuery的JSONP：**
```javascript
$.ajax({
    url: 'http://api.example.com/data',
    dataType: 'jsonp',              // 指定为jsonp
    jsonp: 'callback',              // 回调参数名（默认callback）
    jsonpCallback: 'handleData',    // 回调函数名
    success: function(data){
        console.log(data);
    }
});
```

**优点：**
- 兼容性好，支持老浏览器（IE6+）
- 实现简单，不需要XMLHttpRequest
- 可以直接访问返回的数据

**缺点：**
- **只支持GET请求**（script标签只能GET）
- **安全性差**：容易受到XSS攻击，服务器返回的代码会直接执行
- **错误处理困难**：无法捕获HTTP错误状态码
- **需要服务端配合**：服务端必须支持JSONP格式
- **污染全局作用域**：回调函数必须是全局函数

**安全隐患示例：**
```javascript
// 恶意服务器返回：
handleData({data: "正常数据"});
alert('XSS攻击'); // 会被执行！
```

**现代替代方案：**
JSONP已过时，现代项目应该使用CORS，除非需要兼容非常老的浏览器。
</details>

<details>
<summary>CORS的详细配置和预检请求机制？</summary>

**基础CORS配置：**
```javascript
// Express中间件方式
app.use((req, res, next) => {
    // 允许的源
    res.setHeader('Access-Control-Allow-Origin', '*');
    // 允许的HTTP方法
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // 允许的请求头
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // 允许携带Cookie
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // 预检请求缓存时间（秒）
    res.setHeader('Access-Control-Max-Age', '86400');
    
    // 处理预检请求
    if(req.method === 'OPTIONS'){
        res.sendStatus(200);
        return;
    }
    next();
});
```

**简单请求 vs 预检请求：**

**简单请求（直接发送）：**
满足以下所有条件：
1. 方法：GET、HEAD、POST
2. 请求头仅包含：Accept、Accept-Language、Content-Language、Content-Type
3. Content-Type仅限：application/x-www-form-urlencoded、multipart/form-data、text/plain

```javascript
// 简单请求示例
fetch('http://api.example.com/data', {
    method: 'GET'
});
// 浏览器直接发送，不预检
```

**预检请求（先发OPTIONS）：**
不满足简单请求条件时，浏览器会先发送OPTIONS预检：
```javascript
// 触发预检的请求
fetch('http://api.example.com/data', {
    method: 'PUT',  // 非简单方法
    headers: {
        'Content-Type': 'application/json',  // 非简单Content-Type
        'Authorization': 'Bearer token'       // 自定义头
    },
    body: JSON.stringify({name: 'test'})
});
```

**预检流程：**
```
1. 浏览器发送OPTIONS请求:
   OPTIONS /api/data HTTP/1.1
   Origin: http://localhost:3000
   Access-Control-Request-Method: PUT
   Access-Control-Request-Headers: Content-Type, Authorization

2. 服务器响应允许:
   HTTP/1.1 200 OK
   Access-Control-Allow-Origin: http://localhost:3000
   Access-Control-Allow-Methods: PUT
   Access-Control-Allow-Headers: Content-Type, Authorization
   Access-Control-Max-Age: 86400

3. 浏览器发送实际请求:
   PUT /api/data HTTP/1.1
   Content-Type: application/json
   Authorization: Bearer token
```

**携带Cookie的配置：**
```javascript
// 前端
fetch('http://api.example.com/data', {
    method: 'GET',
    credentials: 'include'  // 携带Cookie
});

// 后端
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // 不能用*
res.setHeader('Access-Control-Allow-Credentials', 'true');
```

**安全配置建议：**
```javascript
// 生产环境不要用*
const allowedOrigins = [
    'https://example.com',
    'https://www.example.com'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin)){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // ... 其他配置
    next();
});
```

**常见问题：**
1. **Allow-Credentials时不能用***: 必须指定具体源
2. **预检请求失败**: 检查Allow-Methods和Allow-Headers配置
3. **Cookie不发送**: 检查credentials和Allow-Credentials配置
4. **自定义头被拒绝**: 必须在Allow-Headers中明确列出

**使用CORS包（推荐）：**
```javascript
const cors = require('cors');

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    maxAge: 86400
}));
```
</details>

<details>
<summary>除了JSONP和CORS，还有哪些跨域解决方案？</summary>

**1. 代理服务器（开发常用）**
```javascript
// Webpack DevServer配置
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://api.example.com',
                changeOrigin: true,
                pathRewrite: {'^/api': ''}
            }
        }
    }
};

// 前端请求
fetch('/api/users')  // 实际请求: http://api.example.com/users
```
**原理**: 开发服务器作为中间层转发请求，同源策略只在浏览器中存在，服务器间通信不受限制。

**2. Nginx反向代理（生产常用）**
```nginx
server {
    listen 80;
    server_name www.example.com;
    
    location /api {
        proxy_pass http://api.example.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
**优势**: 
- 统一域名，不需要CORS
- 可以负载均衡
- 隐藏真实API地址

**3. postMessage（iframe通信）**
```javascript
// 父页面 (http://parent.com)
const iframe = document.getElementById('myIframe');
iframe.contentWindow.postMessage('hello', 'http://child.com');

window.addEventListener('message', event => {
    if(event.origin === 'http://child.com'){
        console.log('接收到消息:', event.data);
    }
});

// 子页面 (http://child.com)
window.addEventListener('message', event => {
    if(event.origin === 'http://parent.com'){
        console.log('接收到消息:', event.data);
        event.source.postMessage('world', event.origin);
    }
});
```
**适用**: 不同源iframe、window.open打开的窗口间通信

**4. WebSocket**
```javascript
// WebSocket不受同源策略限制
const ws = new WebSocket('ws://api.example.com');

ws.onopen = () => {
    ws.send('Hello Server');
};

ws.onmessage = event => {
    console.log('接收:', event.data);
};
```
**优势**: 双向通信，实时性强

**5. document.domain（子域间）**
```javascript
// 页面1: http://a.example.com
document.domain = 'example.com';

// 页面2: http://b.example.com
document.domain = 'example.com';

// 现在可以互相访问DOM
const iframe = document.getElementById('myIframe');
iframe.contentWindow.document.body;
```
**限制**: 只能用于主域相同的子域间

**6. window.name**
```javascript
// 利用window.name在不同页面间保持
// 容量大（2MB），但现在很少用
```

**7. location.hash**
```javascript
// 通过URL hash传递数据
// iframe.src = 'http://other.com#data=xxx'
// 也很少用了
```

**方案选择建议：**
| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 前后端分离项目 | CORS | 标准方案，配置简单 |
| 开发环境 | 代理服务器 | 无需后端配置 |
| 生产环境 | Nginx代理 | 性能好，统一域名 |
| iframe通信 | postMessage | 专为此设计 |
| 实时通信 | WebSocket | 双向实时 |
| 老浏览器兼容 | JSONP | 兼容性最好 |

**面试高分答案框架：**
1. **理解同源策略**: 说明协议、域名、端口
2. **主流方案**: CORS（首选）、代理服务器、Nginx反向代理
3. **特殊场景**: postMessage、WebSocket
4. **历史方案**: JSONP（仅GET）、document.domain（已弃用）
5. **实践经验**: 开发环境代理，生产环境CORS或Nginx
</details>

---

## 九、课程总结与最佳实践

### 核心概念
AJAX技术经历了从原生XMLHttpRequest到jQuery封装，再到现代axios和fetch的演进。理解底层原理的同时，掌握现代工具的使用是前端开发的必备技能。

**技术选型建议**：
- **原生XMLHttpRequest**：理解原理，面试必问，但实际项目不推荐
- **jQuery AJAX**：老项目维护，新项目不推荐
- **axios**：现代项目首选，功能完整，生态成熟
- **fetch**：轻量场景，原生API，但需要封装

**跨域解决方案**：
- **开发环境**：配置webpack/vite代理
- **生产环境**：服务端配置CORS或使用Nginx反向代理
- **特殊场景**：postMessage（iframe通信）、WebSocket（实时通信）

### 关键代码

**现代项目axios最佳实践：**
```javascript
// api/request.js - 统一请求封装
import axios from 'axios';

const request = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 10000
});

// 请求拦截器
request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
    response => response.data,
    error => {
        if(error.response){
            switch(error.response.status){
                case 401:
                    // 跳转登录
                    window.location.href = '/login';
                    break;
                case 404:
                    console.error('接口不存在');
                    break;
                case 500:
                    console.error('服务器错误');
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default request;

// 使用
import request from './api/request';

async function getUsers(){
    try {
        const data = await request.get('/users');
        console.log(data);
    } catch(error) {
        console.error('请求失败', error);
    }
}
```

这段代码展示了企业级axios封装：配置基础URL和超时、请求拦截器添加token、响应拦截器统一错误处理。这是实际项目中最常用的模式。

### 📝 要点测验

<details>
<summary>面试题：从输入URL到页面展示，AJAX请求的完整流程？</summary>

**详细流程：**

**1. 前端发起请求**
```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://api.example.com/users');
xhr.send();
```
- 创建XMLHttpRequest对象
- 调用open()初始化请求
- 调用send()发送请求

**2. 浏览器处理**
- 检查是否跨域，跨域则检查CORS
- 如果需要，发送OPTIONS预检请求
- 序列化请求参数
- 添加请求头（User-Agent、Cookie等）
- 建立TCP连接（三次握手）

**3. DNS解析**
- 浏览器缓存 → 系统缓存 → 路由器缓存 → ISP DNS服务器
- 将域名解析为IP地址

**4. TCP三次握手**
```
客户端 → SYN → 服务器
客户端 ← SYN+ACK ← 服务器
客户端 → ACK → 服务器
```

**5. 发送HTTP请求**
```
GET /users HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
```

**6. 服务器处理**
- Nginx/Apache接收请求
- 路由匹配
- 中间件处理（身份验证、日志等）
- 业务逻辑处理
- 数据库查询
- 构建响应

**7. 返回HTTP响应**
```
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *

{"users": [...]}
```

**8. TCP四次挥手**
```
客户端 → FIN → 服务器
客户端 ← ACK ← 服务器
客户端 ← FIN ← 服务器
客户端 → ACK → 服务器
```

**9. 浏览器接收响应**
- 接收响应头（readyState=2）
- 接收响应体（readyState=3）
- 接收完成（readyState=4）
- 触发onreadystatechange事件

**10. 前端处理数据**
```javascript
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4 && xhr.status === 200){
        const data = JSON.parse(xhr.response);
        updateUI(data); // 更新页面
    }
}
```

**11. 页面渲染**
- 解析JSON数据
- 更新DOM
- 触发浏览器重绘（repaint）
- 用户看到更新后的页面

**性能优化点：**
- DNS预解析：`<link rel="dns-prefetch" href="//api.example.com">`
- HTTP/2：多路复用，减少TCP连接
- 缓存：合理设置Cache-Control
- CDN：静态资源就近访问
- 压缩：gzip/br压缩响应体

**面试加分项：**
- 提到三次握手/四次挥手
- 说明DNS解析过程
- 提到OPTIONS预检请求
- 说明readyState状态变化
- 提到性能优化方案
</details>

<details>
<summary>企业级项目中AJAX请求的最佳实践？</summary>

**1. 统一封装axios实例**
```javascript
// utils/request.js
import axios from 'axios';
import { message } from 'antd';

const service = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 15000
});

service.interceptors.request.use(
    config => {
        // 1. 添加token
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // 2. 添加时间戳（防止IE缓存）
        if(config.method === 'get'){
            config.params = {
                ...config.params,
                _t: Date.now()
            };
        }
        
        // 3. 显示loading
        if(config.loading !== false){
            // showLoading();
        }
        
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    response => {
        // hideLoading();
        const { code, data, msg } = response.data;
        
        if(code === 200){
            return data;
        } else {
            message.error(msg || '请求失败');
            return Promise.reject(new Error(msg));
        }
    },
    error => {
        // hideLoading();
        
        if(error.response){
            const { status, data } = error.response;
            switch(status){
                case 401:
                    message.error('未登录，请先登录');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    message.error('没有权限');
                    break;
                case 404:
                    message.error('请求的资源不存在');
                    break;
                case 500:
                    message.error('服务器错误');
                    break;
                default:
                    message.error(data.msg || '请求失败');
            }
        } else if(error.request){
            message.error('网络错误，请检查网络连接');
        } else {
            message.error(error.message);
        }
        
        return Promise.reject(error);
    }
);

export default service;
```

**2. API模块化管理**
```javascript
// api/user.js
import request from '@/utils/request';

export const userAPI = {
    // 获取用户列表
    getUserList(params){
        return request({
            url: '/users',
            method: 'get',
            params
        });
    },
    
    // 获取用户详情
    getUserDetail(id){
        return request.get(`/users/${id}`);
    },
    
    // 创建用户
    createUser(data){
        return request.post('/users', data);
    },
    
    // 更新用户
    updateUser(id, data){
        return request.put(`/users/${id}`, data);
    },
    
    // 删除用户
    deleteUser(id){
        return request.delete(`/users/${id}`);
    }
};

// 使用
import { userAPI } from '@/api/user';

async function loadUsers(){
    try {
        const users = await userAPI.getUserList({page: 1, size: 10});
        setUserList(users);
    } catch(error) {
        console.error(error);
    }
}
```

**3. 请求取消和防重复**
```javascript
import axios from 'axios';

// 请求队列
const pending = new Map();

// 生成请求key
function getPendingKey(config){
    const { url, method, params, data } = config;
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
}

// 添加待处理请求
function addPending(config){
    const key = getPendingKey(config);
    config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
        if(!pending.has(key)){
            pending.set(key, cancel);
        }
    });
}

// 移除待处理请求
function removePending(config){
    const key = getPendingKey(config);
    if(pending.has(key)){
        const cancel = pending.get(key);
        cancel(key); // 取消请求
        pending.delete(key);
    }
}

// 请求拦截器
service.interceptors.request.use(config => {
    removePending(config); // 取消重复请求
    addPending(config);    // 添加当前请求
    return config;
});

// 响应拦截器
service.interceptors.response.use(
    response => {
        removePending(response.config);
        return response;
    },
    error => {
        if(axios.isCancel(error)){
            console.log('请求已取消:', error.message);
        }
        return Promise.reject(error);
    }
);
```

**4. 并发请求控制**
```javascript
// 同时发送多个请求
async function loadData(){
    try {
        const [users, posts, comments] = await Promise.all([
            userAPI.getUserList(),
            postAPI.getPostList(),
            commentAPI.getCommentList()
        ]);
        
        setUsers(users);
        setPosts(posts);
        setComments(comments);
    } catch(error) {
        console.error('加载数据失败', error);
    }
}

// 控制并发数量
class RequestQueue {
    constructor(maxConcurrent = 6){
        this.maxConcurrent = maxConcurrent;
        this.current = 0;
        this.queue = [];
    }
    
    async request(fn){
        while(this.current >= this.maxConcurrent){
            await new Promise(resolve => this.queue.push(resolve));
        }
        
        this.current++;
        try {
            return await fn();
        } finally {
            this.current--;
            const resolve = this.queue.shift();
            if(resolve) resolve();
        }
    }
}

// 使用
const queue = new RequestQueue(3); // 最多3个并发
const promises = urls.map(url => 
    queue.request(() => axios.get(url))
);
const results = await Promise.all(promises);
```

**5. 错误重试机制**
```javascript
function requestWithRetry(config, maxRetries = 3){
    return new Promise((resolve, reject) => {
        function attempt(retryCount){
            request(config)
                .then(resolve)
                .catch(error => {
                    if(retryCount < maxRetries){
                        console.log(`请求失败，${retryCount + 1}次重试...`);
                        setTimeout(() => {
                            attempt(retryCount + 1);
                        }, 1000 * (retryCount + 1)); // 递增延迟
                    } else {
                        reject(error);
                    }
                });
        }
        attempt(0);
    });
}

// 使用
requestWithRetry({
    url: '/api/data',
    method: 'get'
}, 3);
```

**6. TypeScript类型定义**
```typescript
// types/api.ts
interface ApiResponse<T = any> {
    code: number;
    data: T;
    msg: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

// 使用
async function getUser(id: number): Promise<User> {
    const response = await request.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
}
```

**7. 环境配置**
```javascript
// .env.development
REACT_APP_API_BASE_URL=http://localhost:8000

// .env.production
REACT_APP_API_BASE_URL=https://api.example.com

// 使用
const baseURL = process.env.REACT_APP_API_BASE_URL;
```

**最佳实践总结：**
- ✅ 统一封装，便于维护
- ✅ 拦截器统一处理token、错误
- ✅ API模块化，职责清晰
- ✅ 防重复请求，避免浪费
- ✅ 错误重试，提高成功率
- ✅ TypeScript，类型安全
- ✅ 环境变量，灵活配置
</details>

---

**恭喜你完成AJAX课程学习！** 🎉

通过本课程，你已经掌握了：
- HTTP协议基础和报文结构
- Express服务器搭建
- 原生XMLHttpRequest的完整用法
- axios、fetch三种AJAX方案
- 跨域问题的原理和解决方案
- 企业级项目的最佳实践

**下一步建议：**
1. 完成`知识点实践`文件夹中的所有练习
2. 尝试搭建一个前后端分离项目
3. 学习Promise、async/await深入异步编程
4. 了解WebSocket实现实时通信
5. 研究axios源码，深入理解封装原理


