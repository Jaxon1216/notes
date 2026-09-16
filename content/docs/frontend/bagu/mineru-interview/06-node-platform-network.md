---
title: Node.js、小程序与网络 HTTP
description: Node.js、微信小程序与网络 HTTP 高频面试问答。
tags:
  - 前端八股
  - Node.js
  - 微信小程序
  - 计算机网络
status: published
updatedAt: '2026-09-16'
---

## 1. 说说你对Node.js的理解？优缺点？应用场景?

### 核心原理

Node.js 是一个开源与跨平台的JavaScript 运行时环境

在浏览器外运行 V8 JavaScript 引擎(Google Chrome的内核)，利用事件驱动、非阻塞和异步输入输出模型等技术提高性能

可以理解为Node.js 就是一个服务器端的、非阻塞式l/O的、事件驱动的JavaScript运行环境

**非阻塞异步**

Nodejs采用了非阻塞型I/O机制，在做I/O操作的时候不会造成任何的阻塞，当完成之后，以时间的形式通知执行操作

例如在执行了访问数据库的代码之后，将立即转而执行其后面的代码，把数据库返回结果的处理代码放在回调函数中，从而提高了程序的执行效率

**事件驱动**

事件驱动就是当进来一个新的请求的时，请求将会被压入一个事件队列中，然后通过一个循环来检测队列中的事件状态变化，如果检测到有状态变化的事件，那么就执行该事件对应的处理代码，一般都是回调函数

比如读取一个文件，文件读取完毕后，就会触发对应的状态，然后通过对应的回调函数来进行处理

### 优缺点

优点：

处理高并发场景性能更佳

- 适合I/O密集型应用，值的是应用在运行极限时，CPU占用率仍然比较低，大部分时间是在做I/O硬盘内存读写操作

因为Nodejs是单线程，带来的缺点有：

- 不适合CPU密集型应用

- 只支持单核CPU，不能充分利用CPU

- 可靠性低，一旦代码某个环节崩溃，整个系统都崩溃

### 应用场景

借助Nodejs的特点和弊端，其应用场景分类如下：

