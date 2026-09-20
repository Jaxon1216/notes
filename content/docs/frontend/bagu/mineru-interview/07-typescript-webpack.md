---
title: TypeScript 与 Webpack
description: TypeScript 与 Webpack 高频面试问答。
tags:
  - 前端八股
  - TypeScript
  - Webpack
status: published
updatedAt: '2026-09-16'
---

## 1. 如何理解 TypeScript？它与 JavaScript 有什么区别？

### 定义与编译方式

TypeScript是 JavaScript的类型的超集，支持 ES6语法，支持面向对象编程的概念，如类、接口、继承、泛型等

超集，不得不说另外一个概念，子集，怎么理解这两个呢，举个例子，如果一个集合A里面的的所有元素集合B里面都存在，那么我们可以理解集合B 是集合A的超集，集合A为集合B的子集

```ts
const hello: string = "Hello World!";
console.log(hello);
```

其是一种静态类型检查的语言，提供了类型注解，在代码编译阶段就可以检查出数据类型的错误

同时扩展了 JavaScript 的语法，所以任何现有的 JavaScript 程序可以不加改变的在 TypeScript 下工作

为了保证兼容性，TypeScript 在编译阶段需要编译器编译成纯 JavaScript 来运行，是为大型应用之开发而设计的语言，如下：

ts 文件如下：

编译文件后：

```js
const hello = "Hello World!";
console.log(hello);
```

### 类型系统与核心能力

TypeScript 的特性主要有如下：

类型批注和编译时类型检查：在编译时批注变量类型

- 类型推断:ts中没有批注变量类型会自动推断变量的类型

类型擦除:在编译过程中批注的内容和接口会在运行时利用工具擦除

- 接口：ts中用接口来定义对象类型

- 枚举：用于取值被限定在一定范围内的场景

Mixin：可以接受任意类型的值

- 泛型编程：写代码时使用一些以后才指定的类型

名字空间：名字只在该区域内有效，其他区域可重复使用该名字而不冲突

- 元组：元组合并了不同类型的对象，相当于一个可以装不同类型数据的数组

**类型批注**

通过类型批注提供在编译时启动类型检查的静态类型，这是可选的，而且可以忽略而使用JavaScript常规的动态类型

```ts
function Add(left: number, right: number): number {
return left + right;
}
```

对于基本类型的批注是 number、bool 和 string，而弱或动态类型的结构则是 any 类型

**类型推断**

当类型没有给出时，TypeScript编译器利用类型推断来推断类型，如下：

```js
let str = "string";
```

变量 str 被推断为字符串类型，这种推断发生在初始化变量和成员，设置默认参数值和决定函数返回值时

如果缺乏声明而不能推断出类型，那么它的类型被视作默认的动态 any 类型

**接口**

接口简单来说就是用来描述对象的类型数据的类型有 number、null、string 等数据格式，对象的类型就是用接口来描述的

```ts
interface Person {
name: string;
age: number;

let tom: Person = {
name: "Tom",
age: 25,
};
```

### 与 JavaScript 的区别

TypeScript 是 JavaScript 的超集，扩展了 JavaScript 的语法

- TypeScript 可处理已有的 JavaScript 代码，并只对其中的 TypeScript 代码进行编译

TypeScript 文件的后缀名.ts(.ts，.tsx，.dts)，JavaScript 文件是.js

在编写 TypeScript 的文件的时候就会自动编译成js 文件

更多的区别如下：

- JavaScript | TypeScript
- 语言 | 脚本语言 | 面向对象编程语言
- 学习难度 | 灵活易学 | 需要有脚本编程经验
- 类型 | 轻量级解释编程语言 | 强类型的面向对象编程语言
- 客户端/服务 | 客户端服务端都有 | 侧重客户端
- 拓展名 | js | .ts 或.tsx
- 耗时 | 更快 | 编译代码需要些时间
- 数据绑定 | 没有类型和接口的概念 | 使用类型和接口表示数据
- 语法 | 所有的语句都写在脚本标签内。浏览 器将脚本标签内的文本识别为脚本 | 一个 TypeScript 程序由模块、方法、变量 、语句、表达式和注释构成
- 静态类型 | JS中没有静态类型的概念 | 支持静态类型
- 模块支持 | 不支持模块 | 支持模块
- 接口 | 没有接口 | 支持接口
- 可选参数方法 | 不支持 | 支持
- 原型 | 没有这种特性 | 支持原型特性

## 2. 说说 TypeScript 的数据类型有哪些?

### 类型体系概览

typescript 和 javascript几乎一样，拥有相同的数据类型，另外在javascript基础上提供了更加实用的类型供开发使用

在开发阶段，可以为明确的变量定义为某种类型，这样typescript就能在编译阶段进行类型检查，当类型不合符预期结果的时候则会出现错误提示

typescript 的数据类型主要有如下：

- boolean(布尔类型）

number(数字类型）

- string（字符串类型）

- array（数组类型）

- tuple（元组类型）

- enum (枚举类型)

- any(任意类型)

null 和undefined 类型

- void 类型

- never 类型

- object 对象类型

### 基础类型与数组

```tsx
let num:number = 123;
// num = '456'; // 错误
num = 456; //正确
```

```tsx
let str:string = 'this is ts';
str = 'test';
```

```tsx
let flag:boolean = true;
// flag = 123; // 错误
flag = false; //正确
```

**number**

数字类型，和javascript一样，typescript的数值类型都是浮点数，可支持二进制、八进制、十进制和十六进制

**进制表示**

```ts
let decLiteral: number = 6; // 十进制
let hexLiteral: number = 0xf00d; // 十六进制
let binaryLiteral: number = 0b1010; // 二进制
let octalLiteral: number = 0o744; // 八进制
```

**string**

字符串类型，和JavaScript一样，可以使用双引号（）或单引号（）表示字符串

作为超集，当然也可以使用模版字符串\`\`进行包裹，通过\$嵌入变量

```ts
let name: string = `Gene;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }
```

```tsx
let arr:string[] = ['12', '23'];
```

arr = ['45', '56'];

**array**

数组类型，跟 javascript一致，通过[]进行包裹，有两种写法：

方式一：元素类型后面接上[]

方式二：使用数组泛型，Array<元素类型>：

```ts
let arr:Array<number> = [1, 2];
arr = ['45', '56'];
```

### 元组、枚举与特殊类型

元祖类型，允许表示一个已知元素数量和类型的数组，各元素的类型不必相同

```js
let tupleArr:[number, string, boolean];
tupleArr =[12, '34', truel; //ok
typleArr = [12, '34'] // no ok
```

赋值的类型、位置、个数需要和定义（生明）的类型、位置、个数一致

**enum**

enum类型是对JavaScript标准数据类型的一个补充，使用枚举类型可以为一组数值赋予友好的名字

```tsx
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```

**any**

可以指定任何类型的值，在编程阶段还不清楚类型的变量指定一个类型，不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查，这时候可以使用any类型

使用any类型允许被赋值为任意类型，甚至可以调用其属性、方法

```tsx
let num:any = 123;
num = 'str';
num = true;
```

定义存储各种类型数据的数组时，示例代码如下：

```ts
let arrayList: any[] = [1, false, 'fine'];
arrayList[1] = 100;
```

**null 和和 undefined**

在 JavaScript 中 null表示"什么都没有"，是一个只有一个值的特殊类型，表示一个空对象引用，而undefined表示一个没有设置值的变量

```tsx
let num:number |undefined; //数值类型或者 undefined
console.log(num); // 正确
num = 123;
console.log(num); // 正确
```

但是ts配置了--strictNullChecks标记，null和undefined只能赋值给void和它们各自

**void**

用于标识方法返回值的类型，表示该方法没有返回值。

```ts
function hello(): void {
alert("Hello Runoob");
}
```

**never**

never 是其他类型（包括null和 undefined）的子类型，可以赋值给任何类型，代表从不会出现的值

但是没有类型是 never的子类型，这意味着声明 never 的变量只能被 never 类型所赋值。

never类型一般用来指定那些总是会抛出异常、无限循环

```ts
let a:never;
a = 123; // 错误的写法

a = (() => { // 正确的写法
throw new Error('错误');
})()

//返回never的函数必须存在无法达到的终点
function error(message: string): never {
throw new Error(message);
}
```

**object**

对象类型，非原始类型，常见的形式通过{}进行包裹

```js
let obj:object;
obj = {name: 'Wang', age: 25};
```

### 类型分类总结

和 javascript基本一致，也分成：

- 基本类型

- 引用类型

在基础类型上，typescript增添了 void、any、emum等原始类型

## 3. 说说你对 TypeScript 中高级类型的理解？有哪些?

### 高级类型概览

除了 string、 number、boolean 这种基础类型外，在 typescript 类型声明中还存在一些高级的类型应用

这些高级类型，是typescript为了保证语言的灵活性，所使用的一些语言特性。这些特性有助于我们应对复杂多变的开发场景

常见的高级类型有如下：

- 交叉类型

- 联合类型

- 类型别名

- 类型索引

- 类型约束

- 映射类型

- 条件类型

### 类型组合与别名

通过&将多个类型合并为一个类型，包含了所需的所有类型的特性，本质上是一种并的操作

语法如下：

```ts
T&U
```

适用于对象合并场景，如下将声明一个函数，将两个对象合并成一个对象并返回：

```ts
function extend<T, U>(first: T, second: U) : T & U {
let result: <T & U> = {}
for (let key in first) {
result[key] = first[key]
}
for (let key in second) {
if(!result.hasOwnProperty(key)) {
result[key] = second[key]
}
}
return result
}
```

**联合类型**

联合类型的语法规则和逻辑“或”的符号一致，表示其类型为连接的多个类型中的任意一个，本质上是一个交的关系

语法如下：

```ts
TU
```

例如 number string boolean 的类型只能是这三个的一种，不能共存

如下所示：

```ts
function formatCommandline(command: string[] | string) {
let line = ';
if (typeof command === 'string') {
line = command.trim();
} else {
line = command.join(' ').trim();
}

```

**类型别名**

类型别名会给一个类型起个新名字，类型别名有时和接口很像，但是可以作用于原始值、联合类型、元组以及其它任何你需要手写的类型

可以使用 type SomeName = someValidTypeAnnotation 的语法来创建类型别名:

```ts
type some = boolean | string

const b: some = true // ok
const c: some = 'hello' // ok
const d: some = 123 // 不能将类型“123”分配给类型“some”
```

此外类型别名可以是泛型：

```ts
type Container<T> = { value: T };
```

也可以使用类型别名来在属性里引用自己：

```ts
type Tree<T> = {
value: T;
left: Tree<T>;
right: Tree<T>;
}
```

可以看到，类型别名和接口使用十分相似，都可以描述一个对象或者函数

两者最大的区别在于，interface只能用于定义对象类型，而 type 的声明方式除了对象之外还可以定义交叉、联合、原始类型等，类型声明的方式适用范围显然更加广泛

### 索引、约束与映射

keyof 类似于 Object.keys，用于获取一个接口中 Key的联合类型。

```ts
interface Button {
type: string
text: string
}

type ButtonKeys = keyof Button
//等效于
type ButtonKeys = "type"| "text"
```

**类型约束**

通过关键字 extend 进行约束，不同于在 class 后使用 extends 的继承作用，泛型内使用的主要作用是对泛型加以约束

```ts
type BaseType = string | number | boolean

// 这里表示 copy 的参数
//只能是字符串、数字、布尔这几种基础类型
function copy<T extends BaseType>(arg: T): T {
return arg
}
```

类型约束通常和类型索引一起使用，例如我们有一个方法专门用来获取对象的值，但是这个对象并不确定，我们就可以使用extends 和keyof进行约束。

```ts
function getValue<T, K extends keyof T>(obj: T, key: K) {
return obj[key]
}

const obj = { a: 1 }
const a = getValue(obj, 'a')
```

**映射类型**

通过 in 关键字做类型的映射，遍历已有接口的 key 或者是遍历联合类型，如下例子：

```ts
type Readonly<T> = {
readonly [P in keyof T]: T[P];
};
interface Obj {
a: string
b: string
}
type ReadonlyObj = Readonly<Obj>
```

上述的结构，可以分成这些步骤：

keyof T:通过类型索引 keyof 的得到联合类型'a' | 'b'

P in keyof T等同于 p in 'a'| 'b'，相当于执行了一次 forEach 的逻辑，遍历 'a' | 'b'

所以最终 ReadonlyObj 的接口为下述：

```ts
interface ReadonlyObj {
readonly a: string;
readonly b: string;
}
```

### 条件类型与使用要点

条件类型的语法规则和三元表达式一致，经常用于一些类型不确定的情况。

```ts
T extends U ? X : Y
```

上面的意思就是，如果T是U的子集，就是类型X，否则为类型Y

可以看到，如果只是掌握了 typeScript 的一些基础类型，可能很难游刃有余的去使用 typeScript，需要了解一些typescript的高阶用法

并且typescript在版本的迭代中新增了很多功能，需要不断学习与掌握

## 4. 说说你对 TypeScript 中接口的理解？应用场景?

### 接口的核心概念

接口是一系列抽象方法的声明，是一些方法特征的集合，这些方法都应该是抽象的，需要由具体的类去实现，然后第三方就可以通过这组抽象方法调用，让具体的类执行具体的方法

简单来讲，一个接口所描述的是一个对象相关的属性和方法，但并不提供具体创建此对象实例的方法typescript的核心功能之一就是对类型做检测，虽然这种检测方式是“鸭式辨型法”，而接口的作用就是为为这些类型命名和为你的代码或第三方代码定义一个约定

### 接口定义与类型约束

接口定义如下

```ts
interface interface\_name {
}
```

例如有一个函数，这个函数接受一个User 对象，然后返回这个User 对象的 name 属性:
```ts
const getUserName = (user) => user.name
```

可以看到，参数需要有一个user的name属性，可以通过接口描述user参数的结构

```ts
interface User {
name: string
age: number
}

const getUserName = (user: User) => user.name
```

这些属性并不一定全部实现，上述传入的对象必须拥有 name和 age 属性，否则 typescript 在编译阶段会报错，如下所示：

```ts
interface User {
name: string,
age: Number
const fn = (user: User) => {user.name}
类型“{ name：string;}”的参数不能赋给类型“User”的参数。
类型"{ name：string; }"中缺少属性 "age"，但类型 "User"中需要该属性。ts(2345)
index.ts(4，5)：在此处声明了 "age"。
查看问题（F8） 没有可用的快速修复
fn({name:"huihui"})
```

如果不想要age属性的话，这时候可以采用可选属性，如下表示：

```ts
interface User {
name: string
```

age?: number
4 }

这时候 age 属性则可以是 number 类型或者 undefined类型

有些时候，我们想要一个属性变成只读属性，在 typescript 只需要使用 readonly 声明，如下：

```ts
interface User {
```

name: string
age?: number
readonly isMale: boolean
5 }

