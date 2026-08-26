# Axios 学习笔记

## 一句话理解 axios

axios 是对浏览器 XMLHttpRequest 和 Node.js http 模块的 **Promise 封装**，提供统一的 API 在两端发 HTTP 请求。

---

## 一、基础用法速查

### GET 请求

```js
// 基本 GET
const res = await axios.get('/users')

// 带查询参数（自动编码特殊字符，不用手动拼 URL）
const res = await axios.get('/posts', {
  params: { userId: 1 }   // → /posts?userId=1
})

// 获取单条
const res = await axios.get('/users/1')
```

### POST 请求

```js
// 第二个参数就是请求体，axios 自动转 JSON
const res = await axios.post('/users', {
  name: '张三',
  age: 25
})
// 成功状态码是 201（Created），不是 200
```

### PUT / PATCH / DELETE

```js
await axios.put('/users/1', { name: '新名字', age: 30 })     // 完整替换
await axios.patch('/users/1', { age: 31 })                    // 部分更新
await axios.delete('/users/1')                                 // 删除
```

### response 对象结构

```js
const res = await axios.get('/users')
res.data       // 服务器返回的实际数据（最常用）
res.status     // HTTP 状态码：200、201、404...
res.headers    // 响应头
res.config     // 本次请求的配置信息
```

---

## 二、async/await vs .then（推荐 async/await）

```js
// .then 写法
axios.get('/users')
  .then(res => console.log(res.data))
  .catch(err => console.log(err.message))

// async/await 写法（推荐，读起来像同步代码）
try {
  const res = await axios.get('/users')
  console.log(res.data)
} catch (err) {
  console.log(err.message)
}
```

两者完全等价。`await` 本质是语法糖，不会阻塞线程。

---

## 三、三种错误类型（重点！）

```js
try {
  await axios.get('/xxx')
} catch (error) {
  if (error.response) {
    // 服务器回复了，但状态码是 4xx/5xx
    // 例：401 未授权、404 不存在、500 服务器崩了
    console.log(error.response.status)
  } else if (error.request) {
    // 请求发出去了，但没收到响应（断网、服务器挂了）
    console.log('网络异常')
  } else {
    // 请求没发出去（代码配置写错了）
    console.log(error.message)
  }
}
```

---

## 四、axios.create 创建实例

不同后端服务用不同实例，互不干扰：

```js
const service = axios.create({
  baseURL: 'http://localhost:3004',
  timeout: 5000,
  headers: { 'X-Custom-Header': 'value' }
})

// 之后用 service 代替 axios 发请求
service.get('/users')
```

---

## 五、拦截器（核心重点）

### 请求拦截器 —— 请求发出前执行

典型用途：**自动附加 token**

```js
service.interceptors.request.use(
  config => {
    config.headers.Authorization = `Bearer ${getToken()}`
    return config   // 必须 return！不 return 后面拿到 undefined 会崩
  },
  error => Promise.reject(error)
)
```

### 响应拦截器 —— 收到响应后执行

典型用途：**统一提取 data + 统一错误处理**

```js
service.interceptors.response.use(
  response => {
    return response.data  // 业务代码直接拿到数据，不用每次 .data
  },
  error => {
    // 统一翻译错误信息
    let msg = '未知错误'
    if (error.response) {
      switch (error.response.status) {
        case 401: msg = '请重新登录'; break
        case 403: msg = '没有权限'; break
        case 404: msg = '资源不存在'; break
        case 500: msg = '服务器错误'; break
      }
    } else if (error.request) {
      msg = '网络异常'
    }
    return Promise.reject(new Error(msg))
    // 业务层只需 catch(e) { alert(e.message) }
  }
)
```

### 拦截器执行顺序

```
请求拦截器(config) → 发请求(dispatchRequest) → 响应拦截器(response)
```

多个拦截器时：请求拦截器**后注册先执行**，响应拦截器**先注册先执行**。

### 关键细节

- 拦截器是 Promise 链，每步的 return 值 = 下一步的输入
- 请求拦截器不 return config → 下一步收到 undefined → 崩溃
- 响应错误处理里写 `return error` 而不是 `return Promise.reject(error)` → 错误被吞掉，catch 不触发

---

## 六、实际场景速查

### 上传文件

```js
const formData = new FormData()
formData.append('file', fileInput.files[0])

await axios.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
```

### 下载文件

```js
const res = await axios.get('/download/report.pdf', {
  responseType: 'blob'   // 告诉 axios 响应是二进制数据
})
// 然后用 URL.createObjectURL(res.data) 创建下载链接
```

### 提交表单（非文件）

```js
const params = new URLSearchParams()
params.append('username', 'admin')
params.append('password', '123')

await axios.post('/login', params)
// Content-Type 自动变成 application/x-www-form-urlencoded
```

### 请求超时

```js
axios.get('/slow-api', { timeout: 3000 })  // 3秒没响应就报错
```

### 请求取消

```js
const controller = new AbortController()
axios.get('/users', { signal: controller.signal })
controller.abort()  // 取消请求（比如用户切换页面时）
```

---

## 七、工程封装模板（可直接用）

```
项目结构：
src/
  utils/request.js    ← 封装 axios 实例 + 拦截器
  api/user.js         ← 定义具体接口
  pages/xxx.vue       ← 调用接口
```

`request.js` 完整封装见项目中的 `request.js` 文件。

`api/user.js` 写法示例：

```js
import request from '@/utils/request'

export function getUsers() {
  return request.get('/users')
}

export function createUser(data) {
  return request.post('/users', data)
}
```

页面中使用：

```js
import { getUsers } from '@/api/user'

const users = await getUsers()  // 直接拿到数据数组，不用 .data
```

---

## 八、原理概要（了解即可）

axios 内部是一条 **Promise 链**：

```
Promise.resolve(config)
  .then(请求拦截器)        // config → config（加 token 等）
  .then(dispatchRequest)   // config → response（真正发请求）
  .then(响应拦截器)        // response → data（提取数据等）
```

三个核心概念：

| 概念 | 作用 |
|------|------|
| **adapter** | 真正发请求的底层函数。浏览器用 XMLHttpRequest，Node.js 用 http 模块 |
| **dispatchRequest** | 中间层，调用 adapter 并处理请求/响应数据转换 |
| **interceptors** | 拦截器数组，在 dispatchRequest 前后插入 Promise 链节点 |

这就是 axios 能同时跑在浏览器和 Node.js 的原因：上层 API 一样，底层 adapter 不同。

---

## 九、学习文件索引
在本地code/local/axios文件夹
| 文件 | 内容 |
|------|------|
| `01-get.js` | 最简 GET 请求 |
| `02-all-basics.js` | GET / POST / 错误处理 / await 全览 |
| `03-interceptors.js` | 拦截器实操 |
| `request.js` | 工程级封装模板 |
| `04-test-request.js` | request.js 测试用例 |
| `05-mini-axios.js` | 手写迷你 axios，理解 Promise 链原理 |