- 善于I/O，不善于计算。因为Nodejs是一个单线程，如果计算(同步）太多，则会阻塞这个线程

- 大量并发的 I/O，应用程序内部并不需要进行非常复杂的处理

与websocket配合，开发长连接的实时交互应用程序

具体场景可以表现为如下：

- 第一大类：用户表单收集系统、后台管理系统、实时交互系统、考试系统、联网软件、高并发量的web应用程序

第二大类：基于web、canvas等多人联网游戏

第三大类：基于web的多人实时聊天客户端、聊天室、图文直播

- 第四大类：单页面浏览器应用程序

第五大类：操作数据库、为前端和移动端提供基于 json的API

其实，Nodejs能实现几乎一切的应用，只考虑适不适合使用它

## 2. 如何理解 Node.js 的 fs 模块？有哪些常用方法？

### 模块能力与文件基础

fs（filesystem），该模块提供本地文件的读写能力，基本上是 POSIX 文件操作命令的简单包装可以说，所有与文件的操作都是通过fs核心模块实现

导入模块如下：

```js
const fs = require('fs');
```

这个模块对所有文件系统操作提供异步（不具有 sync 后缀）和同步（具有 sync 后缀）两种操作方式，而供开发者选择

在计算机中有关于文件的知识：

- 权限位 mode

- 标识位 flag

- 文件描述为 fd

**权限位 mode**

- 权限分配 | 文件所有者 | 文件所属组 | 其他用户
- 权限项 | 读 | 写 | 执行 | 读 | 写 | 执行 | 读 | 写 | 执行
- 字符表示 | 1 | w | x | r | W | X | r | W | x
- 数字表示 | 2 | 1 | 2 | 1 | 2 | 1

针对文件所有者、文件所属组、其他用户进行权限分配，其中类型又分成读、写和执行，具备权限位4、2、1，不具备权限为0

如在linux查看文件权限位：

```js
drwxr-xr-x 1 PandaShen 197121 0 Jun 28 14:41 core
rw-r--r-- 1 PandaShen 197121 293 Jun 23 17:44 index.md
```

在开头前十位中，d为文件夹，-为文件，后九位就代表当前用户、用户所属组和其他用户的权限位，按每三位划分，分别代表读(r)、写(w)和执行(x)，-代表没有当前位对应的权限

**标识位**

标识位代表着对文件的操作方式，如可读、可写、即可读又可写等等，如下表所示：

- 符号 | 含义
- r | 读取文件，如果文件不存在则抛出异常。
- r+ | 读取并写入文件，如果文件不存在则抛出异常。
- rs | 读取并写入文件，指示操作系统绕开本地文件系统缓存。
- W | 写入文件，文件不存在会被创建，存在则清空后写入。
- WX | 写入文件，排它方式打开。
- W+ | 读取并写入文件，文件不存在则创建文件，存在则清空后写入。
- wx+ | 和w+类似，排他方式打开。
- 追加写入，文件不存在则创建文件。
- ax | 与a类似，排他方式打开。
- a+ | 读取并追加写入，不存在则创建。
- ax+ | 与a+类似，排他方式打开。

**文件描述为 fd**

操作系统会为每个打开的文件分配一个名为文件描述符的数值标识，文件操作使用这些文件描述符来识别与追踪每个特定的文件

Window系统使用了一个不同但概念类似的机制来追踪资源，为方便用户，NodeJS抽象了不同操作系统间的差异，为所有打开的文件分配了数值的文件描述符

在NodeJS中，每操作一个文件，文件描述符是递增的，文件描述符一般从 3开始，因为前面有0、1、2三个比较特殊的描述符，分别代表 process.stdin（标准输入）、process.stdout (标准输出)和 process.stderr (错误输出)

### 常用读写方法

下面针对fs模块常用的方法进行展开：

- 文件读取

- 文件写入

- 文件追加写入

- 文件拷贝

- 创建目录

**文件读取**

**fs.readFileSync**

同步读取，参数如下：

第一个参数为读取文件的路径或文件描述符

- 第二个参数为options，默认值为null，其中有encoding(编码，默认为null)和flag(标识位，默认为 r)，也可直接传入 encoding

结果为返回文件的内容

```js
const fs = require("fs");

let buf = fs.readFileSync("1.txt");
let data = fs.readFileSync("1.txt", "utf8");

console.log(buf); // <Buffer 48 65 6c 6c 6f>
console.log(data); // Hello
```

**fs.readFile**

异步读取方法 readFile 与readFileSync 的前两个参数相同，最后一个参数为回调函数，函数内有两个参数err (错误)和 data (数据)，该方法没有返回值，回调函数在读取文件成功后执行

```js
const fs = require("fs");

fs.readFile("1.txt", "utf8", (err, data) => {
if(!err){
console.log(data); // Hello

});
```

**文件写入**

**writeFileSync**

同步写入，有三个参数：

第一个参数为写入文件的路径或文件描述符

- 第二个参数为写入的数据，类型为 String 或 Buffer

- 第三个参数为options，默认值为 null，其中有 encoding(编码，默认为 utf8)、flag(标识位，默认为w)和mode(权限位，默认为0o666)，也可直接传入encoding

```js
const fs = require("fs");

fs.writeFileSync("2.txt", "Hello world");
let data = fs.readFileSync("2.txt", "utf8");

console.log(data); // Hello world
```

**writeFile**

异步写入，writeFile与writeFileSync 的前三个参数相同，最后一个参数为回调函数，函数内有一个参数err(错误)，回调函数在文件写入数据成功后执行

```js
const fs = require("fs");

fs.writeFile("2.txt", "Hello world", err => {
if (!err) {
fs.readFile("2.txt", "utf8", (err, data) => {
console.log(data); // Hello world
});
}
});
```

**文件追加写入**

**appendFileSync**

参数如下：

- 第一个参数为写入文件的路径或文件描述符

第二个参数为写入的数据，类型为 String 或 Buffer

第三个参数为options，默认值为 null，其中有 encoding(编码，默认为utf8)、flag(标识位，

默认为a)和mode(权限位，默认为0o666)，也可直接传入encoding

```js
const fs = require("fs");

fs.appendFileSync("3.txt", " world");
let data = fs.readFileSync("3.txt", "utf8");
```

**appendFile**

异步追加写入方法 appendFile与appendFileSync 的前三个参数相同，最后一个参数为回调函数，函数内有一个参数err (错误)，回调函数在文件追加写入数据成功后执行

```js
const fs = require("fs");

fs.appendFile("3.txt", " world", err => {
if (!err) {
fs.readFile("3.txt", "utf8", (err, data) => {
console.log(data); // Hello world
});
}
});
```

### 文件拷贝与目录创建

**copyFileSync**

```js
const fs = require("fs");

fs.copyFileSync("3.txt","4.txt");
let data = fs.readFileSync("4.txt", "utf8");

console.log(data); // Hello world
```

**copyFile**

```js
const fs = require("fs");

fs.copyFile("3.txt", "4.txt", () => {
fs.readFile("4.txt", "utf8", (err, data) => {
console.log(data); // Hello world
});
});
```

**创建目录**

**mkdirSync**

同步创建，参数为一个目录的路径，没有返回值，在创建目录的过程中，必须保证传入的路径前面的文件目录都存在，否则会抛出异常

```js
// 假设已经有了 a 文件夹和 a 下的 b 文件夹
fs.mkdirSync("a/b/c")
```

**mkdir**

异步创建，第二个参数为回调函数

```js
fs.mkdir("a/b/c", err => {
if(!err) console.log("创建成功");
});
```

## 3. 说说对 Node 中的 Buffer 的理解？应用场景?

### 核心概念

在Node应用中，需要处理网络协议、操作数据库、处理图片、接收上传文件等，在网络流和文件的操作中，要处理大量二进制数据，而Buffer就是在内存中开辟一片区域(初次初始化为8KB)，用来存放二进制数据

在上述操作中都会存在数据流动，每个数据流动的过程中，都会有一个最小或最大数据量

如果数据到达的速度比进程消耗的速度快，那么少数早到达的数据会处于等待区等候被处理。反之，如果数据到达的速度比进程消耗的数据慢，那么早先到达的数据需要等待一定量的数据到达之后才能被处理

这里的等待区就指的缓冲区(Buffer），它是计算机中的一个小物理单位，通常位于计算机的 RAM中简单来讲，Nodejs不能控制数据传输的速度和到达时间，只能决定何时发送数据，如果还没到发送时间，则将数据放在 Buffer中，即在RAM中，直至将它们发送完毕

上面讲到了Buffer是用来存储二进制数据，其的形式可以理解成一个数组，数组中的每一项，都可以保存8位二进制：00000000，也就是一个字节

例如：

其存储过程如下图所示：

### 创建与编码

Buffer 类在全局作用域中，无须 require导入

创建Buffer的方法有很多种，我们讲讲下面的两种常见的形式：

- Buffer.from()

- Buffer.alloc()

**Buffer.from()**

```js
const b1 = Buffer.from('10');
const b2 = Buffer.from('10', 'utf8');
const b3 = Buffer.from([10]);
const b4 = Buffer.from(b3);

console.log(b1, b2, b3, b4); // <Buffer 31 30> <Buffer 31 30> <Buffer 0a> <
Buffer 0a>
```

**Buffer.alloc()**

```bash
const bAlloc1 = Buffer.alloc(10); // 创建—个大小为 10 个字节的缓冲区
const bAlloc2 = Buffer.alloc(10，1); //建—个长度为10的 Buffer,其中全部填充
了值为`1的字节
console.log(bAlloc1); // <Buffer 00 00 00 00 00 00 00 00 00 00>
console.log(bAlloc2); // <Buffer 01 01 01 01 01 01 01 01 01 01>
```

在上面创建buffer后，则能够toString的形式进行交互，默认情况下采取utf8字符编码形式，如下

```ts
const buffer = Buffer.from("你好");
console.log(buffer);
// <Buffer e4 bd a0 e5 a5 bd>
const str = buffer.toString();
console.log(str);
//你好
```

如果编码与解码不是相同的格式则会出现乱码的情况，如下：

```js
const buffer = Buffer.from("你好","utf-8 ");
console.log(buffer);
// <Buffer e4 bd a0 e5 a5 bd>
const str = buffer.toString("ascii");
console.log(str);
// d= e%=
```

当设定的范围导致字符串被截断的时候，也会存在乱码情况，如下：

```js
const buf = Buffer.from('Node.js 技术栈', 'UTF-8');

console.log(buf) // <Buffer 4e 6f 64 65 2e 6a 73 20 e6 8a 80 e6 9
C af e6 a0 88>
console.log(buf.length)// 17

console.log(buf.toString('UTF-8', 0, 9)) // Node.js
console.log(buf.toString('UTF-8', 0, 11)) // Node.js 技
```

**支持的字符编码**

- ascii：仅支持7 位 ASCIl数据，如果设置去掉高位的话，这种编码是非常快的

utf8:多字节编码的 Unicode字符，许多网页和其他文档格式都使用UTF-8

- utf16le：2或4 个字节，小字节序编码的 Unicode字符，支持代理对(U+10000至U+10FFFF)

ucs2，utf16le 的别名

base64：Base64 编码

- latin：一种把 Buffer 编码成一字节编码的字符串的方式

binary:latin1 的别名，

hex：将每个字节编码为两个十六进制字符

### 应用场景

Buffer的应用场景常常与流的概念联系在一起，例如有如下：

- I/O操作

- 加密解密

- zlib.js

**I/O 操作**

通过流的形式，将一个文件的内容读取到另外一个文件

```js
const fs = require('fs');

const inputStream = fs.createReadStream('input.txt'); // 创建可读流
const outputStream = fs.createWriteStream('output.txt'); // 创建可写流

inputStream.pipe(outputStream); // 管道读写
```

**加解密**

在一些加解密算法中会遇到使用 Buffer，例如 crypto.createCipheriv 的第二个参数 key
为 string 或 Buffer 类型

**zlib.js**

zlib.js 为Node.js 的核心库之一，其利用了缓冲区（Buffer）的功能来操作二进制数据流，提供了压缩或解压功能

## 4. 说说对 Node 中的 Stream 的理解？应用场景?

### 核心概念

流(Stream)，是一个数据传输手段，是端到端信息交换的一种方式，而且是有顺序的,是逐块读取数据、处理内容，用于顺序读取输入或写入输出

Node.js中很多对象都实现了流，总之它是会冒数据(以 Buffer 为单位)

它的独特之处在于，它不像传统的程序那样一次将一个文件读入内存，而是逐块读取数据、处理其内容，而不是将其全部保存在内存中

流可以分成三部分： source、dest、pipe

在 source 和 dest之间有一个连接的管道 pipe,它的基本语法是 source.pipe(dest)，source和dest就是通过pipe连接，让数据从 source 流向了 dest，如下图所示：

### 流的类型

在NodeJS，几乎所有的地方都使用到了流的概念，分成四个种类：

- 可写流:可写入数据的流。例如fs.createWriteStream()可以使用流将数据写入文件

- 可读流:可读取数据的流。例如fs.createReadStream()可以从文件读取内容

- 双工流：既可读又可写的流。例如 net.Socket

- 转换流：可以在数据写入和读取时修改或转换数据的流。例如，在文件压缩操作中，可以向文件写入压缩数据，并从文件中读取解压数据

在NodeJS 中 HTTP服务器模块中， request 是可读流，response 是可写流。还有 fs 模块，能同时处理可读和可写文件流

可读流和可写流都是单向的，比较容易理解，而另外两个是双向的

**双工流**

之前了解过websocket通信，是一个全双工通信，发送方和接受方都是各自独立的方法，发送和接收都没有任何关系

如下图所示：

基本代码如下：

```js
const { Duplex } = require('stream');

const myDuplex = new Duplex({
read(size) {
//..
},
write(chunk, encoding, callback) {
//..
}
});
```

**转换流**

双工流的演示图如下所示：

除了上述压缩包的例子，还比如一个 babel，把es6转换为，我们在左边写入 es6，从右边读取es5

基本代码如下所示：

```js
const { Transform } = require('stream');

const myTransform = new Transform({
transform(chunk, encoding, callback) {
//...
}
});
```

### 应用场景

stream 的应用场景主要就是处理 IO 操作，而 http 请求和文件操作都属于 IO 操作

试想一下，如果一次 IO 操作过大，硬件的开销就过大，而将此次大的 IO 操作进行分段操作，让数据像水管一样流动，直到流动完成

常见的场景有：

get请求返回文件给客户端

- 文件操作

- 一些打包工具的底层操作

**get请求返回文件给客户端**

使用 stream流返回文件，res 也是一个 stream对象，通过 pipe 管道将文件数据返回

```js
const server = http.createServer(function (req, res) {
const method= req.method; //获取请求方法
if (method === 'GET') { // get 请求
const fileName = path.resolve(__dirname, 'data.txt');
let stream = fs.createReadStream(fileName);
stream.pipe(res); // 将 res 作为 stream 的dest
}
});
server.listen(8000);
```

**文件操作**

创建一个可读数据流 readStream，一个可写数据流 writeStream，通过pipe管道把数据流转过去 AIX

```js
const fs = require('fs')
const path = require('path')

// 两个文件名
const fileName1 = path.resolve(__dirname, 'data.txt')
const fileName2 = path.resolve(__dirname, 'data-bak.txt')
// 读取文件的 stream 对象
const readStream = fs.createReadStream(fileName1)
// 写入文件的 stream 对象
const writeStream = fs.createWriteStream(fileName2)
// 通过 pipe执行拷贝，数据流转
readStream.pipe(writeStream)
//数据读取完成监听，即拷贝完成
readStream.on('end', function () {
console.log('拷贝完成')
})
```

**一些打包工具的底层操作**

目前一些比较火的前端打包构建工具，都是通过node.js编写的，打包和构建的过程肯定是文件频繁操作的过程，离不来 stream，如 gulp

## 5. 说说对 Node 中的 process 的理解？有哪些常用方法?

### 核心概念

process 对象是一个全局变量，提供了有关当前 Node.js进程的信息并对其进行控制，作为一个全局变量

我们都知道，进程计算机系统进行资源分配和调度的基本单位，是操作系统结构的基础，是线程的容器当我们启动一个js文件，实际就是开启了一个服务进程，每个进程都拥有自己的独立空间地址、数据栈，像另一个进程无法访问当前进程的变量、数据结构，只有数据通信后，进程之间才可以数据共享由于JavaScript 是一个单线程语言，所以通过 node xxx启动一个文件后，只有一条主线程

### 常用属性与方法

关于process常见的属性有如下：

- process.env:环境变量，例如通过\`process.env.NODE\_ENV获取不同环境项目配置信息

process.nextTick:这个在谈及 EventLoop 时经常为会提到

process.pid：获取当前进程id

process.ppid:当前进程对应的父进程

process.cwd()：获取当前进程工作目录，

- process.platform：获取当前进程运行的操作系统平台

process.uptime():当前进程已运行时间，例如：pm2守护进程的 uptime 值

进程事件：process.on(uncaughtException',cb)捕获异常信息、process.on(exit',cb)进程推出 监听

- 三个标准流:process.stdout 标准输出、process.stdin标准输入、process.stderr标准错误输出

process.title指定进程名称，有的时候需要给进程指定一个名称

下面再稍微介绍下某些方法的使用：

**process.cwd()**

返回当前Node进程执行的目录

一个 Node 模块 A 通过 NPM发布，项目 B 中使用了模块 A。在 A 中需要操作 B 项目下的文件时，就可以用process.cwd()来获取B 项目的路径

**process.argv**

在终端通过Node执行命令的时候，通过 process.argv 可以获取传入的命令行参数，返回值是一个数组：

- 0: Node 路径(一般用不到，直接忽略）

- 1:被执行的 JS 文件路径（一般用不到，直接忽略）

- 2\~n:真实传入命令的参数

所以，我们只要从 process.argv[2] 开始获取就好了

```js
const args = process.argv.slice(2);
```

**process.env**

返回一个对象，存储当前环境相关的所有信息，一般很少直接用到。

一般我们会在 process.env 上挂载一些变量标识当前的环境。比如最常见的用process.env.N0
DE\_ENV 区分 development 和production

在 vue-cli 的源码中也经常会看到 process.env.VUE\_CLI\_DEBUG 标识当前是不是DEBUG模式

**process.nextTick()**

我们知道NodeJs是基于事件轮询，在这个过程中，同一时间只会处理一件事情

在这种处理模式下， process.nextTick(）就是定义出一个动作，并且让这个动作在下一个事件轮询的时间点上执行

例如下面例子将一个fo0函数在下一个时间点调用

```js
function foo() {
console.error('foo');
}

process.nextTick(foo);
console.error('bar');
```

输出结果为 bar、foo

虽然下述方式也能实现同样效果：

```js
setTimeout(foo, 0);
console.log('bar');
```

两者区别在于：

process.nextTick()会在这一次event loop的call stack清空后(下一次event loop开始前)再调用 callback

setTimeout()是并不知道什么时候callstack清空的，所以何时调用callback函数是不确定的

## 6. 说说Node中的EventEmitter？如何实现一个EventEmitter?

### 核心概念

我们了解到，Node采用了事件驱动机制，而 EventEmitter就是Node实现事件驱动的基础

在EventEmitter的基础上，Node几乎所有的模块都继承了这个类，这些模块拥有了自己的事件，可以绑定/触发监听器，实现了异步操作

Node.js里面的许多对象都会分发事件，比如fs.readStream对象会在文件被打开的时候触发一个事件

这些产生事件的对象都是 events.EventEmitter的实例，这些对象有一个 eventEmitter.on()函数，用于将一个或多个函数绑定到命名事件上

### API 与使用方式

Node的 events模块只提供了一个EventEmitter类，这个类实现了Node异步事件驱动架构的基本模式——观察者模式

在这种模式中，被观察者(主体)维护着一组其他对象派来(注册)的观察者，有新的对象对主体感兴趣就注册观察者，不感兴趣就取消订阅，主体有更新的话就依次通知观察者们

基本代码如下所示：

```js
const EventEmitter = require('events')

class MyEmitter extends EventEmitter {}
const myEmitter =new MyEmitter()

function callback() {
console.log('触发了event事件！')
}
myEmitter.on('event', callback)
myEmitter.emit('event')
myEmitter.removeListener('event', callback);
```

通过实例对象的 on 方法注册一个名为 event的事件，通过 emit 方法触发该事件，而 removeListener用于取消事件的监听

关于其常见的方法如下：

emitter.addListener/on(eventName, listener):添加类型为 eventName的监听事件到事件数组尾部

- emitter.prependListener(eventName, listener)：添加类型为 eventName的监听事件到事件数组头部 VX

emitter.emit(eventName[,..args])：触发类型为 eventName 的监听事件

- emitter.removeListener/off(eventName, listener):移除类型为 eventName的监听事件

- emitter.once(eventName,listener):添加类型为 eventName的监听事件，以后只能执行一次并删除

emitter.removeAlIListeners([eventName]):移除全部类型为 eventName的监听事件

### 实现思路

通过上面的方法了解，EventEmitter是一个构造函数，内部存在一个包含所有事件的对象

```js
class EventEmitter {
constructor() {
this.events = {};
}
}
```

其中events存放的监听事件的函数的结构如下：

```js
{
"event1": [f1,f2,f3],
"event2": [f4,f5],
}
```

然后开始一步步实现实例方法，首先是emit，第一个参数为事件的类型，第二个参数开始为触发事件函数的参数，实现如下：

```js
emit(type, ...args) {
this.events[type].forEach((item) => {
Reflect.apply(item, this, args);
});
}
```

当实现了 emit方法之后，然后实现on、addListener、prependListener这三个实例方法，都是添加事件监听触发函数，实现也是大同小异

```js
on(type, handler) {
if (!this.events[type]) {
this.events[type] = [];
}
this.events[type].push(handler);
}

addListener(type,handler){
this.on(type,handler)
}

prependListener(type, handler) {
if (!this.events[type]) {
this.events[type] = [];
}
this.events[type].unshift(handler);

```

紧接着就是实现事件监听的方法removeListener/on

```js
removeListener(type, handler) {
if (!this.events[typel) {
return;
}
this.events[type] = this.events[type].filter(item => item !== handler)
i
}

off(type,handler){
this.removeListener(type,handler)
}
```

最后再来实现once方法，再传入事件监听处理函数的时候进行封装，利用闭包的特性维护当前状态，通过fired属性值判断事件函数是否执行过

```js
JavaScr
once(type, handler) {
this.on(type, this._onceWrap(type, handler, this));
}

_onceWrap(type, handler, target) {
const state = { fired: false, handler, type , target};
const wrapFn = this._onceWrapper.bind(state);
state.wrapFn = wrapFn;
return wrapFn;
}

_onceWrapper(...args) {
if (!this.fired) {
this.fired = true;
Reflect.apply(this.handler, this.target, args);
this.target.off(this.type, this.wrapFn);
}
}
```

### 完整实现与测试

```js
class EventEmitter {
constructor() {
this.events = {};
}

on(type, handler) {
if (!this.events[type]) {
this.events[type] = [];
}
this.events[type].push(handler);
}

addListener(type,handler){
this.on(type,handler)
}

prependListener(type, handler) {
if (!this.events[type]) {
this.events[type] = [];
}
this.events[type].unshift(handler);
}

removeListener(type, handler) {
if (!this.events[type]) {
return;
}
this.events[type] = this.events[type].filter(item => item !== hand
ler);
}

off(type,handler){
this.removeListener(type,handler)

emit(type, ...args) {
this.events[type].forEach((item) => {
Reflect.apply(item, this, args);
});
}

once(type, handler) {
this.on(type, this._onceWrap(type, handler, this));
}

```

```js
_onceWrap(type, handler, target) {
const state = { fired: false, handler, type , target};

const wrapFn = this._onceWrapper.bind(state);

state.wrapFn = wrapFn;

return wrapFn;

}

_onceWrapper(...args) {

if (!this.fired) {

this.fired = true;

Reflect.apply(this.handler, this.target, args);

this.target.off(this.type, this.wrapFn);

}

}

}
```

```js
const ee = new EventEmitter();

//注册所有事件
ee.once('wakeUp', (name) => { console.log(`${name} 1`); });
ee.on('eat', (name) => { console.log(^${name} 2`) });
ee.on('eat', (name) => { console.log(^${name} 3`) });
const meetingFn = (name) => { console.log(^${name} 4^) };
ee.on('work', meetingFn);
ee.on('work', (name) => { console.log(^${name} 5`) });

ee.emit('wakeUp', 'xx');
ee.emit('wakeUp', 'xx'); // 第二次没有触发
ee.emit('eat', 'xx');
ee.emit('work', 'xx');
ee.off('work', meetingFn); //移除事件
ee.emit('work', 'xx'); //再次工作
```

## 7. 说说 Node 文件查找的优先级以及 Require 方法的文件查找策略?

### CommonJS 模块与加载入口

NodeJS 对 CommonJS 进行了支持和实现，让我们在开发 node的过程中可以方便的进行模块化开发：

- 在Node中每一个js文件都是一个单独的模块

- 模块中包括CommonJS规范的核心变量：exports、module.exports、require

- 通过上述变量进行模块化开发

而模块化的核心是导出与导入，在Node中通过exports与module.exports负责对模块中的内容进行导出，通过require函数导入其他模块(自定义模块、系统模块、第三方库模块)中的内容

### 路径解析与查找规则

require 方法接收一下几种参数的传递：

原生模块：http、fs、path等

- 相对路径的文件模块：./mod或../mod

绝对路径的文件模块：/pathtomodule/mod

- 目录作为模块：./dirname

- 非原生模块的文件模块：mod

require参数较为简单，但是内部的加载却是十分复杂的，其加载优先级也各自不同，如下图：

从上图可以看见，文件模块存在缓存区，寻找模块路径的时候都会优先从缓存中加载已经存在的模块

**原生模块**

而像原生模块这些，通过require方法在解析文件名之后，优先检查模块是否在原生模块列表中，如果在则从原生模块中加载

**绝对路径、相对路径**

如果require绝对路径的文件，则直接查找对应的路径，速度最快相对路径的模块则相对于当前调用require的文件去查找

```js
['c:\\nodejs\\node\_modules',
'c:\\node\_modules']
```

JSON
1 = { "name" : "some-library",
2 "main" : "main.js" }

如果按确切的文件名没有找到模块，则NodeJs 会尝试带上js、json或node拓展名再加载

**目录作为模块**

默认情况是根据根目录中package.json文件的main来指定目录模块，如:

如果这是在./some-library node\_modules目录中，则require('./some-library')会试图加载./some-library/main.js

如果目录里没有 package.json文件，或者main入口不存在或无法解析，则会试图加载目录下的 index.js 或 index.node 文件

**非原生模块**

在每个文件中都存在module.paths，表示模块的搜索路径，require就是根据其来寻找文件

在 window下输出如下：

可以看出module path的生成规则为：从当前文件目录开始查找node\_modules目录；然后依次进入父目录，查找父目录下的node\_modules目录，依次迭代，直到根目录下的node\_modules目录

当都找不到的时候，则会从系统NODE\_PATH环境变量查找

**第三方模块查找示例**

如果在 /home/ry/projects/foo.js文件里调用了 require('bar.js')，则Node.js 会按以下顺序查找：

- /home/ry/projects/node\_modules/bar.js

- /home/ry/node\_modules/bar.js

- /home/node\_modules/bar.js

- /node\_modules/bar.js

这使得程序本地化它们的依赖，避免它们产生冲突

### 查找优先级

通过上面模块的文件查找策略之后，总结下文件查找的优先级：

缓存的模块优先级最高

- 如果是内置模块，则直接返回，优先级仅次缓存的模块

- 如果是绝对路径/开头，则从根目录找

如果是相对路径./开头，则从当前require文件相对位置找

- 如果文件没有携带后缀，先从js、json、node按顺序查找

- 如果是目录，则根据package.json的main属性值决定目录下入口文件，默认情况为index.js

- 如果文件为第三方模块，则会引入node\_modules 文件，如果不在当前仓库文件中，则自动从上级递归查找，直到根目录

## 8. 说说 Node有哪些全局对象?

### 全局对象的边界

在浏览器 JavaScript 中，通常 window 是全局对象，而 Nodejs中的全局对象是 global在NodeJS里，是不可能在最外层定义一个变量，因为所有的用户代码都是当前模块的，只在当前模块里可用，但可以通过exports对象的使用将其传递给模块外部

所以，在NodeJS中，用 var声明的变量并不属于全局的变量，只在当前模块生效

像上述的global全局对象则在全局作用域中，任何全局变量、函数、对象都是该对象的一个属性值

将全局对象分成两类：

- 真正的全局对象

- 模块级别的全局变量

### 真正的全局对象

下面给出一些常见的全局对象：

- Class:Buffer

- process

- console

clearlnterval、setInterval

clearTimeout、setTimeout

- global

**Class:Buffer**

可以处理二进制以及非Unicode编码的数据

在Buffer类实例化中存储了原始数据。Buffer类似于一个整数数组，在V8堆原始存储空间给它分配了内存

一旦创建了Buffer实例，则无法改变大小

**process**

进程对象，提供有关当前进程的信息和控制

包括在执行 node程序进程时，如果需要传递参数，我们想要获取这个参数需要在process内置对象中

启动进程：

```text
node index.js 参数1 参数2参数3
```

index.js文件如下：

```js
process.argv.forEach((val, index) => {
console.log(^${index}: ${val}`);
});
```

输出如下：

```js
/usr/local/bin/node
/Users/mjr/work/node/process-args.js
参数1
参数2
参数3
```

除此之外，还包括一些其他信息如版本、操作系统等

```yaml
process {
version: 'v12.16.1'
versions: {
node: '12.16.1',
v8:'7.8.279.23-node.31',
uv: '1.34.0'
zlib: '1.2.11',
brotli: '1.0.7'
ares: '1.15.0',
modules: '72',
nghttp2:'1.40.0'
napi: '5'
http: '2.0.4',
http_parser: '2.9.3'
openssl: '1.1.1d
cldr: '35.1',
icu: '64.2',
tz:'2019c',
unicode: '12.1'
},
arch: 'x64'
platform: 'win32',
release: {
name: 'node'
lts: 'Erbium'
sourceUrl: 'https://nodejs.org/download/release/v12.16.1/node-v12.16.1.tar.gz',
headersUr1: 'https://nodejs.org/download/release/v12.16.1/node-v12.16.1-headers
.tar.gz'
libUrl: 'https://nodejs.org/download/release/v12.16.1/win-x64/node.lib'
_rawDebug:[Function: _rawDebug],
moduleLoadList: [
'Internal Binding native_module'
'Internal Binding errors
'Internal Binding buffer
```

**console**

用来打印 stdout 和 stderr

最常用的输入内容的方式：console.log

1 console.log("hello");

清空控制台：console.clear

1console.clear

打印函数的调用栈：console.trace

```js
function test() {
demo( );
}

function demo() {
foo( );
}

function foo( ) {
console.trace();
}

test();
```

Trace
at foo (E:\Users\user\Desktop\111\index.js:10:13)
at demo(E:\Users\user\Desktop\111\index.js:6:5)
at test(E:\Users\user\Desktop\111\index.js:2:5)
at Object.<anonymous>(E:\Users\user\Desktop\111\index.js:13:3)
at Module.\_compile (internal/modules/cjs/loader.js:1158:30)
at Object.Module.\_extensions..js(internal/modules/cjs/loader.js:1178:10)
at Module.load (internal/modules/cjs/loader.js:1002:32)
at Function.Module.\_load (internal/modules/cjs/loader.js:901:14)
at Function.executeUserEntryPoint [as runMain] (internal/modules/run\_main.js:74:12)
at internal/main/run\_main\_module.js:18:47

**clearlnterval、setInterval**

设置定时器与清除定时器

1 setInterval(callback, delay[, ...args])
callback每delay毫秒重复执行一次
clearInterval则为对应发取消定时器的方法

**clearTimeout、setTimeout**

设置延时器与清除延时器

```js
setTimeout(callback,delay[,...args])
```

callback 在delay 毫秒后执行一次

clearTimeout则为对应取消延时器的方法

**global**

全局命名空间对象，墙面讲到的process console、 setTimeout等都有放到 global中

```js
console.log(process === global.process) // true
```

### 模块级全局变量

这些全局对象是模块中的变量，只是每个模块都有，看起来就像全局变量，像在命令交互中是不可以使用，包括：

- \_\_dirname

- \_\_filename

- exports

- module

- require

**\_\_dirname**

获取当前文件所在的路径，不包括后面的文件名

```js
从/Users/mjr 运行 node example.js :
```

```js
console.log(__dirname);
// 打印：/Users/mjr
```

**\_\_filename**

获取当前文件所在的路径和文件名称，包括后面的文件名称

从/Users/mjr运行 node example.js:

```js
console.log(\_\_filename);
//打印:/Users/mjr/example.js
```

**exports**

module.exports 用于指定一个模块所导出的内容，即可以通过 require()访问的内容

```js
exports.name = name;
exports.age = age;
exports.sayHello = sayHello;
```

**module**

对当前模块的引用，通过 module.exports 用于指定一个模块所导出的内容，即可以通过 require(）访问的内容

**require**

用于引入模块、JSON、或本地文件。可以从node\_modules引入模块。

可以使用相对路径引入本地模块或JSON文件，路径会根据\_\_dirname定义的目录名或当前工作目录进行处理

## 9. 说说对中间件概念的理解，如何封装 node中间件?

### 中间件与洋葱模型

中间件(Middleware)是介于应用系统和系统软件之间的一类软件，它使用系统软件所提供的基础服务(功能)，衔接网络上应用系统的各个部分或不同的应用，能够达到资源共享、功能共享的目的

在NodeJS中，中间件主要是指封装http请求细节处理的方法

例如在express、koa等web框架中，中间件的本质为一个回调函数，参数包含请求对象、响应对象和执行下一个中间件的函数

在这些中间件函数中，我们可以执行业务逻辑代码，修改请求和响应对象、返回响应数据等操作

### Koa 中间件封装

koa是基于NodeJS当前比较流行的web框架，本身支持的功能并不多，功能都可以通过中间件拓展实现。通过添加不同的中间件，实现不同的需求，从而构建一个Koa 应用

Koa 中间件采用的是洋葱圈模型，每次执行下一个中间件传入两个参数：

ctx：封装了request 和 response 的变量

- next：进入下一个要执行的中间件的函数

下面就针对koa进行中间件的封装：

Koa的中间件就是函数，可以是async 函数，或是普通函数

```js
// async 函数
app.use(async (ctx, next) => {
const start = Date.now();
await next();
const ms = Date.now() - start;
console.log(^${ctx.method} ${ctx.url} - ${ms}ms^);
});

// 普通函数
app.use((ctx, next) => {
const start = Date.now();
return next().then(() => {
const ms = Date.now() - start;
console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
});
```

下面则通过中间件封装http请求过程中几个常用的功能：

**token校验**

```js
module.exports = (options) => async (ctx, next) {
try {
// 获取 token
const token = ctx.header.authorization
if (token) {
try
// verify 函数验证 token，并获取用户相关信息
await verify(token)
catch (err) {
console.log(err)

//进入下一个中间件
await next()
} catch (err) {
console.log(err)
}
}
```

**日志模块**

```js
const fs = require('fs')
module.exports = (options) => async (ctx, next) => {
const startTime = Date.now()
const requestTime = new Date()
await next()
const ms = Date.now() - startTime;
let logout = `${ctx.request.ip} -- ${requestTime} -- ${ctx.method} -- ${
ctx.url} -- ${ms}ms`;
//输出日志文件
fs.appendFileSync('./log.txt', logout + '\n')
}
```

Koa 存在很多第三方的中间件，如 koa-bodyparser、koa-static等

下面再来看看它们的大体的简单实现：

**koa-bodyparser**

koa-bodyparser 中间件是将我们的post请求和表单提交的查询字符串转换成对象，并挂在ctx.request.body 上，方便我们在其他中间件或接口处取值

```js
// 文件:my-koa-bodyparser.js
const querystring = require("querystring");

module.exports = function bodyParser() {
return async (ctx, next) => {
await new Promise((resolve, reject) => {
// 存储数据的数组
let dataArr = [];

//接收数据
ctx.req.on("data", data => dataArr.push(data));

//整合数据并使用 Promise 成功
ctx.req.on("end", () => {
//获取请求数据的类型json 或表单
let contentType = ctx.get("Content-Type");

// 获取数据 Buffer 格式
let data = Buffer.concat(dataArr).toString();

if (contentType === "application/x-www-form-urlencoded") {
//如果是表单提交，则将查询字符串转换成对象赋值给ctx.reques
t.body
ctx.request.body = querystring.parse(data);
} else if (contentType === "application/json") {
//如果是 json，则将字符串格式的对象转换成对象赋值给ctx.requ
est.body
ctx.request.body = JSON.parse(data);

// 执行成功的回调
resolve();

});

// 继续向下执行
await next();
};
};
```

**koa-static**

koa-static中间件的作用是在服务器接到请求时，帮我们处理静态文件

```js
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const { promisify } = require("util");

//将 stat 和 access 转换成 Promise
const stat = promisify(fs.stat);
const access = promisify(fs.access)

module.exports = function (dir) {
return async (ctx, next) => {
//将访问的路由处理成绝对路径，这里要使用join因为有可能是/
let realPath = path.join(dir, ctx.path);

try {
// 获取 stat 对象
let statObj = await stat(realPath);

//如果是文件，则设置文件类型并直接响应内容，否则当作文件夹寻找index.ht
ml
if (statObj.isFile()) {
ctx.set("Content-Type",`${mime.getType()};charset=utf8`);
ctx.body = fs.createReadStream(realPath);
} else {
let filename = path.join(realPath, "index.html");

//如果不存在该文件则执行catch 中的next 交给其他中间件处理
await access(filename);

//存在设置文件类型并响应内容
ctx.set("Content-Type","text/html;charset=utf8");
ctx.body = fs.createReadStream(filename);

catch (e) {
await next();

}
```

### 设计原则

在实现中间件时候，单个中间件应该足够简单，职责单一，中间件的代码编写应该高效，必要的时候通过缓存重复获取数据

koa 本身比较简洁，但是通过中间件的机制能够实现各种所需要的功能，使得web应用具备良好的可拓展性和组合性

通过将公共逻辑的处理编写在中间件中，可以不用在每一个接口回调中做相同的代码编写，减少了冗杂代码，过程就如装饰者模式

## 10. 说说对Node.js中的事件循环机制理解?

### 运行机制

在浏览器事件循环中，我们了解到javascript在浏览器中的事件循环机制，其是根据HTML5定义的规范来实现

而在NodeJS中，事件循环是基于 libuv实现，libuv是一个多平台的专注于异步IO的库，如下图最右侧所示：

上图EVENT\_QUEUE 给人看起来只有一个队列，但EventLoop存在6个阶段，每个阶段都有对应的一个先进先出的回调队列

### 阶段与任务队列

上节讲到事件循环分成了六个阶段，对应如下：

timers阶段：这个阶段执行timer(setTimeout、setInterval)的回调

定时器检测阶段(timers):本阶段执行timer的回调，即setTimeout、setInterval里面的回调函数

- I/O事件回调阶段(I/Ocallbacks):执行延迟到下一个循环迭代的I/O回调，即上一轮循环中未被执行的一些I/O回调

- 闲置阶段(idle,prepare)：仅系统内部使用

- 轮询阶段(poll):检索新的 I/O事件;执行与 I/O相关的回调(几乎所有情况下，除了关闭的回调函数，那些由计时器和 setImmediate()调度的之外)，其余情况 node将在适当的时候在此阻塞

- 检查阶段(check):setImmediate()回调函数在这里执行

- 关闭事件回调阶段(close callback):一些关闭的回调函数，如：socket.on('close',...)

每个阶段对应一个队列，当事件循环进入某个阶段时，将会在该阶段内执行回调，直到队列耗尽或者回调的最大数量已执行，那么将进入下一个处理阶段

除了上述6个阶段，还存在process.nextTick，其不属于事件循环的任何一个阶段，它属于该阶段与下阶段之间的过渡，即本阶段执行结束，进入下一个阶段前，所要执行的回调，类似插队流程图如下所示：

在Node中，同样存在宏任务和微任务，与浏览器中的事件循环相似

微任务对应有：

- next tick queue: process.nextTick

- other queue:Promise的then回调、queueMicrotask

宏任务对应有：

- timer queue: setTimeout、setInterval

poll queue:IO事件

- check queue: setImmediate

- close queue:close事件

其执行顺序为：

- next tick microtask queue

- other microtask queue

- timer queue

- poll queue

- check queue

- close queue

### 示例执行顺序

通过上面的学习，下面开始看看题目

```js
async function async1() {
console.log('async1 start')
await async2()
console.log('async1 end')
}

async function async2() {
console.log('async2')
}

console.log('script start')

setTimeout(function () {
console.log('setTimeout0')
},0)

setTimeout(function () {
console.log('setTimeout2')
},300)

setImmediate(() => console.log('setImmediate'));

process.nextTick(() => console.log('nextTick1'));

async1();

process.nextTick(() => console.log('nextTick2'));

new Promise(function (resolve) {
console.log('promise1')
resolve();
console.log('promise2')
}).then(function () {
console.log('promise3')
})

console.log('script end')
```

**执行过程**

- 先找到同步任务，输出script start

- 遇到第一个 setTimeout，将里面的回调函数放到 timer 队列中

遇到第二个 setTimeout，300ms后将里面的回调函数放到 timer队列中

- 遇到第一个setImmediate，将里面的回调函数放到 check队列中

- 遇到第一个 nextTick，将其里面的回调函数放到本轮同步任务执行完毕后执行

- 执行 async1函数，输出 async1 start

- 执行 async2 函数，输出async2，async2 后面的输出 async1 end进入微任务，等待下一轮的事件循环

- 遇到第二个，将其里面的回调函数放到本轮同步任务执行完毕后执行

- 遇到 new Promise，执行里面的立即执行函数，输出 promise1、promise2

then里面的回调函数进入微任务队列

遇到同步任务，输出 script end

- 执行下一轮回到函数，先依次输出 nextTick的函数，分别是nextTick1、nextTick2

然后执行微任务队列，依次输出 async1 end、promise3

执行timer队列，依次输出setTimeout0

- 接着执行 check 队列，依次输出 setImmediate

- 300ms后，timer 队列存在任务，执行输出 setTimeout2

执行结果如下：

- Plain Text
- 1 | script start
- 2 async1 start 3 async2
- 4 promise1 5
- promise2
- 6 script end 7 nextTick1
- 8 nextTick2
- 9 async1 end
- A promise3
- 10 11 setTimeout0
- setImmediate
- 12 13 setTimeout2

### setTimeout 与 setImmediate

最后看 setTimeout 与 setImmediate 的输出顺序：

```js
setTimeout(() => {
console.log("setTimeout");
}, 0);

setImmediate(() => {
console.log("setImmediate");
});
```

可能有两种输出：

```js
情况一：
setTimeout
setImmediate
情况二：
setImmediate
setTimeout
```

**顺序差异原因**

外层同步代码一次性全部执行完，遇到异步API就塞到对应的阶段

- 遇到 setTimeout，虽然设置的是0毫秒触发，但实际上会被强制改成1ms，时间到了然后塞入times阶段

- 遇到 setImmediate 塞入 check 阶段

同步代码执行完毕，进入Event Loop

- 先进入 times阶段，检查当前时间过去了1毫秒没有，如果过了1毫秒，满足 setTimeout 条件，执行回调，如果没过1毫秒，跳过

- 跳过空的阶段，进入check阶段，执行 setImmediate 回调

这里的关键在于这1ms，如果同步代码执行时间较长，进入 Event Loop的时候1毫秒已经过了， setTimeout 先执行，如果1毫秒还没到，就先执行了setImmediate

## 11. Node性能如何进行监控以及优化?

### 监控指标

Node作为一门服务端语言，性能方面尤为重要，其衡量指标一般有如下：

- CPU

- 内存

- 1/0

· 网络

**CPU**

主要分成了两部分：

CPU负载：在某个时间段内，占用以及等待CPU的进程总数

- CPU使用率：CPU时间占用状况，等于1-空闲CPU时间(idle time)/ CPU总时间

这两个指标都是用来评估系统当前CPU的繁忙程度的量化指标

Node 应用一般不会消耗很多的CPU，如果 CPU占用率高，则表明应用存在很多同步操作，导致异步任务回调被阻塞

**内存指标**

内存是一个非常容易量化的指标。内存占用率是评判一个系统的内存瓶颈的常见指标。对于Node来说，内部内存堆栈的使用状态也是一个可以量化的指标

```js
// /app/lib/memory.js
const os = require('os');
//获取当前Node内存堆栈情况
const { rss, heapUsed, heapTotal } = process.memoryUsage();
// 获取系统空闲内存
const sysFree = os.freemem();
//获取系统总内存
const sysTotal = os.totalmem();

module.exports = {
memory: ( ) => {
return {
sys： 1 - sysFree / sysTotal， // 系统内存占用率
heap: heapUsed / headTotal, // Node堆内存占用率
node: rss / sysTotal, // Node占用系统内存的比例
}
}
}
```

rss：表示node进程占用的内存总量。

- heapTotal:表示堆内存的总量。

heapUsed：实际堆内存的使用量。

external：外部程序的内存使用量，包含Node核心的C++程序的内存使用量

在Node中，一个进程的最大内存容量为1.5GB。因此我们需要减少内存泄露

**磁盘 I/O**

硬盘的 I/O 开销是非常昂贵的，硬盘IO 花费的 CPU 时钟周期是内存的 164000 倍

内存 I/O比磁盘I/O快非常多，所以使用内存缓存数据是有效的优化方法。常用的工具如

redis memcached等

并不是所有数据都需要缓存，访问频率高，生成代价比较高的才考虑是否缓存，也就是说影响你性能瓶颈的考虑去缓存，并且而且缓存还有缓存雪崩、缓存穿透等问题要解决

### 监控工具

关于性能方面的监控，一般情况都需要借助工具来实现

这里采用 Easy-Monitor 2.0，其是轻量级的 Node.js 项目内核性能监控 +分析工具，在默认模式下，只需要在项目入口文件require一次，无需改动任何业务代码即可开启内核级别的性能监控分析

使用方法如下：

在你的项目入口文件中按照如下方式引入，当然请传入你的项目名称：

```js
const easyMonitor = require('easy-monitor');
easyMonitor('你的项目名称');
```

打开你的浏览器，访问http://localhost:12333，即可看到进程界面

关于定制化开发、通用配置项以及如何动态更新配置项详见官方文档

### 优化方法

关于Node的性能优化的方式有：

使用最新版本Node.js

- 正确使用流 Stream

- 代码层面优化

- 内存管理优化

**使用最新版本Node.js**

每个版本的性能提升主要来自于两个方面：

8 的版本更新

- Node.js 内部代码的更新优化

**正确使用流 Stream**

在Node中，很多对象都实现了流，对于一个大文件可以通过流的形式发送，不需要将其完全读入内存

```js
const http = require('http');
const fs = require('fs');

// bad
http.createServer(function (req, res) {
fs.readFile(__dirname + '/data.txt', function (err, data) {
res.end(data);
});
});

// good
http.createServer(function (req, res) {
const stream = fs.createReadStream(__dirname + '/data.txt');
stream.pipe(res);
});
```

**代码层面优化**

合并查询，将多次查询合并一次，减少数据库的查询次数

```js
// bad
for user_id in userIds
let account = user_account.findOne(user_id)

// good
const user_account_map = {}//注意这个对象将会消耗大量内存。
user_account.find(user_id in user_ids).forEach(account){
user_account_map[account.user_id] = account
}
for user_id in userIds
var account = user_account_map[user_id]
```

**内存管理优化**

在V8中，主要将内存分为新生代和老生代两代：

新生代：对象的存活时间较短。新生对象或只经过一次垃圾回收的对象

- 老生代：对象存活时间较长。经历过一次或多次垃圾回收的对象

若新生代内存空间不够，直接分配到老生代

通过减少内存占用，可以提高服务器的性能。如果有内存泄露，也会导致大量的对象存储到老生代中，服务器性能会大大降低

如下面情况：

```js
const buffer = fs.readFileSync(__dirname + '/source/index.htm');

app.use(
mount('/', async (ctx) => {
ctx.status = 200;
ctx.type = 'html';
ctx.body = buffer;
leak.push(fs.readFileSync(__dirname + '/source/index.htm'));
})
);

const leak = [];
```

leak的内存非常大，造成内存泄露，应当避免这样的操作，通过减少内存使用，是提高服务性能的手段之一

而节省内存最好的方式是使用池，其将频用、可复用对象存储起来，减少创建和销毁操作

例如有个图片请求接口，每次请求，都需要用到类。若每次都需要重新new这些类，并不是很合适，在大量请求时，频繁创建和销毁这些类，造成内存抖动

使用对象池的机制，对这种频繁需要创建和销毁的对象保存在一个对象池中。每次用到该对象时，就取对象池空闲的对象，并对它进行初始化操作，从而提高框架的性能

## 12. 如何实现文件上传？说说你的思路

### 上传协议

文件上传在日常开发中应用很广泛，我们发微博、发微信朋友圈都会用到了图片上传功能

因为浏览器限制，浏览器不能直接操作文件系统的，需要通过浏览器所暴露出来的统一接口，由用户主动授权发起来访问文件动作，然后读取文件内容进指定内存里，最后执行提交请求操作，将内存里的文件内容数据上传到服务端，服务端解析前端传来的数据信息后存入文件里

对于文件上传，我们需要设置请求头为content-type:multipart/form-data

multipart互联网上的混合资源，就是资源由多种元素组成，form-data表示可以使用HTMLForms和POST 方法上传文件

结构如下：

HTTP
1 POST /t2/upload.do HTTP/1.1
```js
User-Agent: SOHUWapRebot
Accept-Language: zh-cn,zh;q=0.5
```
Accept-Charset: GBK,utf-8;q=0.7,\*;q=0.7
```js
Connection: keep-alive
Content-Length: 60408
Content-Type:multipart/form-data; boundary=ZnGpDtePMx0KrHh\_G0X99Yef9r8JZsR
```
JSXC
8 Host: w.sohu.com
10 --ZnGpDtePMx0KrHh\_G0X99Yef9r8JZsRJSXC
11 Content-Disposition: form-data; name="city"
13 Santa colo
14 --ZnGpDtePMx0KrHh\_G0X99Yef9r8JZsRJSXC
```js
Content-Disposition: form-data;name="desc"
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit
```
20 --ZnGpDtePMx0KrHh\_G0X99Yef9r8JZsRJSXC
```js
Content-Disposition: form-data;name="pic"; filename="photo.jpg"
Content-Type: application/octet-stream
Content-Transfer-Encoding: binary
```
25 ... binary data of the jpg ...
26 --ZnGpDtePMx0KrHh\_G0X99Yef9r8JZsRJSXC--

Content-Disposition 包含了 type 和一个名字为 name的 parameter，type 是 for
m-data，name参数的值则为表单控件(也即 field)的名字，如果是文件，那么还有一个 filena
me参数，值就是文件名

boundary表示分隔符，如果要上传多个表单项，就要使用 boundary 分割，每个表单项由 ——XXX 开始，以——XXX 结尾

而xxx是即时生成的字符串，用以确保整个分隔符不会在文件或表单项的内容中出现

每个表单项必须包含一个 Content-Disposition 头，其他的头信息则为可选项，比如 Content
-Type

```html
Content-Disposition: form-data; name="user"; filename="logo.png"
```

至于使用multipart/form-data，是因为文件是以二进制的形式存在，其作用是专门用于传输大型二进制数据，效率高

关于文件上传，可以分成两个步骤：

- 文件的上传

- 文件的解析

### 前端提交

传统前端文件上传的表单结构如下：

```html
<form action="http://localhost:8080/api/upload" method="post" enctype="mult
```

ipart/form-data">
2 <input type="file" name="file" id="file"value="" multiple="multiple" /
>
3 <input type="submit"value="提交"/>
`</form>`

action 就是我们的提交到的接口，enctype="multipart/form-data" 就是指定上传文件格式，input 的 name 属性一定要等于 file

### 服务端解析与保存

在服务器中，这里采用koa2中间件的形式解析上传的文件数据，分别有下面两种形式:

- koa-body

- koa-multer

**koa-body**

安装依赖

1npm install koa-body

引入 koa-body中间件

```js
const koaBody = require('koa-body');
app.use(koaBody({
multipart: true,
formidable: {
maxFileSize: 200*1024*1024 // 设置上传文件大小最大限制，默认2M
}
}));
```

获取上传的文件

```js
const file = ctx.request.files.file; // 获取上传文件
```

获取文件数据后，可以通过fs模块将文件保存到指定目录

```text
npm install koa-multer
```

```js
router.post('/uploadfile', async (ctx, next) => {
// 上传单个文件
const file = ctx.request.files.file; //获取上传文件
//创建可读流
const reader = fs.createReadStream(file.path);
let filePath = path.join(__dirname, public/upload/') +`/${file.name}`;
// 创建可写流
const upStream = fs.createWriteStream(filePath);
// 可读流通过管道写入可写流
reader.pipe(upStream);
return ctx.body = "上传成功！ ";
});
```

**koa-multer**

安装依赖：

使用 multer 中间件实现文件上传

```js
const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, "./upload/")
},
filename: (req, file, cb) => {
cb(null, Date.now() + path.extname(file.originalname))
}
})

const upload = multer({
storage
});

const fileRouter = new Router();

fileRouter.post("/upload", upload.single('file'), (ctx, next) => {
console.log(ctx.req.file); // 获取文件
})

app.use(fileRouter.routes());
```

## 13. 如何实现jwt鉴权机制？说说你的思路

### JWT 结构与鉴权流程

JWT(JSON WebToken)，本质就是一个字符串书写规范，如下图，作用是用来在用户和服务器之间传递安全可靠的信息

示例 Token：

```text
eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9. eyJzdWIiOiIxMjM0NTY30DkwIiwibmFtZSI6IkpvaG4 gRG91IiwiaXNTb2NpYWwiOnRydWV9. 4pcPyMD09o1PSyXnrXCjTwXyr4BsezdI1AVTmud2fU4
```

在目前前后端分离的开发过程中，使用token鉴权机制用于身份验证是最常见的方案，流程如下：

- 服务器当验证用户账号和密码正确的时候，给用户颁发一个令牌，这个令牌作为后续用户访问一些接口的凭证

- 后续访问会根据这个令牌判断用户时候有权限进行访问

Token，分成了三部分，头部(Header)、载荷(Payload)、签名(Signature)，并以进行拼接。其中头部和载荷都是以JSON格式存放数据，只是进行了编码

**header**

每个JWT都会带有头部信息，这里主要声明使用的算法。声明算法的字段名为 alg，同时还有一个 typ的字段，默认 JWT即可。以下示例中算法为HS256

JSON
1 { "alg": "HS256", "typ": "JWT" }

因为JWT是字符串，所以我们还需要对以上内容进行Base64编码，编码后字符串如下：

```text
eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9
```

**payload**

载荷即消息体，这里会存放实际的内容，也就是Token的数据声明，例如用户的 id和 name，默认情况下也会携带令牌的签发时间iat，通过还可以设置过期时间，如下：

JSON
1 - {
2 "sub":"1234567890",
3 "name": "John Doe",
4 "iat": 1516239022
5 }

同样进行Base64编码后，字符串如下：

```text
eyJzdWIi0iIxMjM0NTY30DkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
```

**Signature**

签名是对头部和载荷内容进行签名，一般情况，设置一个 secretKey，对前两个的结果进行 HMACSHA25算法，公式如下：

```js
Signature=HMACSHA256(base64Url(header)+.+base64Url(payload),secretKey)
```

一旦前面两部分数据被篡改，只要服务器加密用的密钥没有泄露，得到的签名肯定和之前的签名不一致

### 生成与校验 Token

Token的使用分成了两部分：

生成token：登录成功的时候，颁发token

- 验证token：访问某些资源或者接口时，验证token

**生成 token**

借助第三方库jsonwebtoken，通过jsonwebtoken 的 sign 方法生成一个 token：

- 第一个参数指的是 Payload

第二个是秘钥，服务端特有

- 第三个参数是 option，可以定义 token 过期时间

```js
const crypto = require("crypto"),
jwt = require("jsonwebtoken");
// TOD0:使用数据库
//这里应该是用数据库存储，这里只是演示用
let userList = [];

class UserController {
// 用户登录
static async login(ctx) {
const data = ctx.request.body;
if (!data.name || !data.password) {
return ctx.body = {
code: "000002",
message:"参数不合法"
}
}
const result = userList.find(item => item.name === data.name && item.p
assword === crypto.createHash('md5').update(data.password).digest('hex'))
if (result) {
// 生成token
const token = jwt.sign(
{
name: result.name
},
"test_token", // secret
{ expiresIn: 60 * 60 } // 过期时间: 60 * 60 s
);
return ctx.body = {
code: "0",
message："登录成功",
data: {
token

};
else {
return ctx.body = {
code: "000002",
message："用户名或密码错误"
};
}
}
}

module.exports = UserController;
```

在前端接收到 token 后，一般情况会通过 localStorage 进行缓存，然后将 token放到HTTP请求头Authorization中，关于Authorization的设置，前面要加上 Bearer，注意后面带有空格

```js
axios.interceptors.request.use(config => {
const token = localStorage.getItem('token');
config.headers.common['Authorization'] = 'Bearer '+ token; // 留意这里的
Authorization
return config;
})
```

**校验token**

使用 koa-jwt 中间件进行验证，方式比较简单

```js
/注意：放在路由前面
app.use(koajwt({
secret: 'test_token'
}).unless({ // 配置白名单
path: [/\/api\/register/,/\/api\/login/]
}))
```

secret 必须和 sign 时候保持一致

- 可以通过unless配置接口白名单，也就是哪些URL可以不用经过校验，像登陆/注册都可以不用校验

校验的中间件需要放在需要校验的路由前面，无法对前面的URL进行校验

获取token用户的信息方法如下:

```js
router.get('/api/userInfo',async (ctx,next) =>{
const authorization = ctx.header.authorization // 获取jwt
const token = authorization.replace('Beraer ','')
const result = jwt.verify(token,'test_token')
ctx.body = result
```

注意:上述的HMA256加密算法为单秘钥的形式，一旦泄露后果非常的危险

在分布式系统中，每个子系统都要获取到秘钥，那么这个子系统根据该秘钥可以发布和验证令牌，但有些服务器只需要验证令牌

这时候可以采用非对称加密，利用私钥发布令牌，公钥验证令牌，加密算法可以选择RS256

### 优缺点

优点：

json具有通用性，所以可以跨语言

- 组成简单，字节占用小，便于传输

服务端无需保存会话信息，很容易进行水平扩展

- 一处生成，多处使用，可以在分布式系统中，解决单点登录问题

可防护CSRF攻击

缺点：

- payload部分仅仅是进行简单编码，所以只能用于存储逻辑必需的非敏感信息

- 需要保护好加密密钥，一旦泄露后果不堪设想

为避免token被劫持，最好使用https协议

## 14. 如果让你来设计一个分页功能，你会怎么设计？前后端如何交互？

### 分页模型

在我们做数据查询的时候，如果数据量很大，比如几万条数据，放在一个页面显示的话显然不友好，这时候就需要采用分页显示的形式，如每次只显示10条数据

- 共1000条 | < | 1 | 3 | 5 | 6 | 7 | 10 | >

要实现分页功能，实际上就是从结果集中显示第 1–10 条记录作为第 1 页，显示第 11–20 条记录作为第 2 页，以此类推。因此，分页实际上就是从结果集中截取出第 M–N 条记录

### 前后端交互与查询实现

前端实现分页功能，需要后端返回必要的数据，如总的页数，总的数据量，当前页，当前的数据

```js
{
  "totalCount": 1836, // 总条数
  "totalPages": 92, // 总页数
  "currentPage": 1, // 当前页数
  "data": [
    { /* 当前页的数据 */ }
  ]
}
```

后端采用mysql作为数据的持久性存储

前端向后端发送目标的页码page以及每页显示数据的数量pageSize，默认情况每次取10条数据，则每一条数据的起始位置start为：

```js
const start = (page - 1) * pageSize;
```

当确定了 limit和start 的值后，就能够确定 SQL 语句：

```js
const sql = `SELECT * FROM record LIMIT ${pageSize} OFFSET ${start}`;
```

上诉 SQL 语句表达的意思为：截取从 start到 start + pageSize 之间(左闭右开)的数据关于查询数据总数的 SQL语句为，record为表名：

```sql
SELECT COUNT(*) FROM record;
```

因此后端的处理逻辑为：

获取用户参数页码数page和每页显示的数目 pageSize，其中page 是必须传递的参数，pageSize为可选参数，默认为10

编写 SQL 语句，利用limit 和 OFFSET 关键字进行分页查询

查询数据库，返回总数据量、总页数、当前页、当前页数据给前端

代码如下所示：

```js
router.all('/api', function (req, res, next) {
  let param = '';
  // 获取参数
  if (req.method === 'POST') {
    param = req.body;
  } else {
    param = req.query || req.params;
  }

  if (param.page === '' || param.page == null) {
    res.end(JSON.stringify({ msg: '请传入参数page', status: '102' }));
    return;
  }

  const pageSize = param.pageSize || 10;
  const start = (param.page - 1) * pageSize;
  const sql = `SELECT * FROM record LIMIT ${pageSize} OFFSET ${start}`;

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(sql, function (err, results) {
      connection.release();
      if (err) {
        throw err;
      } else {
        // 计算总页数
        const allCount = results[0][0]['COUNT(*)'];
        let allPage = parseInt(allCount) / 20;
        const pageStr = allPage.toString();
        // 不能被整除
        if (pageStr.indexOf('.') > 0) {
          allPage = parseInt(pageStr.split('.')[0]) + 1;
        }
        const list = results[1];
        res.end(JSON.stringify({
          msg: '操作成功',
          status: '200',
          totalPages: allPage,
          currentPage: param.page,
          totalCount: allCount,
          data: list
        }));
      }
    });
  });
});
```

### 关键公式

通过上面的分析，可以看到分页查询的关键在于，要首先确定每页显示的数量pageSize，然后根据当前页的索引 pageIndex(从1开始)，确定 LIMIT和 OFFSET应该设定的值：

- LIMIT 总是设定为 pageSize

- OFFSET 计算公式为 pageSize * (pageIndex - 1)

确定了这两个值，就能查询出第N页的数据

---

## 1. 说说你对微信小程序的理解？优缺点?

### 核心概念

2017年，微信正式推出了小程序，允许外部开发者在微信内部运行自己的代码，开展业务截至目前，小程序已经成为国内前端的一个重要业务，跟 Web 和手机App 有着同等的重要性

微信小程序

H5微网站

小程序是一种不需要下载安装即可使用的应用，它实现了应用“触手可及”的梦想，用户扫一扫或者搜一下即可打开应用

也体现了“用完即走”的理念，用户不用关心是否安装太多应用的问题。应用将无处不在，随时可用，但又无需安装卸载

注意的是，除了微信小程序，还有百度小程序、微信小程序、支付宝小程序、抖音小程序，都是每个平台自己开发的，都是有针对性平台的应用程序

### 设计背景与 H5 差异

小程序并非凭空冒出来的一个概念，当微信中的 WebView逐渐成为移动 Web的一个重要入口时，微信就有相关的JS-SDK

JS-SDK 解决了移动网页能力不足的问题，通过暴露微信的接口使得 Web 开发者能够拥有更多的能力，然而在更多的能力之外，JS-SDK的模式并没有解决使用移动网页遇到的体验不良的问题因此需要设计一个比较好的系统，使得所有开发者在微信中都能获得比较好的体验：

- 快速的加载

- 更强大的能力

- 原生的体验

易用且安全的微信数据开放

高效和简单的开发

这些是JS-SDK做不到的，需要设计一个全新的小程序系统

对于小程序的开发，提供一个简单、高效的应用开发框架和丰富的组件及API，帮助开发者开发出具有原生体验的服务

其中相比H5，小程序与其的区别有如下：

- 运行环境：小程序基于浏览器内核重构的内置解析器

系统权限:小程序能获得更多的系统权限，如网络通信状态、数据缓存能力等

渲染机制：小程序的逻辑层和渲染层是分开的

小程序可以视为只能用微信打开和浏览的H5，小程序和网页的技术模型是一样的，用到的 JavaScript 语言和 CSS样式也是一样的，只是网页的 HTML 标签被稍微修改成了 WXML 标签

因此可以说，小程序页面本质上就是网页

其中关于微信小程序的实现原理，我们在后面的文章讲到

### 优缺点

优点：

- 随搜随用，用完即走：使得小程序可以代替许多APP，或是做APP的整体嫁接，或是作为阉割版功能的承载体

- 流量大，易接受:小程序借助自身平台更加容易引入更多的流量

· 安全

- 开发门槛低

降低兼容性限制

缺点：

用户留存：及相关数据显示，小程序的平均次日留存在13%左右，但是双周留存骤降到仅有1%

体积限制：微信小程序只有2M的大小，这样导致无法开发大型一些的小程序

- 受控微信：比起APP，尤其是安卓版的高自由度，小程序要面对很多来自微信的限制，从功能接口，甚至到类别内容，都要接受微信的管控

## 2. 说说微信小程序的生命周期函数有哪些？

### 生命周期分类

跟vue、react框架一样，微信小程序框架也存在生命周期，实质也是一堆会在特定时期执行的函数

小程序中，生命周期主要分成了三部分：

- 应用的生命周期

- 页面的生命周期

组件的生命周期

**应用的生命周期**

小程序的生命周期函数是在 app.js里面调用的，通过 App(Object)函数用来注册一个小程序，指定其小程序的生命周期回调

**页面的生命周期**

页面生命周期函数就是当你每进入/切换到一个新的页面的时候，就会调用的生命周期函数，同样通过App(Object)函数用来注册一个页面

**组件的生命周期**

组件的生命周期，指的是组件自身的一些函数，这些函数在特殊的时间点或遇到一些特殊的框架事件时被自动触发，通过 Component(Object)进行注册组件

### 回调与触发时机

**应用的生命周期函数**

- 生命周期 | 说明
- onLaunch | 小程序初始化完成时触发，全局只触发一次
- onShow | 小程序启动，或从后台进入前台显示时触发
- onHide | 小程序从前台进入后台时触发
- onError | 小程序发生脚本错误或API调用报错时触发
- onPageNotFound | 小程序要打开的页面不存在时触发
- onUnhandledRejection() | 小程序有未处理的 Promise拒绝时触发
- onThemeChange | 系统切换主题时触发

**页面的生命周期函数**

- 生命周期 | 说明 | 作用
- onLoad | 生命周期回调一监听页面加载 | 发送请求获取数据
- onShow | 生命周期回调一监听页面显示 | 请求数据
- onReady | 生命周期回调一监听页面初次渲染完成 | 获取页面元素(少用)
- onHide | 生命周期回调一监听页面隐藏 | 终止任务，如定时器或者播放音乐
- onUnload | 生命周期回调一监听页面卸载 | 终止任务

**组件的生命周期函数**

- 生命周期 | 说明
- created | 生命周期回调一监听页面加载
- attached | 生命周期回调一监听页面显示
- ready | 生命周期回调一监听页面初次渲染完成
- moved | 生命周期回调一监听页面隐藏
- detached | 生命周期回调一监听页面卸载
- error | 每当组件方法抛出错误时执行

### 组件注意事项

- 组件实例刚刚被创建好时，created 生命周期被触发，此时，组件数据 this.data就是在Component 构造器中定义的数据 data，此时不能调用 setData

在组件完全初始化完毕、进入页面节点树后，attached生命周期被触发。此时，this.data已被初始化为组件的当前值。这个生命周期很有用，绝大多数初始化工作可以在这个时机进行

在组件离开页面节点树后，detached生命周期被触发。退出一个页面时，如果组件还在页面节点树中，则detached 会被触发

还有一些特殊的生命周期，它们并非与组件有很强的关联，但有时组件需要获知，以便组件内部处理，这样的生命周期称为“组件所在页面的生命周期”，在pageLifetimes 定义段中定义，如下：

- 生命周期 | 说明
- show | 组件所在的页面被展示时执行
- hide | 组件所在的页面被隐藏时执行

```js
Component({
pageLifetimes: {
show: function() {
//页面被展示
},
hide: function() {
//页面被隐藏
},
}
})
```

### 执行顺序

**应用的生命周期执行过程**

- 用户首次打开小程序，触发onLaunch(全局只触发一次)

- 小程序初始化完成后，触发onShow方法，监听小程序显示

- 小程序从前台进入后台，触发onHide方法

- 小程序从后台进入前台显示，触发onShow方法

- 小程序后台运行一定时间，或系统资源占用过高，会被销毁

**页面生命周期的执行过程**

- 小程序注册完成后，加载页面，触发onLoad方法

页面载入后触发onShow方法，显示页面

- 首次显示页面，会触发onReady方法，渲染页面元素和样式，一个页面只会调用一次

- 当小程序后台运行或跳转到其他页面时，触发onHide方法

当小程序有后台进入到前台运行或重新进入页面时，触发onShow方法

- 当使用重定向方法 wx.redirectTo()或关闭当前页返回上一页wx.navigateBack()，触发onUnload

当存在也应用生命周期和页面周期的时候，相关的执行顺序如下：

- 打开小程序：(App)onLaunch -->(App)onShow --> (Pages)onLoad --> (Pages)onShow --> (pages)onRead

- 进入下—个页面：(Pages)onHide --> (Next)onLoad --> (Next)onShow -->(Next)onReady

- 返回上一个页面：(curr)onUnload -->(pre)onShow

离开小程序：(App)onHide

- 再次进入：小程序未销毁-->(App)onShow(执行上面的顺序)，小程序被销毁，(App)onLaunch重新开始执行.

## 3. 说说微信小程序的登录流程？

### 登录基础

传统的web开发实现登陆功能，一般的做法是输入账号密码、或者输入手机号及短信验证码进行登录服务端校验用户信息通过之后，下发一个代表登录态的token给客户端，以便进行后续的交互,每当token过期，用户都需要重新登录

而在微信小程序中，可以通过微信官方提供的登录能力方便地获取微信提供的用户身份标识，快速建立小程序内的用户体系，从而实现登陆功能

实现小程序用户体系主要涉及到openid和code的概念:

- 调用 wx.login(）方法会生成code，将 code 作为参数传递给微信服务器指定接口，就可以获取用户的 openid

对于每个小程序，微信都会将用户的微信ID映射出一个小程序openid，作为这个用户在这个小程序的唯一标识

### 登录与会话流程

微信小程序登陆具体实现的逻辑如下图所示：

通过wx.login()获取到用户的code判断用户是否授权读取用户信息，调用wx.getUserlnfo 读取用户数据

由于小程序后台授权域名无法授权微信的域名，所以需要自身后端调用微信服务器获取用户信息

- 通过 wx.request()方法请求业务方服务器，后端把 appid，appsecret 和 code 一起发送到微信服务器。appid和appsecret都是微信提供的，可以在管理员后台找到

微信服务器返回了openid 及本次登录的会话密钥session\_key

- 后端从数据库中查找openid，如果没有查到记录，说明该用户没有注册，如果有记录，则继续往下走

session\_key是对用户数据进行加密签名的密钥。为了自身应用安全，session\_key不应该在网络上

传输

- 然后生成session并返回给小程序

小程序把 session 存到 storage 里面

- 下次请求时，先从 storage里面读取，然后带给服务端

服务端对比 session 对应的记录，然后校验有效期

更加详细的功能图如下所示：

### 登录态续期

实际业务中，我们还需要判断登录态是否过期。通常会在登录态（临时令牌）中保存有效期，并由服务端校验该有效期是否超过约定时间（如服务端本地时间或时间服务器的标准时间）。

这种方法需要将本地存储的登录态发送到小程序的服务端，服务端判断为无效登录态时再返回需重新执行登录过程的消息给小程

另一种方式可以通过调用wx.checkSession检查微信登陆态是否过期：

如果过期，则发起完整的登录流程

- 如果不过期，则继续使用本地保存的自定义登录态

这种方式的好处是不需要小程序服务端来参与校验，而是在小程序端调用AP，流程如下所示：

## 4. 说说微信小程序中路由跳转的方式有哪些？区别？

### 页面栈模型

微信小程序拥有web网页和Application共同的特征，我们的页面都不是孤立存在的，而是通过和其他页面进行交互，来共同完成系统的功能

在微信小程序中，每个页面可以看成是一个pageModel，pageModel全部以栈的形式进行管理

### 跳转 API 与差异

常见的微信小程序页面跳转方式有如下：

- wx.navigateTo(Object)

- wx.redirectTo(Object)

- wx.switchTab(Object)

- wx.navigateBack(Object)

- wx.reLaunch(Object)

**wx.navigateTo(Object)**

wx.navigateTo(）用于保留当前页面、跳转到应用内的某个页面，使用 wx.navigateBack 可以返回到原页面

对于页面不是特别多的小程序，通常推荐使用 wx.navigateTo进行跳转，以便返回原页面，以提高加载速度。当页面特别多时，则不推荐使用

参数表如下所示：

- 属性 | 类型 | 默认值 必填 | 说明
- url | string | 是 | 需要跳转的应用内非 tabBar的页面的路径(代码包路径)，路 径后可以带参数。参数与路径之间使用?分隔，参数键与参 数值用 = 相连，不同参数用&分隔；如 'path? key=value&key2=value2'
- events | Object | 否 | 页面间通信接口，用于监听被打开页面发送到当前页面的数 据。基础库2.7.3开始支持。
- success | function | 否 | 接口调用成功的回调函数
- fail | function | 否 | 接口调用失败的回调函数
- complete | function | 否 | 接口调用结束的回调函数(调用成功、失败都会执行)

wx.navigateTo跳转流程及状态

**wx.redirectTo(Object)**

重定向，当页面过多时，被保留页面会挤占微信分配给小程序的内存，或是达到微信所限制的10层页面栈的情况下，我们应该考虑选择wx.redirectTo

wx.redirectTo()用于关闭当前页面，跳转到应用内的某个页面

这样的跳转，可以避免跳转前页面占据运行内存，但返回时页面需要重新加载，增加了返回页面的显示时间

参数表如下所示：

- 属性 | 类型 | 默认值 必填 | 说明
- url | string | 是 | 需要跳转的应用内非 tabBar的页面的路径(代码包路径)，路 径后可以带参数。参数与路径之间使用?分隔，参数键与参 数值用 = 相连，不同参数用 &分隔；如'path? key=value&key2=value2'
- success | function | 否 | 接口调用成功的回调函数
- fail | function | 否 | 接口调用失败的回调函数
- complete | function | 否 | 接口调用结束的回调函数(调用成功、失败都会执行）

**wx.switchTab(Object)**

跳转到 tabBar页面，并关闭其他所有非 tabBar 页面参数表如下所示：

- 属性 | 类型 | 默认值 | 必填 | 说明
- url | string | 是 | 需要跳转的 tabBar 页面的路径(代码包路径)(需在 app.json 的tabBar字段定义的页面)，路径后不能带参数。
- success | function | 否 | 接口调用成功的回调函数
- fail | function | 否 | 接口调用失败的回调函数
- complete | function | 否 | 接口调用结束的回调函数(调用成功、失败都会执行)

**wx.navigateBack(Object)**

wx.navigateBack(）用于关闭当前页面，并返回上一页面或多级页面，开发者可通过 getCurrentPages()获取当前的页面栈，决定需要返回几层则设置对象的delta属性即可

参数表如下：

- 属性 | 类型 默认值 | 必填 | 说明
- delta | number 1 | 否 | 返回的页面数，如果delta大于现有页面数，则返回到首页。
- success | function | 否 | 接口调用成功的回调函数
- fail | function | 否 | 接口调用失败的回调函数
- complete | function | 否 | 接口调用结束的回调函数(调用成功、失败都会执行)

**wx.reLaunch(Object)**

关闭所有页面，打开到应用内的某个页面，返回的时候跳到首页

- 属性 类型 | 默认值 必填 说明
- url | 是 2024 | 需要跳转的应用内页面路径(代码包路径)，路径后可以带参 数。参数与路径之间使用?分隔，参数键与参数值用=相连， 不同参数用&分隔；如path?key=value&key2=value2'
- success | function 否 | 接口调用成功的回调函数
- fail | function 否 | 接口调用失败的回调函数
- complete | function 否 | 接口调用结束的回调函数(调用成功、失败都会执行)

### 选择与页面栈变化

关于上述五种跳转方式，做下总结：

navigateTo保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页

redirectTo关闭当前页面，跳转到应用内的某个页面

- switchTab 跳转到 tabBar 页面，同时关闭其他非 tabBar 页面

- navigateBack 返回上一页面

- reLanch关闭所有页面，打开到应用内的某个页面

其中关于它们的页面栈的关系如下：

avigateTo 新页面入栈

- redirectTo当前页面出栈，新页面入栈

- navigateBack 页面不断出栈，直到目标返回页，新页面入栈

switchTab 页面全部出栈，只留下新的 Tab页面

reLanch页面全部出栈，只留下新的页面

## 5. 说说微信小程序的发布流程?

### 发布机制

在中大型的公司里，人员的分工非常仔细，一般会有不同岗位角色的员工同时参与同一个小程序项目。为此，小程序平台设计了不同的权限管理使得项目管理者可以更加高效管理整个团队的协同工作

以往我们在开发完网页之后，需要把网页的代码和资源放在服务器上，让用户通过互联网来访问在小程序的平台里，开发者完成开发之后，需要在开发者工具提交小程序的代码包，然后在小程序后台发布小程序

### 基础发布流程

关于发布的流程，主要分成了三个部分：

- 上传代码

- 提交审核

- 发布版本

**上传代码**

在开发者工具中，可以点击代码上传功能：

- 普通编译 | C @ | ↓ | 0. | ① | ā | 8
- 编译 预览 | 切后台 | 清缓存 | 上传 | 测试 | 腾讯云 | 详情

然后就可以填写版本信息：

然后点击上传，编译器则会提示上传代码成功

**提交审核**

代码上传完毕，就可以登陆微信公众号的官网首页，点击【开发管理】，查看应用详情：

提交审核过程需要填写审核信息，如下图：

**发布版本**

当审核通过之后，即可提交发布。

### 团队协作与自动化

上述是最简单的小程序代码发布的流程，通常的流程如下：

代码管理服务器上新建分支

- 开发测试新需求

测试完成后，将本地分支合并到master分支

拉取 master 分支最新代码，执行build 命令生成小程序可执行文件

- 开发者工具点击“上传”

· 提审

· 发布

但是面对多人协调开发的时候，有可能出现已经上线的代码还没合并到master的情况

因此可以考虑自动化构建部署，就是将从开发到部署的一系列流程变成自动化，衔接连贯，在构建失败时能够告知开发者，构建成功后能够告知测试和实施人员，可参考如下流程图：

## 6. 说说微信小程序的支付流程?

### 支付场景

微信小程序为电商类小程序，提供了非常完善、优秀、安全的支付功能在小程序内可调用微信的API完成支付功能，方便、快捷场景如下图所示：

图2 请求微信支付

用户通过分享或扫描二维码进入商户小程序，用户选择购买，完成选购流程

调起微信支付控件，用户开始输入支付密码

- 密码验证通过，支付成功。商户后台得到支付成功的通知

- 返回商户小程序，显示购买成功

微信支付公众号下发支付凭证

### 下单与支付流程

以电商小程序为例

支付流程图如下所示：

打开某小程序，点击直接下单

wx.login获取用户临时登录凭证code，发送到后端服务器换取openld

- 在下单时，小程序需要将购买的商品Id，商品数量，以及用户的openld传送到服务器

服务器在接收到商品Id、商品数量、openld后，生成服务期订单数据，同时经过一定的签名算法，向微信支付发送请求，获取预付单信息(prepay\_id)，同时将获取的数据再次进行相应规则的签名，向小程序端响应必要的信息

小程序端在获取对应的参数后，调用wx.requestPayment()发起微信支付，唤醒支付工作台，进行支付

- 接下来的一些列操作都是由用户来操作的包括了微信支付密码，指纹等验证，确认支付之后执行鉴权调起支付

鉴权调起支付：在微信后台进行鉴权，微信后台直接返回给前端支付的结果，前端收到返回数据后对支付结果进行展示

- 推送支付结果：微信后台在给前端返回支付结果后，也会向后台返回支付结果，后台据此更新订单状态。

### 调用参数与结果确认

其中后端响应数据必要的信息则是wx.requestPayment方法所需要的参数，大致如下：

```js
wx.requestPayment({
//时间戳
timeStamp:'
// 随机字符串
nonceStr: '',
//统一下单接口返回的 prepay_id 参数值
package: '',
//签名类型
signType: '',
//签名
paySign: ',
//调用成功回调
success () {},
//失败回调
fail () {},
// 接口调用结束回调
complete () {}
})
```

参数表如下所示：

- 属性 | 类型 | 默认值 | 必填 说明
- timeStamp | string | 是 | 时间戳，从1970年1月1日00:00:00至今的秒数，即当前的时间
- nonceStr | string | 是 | 随机字符串，长度为32个字符以下
- package | string | 是 | 统一下单接口返回的prepay_id参数值，提交格式如:prepay_id=***
- signType | string | MD5 | 否 | 签名算法，应与后台下单时的值一致
- paySign | string | 是 | 签名，具体见微信支付文档
- success | function | 否 | 接口调用成功的回调函数
- fail | function | 否 | 接口调用失败的回调函数
- complete | function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行）

小程序支付和以往的网页、APP微信支付大同小异，可以说小程序的支付变得更加简洁，不需要设置支付目录、域名授权等操作

## 7. 说说微信小程序的实现原理？

### 双线程架构

网页开发，渲染线程和脚本是互斥的，这也是为什么长时间的脚本运行可能会导致页面失去响应的原因，本质就是我们常说的JS是单线程的

而在小程序中，选择了Hybrid的渲染方式，将视图层和逻辑层是分开的，双线程同时运行，视图层的界面使用 WebView 进行渲染，逻辑层运行在JSCore 中

- 渲染层：界面渲染相关的任务全都在WebView线程里执行。一个小程序存在多个界面，所以渲染层存在多个WebView线程

- 逻辑层:采用JsCore线程运行JS脚本，在这个环境下执行的都是有关小程序业务逻辑的代码

### 通信与渲染

小程序在渲染层，宿主环境会把wxml转化成对应的JS对象

在逻辑层发生数据变更的时候，通过宿主环境提供的setData方法把数据从逻辑层传递到渲染层，再经过对比前后差异，把差异应用在原来的Dom树上，渲染出正确的视图

当视图存在交互的时候，例如用户点击你界面上某个按钮，这类反馈应该通知给开发者的逻辑层，需要将对应的处理状态呈现给用户

对于事件的分发处理，微信进行了特殊的处理，将所有的事件拦截后，丢到逻辑层交给JavaScript进行处理

由于小程序是基于双线程的，也就是任何在视图层和逻辑层之间的数据传递都是线程间的通信，会有一定的延时，因此在小程序中，页面更新成了异步操作

异步会使得各部分的运行时序变得复杂一些，比如在渲染首屏的时候，逻辑层与渲染层会同时开始初始化工作，但是渲染层需要有逻辑层的数据才能把界面渲染出来

如果渲染层初始化工作较快完成，就要等逻辑层的指令才能进行下一步工作

因此逻辑层与渲染层需要有一定的机制保证时序正确，在每个小程序页面的生命周期中，存在着若于次页面数据通信

### 启动和更新机制

小程序启动运行两种情况：

- 冷启动（重新开始）：用户首次打开或者小程序被微信主动销毁后再次打开的情况，此时小程序需要重新加载启动，即为冷启动

- 热启动：用户已经打开过小程序，然后在一定时间内再次打开该小程序，此时无需重新启动，只需要将后台态的小程序切换到前台，这个过程就是热启动

**注意事项**

1. 小程序没有重启的概念。

2. 当小程序进入后台，客户端会维持一段时间的运行状态，超过一定时间后会被微信主动销毁。

3. 短时间内收到系统两次以上内存警告，也会对小程序进行销毁，这也就为什么一旦页面内存溢出，页面会奔溃的本质原因了。

开发者在后台发布新版本之后，无法立刻影响到所有现网用户，但最差情况下，也在发布之后24小时之内下发新版本信息到用户

每次冷启动时，都会检查是否有更新版本，如果发现有新版本，将会异步下载新版本的代码包，并同时用客户端本地的包进行启动，即新版本的小程序需要等下一次冷启动才会应用上

## 8. 说说提高微信小程序的应用速度的手段有哪些？

### 启动流程

小程序启动会常常遇到如下图场景：

这是因为，小程序首次启动前，微信会在小程序启动前为小程序准备好通用的运行环境，如运行中的线程和一些基础库的初始化

然后才开始进入启动状态，展示一个固定的启动界面，界面内包含小程序的图标、名称和加载提示图标。此时，微信会在背后完成几项工作：

- 下载小程序代码包

- 加载小程序代码包

初始化小程序首页

下载到的小程序代码包不是小程序的源代码，而是编译、压缩、打包之后的代码包

整体流程如下图：

围绕上图小程序的启动流程，我们可以从加载、渲染两个纬度进行切入

### 加载优化

提升体验最直接的方法是控制小程序包的大小，常见手段有如下：

- 代码包的体积压缩可以通过勾选开发者工具中“上传代码时，压缩代码”选项

及时清理无用的代码和资源文件

- 减少资源包中的图片等资源的数量和大小(理论上除了小icon，其他图片资源从网络下载)，图片资源压缩率有限

并且可以采取分包加载的操作，将用户访问率高的页面放在主包里，将访问率低的页面放入子包里，按需加载

当用户点击到子包的目录时，还是有一个代码包下载的过程，这会感觉到明显的卡顿，所以子包也不建议拆的太大，当然我们可以采用子包预加载技术，并不需要等到用户点击到子包页面后在下载子包

- 分包预下载——开发者预先配置页面可能会跳转到的分包，框架在进入页面后根据配置进行预下载。

### 渲染优化

关于微信小程序首屏渲染优化的手段如下：

请求可以在页面onLoad就加载，不需要等页面ready后在异步请求数据

尽量减少不必要的https请求，可使用 getStorageSync()及 setStorageSync()方法将数据存储在本地

- 可以在前置页面将一些有用的字段带到当前页，进行首次渲染(列表页的某些数据-->详情页)，没有数据的模块可以进行骨架屏的占位

在微信小程序中，提高页面的多次渲染效率主要在于正确使用setData：

不要过于频繁调用setData，应考虑将多次setData合并成一次setData调用

- 数据通信的性能与数据量正相关，因而如果有一些数据字段不在界面中展示且数据结构比较复杂或

包含长字符串，则不应使用setData来设置这些数据

- 与界面渲染无关的数据最好不要设置在data中，可以考虑设置在page对象的其他字段下除此之外，对于一些独立的模块我们尽可能抽离出来，这是因为自定义组件的更新并不会影响页面上其他元素的更新

各个组件也将具有各自独立的逻辑空间。每个组件都分别拥有自己的独立的数据、setData调用

### 优化总结

小程序启动加载性能：

控制代码包的大小

- 分包加载

- 首屏体验（预请求，利用缓存，避免白屏，及时反馈

小程序渲染性能：

避免不当的使用setData

- 使用自定义组件

---

## 1. 如何理解OSI七层模型？

### 模型定位

OSI(Open System Interconnect)模型全称为开放式通信系统互连参考模型，是国际标准化组织(ISO）提出的一个试图使各种计算机在世界范围内互连为网络的标准框架

0SI将计算机网络体系结构划分为七层，每一层实现各自的功能和协议，并完成与相邻层的接口通信。即每一层扮演固定的角色，互不打扰

### 七层职责

OSI 主要划分了七层，如下图所示：

**应用层**

应用层位于OSI参考模型的第七层，其作用是通过应用程序间的交互来完成特定的网络应用该层协议定义了应用进程之间的交互规则，通过不同的应用层协议为不同的网络应用提供服务。例如域名系统DNS，支持万维网应用的HTTP协议，电子邮件系统采用的SMTP协议等在应用层交互的数据单元我们称之为报文

**表示层**

表示层的作用是使通信的应用程序能够解释交换数据的含义，其位于0SI参考模型的第六层，向上为应用层提供服务，向下接收来自会话层的服务

该层提供的服务主要包括数据压缩，数据加密以及数据描述，使应用程序不必担心在各台计算机中表示和存储的内部格式差异

**会话层**

会话层就是负责建立、管理和终止表示层实体之间的通信会话

该层提供了数据交换的定界和同步功能，包括了建立检查点和恢复方案的方法

**传输层**

传输层的主要任务是为两台主机进程之间的通信提供服务，处理数据包错误、数据包次序，以及其他一些关键传输问题

传输层向高层屏蔽了下层数据通信的细节。因此，它是计算机通信体系结构中关键的一层

其中，主要的传输层协议是 TCP和 UDP

**网络层**

两台计算机之间传送数据时其通信链路往往不止一条，所传输的信息甚至可能经过很多通信子网

网络层的主要任务就是选择合适的网间路由和交换节点，确保数据按时成功传送

在发送数据时，网络层把传输层产生的报文或用户数据报封装成分组和包，向下传输到数据链路层在网络层使用的协议是无连接的网际协议(InternetProtocol)和许多路由协议，因此我们通常把该层简单地称为 IP层

**数据链路层**

数据链路层通常也叫做链路层，在物理层和网络层之间。两台主机之间的数据传输，总是在一段一段的链路上传送的，这就需要使用专门的链路层协议

在两个相邻节点之间传送数据时，数据链路层将网络层交下来的IP数据报组装成帧，在两个相邻节点间的链路上传送帧

每一帧的数据可以分成：报头head和数据data 两部分:

head标明数据发送者、接受者、数据类型，如MAC地址

- data 存储了计算机之间交互的数据

通过控制信息我们可以知道一个帧的起止比特位置，此外，也能使接收端检测出所收到的帧有无差错，如果发现差错，数据链路层能够简单的丢弃掉这个帧，以避免继续占用网络资源

**物理层**

作为0SI参考模型中最低的一层，物理层的作用是实现计算机节点之间比特流的透明传送该层的主要任务是确定与传输媒体的接口的一些特性(机械特性、电气特性、功能特性，过程特性）

### 数据封装与传输

数据在各层之间的传输如下图所示：

应用层报文被传送到运输层

- 在最简单的情况下，运输层收取到报文并附上附加信息，该首部将被接收端的运输层使用

- 应用层报文和运输层首部信息一道构成了运输层报文段。附加的信息可能包括：允许接收端运输层向上向适当的应用程序交付报文的信息以及差错检测位信息。该信息让接收端能够判断报文中的比特是否在途中已被改变

- 运输层则向网络层传递该报文段，网络层增加了如源和目的端系统地址等网络层首部信息，生成了网络层数据报 V

- 网络层数据报接下来被传递给链路层，在数据链路层数据包添加发送端MAC 地址和接收端MAC地址后被封装成数据帧

在物理层数据帧被封装成比特流，之后通过传输介质传送到对端

对端再一步步解开封装，获取到传送的数据

## 2. 如何理解TCP/IP协议?

### 协议簇与核心协议

TCP/IP，传输控制协议/网际协议，是指能够在多个不同网络间实现信息传输的协议簇

- TCP（传输控制协议）

一种面向连接的、可靠的、基于字节流的传输层通信协议

- IP（网际协议）

用于封包交换数据网络的协议

TCP/IP协议不仅仅指的是 TCP和 IP两个协议，而是指一个由 FTP、SMTP、TCP、UDP、IP等协议构成的协议簇，

只是因为在 TCP/IP协议中 TCP协议和 IP协议最具代表性，所以通称为TCP/IP协议族(英语:TCP/IP Protocol Suite， 或TCP/IP Protocols)

### 分层模型

TCP/IP协议族按层次分别了五层体系或者四层体系

五层体系的协议结构是综合了OSI和TCP/IP优点的一种协议，包括应用层、传输层、网络层、数据链

五层协议的体系结构只是为介绍网络原理而设计的，实际应用还是TCP/IP四层体系结构，包括应用层、传输层、网络层(网际互联层)、网络接口层

如下图所示：

**TCP/IP五层模型**

应用层
传输层
网络层
数据链路层
物理层
TCP/IP 四层模型
应用层
传输层
网际互联层
网络接口层

**五层体系**

**应用层**

TCP/IP 模型将 OSI参考模型中的会话层、表示层和应用层的功能合并到一个应用层实现，通过不同的应用层协议为不同的应用提供服务

如： FTP Telnet DNS SMTP 等

**传输层**

该层对应于OSI参考模型的传输层，为上层实体提供源端到对端主机的通信功能

传输层定义了两个主要协议：传输控制协议(TCP)和用户数据报协议(UDP)

其中面向连接的TCP协议保证了数据的传输可靠性，面向无连接的UDP协议能够实现数据包简单、快速地传输

**网络层**

负责为分组网络中的不同主机提供通信服务，并通过选择合适的路由将数据传递到目标主机在发送数据时，网络层把运输层产生的报文段或用户数据封装成分组或包进行传送

**数据链路层**

数据链路层在两个相邻节点传输数据时，将网络层交下来的IP数据报组装成帧，在两个相邻节点之间的链路上传送帧

**物理层**

保数据可以在各种物理媒介上进行传输，为数据的传输提供可靠的环境

**四层体系**

TCP/IP的四层结构则如下表所示：

- 层次名称 | 单位 | 功能 | 协议
- 网络接口层 | 帧 | 负责实际数据的传输，对应OSI参考模型的下两层 | HDLC（高级链路控制协议）PPP（点对点协议）SLIP（串行线路接口协议)
- 网络层 | 数据报 | 负责网络间的寻址数据传输，对应OSI参考模型的第三层 | IP（网际协议）ICMP(网际控制消息协议)ARP(地址解析协议)RARP（反向地址解析协议)
- 传输层 | 报文段 | 负责提供可靠的传输服务，对应OSI参考模型的第四层 | TCP（控制传输协议）UDP（用户数据报协议)
- 应用层202 | 负责实现一切与应用程序相关的功能，对应OSI参考模型的上三层 | FTP(文件传输协议)HTTP（超文本传输协议）DNS（域名服务器协议）SMTP（简单邮件传输协议）NFS(网络文件系统协议)

### 与 OSI 的对应关系

OSI参考模型与TCP/IP参考模型区别如下:

相同点：

- OSI参考模型与TCP/IP参考模型都采用了层次结构

- 都能够提供面向连接和无连接两种通信服务机制

不同点：

- OSI采用的七层模型；TCP/IP是四层或五层结构

- TCP/IP参考模型没有对网络接口层进行细分，只是一些概念性的描述；OSI参考模型对服务和协议做了明确的区分

OSI参考模型虽然网络划分为七层，但实现起来较困难。TCP/IP参考模型作为一种简化的分层结构是可以的

- TCP/IP协议去掉表示层和会话层的原因在于会话层、表示层、应用层都是在应用程序内部实现的，最终产出的是一个应用数据包，而应用程序之间是几乎无法实现代码的抽象共享的，这也就造成0SI设想中的应用程序维度的分层是无法实现的

三种模型对应关系如下图所示：

- 区域 | TCP/IP四层模型 | TCP/IP五层模型 | OSI七层模型 | 单位 | 地址 | 功能 | 对应设备 | 协议
- 计算机高层 | 应用层 | 应用层 | 应用层 | 应用进程 | 进程号 | 应用程序与协议 | 应用程序（eg：FTP、HTTP) | FTP、NFS
- 表示层 | 数据加密、压缩 | 编码解码、加密解密 | Telnet、SNMP
- 会话层 | 会话的开始、恢复、释放、同步 | 建立会话，session验证、断点传输 | SMTP、DNS
- 网络低层 | 传输层 | 传输层 | 传输层 | 报文/数据段 | 端口号 | 端到端的可靠透明传输、保证数据完整性 | 进程与端口 | TCP、UDP
- 网络层 | 网络层 | 网络层 | 包/分组 | IP地址 | 服务选择、路径选择、多路复用等(如何选择发送路径、方式） | 路由器、防火墙、多层交换机 | IP、ICMP、ARP
- 网络接口层 | 数据链路层 | 数据链路层 | 帧 | mac地址 | 差错控制、流量控制（规定如何进行01发送不会造成错误） | 网卡、网桥、交换机PP | P、SLIP
- 物理层 | 物理层 | 比特流 | bit | 光纤、电缆、双绞线连接，传送0/1电信号 | 中继器、集线器、网线 | IEEExxxx

## 3. 如何理解UDP 和 TCP？区别？应用场景?

### UDP 特性

UDP(User DatagramProtocol)，用户数据包协议，是一个简单的面向数据报的通信协议，即对应用层交下来的报文，不合并，不拆分，只是在其上面加上首部后就交给了下面的网络层

也就是说无论应用层交给UDP多长的报文，它统统发送，一次发送一个报文

而对接收方，接到后直接去除首部，交给上面的应用层就完成任务

UDP报头包括4个字段，每个字段占用2个字节(即16个二进制位），标题短，开销小

特点如下：

- UDP 不提供复杂的控制机制，利用IP提供面向无连接的通信服务

传输途中出现丢包，UDP也不负责重发

当包的到达顺序出现乱序时，UDP没有纠正的功能。

- 并且它是将应用程序发来的数据在收到的那一刻，立即按照原样发送到网络上的一种机制。即使是出现网络拥堵的情况，UDP也无法进行流量控制等避免网络拥塞行为

### TCP 特性

TCP(Transmission Control Protocol)，传输控制协议，是一种可靠、面向字节流的通信协议，把上面应用层交下来的数据看成无结构的字节流来发送

可以想象成流水形式的，发送方TCP会将数据放入“蓄水池”(缓存区)，等到可以发送的时候就发送，不能发送就等着，TCP会根据当前网络的拥塞状态来确定每个报文段的大小

TCP报文首部有20个字节，额外开销大

**可靠传输机制**

- TCP充分地实现了数据传输时各种控制功能，可以进行丢包时的重发控制，还可以对次序乱掉的分包进行顺序控制。而这些在UDP中都没有。

- 此外，TCP作为一种面向有连接的协议，只有在确认通信对端存在时才会发送数据，从而可以控制通信流量的浪费

- 根据TCP的这些机制，在IP这种无连接的网络上也能够实现高可靠性的通信（主要通过检验和、序列号、确认应答、重发控制、连接管理以及窗口控制等机制实现

### 核心区别与场景

UDP 与 TCP 两者的都位于传输层，如下图所示：

- TCP | UDP
- 可靠性 | 可靠 | 不可靠
- 连接性 | 面向连接 | 无连接
- 报文 | 面向字节流 | 面向报文
- 效率 | 传输效率低 | 传输效率高
- 双共性 | 全双工 | 一对一、一对多、多对一、多对多
- 流量控制 | 滑动窗口 | 无
- 拥塞控制 | 慢开始、拥塞避免、快重传、快恢复 | 无
- 传输效率 | 慢 | 快

- TCP是面向连接的协议，建立连接3次握手、断开连接四次挥手，UDP是面向无连接，数据传输前后不连接连接，发送端只负责将数据发送到网络，接收端从消息队列读取
- TCP提供可靠的服务，传输过程采用流量控制、编号与确认、计时器等手段确保数据无差错，不丢

失。UDP则尽可能传递数据，但不保证传递交付给对方

- TCP面向字节流，将应用层报文看成一串无结构的字节流，分解为多个TCP报文段传输后，在目的站重新装配。UDP协议面向报文，不拆分应用层报文，只保留报文边界，一次发送一个报文，接收方去除报文首部后，原封不动将报文交给上层应用

TCP只能点对点全双工通信。UDP支持一对一、一对多、多对一和多对多的交互通信两者应用场景如下图：

- 应用层协议 | 应用 | 传输层协议
- SMTP | 电子邮件 | TCP
- TELNET | 远程终端接入
- HTTP | 万维网
- FTP | 文件传输
- DNS | 域名转换 | UDP
- TFTP | 文件传输
- SNMP | 网络管理
- NFS | 远程文件服务器

可以看到，TCP应用场景适用于对效率要求低，对准确性要求高或者要求有链接的场景，而UDP适用场景为对效率要求高，对准确性要求低的场景

## 4. 说一下 GET 和 POST 的区别?

### 基本语义

GET 和 POST，两者是 HTTP协议中发送请求的方法

**GET**

GET方法请求一个指定资源的表示形式，使用GET的请求应该只被用于获取数据

**POST**

POST方法用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用

本质上都是TCP链接，并无差别

但是由于HTTP的规定和浏览器/服务器的限制，导致他们在应用过程中会体现出一些区别

### 主要差异

GET在浏览器回退时是无害的，而POST会再次提交请求。

GET产生的URL地址可以被Bookmark，而POST不可以。

GET请求会被浏览器主动cache，而POST不会，除非手动设置。

GET请求只能进行url编码，而POST支持多种编码方式。

- GET请求参数会被完整保留在浏览器历史记录里，而POST中的参数不会被保留。

- GET请求在URL中传送的参数是有长度限制的，而POST没有。

- 对参数的数据类型，GET只接受ASCII字符，而POST没有限制。

- GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息。

GET参数通过URL传递，POST放在Request body中

### 约定、限制与安全性

貌似从上面看到GET与POST请求区别非常大，但两者实质并没有区别

无论 GET还是 POST，用的都是同一个传输层协议，所以在传输上没有区别

当不携带参数的时候，两者最大的区别为第一行方法名不同

```bash
POST /uri HTTP/1.1\r\n
GET /uri HTTP/1.1 \r\n
```

当携带参数的时候，我们都知道 GET 请求是放在 url 中，POST 则放在 body 中

GET方法简约版报文是这样的

```text
GET /index.html?name=qiming.c&age=22 HTTP/1.1
Host: localhost
```

POST方法简约版报文是这样的

```text
POST /index.html HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded
name=qiming.c&age=22
```

注意：这里只是约定，并不属于HTTP规范，相反的，我们可以在 POST请求中 url中写入参数，或者GET请求中的 body 携带参数

**参数长度**

HTTP协议没有 Body和 URL 的长度限制，对 URL 限制的大多是浏览器和服务器的原因

IE对URL长度的限制是2083字节(2K+35)。对于其他浏览器，如Netscape、FireFox等，理论上没有长度限制，其限制取决于操作系统的支持

这里限制的是整个URL长度，而不仅仅是参数值的长度

服务器处理长URL 要消耗比较多的资源，为了性能和安全考虑，会给 URL 长度加限制

**安全**

POST 比 GET 安全，因为数据在地址栏上不可见

然而，从传输的角度来说，他们都是不安全的，因为HTTP在网络上是明文传输的，只要在网络节点上捉包，就能完整地获取数据报文

只有使用HTTPS才能加密安全

**数据包**

对于 GET 方式的请求，浏览器会把 http header 和 data 一并发送出去，服务器响应200(返回数据)

对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok

并不是所有浏览器都会在POST中发送两次包，Firefox就只发送一次

## 5. 说说TCP为什么需要三次握手和四次挥手?

### 三次握手

三次握手(Three-way Handshake)其实就是指建立一个TCP连接时，需要客户端和服务器总共发送3个包

主要作用就是为了确认双方的接收能力和发送能力是否正常、指定自己的初始化序列号为后面的可靠性传送做准备

过程如下：

第一次握手：客户端给服务端发一个SYN报文，并指明客户端的初始化序列号ISN(c)，此时客户端处于SYN\_SENT 状态

- 第二次握手：服务器收到客户端的SYN报文之后，会以自己的SYN报文作为应答，为了确认客户端的SYN，将客户端的ISN+1作为ACK的值，此时服务器处于SYN\_RCVD 的状态

- 第三次握手：客户端收到SYN报文之后，会发送一个ACK报文，值为服务器的ISN+1。此时客户端处于 ESTABLISHED状态。服务器收到ACK报文之后，也处于ESTABLISHED状态，此时，双方已建立起了连接

每一次握手分别确认一部分通信能力：

- 第一次握手：客户端发送网络包，服务端收到了

这样服务端就能得出结论：客户端的发送能力、服务端的接收能力是正常的。

- 第二次握手：服务端发包，客户端收到了

这样客户端就能得出结论：服务端的接收、发送能力，客户端的接收、发送能力是正常的。不过此时服务器并不能确认客户端的接收能力是否正常

- 第三次握手：客户端发包，服务端收到了。

这样服务端就能得出结论：客户端的接收、发送能力正常，服务器自己的发送、接收能力也正常

通过三次握手，就能确定双方的接收和发送能力是正常的。之后就可以正常通信了

### 为什么不能只握手两次

如果是两次握手，发送端可以确定自己发送的信息能对方能收到，也能确定对方发的包自己能收到，但接收端只能确定对方发的包自己能收到无法确定自己发的包对方能收到

并且两次握手的话，客户端有可能因为网络阻塞等原因会发送多个请求报文，延时到达的请求又会与服务器建立连接，浪费掉许多服务器的资源

### 四次挥手

TCP 终止一个连接，需要经过四次挥手。

过程如下：

- 第一次挥手：客户端发送一个FIN报文，报文中会指定一个序列号。此时客户端处于FIN\_WAIT1状态，停止发送数据，等待服务端的确认

- 第二次挥手：服务端收到FIN之后，会发送ACK报文，且把客户端的序列号值+1作为ACK报文的序列号值，表明已经收到客户端的报文了，此时服务端处于CLOSE\_WAIT状态

- 第三次挥手：如果服务端也想断开连接了，和客户端的第一次挥手一样，发给FIN报文，且指定一个序列号。此时服务端处于LAST\_ACK的状态

- 第四次挥手：客户端收到FIN之后，一样发送一个ACK报文作为应答，且把服务端的序列号值+1作为自己ACK报文的序列号值，此时客户端处于TIME\_WAIT状态。需要过一阵子以确保服务端收到自己的ACK报文之后才会进入CLOSED状态，服务端收到ACK报文之后，就处于关闭连接了，处于 CLOSED状态

**四次挥手原因**

服务端在收到客户端断开连接Fin报文后，并不会立即关闭连接，而是先发送一个ACK包先告诉客户端收到关闭连接的请求，只有当服务器的所有报文发送完毕之后，才发送FIN报文断开连接，因此需要四次挥手

一个完整的三次握手四次挥手如下图所示：

## 6. 说说 HTTP 常见的请求头有哪些？作用？

### 请求头的作用

HTTP头字段(HTTP header fields),是指在超文本传输协议(HTTP)的请求和响应消息中的消息头部分

它们定义了一个超文本传输协议事务中的操作参数

HTTP头部字段可以自己根据需要定义，因此可能在Web服务器和浏览器上发现非标准的头字段

下面是一个HTTP请求的请求头：

```csv
HTTP
GET /home.html HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac 0S X 10.9; rv:50.0) Gecko/20
Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/testpage.html
Connection: keep-alive
Upgrade-Insecure-Requests: 1
If-Modified-Since: Mon, 18 Jul 2016 02:36:04 GMT
If-None-Match："c561c68d0ba92bbeb8b0fff2a9199f722e3a621a"
Cache-Control: max-age=0
```

### 常见字段

常见的请求字段如下表所示：

- 字段名 | 说明 | 示例
- Accept | 能够接受的回应内容类型(Content-Types) | Accept: text/plain
- Accept-Charset | 能够接受的字符集 | Accept-Charset: utf-8
- Accept-Encoding | 能够接受的编码方式列表 | Accept-Encoding: gzip,deflate
- Accept-Language | 能够接受的回应内容的自然语言列表 | Accept-Language: en-US
- Authorization | 用于超文本传输协议的认证的认证信息 | Authorization: BasicQWxhZGRpbjpvcGVulHNIc2FtZQ==
- Cache-Control | 用来指定在这次的请求/响应链中的所有缓存机制都必须遵守的指令 | Cache-Control: no-cache
- Connection | 该浏览器想要优先使用的连接类型 | Connection: keep-aliveConnection: Upgrade
- Cookie | 服务器通过 Set- Cookie(下文详述）发送的一个超文本传输协议Cookie | Cookie: $Version=1;Skin=new;
- Content-Length | 以八位字节数组(8位的字节）表示的请求体的长度 | Content-Length: 348
- Content-Type | 请求体的 多媒体类型 | Content-Type: application/x-www-form-urlencoded
- Date | 发送该消息的日期和时间 | Date: Tue, 15 Nov 199408:12:31 GMT
- Expect | 表明客户端要求服务器做出特定的行为 | Expect: 100-continue
- Host | 服务器的域名(用于虚拟主机)，以及服务器所监听的传输控制协议端口号 | Host: en.wikipedia.org:80Host: en.wikipedia.org
- If-Match | 仅当客户端提供的实体与服务器上对应的实体相匹配时，才进行对应的操作。主要作用时，用作像 PUT 这样的方法中，仅当从用户上次更新某个资源以来，该资源未被修改的情况下，才更新该资源 | If-Match:"737060cd8c284d8af7ad3082f209582d"
- If-Modified-Since | 允许在对应的内容未被修改的情况下返回304未修改 | If-Modified-Since: Sat, 29Oct 1994 19:43:31 GMT
- If-None-Match | 允许在对应的内容未被修改的情况下返回304未修改 | If-None-Match:"737060cd8c284d8af7ad3082f209582d"
- If-Range | 如果该实体未被修改过，则向我发送我所缺少的那一个或多个部分；否则，发送整个新的实体 | If-Range:"737060cd8c284d8af7ad3082f209582d"
- Range | 仅请求某个实体的一部分 | Range: bytes=500-999
- User-Agent | 浏览器的浏览器身份标识字符串 | User-Agent: Mozilla/5.0 (X11;Linux x86_64; rv:12.0)Gecko/20100101 Firefox/21.0
- Origin | 发起一个针对跨来源资源共享的请求 | Origin: http://www.example-social-network.com

### 缓存与会话场景

通过配合请求头和响应头，可以满足一些场景的功能实现：

**协商缓存**

协商缓存是利用的是【Last-Modified，If-Modified-Since】和【ETag、If-None-Match】这两对请求头响应头来管理的

Last-Modified 表示本地文件最后修改日期，浏览器会在request header加上If-Modified-Since (上次返回的Last-Modified的值)，询问服务器在该日期后资源是否有更新，有更新的话就会将新的资源发送回来

Etag 就像一个指纹，资源变化都会导致 ETag 变化，跟最后修改时间没有关系，ETag 可以保证每一个资源是唯一的

If-None-Match 的header会将上次返回的Etag 发送给服务器，询问该资源的Etag 是否有更新，有变动就会发送新的资源回来

而强制缓存不需要发送请求到服务端，根据请求头 expires 和 cache-control 判断是否命中强缓存

强制缓存与协商缓存的流程图如下所示：

**会话状态**

cookie，类型为「小型文本文件」，指某些网站为了辨别用户身份而储存在用户本地终端上的数据，通过响应头 set-cookie 决定

作为一段一般不超过4KB的小型文本数据，它由一个名称(Name)、一个值(Value)和其它几个用于控制Cookie有效期、安全性、使用范围的可选属性组成

Cookie 主要用于以下三个方面：

会话状态管理(如用户登录状态、购物车、游戏分数或其它需要记录的信息）

- 个性化设置（如用户自定义设置、主题等）

浏览器行为跟踪（如跟踪分析用户行为等

## 7. 说说HTTP常见的状态码有哪些，适用场景?

### 状态码含义

HTTP状态码（英语：HTTP Status Code)，用以表示网页服务器超文本传输协议响应状态的3位数字代码

它由 RFC 2616规范定义的，并得到 RFC 2518、RFC 2817、RFC 2295、RFC 2774 与 RFC 4918等规范扩展

简单来讲，http状态码的作用是服务器告诉客户端当前请求响应的状态，通过状态码就能判断和分析服务器的运行状态

### 分类与常见状态码

状态码第一位数字决定了不同的响应状态，有如下：

- 1 表示消息

- 2 表示成功

- 3 表示重定向

- 4 表示请求错误

- 5 表示服务器错误

**1xx**

代表请求已被接受，需要继续处理。这类响应是临时响应，只包含状态行和某些可选的响应头信息，并以空行结束

常见的有：

- 100(客户端继续发送请求，这是临时响应)：这个临时响应是用来通知客户端它的部分请求已经被服务器接收，且仍未被拒绝。客户端应当继续发送请求的剩余部分，或者如果请求已经完成，忽略这个响应。服务器必须在请求完成后向客户端发送一个最终响应

101：服务器根据客户端的请求切换协议，主要用于websocket或http2升级

**2xx**

代表请求已成功被服务器接收、理解、并接受

常见的有：

200(成功)：请求已成功，请求所希望的响应头或数据体将随此响应返回

- 201(已创建)：请求成功并且服务器创建了新的资源

- 202（已创建）：服务器已经接收请求，但尚未处理

- 203（非授权信息）：服务器已成功处理请求，但返回的信息可能来自另一来源

- 204（无内容）：服务器成功处理请求，但没有返回任何内容

205（重置内容）：服务器成功处理请求，但没有返回任何内容

- 206（部分内容)：服务器成功处理了部分请求

**3xx**

表示要完成请求，需要进一步操作。通常，这些状态代码用来重定向

常见的有：

- 300(多种选择)：针对请求，服务器可执行多种操作。服务器可根据请求者(user agent)选择一项操作，或提供操作列表供请求者选择

- 301(永久移动)：请求的网页已永久移动到新位置。服务器返回此响应(对GET或HEAD请求的响应)时，会自动将请求者转到新位置

- 302(临时移动)：服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求

- 303(查看其他位置)：请求者应当对不同的位置使用单独的GET请求来检索响应时，服务器返回此代码

- 305(使用代理)：请求者只能使用代理访问请求的网页。如果服务器返回此响应，还表示请求者应使用代理

- 307(临时重定向)：服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求

**4xx**

代表了客户端看起来可能发生了错误，妨碍了服务器的处理

常见的有：

- 400(错误请求)：服务器不理解请求的语法

- 401(未授权)：请求要求身份验证。对于需要登录的网页，服务器可能返回此响应。

- 403（禁止）：服务器拒绝请求

- 404(未找到)：服务器找不到请求的网页

- 405（方法禁用）：禁用请求中指定的方法

406(不接受)：无法使用请求的内容特性响应请求的网页

- 407（需要代理授权）：此状态代码与401(未授权)类似，但指定请求者应当授权使用代理

408（请求超时）：服务器等候请求时发生超时

**5xx**

表示服务器无法完成明显有效的请求。这类状态码代表了服务器在处理请求的过程中有错误或者异常状态发生

常见的有：

- 500(服务器内部错误)：服务器遇到错误，无法完成请求

- 501(尚未实施)：服务器不具备完成请求的功能。例如，服务器无法识别请求方法时可能会返回

此代码

502（错误网关）：服务器作为网关或代理，从上游服务器收到无效响应

503(服务不可用)：服务器目前无法使用(由于超载或停机维护）

- 504(网关超时)：服务器作为网关或代理，但是没有及时从上游服务器收到请求

505(HTTP版本不受支持)：服务器不支持请求中所用的HTTP协议版本

### 典型场景

下面给出一些状态码的适用场景：

- 100：客户端在发送POST数据给服务器前，征询服务器情况，看服务器是否处理POST的数据，如果不处理，客户端则不上传POST数据，如果处理，则POST上传数据。常用于POST大数据传输

- 206：一般用来做断点续传，或者是视频文件等大文件的加载

301：永久重定向会缓存。新域名替换旧域名，旧的域名不再使用时，用户访问旧域名时用301就重定向到新的域名

- 302：临时重定向不会缓存，常用于未登陆的用户访问用户中心重定向到登录页面

- 304：协商缓存，告诉客户端有缓存，直接使用缓存中的数据，返回页面的只有头部信息，是没有内容部分

- 400：参数有误，请求无法被服务器识别

- 403:告诉客户端进制访问该站点或者资源，如在外网环境下，然后访问只有内网IP才能访问的时候则返回

- 404：服务器找不到资源时，或者服务器拒绝请求又不想说明理由时

503：服务器停机维护时，主动用503响应请求或nginx设置限速，超过限速，会返回503

504：网关超时

## 8. 什么是HTTP？ HTTP 和 HTTPS 的区别?

### HTTP 特性

HTTP (HyperText Transfer Protocol)，即超文本运输协议，是实现网络通信的一种规范

在计算机和网络世界有，存在不同的协议，如广播协议、寻址协议、路由协议等等.....

而HTTP是一个传输协议，即将数据由A传到B或将B传输到A，并且A与B之间能够存放很多第三方，如：A<=>X<=>Y<=>Z<=>B

传输的数据并不是计算机底层中的二进制包，而是完整的、有意义的数据，如HTML文件，图片文件，查询结果等超文本，能够被上层应用识别

在实际应用中，HTTP 常被用于在Web 浏览器和网站服务器之间传递信息，以明文方式发送内容，不提供任何方式的数据加密

特点如下：

支持客户/服务器模式

- 简单快速：客户向服务器请求服务时，只需传送请求方法和路径。由于HTTP协议简单，使得HTTF服务器的程序规模小，因而通信速度很快

- 灵活：HTTP允许传输任意类型的数据对象。正在传输的类型由Content-Type加以标记

- 无连接：无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间

- 无状态：HTTP协议无法根据之前的状态进行本次的请求处理

### HTTPS 与 TLS

在上述介绍HTTP中，了解到HTTP传递信息是以明文的形式发送内容，这并不安全。而HTTPS出现正是为了解决HTTP不安全的特性

为了保证这些隐私数据能加密传输，让HTTP运行安全的 SSL/TLS协议上，即 HTTPS = HTTP+SSL/TLS，通过SSL证书来验证服务器的身份，并为浏览器和服务器之间的通信进行加密

SSL 协议位于 TCP/IP 协议与各种应用层协议之间，浏览器和服务器在使用 SSL 建立连接时需要选择一组恰当的加密算法来实现安全通信，为数据通讯提供安全支持

流程图如下所示：

- 首先客户端通过URL访问服务器建立SSL连接

服务端收到客户端请求后，会将网站支持的证书信息(证书中包含公钥)传送一份给客户端

客户端的服务器开始协商SSL连接的安全等级，也就是信息加密的等级

- 客户端的浏览器根据双方同意的安全等级，建立会话密钥，然后利用网站的公钥将会话密钥加密，并传送给网站

- 服务器利用自己的私钥解密出会话密钥

- 服务器利用会话密钥加密与客户端之间的通信

### 核心区别

- HTTPS是HTTP协议的安全版本，HTTP协议的数据传输是明文的，是不安全的，HTTPS使用了SSL/TLS协议进行了加密处理，相对更安全

HTTP 和 HTTPS 使用连接方式不同，默认端口也不一样，HTTP是80，HTTPS是443

HTTPS由于需要设计加密以及多次握手，性能方面不如 HTTP

HTTPS需要SSL，SSL证书需要钱，功能越强大的证书费用越高

## 9. 说说 HTTP1.0/1.1/2.0 的区别?

### HTTP/1.0

HTTP协议的第二个版本，第一个在通讯中指定版本号的HTTP协议版本

HTTP 1.0浏览器与服务器只保持短暂的连接，每次请求都需要与服务器建立一个TCP连接服务器完成请求处理后立即断开TCP连接，服务器不跟踪每个客户也不记录过去的请求简单来讲，每次与服务器交互，都需要新开一个连接

例如，解析html文件，当发现文件中存在资源文件的时候，这时候又创建单独的链接最终导致，一个html文件的访问包含了多次的请求和响应，每次请求都需要创建连接、关系连接这种形式明显造成了性能上的缺陷

如果需要建立长连接，需要设置一个非标准的Connection字段 Connection：keep-alive

### HTTP/1.1

在HTTP1.1中，默认支持长连接(Connection：keep-alive），即在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟

建立一次连接，多次请求均由这个连接完成

这样，在加载html文件的时候，文件中多个请求和响应就可以在一个连接中传输

同时，HTTP 1.1 还允许客户端不用等待上一次请求结果返回，就可以发出下一次请求，但服务器端必须按照接收到客户端请求的先后顺序依次回送响应结果，以保证客户端能够区分出每次请求的响应内容，这样也显著地减少了整个下载过程所需要的时间

同时，HTTP1.1在HTTP1.0的基础上，增加更多的请求头和响应头来完善的功能，如下：

- 引入了更多的缓存控制策略，如If-Unmodified-Since,If-Match,If-None-Match等缓存头来控制缓存策略

- 引入range，允许值请求资源某个部分

引入host，实现了在一台WEB服务器上可以在同一个IP地址和端口号上使用不同的主机名来创建多

并且还添加了其他的请求方法：put、delete、options...

### HTTP/2

而HTTP2.0在相比之前版本，性能上有很大的提升，如添加了一个特性：

- 多路复用

- 二进制分帧

- 首部压缩

服务器推送

**多路复用**

HTTP/2 复用 TCP 连接，在一个连接里，客户端和浏览器都可以同时发送多个请求或回应，而且不用按照顺序一一对应，这样就避免了”队头堵塞’

多路复用下，CSS、JS 等资源可以同时发送到服务端。

**二进制分帧**

帧是HTTP2通信中最小单位信息

HTTP/2 采用二进制格式传输数据，而非 HTTP1.x的文本格式，解析起来更高效将请求和响应数据分割为更小的帧，并且它们采用二进制编码

HTTP2中，同域名下所有通信都在单个连接上完成，该连接可以承载任意数量的双向数据流

每个数据流都以消息的形式发送，而消息又由一个或多个帧组成。多个帧之间可以乱序发送，根据帧首部的流标识可以重新组装，这也是多路复用同时发送数据的实现条件

**首部压缩**

HTTP/2在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键值对，对于相同的数据，不再通过每次请求和响应发送

首部表在HTTP/2的连接存续期内始终存在，由客户端和服务器共同渐进地更新

例如：下图中的两个请求，请求一发送了所有的头部字段，第二个请求则只需要发送差异数据，这样可以减少冗余数据，降低开销

**服务器推送**

HTTP2 引入服务器推送，允许服务端推送资源给客户端

服务器会顺便把一些客户端需要的资源一起推送到客户端，如在响应一个页面请求中，就可以随同页面的其它资源

免得客户端再次创建连接发送请求到服务器端获取

这种方式非常合适加载静态资源

### 版本对比

HTTP1.0:

浏览器与服务器只保持短暂的连接，浏览器的每次请求都需要与服务器建立一个TCP连接HTTP1.1:

- 引入了持久连接，即TCP连接默认不关闭，可以被多个请求复用

- 在同一个TCP连接里面，客户端可以同时发送多个请求

- 虽然允许复用TCP连接，但是同一个TCP连接里面，所有的数据通信是按次序进行的，服务器只有处理完一个请求，才会接着处理下一个请求。如果前面的处理特别慢，后面就会有许多请求排队等着

- 新增了一些请求方法

新增了一些请求头和响应头

HTTP2.0:

- 采用二进制格式而非文本格式

完全多路复用，而非有序并阻塞的、只需一个连接即可实现并行

- 使用报头压缩，降低开销

- 服务器推送

## 10. 为什么说HTTPS比HTTP安全？HTTPS是如何保证安全的?

### HTTP 的安全问题

在上篇文章中，我们了解到HTTP在通信过程中，存在以下问题：

通信使用明文(不加密），内容可能被窃听

不验证通信方的身份，因此有可能遭遇伪装

而HTTPS的出现正是解决这些问题，HTTPS是建立在SSL之上，其安全性由 SSL来保证在采用SSL后，HTTP就拥有了HTTPS的加密、证书和完整性保护这些功能

SSL(Secure Sockets Layer 安全套接字协议),及其继任者传输层安全(Transport Layer Security,TLS)是为网络通信提供安全及数据完整性的一种安全协议

HTTPS

HTTP TLS/SSL TCP

信息窃听信息篡改信息劫持

信息加密完整性校验身份验证

风险

优势

### 加密与密钥交换

SSL的实现这些功能主要依赖于三种手段：

- 对称加密：采用协商的密钥对数据加密

- 非对称加密：实现身份认证和密钥协商

摘要算法：验证信息的完整性

数字签名：身份验证

**对称加密**

对称加密指的是加密和解密使用的秘钥都是同一个，是对称的。只要保证了密钥的安全，那整个通信过程就可以说具有了机密性

**非对称加密**

非对称加密，存在两个秘钥，一个叫公钥，一个叫私钥。两个秘钥是不同的，公钥可以公开给任何人使用，私钥则需要保密

公钥和私钥都可以用来加密解密，但公钥加密后只能用私钥解密，反过来，私钥加密后也只能用公钥解密

**混合加密**

在HTTPS通信过程中，采用的是对称加密+非对称加密，也就是混合加密

在对称加密中讲到，如果能够保证了密钥的安全，那整个通信过程就可以说具有了机密性

而HTTPS 采用非对称加密解决秘钥交换的问题

具体做法是发送密文的一方使用对方的公钥进行加密处理“对称的密钥”，然后对方用自己的私钥解密拿到“对称的密钥”

这样可以确保交换的密钥是安全的前提下，使用对称加密方式进行通信

**混合加密示例**

网站秘密保管私钥，在网上任意分发公钥，你想要登录网站只要用公钥加密就行了，密文只能由私钥持有者才能解密。而黑客因为没有私钥，所以就无法破解密文

上述的方法解决了数据加密，在网络传输过程中，数据有可能被篡改，并且黑客可以伪造身份发布公钥，如果你获取到假的公钥，那么混合加密也并无多大用处，你的数据扔被黑客解决

因此，在上述加密的基础上仍需加上完整性、身份验证的特性，来实现真正的安全，实现这一功能则是摘要算法

### 完整性与身份认证

实现完整性的手段主要是摘要算法，也就是常说的散列函数、哈希函数

可以理解成一种特殊的压缩算法，它能够把任意长度的数据“压缩”成固定长度、而且独一无二的“摘要”字符串，就好像是给这段数据生成了一个数字“指纹”

摘要算法保证了“数字摘要”和原文是完全等价的。所以，我们只要在原文后附上它的摘要，就能够保证数据的完整性

比如，你发了条消息：“转账1000元”，然后再加上一个SHA-2的摘要。网站收到后也计算一下消息的摘要，把这两份“指纹”做个对比，如果一致，就说明消息是完整可信的，没有被修改

**数字签名**

数字签名能确定消息确实是由发送方签名并发出来的，因为别人假冒不了发送方的签名

原理其实很简单，就是用私钥加密，公钥解密

签名和公钥一样完全公开，任何人都可以获取。但这个签名只有用私钥对应的公钥才能解开，拿到摘要后，再比对原文验证完整性，就可以像签署文件一样证明消息确实是你发的

和消息本身一样，因为谁都可以发布公钥，我们还缺少防止黑客伪造公钥的手段，也就是说，怎么判断这个公钥就是你的公钥

这时候就需要一个第三方，就是证书验证机构

**CA验证机构**

数字证书认证机构处于客户端与服务器双方都可信赖的第三方机构的立场

CA对公钥的签名认证要求包括序列号、用途、颁发者、有效时间等等，把这些打成一个包再签名，完整地证明公钥关联的各种信息，形成“数字证书”

流程如下图：

- 服务器的运营人员向数字证书认证机构提出公开密钥的申请

数字证书认证机构在判明提出申请者的身份之后，会对已申请的公开密钥做数字签名

然后分配这个已签名的公开密钥，并将该公开密钥放入公钥证书后绑定在一起

服务器会将这份由数字证书认证机构颁发的数字证书发送给客户端，以进行非对称加密方式通信接到证书的客户端可使用数字证书认证机构的公开密钥，对那张证书上的数字签名进行验证，一旦验证通过，则证明

认证服务器的公开密钥的是真实有效的数字证书认证机构

服务器的公开密钥是值得信赖的

### 安全能力总结

可以看到，HTTPS与HTTP虽然只差一个 SSL，但是通信安全得到了大大的保障，通信的四大特性都以解决，解决方式如下：

- 机密性：混合算法

完整性：摘要算法

- 身份认证:数字签名

- 不可否定：数字签名

## 11. 如何理解CDN？说说实现原理?

### 核心概念

CDN(全称 Content Delivery Network)，即内容分发网络

构建在现有网络基础之上的智能虚拟网络，依靠部署在各地的边缘服务器，通过中心平台的负载均衡、内容分发、调度等功能模块，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。CDN的关键技术主要有内容存储和分发技术

简单来讲，CDN就是根据用户位置分配最近的资源

于是，用户在上网的时候不用直接访问源站，而是访问离他“最近的”一个CDN节点，术语叫边缘节点，其实就是缓存了源站内容的代理服务器。如下图：

### 请求调度与负载均衡

在没有应用CDN时，我们使用域名访问某一个站点时的路径为

用户提交域名→浏览器对域名进行解释→DNS 解析得到目的主机的IP地址→根据IP地址访问发出请求→得到请求数据并回复

应用 CDN后，DNS 返回的不再是 IP 地址，而是一个 CNAME(Canonical Name）别名记录，指向CDN的全局负载均衡

CNAME实际上在域名解析的过程中承担了中间人(或者说代理）的角色，这是CDN实现的关键

**负载均衡系统**

由于没有返回IP地址，于是本地DNS 会向负载均衡系统再发送请求，则进入到 CDN的全局负载均衡系统进行智能调度：

- 看用户的IP地址，查表得知地理位置，找相对最近的边缘节点

- 看用户所在的运营商网络，找相同网络的边缘节点

- 检查边缘节点的负载情况，找负载较轻的节点

- 其他，比如节点的“健康状况”、服务能力、带宽、响应时间等

结合上面的因素，得到最合适的边缘节点，然后把这个节点返回给用户，用户就能够就近访问CDN的缓存代理

整体流程如下图：

### 缓存与回源

缓存系统是CDN的另一个关键组成部分，缓存系统会有选择地缓存那些最常用的那些资源其中有两个衡量CDN服务质量的指标：

- 命中率：用户访问的资源恰好在缓存系统里，可以直接返回给用户，命中次数与所有访问次数之比

回源率：缓存里没有，必须用代理的方式回源站取，回源次数与所有访问次数之比

缓存系统也可以划分出层次，分成一级缓存节点和二级缓存节点。一级缓存配置高一些，直连源站，二级缓存配置低一些，直连用户

回源的时候二级缓存只找一级缓存，一级缓存没有才回源站，可以有效地减少真正的回源

现在的商业 CDN命中率都在90%以上，相当于把源站的服务能力放大了10倍以上

### 整体价值

CDN目的是为了改善互联网的服务质量，通俗一点说其实就是提高访问速度

CDN构建了全国、全球级别的专网，让用户就近访问专网里的边缘节点，降低了传输延迟，实现了网站加速

通过CDN的负载均衡系统，智能调度边缘节点提供服务，相当于CDN服务的大脑，而缓存系统相当于CDN的心脏，缓存命中直接返回给用户，否则回源

## 12. DNS协议是什么？说说DNS 完整的查询过程？

### DNS 与域名层级

DNS(Domain Names System)，域名系统，是互联网一项服务，是进行域名和与之相对应的IP地址进行转换的服务器

简单来讲，DNS 相当于一个翻译官，负责将域名翻译成 ip地址

IP地址：一长串能够唯一地标记网络上的计算机的数字

- 域名：是由一串用点分隔的名字组成的Internet上某一台计算机或计算机组的名称，用于在数据传输时对计算机的定位标识

**域名层级**

域名是一个具有层次的结构，从上到下一次为根域名、顶级域名、二级域名、三级域名...

例如www.xxx.com，www为三级域名、 xxx为二级域名、com为顶级域名，系统为用户做了兼容，域名末尾的根域名.一般不需要输入

在域名的每一层都会有一个域名服务器，如下图：

除此之外，还有电脑默认的本地域名服务器

### 查询模式与缓存

DNS 查询的方式有两种：

- 递归查询：如果A 请求 B，那么 B 作为请求的接收者一定要给 A想要的答案

- 迭代查询：如果接收者B 没有请求者A 所需要的准确内容，接收者B 将告诉请求者 A，如何去获得这个内容，但是自己并不去发出请求

**域名缓存**

在域名服务器解析的时候，使用缓存保存域名和IP地址的映射

计算机中DNS的记录也分成了两种缓存方式：

浏览器缓存：浏览器在获取网站域名的实际IP地址后会对其进行缓存，减少网络请求的损耗

操作系统缓存：操作系统的缓存其实是用户自己配置的 hosts 文件

### 完整解析流程

解析域名的过程如下：

- 首先搜索浏览器的DNS 缓存，缓存中维护一张域名与IP地址的对应表

- 若没有命中，则继续搜索操作系统的DNS 缓存

- 若仍然没有命中，则操作系统将域名发送至本地域名服务器，本地域名服务器采用递归查询自己的DNS缓存，查找成功则返回结果

- 若本地域名服务器的DNS 缓存没有命中，则本地域名服务器向上级域名服务器进行迭代查询

首先本地域名服务器向根域名服务器发起请求，根域名服务器返回顶级域名服务器的地址给本地服务器

本地域名服务器拿到这个顶级域名服务器的地址后，就向其发起请求，获取权限域名服务器的地址

本地域名服务器根据权限域名服务器的地址向其发起请求，最终得到该域名对应的IP地址

- 本地域名服务器将得到的IP地址返回给操作系统，同时自己将IP地址缓存起来

- 操作系统将IP地址返回给浏览器，同时自己也将IP地址缓存起

- 至此，浏览器就得到了域名对应的IP地址，并将IP地址缓存起

流程如下图所示：

## 13. 说说对WebSocket的理解？应用场景?

### 核心概念

WebSocket，是一种网络传输协议，位于0SI模型的应用层。可在单个 TCP 连接上进行全双工通信，能更好的节省服务器资源和带宽并达到实时通迅

客户端和服务器只需要完成一次握手，两者之间就可以创建持久性的连接，并进行双向数据传输

从上图可见， websocket服务器与客户端通过握手连接，连接成功后，两者都能主动的向对方发送或接受数据

而在websocket出现之前，开发实时web应用的方式为轮询

不停地向服务器发送HTTP请求，问有没有数据，有数据的话服务器就用响应报文回应。如果轮询的频率比较高，那么就可以近似地实现“实时通信”的效果

轮询的缺点也很明显，反复发送无效查询请求耗费了大量的带宽和CPU资源

### 协议与握手

**全双工**

通信允许数据在两个方向上同时传输，它在能力上相当于两个单工通信方式的结合

例如指A→B的同时 B→A，是瞬时同步的

**二进制帧**

采用了二进制帧结构，语法、语义与HTTP完全不兼容，相比http/2，WebSocket更侧重于“实时通信”，而HTTP/2更侧重于提高传输效率，所以两者的帧结构也有很大的区别

不像HTTP/2那样定义流，也就不存在多路复用、优先级等特性

自身就是全双工，也不需要服务器推送

**协议名**

引入ws和wss 分别代表明文和密文的 websocket协议，且默认端口使用80或443，几乎与 http一致

HTTP
```js
ws://www.chrono.com
ws://www.chrono.com:8080/srv
wss://www.chrono.com:445/im?user\_id=xxx
```

**握手**

WebSocket也要有一个握手过程，然后才能正式收发数据

客户端发送数据格式如下：

HTTP

```yaml
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Origin: http://example.com
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
```

Connection:必须设置Upgrade，表示客户端希望连接升级

- Upgrade:必须设置Websocket，表示希望升级到Websocket协议

- Sec-WebSocket-Key:客户端发送的一个base64 编码的密文，用于简单的认证秘钥。要求服务端必须返回一个对应加密的“Sec-WebSocket-Accept应答，否则客户端会抛出错误，并关闭连接

```powershell
Sec-WebSocket-Version：表示支持的Websocket版本
```

服务端返回的数据格式：

HTTP
1 HTTP/1.1 101 Switching Protocols
```js
Upgrade: websocket
Connection: Upgrade
```
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+x0o=Sec-WebSocket-Protocol: c
hat

- HTTP/1.1101 Switching Protocols:表示服务端接受WebSocket 协议的客户端连接

- Sec-WebSocket-Accep:验证客户端请求报文，同样也是为了防止误连接。具体做法是把请求头里“Sec-WebSocket-Key”的值，加上一个专用的UUID，再计算摘要

### 优点

较少的控制开销：数据包头部协议较小，不同于http每次请求需要携带完整的头部

更强的实时性：相对于HTTP请求需要等待客户端发起请求服务端才能响应，延迟明显更少

保持创连接状态：创建通信后，可省略状态信息，不同于HTTP每次请求需要携带身份验证

- 更好的二进制支持：定义了二进制帧，更好处理二进制内容

支持扩展：用户可以扩展websocket协议、实现部分自定义的子协议

- 更好的压缩效果：Websocket在适当的扩展支持下，可以沿用之前内容的上下文，在传递类似的数据时，可以显著地提高压缩率

### 应用场景

基于websocket的事实通信的特点，其存在的应用场景大概有：

· 弹幕

· 媒体聊天

- 协同编辑

- 基于位置的应用

- 体育实况更新

股票基金报价实时更新

## 14. 说说地址栏输入URL 敲下回车后发生了什么？

### 整体流程

简单的分析，从输入URL到回车后发生的行为如下：

- URL解析

- DNS 查询

- TCP 连接

- HTTP 请求

- 响应请求

- 页面渲染

### 请求建立与发送

**URL解析**

首先判断你输入的是一个合法的URL还是一个待搜索的关键词，并且根据你输入的内容进行对应操作URL的解析第过程中的第一步，一个url的结构解析如下：

**DNS查询**

在之前文章中讲过DNS的查询，这里就不再讲述了

整个查询过程如下图所示：

最终，获取到了域名对应的目标服务器IP地址

**TCP连接**

在之前文章中，了解到tcp是一种面向有连接的传输层协议

在确定目标服务器服务器的 IP地址后，则经历三次握手建立 TCP 连接，流程如下:

**发送 http 请求**

当建立 tcp连接之后，就可以在这基础上进行通信，浏览器发送 http 请求到目标服务器请求的内容包括：

· 请求行

· 请求头

- 请求主体

①请求方法 ②请求URL ③HTTP协议及版本
POST /chapter17/user.html HTTP/1.1
④ Accept: image/jpeg, application/x-ms-application, ..., \*/\*
报 Referer: http://localhost:8088/chapter17/user/register.html?
文头 code=100&time=123123
Accept-Language: zh-CN
User-Agent: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1;
Content-Type: application/x-www-form-urlencoded
Host: localhost:8088
报文体 ⑤ Content-Length: 112 Connection: Keep-Alive Cache-Control: no-cache
Cookie:JSESSIONID=24DF2688E37EE4F66D9669D2542AC17B
name=tom&password=1234&realName=tomson

### 响应处理与页面渲染

当服务器接收到浏览器的请求之后，就会进行逻辑操作，处理完成之后返回一个HTTP响应消息，包括：

- 状态行

- 响应头

- 响应正文

在服务器响应之后，由于现在 http默认开始长连接 keep-alive，当页面关闭之后，tcp 链接则会经过四次挥手完成断开

**页面渲染**

当浏览器接收到服务器响应的资源后，首先会对资源进行解析：

- 查看响应头的信息，根据不同的指示做对应处理，比如重定向，存储cookie，解压gzip，缓存资源等等

- 查看响应头的Content-Type的值，根据不同的资源类型采用不同的解析方式

关于页面的渲染过程如下：

解析HTML，构建 DOM 树

- 解析 CSS，生成 CSS 规则树

合并 DOM 树和 CSS 规则，生成 render 树

- 布局render 树（Layout/reflow），负责各元素尺寸、位置的计算

绘制 render 树（paint），绘制页面像素信息

- 浏览器会将各层的信息发送给GPU，GPU会将各层合成（composite），显示在屏幕上