当我们修改属性的时候，就会出现警告，如下所示：

```ts
interface User {
name: string,
age: Number,
readonly isOnly: boolean
}
无法分配到"isOnly"，因为它是只读属性。ts(2540)
(property) User.isOnly: any
const fn 查看问题（F8) 没有可用的快速修复
user.isOnly= false
}
```

这是属性中有一个函数，可以如下表示：

```ts
interface User {
name: string
age?: number
readonly isMale: boolean
say: (words: string) => string
}
```

如果传递的对象不仅仅是上述的属性，这时候可以使用：

- 类型推断

```ts
interface User {
name: string
age: number
}

const getUserName = (user: User) => user.name
getUserName({color: 'yellow'} as User)
```

给接口添加字符串索引签名

```ts
interface User {
name: string
```

age: number
[propName: string]: any;
5 }

接口还能实现继承，如下所示：

interface Father {
color: String
interface Son extends Father{
name: string
age: Number
const fn = (user: Son) =>
user
age (property) Son.age: Numb...
color
name

也可以继承多个，父类通过逗号隔开，如下：

```ts
interface Father {
color: String
}

interface Mother {
height: Number

interface Son extends Father,Mother{
name: string
age: Number
}
```

### 接口的工程应用

例如在javascript中定义一个函数，用来获取用户的姓名和年龄：

```js
const getUserInfo = function(user) {
//..
return name: ${user.name}, age: ${user.age}
}
```

如果多人开发的都需要用到这个函数的时候，如果没有注释，则可能出现各种运行时的错误，这时候就可以使用接口定义参数变量：

```ts
// 先定义一个接口
interface IUser {
name: string;
age: number;
}

const getUserInfo = (user: IUser): string => {
return `name: ${user.name}, age: ${user.age}`;
};

//正确的调用
getUserInfo({name: "koala", age: 18});
```

## 5. 说说你对 TypeScript 中类的理解？应用场景?

TypeScript的 class 支持面向对象的所有特性，比如类、接口等

### 类的核心概念与基本写法

类(Class)是面向对象程序设计(OOP，Object-Oriented Programming)实现信息封装的基础

传统的面向对象语言基本都是基于类的，JavaScript基于原型的方式让开发者多了很多理解成本

在 ES6 之后，JavaScript 拥有了 class 关键字，虽然本质依然是构造函数，但是使用起来已经方便了许多

但是 JavaScript 的 class依然有一些特性还没有加入，比如修饰符和抽象类

定义类的关键字为class，后面紧跟类名，类可以包含以下几个模块（类的数据成员）：

- 字段：字段是类里面声明的变量。字段表示对象的有关数据。

- 构造函数：类实例化时调用，可以为类的对象分配内存。

- 方法：方法为对象要执行的操作

如下例子：

```ts
class Car {
//字段
engine:string;
//构造函数
constructor(engine:string) {
this.engine = engine
}
11方法
disp():void {
console.log("发动机为："+this.engine)
}
}
```

### 继承、修饰符与抽象类

类的继承使用过extends的关键字

```ts
class Animal {
move(distanceInMeters: number = 0) {
console.log(`Animal moved ${distanceInMeters}m.`);
}
}

class Dog extends Animal {
bark( ) {
console.log('Woof! Woof!');
}
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```

Dog 是一个 派生类，它派生自 Animal 基类，派生类通常被称作子类，基类通常被称作 超类

Dog 类继承了 Animal类，因此实例 dog 也能够使用 Animal类move 方法

同样，类继承后，子类可以对父类的方法重新定义，这个过程称之为方法的重写，通过 super关键字是对父类的直接引用，该关键字可以引用父类的属性和方法，如下：

```ts
class PrinterClass {
doPrint():void {
console.log("父类的 doPrint() 方法。")
}
}
```

```ts
class StringPrinter extends PrinterClass {
doPrint():void {
super.doPrint() // 调用父类的函数
console.log("子类的 doPrint()方法。")
}
}
```

**修饰符**

可以看到，上述的形式跟ES6十分的相似，typescript在此基础上添加了三种修饰符:

- 公共public：可以自由的访问类程序里定义的成员

私有private:只能够在该类的内部进行访问

受保护protect：除了在该类的内部可以访问，还可以在子类中仍然可以访问

**私有修饰符**

只能够在该类的内部进行访问，实例对象并不能够访问

并且继承该类的子类并不能访问。

**受保护修饰符**

跟私有修饰符很相似，实例对象同样不能访问受保护的属性，如下：

有一点不同的是protected成员在子类中仍然可以访问

除了上述修饰符之外，还有只读修饰符

**只读修饰符**

通过 readonly 关键字进行声明，只读属性必须在声明时或构造函数里被初始化，如下：

```ts
class Father {
readonly name: String
constructor(name: String) {
this.name = name
}
const father = new Father('huihui')
无法分配到"name"，因为它是只读属性。ts(2540)
(property) Father.name: any
查看问题(F8)没有可用的快速修复
father.name 'change'
```

除了实例属性之外，同样存在静态属性

**静态属性**

这些属性存在于类本身上面而不是类的实例上，通过 static 进行定义，访问这些属性需要通过类型静态属性的这种形式访问，如下所示：

```ts
class Square {
static width = '100px'
}
console.log(Square.width) // 100px
```

上述的类都能发现一个特点就是，都能够被实例化，在typescript中，还存在一种抽象类

**抽象类**

抽象类做为其它派生类的基类使用，它们一般不会直接被实例化，不同于接口，抽象类可以包含成员的实现细节

abstract关键字是用于定义抽象类和在抽象类内部定义抽象方法，如下所示：

```ts
abstract class Animal {
abstract makeSound(): void;
move(): void {
console.log('roaming the earch...');
}
}
```

这种类并不能被实例化，通常需要我们创建子类去继承，如下：

```js
class Cat extends Animal {

makeSound() {
console.log('miao miao')
}
}

const cat = new Cat()

cat.makeSound() // miao miao
cat.move() // roaming the earch...
```

### 类的工程应用

除了日常借助类的特性完成日常业务代码，还可以将类（class）也可以作为接口，尤其在 React 工程中是很常用的，如下：

```ts
export default class Carousel extends React.Component<Props, State> {}
```

由于组件需要传入 props 的类型 Props，同时有需要设置默认 props 即defaultProps，这时候更加适合使用class作为接口

先声明一个类，这个类包含组件 props 所需的类型和初始值：

```ts
// props的类型
export default class Props {
public children: Array<React.ReactElement<any>>|React.ReactElement<any
> | never[] = []
public speed: number = 500
public height: number = 160
public animation: string = 'easeInOutQuad'
public isAuto: boolean = true
public autoPlayInterval: number = 4500
public afterChange: () => {}
public beforeChange: () => {}
public selesctedColor: string
public showDots: boolean = true
}
```

当我们需要传入 props 类型的时候直接将 Props 作为接口传入，此时 Props 的作用就是接口，而当需要我们设置defaultProps初始值的时候，我们只需要:

```ts
public static defaultProps = new Props()
```

Props 的实例就是 defaultProps 的初始值，这就是class作为接口的实际应用，我们用一个class 起到了接口和设置初始值两个作用，方便统一管理，减少了代码量

## 6. 说说你对 TypeScript 中枚举类型的理解？应用场景?

### 枚举的定义与声明

枚举是一个被命名的整型常数的集合，用于声明一组命名的常数,当一个变量有几种可能的取值时,可以将它定义为枚举类型

通俗来说，枚举就是一个对象的所有可能取值的集合

在日常生活中也很常见，例如表示星期的SUNDAY、MONDAY、TUESDAY、WEDNESDAY、THURSDAY、FRIDAY、SATURDAY就可以看成是一个枚举

枚举的说明与结构和联合相似，其形式为：

```text
enum 枚举名{
标识符①[=整型常数]，
标识符②[=整型常数]，
标识符N[=整型常数]，
}枚举变量;
```

**基本语法**

枚举的使用是通过 enum关键字进行定义，形式如下：

- 1 enum xxx { ... }

声明关键字为枚举类型的方式如下：

```ts
//声明d为枚举类型Direction
let d: Direction;
```

类型可以分成：

- 数字枚举

- 字符串枚举

- 异构枚举

### 枚举成员的取值类型

当我们声明一个枚举类型是,虽然没有给它们赋值,但是它们的值其实是默认的数字类型,而且默认从0开始依次累加:

```js
enum Direction {
Up，//值默认为 0
Down，//值默认为 1
Left，// 值默认为 2
Right // 值默认为 3
}

console.log(Direction.Up === 0); // true
console.log(Direction.Down === 1); // true
console.log(Direction.Left === 2); // true
console.log(Direction.Right === 3); // true
```

如果我们将第一个值进行赋值后，后面的值也会根据前一个值进行累加1

```ts
enum Direction {
Up = 10,
Down,
Left,
Right
}
console.log(Direction.Up, Direction.Down, Direction.Left, Direction.Right);
```

// 10 11 12 13

**字符串枚举**

```js
枚举类型的值其实也可以是字符串类型：

enum Direction {
Up = 'Up',
Down = 'Down',
Left = 'Left',
Right = 'Right'
}

console.log(Direction['Right'], Direction.Up); // Right Up
```

如果设定了一个变量为字符串之后，后续的字段也需要赋值字符串，否则报错：

```ts
enum Direction {
Up = 'UP',
Down, // error TS1061: Enum member must have initializer
Left, // error TS1061: Enum member must have initializer
Right // error TS1061: Enum member must have initializer
}
```

**异构枚举**

即将数字枚举和字符串枚举结合起来混合起来使用，如下：

```ts
enum BooleanLikeHeterogeneousEnum {
No = 0,
Yes = "YES",
}
```

通常情况下我们很少会使用异构枚举

### 编译结果与映射机制

现在一个枚举的案例如下：

```ts
enum Direction {
Up,
Down,
Left,
Right
}
```

通过编译后，javascript如下：

```js
var Direction;
(function (Direction) {
Direction[Direction["Up"] = 0] = "Up";
Direction[Direction["Down"] = 1] = "Down";
Direction[Direction["Left"] = 2] = "Left";
Direction[Direction["Right"] = 3] = "Right";
})(Direction  (Direction = {}));
```

上述代码可以看到，Direction[Direction["Up"] = 0] = "Up"可以分成

- Direction["Up"] = 0

- Direction[0] = "Up"

所以定义枚举类型后，可以通过正反映射拿到对应的值，如下：

```js
enum Direction {
Up,
Down,
Left,
Right
}

console.log(Direction.Up === 0); // true
console.log(Direction[0]); // Up
```

并且多处定义的枚举是可以进行合并操作，如下：

```ts
enum Direction {
Up = 'Up',
Down = 'Down',
Left = 'Left',
Right = 'Right'
}
enum Direction {
Center = 1
}
```

编译后，js 代码如下：

```js
var Direction;
(function (Direction) {
Direction["Up"] = "Up";
Direction["Down"] = "Down";
Direction["Left"] = "Left";
Direction["Right"] = "Right";
})(Direction | (Direction = {}));
(function (Direction) {
Direction[Direction["Center"] = 1] = "Center";
})(Direction || (Direction = {}));
```

可以看到，Direction对象属性回叠加

### 枚举的典型应用

就拿回生活的例子，后端返回的字段使用0-6标记对应的日期，这时候就可以使用枚举可提高代码可读性，如下：

```js
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 0); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true
```

包括后端日常返回0、1等等状态的时候，我们都可以通过枚举去定义，这样可以提高代码的可读性，便于后续的维护

## 7. 说说你对 TypeScript 中函数的理解？与 JavaScript函数的区别?

### 函数类型与声明方式

函数是JavaScript应用程序的基础，帮助我们实现抽象层、模拟类、信息隐藏和模块

在TypeScript里，虽然已经支持类、命名空间和模块，但函数仍然是主要定义行为的方式，TypeScript为JavaScript 函数添加了额外的功能，丰富了更多的应用场景

函数类型在 TypeScript类型系统中扮演着非常重要的角色，它们是可组合系统的核心构建块

跟 javascript 定义函数十分相似，可以通过 funciton 关键字、箭头函数等形式去定义，例如下面一个简单的加法函数：

```ts
const add = (a: number, b: number) => a + b
```

上述只定义了函数的两个参数类型，这个时候整个函数虽然没有被显式定义，但是实际上TypeScript 编译器是能够通过类型推断到这个函数的类型，如下所示:

```ts
const add: (a: number， b: number) => number
constadd=（a： number，b：number) => a +b
```

当鼠标放置在第三行add函数名的时候，会出现完整的函数定义类型，通过：的形式来定于参数类型，通过 => 连接参数和返回值类型

当我们没有提供函数实现的情况下，有两种声明函数类型的方式，如下所示：

```ts
//方式一
type LongHand = {
(a: number): number;
};

//方式二
type ShortHand = (a: number) => number;
```

当存在函数重载时，只能使用方式一的形式

### 参数能力与函数重载

当函数的参数可能是不存在的，只需要在参数后面加上？代表参数可能不存在，如下：

```ts
const add = (a: number, b?: number) => a + (b ? b : 0)
```

这时候参数b可以是number类型或者undefined类型，即可以传一个 number 类型或者不传都可以

**剩余类型**

剩余参数与JavaScript的语法类似，需要用... 来表示剩余参数

如果剩余参数rest是一个由number类型组成的数组，则如下表示：

```ts
const add = (a: number, ...rest: number[]) => rest.reduce(((a, b) => a + b)
,a)
```

**函数重载**

允许创建数项名称相同但输入输出类型或个数不同的子程序，它可以简单地称为一个单独功能可以执行多项任务的能力

关于typescript函数重载，必须要把精确的定义放在前面，最后函数实现时，需要使用操作符或者？操作符，把所有可能的输入类型全部包含进去，用于具体实现

这里的函数重载也只是多个函数的声明，具体的逻辑还需要自己去写，typescript并不会真的将你的多个重名 function的函数体进行合并

例如我们有一个add函数，它可以接收 string类型的参数进行拼接，也可以接收 number 类型的参数进行相加，如下：

```ts
//上边是声明
function add (arg1: string, arg2: string): string
function add (arg1: number, arg2: number): number
//因为我们在下边有具体函数的实现，所以这里并不需要添加declare 关键字

// 下边是实现
function add (arg1: string | number, arg2: string | number) {
// 在实现上我们要注意严格判断两个参数的类型是否相等，而不能简单的写一个arg1 + arg2
if (typeof arg1 ==='string' && typeof arg2 === 'string') {
return arg1 + arg2
} else if (typeof arg1 === 'number'&& typeof arg2 === 'number') {
return arg1 + arg2
}
}
```

### 与 JavaScript 函数的区别

从上面可以看到：

从定义的方式而言，typescript声明函数需要定义参数类型或者声明返回值类型

typescript 在参数中，添加可选参数供使用者选择

typescript增添函数重载功能，使用者只需要通过查看函数声明的方式，即可知道函数传递的参数个数以及类型

## 8. 说说你对 TypeScript 中泛型的理解？应用场景?

### 泛型解决的问题

泛型程序设计(generic programming)是程序设计语言的一种风格或范式

泛型允许我们在强类型程序设计语言中编写代码时使用一些以后才指定的类型，在实例化时作为参数指明这些类型

在typescript中，定义函数，接口或者类的时候，不预先定义好具体的类型，而在使用的时候在指定类型的一种特性

假设我们用一个函数，它可接受一个 number 参数并返回一个 number 参数，如下写法:

```ts
function returnItem (para: number): number {
return para

```

如果我们打算接受一个 string 类型，然后再返回string 类型，则如下写法：

```ts
function returnItem (para: string): string {
return para
}
```

上述两种编写方式，存在一个最明显的问题在于，代码重复度比较高

虽然可以使用any类型去替代，但这也并不是很好的方案，因为我们的目的是接收什么类型的参数返回什么类型的参数，即在运行时传入参数我们才能确定类型

这种情况就可以使用泛型，如下所示：

```ts
function returnItem<T>(para: T): T {
return para
}
```

可以看到，泛型给予开发者创造灵活、可重用代码的能力

### 泛型声明方式

泛型通过 <>的形式进行表述，可以声明:

- 函数

- 接口

· 类

**函数声明**

声明函数的形式如下：

```ts
function returnItem<T>(para: T): T {
return para
```

3}

定义泛型的时候，可以一次定义多个类型参数，比如我们可以同时定义泛型T和泛型U:

```ts
function swap<T, U>(tuple: [T, U]): [U, T] {
return[tuple[1], tuple[0]];
一

swap([7, 'seven']); // ['seven', 7]
```

**接口声明**

声明接口的形式如下：

```ts
interface ReturnItemFn<T> {
(para: T): T
}
```

那么当我们想传入一个number作为参数的时候，就可以这样声明函数：

```ts
const returnItem: ReturnItemFn<number> = para => para
```

**类声明**

使用泛型声明类的时候，既可以作用于类本身，也可以作用与类的成员函数

下面简单实现一个元素同类型的栈结构，如下所示：

```ts
class Stack<T> {
private arr: T[] = []

public push(item: T) {
this.arr.push(item)
}

public pop() {
this.arr.pop()
}
}
```

使用方式如下：

```ts
const stack = new Stacn<number>()
```

如果上述只能传递 string 和 number 类型，这时候就可以使用 <T extends xx> 的方式猜实现约束泛型，如下所示：

```ts
type Params = string | number
class Stack<T extends Params> {
private arr: T[] = []
public push(item: T) {
this.arr.push(item)
public pop() {
this.arr.pop()
类型“boolean"不满足约束“Params”。ts(2344)
查看问题(F8) 没有可用的快速修复
const stack = new Stack<boolean>()
```

除了上述的形式，泛型更高级的使用如下：

例如要设计一个函数，这个函数接受两个参数，一个参数为对象，另一个参数为对象上的属性，我们通过这两个参数返回这个属性的值

这时候就设计到泛型的索引类型和约束类型共同实现

### 泛型约束

索引类型keyof T 把传入的对象的属性类型取出生成一个联合类型，这里的泛型U被约束在这个联合类型中，如下所示：

```ts
function getValue<T extends object, U extends keyof T>(obj: T, key: U) {
returnobj[key] // ok
```

上述为什么需要使用泛型约束，而不是直接定义第一个参数为 object类型，是因为默认情况 object 指的是{}，而我们接收的对象是各种各样的，一个泛型来表示传入的对象类型，比如T extends object

使用如下所示：

```ts
function getValue<T extends object, U extends keyof T>(obj: T, key: U) {
return obj[key] // ok
}
const a = {
name: 'huihui',
age: 18
} getValue(obj: { name: string; age:
number; }, key: "name" |"age"): string
number
getValue(a,)
```

**多类型约束**

例如如下需要实现两个接口的类型约束：

```ts
interface FirstInterface {
doSomething(): number
}

interface SecondInterface {
doSomethingElse(): string
}
```

可以创建一个接口继承上述两个接口，如下

```ts
interface ChildInterface extends FirstInterface, SecondInterface {
}
```

正确使用如下：

```ts
class Demo<T extends ChildInterface> {
private genericProperty: T

constructor(genericProperty: T) {
this.genericProperty = genericProperty
}
useT() {
this.genericProperty.doSomething()
this.genericProperty.doSomethingElse()
}
}
```

通过泛型约束就可以达到多类型约束的目的

### 泛型的典型应用

通过上面初步的了解，后述在编写typescript的时候，定义函数，接口或者类的时候，不预先定义好具体的类型，而在使用的时候在指定类型的一种特性的时候，这种情况下就可以使用泛型

灵活的使用泛型定义类型，是掌握typescript必经之路

## 9. 说说你对 TypeScript 装饰器的理解？应用场景?

### 装饰器的本质与启用方式

装饰器是一种特殊类型的声明，它能够被附加到类声明，方法，访问符，属性或参数上

是一种在不改变原类和使用继承的情况下，动态地扩展对象功能

同样的，本质也不是什么高大上的结构，就是一个普通的函数， @expression的形式其实是Object.defineProperty 的语法糖

expression求值后必须也是一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入

由于typescript是一个实验性特性，若要使用，需要在 tsconfig.json文件启动，如下：

```ts
{
"compilerOptions": {
"target": "ES5",
"experimentalDecorators": true
}
}
```

typescript装饰器的使用和 javascript基本一致

类的装饰器可以装饰：

· 类

- 方法/属性

· 参数

- 访问器

### 装饰目标与参数

例如声明一个函数 addAge 去给 Class 的属性 age 添加年龄.

```ts
function addAge(constructor: Function) {
constructor.prototype.age = 18;
}

@addAge
class Person{
name: string;
age!: number;
constructor() {
this.name = 'huihui';
}
}

let person = new Person();

console.log(person.age); // 18
```

上述代码，实际等同于以下形式：

```ts
Person = addAge(function Person() { ... });
```

上述可以看到，当装饰器作为修饰类的时候，会把构造器传递进去。 constructor.prototype.ag

e 就是在每一个实例化对象上面添加一个 age 属性

**方法/属性装饰**

同样，装饰器可以用于修饰类的方法，这时候装饰器函数接收的参数变成了：

- target：对象的原型

propertyKey：方法的名称

descriptor:方法的属性描述符

可以看到，这三个属性实际就是Object.defineProperty的三个参数，如果是类的属性，则没有传递第三个参数

如下例子：

```ts
//声明装饰器修饰方法/属性
function method(target: any, propertyKey: string, descriptor: PropertyDesc
riptor) {
console.log(target);
console.log("prop " + propertyKey);
console.log("desc " + JSON.stringify(descriptor) +"\n\n");
descriptor.writable = false;
};

function property(target: any, propertyKey: string) {
console.log("target", target)
console.log("propertyKey", propertyKey)
}

class Person{
@property
name: string;
constructor() {
this.name = 'huihui';
}

@method
say(){
return 'instance method';
}

@method
static run(){
return 'static method';
}
}

const xmz= new Person();

修改实例方法say
xmz.say = function( ) {
return 'edit'

```

输出如下所示：

```js
target ▶{constructor: f, say: f} index.ts:12
propertyKey name index.ts:13
{constructor: f, say: f} index.ts:5
prop say index.ts:6
desc {"writable":true,"enumerable":false,"configurable":true} index.ts:7
class Person { index.ts:5
constructor() {
this.name = 'xiaomuzhu';
}
say() {
return 'instance method';
}
static run() {
return 'static method';
}
}
prop run index.ts:6
desc {"writable":true,"enumerable":false,"configurable":true} index.ts:7
Uncaught TypeError: Cannot assign to read only property 'say' of object '#<Person>' index.ts:37
at index.ts:37
```

**参数装饰**

接收3个参数，分别是：

- target：当前对象的原型

propertyKey：参数的名称

index：参数数组中的位置

```ts
function logParameter(target:Object, propertyName: string, index: number)
{
console.log(target);
console.log(propertyName);
console.log(index);
}

class Employee {
greet(@logParameter message: string): string {
return `hello ${message}`;
}
}
const emp = new Employee();
emp.greet('hello');
```

输入如下所示：

Object1
constructor:class Employee
greet:fgreet(message)
[[Prototype]]:Object
greet

**访问器装饰**

使用起来方式与方法装饰一致，如下：

```ts

function modification(target: Object, propertyKey: string, descriptor: Pro
pertyDescriptor) {
console.log(target);
console.log("prop " + propertyKey);
console.log("desc " + JSON.stringify(descriptor) + "\n\n");
};

class Person{
_name: string;
constructor() {
this._name = 'huihui';
}

@modification
get name( ) {
return this._name
}
}
```

### 装饰器工厂与执行顺序

如果想要传递参数，使装饰器变成类似工厂函数，只需要在装饰器函数内部再函数一个函数即可，如下：

```ts
function addAge(age: number) {
return function(constructor: Function) {
constructor.prototype.age = age
}

@addAge(10)
class Person{
name: string;
age!: number;
constructor() {
this.name = 'huihui';
}
}

let person = new Person();
```

**执行顺序**

当多个装饰器应用于一个声明上，将由上至下依次对装饰器表达式求值，求值的结果会被当作函数，由下至上依次调用，例如如下：

```ts
function f( ) {
console.log("f(): evaluated");
return function (target, propertyKey: string, descriptor: PropertyDesc
riptor) {
console.log("f(): called");
}
}

function g( ) {
console.log("g(): evaluated");
return function (target, propertyKey: string, descriptor: PropertyDesc
riptor) {
console.log("g(): called");
}
}

class C {
@f( )
@g()
method() {}
}

//输出
f(): evaluated
g(): evaluated
g(): called
f(): called
```

### 装饰器的典型应用

可以看到，使用装饰器存在两个显著的优点:

代码可读性变强了，装饰器命名相当于一个注释

- 在不改变原有代码情况下，对原来功能进行扩展

后面的使用场景中，借助装饰器的特性，除了提高可读性之后，针对已经存在的类，可以通过装饰器的特性，在不改变原有代码情况下，对原来功能进行扩展

## 10. 说说对 TypeScript 中命名空间与模块的理解？区别?

### 模块

TypeScript 与ECMAScript 2015 一样，任何包含顶级 import 或者 export 的文件都被当成一个模块

相反地，如果一个文件不带有顶级的 import或者 export 声明，那么它的内容被视为全局可见的例如我们在在一个 TypeScript 工程下建立一个文件 1.ts，声明一个变量 a，如下：

然后在另一个文件同样声明一个变量a，这时候会出现错误信息

提示重复声明a变量，但是所处的空间是全局的

如果需要解决这个问题，则通过import或者 export 引入模块系统即可，如下:

```ts
const a = 10;
export default a
```

在typescript中，export 关键字可以导出变量或者类型，用法与 es6模块一致，如下：

```ts
export const a = 1
export type Person = {
name: String
}
```

通过 import 引入模块，如下：

```ts
import { a, Person } from './export';
```

### 命名空间

命名空间一个最明确的目的就是解决重名问题

命名空间定义了标识符的可见范围，一个标识符可在多个名字空间中定义，它在不同名字空间中的含义是互不相干的

这样，在一个新的名字空间中可定义任何标识符，它们不会与任何已有的标识符发生冲突，因为已有的定义都处于其他名字空间中

TypeScript 中命名空间使用 namespace 来定义，语法格式如下：

```ts
namespace SomeNameSpaceName {
export interface ISomeInterfaceName { }
export class SomeClassName { }
}
```

以上定义了一个命名空间 SomeNameSpaceName，如果我们需要在外部可以调用 SomeNameSpaceName 中的类和接口，则需要在类和接口添加 export关键字

使用方式如下：

```ts
SomeNameSpaceName.SomeClassName
```

命名空间本质上是一个对象，作用是将一系列相关的全局变量组织到一个对象的属性，如下：

```ts
namespace Letter {
export let a = 1;
export let b = 2;
export let c = 3;
// ..
export let z = 26;
}
```

编译成js 如下：

```js
var Letter;
(function (Letter) {
Letter.a = 1;
Letter.b = 2;
Letter.c = 3;
//..
Letter.z = 26;
})(Letter | (Letter = {}));
```

### 核心区别与选型

- 命名空间是位于全局命名空间下的一个普通的带有名字的JavaScript 对象，使用起来十分容易。但就像其它的全局命名空间污染一样，它很难去识别组件之间的依赖关系，尤其是在大型的应用中

- 像命名空间一样，模块可以包含代码和声明。不同的是模块可以声明它的依赖

- 在正常的TS项目开发过程中并不建议用命名空间，但通常在通过d.ts 文件标记js库类型的时候使用命名空间，主要作用是给编译器编写代码的时候参考使用

## 11. 说说如何在 React 项目中应用 TypeScript?

### 环境准备与类型声明

单独的使用 TypeScript并不会导致学习成本很高，但是绝大部分前端开发者的项目都是依赖于框架的

例如与Vue、React这些框架结合使用的时候，会有一定的门槛

使用 TypeScript 编写 React 代码，除了需要 TypeScript 这个库之外，还需要安装 @types/react、@types/react-dom

```bash
npm i @types/react -s
npm i @types/react-dom -s
```

至于上述使用@types 的库的原因在于，目前非常多的 JavaScript库并没有提供自己关于 TypeScript 的声明文件

所以，ts 并不知道这些库的类型以及对应导出的内容，这里 @types 实际就是社区中的 DefinitelyTyped库，定义了目前市面上绝大多数的 JavaScript 库的声明

所以下载相关的 JavaScript 对应的 @types 声明时，就能够使用使用该库对应的类型定义

在编写 React 项目的时候，最常见的使用的组件就是：

- 无状态组件

- 有状态组件

- 受控组件

### 函数组件与 Props

主要作用是用于展示UI，如果使用js声明，则如下所示：

```js
import * as React from "React";

export const Logo = (props) => {
const { logo, className, alt } = props;

return <img src={logo} className={className} alt={alt} />;
};
```

但这时候 ts 会出现报错提示，原因在于没有定义 porps 类型，这时候就可以使用 interface接口去定义 porps 即可，如下：

```ts
import * as React from "React";

interface IProps {
logo?: string;
className?: string;
alt?: string;
}

export const Logo = (props: IProps) => {
const { logo, className, alt } = props;

return<img src={logo} className={className} alt={alt} />;
}i
```

但是我们都知道 props 里面存在 children 属性，我们不可能每个 porps 接口里面定义多一个children，如下：

```ts
interface IProps {
logo?: string;
className?: string;
alt?: string;
children?: ReactNode;
}
```

更加规范的写法是使用 React 里面定义好的 FC 属性，里面已经定义好 children 类型，如下：

```ts
export const Logo: React.FC<IProps> = (props) => {
const { logo, className, alt } = props;

return <img src={logo} className={className} alt={alt} />;
};
```

- React.FC显式地定义了返回类型，其他方式是隐式推导的

- React.FC 对静态属性：displayName、propTypes、defaultProps提供了类型检查和自动补全

- React.FC 为children 提供了隐式的类型(ReactElement |null)

### 类组件、State 与事件

可以是一个类组件且存在 props 和 state 属性

如果使用 TypeScript 声明则如下所示：

```ts
import * as React from "React";

interface IProps {
color: string;
size?: string;
}
interface IState {
count: number;
}
class App extends React.Component<IProps, IState> {
public state = {
count: 1,
};
public render() {
return <div>Hello world</div>;
}
}
```

上述通过泛型对 props、state 进行类型定义，然后在使用的时候就可以在编译器中获取更好的智能提示

关于 Component 泛型类的定义，可以参考下 React 的类型定义文件 node\_modules/@types/React/index.d.ts，如下所示：

```ts
class Component<P, S> {
readonly props: Readonly<{ children?: ReactNode }> & Readonly<P>;

state: Readonly<S>;
}
```

从上述可以看到，state 属性也定义了可读类型，目的是为了防止直接调用 this.state 更新状态

**受控组件**

受控组件的特性在于元素的内容通过组件的状态 state进行控制

由于组件内部的事件是合成事件，不等同于原生事件，

例如一个input 组件修改内部的状态，常见的定义的时候如下所示：

```ts
private updateValue(e: React.ChangeEvent<HTMLInputElement>) {
this.setState({ itemText: e.target.value })
}
```

常用 Event 事件对象类型：

- ClipboardEvent<T = Element> 剪贴板事件对象

- DragEvent<T = Element> 拖拽事件对象

- ChangeEvent<T = Element> Change 事件对象

- KeyboardEvent<T= Element> 键盘事件对象

- MouseEvent<T = Element> 鼠标事件对象

- TouchEvent<T = Element>触摸事件对象

- WheelEvent<T = Element> 滚轮事件对象

- AnimationEvent<T = Element> 动画事件对象

- TransitionEvent<T = Element> 过渡事件对象

T 接收一个 DOM 元素类型

## 12. 说说如何在Vue项目中应用TypeScript?

### 接入方式与类组件模型

与link类似

在VUE项目中应用 typescript，我们需要引入一个库vue-property-decorator，

其是基于 vue-class-component库而来，这个库vue官方推出的一个支持使用 class方式来开发 vue单文件组件的库

主要的功能如下：

methods可以直接声明为类的成员方法

计算属性可以被声明为类的属性访问器

初始化的data 可以被声明为类属性

data、render 以及所有的Vue 生命周期钩子可以直接作为类的成员方法

- 所有其他属性，需要放在装饰器中

vue-property-decorator主要提供了多个装饰器和一个函数:

### 组件选项、数据与方法

**@Component**

Component装饰器它注明了此类为一个Vue组件，因此即使没有设置选项也不能省略

如果需要定义比如 name、 components、 filters directives以及自定义属性，就可以在Component装饰器中定义，如下：

Vue 示例：
```ts
import {Component,Vue} from 'vue-property-decorator';
import {componentA,componentB} from '@/components';
@Component({
components:{
```
6 componentA,
7 componentB,
```ts
},
directives: {
focus: {
//指令的定义
inserted: function (el) {
el.focus()
}
}
}
})
export default class YourCompoent extends Vue{
}
```

**computed、data、methods**

这里取消了组件的data和methods属性，以往data返回对象中的属性、methods中的方法需要直接定义在Class中，当做类的属性和方法

```ts
@Component
export default class HelloDecorator extends Vue {
count: number = 123 // 类属性相当于以前的 data

add(): number { // 类方法就是以前的方法
this.count + 1
}

//获取计算属性
get total(): number {
return this.count + 1
}

// 设置计算属性
set total(param:number): void {
this.count = param
}

```

### Props、监听与事件

**@props**

组件接收属性的装饰器，如下使用：

```ts
import {Component,Vue,Prop} from vue-property-decorator;

@Component
export default class YourComponent extends Vue {
@Prop(String)
propA:string;

@Prop([String,Number])
propB:string|number;

@Prop({
type: String, // type: [String , Number]
default:'default value',//—般为String或Number
//如果是对象或数组的话。默认值从一个工厂函数中返回
// default: () => {
// return ['a','b']
//}
required: true,
validator: (value) => {
return [
'InProcess',
'Settled'
].indexOf(value) !== -1
}
})
propC:string;
}
```

**@watch**

实际就是 Vue 中的监听器，如下：

```ts
Vue
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
@Watch('child')
onChildChanged(val: string, oldVal: string) {}

@Watch('person', { immediate: true, deep: true })
onPersonChanged1(val: Person, oldVal: Person) {}

@Watch('person')
onPersonChanged2(val: Person, oldVal: Person) {}
}
```

**@emit**

vue-property-decorator 提供的 @Emit装饰器就是代替Vue中的事件的触发\$emit，如下：

```ts
import {Vue, Component, Emit} from 'vue-property-decorator';
@Component({})
export default class Some extends Vue{
mounted( ) {
this.$on('emit-todo', function(n) {
console.log(n)
})
this.emitTodo('world');

@Emit()
emitTodo(n: string){
console.log('hello');
}

```

### 使用要点

可以看到上述typescript版本的vueclass的语法与平时javascript版本使用起来还是有很大的不同，多处用到class与装饰器，但实际上本质是一致的，只有不断编写才会得心应手

---

## 1. 说说你对Webpack的理解？解决了什么问题?

### 模块化背景与痛点

Webpack 最初的目标是实现前端项目的模块化，旨在更高效地管理和维护项目中的每一个资源

**模块化**

最早的时候，我们会通过文件划分的形式实现模块化，也就是将每个功能及其相关状态数据各自单独放到不同的 JS文件中

约定每个文件是一个独立的模块，然后再将这些js 文件引入到页面，一个 script标签对应一个模块，然后调用模块化的成员

```html
<script src="module-a.js"></script>
<script src="module-b.js"></script>
```

但这种模块弊端十分的明显，模块都是在全局中工作，大量模块成员污染了环境，模块与模块之间并没有依赖关系、维护困难、没有私有空间等问题

项目一旦变大，上述问题会尤其明显

随后，就出现了命名空间方式，规定每个模块只暴露一个全局对象，然后模块的内容都挂载到这个对象中

```js
window.moduleA = {
method1: function () {
console.log('moduleA#method1')
}
}
```

这种方式也并没有解决第一种方式的依赖等问题

再后来，我们使用立即执行函数为模块提供私有空间，通过参数的形式作为依赖声明，如下

```js
// module-a.js
(function ($) {
var name = 'module-a'

function method1 () {
console.log(name + '#method1')
$('body').animate({ margin: '200px' })
}

window.moduleA = {
method1: method1
}
})(jQuery)
```

上述的方式都是早期解决模块的方式，但是仍然存在一些没有解决的问题。例如，我们是用

过script标签在页面引入这些模块的，这些模块的加载并不受代码的控制，时间一久维护起来也十分的麻烦

理想的解决方式是，在页面中引入一个JS入口文件，其余用到的模块可以通过代码控制，按需加载进来

除了模块加载的问题以外，还需要规定模块化的规范，如今流行的则是 CommonJS、ES Modules

**问题**

从后端渲染的 JSP、PHP，到前端原生 JavaScript，再到 jQuery开发，再到目前的三大框架Vue、React、Angular

开发方式，也从 javascript到后面的es5、es6、7、8、9、10，再到typescript，包括编写 CSS 的预处理器 less、scss等

现代前端开发已经变得十分的复杂，所以我们开发过程中会遇到如下的问题：

- 需要通过模块化的方式来开发

使用一些高级的特性来加快我们的开发效率或者安全性，比如通过ES6+、TypeScript开发脚本逻辑，通过sass、less等方式来编写css样式代码

- 监听文件的变化来并且反映到浏览器上，提高开发的效率

- JavaScript 代码需要模块化，HTML 和 CSS 这些资源文件也会面临需要被模块化的问题

开发完成后我们还需要将代码进行压缩、合并以及其他相关的优化

而webpack恰巧可以解决以上问题

### Webpack 的定位与工作方式

webpack 是一个用于现代 JavaScript 应用程序的静态模块打包工具

- 静态模块

这里的静态模块指的是开发阶段，可以被 webpack 直接引用的资源（可以直接被获取打包进bundle.js的资源)

当webpack处理应用程序时，它会在内部构建一个依赖图，此依赖图对应映射到项目所需的每个模块(不再局限 js 文件)，并生成一个或多个 bundle

### Webpack 的核心能力

万物皆可模块能力，项目维护性增强，支持不同种类的前端模块类型，统一的模块化方案，所有资源文

**编译代码能力，提高效率，解决浏览器兼容问题**

开发阶段

生产阶段

ES 6

ES6

ES 5

ES 5

ES 6

ES 6

编译

ES 5

ES 5

ES 6

ES6

ES 5

ES 5

**模块整合能力，提高性能，可维护性，解决浏览器频繁请求文件的问题**

开发阶段

生产阶段

ES 6

ES 6

ES6

ES6

打包

Bundle.js

ES 6

ES 6

件的加载都可以通过代码控制

## 2. 说说Webpack的热更新是如何做到的？原理是什么?

### HMR 的作用与配置

HMR全称 Hot Module Replacement，可以理解为模块热替换，指在应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个应用

例如，我们在应用运行过程中修改了某个模块，通过自动刷新会导致整个应用的整体刷新，那页面中的状态信息都会丢失

如果使用的是HMR，就可以实现只将修改的模块实时替换至应用中，不必完全刷新整个应用

在webpack中配置开启热模块也非常的简单，如下代码：

```js
const webpack = require('webpack')
module.exports = {
//..
devServer: {
// 开启 HMR 特性
hot: true
// hotOnly: true
}
}
```

通过上述这种配置，如果我们修改并保存Css文件，确实能够以不刷新的形式更新到页面中但是，当我们修改并保存js文件之后，页面依旧自动刷新了，这里并没有触发热模块所以，HMR并不像 Webpack 的其他特性一样可以开箱即用，需要有一些额外的操作我们需要去指定哪些模块发生更新时进行HRM，如下代码：

```js
if(module.hot){
module.hot.accept('./util.js',()=>{
console.log("util.js更新了")
})
}
```

### 热更新链路

首先来看看一张图，如下：

Webpack Compile:将 JS 源代码编译成 bundle.js

- HMR Server:用来将热更新的文件输出给HMR Runtime

- Bundle Server:静态资源文件服务器，提供文件访问路径

HMR Runtime：socket服务器，会被注入到浏览器，更新文件的变化

bundle.js:构建输出的文件

在HMR Runtime 和 HMR Server之间建立websocket，用于实时更新文件变化。整个流程可以分成两个阶段：

- 启动阶段为 1 - 2 - A - B

在编写未经过webpack打包的源代码后， Webpack Compile 将源代码和 HMR Runtime 一起编译成 bundle 文件，传输给 Bundle Server 静态资源服务器

- 更新阶段为 1- 2- 3 - 4

当某一个文件或者模块发生变化时，webpack监听到文件变化对文件重新编译打包，编译生成唯一的hash值，这个hash值用来作为下一次热更新的标识

根据变化的内容生成两个补丁文件： manifest (包含了 hash 和 chunkId，用来说明变化的内容）和 chunk.js模块

由于 socket 服务器在HMR Runtime 和 HMR Server之间建立websocket 链接，当文件发生改动的时候，服务端会向浏览器推送一条消息，消息包含文件改动后生成的hash值，作为下一次热更新的标识。

> 原文此处为浏览器开发者工具截图转录，具体 hash 文件名属于单次构建结果，已省略；保留其用于定位 manifest 和 update chunk 的结论。

在浏览器接受到这条消息之前，浏览器已经在上一次 socket消息中已经记住了此时的hash标识，这时候我们会创建一个 ajax 去服务端请求获取到变化内容的 manifest 文件

manifest文件包含重新 build生成的 hash值，以及变化的模块，对应其中的 c 属性

浏览器根据 manifest 文件获取模块变化的内容，从而触发 render流程，实现局部模块更新

### 核心流程总结

关于webpack热模块更新的总结如下：

通过webpack-dev-server创建两个服务器：提供静态资源的服务(express)和Socket服务

express server负责直接提供静态资源的服务(打包后的资源直接被浏览器请求和解析)

socket server 是一个 websocket 的长连接，双方可以通信

- 当socket server监听到对应的模块发生变化时，会生成两个文件.json(manifest文件)和.js文件

(update chunk)

通过长连接，socket server可以直接将这两个文件主动发送给客户端(浏览器)

- 浏览器拿到两个新的文件后，通过HMR runtime机制，加载这两个文件，并且针对修改的模块进行更新

## 3. 说说Webpack的构建流程?

### 构建流程概览

webpack 的运行流程是一个串行的过程，它的工作流程就是将各个插件串联起来

在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条webpack机制中，去改变webpack的运作，使得整个系统扩展性良好

从启动到结束会依次执行以下三大步骤：

初始化流程：从配置文件和 Shell 语句中读取与合并参数，并初始化需要使用的插件和配置插件等执行环境所需要的参数

- 编译构建流程：从 Entry 发出，针对每个 Module串行调用对应的Loader 去翻译文件内容，再找到该Module依赖的Module，递归地进行编译处理

输出流程：对编译后的Module 组合成 Chunk，把Chunk 转换成文件，输出到文件系统

### 初始化阶段

从配置文件和 Shell语句中读取与合并参数，得出最终的参数

配置文件默认下为webpack.config.js，也或者通过命令的形式指定配置文件，主要作用是用于激活 webpack的加载项和插件

关于文件配置内容分析，如下注释：

```js
var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules,'react/dist/react.min.js');

module.exports = {
//入口文件，是模块构建的起点，同时每一个入口文件对应最后生成的一个chunk。
entry: './path/to/my/entry/file.js',
// 文件路径指向(可加快打包过程)。
resolve: {
alias: {
'react': pathToReact
}
},
//生成文件，是模块构建的终点，包括输出文件与输出路径。
output: {
path: path.resolve(__dirname, 'build'),
filename: '[name].js'
},
// 这里配置了处理各模块的 loader，包括 css 预处理 loader，es6 编译 loader，图
片处理 loader。
module: {
loaders: [
{
test: /\.js$/,
loader: 'babel',
query: {
presets: ['es2015','react']
}
}
],
noParse: [pathToReact]
},
// webpack 各插件对象，在webpack 的事件流中执行对应的方法。
plugins: [
new webpack.HotModuleReplacementPlugin()
]
};
```

webpack 将 webpack.config.js 中的各个配置项拷贝到 options 对象中，并加载用户配置的plugins

完成上述步骤之后，则开始初始化Compiler编译对象，该对象掌控者 webpack 声明周期，不执行具体的任务，只是进行一些调度工作

```js
class Compiler extends Tapable {
constructor(context) {
super();
this.hooks = {
beforeCompile: new AsyncSeriesHook(["params"]),
compile: new SyncHook(["params"]),
afterCompile: new AsyncSeriesHook(["compilation"]),
make: new AsyncParallelHook(["compilation"]),
entryOption: new SyncBailHook(["context", "entry"])
//定义了很多不同类型的钩子
};
//...
}
}
function webpack(options) {
var compiler = new Compiler();
...// 检查options,若watch字段为true,则开启watch线程
return compiler;
}
```

Compiler 对象继承自Tapable，初始化时定义了很多钩子函数

### 编译与依赖构建

根据配置中的 entry 找出所有的入口文件

```js
module.exports = {
entry:'./src/file.js'
}
```

初始化完成后会调用 Compiler 的 run 来真正启动 webpack 编译构建流程，主要流程如下:

compile 开始编译

make 从入口点分析模块及其依赖的模块，创建这些模块对象

build-module 构建模块

seal 封装构建结果

emit 把各个chunk输出到结果文件

**compile 编译**

执行了 run 方法后，首先会触发 compile，主要是构建一个 Compilation 对象该对象是编译阶段的主要执行者，主要会依次下述流程：执行模块创建、依赖收集、分块、打包等主要任务的对象

**make 编译模块**

当完成了上述的 compilation对象后，就开始从 Entry入口文件开始读取，主要执行\_addModuleChain()函数，如下：

```js
_addModuleChain(context, dependency, onModule, callback) {

//根据依赖查找对应的工厂函数
const Dep = /** @type {DepConstructor} */ (dependency.constructor);
const moduleFactory = this.dependencyFactories.get(Dep);

//调用工厂函数NormalModuleFactory的create来生成一个空的NormalModule对象
moduleFactory.create({
dependencies: [dependency]

}, (err, module) => {

const afterBuild = () => {
this.processModuleDependencies(module, err => {
if (err) return callback(err);
callback(null, module);
});
};

this.buildModule(module, false, null, null, err => {

afterBuild();
})

}
```

过程如下：

\_addModuleChain 中接收参数dependency传入的入口依赖，使用对应的工厂函数NormalModuleFactory.create 方法生成一个空的module 对象

回调中会把此module存入 compilation.modules 对象和 dependencies.module 对象中，由于是入口文件，也会存入 compilation.entries 中

随后执行buildModule进入真正的构建模块module内容的过程

**build module 完成模块编译**

这里主要调用配置的loaders，将我们的模块转成标准的JS模块

在用Loader 对一个模块转换完后，使用 acorn 解析转换后的内容，输出对应的抽象语法树（AST），以方便Webpack后面对代码的分析

从配置的入口模块开始，分析其AST，当遇到require等导入其它模块语句时，便将其加入到依赖的模块列表，同时对新找出的依赖模块递归分析，最终搞清所有模块的依赖关系

### 资源生成与输出

**seal 输出资源**

seal方法主要是要生成chunks，对chunks 进行一系列的优化操作，并生成要输出的代码webpack 中的 chunk，可以理解为配置在 entry 中的模块，或者是动态引入的模块根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk，再把每个Chunk 转换成一个单独的文件加入到输出列表

**emit 输出完成**

在确定好输出内容后，根据配置确定输出的路径和文件名

```js
output: {
path:path.resolve(\_\_dirname, 'build'),
filename: '[name].js'
```

在Compiler 开始生成文件前，钩子 emit 会被执行，这是我们修改最终文件的最后一个机会
从而webpack整个打包过程则结束了

## 4. 说说Webpack proxy工作原理？为什么能解决跨域?

### 代理的作用与配置

webpack proxy，即 webpack提供的代理服务

基本行为就是接收客户端发送的请求后转发给其他服务器

其目的是为了便于开发者在开发模式下解决跨域问题(浏览器安全策略限制)

想要实现代理首先需要一个中间服务器，webpack 中提供服务器的工具为webpack-dev-server

**webpack-dev-server**

webpack-dev-server是webpack官方推出的一款开发工具，将自动编译和自动刷新浏览器等一系列对开发友好的功能全部集成在了一起

目的是为了提高开发者日常的开发效率，只适用在开发阶段

关于配置方面，在 webpack配置对象属性中通过devServer属性提供，如下：

```js
//./webpack.config.js
const path = require('path')

module.exports = {
//..
devServer: {
contentBase: path.join(__dirname, 'dist'),
compress: true,
port: 9000,
proxy: {
'/api': {
target: 'https://api.github.com'
}
}
//..
}

```

devServetr里面proxy则是关于代理的配置，该属性为对象的形式，对象中每一个属性就是一个代理的规则匹配

属性的名称是需要被代理的请求路径前缀，一般为了辨别都会设置前缀为/api，值为对应的代理匹配规则，对应如下：

target：表示的是代理到的目标地址

pathRewrite:默认情况下，我们的/api-hy也会被写入到URL中，如果希望删除，可以使用

secure:默认情况下不接收转发到https的服务器上，如果希望支持，可以设置为false

changeOrigin:它表示是否更新代理后请求的 headers 中host地址

### 请求转发原理

proxy 工作原理实质上是利用 http-proxy-middleware 这个 http 代理中间件，实现请求转发给其他服务器

举个例子：

在开发阶段，本地地址为 http://localhost:3000，该浏览器发送一个前缀带有/api标识的请求到服务端获取数据，但响应这个请求的服务器只是将请求转发到另一台服务器中

```js
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

app.use('/api', proxy({target: 'http://www.example.org', changeOrigin: true
}));
app.listen(3000);

// http://localhost:3000/api/foo/bar -> http://www.example.org/api/foo/bar
```

### 解决跨域的原因

在开发阶段， webpack-dev-server 会启动一个本地开发服务器，所以我们的应用在开发阶段是独立运行在localhost的一个端口上，而后端服务又是运行在另外一个地址上

所以在开发阶段中，由于浏览器同源策略的原因，当本地访问后端就会出现跨域请求的问题

通过设置webpack proxy实现代理请求后，相当于浏览器与服务端中添加一个代理者

当本地发送请求的时候，代理服务器响应该请求，并将请求转发到目标服务器，目标服务器响应数据后再将数据返回给代理服务器，最终再由代理服务器将数据响应给本地

在代理服务器传递数据给本地浏览器的过程中，两者同源，并不存在跨域行为，这时候浏览器就能正常接收数据

注意：服务器与服务器之间请求数据并不会存在跨域行为，跨域行为是浏览器安全策略限制

## 5. 说说Webpack中常见的Loader？解决了什么问题?

### Loader 的作用与配置

loader 用于对模块的"源代码"进行转换，在import或"加载"模块时预处理文件

webpack做的事情，仅仅是分析出各种模块的依赖关系，然后形成资源列表，最终打包生成到指定的文件中。

在webpack内部中，任何文件都是模块，不仅仅只是js文件

默认情况下，在遇到import 或者require 加载模块的时候，webpack 只支持对 js 和json文件打包

像 css、sass、png等这些类型的文件的时候，webpack则无能为力，这时候就需要配置对应的loader进行文件内容的解析

在加载模块的时候，执行顺序如下：

当webpack 碰到不识别的模块的时候，webpack 会在配置的中查找该文件解析规则

关于配置loader的方式有三种：

配置方式（推荐）：在webpack.config.js文件中指定 loader

内联方式：在每个 import 语句中显式指定loader

- CLI 方式：在shell 命令中指定它们

**配置方式**

关于loader的配置，我们是写在module.rules属性中，属性介绍如下：

rules是一个数组的形式，因此我们可以配置很多个loader

- 每一个 loader对应一个对象的形式，对象属性 test 为匹配的规则，一般情况为正则表达式

属性use针对匹配到文件类型，调用对应的 loader 进行处理

代码编写，如下形式：

```js
module.exports = {
、 module: {
rules:[
{
test: /\.css$/,
use:[
{ loader: 'style-loader'},
{
loader: 'css-loader',
options: {
modules: true
}
},
{ loader: 'sass-loader'}
]
}
}
};
```

### 链式执行与运行特性

这里继续拿上述代码，来讲讲loader的特性

从上述代码可以看到，在处理 css 模块的时候，use 属性中配置了三个 loader 分别处理 css 文件

因为loader支持链式调用，链中的每个loader会处理之前已处理过的资源，最终变为 js代码。顺序为相反的顺序执行，即上述执行方式为 sass-loader、css-loader、style-loader除此之外，loader的特性还有如下：

- loader可以是同步的，也可以是异步的

loader 运行在 Node.js 中，并且能够执行任何操作

除了常见的通过 package.json 的 main 来将一个 npm 模块导出为loader，还可以在module.rules 中使用 loader 字段直接引用一个模块

插件(plugin)可以为loader 带来更多特性

loader能够产生额外的任意文件

可以通过loader的预处理函数，为JavaScript生态系统提供更多能力。用户现在可以更加灵活地引入细粒度逻辑，例如：压缩、打包、语言翻译和更多其他特性

### 常见 Loader 与职责

在页面开发过程中，我们经常性加载除了js文件以外的内容，这时候我们就需要配置响应的loader 进行加载

常见的 loader 如下：

- style-loader:将css添加到DOM的内联样式标签style里

css-loader:允许将css文件通过require的方式引入，并返回css代码

- less-loader: 处理less

- sass-loader: 处理sass

- postcss-loader: 用postcss来处理CSS

autoprefixer-loader:处理CSS3属性前缀，已被弃用，建议直接使用postcss

file-loader: 分发文件到output目录并返回相对路径

- url-loader:和file-loader类似，但是当文件小于设定的limit时可以返回一个DataUrl

- html-minify-loader: 压缩HTML

babel-loader:用babel来转换ES6文件到ES

下面给出一些常见的loader的使用：

**css-loader**

分析 css 模块之间的关系，并合成一个 css

```bash
npm install --save-dev css-loader
```

```js
rules: [
{
test: /\.css\$/,
use: {
loader: "css-loader",
options: {
// 启用/禁用 url(）处理
url: true,
// 启用/禁用 @import 处理
import: true,
// 启用/禁用 Sourcemap
sourceMap: false
}
}
}
]
```

如果只通过css-loader加载文件，这时候页面代码设置的样式并没有生效

原因在于， css-loader 只是负责将css 文件进行一个解析，而并不会将解析后的 css插入到页面中

如果我们希望再完成插入 style的操作，那么我们还需要另外一个 loader，就是 style-loader

**style-loader**

把 css-loader 生成的内容，用 style 标签挂载到页面的 head 中

```bash
npm install --save-dev style-loader
```

```js
rules: [
{
test: /\.css\$/,
use: ["style-loader", "css-loader"]
}
```

同一个任务的loader可以同时挂载多个，处理顺序为：从右到左，从下往上

**less-loader**

开发中，我们也常常会使用 less、sass、stylus预处理器编写css 样式，使开发效率提高，这里需要使用 less-loader

```bash
npm install less-loader -D
```

```js
rules: [
{
test: /\.css\$/,
use: ["style-loader", "css-loader","less-loader"]
}
```

**raw-loader**

在 webpack 中通过 import 方式导入文件内容，该 loader 并不是内置的，所以首先要安装

```bash
npm install --save-dev raw-loader
```

然后在 webpack.config.js 中进行配置

```js
module.exports = {
.
module: {
rules: [
{
test: /\.(txt|md)$/,
use: 'raw-loader'
}
}
}
```

**file-loader**

把识别出的资源模块，移动到指定的输出目目录，并且返回这个资源在输出目录的地址(字符串)

```bash
npm install --save-dev file-loader
```

```js
rules: [
{
test: /\.(png|jpe?g|gif)$/,
use: {
loader: "file-loader",
options: {
// placeholder 占位符：[name] 是源资源模块的名称，[ext] 是源资源模块的后缀
name: "[name]_[hash].[ext]",
//打包后的存放位置
outputPath: "./images",
//打包后文件的url
publicPath: './images',
}
}
}
```

**url-loader**

可以处理理 file-loader 所有的事情，但是遇到图片格式的模块，可以选择性的把图片转成 base64格式的字符串，并打包到 js中，对小体积的图片比较合适，大图片不合适。

```bash
npm install --save-dev url-loader
```

```js
rules:[

{
test: /\.(png|jpe?g|gif)$/,
use: {
loader: "url-loader",
options: {
// placeholder 占位符[name]源资源模块的名称
// [ext]源资源模块的后缀
name: "[name]_[hash].[ext]",
//打包后的存放位置
outputPath: "./images"
// 打包后文件的 url
publicPath: './images',
// 小于 100字节转成 base64 格式
limit: 100
}
}
}
```

## 6. 说说Webpack中常见的Plugin？解决了什么问题?

### Plugin 的作用与配置

Plugin (Plug-in)是一种计算机应用程序，它和主应用程序互相交互，以提供特定的功能是一种遵循一定规范的应用程序接口编写出来的程序，只能运行在程序规定的系统下，因为其需要调用原纯净系统提供的函数库或者数据

webpack中的 plugin也是如此，plugin赋予其各种灵活的功能，例如打包优化、资源管理、环境变量注入等，它们会运行在 webpack 的不同阶段(钩子/生命周期)，贯穿了webpack整个编译周期

目的在于解决loader 无法实现的其他事

**配置方式**

这里讲述文件的配置方式，一般情况，通过配置文件导出对象中plugins属性传入new实例对象。如下所示：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 访问内置的插件
module.exports = {

plugins:[
new webpack.ProgressPlugin(),
new HtmlWebpackPlugin({ template: './src/index.html' }),
]
};
```

### 生命周期与工作机制

其本质是一个具有 apply方法javascript对象

apply 方法会被 webpack compiler 调用，并且在整个编译生命周期都可以访问 compiler 对象

```js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
apply(compiler) {
compiler.hooks.run.tap(pluginName, (compilation) => {
console.log('webpack 构建过程开始！');
});
}
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

compiler hook 的 tap 方法的第一个参数，应是驼峰式命名的插件名称

关于整个编译生命周期钩子，有如下：

entry-option：初始化 option

- run

- compile:真正开始的编译，在创建compilation 对象之前

- compilation:生成好了compilation 对象

make 从 entry 开始递归分析依赖，准备对每个模块进行 build

- after-compile:编译 build 过程结束

- emit：在将内存中 assets 内容写到磁盘文件夹之前

after-emit：在将内存中 assets 内容写到磁盘文件夹之后

- done:完成所有的编译过程

- failed:编译失败的时候

### 常见 Plugin 与职责

常见的plugin有如下这些：

- AggressiveSplittingPlugin | 将原来的 chunk 分成更小的 chunk
- BabelMinifyWebpackPlugin | 使用babel-minify进行压缩
- BannerPlugin | 在每个生成的chunk顶部添加banner
- CommonsChunkPlugin | 提取 chunks 之间共享的通用模块
- CompressionWebpackPlugin | 预先准备的资源压缩版本，使用Content-Encoding提供访问服务
- ContextReplacementPlugin | 重写require 表达式的推断上下文
- CopyWebpackPlugin | 将单个文件或整个目录复制到构建目录
- DefinePlugin | 允许在编译时(compiletime)配置的全局常量
- DllPlugin | 为了极大减少构建时间，进行分离打包
- EnvironmentPlugin | DefinePlugin 中 process.env 键的简写方式。
- ExtractTextWebpackPlugin | 从bundle中提取文本(CSS)到单独的文件
- HotModuleReplacementPlugin | 启用模块热替换(Enable Hot Module Replacement -HMR)
- HtmlWebpackPlugin | 简单创建HTML文件，用于服务器访问
- I18nWebpackPlugin | 为bundle 增加国际化支持
- IgnorePlugin | 从 bundle 中排除某些模块
- LimitChunkCountPlugin | 设置chunk的最小/最大限制，以微调和控制chunk
- LoaderOptionsPlugin | 用于从 webpack 1 迁移到 webpack 2
- MinChunkSizePlugin | 确保 chunk 大小超过指定限制
- NoEmitOnErrorsPlugin | 在输出阶段时，遇到编译错误跳过
- NormalModuleReplacementPlugin | 替换与正则表达式匹配的资源

下面介绍几个常用的插件用法：

**HtmlWebpackPlugin**

在打包结束后，自动生成一个 html 文文件，并把打包生成的 js 模块引入到该 html 中

```bash
npm install --save-dev html-webpack-plugin
```

```js
// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {

plugins: [
new HtmlWebpackPlugin({
title: "My App",
filename: "app.html",
template:"./src/html/index.html"
})
]
};
```

```html
<!--./src/html/index.html-->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title><%=htmlWebpackPlugin.options.title%></title>
</head>
<body>
<h1>html-webpack-plugin</h1>
</body>
</html>
```

在 html模板中，可以通过 <%=htmlWebpackPlugin.options.XXX%> 的方式获取配置的值

更多的配置可以自寻查找

**clean-webpack-plugin**

删除（清理）构建目录

```bash
npm install --save-dev clean-webpack-plugin
```

```js
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
module.exports = {

plugins: [

new CleanWebpackPlugin(),

}
```

**mini-css-extract-plugin**

提取CSS 到一个单独的文件中

```bash
npm install --save-dev mini-css-extract-plugin
```

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {

module: {
rules:[
{
test: /\.s[ac]ss$/,
use:[
{
loader: MiniCssExtractPlugin.loader
},
'css-loader',
'sass-loader'
}
},
plugins: [

new MiniCssExtractPlugin({
filename: '[name].css'
}),

```

**DefinePlugin**

允许在编译时创建配置的全局对象，是一个webpack内置的插件，不需要安装

```js
const { DefinePlugun } = require('webpack')

module.exports = {

plugins:[
new DefinePlugin({
BASE_URL:'"./"
})
}
```

这时候编译template模块的时候，就能通过下述形式获取全局对象

```html
<link rel="icon" href="<%= BASE_URL%>favicon.ico>"
```

**copy-webpack-plugin**

复制文件或目录到执行区域，如vue的打包过程中，如果我们将一些文件放到public的目录下，那么这个目录会被复制到dist文件夹中

```bash
npm install copy-webpack-plugin -D
```

```js
new CopyWebpackPlugin({
patterns:[
from:"public",
globOptions:{
ignore:[
'\*\*/index.html'
}
}
})
```

复制的规则在patterns属性中设置：

from：设置从哪一个源中开始复制

- to：复制到的位置，可以省略，会默认复制到打包的目录下

globOptions：设置一些额外的选项，其中可以编写需要忽略的文件

## 7. Loader 和 Plugin 有什么区别？编写 Loader、Plugin 的思路是什么？

### Loader 与 Plugin 的核心区别

前面两节我们有提到Loader与Plugin对应的概念，先来回顾下

- loader是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中

plugin赋予了webpack各种灵活的功能，例如打包优化、资源管理、环境变量注入等，目的是解决loader无法实现的其他事

从整个运行时机上来看：

可以看到，两者在运行时机上的区别：

loader 运行在打包文件之前

- plugins 在整个编译周期都起作用

在Webpack 运行的生命周期中会广播出许多事件，Plugin可以监听这些事件，在合适的时机通过Webpack 提供的 API 改变输出结果

对于loader，实质是一个转换器，将A文件进行编译形成B文件，操作的是文件，比如

将A.scss 或A.less 转变为B.css，单纯的文件转换过程

### Loader 的编写方式

在编写 loader 前，我们首先需要了解loader 的本质

其本质为函数，函数中的 this 作为上下文会被 webpack 填充，因此我们不能将 loader设为一个箭头函数

函数接受一个参数，为 webpack传递给loader 的文件源内容

函数中 this 是由webpack 提供的对象，能够获取当前loader 所需要的各种信息

函数中有异步操作或同步操作，异步操作通过 this.callback 返回，返回值要求为 string 或者Buffer

代码如下所示：

```js
//导出一个函数，source为webpack传递给loader的文件源内容
module.exports = function(source) {
const content = doSomeThing2JsString(source);

// 如果 loader 配置了 options 对象，那么this.query将指向 options
const options = this.query;

//可以用作解析其他模块路径的上下文
console.log('this.context');

/*
* this.callback 参数:
* error:Error | null,当 loader 出错时向外抛出—个 error
* content:String | Buffer，经过 loader 编译后需要导出的内容
* sourceMap:为方便调试生成的编译后内容的 source map
* ast:本次编译生成的AST静态语法树，之后执行的 loader 可以直接使用这个AST,
进而省去重复生成AST 的过程
*/
this.callback(null, content); // 异步
return content; // 同步
}
```

一般在编写loader的过程中，保持功能单一，避免做多种功能

如 less 文件转换成 CSs文件也不是一步到位，而是 less-loader、 css-loader、 style
-loader 几个 loader的链式调用才能完成转换

### Plugin 的编写方式

由于webpack基于发布订阅模式，在运行的生命周期中会广播出许多事件，插件通过监听这些事件，就可以在特定的阶段执行自己的插件任务

在之前也了解过，webpack编译会创建两个核心对象：

compiler：包含了webpack 环境的所有的配置信息，包括 options，loader 和 plugin，和webpack 整个生命周期相关的钩子

compilation:作为plugin内置事件回调函数的参数，包含了当前的模块资源、编译生成资源、变化的文件以及被跟踪依赖的状态信息。当检测到一个文件变化，一次新的Compilation将被创建如果自己要实现plugin，也需要遵循一定的规范：

- 插件必须是一个函数或者是一个包含 apply 方法的对象，这样才能访问 compiler实例

- 传给每个插件的 compiler 和 compilation 对象都是同一个引用，因此不建议修改

异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住实现plugin的模板如下：

```js
class MyPlugin {
// Webpack 会调用 MyPlugin 实例的 apply 方法给插件实例传入 compiler 对象
apply (compiler) {
//找到合适的事件钩子，实现自己的插件功能
compiler.hooks.emit.tap('MyPlugin', compilation => {
// compilation：当前打包构建流程的上下文
console.log(compilation);
// do something...
})
}
}
```

在emit事件发生时，代表源文件的转换和组装已经完成，可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容

## 8. 如何提高Webpack的构建速度?

### 优化目标与整体思路

随着我们的项目涉及到页面越来越多，功能和业务代码也会随着越多，相应的webpack的构建时间也会越来越久

构建时间与我们日常开发效率密切相关，当我们本地开发启动 devServer 或者 build 的时候，如果时间过长，会大大降低我们的工作效率

所以，优化webpack构建速度是十分重要的环节

常见的提升构建速度的手段有如下：

优化 loader 配置

合理使用 resolve.extensions

优化 resolve.modules

优化 resolve.alias

- 使用 DLLPlugin 插件

使用 cache-loader

terser 启动多线程

- 合理使用 sourceMap

### 缩小解析与编译范围

在使用loader时，可以通过配置include、exclude、test属性来匹配文件，接触include、exclude规定哪些匹配应用loader

如采用ES6的项目为例，在配置babel-loader时，可以这样：

```js
module.exports = {
module: {
rules:[
{
// 如果项目源码中只有js 文件就不要写成八.jsx?$/，提升正则表达式性能
test: /\.js$/,
// babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
use: ['babel-loader?cacheDirectory'],
// 只对项目根目录下的src 目录中的文件采用babel-loader
include: path.resolve(__dirname, 'src'),
},
},
};
```

**合理使用 resolve.extensions**

在开发中我们会有各种各样的模块依赖，这些模块可能来自于自己编写的代码，也可能来自第三方库，resolve可以帮助webpack从每个require/import语句中，找到需要引入到合适的模块代码通过resolve.extensions 是解析到文件时自动添加拓展名，默认情况如下：

```js
module.exports = {

extensions:[".warm",".mjs",".js",".json"]
}
```

当我们引入文件的时候，若没有文件后缀名，则会根据数组内的值依次查找

当我们配置的时候，则不要随便把所有后缀都写在里面，这会调用多次文件的查找，这样就会减慢打包速度

**优化 resolve.modules**

resolve.modules 用于配置 webpack 去哪些目录下寻找第三方模块。默认值为['node\_modules']，所以默认会从 node\_modules 中查找文件
当安装的第三方模块都放在项目根目录下的./node\_modules目录下时，所以可以指明存放第三方模块的绝对路径，以减少寻找，配置如下：

```js
module.exports = {
resolve: {
//使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
//其中__dirname表示当前工作目录，也就是项目根目录
modules: [path.resolve(__dirname, 'node_modules')]
},
}
```

**优化 resolve.alias**

alias给一些常用的路径起一个别名，特别当我们的项目目录结构比较深的时候，一个文件的路径可能是 ./../../的形式

通过配置 alias以减少查找过程

```js
module.exports = {

resolve:{
alias:{
"@":path.resolve(__dirname,'./src')
}
}
}
```

### 复用缓存与并行构建

DLL全称是动态链接库，是软件在 Windows 中实现共享函数库的一种方式，而Webpack也内置了DLL的功能，为的就是可以共享，不经常改变的代码，抽成一个共享的库。这个库在之后的编译过程中，会被引入到其他项目的代码中

使用步骤分成两部分：

- 打包一个 DLL 库

·引入 DLL库

**打包一个 DLL 库**

webpack内置了一个DllPlugin可以帮助我们打包一个DLL的库文件

```js
module.exports = {

plugins:[
new webpack.DllPlugin({
name:'dll_[name]',
path:path.resolve(__dirname,"./dll/[name].manifest.json")
})
}
```

**引入 DLL库**

使用 webpack 自带的 DllReferencePlugin 插件对 manifest.json 映射文件进行分析，获取要使用的 DLL库

然后再通过AddAssetHtmlPlugin插件，将我们打包的DLL库引入到Html模块中

```js
module.exports = {

new webpack.DllReferencePlugin({
context:path.resolve(__dirname,"./dll/dll_react.js"),
manifest:path.resolve(__dirname,"./dll/react.manifest.json")
}),
new AddAssetHtmlPlugin({
outputPath:"./auto",
filepath:path.resolve(__dirname,"./dll/dll_react.js")
})
}
```

**使用 cache-loader**

在一些性能开销较大的 loader 之前添加 cache-loader，以将结果缓存到磁盘里，显著提升二次构建速度

保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 loader 使用此 loader

```js
module.exports = {
module: {
rules: [
{
test: /\.ext$/,
use: ['cache-loader', ...loaders],
include: path.resolve('src'),
},
],
},
};
```

**terser 启动多线程**

使用多进程并行运行来提高构建速度

```js
module.exports = {
optimization: {
minimizer:[
new TerserPlugin({
parallel: true,
}),
],
},
}
```

### Source Map 取舍与总结

打包生成sourceMap的时候，如果信息越详细，打包速度就会越慢。对应属性取值如下所示：

- devtool | 构建速度 | 重新构建速度 | 生产环境 | 品质(quality)
- (none) | +++ | +++ | yes | 打包后的代码
- eval | +++ | +++ | no | 生成后的代码
- cheap-eval-source-map | + | ++ | no | 转换过的代码（仅限行)
- cheap-module-eval-source-map | o | ++ | no | 原始源代码（仅限行)
- eval-source-map | -- | + | no | 原始源代码
- cheap-source-map | + | o | yes | 转换过的代码（仅限行)
- cheap-module-source-map | o | - | yes | 原始源代码（仅限行)
- inline-cheap-source-map | + | 0 | no | 转换过的代码（仅限行)
- inline-cheap-module-source-map | 0 | - | no | 原始源代码（仅限行)
- source-map | -- | -- | yes | 原始源代码
- inline-source-map | -- | -- | no | 原始源代码
- hidden-source-map | -- | -- | yes | 原始源代码
- nosources-source-map | -- | -- | yes | 无源代码内容

+++ 非常快速 ++ 快速 + 比较快 。 中等 - 比较慢 -- 慢

可以看到，优化webpack构建的方式有很多，主要可以从优化搜索时间、缩小文件搜索范围、减少不必要的编译等方面入手

## 9. 说说如何借助Webpack来优化前端性能?

### 优化目标与总体策略

随着前端的项目逐渐扩大，必然会带来的一个问题就是性能

尤其在大型复杂的项目中，前端业务可能因为一个小小的数据依赖，导致整个页面卡顿甚至奔溃一般项目在完成后，会通过webpack 进行打包，利用webpack 对前端项目性能优化是一个十分重要的环节

通过webpack优化前端的手段有：

- JS代码压缩

- CSS代码压缩

- Html文件代码压缩

- 文件大小压缩

- 图片压缩

- Tree Shaking

- 代码分离

- 内联 chunk

### 资源压缩

terser 是一个 JavaScript的解释、绞肉机、压缩机的工具集，可以帮助我们压缩、丑化我们的代码，让bundle更小

在production模式下，webpack默认就是使用 TerserPlugin 来处理我们的代码的。如果想要自定义配置它，配置方法如下：

```js
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {

optimization: {
minimize: true,
minimizer: [
new TerserPlugin({
parallel: true // 电脑cpu核数-1
})
]
}
}
```

**属性介绍如下**

extractComments:默认值为true，表示会将注释抽取到一个单独的文件中，开发阶段，我们可设置为 false，不保留注释

- parallel:使用多进程并发运行提高构建的速度，默认值是true，并发运行的默认数量：

os.cpus().length – 1

terserOptions：设置我们的terser相关的配置：

compress:设置压缩相关的选项，mangle:设置丑化相关的选项，可以直接设置为true

mangle:设置丑化相关的选项，可以直接设置为true

- toplevel:底层变量是否进行转换

keep\_classnames:保留类的名称

- keep\_fnames：保留函数的名称

**CSS代码压缩**

CSS压缩通常是去除无用的空格等，因为很难去修改选择器、属性的名称、值等

CSS的压缩我们可以使用另外一个插件： css-minimizer-webpack-plugin

```bash
npm install css-minimizer-webpack-plugin -D
```

配置方法如下：

```js
const CssMinimizerPlugin =require('css-minimizer-webpack-plugin')
module.exports = {
// ..
optimization: {
minimize: true,
minimizer: [
new CssMinimizerPlugin({
parallel: true
})
]
}
}
```

**Html文件代码压缩**

使用HtmlWebpackPlugin插件来生成HTML的模板时候，通过配置属性minify进行html优化

```js
module.exports = {

plugin:[
new HtmlWebpackPlugin({

minify:{
minifyCSS:false，// 是否压缩css
collapseWhitespace:false，//是否折叠空格
removeComments:true // 是否移除注释

```

设置了 minify，实际会使用另一个插件html-minifier-terser

**文件大小压缩**

对文件的大小进行压缩，减少http传输过程中宽带的损耗

```js
new ComepressionPlugin({
test:/\.(css|js)$/，// 哪些文件需要压缩
threshold:500，//设置文件多大开始压缩
minRatio:0.7，//至少压缩的比例
algorithm:"gzip"，// 采用的压缩算法
})
```

**图片压缩**

一般来说在打包之后，一些图片文件的大小是远远要比 js 或者 css 文件要来的大，所以图片压缩较为重要

配置方法如下：

```js
module: {
rules: [
{
test: /\.(png|jpg|gif)\$/,
use:[
{
loader: 'file-loader',
options: {
name: '[name]\_[hash].[ext]',
outputPath: 'images/',
}
},
{
loader:'image-webpack-loader',
options: {
// 压缩 jpeg 的配置
mozjpeg: {
progressive: true,
quality: 65
},
// 使用 imagemin\*\*-optipng 压缩 png，enable: false 为关闭
optipng: {
enabled: false,
},
// 使用 imagemin-pngquant 压缩 png
pngquant: {
quality: '65-90',
speed:4
},
// 压缩 gif 的配置
gifsicle: {
interlaced: false,
},
// 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
webp: {
quality: 75
}
}
}
},
]
}
```

### Tree Shaking 与无用代码消除

Tree Shaking 是一个术语，在计算机中表示消除死代码，依赖于 ES Module的静态语法分析(不执行任何的代码，可以明确知道模块的依赖关系)

在webpack实现Trss shaking有两种不同的方案：

usedExports：通过标记某些函数是否被使用，之后通过Terser来进行优化的

- sideEffects:跳过整个模块/文件，直接查看该文件是否有副作用

两种不同的配置方案，有不同的效果

**usedExports**

配置方法也很简单，只需要将usedExports设为 true

```js
module.exports ={

optimization:{
usedExports
}
}
```

使用之后，没被用上的代码在webpack打包中会加入 unused harmony export mul注释，用来告知Terser在优化时，可以删除掉这段代码

如下面 sum 函数没被用到， webpack打包会添加注释，terser在优化时，则将该函数去掉

```js
/*·unused·harmony·export·mul·*/
function sum(num1, num2) {
return num1 + num2;
```

**sideEffects**

sideEffects 用于告知webpack compiler 哪些模块时有副作用，配置方法是在 package.json 中设置 sideEffects 属性

如果 sideEffects 设置为false，就是告知 webpack 可以安全的删除未用到的 exports如果有些文件需要保留，可以设置为数组的形式

```js
"sideEffecis":[
"./src/util/format.js",
"*.css"// 所有的css文件
]
```

上述都是关于javascript的 tree shaking，css 同样也能够实现 tree shaking

**css tree shaking**

css 进行tree shaking 优化可以安装 PurgeCss 插件

```bash
npm install purgecss-plugin-webpack -D
```

```js
const PurgeCssPlugin = require('purgecss-webpack-plugin')
module.exports = {

plugins:[
new PurgeCssPlugin({
path:glob.sync(`${path.resolve('./src')}/**/*`), {nodir:true}
// src里面的所有文件
satelist:function(){
return {
standard:["html"]
}
}
})
}
```

- paths:表示要检测哪些目录下的内容需要被分析，配合使用glob

- 默认情况下，Purgecss会将我们的html标签的样式移除掉，如果我们希望保留，可以添加一个safelist的属性

### 代码分离与请求优化

将代码分离到不同的bundle中，之后我们可以按需加载，或者并行加载这些文件

默认情况下，所有的JavaScript代码(业务代码、第三方依赖、暂时没有用到的模块)在首页全部都加载，就会影响首页的加载速度

代码分离可以分出出更小的bundle，以及控制资源加载优先级，提供代码的加载性能

这里通过 splitChunksPlugin来实现，该插件webpack已经默认安装和集成，只需要配置即可默认配置中，chunks仅仅针对于异步(async)请求，我们可以设置为initial或者all

```js
module.exports = {

optimization:{
splitChunks:{
chunks:"all"
}
}
}
```

splitChunks 主要属性有如下：

Chunks，对同步代码还是异步代码进行处理

- minSize:拆分包的大小，至少为minSize，如何包的大小不超过minSize，这个包不会拆分

maxSize:将大于maxSize的包，拆分为不小于minSize的包

minChunks:被引入的次数，默认是1

**内联chunk**

可以通过 InlineChunkHtmlPlugin插件将一些chunk 的模块内联到 html，如 runtime 的代码(对模块进行解析、加载、模块信息相关的代码)，代码量并不大，但是必须加载的

```js
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugi
n')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {

plugin:[
new InlineChunkHtmlPlugin(HtmlWebpackPlugin,[/runtime.+\.js/]
}
```

关于webpack对前端性能的优化，可以通过文件体积大小入手，其次还可通过分包的形式、减少http请求次数等方式，实现对前端性能的优化

## 10. 与Webpack类似的工具还有哪些？区别?

### 工具定位与选型维度

模块化是一种处理复杂系统分解为更好的可管理模块的方式

可以用来分割，组织和打包应用。每个模块完成一个特定的子功能，所有的模块按某种方法组装起来，成为一个整体(bundle)

在前端领域中，并非只有webpack这一款优秀的模块打包工具，还有其他类似的工具，例

如 Rollup、Parcel、snowpack，以及最近风头无两的Vite

通过这些模块打包工具，能够提高我们的开发效率，减少开发成本

这里没有提及gulp、grunt是因为它们只是定义为构建工具，不能类比

### Rollup 与 Parcel

Rollup 是一款 ES Modules 打包器，从作用上来看，Rollup 与 Webpack 非常类似。不过相比于 Webpack Rollup要小巧的多

现在很多我们熟知的库都都使用它进行打包，比如：Vue、React 和 three.js等

举个例子：

```ts
//./src/messages.js
export default {
hi: 'Hey Guys, I am zce~'
}

//./src/logger.js
export const log = msg => {
console.log('- INFO- ---')
console.log(msg)
console.log(' -')
}

export const error = msg => {
console.error(' ERROR --')
console.error(msg)
console.error(' --')
}

// ./src/index.js
import { log } from './logger'
import messages from './messages'
log(messages.hi)
```

然后通过 rollup进行打包

```bash
$ npx rollup ./src/index.js --file ./dist/bundle.js
```

打包结果如下：

```js
JS bundle.js X
√ const log = msg ⇒ {
console.log('----- INFO );
console.log(msg);
console.log('--
};

var messages = {
hi: 'Hey Guys, I am zce~'
};

//导入模块成员

//使用模块成员
log(messages.hi);
```

可以看到，代码非常简洁，完成不像webpack那样存在大量引导代码和模块函数

并且error方法由于没有被使用，输出的结果中并无error方法，可以看到，rollup默认开始Tree-shaking 优化输出结果

因此，可以看到Rollup的优点：

- 代码效率更简洁、效率更高

默认支持 Tree-shaking

但缺点也十分明显，加载其他类型的资源文件或者支持导入 CommonJS 模块，又或是编译 ES 新特性，这些额外的需求 Rollup需要使用插件去完成

综合来看， rollup并不适合开发应用使用，因为需要使用第三方模块，而目前第三方模块大多数使用CommonJs 方式导出成员，并且rollup不支持HMR，使开发效率降低

但是在用于打包 JavaScript 库时，rollup 比 webpack 更有优势，因为其打包出来的代码更小、更快，其存在的缺点可以忽略

**Parcel**

Parcel，是一款完全零配置的前端打包器，它提供了“傻瓜式”的使用体验，只需了解简单的命令，就能构建前端应用程序

```text
npx parcelsrc/index.html
```

Parcel 跟 Webpack 一样都支持以任意类型文件作为打包入口，但建议使用 HTML 文件作为入口，该HTML文件像平时一样正常编写代码、引用资源。如下所示：

```html
<!-- ./src/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Parcel Tutorials</title>
</head>
<body>
<script src="main.js"></script>
</body>
</html>
```

main.js文件通过ESMoudle方法导入其他模块成员

```ts
// ./src/main.js
import { log } from './logger'
log('hello parcel')
// ./src/logger.js
export const log = msg => {
console.log(' INF0 -')
console.log(msg)
}
```

运行之后，使用命令打包

执行命令后，Parcel 不仅打包了应用，同时也启动了一个开发服务器，跟 webpack DevServer 样

跟webpack类似，也支持模块热替换，但用法更简单

同时，Parcel有个十分好用的功能：支持自动安装依赖，像webpack开发阶段突然使用安装某个第三方依赖，必然会终止dev server然后安装再启动。而Parcel则免了这繁琐的工作流程同时，Parcel能够零配置加载其他类型的资源文件，无须像webpack 那样配置对应的loader打包命令如下：

1 npx parcel src/index.html

由于打包过程是多进程同时工作，构建速度会比Webpack快，输出文件也会被压缩，并且样式代码也会被单独提取到单个文件中

可以感受到，Parcel给开发者一种很大的自由度，只管去实现业务代码，其他事情用Parcel解决

### Snowpack 与 Vite

Snowpack，是一种闪电般快速的前端构建工具，专为现代Web设计，较复杂的打包工具(如Webpack或Parcel）的替代方案，利用JavaScript的本机模块系统，避免不必要的工作并保持流畅的开发体验

开发阶段，每次保存单个文件时，Webpack和Parcel都需要重新构建和重新打包应用程序的整个bundle。而Snowpack 为你的应用程序每个文件构建一次，就可以永久缓存，文件更改时，Snowpack 会重新构建该单个文件

webpack 与 snowpack 的打包区别在于：

在重新构建每次变更时没有任何的时间浪费，只需要在浏览器中进行HMR更新

**Vite**

vite，是一种新型前端构建工具，能够显著提升前端开发体验

它主要由两部分组成：

- 一个开发服务器，它基于原生ES模块提供了丰富的内建功能，如速度快到惊人的[模块热更新HMR

一套构建指令，它使用Rollup打包你的代码，并且它是预配置的，可以输出用于生产环境的优化过的静态资源

其作用类似webpack+ webpack-dev-server，其特点如下：

快速的冷启动

即时的模块热更新

- 真正的按需编译

vite会直接启动开发服务器，不需要进行打包操作，也就意味着不需要分析模块的依赖、不需要编译，因此启动速度非常快

利用现代浏览器支持ESModule的特性，当浏览器请求某个模块的时候，再根据需要对模块的内容进行编译，这种方式大大缩短了编译时间

原理图如下所示：

在热模块HMR方面，当修改一个模块的时候，仅需让浏览器重新请求该模块即可，无须像webpack那样需要把该模块的相关依赖模块全部编译一次，效率更高

### Webpack 的综合能力

相比上述的模块化工具，webpack大而全，很多常用的功能做到开箱即用。有两大最核心的特点：一切皆模块和按需加载

与其他构建工具相比，有如下优势：

智能解析：对CommonJS、AMD、ES6的语法做了兼容

- 万物模块：对js、css、图片等资源文件都支持打包

- 开箱即用：HRM、Tree-shaking等功能

- 代码分割：可以将代码切割成不同的chunk，实现按需加载，降低了初始化时间

插件系统，具有强大的Plugin接口，具有更好的灵活性和扩展性

- 易于调试：支持 SourceUrls 和 SourceMaps

快速运行：webpack使用异步IO并具有多级缓存，这使得webpack很快且在增量编译上更加快

生态环境好：社区更丰富，出现的问题更容易解决
