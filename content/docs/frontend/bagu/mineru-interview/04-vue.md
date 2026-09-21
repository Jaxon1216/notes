---
title: Vue 2 与 Vue 3
description: Vue 2 与 Vue 3 高频面试问答。
tags:
  - 前端八股
  - Vue
status: published
updatedAt: '2026-09-16'
---

## 1. 请描述下对Vue生命周期的理解

### 生命周期与钩子

生命周期(LifeCycle)的概念应用很广泛，特别是在政治、经济、环境、技术、社会等诸多领域经常出现，其基本涵义可以通俗地理解为“从摇篮到坟墓”(Cradle-to-Grave)的整个过程在Vue中实例从创建到销毁的过程就是生命周期，即指从创建、初始化数据、编译模板、挂载Dom→渲染、更新→渲染、卸载等一系列过程我们可以把组件比喻成工厂里面的一条流水线，每个工人(生命周期)站在各自的岗位，当任务流转到工人身边的时候，工人就开始工作PS：在Vue生命周期钩子会自动绑定 this 上下文到实例中，因此你可以访问数据，对 property 和方法进行运算这意味着你不能使用箭头函数来定义一个生命周期方法(例如created：() => this.fetchTodos())

**生命周期有哪些**

ue生命周期总共可以分为8个阶段：创建前后，载入前后,更新前后,销毁前销毁后，以及一些特殊场景的生命周期

- 生命周期
- beforeCreate | 组件实例被创建之初
- created | 组件实例已经完全创建
- beforeMount | 组件挂载之前
- mounted | 组件挂载到实例上去之后
- beforeUpdate | 组件数据发生变化，更新之前
- updated | 组件数据更新之后
- beforeDestroy | 组件实例销毁之前
- destroyed | 组件实例销毁之后
- activated | keep-alive 缓存的组件激活时
- deactivated | keep-alive缓存的组件停用时调用
- errorCaptured | 捕获一个来自子孙组件的错误时被调用

### 各阶段执行过程

ue 生命周期流程图

\* template compilation is performed ahead-of-time if using a build step, e.g. single-file components

beforeCreate -> created

初始化 vue 实例，进行数据观测

created

完成数据观测，属性与方法的运算，watch、event事件回调的配置

可调用methods 中的方法，访问和修改data数据触发响应式渲染 dom，可通过 computed 和watch完成数据计算

- 此时 vm.\$el 并没有被创建

created -> beforeMount

- 判断是否存在 el 选项，若不存在则停止编译，直到调用 vm.\$mount(el)才会继续编译

- 优先级： render > template > outerHTML

**vm.el获取到的是挂载DOM的**

**beforeMount**

- 在此阶段可获取到 vm.el

此阶段 vm.el 虽已完成DOM初始化，但并未挂载在 el选项上

beforeMount -> mounted

此阶段 vm.el完成挂载，vm.\$el生成的 DOM替换了 el选项所对应的DOM

**mounted**

vm.el已完成DOM的挂载与渲染，此刻打印vm.\$el，发现之前的挂载点及内容已被替换成新的DOM

beforeUpdate

- 更新的数据必须是被渲染在模板上的（el、template、render之一)

- 此时 view 层还未更新

- 若在beforeUpdate中再次修改数据，不会再次触发更新方法

updated

完成 view层的更新

- 若在 updated中再次修改数据，会再次触发更新方法（beforeUpdate、updated）

**beforeDestroy**

- 实例被销毁前调用，此时实例属性与方法仍可访问

**destroyed**

完全销毁一个实例。可清理它与其它实例的连接，解绑它的全部指令及事件监听器

并不能清除DOM，仅仅销毁实例

### 使用场景与请求时机

- 生命周期 | 描述
- beforeCreate | 执行时组件实例还未创建，通常用于插件开发中 执行一些初始化任务
- created | 组件初始化完毕，各种数据可以使用，常用于异 步数据获取
- beforeMount | 未执行渲染、更新，dom未创建

- mounted | 初始化结束，dom已创建，可用于获取访问数据和dom元素
- beforeUpdate | 更新前，可用于获取更新前各种状态
- updated | 更新后，所有状态已是最新
- beforeDestroy | 销毁前，可用于一些定时器或订阅的取消
- destroyed | 组件已销毁，作用同上

**数据请求在created和mouted的区别**

created是在组件实例一旦创建完成的时候立刻调用，这时候页面dom 节点并未生

成；mounted 是在页面 dom 节点渲染完毕之后就立刻执行的。触发时机上 created 是比 mounted要更早的，两者的相同点：都能拿到实例对象的属性和方法。

讨论这个问题本质就是触发的时机，放在mounted中的请求有可能导致页面闪动(因为此时页面dom结构已经生成)，但如果在页面加载前完成请求，则不会出现此情况。建议对页面内容的改动放在created生命周期当中。

## 2. 双向数据绑定是什么

### 双向绑定与 MVVM

我们先从单向绑定切入单向绑定非常简单，就是把Model绑定到View，当我们用JavaScript代码更新Model时，View就会自动更新双向绑定就很容易联想到了，在单向绑定的基础上，用户更新了View，Model的数据也自动被更新了，这种情况就是双向绑定举个栗子

当用户填写表单时，View的状态就被更新了，如果此时可以自动更新Model的状态，那就相当于我们把Model和View做了双向绑定关系图如下

**双向绑定的原理是什么**

我们都知道Vue 是数据双向绑定的框架，双向绑定由三个重要部分构成

- 数据层(Model)：应用的数据及业务逻辑

视图层（View)：应用的展示效果，各类UI组件

业务逻辑层(ViewModel)：框架封装的核心，它负责将数据与视图关联起来

而上面的这个分层的架构方案，可以用一个专业术语进行称呼：MVVM这里的控制层的核心功能便是“数据双向绑定”。自然，我们只需弄懂它是什么，便可以进一步了解数据绑定的原理

**理解ViewModel**

它的主要职责就是：

数据变化后更新视图

视图变化后更新数据

ViewModel 还包含两个主要部分：

监听器(Observer)：对所有数据的属性进行监听

- 解析器(Compiler)：对每个元素节点的指令进行扫描跟解析,根据指令模板替换数据,以及绑定相应的更新函数

### 响应式更新流程

我们还是以Vue为例，先来看看Vue中的双向绑定流程是什么的

1. new Vue() 首先执行初始化，对 data 执行响应化处理，这个过程发生 Observe中

2. 同时对模板执行编译，找到其中动态绑定的数据，从data中获取并初始化视图，这个过程发生在 Compile中

3. 同时定义一个更新函数和 Watcher，将来对应数据变化时Watcher 会调用更新函数

4. 由于 data 的某个 key 在一个视图中可能出现多次，所以每个 key 都需要一个管家 Dep 来管理多个 Watcher

5. 将来data中数据一旦发生变化，会首先找到对应的Dep，通知所有 Watcher执行更新函数流程图如下：

### Observer、Compiler 与 Watcher

先来一个构造函数：执行初始化，对data执行响应化处理

```js
class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;

    //对data选项做响应式处理
    observe(this.$data);

    //代理data到vm上
    proxy(this);

    //执行编译
    new Compile(options.el, this);
  }
}
```

对data选项执行响应化具体操作

```js
function observe(obj) {
  if (typeof obj !== "object" || obj == null) {
    return;
  }
  new Observer(obj);
}

class Observer {
  constructor(value) {
    this.value = value;
    this.walk(value);
  }
  walk(obj) {
    Object.keys(obj).forEach((key) => {
        defineReactive(obj, key, obj[key]);
      });
  }
}
```

**编译 Compile**

对每个元素节点的指令进行扫描跟解析,根据指令模板替换数据,以及绑定相应的更新函数

```js
class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el); //获取dom
    if (this.$el) {
      this.compile(this.$el);
    }
  }
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => { //遍历子元素
        if(this.isElement(node)) {//判断是否为节点
          console.log("编译元素" + node.nodeName);
        } else if (this.isInterpolation(node)) {
          console.log("编译插值文本"+ node.textContent); // 判断是否为插值文本
          {{}}
        }
        if(node.childNodes && node.childNodes.length > 0) { // 判断是否有子
          元素
          this.compile(node);// 对子元素进行递归遍历
        }
      });
  }
  isElement(node) {
    return node.nodeType == 1;
  }
  isInterpolation(node) {
    return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
}
```

**依赖收集**

视图中会用到 data 中某 key，这称为依赖。同一个 key可能出现多次，每次都需要收集出来用一个Watcher来维护它们，此过程称为依赖收集多个Watcher需要一个Dep来管理，需要更新时由 Dep 统一通知

`<p>`{{name1}`</p>` `<p>`{{name2}}`</p>` `<p>`{{name1}}`</p>`

Watcher1
key = name1

收集

Watcher2
key = name2
Watcher3
key = name1

Dep1 [watcher1,watcher3]

Dep2 deps = [watcher2]

### 依赖收集的实现思路

1. defineReactive时为每一个 key 创建一个 Dep实例

2. 初始化视图时读取某个 key，例如 name1，创建一个 watcher1

3. 由于触发name1 的 getter 方法，便将 watcher1添加到 name1 对应的Dep中

4. 当 name1 更新，setter 触发时，便可通过对应 Dep 通知其管理所有Watcher 更新

```js
// 负责更新视图
class Watcher {
constructor(vm, key, updater) {
this.vm = vm
this.key = key
this.updaterFn = updater

//创建实例时，把当前实例指定到Dep.target静态属性上
Dep.target = this
// 读—下key，触发get
vm[key]
//置空
Dep.target = null

//未来执行dom更新函数，由dep调用的
update( ) {
this.updaterFn.call(this.vm, this.vm[this.key])
}
}
```

声明 Dep

```js
class Dep {
  constructor() {
    this.deps = []; // 依赖管理
  }
  addDep(dep) {
    this.deps.push(dep);
  }
  notify() {
    this.deps.forEach((dep) => dep.update());
  }
}
```

创建 watcher 时触发 getter

```js
class Watcher {
  constructor(vm, key, updateFn) {
    Dep.target = this;
    this.vm[this.key];
    Dep.target = null;
  }
}
```

依赖收集，创建Dep实例

```js
function defineReactive(obj, key, val) {
this.observe(val);
const dep = new Dep();
Object.defineProperty(obj, key, {
get() {
Dep.target && dep.addDep(Dep.target);// Dep.target也就是Watcher实例
return val;

set(newVal) {
if (newVal === val) return;
dep·notify(); // 通知dep执行更新方法
},
});
}
```

## 3. Vue组件之间的通信方式都有哪些？

### 通信目标与关系分类

开始之前，我们把组件间通信这个词进行拆分

· 组件

· 通信

都知道组件是vue最强大的功能之一，vue中每一个.vue我们都可以视之为一个组件通信指的是发送者通过某种媒体以某种格式来传递信息到收信者以达到某个目的。广义上，任何信息的交通都是通信组件间通信即指组件(.vue)通过某种方式来传递信息以达到某个目的举个栗子我们在使用UI框架中的table组件，可能会往table组件中传入某些数据，这个本质就形成了组件之间的通信

**组件间通信解决了什么**

在古代，人们通过驿站、飞鸽传书、烽火报警、符号、语言、眼神、触碰等方式进行信息传递，到了今天，随着科技水平的飞速发展，通信基本完全利用有线或无线电完成，相继出现了有线电话、固定电话、无线电话、手机、互联网甚至视频电话等各种通信方式从上面这段话，我们可以看到通信的本质是信息同步，共享回到vue中，每个组件之间的都有独自的作用域，组件间的数据是无法共享的但实际开发工作中我们常常需要让组件之间共享数据，这也是组件通信的目的要让它们互相之间能进行通讯，这样才能构成一个有机的完整系统

**组件间通信的分类**

组件间通信的分类可以分成以下

- 父子组件之间的通信

兄弟组件之间的通信

祖孙与后代组件之间的通信

- 非关系组件间之间的通信

关系图：

### 常用通信方案

整理vue 中8种常规的通信方案

1. 通过 props 传递

2. 通过 \$emit 触发自定义事件

3. 使用 ref

4. EventBus

5. parent或 root

6. attrs 与 listeners

7. Provide 与 Inject

8. Vuex

**props传递数据**

适用场景：父组件传递数据给子组件

子组件设置props属性，定义接收父组件传递过来的参数

- 父组件在使用子组件标签中通过字面量来传递值

Children.vue

```yaml
props:{
//字符串形式
name:String //接收的类型参数
//对象形式
age:{
type:Number，//接收的类型为数值
defaule:18，//默认值为18
require:true // age属性必须传递
}
}
```

Father.vue组件

1<Children name="jack" age=18 />

**\$emit 触发自定义事件**

适用场景：子组件传递数据给父组件

子组件通过 \$emit触发自定义事件，\$emit第二个参数为传递的数值

父组件绑定监听器获取到子组件传递过来的参数

Chilfen.vue

```js
this.$emit('add', good)
```

Father.vue

```html
<Children @add="cartAdd($event)" />
```

**ref**

- 父组件在使用子组件的时候设置 ref

父组件通过设置子组件 ref 来获取数据

父组件

```js
<Children ref="foo" />

this.$refs.foo//获取子组件实例，通过子组件实例我们就能拿到对应的数据
```

**EventBus**

使用场景：兄弟组件传值

创建一个中央事件总线 EventBus

兄弟组件通过 \$emit 触发自定义事件，\$emit 第二个参数为传递的数值

另一个兄弟组件通过 \$on 监听自定义事件

Bus.js

```js
this.$bus.$emit('foo')
```

```js
// 创建一个中央时间总线类
class Bus {
constructor() {
this.callbacks = {};// 存放事件的名字
}
$on(name, fn) {
this.callbacks[name] = this.callbacks[name] || [];
this.callbacks[namel.push(fn);
}
$emit(name, args) {
if (this.callbacks[name]) {
this.callbacks[name].forEach((cb) => cb(args));
}
}
}

// main.js
Vue.prototype.$bus = new Bus() // 将$bus挂载到vue实例的原型上
//另一种方式
Vue.prototype.$bus = new Vue() // Vue已经实现了Bus的功能
```

**Children1.vue**

Children2.vue

```js
this.$bus.$on('foo', this.handle)
```

**parent、root**

通过共同祖辈 \$parent 或者\$root 搭建通信桥连

**兄弟组件**

```js
this.$parent.on('add',this.add)
```

**另一个兄弟组件**

```js
this.$parent.emit('add')
```

```html
// child:并未在props中声明foo
<p>{{$attrs.foo}}</p>

// parent
<HelloWorld foo="foo"/>
// 给Grandson隔代传值，communication/index.vue
<Child2 msg="lalala" @some-event="onSomeEvent"></Child2>

// Child2做展开
<Grandson v-bind="$attrs"v-on="$listeners"></Grandson>

// Grandson使用
<div @click="$emit('some-event', 'msg from grandson')">
  {{msg}}
</div>
```

**attrs与listeners**

适用场景：祖先传递数据给子孙

- 设置批量向下传属性 \$attrs 和 \$listeners

包含了父级作用域中不作为 prop 被识别(且获取）的特性绑定（class和style除外)。

- 可以通过 v-bind="\$attrs" 传入内部组件

### 跨层级与全局状态通信

**provide 与 inject**

在祖先组件定义provide属性，返回传递的值

在后代组件通过inject接收组件传递过来的值

祖先组件

```js
provide( ){
return {
foo:'foo'
}

inject:['foo'] //获取到祖先组件传递过来的值
```

**vuex**

- 适用场景:复杂关系的组件数据传递

uex作用相当于一个用来存储共享变量的容器

state用来存放共享变量的地方

getter，可以增加一个 getter派生状态，（相当于 store 中的计算属性），用来获得共享变量的值

mutations用来存放修改state的方法。

actions也是用来存放修改state的方法，不过action是在mutations的基础上进行。常

### 选型总结

- 父子关系的组件数据传递选择 props 与 \$emit 进行传递，也可选择 ref

兄弟关系的组件数据传递可选择\$bus，其次可以选择\$parent 进行传递

- 祖先与后代组件数据传递可选择 attrs 与 listeners 或者 Provide 与 Inject

复杂关系的组件数据传递可以通过vuex存放共享的变量

## 4. 为什么data属性是一个函数而不是一个对象?

### 根实例与组件的 data 约束

vue实例的时候定义data 属性既可以是一个对象，也可以是一个函数

```js
const app = new Vue({
    el:"#app",
    //对象格式
    data:{
      foo:"foo"
    },
    //函数格式
    data( ){
      return {
        foo:"foo"
      }
    }
  })
```

组件中定义data属性，只能是一个函数

如果为组件data直接定义为一个对象

```js
Vue.component('component1',{
    template:`<div>组件</div>`,
    data:{
      foo:"foo"
    }
  })
```

则会得到警告信息

▶[Vue warn]: The "data" option should be a function that returns a vue.js:634
per-instance value in component definitions.

警告说明：返回的 data应该是一个函数在每一个组件实例中

### 函数返回值隔离实例状态

上面讲到组件data必须是一个函数，不知道大家有没有思考过这是为什么呢？

在我们定义好一个组件的时候，vue 最终都会通过Vue.extend(）构成组件实例

这里我们模仿组件构造函数，定义data属性，采用对象的形式

```js
function Component(){

}
Component.prototype.data = {
  count : 0
}
```

创建两个组件实例

```js
const componentA = new Component()
const componentB = new Component()
```

修改componentA组件 data属性的值，componentB中的值也发生了改变

```js
console.log(componentB.data.count) // 0
componentA.data.count = 1
console.log(componentB.data.count) // 1
```

产生这样的原因这是两者共用了同一个内存地址，componentA修改的内容，同样

对componentB 产生了影响

如果我们采用函数的形式，则不会出现这种情况(函数返回的对象内存地址并不相同)

```js
function Component(){
this.data = this.data()
}
Component.prototype.data = function (){
return {
count : 0
了
}
```

修改componentA 组件 data 属性的值， componentB中的值不受影响

```js
console.log(componentB.data.count) // 0
componentA.data.count = 1
console.log(componentB.data.count) // 0
```

vue组件可能会有很多个实例，采用函数返回一个全新data形式，使每个实例对象的数据不会受到其他实例对象数据的污染

### Vue 选项合并原理

首先可以看看vue初始化 data的代码，data的定义可以是函数也可以是对象

源码位置：/vue-dev/src/core/instance/state.js

```js
function initData (vm: Component) {
  let data = vm.\$options.data
  data = vm._data = typeof data === 'function'
  ? getData(data, vm)
  : data || {}
}
```

data既能是object也能是function，那为什么还会出现上文警告呢?

别急，继续看下文

组件在创建的时候，会进行选项的合并

源码位置：/vue-dev/src/core/util/options.js

自定义组件会进入 mergeOptions进行选项合并

```js
Vue.prototype.\_init = function (options?: Object) {
  // merge options
  if (options && options.\_isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options)
  } else {
    vm.\$options =mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }
}
```

定义 data 会进行数据校验

源码位置：/vue-dev/src/core/instance/init.js

这时候vm 实例为 undefined，进入 if 判断，若data 类型不是function，则出现警告提示

```ts
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    if (childVal && typeof childVal !== "function") {
      process.env.NODE_ENV !== "production" &&
      warn(
        'The "data" option should be a function '+
        "that returns a per-instance value in component " +
        "definitions.",
        vm
      );

      return parentVal;
    }
    return mergeDataOrFn(parentVal, childVal);
  }
  return mergeDataOrFn(parentVal, childVal, vm);
};
```

### 实例隔离结论

- 根实例对象data 可以是对象也可以是函数(根实例是单例)，不会产生数据污染情况

- 组件实例对象data必须为函数，目的是为了防止多个组件实例对象之间共用一个 data，产生数据污染。采用函数的形式，initData时会将其作为工厂函数都会返回全新data对象

## 5. 动态给Vue的data添加一个新的属性时会发生什么？怎样解决?

### 新增属性为何不会响应

我们从一个例子开始

定义一个 p标签，通过 v-for 指令进行遍历

然后给botton标签绑定点击事件，我们预期点击按钮时，数据新增一个属性，界面也新增一行

```html
<p v-for="(value,key) in item" :key="key">
  {{ value }}
</p>
<button @click="addProperty">动态添加新属性</button>
```

实例化一个 vue 实例，定义 data 属性和 methods 方法

```js
const app =new Vue({
    el:"#app",
    data:()=>{
      item:{
        oldProperty:"I旧属性"
      }
    },
    methods:{
      addProperty(){
        this.items.newProperty = "新属性" // 为items添加新属性
        console.log(this.items) // 输出带有newProperty的items
      }
    }
  })
```

点击按钮，发现结果不及预期，数据虽然更新了（console打印出了新属性），但页面并没有更新

**原理分析**

为什么产生上面的情况呢?

下面来分析一下

vue2 是用过Object.defineProperty实现数据响应式

```js
const obj = {}
Object.defineProperty(obj, 'foo', {
get( ) {
console.log(`get foo:${val}`);
return val
},
set(newVal) {
if (newVal !== val) {
console.log(`set foo:${newVal}`);
val = newVal
}
}
})
}
```

当我们访问 foo属性或者设置 foo值的时候都能够触发 setter 与 getter

```js
obj.foo
obj.foo ='new'
```

但是我们为obj添加新属性的时候，却无法触发事件属性的拦截

1obj.bar =新属性'

原因是一开始obj的foo属性被设成了响应式数据，而 bar 是后面新增的属性，并没有通过Object.defineProperty 设置成响应式数据

### 可选解决方案

ue不允许在已经创建的实例上动态添加新的响应式属性

若想实现数据与视图同步更新，可采取下面三种解决方案：

- Vue.set()

- Object.assign()

- \$forcecUpdated()

**Vue.set()**

ue.set( target, propertyName/index, value )

参数

{Object | Array} target

{string | number} propertyName/index

{any} value

返回值：设置的值

通过Vue.set 向响应式对象中添加一个 property，并确保这个新 property同样是响应式的，

且触发视图更新

关于Vue.set源码(省略了很多与本节不相关的代码)

源码位置： src\core\observer\index.js

```js
function set (target: Array<any> | Object, key: any, val: any): any {
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```

这里无非再次调用 defineReactive方法，实现新增属性的响应式

关于defineReactive方法，内部还是通过Object.defineProperty实现属性拦截

大致代码如下：

```js
function defineReactive(obj, key, val) {
Object.defineProperty(obj, key, {
get( ) {
console.log(`get ${key}:${val}`);
return val
}，
set(newVal) {
if (newVal !== val) {
console.log(`set ${key}:${newVal}`);
val = newVal
了
}
})

```

**Object.assign()**

直接使用Object.assign()添加到对象的新属性不会触发更新

应创建一个新的对象，合并原对象和混入对象的属性

```js
this.someObject = Object.assign({},this.someObject,{newProperty1:1,newPrope
    rty2:2 ...})
```

**\$forceUpdate**

如果你发现你自己需要在 Vue中做一次强制更新，99.9%的情况，是你在某个地方做错了事

\$forceUpdate 迫使Vue 实例重新渲染

PS:仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

### 方案选择

如果为对象添加少量的新属性，可以直接采用 Vue.set()

- 如果需要为新对象添加大量的新属性，则通过Object.assign()创建新对象

如果你实在不知道怎么操作时，可采取 \$forceUpdate()进行强制刷新(不建议)

## 6. v-if和v-for的优先级是什么？

### 指令作用与优先级

v-if 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回 true 值的时候被渲染v-for 指令基于一个数组来渲染一个列表。v-for 指令需要使用 item in items 形式的特殊语法，其中items是源数据数组或者对象，而item则是被迭代的数组元素的别名在v-for 的时候，建议设置key值，并且保证每个key值是独一无二的，这便于 diff 算法进行优化

两者在用法上

```text
<Modalv-if="isShow" />

<li v-for="item in items" :key="item.id">
{{ item.label }}
</li>
```

**优先级**

v-if 与v-for 都是vue模板系统中的指令

在vue模板编译的时候，会将指令系统转化成可执行的render函数

### 编译结果与源码验证

编写一个 p 标签，同时使用 v-if 与 v-for

```html
<div id="app">
  <p v-if="isShow" v-for="item in items">
    {{ item.title }}
  </p>
</div>
```

创建 vue 实例，存放 isShow 与 items 数据

```js
const app = new Vue({
    el: "#app",
    data() {
      return {
        items:[
          { title: "foo" },
          { title: "baz" }]
      }
    },
    computed: {
      isShow() {
        return this.items && this.items.length > 0
      }
    }
  })
```

模板指令的代码都会生成在 render 函数中，通过 app.\$options.render 就能得到渲染函数

```js
f anonymous() {
  with (this) { return
    _c('div', { attrs: { "id": "app" } },
      _l((items), function (item)
        { return (isShow) ? _c('p', [_v("\n" + _s(item.title) + "\n")]) : _e()
        }),0)}
}
```

\_l是vue的列表渲染函数，函数内部都会进行一次 if判断

初步得到结论:v-for优先级是比 v-if 高

再将v-for与v-if 置于不同标签

1 - `<div id="app">`
2 `<template v-if="isShow">`
3 `<p v-for="item in items">`{{item.title}}`</p>`
`</template>`
5 `</div>`

再输出下 render 函数

```js
f anonymous() {
with(this){return
_c('div',{attrs:{"id":"app"}},
[(isShow)?[_v("\n"),
_l((items),function(item){return _c('p',[_v(_s(item.title))])})]:_e()],
)}

```

这时候我们可以看到，v-for与 v-if 作用在不同标签时候，是先进行判断，再进行列表的渲染

我们再在查看下 vue 源码

```bash
源码位置： \vue-dev\src\compiler\codegen\index.js
```

```ts
export function genElement (el: ASTElement, state: CodegenState): string {
、 if (el.parent) {
el.pre = el.pre || el.parent.pre
}
if (el.staticRoot && !el.staticProcessed) {
return genStatic(el, state)
、 } else if (el.once && !el.onceProcessed) {
return genOnce(el, state)
} else if (el.for && !el.forProcessed) {
return genFor(el, state)
} else if (el.if && !el.ifProcessed) {
return genIf(el, state)
} else if (el.tag === 'template'&& !el.slotTarget && !state.pre) {
return genChildren(el, state) Il 'void 0'
} else if (el.tag === 'slot') {
return genSlot(el, state)
} else {
// component or element

}
```

在进行 if 判断的时候，v-for 是比 v-if 先进行判断
最终结论:v-for优先级比 v-if 高

### 使用建议

1. 永远不要把 v-if 和 v-for 同时用在同一个元素上，带来性能方面的浪费(每次渲染都会先循环再进行条件判断)

2. 如果避免出现这种情况，则在外层嵌套 template (页面渲染不生成dom 节点)，在这一层进行v-if判断，然后在内部进行v-for循环

```vue
<template v-if="isShow">
<p v-for="item in items">
</template>
```

3. 如果条件出现在循环内部，可通过计算属性computed提前过滤掉那些不需要显示的项

```js
computed: {
  items: function() {
    return this.list.filter(function (item) {
        return item.isShow
      })
  }
}
```

## 7. v-show和v-if有什么区别？使用场景分别是什么？

### 共同点与核心区别

我们都知道在 vue 中 v-show 与 v-if 的作用效果是相同的(不含v-else)，都能控制元素在页面是否显示

在用法上也是相同的

```text
<Model v-show="isShow" />
<Model v-if="isShow" />
```

当表达式为true的时候，都会占据页面的位置

当表达式都为 false时，都不会占据页面位置

**v-show与v-if的区别**

- 控制手段不同

- 编译过程不同

- 编译条件不同

控制手段：v-show隐藏则是为该元素添加 css--display:none，dom 元素依旧还在。 V-if 显示隐藏是将dom 元素整个添加或删除

编译过程：v-if切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；v-show只是简单的基于css切换

编译条件:v-if是真正的条件渲染，它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。只有渲染条件为假时，并不做操作，直到为真才渲染

v-show由false变为true的时候不会触发组件的生命周期

v-if 由 false 变为 true的时候，触发组件的 beforeCreate create beforeMount、mounted 钩子，由 true变为 false的时候触发组件的 beforeDestory、destoryed方法

性能消耗：v-if有更高的切换消耗；v-show有更高的初始渲染消耗；

### 编译与运行机制

具体解析流程这里不展开讲，大致流程如下

- 将模板 template 转为 ast 结构的 JS 对象

- 用 ast得到的 JS 对象拼装 render和 staticRenderFns 函数

render 和staticRenderFns 函数被调用后生成虚拟 VNODE 节点，该节点包含创建 DOM节点所需信息

vm.patch函数通过虚拟 DOM算法利用 VNODE 节点创建真实DOM 节点

**v-show原理**

不管初始条件是什么，元素总是会被渲染

我们看一下在vue中是如何实现的

代码很好理解，有 transition 就执行 transition，没有就直接设置 display 属性

```ts
// https://github.com/vuejs/vue-next/blob/3cd30c5245da0733f9eb6f29d220f39c
/packages/runtime-dom/src/directives/vShow.ts
export const vShow: ObjectDirective<VShowElement> = {
beforeMount(el, { value }, { transition }) {
el._vod = el.style.display === 'none'?'': el.style.display
if (transition && value) {
transition.beforeEnter(el)
} else {
setDisplay(el, value)
}
},
mounted(el, { value }, { transition }) {
if (transition && value) {
transition.enter(el)
}
},
updated(el, { value, oldValue }, { transition }) {
//..
},
beforeUnmount(el, { value }) {
setDisplay(el, value)
}

```

**v-if原理**

v-if在实现上比v-show要复杂的多，因为还有 else else-if 等条件需要处理，这里我们也只摘抄源码中处理v-if 的一小部分

返回一个 node 节点，render函数通过表达式的值来决定是否生成DOM

```js
// https://github.com/vuejs/vue-next/blob/cdc9f336fd/packages/compiler-cor
e/src/transforms/vIf.ts
export const transformIf = createStructuralDirectiveTransform(
/^(if|else|else-if)$/,
(node, dir, context) => {
return processIf(node, dir, context, (ifNode, branch, isRoot) => {
//..
return () => {
if (isRoot) {
ifNode.codegenNode = createCodegenNodeForBranch(
branch,
key,
context
) as IfConditionalExpression
} else {
// attach this branch's codegen node to the v-if root.
const parentCondition = getParentCondition(ifNode.codegenNode!)
parentCondition.alternate = createCodegenNodeForBranch(
branch,
key + ifNode.branches.length - 1,
context
)
}
}
})
}
）
```

### 选择 v-show 或 v-if

v-if 与 v-show 都能控制dom 元素在页面的显示
v-if 相比 v-show 开销更大的(直接操作 dom 节点增加与删除)
如果需要非常频繁地切换，则使用v-show较好
如果在运行时条件很少改变，则使用v-if较好

## 8. 你知道Vue中key的原理吗？说说你对它的理解

### key 的作用

开始之前，我们先还原两个实际工作场景

1. 当我们在使用 v-for时，需要给单元加上 key

```html
<ul>
  <li v-for="item in items" :key="item.id">...</li>
</ul>
```

2. 用 +new Date()生成的时间戳作为key，手动强制触发重新渲染

```js
<Comp :key="+new Date()" />
```

那么这背后的逻辑是什么，key的作用又是什么?

一句话来讲

key是给每一个vnode的唯一id，也是diff的一种优化策略，可以根据key，更准确，更快的找到对应的vnode节点

### 有无 key 的更新差异

当我们在使用v-for时，需要给单元加上 key

- 如果不用key，Vue会采用就地复地原则:最小化element的移动，并且会尝试尽最大程度在同适当

的地方对相同类型的element，做patch或者reuse。

- 如果使用了key，Vue会根据keys的顺序记录element，曾经拥有了key的element如果不再出现的话，会被直接remove或者destoryed

用+new Date()生成的时间戳作为 key，手动强制触发重新渲染

当拥有新值的rerender作为key时，拥有了新key的Comp出现了，那么旧key Comp会被移除，新key Comp触发渲染

**设置key与不设置key区别**

举个例子：

创建一个实例，2秒后往items数组插入数据

```html
<body>
  <div id="demo">
    <p v-for="item in items" :key="item">{{item}}</p>
  </div>
  <script src="../../dist/vue.js"></script>
  <script>
    //创建实例
    const app = new Vue({
    el: '#demo',
    data: { items: ['a', 'b', 'c', 'd', 'e'] },
    mounted () {
    setTimeout(() => {
    this.items.splice(2, 0, 'f') //
    }, 2000);
    },
    });
  </script>
</body>
```

在不使用 key 的情况，vue 会进行这样的操作:

分析下整体流程：

比较A，A，相同类型的节点，进行 patch，但数据相同，不发生 dom 操作

比较B，B，相同类型的节点，进行patch，但数据相同，不发生dom操作

比较C，F，相同类型的节点，进行 patch，数据不同，发生 dom 操作

比较D，C，相同类型的节点，进行 patch，数据不同，发生dom 操作

比较E，D，相同类型的节点，进行patch，数据不同，发生 dom操作

循环结束，将E插入到 DOM中

一共发生了3次更新，1次插入操作

在使用key的情况:vue会进行这样的操作:

- 比较A，A，相同类型的节点，进行 patch，但数据相同，不发生 dom操作

比较B，B，相同类型的节点，进行patch，但数据相同，不发生dom操作

- 比较C，F，不相同类型的节点

比较E、E，相同类型的节点，进行 patch，但数据相同，不发生 dom操作

- 比较D、D，相同类型的节点，进行 patch，但数据相同，不发生 dom 操作

- 比较C、C，相同类型的节点，进行 patch，但数据相同，不发生 dom 操作

循环结束，将F插入到C之前

一共发生了0次更新，1次插入操作

通过上面两个小例子，可见设置 key 能够大大减少对页面的 DOM操作，提高了 diff 效率

### key 与性能的边界

其实不然，文档中也明确表示

当Vue.js用v-for正在更新已渲染过的元素列表时，它默认用“就地复用”策略。如果数据项的顺序被改变，Vue将不会移动DOM元素来匹配数据项的顺序，而是简单复用此处每个元素，并且确保它在

特定索引下显示已被渲染过的每个元素

这个默认的模式是高效的，但是只适用于不依赖子组件状态或临时DOM状态(例如：表单输入值)的列表渲染输出

建议尽可能在使用v-for 时提供 key，除非遍历输出的DOM内容非常简单，或者是刻意依赖默认行为以获取性能上的提升

### 源码中的节点匹配

源码位置：core/vdom/patch.js

这里判断是否为同一个 key，首先判断的是 key 值是否相等如果没有设置 key，那么 key 为 undefined，这时候undefined是恒等于 undefined

```js
function sameVnode (a, b) {
return (
a.key === b.key && (
(
a.tag === b.tag &&
a.isComment === b.isComment &&
isDef(a.data) ===isDef(b.data) &&
sameInputType(a, b)
）|（
isTrue(a.isAsyncPlaceholder) &&
a.asyncFactory === b.asyncFactory&&
isUndef(b.asyncFactory.error)

}
```

updateChildren 方法中会对新旧 vnode 进行 diff，然后将比对出的结果用来更新真实的 DOM

```js
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
if (isUndef(oldStartVnode)) {
} else if (isUndef(oldEndVnode)) {
} else if (sameVnode(oldStartVnode, newStartVnode)) {
} else if (sameVnode(oldEndVnode, newEndVnode)) {
} else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode move
```
d right
14 } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode move
d left
```js
} else {
if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldC
h, oldStartIdx, oldEndIdx)
idxInOld = isDef(newStartVnode.key)
```
19 ? oldKeyToIdx[newStartVnode.key]
20 : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndId
x)
```js
if (isUndef(idxInOld)) { // New element
createElm(newStartVnode, insertedVnodeQueue, parentElm, ol
dStartVnode.elm, false, newCh, newStartIdx)
} else {
vnodeToMove = oldCh[idxInOld]
if (sameVnode(vnodeToMove, newStartVnode)){
patchVnode(vnodeToMove, newStartVnode, insertedVnodeQu
eue, newCh, newStartIdx)
oldCh[idxInOld] = undefined
```
28 canMove && nodeOps.insertBefore(parentElm, vnodeToMove
.elm,oldStartVnode.elm)
```js
} else {
// same key but different element. treat as new elemen
```
t
31 createElm(newStartVnode, insertedVnodeQueue, parentElm
, oldStartVnode.elm, false, newCh, newStartIdx)
```js
}
}
newStartVnode = newCh[++newStartIdx]
}
```

## 9. 说说你对Vue的mixin的理解，有什么应用场景?

### Mixin 概念与用法

Mixin是面向对象程序设计语言中的类，提供了方法的实现。其他类可以访问mixin类的方法而不必成为其子类

Mixin类通常作为功能模块使用，在需要该功能时“混入”，有利于代码复用又避免了多继承的复杂

**Vue中的mixin**

先来看一下官方定义

mixin (混入），提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。

本质其实就是一个js对象，它可以包含我们组件中任意功能选项，如data、components methods、created、computed等等

我们只要将共用的功能以对象的方式传入 mixins选项中，当组件使用 mixins对象时所有mixins对象的选项都将被混入该组件本身的选项中来

在Vue中我们可以局部混入跟全局混入

```js
Vue.mixin({
    created: function () {
      console.log("全局混入")
    }
  })
```

**局部混入**

定义一个mixin对象，有组件 options的data、methods属性

```js
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}
```

组件通过mixins 属性调用 mixin 对象

```js
Vue.component('componentA',{
    mixins: [myMixin]
  })
```

该组件在使用的时候，混合了mixin里面的方法，在自动执行 created生命钩子，执行 hello方法

**全局混入**

通过Vue.mixin()进行全局的混入

使用全局混入需要特别注意，因为它会影响到每一个组件实例(包括第三方组件)

PS：全局混入常用于插件的编写

### 合并规则与使用场景

当组件存在与mixin对象相同的选项的时候，进行递归合并的时候组件的选项会覆盖mixin的选项但是如果相同选项为生命周期钩子的时候，会合并成一个数组，先执行mixin的钩子，再执行组件的钩子

**使用场景**

在日常的开发中，我们经常会遇到在不同的组件中经常会需要用到一些相同或者相似的代码，这些代码的功能相对独立

这时，可以通过Vue的mixin功能将相同或者相似的代码提出来

举个例子

定义一个 modal弹窗组件，内部通过isShowing 来控制显示

```js
const Modal = {
  template: '#modal',
  data() {
    return {
      isShowing: false
    }
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  }
}
```

定义一个tooltip提示框，内部通过isShowing来控制显示

```js
const Tooltip = {
  template: '#tooltip',
  data() {
    return {
      isShowing: false
    }
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  }
}
```

通过观察上面两个组件，发现两者的逻辑是相同，代码控制显示也是相同的，这时候mixin就派上用场了

首先抽出共同代码，编写一个mixin

```js
const toggle = {
  data() {
    return {
      isShowing: false
    }
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  }
}
```

两个组件在用上，只需要引入 mixin

```js
const Modal = {
  template:'#modal',
  mixins: [toggle]
};

const Tooltip = {
  template:'#tooltip',
  mixins: [toggle]
}
```

通过上面小小的例子，让我们知道了Mixin对于封装一些可复用的功能如此有趣、方便、实用

### 选项合并源码

首先从 Vue.mixin入手

源码位置：/src/core/global-api/mixin.js

```ts
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```

主要是调用merOptions方法

源码位置：/src/core/util/options.js

```js
export function mergeOptions (
parent: Object,
child: Object,
vm?: Component
): Object {

if（child.mixins）{ // 判断有没有mixin 也就是mixin里面挂mixin的情况 有的话递归进
行合并
for (let i = 0, l = child.mixins.length; i < l; i++) {
parent = mergeOptions(parent, child.mixins[i], vm)
}
}

const options = {}
let key
for (key in parent) {
mergeField(key) // 先遍历parent的key 调对应的strats[XXX]方法进行合并
}
for (key in child) {
if(!hasOwn(parent，key)）{ // 如果parent已经处理过某个key就不处理了
mergeField(key) // 处理child中的key 也就parent中没有处理过的key
}
}
function mergeField (key) {
const strat = strats[key] || defaultStrat
options[key] = strat(parent[key]，child[key]，vm，key)// 根据不同类型的
options调用strats中不同的方法进行合并
}
return options
}
```

从上面的源码可以得到以下几点：

优先递归处理mixins

- 先遍历合并 parent 中的 key，调用 mergeField 方法进行合并，然后保存在变量 options

- 再遍历 child，合并补上 parent 中没有的 key，调用 mergeField方法进行合并，保存在变量options

- 通过 mergeField 函数进行了合并

下面是关于Vue的几种类型的合并策略

- 替换型

- 合并型

· 队列型

· 叠加型

### 四类合并策略

**替换型**

替换型合并有props、methods、inject、computed

```js
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
parentVal: ?Object,
childVal: ?Object,
vm?: Component,
key: string
): ?Object {
if (!parentVal) return childVal // 如果parentVal没有值，直接返回childVal
const ret = Object.create(null) // 创建—个第三方对象 ret
extend(ret，parentVal) // extend方法实际是把parentVal的属性复制到ret中
if（childVal）extend(ret，childVal）// 把childVal的属性复制到ret中
return ret
}
strats.provide = mergeDataOrFn
```

同名的 props、methods、inject、computed会被后来者代替

**合并型**

和并型合并有：data

```js
strats.data = function(parentVal, childVal, vm) {
return mergeDataOrFn(
parentVal, childVal, vm
)
};

function mergeDataOrFn(parentVal, childVal, vm) {
return function mergedInstanceDataFn() {
var childData = childVal.call(vm, vm) // 执行data挂的函数得到对象
var parentData = parentVal.call(vm, vm)
if (childData) {
return mergeData(childData,parentData) //将2个对象进行合并
} else {
return parentData //如果没有childData 直接返回parentData
}
}
}

function mergeData(to, from) {
if (!from) return to
var key, toVal, fromVal;
var keys = Object.keys(from);
for (var i = 0; i < keys.length; i++) {
key = keys[i];
toVal = to[key];
fromVal = from[key];
//如果不存在这个属性，就重新设置
if (!to.hasOwnProperty(key)) {
set(to, key, fromVal);
一
存在相同属性，合并对象
else if (typeof toVal =="object" && typeof fromVal =="object") {
mergeData(toVal, fromVal);

return to
}
```

mergeData函数遍历了要合并的data的所有属性，然后根据不同情况进行合并：

- 当目标 data 对象不包含当前属性时，调用 set 方法进行合并(set方法其实就是一些合并重新赋值的方法)

当目标data对象包含当前属性并且当前值为纯对象时，递归合并当前对象值，这样做是为了防止对

象存在新增属性

**队列性**

队列性合并有：全部生命周期和 watch

```js
function mergeHook (
parentVal: ?Array<Function>,
childVal: ?Function | ?Array<Function>
): ?Array<Function> {
return childVal
? parentVal
?parentVal.concat(childVal)
: Array.isArray(childVal)
? childVal
: [childVal]
: parentVal
}

LIFECYCLE_H00KS.forEach(hook => {
strats[hook] = mergeHook
})

// watch
strats.watch = function (
parentVal,
childVal,
vm,
key
) {
// work around Firefox's Object.prototype.watch...
if (parentVal === nativeWatch) { parentVal = undefined; }
if (childVal === nativeWatch) { childVal = undefined; }
/* istanbul ignore if */
if (!childVal) { return Object.create(parentVal || null) }
{
assertObjectType(key, childVal, vm);
}
if (!parentVal) { return childVal }
var ret= {};
extend(ret, parentVal);
for (var key$1 in childVal) {
var parent = ret[key$1];
var child = childVal[key$1];
if (parent && !Array.isArray(parent)) {
parent = [parent];
}
ret[key$1] = parent
? parent.concat(child)
: Array.isArray(child) ? child : [child];
}
```

```js
return ret
};
```

生命周期钩子和watch被合并为一个数组，然后正序遍历一次执行

**叠加型**

叠加型有： component directives filters

```js
strats.components=
strats.directives=

strats.filters = function mergeAssets(
  parentVal, childVal, vm, key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    for (var key in childVal) {
      res[key] = childVal[key];
    }
  }
  return res
}
```

叠加型主要是通过原型链进行层层的叠加

**小结**

替换型策略有 props methods、inject、computed，就是将新的同名参数替代旧的参数

合并型策略是 data，通过 set 方法进行合并和重新赋值

队列型策略有生命周期函数和watch，原理是将函数存入一个数组，然后正序遍历依次执行

- 叠加型有 component、directives、 filters，通过原型链进行层层的叠加

## 10. Vue常用的修饰符有哪些有什么应用场景

### 修饰符分类

在程序世界里，修饰符是用于限定类型以及类型成员的声明的一种符号

在Vue中，修饰符处理了许多DOM事件的细节，让我们不再需要花大量的时间去处理这些烦恼的事情，而能有更多的精力专注于程序的逻辑处理

vue中修饰符分为以下五种：

- 表单修饰符

- 事件修饰符

鼠标按键修饰符

- 键值修饰符

- v-bind修饰符

### 表单修饰符

在我们填写表单的时候用得最多的是 input 标签，指令用得最多的是 v-model关于表单的修饰符有如下：

- lazy

- trim

- number

**lazy**

在我们填完信息，光标离开标签的时候，才会将值赋予给 value，也就是在change事件之后再进行信息同步

```text
<input type="text" v-model.lazy="value">
<p>{{value}}</p>
```

**trim**

自动过滤用户输入的首空格字符，而中间的空格不会过滤

```js
<input type="text" v-model.trim="value">
```

**number**

自动将用户的输入值转为数值类型，但如果这个值无法被parseFloat解析，则会返回原来的值

```html
<input v-model.number="age" type="number">
```

### 事件与输入修饰符

事件修饰符是对事件捕获以及目标进行了处理，有如下修饰符:

- stop

- prevent

- self

- once

- capture

- passive

- native

**stop**

阻止了事件冒泡，相当于调用了event.stopPropagation方法

```html
<div @click="shout(2)">
  <button @click.stop="shout(1)">ok</button>
</div>
//只输出1
```

**prevent**

阻止了事件的默认行为，相当于调用了event.preventDefault方法

```html
<form v-on:submit.prevent="onSubmit"></form>
```

**self**

只当在 event.target 是当前元素自身时触发处理函数

1 `<div v-on:click.self="doThat">`...`</div>`

使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用v-on:click.prevent.s

elf 会阻止所有的点击，而v-on:click.self.prevent 只会阻止对元素自身的点击

**once**

绑定了事件以后只能触发一次，第二次就不会触发

```html
<button @click.once="shout(1)">ok</button>
```

**capture**

使事件触发从包含这个元素的顶层开始往下触发

```js
<div @click.capture="shout(1)">
obj1
<div @click.capture="shout(2)">
obj2
<div @click="shout(3)">
obj3
<div @click="shout(4)">
obj4
</div>
</div>
</div>
</div>
// 输出结构：1 2 4 3
```

**passive**

在移动端，当我们在监听元素滚动事件的时候，会一直触发onscroll事件会让我们的网页变卡，因此我们使用这个修饰符的时候，相当于给onscroll事件整了一个.lazy修饰符

```js
<!--滚动事件的默认行为（即滚动行为）将会立即触发-->
<!-- 而不会等待\`onScroll完成-->
<!--这其中包含\`event.preventDefault()的情况 —->
<div v-on:scroll.passive="onScroll">...</div>
```

不要把 passive 和prevent 一起使用,因为prevent 将会被忽略，同时浏览器可能会向你展示一个警告。

**native**

让组件变成像html内置标签那样监听根元素的原生事件，否则组件上使用 v-on 只会监听自定义事件

```html
<my-component v-on:click.native="doSomething"></my-component>
```

```js
// 只有按键为keyCode的时候才触发
<input type="text" @keyup.keyCode="shout()">
```

```html
<button @click.left="shout(1)">ok</button>
<button @click.right="shout(1)">ok</button>
<button @click.middle="shout(1)">ok</button>
```

使用.native修饰符来操作普通HTML标签是会令事件失效的

**鼠标按钮修饰符**

鼠标按钮修饰符针对的就是左键、右键、中键点击，有如下：

- left 左键点击

- right 右键点击

- middle 中键点击

**键盘修饰符**

键盘修饰符是用来修饰键盘事件（onkeyup，onkeydown）的，有如下：

keyCode存在很多，但vue为我们提供了别名，分为以下两种：

- 普通键(enter、tab、delete、space、esc、up...)

系统修饰键(ctrl、alt、meta、shift...)

还可以通过以下方式自定义一些全局的键盘码别名

```js
Vue.config.keyCodes.f2 = 113
```

### v-bind 修饰符与场景

v-bind修饰符主要是为属性进行操作，用来分别有如下：

- async

- prop

**async**

能对props 进行一个双向绑定

```js
//父组件
<comp :myMessage.sync="bar"></comp>
//子组件
this.$emit('update:myMessage',params);
```

**以上这种方法相当于以下的简写**

```js
//父亲组件
<comp :myMessage="bar" @update:myMessage="func"></comp>
func(e){
this.bar = e;

//子组件js
func2(){
this.$emit('update:myMessage',params);
}
```

使用 async 需要注意以下两点：

- 使用 sync 的时候，子组件传递的事件名格式必须为 update:value，其中 value 必须与子组件中props中声明的名称完全一致

注意带有.sync 修饰符的 v-bind 不能和表达式一起使用

将 v-bind.sync 用在—个字面量的对象上，例如 v-bind.sync=”{ title： doc.title}”，是无法正常工作的

**props**

设置自定义标签属性，避免暴露数据，防止污染HTML结构

```html
<input id="uid" title="title1" value="1" :index.prop="index">
```

将命名变为驼峰命名法，如将view-Box属性名转换为 viewBox

```text
<svg :viewBox="viewBox"></svg>
```

**应用场景**

根据每一个修饰符的功能，我们可以得到以下修饰符的应用场景：

- .stop:阻止事件冒泡

.native:绑定原生事件

- .once:事件只执行一次

- .self：将事件绑定在自身身上，相当于阻止事件冒泡

.prevent：阻止默认事件

- .caption：用于事件捕获

- .once:只触发一次

- .keyCode：监听特定键盘按下

- .right:右键

## 11. Vue中的$nextTick有什么作用？

### 异步更新与 nextTick

```js
const vm = new Vue({
    el: '#app',
    data: {
      message：'原始值'
    }
  })
```

**官方对其的定义**

在下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM

什么意思呢?

我们可以理解成，Vue 在更新 DOM时是异步执行的。当数据发生变化，Vue将开启一个异步更新队列，视图需要等队列中所有数据变化完成之后，再统一进行更新

举例一下

Html结构

1`<div id="app">` {{ message }} `</div>`

构建一个 vue 实例

修改 message

```js
this.message =修改后的值1'
this.message ='修改后的值2'
this.message ='修改后的值3'
```

这时候想获取页面最新的DOM节点，却发现获取到的是旧值

```js
console.log(vm.$el.textContent) // 原始值
```

这是因为message数据在发现变化的时候，vue并不会立刻去更新Dom，而是将修改数据的操作放在了一个异步操作队列中

如果我们一直修改相同数据，异步操作队列还会进行去重

等待同一事件循环中的所有数据变化完成之后，会将队列中的事件拿来进行处理，进行DOM的更新

**为什么要有nexttick**

举个例子

{{num}}
```js
for(let i=0; i<100000; i++){
  num = i
}
```

如果没有 nextTick 更新机制，那么 num 每次更新值都会触发视图更新(上面这段代码也就是会更新10万次视图)，有了 nextTick机制，只需要更新一次，所以nextTick本质是一种优化策略

### 读取更新后的 DOM

如果想要在修改数据后立刻得到更新后的 DOM 结构，可以使用 Vue.nextTick()

第一个参数为：回调函数(可以获取最近的DOM结构)

第二个参数为：执行函数上下文

```js
//修改数据
vm.message = '修改后的值'
// DOM 还没有更新
console.log(vm.$el.textContent) // 原始的值
Vue.nextTick(function () {
    // DOM 更新了
    console.log(vm.$el.textContent) // 修改后的值
  })
```

组件内使用vm.\$nextTick() 实例方法只需要通过 this.\$nextTick()，并且回调函数中的this 将自动绑定到当前的 Vue 实例上

```js
this.message = '修改后的值'
console.log(this.$el.textContent) // =>'原始的值'
this.$nextTick(function () {
    console.log(this.$el.textContent) // =>修改后的值'
  })
```

\$nextTick() 会返回一个 Promise 对象，可以是用 async/await 完成相同作用的事情

```js
this.message = 修改后的值'
console.log(this.$el.textContent) // => '原始的值'
await this.$nextTick()
console.log(this.$el.textContent) // =>修改后的值
```

### 调度实现

源码位置：/src/core/util/next-tick.js
callbacks也就是异步操作队列
callbacks 新增回调函数后又执行了timerFunc 函数，pending 是用来标识同一个时间只能执
行一次

```ts
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;

  // cb 回调函数会经统一处理压入 callbacks 数组
  callbacks.push(() => {
      if (cb) {
        // 给 cb 回调函数执行加上了 try-catch 错误处理
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });

  // 执行异步延迟函数 timerFunc
  if (!pending) {
    pending = true;
    timerFunc();
  }

  // 当 nextTick 没有传入函数参数的时候，返回一个 Promise 化的调用
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
        _resolve = resolve;
      });
  }
}
```

timerFunc 函数定义，这里是根据当前环境支持什么方法则确定调用哪个，分别有:

Promise.then、MutationObserver、setImmediate、setTimeout通过上面任意一种方法，进行降级操作

```js
export let isUsingMicroTask = false
if (typeof Promise !== 'undefined'&& isNative(Promise)) {
//判断1:是否原生支持Promise
const p = Promise.resolve()
timerFunc = ( ) => {
p.then(flushCallbacks)
if (isIOS) setTimeout(noop)
}
isUsingMicroTask = true
}else if (!isIE && typeof MutationObserver !== 'undefined'&& (
isNative(MutationObserver) ||
MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
//判断2:是否原生支持MutationObserver
let counter = 1
const observer = new MutationObserver(flushCallbacks)
const textNode = document.createTextNode(String(counter))
observer.observe(textNode, {
characterData: true
})
timerFunc = ( ) => {
counter = (counter + 1) % 2
textNode.data = String(counter)
}
isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined'&& isNative(setImmediate))
{
//判断3：是否原生支持setImmediate
timerFunc = ( ) => {
setImmediate(flushCallbacks)
}
} else {
//判断4:上面都不行，直接用setTimeout
timerFunc = ( ) => {
setTimeout(flushCallbacks, 0)

}
```

无论是微任务还是宏任务，都会放到flushCallbacks使用

这里将callbacks 里面的函数复制一份，同时 callbacks 置空

依次执行 callbacks里面的函数

```js
function flushCallbacks () {
pending = false
const copies = callbacks.slice(0)
callbacks.length = 0
for (let i = 0; i < copies.length; i++) {
copies[i]()
}

```

### 执行流程总结

1. 把回调函数放入callbacks等待执行

2. 将执行函数放到微任务或者宏任务中

3. 事件循环到了微任务或者宏任务，执行函数依次执行callbacks中的回调

## 12. Vue实例挂载的过程

我们都听过知其然知其所以然这句话

那么不知道大家是否思考过 new Vue()这个过程中究竟做了些什么?

过程中是如何完成数据的绑定，又是如何将数据渲染到视图的等等

### 实例初始化与状态建立

首先找到vue的构造函数

源码位置：src\core\instance\index.js

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production'&&
    !(this instanceof Vue)
  ){
    warn('Vue is a constructor and should be called with the `new keyword'
    )
  }
  this._init(options)
}
```

options是用户传递过来的配置项，如data、methods等常用的方法

vue构建函数调用\_init方法，但我们发现本文件中并没有此方法，但仔细可以看到文件下方定定义了很多初始化方法

```js
initMixin(Vue); // 定义 \_init
stateMixin(Vue); // 定义 \$set \$get \$delete \$watch 等
eventsMixin(Vue); // 定义事件 \$on \$once \$off \$emit
lifecycleMixin(Vue);// 定义 \_update \$forceUpdate \$destroy
renderMixin(Vue); // 定义render 返回虚拟dom
```

首先可以看 initMixin方法，发现该方法在Vue原型上定义了\_init方法

源码位置：src\core\instance\init.js

```js
Vue.prototype.\_init = function (options?: Object) {
const vm: Component = this
// a uid
vm.\_uid = uid++
let startTag, endTag
/\* istanbul ignore if \*/
if (process.env.NODE\_ENV !== 'production'&& config.performance && mar
```

k) {
```js
startTag =\`vue-perf-start:\${vm.\_uid}
endTag =\`vue-perf-end:\${vm.\_uid}
mark(startTag)
}
// a flag to avoid this being observed
```
14 vm.\_isVue = true
```js
// merge options
// 合并属性，判断初始化的是否是组件，这里合并主要是mixins 或 extends 的方法
if (options&& options.\_isComponent) {
// optimize internal component instantiation
// since dynamic options merging is pretty slow, and none of the
// internal component options needs special treatment.
initInternalComponent(vm, options)
} else { // 合并vue属性
```
23 vm.\$options = mergeOptions(
24 resolveConstructorOptions(vm.constructor),
25 options || {},
26 vm
```js
)
}
```
29 /\* istanbul ignore else \*/
```js
if (process.env.NODE\_ENV !== 'production') {
// 初始化proxy拦截器
initProxy(vm)
} else {
```
34 vm.\_renderProxy = vm
36 // expose real self
37 vm. \_self = vm
```js
// 初始化组件生命周期标志位
initLifecycle(vm)
//初始化组件事件侦听
initEvents(vm)
//初始化渲染方法
initRender(vm)
callHook(vm, 'beforeCreate')
```

```js
//初始化依赖注入内容，在初始化data、props之前
initInjections(vm) // resolve injections before data/props

// 初始化props/data/method/watch/methods

initState(vm)

initProvide(vm) // resolve provide after data/props

callHook(vm, 'created')

/* istanbul ignore if */

if (process.env.NoDE_ENV !== 'production'&& config.performance && mar
k) {

vm._name = formatComponentName(vm, false)

mark(endTag)

measure(`vue ${vm._name} init`, startTag, endTag)

}

//挂载元素

if (vm.$options.el) {

vm.$mount(vm.$options.el)

}

}
```

仔细阅读上面的代码，我们得到以下结论：

在调用beforeCreate之前，数据初始化并未完成，像data、props这些属性无法访问到

到了created的时候，数据已经初始化完成，能够访问data、props 这些属性，但这时候并未完成dom的挂载，因此无法访问到 dom元素

挂载方法是调用 vm.\$mount 方法

initState 方法是完成props/data/method/watch/methods 的初始化

源码位置：src\core\instance\state.js

```js
export function initState (vm: Component) {
// 初始化组件的watcher列表
vm.\_watchers = []
const opts = vm.\$options
// 初始化props
if (opts.props) initProps(vm, opts.props)
//初始化methods方法
if (opts.methods) initMethods(vm, opts.methods)
if (opts.data) {
// 初始化data
initData(vm)
} else {
observe(vm.\_data = {}, true /\* asRootData \*/)
}
if (opts.computed) initComputed(vm, opts.computed)
if (opts.watch && opts.watch !== nativeWatch) {
initWatch(vm, opts.watch)
}
```

19}

我们主要看初始化data的方法为 initData，它与 initState 在同一文件上

```js
function initData (vm: Component) {
let data = ym.\$options.data
//获取到组件上的data
data = vm.\_data = typeof data === 'function'
? getData(data, vm)
: data || {}
if (!isPlainObject(data)) {
data = {}
process.env.NODE\_ENV !== 'production' && warn(
'data functions should return an object:\n' +
'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function'
vm
)
}
// proxy data on instance
const keys = Object.keys(data)
const props = vm.\$options.props
const methods = vm.\$options.methods
let i = keys.length
while (i--) {
const key = keys[i]
if (process.env.NODE\_ENV !== 'production') {
//属性名不能与方法名重复
if (methods && hasOwn(methods, key)) {
warn(
\`Method "\${key}" has already been defined as a data property.\`,
vm
)
}
}
// 属性名不能与state名称重复
if (props && hasOwn(props, key)) {
process.env.NODE\_ENV !== 'production'&& warn(
The data property "\${key}" is already declared as a prop.
Use prop default value instead.\`,
vm
)
} else if (!isReserved(key)) { // 验证key值的合法性
//将\_data中的数据挂载到组件vm上，这样就可以通过this.xxx访问到组件上的数据
proxy(vm,\`\_data\`, key)
}
}
// observe data
//响应式监听data是数据的变化

observe(data, true /\* asRootData \*/)
```

}

仔细阅读上面的代码，我们可以得到以下结论

初始化顺序： props、 methods、 data

data 定义的时候可选择函数形式或者对象形式(组件只能为函数形式)

关于数据响应式在这就不展开详细说明

### 模板编译与组件挂载

上文提到挂载方法是调用 vm.\$mount方法

源码位置：

```js
Vue.prototype.\$mount = function (
el?: string | Element,
hydrating?: boolean
): Component {
// 获取或查询元素
el = el && query(el)
/\* istanbul ignore if \*/
// vue 不允许直接挂载到body或页面文档上
if (el === document.body| el === document.documentElement) {
process.env.NODE\_ENV !== 'production'&& warn(
Do not mount Vue to <html> or <body> - mount to normal elements ins
```

tead.
```js
)
return this
}
const options = this.\$options
// resolve template/el and convert to render function
if (!options.render) {
let template = options.template
//存在template模板，解析vue模板文件
if (template) {
if (typeof template === 'string') {
if (template.charAt(0) === '#') {
template = idToTemplate(template)
```
26 /\* istanbul ignore if \*/
```js
if (process.env.NODE\_ENV !== 'production'&& !template) {
warn(
```
29 \`Template element not found or is empty: \${options.template}
30 this
```js
else if (template.nodeType) {
template = template.innerHTML
} else {
if (process.env.NODE\_ENV !== 'production') {
warn('invalid template option:'+ template, this)
}
return this
}
} else if (el) {
// 通过选择器获取元素内容
```

```js
template = getOuterHTML(el)
}

if (template) {

/* istanbul ignore if */

if (process.env.NoDE_ENV !== 'production'&& config-performance && m
ark) {

mark('compile')

}

/**

*1.将temmplate解析ast tree

*2.将ast tree转换成render语法字符串

*3.生成render方法

*/

const { render, staticRenderFns } = compileToFunctions(template, {

outputSourceRange: process.env.NoDE_ENV !=='production',

shouldDecodeNewlines,

shouldDecodeNewlinesForHref,

delimiters: options.delimiters,

comments: options.comments

}, this)

options.render = render

options.staticRenderFns = staticRenderFns

/* istanbul ignore if */

if (process.env.NODE_ENV !== 'production'&& config.performance && m
ark) {

mark('compile end')

measure(`vue ${this._name} compile`, 'compile', 'compile end')

}

}

}

return mount.call(this, el, hydrating)

}
```

阅读上面代码，我们能得到以下结论：

- 不要将根元素放到 body 或者 html 上

- 可以在对象中定义 template/render 或者直接使用 template、el 表示元素选择器

最终都会解析成 render 函数，调用 compileToFunctions，会将 template 解析成render函数

对template的解析步骤大致分为以下几步：

将 html 文档片段解析成 ast 描述符

将 ast 描述符解析成字符串

- 生成render 函数

生成render函数，挂载到 vm上后，会再次调用mount方法

源码位置：src\platforms\web\runtime\index.js

```ts
// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  //渲染组件
  return mountComponent(this, el, hydrating)
}
```

调用 mountComponent 渲染组件

```ts
export function mountComponent (
vm: Component,
el: ?Element,
hydrating?: boolean
): Component {
vm.$el = el
//如果没有获取解析的render函数，则会抛出警告
// render是解析模板文件生成的
if (!vm.$options.render) {
vm.$options.render = createEmptyVNode
if (process.env.NoDE ENV !== 'production') {
/* istanbul ignore if */
if ((vm.$options.template && vm.$options.template.charAt(0) !== '#')
vm.$options.el || el) {
warn(
'You are using the runtime-only build of Vue where the template
+
'compiler is not available. Either pre-compile the templates int
+
'render functions, or use the compiler-included build.',
vm
)
} else {
// 没有获取到vue的模板文件
warn(
'Failed to mount component: template or render function not defi
ned.',
vm
)
}
}
}
//执行beforeMount钩子
callHook(vm, 'beforeMount')

let updateComponent
/* istanbul ignore if */
if (process.env.NoDE ENV !== production'&& config.performance && mark)
{
updateComponent = ( ) => {
const name = vm._name
const id = vm._uid
const startTag =`vue-perf-start:${id}
const endTag =`vue-perf-end:${id}
```

mark(startTag)
const vnode = vm.\_render()
mark(endTag)
measure(\`vue \${name} render\`, startTag, endTag)
mark(startTag)
vm.\_update(vnode, hydrating)
mark(endTag)
measure(\`vue \${name} patch\`, startTag, endTag)
}
} else {
//定义更新函数
updateComponent = () => {
//实际调用是在lifeCycleMixin中定义的\_update和renderMixin中定义的\_render
vm.\_update(vm.\_render(), hydrating)
}
}
// we set this to vm. watcher inside the watcher's constructor
// since the watcher's initial patch may call \$forceUpdate (e.g. inside
child
// component's mounted hook), which relies on vm.\_watcher being already
defined
//监听当前组件状态，当有数据变化时，更新组件
new Watcher(vm, updateComponent, noop, {
before () {
if (vm. isMounted && !vm. isDestroyed) {
// 数据更新引发的组件更新
callHook(vm, 'beforeUpdate')
}
}
}, true /\* isRenderWatcher \*/)
hydrating = false
// manually mounted instance, call mounted on self
// mounted is called for render-created child components in its inserte
d hook
if (vm.\$vnode == null) {
vm.\_isMounted = true
callHook(vm, 'mounted')
}
return vm
}

阅读上面代码，我们得到以下结论：

- 会触发 beforeCreate 钩子

定义 updateComponent 渲染页面视图的方法

监听组件数据，一旦发生变化，触发beforeUpdate生命钩子

updateComponent 方法主要执行在 vue 初始化时声明的 render，update 方法

### render、patch 与 DOM 更新

render的作用主要是生成 vnode

源码位置：src\core\instance\render.js

```js
// 定义vue 原型上的render方法
Vue.prototype.\_render = function (): VNode {
const vm: Component = this
//render函数来自于组件的option
const { render, \_parentVnode } = vm.\$options
if (\_parentVnode) {
vm.\$scopedSlots = normalizeScopedSlots(
\_parentVnode.data.scopedSlots,
vm.\$slots,
vm.\$scopedSlots
)
}
// set parent vnode. this allows render functions to have access
// to the data on the placeholder node.
vm.\$vnode = \_parentVnode
// render self
let vnode
try {
// There's no need to maintain a stack because all render fns are
```

called
22 // separately from one another. Nested component's render fns are
called
```js
// when parent component is patched.
currentRenderingInstance = vm
//调用render方法，自己的独特的render方法，传入createElement参数，生成vN
```
ode
```js
vnode = render.call(vm. renderProxy, vm.\$createElement)
} catch (e) {
handleError(e, vm,\`render\`)
return error render result,
// or previous vnode to prevent render error causing blank compone
```
nt
31 /\* istanbul ignore else \*/
```js
if (process.env.NODE\_ENV !== production'&& vm.\$options.renderErr
or) {
try {
vnode = vm.\$options.renderError.call(vm.\_renderProxy, vm.
```
\$createElement, e)
```js
} catch (e) {
handleError(e, vm,\`renderError\`)
vnode = vm.\_vnode
}
} else {
```

```bash
vnode = vm._vnode
}

} finally {

currentRenderingInstance = null

}

// if the returned array contains only a single node, allow it

if (Array.isArray(vnode) && vnode.length === 1) {

vnode =vnode[0]

}

// return empty vnode in case the render function errored out

if (!(vnode instanceof VNode)) {

if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode))
{

warn(

'Multiple root nodes returned from render function. Rende
r function ' +

'should return a single root node.',

vm

)

}

vnode = createEmptyVNode()

}

// set parent

vnode.parent = _parentVnode

return vnode

}
```

\_update 主要功能是调用 patch，将vnode 转换为真实 DOM，并且更新到页面中

源码位置：src\core\instance\lifecycle.js

```js
Vue.prototype.\_update = function (vnode: VNode, hydrating?: boolean) {
const vm: Component = this
const prevEl = vm.\$el
const prevVnode = vm.\_vnode
//设置当前激活的作用域
const restoreActiveInstance = setActiveInstance(vm)
vm.\_vnode = vnode
// Vue.prototype.\_\_patch\_\_ is injected in entry points
// based on the rendering backend used.
if (!prevVnode) {
// initial render
//执行具体的挂载逻辑
vm.\$el = vm.\_\_patch\_\_(vm.\$el, vnode, hydrating, false /\* removeOnly
```

\*/)
```js
} else {
// updates
```
16 vm.\$el = vm.\_\_patch\_\_(prevVnode, vnode)
```js
}
restoreActiveInstance()
// update\_vue\_\_reference
if (prevEl) {
```
21 prevEl.\_\_vue\_\_ = null
```js
}
if (vm.\$el) {
```
24 vm.\$el.\_\_vue\_\_ = vm
```js
}
// if parent is an HOC, update its \$el as well
if (vm.\$vnode && vm.\$parent && vm.\$vnode === vm.\$parent.\_vnode) {
```
28 vm.\$parent.\$el = vm.\$el
```js
}
// updated hook is called by the scheduler to ensure that children are
// updated in a parent's updated hook.
}
```

### 挂载流程总结

new Vue 的时候调用会调用\_init 方法

定义 \$set、\$get、\$delete、\$watch 等方法

定义\$on、\$off、\$emit、\$off等事件

定义\_update、\$forceUpdate、\$destroy生命周期

- 调用 \$mount 进行页面的挂载

挂载的时候主要是通过mountComponent 方法

定义updateComponent 更新函数

- 执行 render生成虚拟 DOM

\_update 将虚拟DOM生成真实 DOM结构，并且渲染到页面中

## 13. 你了解Vue的diff算法吗?

### Diff 的目标与比较策略

diff 算法是一种通过同层的树节点进行比较的高效算法

其有两个特点：

- 比较只会在同层级进行，不会跨层级比较

在diff比较的过程中，循环从两边向中间比较

diff 算法在很多场景下都有应用，在 vue 中，作用于虚拟 dom 渲染成真实 dom 的新旧 VNode 节点比较

**比较方式**

diff整体策略为：深度优先，同层比较

1. 比较只会在同层级进行，不会跨层级比较

2. 比较的过程中，循环从两边向中间收拢

下面举个 vue 通过 diff 算法更新的例子:

新旧 VNode 节点对应如下：

startIndex

endIndex

startIndex

endIndex

第一次循环后，发现旧节点D与新节点D相同，直接复用旧节点D作为 diff后的第一个真实节点，同时旧节点 endIndex移动到C，新节点的 startIndex 移动到了C

### 双端比较过程

**第一次**

endIndex

startIndex

endIndex

第二次循环后，同样是旧节点的末尾和新节点的开头(都是C)相同，同理，diff 后创建了C的真实节点插入到第一次创建的D 节点后面。同时旧节点的 endIndex 移动到了B，新节点的 startIndex 移动到了 E

**第二次**

old:

startIndex

endIndex

new:

startIndex
endIndex
diff:

第三次循环中，发现E没有找到，这时候只能直接创建新的真实节点E，插入到第二次创建的C节点之后。同时新节点的 startIndex移动到了A。I旧节点的 startIndex 和 endIndex都保持不动

**第三次**

endIndex

startIndex
endIndex

第四次循环中，发现了新旧节点的开头(都是A)相同，于是 diff后创建了A的真实节点，插入到前一次创建的E节点后面。同时旧节点的 startIndex移动到了B，新节点的startIndex 移动到了B

**第四次**

old:

startIndex endIndex

new:

startIndex
endIndex
diff:

第五次循环中，情形同第四次循环一样，因此 diff后创建了B 真实节点插入到前一次创建的 A节点后面。同时旧节点的 startIndex移动到了C，新节点的startIndex移动到了F

**第五次**

old:

endIndex

startIndex

new:

startIndex endIndex
diff:

新节点的 startIndex 已经大于 endIndex 了，需要创建 newStartIdx 和 newEndIdx 之间的所有节点，也就是节点F，直接创建F节点对应的真实节点放到B节点后面

因oldStartIndex>oldEndIndex，退出循环，补充new增加的节点F

### patch 与 patchVnode

当数据发生改变时，set 方法会调用 Dep.notify 通知所有订阅者 Watcher，订阅者就会调用 patch给真实的DOM打补丁，更新相应的视图

源码位置：src/core/vdom/patch.js

```js
function patch(oldVnode, vnode, hydrating, removeOnly) {
if(isUndef(vnode)) { // 没有新节点，直接执行destory钩子函数
if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
return
}
let isInitialPatch = false
const insertedVnodeQueue = []
if (isUndef(oldVnode)) {
isInitialPatch = true
createElm(vnode，insertedVnodeQueue)//没有旧节点，直接用新节点生成do
```

m元素
```js
} else {
const isRealElement = isDef(oldVnode.nodeType)
if (!isRealElement && sameVnode(oldVnode, vnode)) {
//判断旧节点和新节点自身一样，一致执行patchVnode
patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
} else {
//否则直接销毁及旧节点，根据新节点生成dom元素
if (isRealElement) {
if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR\_A
TTR)) {
oldVnode.removeAttribute(SSR\_ATTR)
hydrating = true
}
if (isTrue(hydrating)) {
if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
invokeInsertHook(vnode, insertedVnodeQueue, true)
return oldVnode
```
}
```js
}
oldVnode = emptyNodeAt(oldVnode)
}
return vnode.elm
}
}
}
```

patch函数前两个参数位为 oldVnode 和Vnode，分别代表新的节点和之前的旧节点，主要做了四个判断：

没有新节点，直接触发旧节点的 destory 钩子

没有旧节点，说明是页面刚开始初始化的时候，此时，根本不需要比较了，直接全是新建，所以只调用 createElm

- 旧节点和新节点自身一样，通过 sameVnode 判断节点是否一样，一样时，直接调用 patchVnode 去处理这两个节点

旧节点和新节点自身不一样，当两个节点不一样的时候，直接创建新节点，删除旧节点

下面主要讲的是patchVnode部分

```js
function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
//如果新旧节点一致，什么都不做
if (oldVnode === vnode) {
return
}

//让vnode.el引用到现在的真实dom，当el修改时，vnode.el会同步变化
const elm = vnode.elm = oldVnode.elm

//异步占位符
if (isTrue(oldVnode.isAsyncPlaceholder)) {
if (isDef(vnode.asyncFactory.resolved)) {
hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
} else {
vnode.isAsyncPlaceholder = true
}
return
}
//如果新旧都是静态节点，并且具有相同的key
//当vnode是克隆节点或是v-once指令控制的节点时，只需要把oldVnode.elm和oldVnod
e.child都复制到vnode上
//也不用再有其他操作
if (isTrue(vnode.isStatic) &&
isTrue(oldVnode.isStatic) &&
vnode.key === oldVnode.key&&
(isTrue(vnode.isCloned)l isTrue(vnode.isOnce))
) {
vnode.componentInstance = oldVnode.componentInstance
return
}

let i
constdata = vnode.data
if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
i(oldVnode, vnode)

const oldCh = oldVnode.children
const ch = vnode.children
if (isDef(data) && isPatchable(vnode)) {
for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnod
e)
if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
}
//如果vnode不是文本节点或者注释节点
```

```js
if (isUndef(vnode.text)) {
// 并且都有子节点
if (isDef(oldCh) && isDef(ch)) {
// 并且子节点不完全一致，则调用updateChildren
if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueu
e, removeOnly)
//如果只有新的vnode有子节点
} else if (isDef(ch)) {
if (isDef(oldVnode.text)) nodeOps.setTextContent(elm,')
//elm已经引用了老的dom节点，在老的dom节点上添加子节点
```
addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
// 如果新vnode没有子节点，而vnode有子节点，直接删除老的oldCh
} else if (isDef(oldCh)) {
removeVnodes(elm, oldCh, 0, oldCh.length - 1)
// 如果老节点是文本节点
} else if (isDef(oldVnode.text)) {
nodeOps.setTextContent(elm,'')
}
//如果新vnode和老vnode是文本节点或注释节点
//但是vnode.text != oldVnode.text时，只需要更新vnode.elm的文本内容就可以
} else if (oldVnode.text !== vnode.text) {
nodeOps.setTextContent(elm, vnode.text)
}
if (isDef(data)) {
if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnod
e)
}
}

**patchVnode主要做了几个判断**

- 新节点是否是文本节点，如果是，则直接更新 dom的文本内容为新节点的文本内容

- 新节点和旧节点如果都有子节点，则处理比较更新子节点

只有新节点有子节点，旧节点没有，那么不用比较了，所有节点都是全新的，所以直接全部新建就好了，新建是指创建出所有新DOM，并且添加进父节点

- 只有旧节点有子节点而新节点没有，说明更新后的页面，旧节点全部都不见了，那么要做的，就是把所有的旧节点删除，也就是直接把DOM删除

子节点不完全一致，则调用 updateChildren

```js
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, rem
oveOnly) {
let oldStartIdx = 0 // 旧头索引
let newStartIdx = 0 // 新头索引
let oldEndIdx = oldCh.length - 1 // |日尾索引
let newEndIdx = newCh.length - 1 // 新尾索引
let oldStartVnode = oldCh[0] // oldVnode的第—个child
let oldEndVnode = oldCh[oldEndIdx] // oldVnode的最后—个child
let newStartVnode = newCh[0] // newVnode的第—个child
let newEndVnode = newCh[newEndIdx] // newVnode的最后—个child
let oldKeyToIdx, idxInOld, vnodeToMove, refElm

// removeOnly is a special flag used only by <transition-group>
// to ensure removed elements stay in correct relative positions
// during leaving transitions
const canMove = !removeOnly

//如果oldStartVnode和oldEndVnode重合，并且新的也都重合了，证明diff完了，循
环结束
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
// 如果oldVnode的第一个child不存在
if (isUndef(oldStartVnode)) {
// oldStart索引右移
oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left

// 如果oldVnode的最后一个child不存在
} else if (isUndef(oldEndVnode)) {
// oldEnd索引|左移
oldEndVnode = oldCh[--oldEndIdx]

//oldStartVnode和newStartVnode是同—个节点
else if (sameVnode(oldStartVnode, newStartVnode)) {
// patch oldStartVnode和newStartVnode,索引|左移，继续循环
patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
oldStartVnode = oldCh[++oldStartIdx]
newStartVnode = newCh[++newStartIdx]

// oldEndVnode和newEndVnode是同一个节点
} else if (sameVnode(oldEndVnode, newEndVnode)) {
// patch oldEndVnode和newEndVnode，索引|右移，继续循环
patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
oldEndVnode = oldCh[--oldEndIdx]
newEndVnode = newCh[--newEndIdx]

// oldStartVnode和newEndVnode是同一个节点
```

```js
} else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved
right

// patch oldStartVnode和newEndVnode

patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)

//如果removeOnly是false，则将oldStartVnode.eml移动到oldEndVnode.elm
之后

canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nod
eOps.nextSibling(oldEndVnode.elm))

// oldStart索引|右移，newEnd索引|左移

oldStartVnode = oldCh[++oldStartIdx]

newEndVnode = newCh[--newEndIdx]

// 如果oldEndVnode和newStartVnode是同一个节点

} else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved
left

// patch oldEndVnode和newStartVnode

patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)

//如果removeOnly是false，则将oldEndVnode.elm移动到oldStartVnode.elm
之前

canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldSt
artVnode.elm)

// oldEnd索引|左移，newStart索引右移

oldEndVnode = oldCh[--oldEndIdx]

newStartVnode =newCh[++newStartIdx]

// 如果都不匹配

} else {

if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh,
oldStartIdx, oldEndIdx)

//尝试在oldChildren中寻找和newStartVnode的具有相同的key的Vnode

idxInOld =isDef(newStartVnode.key)

?oldKeyToIdx[newStartVnode.key]

: findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)

如果未找到，说明newStartVnode是一个新的节点

if (isUndef(idxInOld)) { // New element

// 创建一个新Vnode

createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStar
tVnode.elm)

//如果找到了和newStartVnodej具有相同的key的Vnode，叫vnodeToMove

} else {

vnodeToMove = oldCh[idxInOld]

/* istanbul ignore if */

if (process.env.NODE_ENV !== 'production' && !vnodeToMove) {

warn(

```

'It seems there are duplicate keys that is causing an updat
e error. ' +
'Make sure each v-for item has a unique key.'
)
}
//比较两个具有相同的key的新节点是否是同一个节点
//不设key，newCh和oldCh只会进行头尾两端的相互比较，设key后，除了头尾两端
的比较外，还会从用key生成的对象oldKeyToIdx中查找匹配的节点，所以为节点设置key可以更
90-
高效的利用dom。
if (sameVnode(vnodeToMove, newStartVnode)) {
// patch vnodeToMove和newStartVnode
patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
//清除
oldCh[idxInOld] = undefined
//如果removeOnly是false，则将找到的和newStartVnodej具有相同的key
的Vnode，叫vnodeToMove.elm
// 移动到oldStartVnode.elm之前
canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, o
ldStartVnode.elm)
100-
//如果key相同，但是节点不相同，则创建一个新的节点
} else {
// same key but different element. treat as new element
createElm(newStartVnode, insertedVnodeQueue, parentElm, oldSt
artVnode.elm)
}
}
//右移
newStartVnode = newCh[++newStartIdx]
}
}

### updateChildren 的分支与总结

**while 循环主要处理了以下五种情景**

- 当新老 VNode 节点的 start 相同时，直接 patchVnode，同时新老 VNode 节点的开始索引都加1

- 当新老VNode 节点的 end相同时，同样直接 patchVnode，同时新老 VNode 节点的结束索引都减1

· 当老 VNode 节点的 start 和新 VNode 节点的 end 相同时，这时候在 patchVnode后，还需要将当前真实 dom 节点移动到 oldEndVnode 的后面，同时老 VNode 节点开始索引加 1，新 VNode 节点的结束索引减1

· 当老 VNode 节点的 end 和新 VNode 节点的 start 相同时，这时候在 patchVnode后，还需要将当前真实 dom 节点移动到 oldStartVnode 的前面，同时老 VNode 节点结束

索引减 1，新 VNode 节点的开始索引加1

- 如果都不满足以上四种情形，那说明没有相同的节点可以复用，则会分为以下两种情况：

- 从旧的 VNode 为 key 值，对应 index 序列为 value 值的哈希表中找到与 newStartVnode 一致 key 的旧的 VNode 节点，再进行 patchVnode，同时将这个真实 dom 移动到 oldStartVnode 对应的真实 dom 的前面

调用 createElm 创建一个新的 dom 节点放到当前 newStartIdx 的位置

**小结**

- 当数据发生改变时，订阅者watcher 就会调用 patch 给真实的 DOM 打补丁

通过 isSameVnode 进行判断，相同则调用 patchVnode 方法

patchVnode做了以下操作：

找到对应的真实 dom，称为 el

如果都有都有文本节点且不相等，将 el文本节点设置为Vnode的文本节点

如果oldVnode有子节点而 VNode没有，则删除 el子节点

如果oldVnode 没有子节点而VNode 有，则将VNode的子节点真实化后添加到 el

如果两者都有子节点，则执行updateChildren函数比较子节点

updateChildren主要做了以下操作：

设置新旧VNode的头尾指针

新I旧头尾指针进行比较，循环向中间靠拢，根据情况调用patchVnode进行 patch重复流程、调用 createElem 创建一个新节点，从哈希表寻找 key 一致的 VNode 节点再分情况操作

## 14. Vue中组件和插件有什么区别?

### 组件与插件的职责

回顾以前对组件的定义：

组件就是把图形、非图形的各种逻辑均抽象为一个统一的概念(组件)来实现开发的模式，在Vue中每一个vue文件都可以视为一个组件

组件的优势

- 降低整个系统的耦合度，在保持接口不变的情况下，我们可以替换不同的组件快速完成需求，例如输入框，可以替换为日历、时间、范围等组件作具体的实现

- 调试方便，由于整个系统是通过组件组合起来的，在出现问题的时候，可以用排除法直接移除组件，或者根据报错的组件快速定位问题，之所以能够快速定位，是因为每个组件之间低耦合，职责单一，所以逻辑会比分析整个系统要简单

- 提高可维护性，由于每个组件的职责单一，并且组件在系统中是被复用的，所以对代码进行优化可获得系统的整体升级

**插件是什么**

插件通常用来为Vue添加全局功能。插件的功能范围没有严格的限制一般有下面几种：

添加全局方法或者属性。如：vue-custom-element

- 添加全局资源：指令/过滤器/过渡等。如 vue-touch

- 通过全局混入来添加一些组件选项。如 vue-router

- 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。

- 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 vue-router

两者的区别主要表现在以下几个方面：

- 编写形式

- 注册形式

- 使用场景

### 编写方式

**编写组件**

编写一个组件，可以有很多方式，我们最常见的就是vue单文件的这种格式，每一个.vue文件我们都可以看成是一个组件

vue 文件标准格式

```vue
Vue
<template>
</template>
<script>
export default{

}
</script>
<style>
</style>
```

我们还可以通过template属性来编写一个组件，如果组件内容多，我们可以在外部定义template组件内容，如果组件内容并不多，我们可直接写在template属性上

```js
<templateid="testComponent"> //组件显示的内容
<div>component!</div>
</template>

Vue.component('componentA',{
    template:'#testComponent'
    template：`<div>component</div>//组件内容少可以通过这种形式
  })
```

**编写插件**

vue 插件的实现应该暴露一个 install 方法。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象

```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
      bind (el, binding, vnode, oldVnode) {
        // 逻辑...
      }

    })

  // 3. 注入组件选项
  Vue.mixin({
      created: function () {
        //逻辑...
      }

    })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    //逻辑...
  }
}
```

### 注册方式

**组件注册**

vue组件注册主要分为全局注册与局部注册

全局注册通过Vue.component 方法，第一个参数为组件的名称，第二个参数为传入的配置项

```js
Vue.component('my-component-name', { /* ... */ })
```

局部注册只需在用到的地方通过components属性注册一个组件

```js
const component1 = {...} // 定义—个组件

export default {
  components:{
    component1// 局部注册
  }
}
```

**插件注册**

插件的注册通过Vue.use()的方式进行注册(安装)，第一个参数为插件的名字，第二个参数是可选择的配置项

```js
Vue.use(插件名字,{ /\* ... \*/} )
```

注册插件时需要注意：

注册插件的时候，需要在调用new Vue()启动应用之前完成

ue.use会自动阻止多次注册相同插件，只会注册一次

### 组件与插件的适用场景

具体的其实在插件是什么章节已经表述了，这里在总结一下

组件（Component）是用来构成你的 App 的业务模块，它的目标是App.vue

插件（Plugin）是用来增强你的技术栈的功能模块，它的目标是Vue 本身

简单来说，插件就是指对Vue的功能的增强或补充

## 15. Vue项目中你是如何解决跨域的呢?

### 跨域与同源策略

跨域本质是浏览器基于同源策略的一种安全手段

同源策略(Sameoriginpolicy)，是一种约定，它是浏览器最核心也最基本的安全功能

所谓同源(即指在同一个域)具有以下三个相同点

协议相同(protocol)

- 主机相同(host)

- 端口相同（port)

反之非同源请求，也就是协议、端口、主机其中一项不相同的时候，这时候就会产生跨域

一定要注意跨域是浏览器的限制，你用抓包工具抓取接口数据，是可以看到接口已经把数据返回回来了，只是浏览器的限制，你获取不到数据。用postman请求接口能够请求到数据。这些再次印证了跨域是浏览器的限制。

### CORS 与代理方案

解决跨域的方法有很多，下面列举了三种：

- JSONP

- CORS

- Proxy

而在vue项目中，我们主要针对CORS 或Proxy这两种方案进行展开

**CORS**

CORS (Cross-Origin Resource Sharing，跨域资源共享)是一个系统，它由一系列传输的HTTP头组成，这些HTTP头决定浏览器是否阻止前端JavaScript代码获取跨域请求的响应

CORS 实现起来非常方便，只需要增加一些HTTP 头，让服务器能声明允许的访问来源只要后端实现了CORS，就实现了跨域

以 koa 框架举例

添加中间件，直接设置Access-Control-Allow-Origin响应头

```js
app.use(async (ctx, next)=> {
ctx.set('Access-Control-Allow-Origin','*');
ctx.set('Access-Control-Allow-Headers','Content-Type, Content-Length, A
uthorization, Accept, X-Requested-With , yourHeaderFeild');
ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTION
S');
if (ctx.method == '0PTIONS') {
ctx.body = 200;
else
await next();
}
})
```

ps:Access-Control-Allow-0rigin设置为\*其实意义不大，可以说是形同虚设，实际应用中，上线前我们会将Access-Control-Allow-0rigin 值设为我们目标host

### 开发与生产环境的代理配置

```js
axios.defaults.baseURL = '/api'
```

代理(Proxy)也称网络代理，是一种特殊的网络服务，允许一个(一般为客户端)通过这个服务与另一个网络终端（一般为服务器）进行非直接的连接。一些网关、路由器等网络设备具备网络代理功能。一般认为代理服务有利于保障网络终端的隐私或安全，防止攻击

**方案一**

如果是通过vue-cli脚手架工具搭建项目，我们可以通过webpack为我们起一个本地服务器作为请求的代理对象

通过该服务器转发请求至目标服务器，得到结果再转发给前端，但是最终发布上线时如果web应用和接口服务器不在一起仍会跨域

在vue.config.js文件，新增以下代码

```js
amodule.exports = {
  devServer: {
    host: '127.0.0.1',
    port: 8084,
    open：true,// vue项目启动时自动打开浏览器
    proxy: {
      '/api'：{ ///api'是代理标识，用于告诉node，url前面是/api的就是使用
        代理的
        target："http://xxx.xxx.xx.xx:8080"，//目标地址，—般是指后台
        服务器地址
        changeOrigin： true，//是否跨域
        pathRewrite： { // pathRewrite 的作用是把实际Request Url中的'/
          api'用""代替
          '^/api': ""
        }
      }
    }
  }
}
```

通过 axios 发送请求中，配置请求的根路径

**方案二**

此外，还可通过服务端实现代理请求转发

以express 框架为例

```js
var express = require('express');
const proxy = require('http-proxy-middleware')
const app = express()
app.use(express.static(__dirname + '/'))
app.use('/api', proxy({ target: 'http://localhost:4000', changeOrigin: fals
      e
    }));
module.exports = app
```

**方案三**

通过配置 nginx 实现代理

```js
server {
  listen 80;
  # server\_name www.josephxia.com;
  location / {
    root/var/www/html;
    index index.html index.htm;
    try\_files \$uri \$uri/ /index.html;
  }
  location /api {
    proxy\_pass http://127.0.0.1:3000;
    proxy\_redirect off;
    proxy\_set\_header Host \$host;
    proxy\_set\_header X-Real-IP \$remote\_addr;
    proxy\_set\_header X-Forwarded-For \$proxy\_add\_x\_forwarded\_for;
  }
}
```

## 16. 有写过自定义指令吗？自定义指令的应用场景有哪些？

### 自定义指令的能力

开始之前我们先学习一下指令系统这个词

指令系统是计算机硬件的语言系统，也叫机器语言，它是系统程序员看到的计算机的主要属性。因此指令系统表征了计算机的基本功能决定了机器所要求的能力

在vue中提供了一套为数据驱动视图更为方便的操作，这些操作被称为指令系统

我们看到的v-开头的行内属性，都是指令，不同的指令可以完成或实现不同的功能

除了核心功能默认内置的指令（ v-model 和 v-show)，Vue 也允许注册自定义指令

指令使用的几种方式：

```js
//会实例化一个指令，但这个指令没有参数
\`V-Xxx
// -- 将值传到指令中
\`v-xxx="value"
//--将字符串传入到指令中，如\`v-html="'<p>内容</p>'"
\`v-xxx="'string'"
//--传参数（\`arg\`），如\`v-bind:class="className"
\`v-xxx:arg="value"
// -- 使用修饰符（\`modifier\`）
\`v-xxx:arg.modifier="value"
```

### 注册方式与钩子

注册一个自定义指令有全局注册与局部注册

全局注册主要是通过Vue.directive 方法进行注册

ue.directive 第一个参数是指令的名字(不需要写上 v-前缀)，第二个参数可以是对象数据，也可以是一个指令函数

```js
//注册一个全局自定义指令`v-focus
Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时....
    inserted:function (el) {
      //聚焦元素
      el.focus() // 页面加载完成之后自动让输入框获取到焦点的小功能
    }
  })
```

局部注册通过在组件options 选项中设置 directive 属性

```js
<input v-focus />
```

```js
directives: {
  focus: {
    //指令的定义
    inserted: function (el) {
      el.focus()//页面加载完成之后自动让输入框获取到焦点的小功能
    }
  }
}
```

然后你可以在模板中任何元素上使用新的v-focus property，如下:

自定义指令也像组件那样存在钩子函数：

bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置

inserted：被绑定元素插入父节点时调用(仅保证父节点存在，但不一定已被插入文档中)

update：所在组件的 VNode 更新时调用，但是可能发生在其子VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新

componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用

unbind：只调用一次，指令与元素解绑时调用

所有的钩子函数的参数都有以下：

el：指令所绑定的元素，可以用来直接操作 DOM

binding：一个对象，包含以下 property：

- name：指令名，不包括 v- 前缀。

0 value：指令的绑定值，例如：v-my-directive="1 + 1"中，绑定值为 2。

O oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。

O expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1"中，表达式为"1 + 1"。

arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为"foo"。

O modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true， bar: true }

vnode：Vue 编译生成的虚拟节点

oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用

除了el之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 dataset 来进行

举个例子：

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
<script>
  Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) //"white"
  console.log(binding.value.text)//"hello!"
  })
</script>
```

### 常见应用场景

使用自定义指令可以满足我们日常一些场景，这里给出几个自定义指令的案例：

- 表单防止重复提交

- 图片懒加载

- 一键 Copy的功能

**表单防止重复提交**

表单防止重复提交这种情况设置一个v-throttle自定义指令来实现

举个例子：

```js
// 1.设置v-throttle自定义指令
Vue.directive('throttle', {
    bind: (el, binding) => {
      let throttleTime = binding.value; // 节流时间
      if（!throttleTime）{ // 用户若不设置节流时间，则默认2s
        throttleTime = 2000;
      }
      let cbFun;
      el.addEventListener('click', event => {
          if(!cbFun) { // 第一次执行
            cbFun = setTimeout(() => {
                cbFun = null;
              }, throttleTime);
          } else {
            event && event.stopImmediatePropagation();
          }
        }, true);
    },
  });
// 2.为button标签设置v-throttle自定义指令
<button @click="sayHello" v-throttle>提交</button>
```

**图片懒加载**

设置一个 v-lazy自定义指令完成图片懒加载

```js
const LazyLoad = {
// install方法
install(Vue,options){
// 代替图片的loading图
let defaultSrc = options.default;
Vue.directive('lazy',{
bind(el,binding){
LazyLoad.init(el,binding.value,defaultSrc);
}，
inserted(el){
//兼容处理
if('IntersectionObserver' in window){
LazyLoad.observe(el);
}else{
LazyLoad.listenerScroll(el);
}

},
})
},
//初始化
init(el,val,def){
// data-src 储存真实src
el.setAttribute('data-src',val);
// 设置src为loading图
el.setAttribute('src',def);
},
//利用IntersectionObserver监听el
observe(el){
let io = new IntersectionObserver(entries => {
let realSrc = el.dataset.src;
if(entries[0].isIntersecting){
if(realSrc){
el.src = realSrc;
el.removeAttribute('data-src');
}
}
});
io.observe(el);
},
//监听scroll事件
listenerScroll(el){
let handler = LazyLoad.throttle(LazyLoad.load,300);
LazyLoad.load(el);
window.addEventListener('scroll',() => {
```

```js
handler(el);
});

},
// 加载真实图片

load(el){

let windowHeight = document.documentElement.clientHeight

let elTop = el.getBoundingClientRect().top;

let elBtm = el.getBoundingClientRect().bottom;

let realSrc = el.dataset.src;

if(elTop - windowHeight<0&&elBtm > 0){

if(realSrc){

el.src = realSrc;

el.removeAttribute('data-src');

}

},
//节流

throttle(fn,delay){

let timer;

let prevTime;

return function(...args){

let currTime = Date.now();

let context = this;

if(!prevTime) prevTime = currTime;

clearTimeout(timer);

if(currTime - prevTime > delay){

prevTime = currTime;

fn.apply(context,args);

clearTimeout(timer);

return;

prevTime = Date.now();
timer = null;

fn.apply(context,args);

},delay);

}

}

export default LazyLoad;
```

**一键 Copy的功能**

```js
import { Message } from 'ant-design-vue';

const vCopy = { //
/*
bind钩子函数，第一次绑定时调用，可以在这里做初始化设置
el：作用的 dom 对象
value：传给指令的值，也就是我们要copy的值
*/
bind(el, { value }) {
el.$value = value;// 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里
还会用到
el.handler = () => {
if (!el.$value) {
//值为空的时候，给出提示，我这里的提示是用的ant-design-vue的提示，你们随意
Message.warning('无复制内容');
return;
}
// 动态创建 textarea 标签
const textarea = document.createElement('textarea');
//将该textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移
出可视区域
textarea.readonly = 'readonly';
textarea.style.position = 'absolute';
textarea.style.left = '-9999px';
// 将要 copy 的值赋给textarea 标签的 value 属性
textarea.value = el.$value;
// 将textarea 插入到 body 中
document.body.appendChild(textarea);
// 选中值并复制
textarea.select();
// textarea.setSelectionRange(0, textarea.value.length);
const result = document.execCommand('Copy');
if (result) {
Message.success('复制成功');

document.body.removeChild(textarea);
};
//绑定点击事件，就是所谓的一键copy啦
el.addEventListener('click', el.handler);
},
//当传进来的值更新的时候触发
componentUpdated(el, { value }) {
el.$value = value;
},
//指令与元素解绑的时候，移除事件绑定
```

```js
unbind(el) {
el.removeEventListener('click', el.handler);

},

};

export default vCopy;
```

关于自定义指令还有很多应用场景，如：拖拽指令、页面水印、权限校验等等应用场景

## 17. Vue中的过滤器了解吗？过滤器的应用场景有哪些?

### 过滤器的作用

过滤器（filter）是输送介质管道上不可缺少的一种装置

大白话，就是把一些不必要的东西过滤掉

过滤器实质不改变原始数据，只是对数据进行加工处理后返回过滤后的数据再进行调用处理，我们也可以理解其为一个纯函数

ue 允许你自定义过滤器，可被用于一些常见的文本格式化

ps: Vue3 中已废弃filter

### 定义与使用

vue 中的过滤器可以用在两个地方：双花括号插值和 v-bind 表达式，过滤器应该被添加在 JavaScript表达式的尾部，由“管道”符号指示：

```text
<!—- 在双花括号中 -->
{{ message |capitalize }}

<!-- 在`v-bind中 -->
<div v-bind:id="rawId | formatId"></div>
```

**定义filter**

在组件的选项中定义本地的过滤器

```js
filters: {
  capitalize: function (value) {
    if (!value) return
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

定义全局过滤器：

```js
Vue.filter('capitalize', function (value) {
    if (!value) return
    value =value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  })

new Vue({
    //..
  })
```

注意：当全局过滤器和局部过滤器重名时，会采用局部过滤器

过滤器函数总接收表达式的值（之前的操作链的结果）作为第一个参数。在上述例子中，capitalize过滤器函数将会收到 message 的值作为第一个参数

过滤器可以串联：

1¬{{ message | filterA | filterB }}

在这个例子中，filterA被定义为接收单个参数的过滤器函数，表达式 message 的值将作为参数传入到函数中。然后继续调用同样被定义为接收单个参数的过滤器函数 filterB，将 filterA的结果传递到 filterB 中。

过滤器是JavaScript函数，因此可以接收参数：

```text
{{ message | filterA('arg1', arg2) }}
```

这里，filterA 被定义为接收三个参数的过滤器函数。

其中 message 的值作为第一个参数，普通字符串 'arg1' 作为第二个参数，表达式 arg2 的值作为第三个参数

举个例子：

```html
<div id="app">
  <p>{{ msg |msgFormat('疯狂','--')}}</p>
</div>

<script>
  // 定义一个 Vue 全局的过滤器，名字叫做 msgFormat
  Vue.filter('msgFormat', function(msg, arg, arg2) {
  / 字符串的 replace 方法，第一个参数，除了可写一个字符串之外，还可以定义一
  个正则
  return msg.replace(/单纯/g, arg+arg2)
  })
</script>
```

**小结**

部过滤器优先于全局过滤器被调用

- 一个表达式可以使用多个过滤器。过滤器之间需要用管道符“”隔开。其执行顺序从左往右

### 文本格式化场景

平时开发中，需要用到过滤器的地方有很多，比如单位转换、数字打点、文本格式化、时间格式化之类的等

比如我们要实现将30000=>30,000，这时候我们就需要使用过滤器

```js
Vue.filter('toThousandFilter', function (value) {
    if (!value) return '
    value = value.toString()
    return .replace(str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)
      (?=(?:\d{3})+$)/g, '$1,')
  })
```

### 编译与运行原理

使用过滤器

```text
{{ message | capitalize }}
```

在模板编译阶段过滤器表达式将会被编译为过滤器函数，主要是用过parseFilters，我们放到最后讲

```js
\_s(\_f('filterFormat')(message))
```

首先分析一下f：

f函数全名是：resolveFilter，这个函数的作用是从this.\$options.filters中找出注册的过滤器并返回

```js
//变为
this.$options.filters['filterFormat'](message) // message为参数
```

关于resolveFilter

```js
import { identity,resolveAsset } from 'core/util/index'
export function resolveFilter(id){
  return resolveAsset(this.\$options,'filters',id,true) || identity
}
```

内部直接调用resolveAsset，将option对象，类型，过滤器 id，以及一个触发警告的标志作为参数传递，如果找到，则返回过滤器：

resolveAsset的代码如下：

```js
export function resolveAsset(options,type,id,warnMissing){ //因为我们找的是
过滤器，所以在resolveFilter函数中调用时type的值直接给的filters'，实际这个函数
还可以拿到其他很多东西
if(typeof id!== 'string'){ // 判断传递的过滤器id 是不是字符串，不是则直接返
回
return
}
const assets = options[type] // 将我们注册的所有过滤器保存在变量中
//接下来的逻辑便是判断id是否在assets中存在，即进行匹配
if(hasOwn(assets,id)) return assets[id] //如找到，直接返回过滤器
//没有找到，代码继续执行
const camelizedId = camelize(id) // 万—你是驼峰的呢
if(hasOwn(assets,camelizedId)) return assets[camelizedId]
//没找到，继续执行
const PascalCaseId =capitalize(camelizedId) // 万一你是首字母大写的驼峰呢
if(hasOwn(assets,PascalCaseId)) return assets[PascalCaseId]
//如果还是没找到，则检查原型链(即访问属性)
const result = assets[id] || assets[camelizedId] || assets[PascalCaseI
d]
//如果依然没找到，则在非生产环境的控制台打印警告
if(process.env.NODE_ENV !== 'production'&& warnMissing && !result){
warn('Failed to resolve ' + type.slice(0,-1) + ': ' + id, options)

//无论是否找到，都返回查找结果
return result
}
```

下面再来分析一下 \_s ：

\_s 函数的全称是 toString ,过滤器处理后的结果会当作参数传递给 toString 函数，最终 toString函数执行后的结果会保存到Vnode中的text属性中，渲染到视图中

```js
function toString(value){
return value == null
?11
: typeof value === 'object'
? JSON.stringify(value,null,2)// JSON.stringify()第三个参数可用来控制字符
```

串里面的间距
6 : String(value)
7 }

最后，在分析下parseFilters，在模板编译阶段使用该函数阶段将模板过滤器解析为过滤器函数调用表达式

```js
function parseFilters (filter) {
let filters = filter.split('|')
let expression = filters.shift().trim() // shift()删除数组第—个元素并将其
返回，该方法会更改原数组
let i
if (filters) {
for(i = 0;i < filters.length;i++){
experssion=warpFilter(expression,filters[i].trim()) // 这里传
进去的expression实际上是管道符号前面的字符串，即过滤器的第一个参数
}
}
return expression
}
// warpFilter函数实现
function warpFilter(exp,filter){
//首先判断过滤器是否有其他参数
const i = filter.indexof('(')
if(i<0){ // 不含其他参数，直接进行过滤器表达式字符串的拼接
return_f("${filter}")(${exp})
}else{
const name = filter.slice(0,i) // 过滤器名称
const args = filter.slice(i+1) // 参数，但还多了 ')'
return_f('${name}')(${exp},${args}// 注意这—步少给了—个')'
}
}
```

**原理小结**

- 在编译阶段通过 parseFilters 将过滤器编译成函数调用(串联过滤器则是一个嵌套的函数调用，前一个过滤器执行的结果是后一个过滤器函数的参数)

编译后通过调用resolveFilter 函数找到对应过滤器并返回结果

- 执行结果作为参数传递给 toString 函数，而 toString 执行后，其结果会保存在 Vnode的text 属性中，渲染到视图

## 18. 说说你对slot的理解？slot使用场景有哪些？

### 插槽的作用与场景

在HTML中 slot 元素，作为 Web Components 技术套件的一部分，是Web组件内的一个占位符该占位符可以在后期使用自己的标记语言填充

举个栗子

```html
<template id="element-details-template">
  <slot name="element-name">Slot template</slot>
</template>
<element-details>
  <span slot="element-name">1</span>
</element-details>
<element-details>
  <span slot="element-name">2</span>
</element-details>
```

template不会展示到页面中，需要用先获取它的引用，然后添加到DOM中，

```ts
customElements.define('element-details',
  class extends HTMLElement {
    constructor() {
      super();
      const template = document
      .getElementById('element-details-template')
      .content;
      const shadowRoot = this.attachShadow({mode: 'open'})
      .appendChild(template.cloneNode(true));
    }
  })
```

**在Vue中的概念也是如此**

Slot 艺名插槽，花名“占坑”，我们可以理解为solt在组件模板中占好了位置，当使用该组件标签时候，组件标签里面的内容就会自动填坑(替换组件模板中slot位置)，作为承载分发内容的出口可以将其类比为插卡式的FC游戏机，游戏机暴露卡槽(插槽）让用户插入不同的游戏磁条(自定义内容)

**适用场景**

通过插槽可以让用户可以拓展组件，去更好地复用组件和对其做定制化处理

如果父组件在使用到一个复用组件的时候，获取这个组件在不同的地方有少量的更改，如果去重写组件是一件不明智的事情

通过slot插槽向组件内部指定位置传递内容，完成这个复用组件在不同场景的应用

比如布局组件、表格列、下拉选、弹框显示内容等

### 三类插槽

slot可以分来以下三种：

· 默认插槽

- 具名插槽

- 作用域插槽

```html
<Child>
  <div>默认插槽</div>
</Child>
```

**默认插槽**

子组件用 <slot>标签来确定渲染的位置，标签里面可以放DOM结构，当父组件使用的时候没有往插槽传入内容，标签内DOM结构就会显示在页面

父组件在使用的时候，直接在子组件的标签内写入内容即可

子组件 Child.vue

```html
<template>
  <slot>
    <p>插槽后备的内容</p>
  </slot>
</template>
```

父组件

**具名插槽**

子组件用name属性来表示插槽的名字，不传为默认插槽

父组件中在使用时在默认插槽的基础上加上 slot 属性，值为子组件插槽name属性值

子组件 Child.vue

```vue
<template>
<slot>插槽后备的内容</slot>
<slot name="content">插槽后备的内容</slot>
</template>
```

父组件

```vue
<child>
<template v-slot:default>具名插槽</template>
<!--具名插槽用插槽名做参数-->
<template v-slot:content>内容...</template>
</child>
```

**作用域插槽**

子组件在作用域上绑定属性来将子组件的信息传给父组件使用，这些属性会被挂在父组件v-slot接受的对象上

父组件中在使用时通过v-slot： (简写：#)获取子组件的信息，在内容中使用

子组件Child.vue

```vue
<template>
<slot name="footer"testProps="子组件的值">
<h3>没传footer插槽</h3>
</slot>
</template>
```

**父组件**

```vue
<child>
<!--把v-slot的值指定为作用域上下文对象-->
<template v-slot:default="slotProps">
来自子组件数据：{{slotProps.testProps}}
</template>
<template #default="slotProps">
来自子组件数据：{{slotProps.testProps}}
</template>
</child>
```

**小结**

v-slot属性只能在 `<template>`上使用，但在只有默认插槽时可以在组件标签上使用

默认插槽名为default，可以省略default直接写v-slot

渲染插槽函数renderSlot(做了简化)

缩写为#时不能不写参数，写成 #default

- 可以通过解构获取v-slot={user}，还可以重命名 v-slot="{user：newName}"和定义默认值v-slot="{user = '默认值'}"

### 编译与渲染原理

slot本质上是返回VNode的函数，一般情况下，Vue中的组件要渲染到页面上需要经过 template -> render function -> VNode -> DOM 过程，这里看看 slot 如何实现:

编写一个buttonCounter组件，使用匿名插槽

```js
Vue.component('button-counter', {
    template：'<div> <slot>我是默认内容</slot></div>
  })
```

使用该组件

```js
new Vue({
el: '#app',
template：'<button-counter><span>我是slot传入内容</span></button-counter
```

>',
components:{buttonCounter}
5 })

获取 buttonCounter 组件渲染函数

```js
(functionanonymous(
  ) {
    with(this){return \_c('div',[\_t("default",[\_v("我是默认内容")])],2)}
  })
```

\_v表示穿件普通文本节点，\_t表示渲染插槽的函数

```js
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  //得到渲染插槽内容的函数
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  //如果存在插槽渲染函数，则执行插槽渲染函数，生成nodes节点返回
  // 否则使用默认值
  nodes = scopedSlotFn(props) | fallback;
  return nodes;
}
```

name属性表示定义插槽的名字，默认值为default，fallback表示子组件中的 slot节点的默认值

关于this.\$scopredSlots是什么，我们可以先看看vm.slot

```js
function initRender (vm) {

  vm.$slots = resolveSlots(options._renderChildren, renderContext);

}
```

resolveSlots函数会对children节点做归类和过滤处理，返回slots

```js
function resolveSlots (
children,
context
){
if (!children Il !children.length) {
return {}
}
var slots = {};
for (var i = 0, l = children.length; i < l; i++) {
var child = children[i];
var data = child.data;
// remove slot attribute if the node is resolved as a Vue slot node
if (data && data.attrs && data.attrs.slot) {
delete data.attrs.slot;
}
// named slots should only be respected if the vnode was rendered i
n the
// same context.
if ((child.context === context | child.fnContext === context) &&
data && data.slot != null
){
// 如果slot存在(slot="header")则拿对应的值作为key
var name = data.slot;
var slot = (slots[name] || (slots[name] = []));
// 如果是tempalte元素则把template的children添加进数组中，这也就是为什么
你写的template标签并不会渲染成另一个标签到页面
if (child.tag === 'template') {
slot.push.apply(slot, child.children || []);
} else {
slot.push(child);
}
} else {
//如果没有就默认是default
(slots.default ||(slots.default = [])).push(child);

// ignore slots that contains only whitespace
for (var name$1 in slots) {
if (slots[name$1].every(isWhitespace)) {
delete slots[name$1];
}
}
return slots
}
```

\_render 渲染函数通过 normalizeScopedSlots 得到 vm.\$scopedSlots

```js
vm.$scopedSlots = normalizeScopedSlots(
  _parentVnode.data.scopedSlots,
  vm.$slots,
  vm.$scopedSlots
);
```

作用域插槽中父组件能够得到子组件的值是因为在 renderSlot的时候执行会传入 props，也就是上述\_t第三个参数，父组件则能够得到子组件传递过来的值

## 19. 什么是虚拟DOM？如何实现一个虚拟DOM？说说你的思路

### 虚拟 DOM 的结构

虚拟 DOM（Virtual DOM）这个概念相信大家都不陌生，从 React 到 Vue，虚拟 DOM为这两个框架都带来了跨平台的能力（React-Native 和 Weex）

实际上它只是一层对真实DOM的抽象，以JavaScript 对象（VNode 节点)作为基础的树，用对象的属性来描述节点，最终可以通过一系列操作使这棵树映射到真实环境上

在Javascript对象中，虚拟DOM表现为一个Object对象。并且最少包含标签名（tag）、属性（attrs）和子元素对象（children）三个属性，不同框架对这三个属性的名命可能会有差别

创建虚拟DOM就是为了更好将虚拟的节点渲染到页面视图中，所以虚拟 DOM对象的节点与真实DOM的属性一一照应

在 vue 中同样使用到了虚拟 DOM技术

定义真实 DOM

```text
<div id="app">
<p class="p">节点内容</p>
<h3>{{ fo0 }}</h3>
</div>
```

实例化vue

```js
const app = new Vue({
    el:"#app",
    data:{
      foo:"foo"
    }
  })
```

观察 render 的 render，我们能得到虚拟 DOM

```js
(function anonymous(
  ) {
    with(this){return _c('div',{attrs:{"id":"app"}},[_c('p',{staticClass:"p"}
            [_v("节点内容")]),_v(" "),_c('h3',[_v(_s(foo))])])}})
```

通过VNode，vue 可以对这颗抽象树进行创建节点,删除节点以及修改节点的操作，经过 diff 算法得出一些需要修改的最小单位,再更新视图，减少了dom操作，提高了性能

### 价值与边界

DOM是很慢的，其元素非常庞大，页面的性能问题，大部分都是由DOM操作引起的

真实的DOM节点，哪怕一个最简单的 div 也包含着很多属性，可以打印出来直观感受一下：

由此可见，操作DOM的代价仍旧是昂贵的，频繁操作还是会出现页面卡顿，影响用户的体验

**举个例子**

你用传统的原生 api或jQuery 去操作 DOM时，浏览器会从构建DOM树开始从头到尾执行一遍流程

当你在一次操作时，需要更新10个 DOM节点，浏览器没这么智能，收到第一个更新 DOM请求后，并不知道后续还有9次更新操作，因此会马上执行流程，最终执行10次流程

而通过VNode，同样更新10个DOM节点，虚拟DOM不会立即操作DOM，而是将这10次更新的diff内容保存到本地的一个 js 对象中，最终将这个js 对象一次性attach到DOM树上，避免大量的无谓计算

很多人认为虚拟DOM 最大的优势是diff 算法，减少JavaScript操作真实DOM的带来的性能消耗。虽然这一个虚拟DOM带来的一个优势，但并不是全部。虚拟DOM最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的DOM，可以是安卓和IOS的原生组件，可以是近期很火热的小程序，也可以是各种GUI

### VNode 的创建过程

首先可以看看 vue 中VNode的结构

源码位置：src/core/vdom/vnode.js

```ts
export default class VNode {
tag: string | void;
data: VNodeData | void;
children: ?Array<VNode>;
text: string | void;
elm: Node | void;
ns: string void;
context: Component | void; // rendered in this component's scope
functionalContext: Component | void; // only for functional component ro
ot nodes
key: string | number | void;
componentOptions: VNodeComponentOptions | void;
componentInstance: Component |void; // component instance
parent: VNode | void; // component placeholder node
raw: boolean; // contains raw HTML? (server only)
isStatic: boolean; // hoisted static node
isRootInsert: boolean: // necessary for enter transition check
isComment: boolean; // empty comment placeholder?
isCloned: boolean; // is a cloned node?
isOnce: boolean; // is a v-once node?

constructor (
tag?: string,
data?: VNodeData,
children?: ?Arrav<VNode>.
text?: string,
elm?: Node,
context?: Component,
componentOptions?: VNodeComponentOptions
){
/*当前节点的标签名*/
this.tag = tag
/*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNod
eData类型中的数据信息*/
this.data = data
/*当前节点的子节点，是一个数组*/
this.children = children
/*当前节点的文本*/
this.text = text
/*当前虚拟节点对应的真实dom节点*/
this.elm = elm
/*当前节点的名字空间*/
this.ns = undefined
/*编译作用域*/
this.context = context
```

```ts
/*函数化组件作用域*/
this.functionalContext = undefined

/*节点的key属性，被当作节点的标志，用以优化*/

this.key = data && data.key

/*组件的option选项*/

this.componentOptions = componentOptions

/*当前节点对应的组件的实例*/

this.componentInstance = undefined

/*当前节点的父节点*/

this.parent = undefined

/*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent
的时候为false*/

this.raw = false

/*静态节点标志*/

this.isStatic = false

/*是否作为跟节点插入*/

this.isRootInsert = true

/*是否为注释节点*/

this.isComment = false

/*是否为克隆节点*/

this.isCloned = false

/*是否有v-once指令*/

this.isOnce = false

}

// DEPRECATED: alias for componentInstance for backwards compat.

/* istanbul ignore next https://github.com/answershuto/learnVue*/

get child (): Component | void {

return this.componentInstance

}

}
```

这里对 VNode 进行稍微的说明：

所有对象的context 选项都指向了 Vue 实例

elm 属性则指向了其相对应的真实 DOM 节点

vue 是通过 createElement 生成 VNode

源码位置：src/core/vdom/create-element.js

```ts
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
```

上面可以看到createElement 方法实际上是对\_createElement 方法的封装，对参数的传入进行了判断

```ts
export function _createElement(
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NoDE_ENV !== production'&& warn(
    Avoid using observed data object as vnode data: ${JSON.string
      ify(data)}\n+
    'Always create fresh vnode data objects in each render!',
    context
  )
  return createEmptyVNode()
}
// object syntax in v-bind
if (isDef(data) && isDef(data.is)) {
  tag = data.is
}
if (!tag) {
  // in case of component :is set to falsy value
  return createEmptyVNode()
}

// support single function children as default scoped slot
if (Array.isArray(children) &&
  typeof children[0] === 'function'
) {
  data = data || {}
  data.scopedSlots = { default: children[0] }
  children.length = 0

  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
    else if （ === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  // 创建VNode

}
```

可以看到\_createElement接收5个参数：

context 表示 VNode 的上下文环境，是 Component 类型

无论是 simpleNormalizeChildren还是 normalizeChildren都是对 children 进行规范
(使 children 变成了一个类型为 VNode 的 Array)，这里就不展开说了
规范化 children 的源码位置在：src/core/vdom/helpers/normalzie-children.js
在规范化 children 后，就去创建 VNode

- tag 表示标签，它可以是一个字符串，也可以是一个 Component

data 表示 VNode 的数据，它是一个 VNodeData 类型

children 表示当前 VNode的子节点，它是任意类型的

normalizationType表示子节点规范的类型，类型不同规范的方法也就不一样，主要是参考
render 函数是编译生成的还是用户手写的

根据normalizationType 的类型，children会有不同的定义

```js
if (normalizationType === ALWAYS_NORMALIZE) {
  children = normalizeChildren(children)
} else if ( === SIMPLE_NORMALIZE) {
  children = simpleNormalizeChildren(children)
}
```

simpleNormalizeChildren方法调用场景是 render 函数是编译生成的

normalizeChildren方法调用场景分为下面两种：

render 函数是用户手写的

编译 slot、v-for 的时候会产生嵌套数组

```js
let vnode, ns
// 对tag进行判断
if (typeof tag === 'string') {
let Ctor
ns = (context.\$vnode && context.\$vnode.ns) Il config.getTagNamespace(tag
```

)
```js
if (config.isReservedTag(tag)) {
//如果是内置的节点，则直接创建一个普通VNode
vnode = new VNode(
config.parsePlatformTagName(tag), data, children,
```
10 undefined, undefined, context
```js
)
} else if (isDef(Ctor = resolveAsset(context.\$options, 'components', tag
))){
// component
//如果是component类型，则会通过createComponent创建VNode节点
vnode = createComponent(Ctor, data, context, children, tag)
} else {
vnode = new VNode(
```
18 tag, data, children,
19 undefined, undefined, context
```js
)
}
} else {
// direct component options / constructor
vnode = createComponent(tag, data, context, children)
}
```

createComponent 同样是创建 VNode

源码位置：src/core/vdom/create-component.js

```ts
export function createComponent (
Ctor: Class<Component> | Function | Object | void,
data: ?VNodeData,
context: Component,
children: ?Array<VNode>,
tag?: string
): VNode | Array<VNode> | void {
if (isUndef(Ctor)) {
return
}
// 构建子类构造函数
const baseCtor = context.$options. _base

// plain options object: turn it into a constructor
if (isObject(Ctor)) {
Ctor = baseCtor.extend(Ctor)
}

// if at this stage it's not a constructor or an async component factor
y,
// reject.
if (typeof Ctor !== 'function') {
if (process.env.NoDE_ENV !== 'production') {
warn(`Invalid Component definition: ${String(Ctor)}`, context)
}
return
}

// async component
let asyncFactory
if (isUndef(Ctor.cid)) {
asyncFactory = Ctor
Ctor =resolveAsyncComponent(asyncFactory, baseCtor, context)
if (Ctor === undefined) {
return createAsyncPlaceholder(
asyncFactory,
data,
context,
children,
tag
)
}
}

data = data || {}
```

```js

// resolve constructor options in case global mixins are applied after

// component constructor creation

resolveConstructorOptions(Ctor)

// transform component v-model data into props & events

if (isDef(data.model)) {

transformModel(Ctor.options, data)

}

// extract props
const propsData = extractPropsFromVNodeData(data, Ctor, tag)

// functional component

if (isTrue(Ctor.options.functional)) {

return createFunctionalComponent(Ctor, propsData, data, context, child
ren)

}

// extract listeners, since these needs to be treated as

// child component listeners instead of DoM listeners

const listeners = data.on

// replace with listeners with .native modifier

// so it gets processed during parent component patch.

data.on = data.nativeOn

if (isTrue(Ctor.options.abstract)) {

const slot = data.slot

data = {}

if (slot) {

data.slot = slot

}

}

//安装组件钩子函数，把钩子函数合并到data.hook中

installComponentHooks(data)

/实例化一个VNode返回。组件的VNode是没有children的

const name = Ctor.options.name || tag

const vnode = new VNode(

vue-component-${Ctor.cid}${name ?`-${name}:''}`,

data, undefined, undefined, undefined, context,

{ Ctor, propsData, listeners, tag, children },

asyncFactory

)

if (__WEEX__&& isRecyclableComponent(vnode)) {

return renderRecyclableComponentTemplate(vnode)

}
```

return vnode
}

稍微提下 createComponent 生成VNode的三个关键流程：

构造子类构造函数Ctor

installComponentHooks安装组件钩子函数

- 实例化 vnode

### 实现总结

createElement 创建 VNode 的过程，每个 VNode 有 children， children 每个元素也是一个VNode，这样就形成了一个虚拟树结构，用于描述真实的 DOM树结构

## 20. Vue项目中有封装过axios吗？主要是封装哪方面的?

### Axios 能力与基本使用

axios 是一个轻量的 HTTP 客户端

基于 XMLHttpRequest 服务来执行 HTTP 请求，支持丰富的配置，支持Promise，支持浏览器端和 Node.js 端。自Vue 2.0起，尤大宣布取消对 vue-resource 的官方推荐，转而推荐axios。现在 axios 已经成为大部分 Vue 开发者的首选

**特性**

从浏览器中创建 XMLHttpRequests

从 node.js 创建 http 请求

支持 Promise APl

拦截请求和响应

转换请求数据和响应数据

- 取消请求

自动转换 JSON 数据

客户端支持防御 XSRF

**基本使用**

安装

```js
// 项目中安装
npm install axios --S
// cdn 引入
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

导入

```js
import axios from 'axios'
```

**发送请求**

```js
axios({
    url:'xxx', //设置请求的地址
    method:"GET"，// 设置请求方法
    params:{ //get请求使用params进行参数凭借，如果是post请求用data
      type: '',
      page: 1
    }
  }).then(res => {
    // res为后端返回的数据
    console.log(res);
  })
```

并发请求axios.all([])

```js
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()])
.then(axios.spread(function (res1, res2) {
      // res1第一个请求的返回的内容，res2第二个请求返回的内容
      //两个请求都执行完成才会执行
    }));
```

### 为什么需要二次封装

axios 的API很友好，你完全可以很轻松地在项目中直接使用。

不过随着项目规模增大，如果每发起一次HTTP请求，就要把这些比如设置超时时间、设置请求头、根据项目环境判断使用哪个请求地址、错误处理等等操作，都需要写一遍

这种重复劳动不仅浪费时间，而且让代码变得冗余不堪，难以维护。为了提高我们的代码质量，我们应该在项目中二次封装一下 axios 再使用

举个例子：

```js
axios('http://localhost:3000/data', {
    //配置代码
    method: 'GET',
    timeout: 1000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'xxx',
    },
    transformRequest: [function (data, headers) {
        return data;
      }],
    // 其他请求配置...
  })
.then((data) => {
    // todo：真正业务逻辑代码
    console.log(data);
  }, (err) => {
    // 错误处理代码
    if (err.response.status === 401) {
      // handle authorization error
    }
    if (err.response.status === 403) {
      // handle server forbidden error
    }
    // 其他错误处理.....
    console.log(err);
  });
```

如果每个页面都发送类似的请求，都要写一堆的配置与错误处理，就显得过于繁琐了

这时候我们就需要对axios进行二次封装，让使用更为便利

### 封装设计与实现

封装的同时，你需要和后端协商好一些约定，请求头，状态码，请求超时时间....

设置接口请求前缀：根据开发、测试、生产环境的不同，前缀需要加以区分

请求头：来实现一些具体的业务，必须携带一些参数才可以请求(例如：会员业务)

状态码：根据接口返回的不同status，来执行不同的业务，这块需要和后端约定好

请求方法:根据get、post等方法进行一个再次封装，使用起来更为方便

请求拦截器:根据请求的请求头设定，来决定哪些请求可以访问

响应拦截器：这块就是根据后端\`返回来的状态码判定执行不同业务

**设置接口请求前缀**

利用node环境变量来作判断，用来区分开发、测试、生产环境

```text
if (process.env.NoDE_ENV === 'development') {
axios.defaults.baseURL = 'http://dev.xxx.com'
} else if (process.env.NODE_ENV === 'production') {
axios.defaults.baseURL = 'http://prod.xxx.com'
}
```

在本地调试的时候，还需要在vue.config.js 文件中配置devServer 实现代理转发，从而实现跨域

```yaml
devServer: {
proxy: {
'/proxyApi': {
target: 'http://dev.xxx.com',
changeOrigin: true,
pathRewrite: {
'/proxyApi': '
}
}
}
}
```

**设置请求头与超时时间**

大部分情况下，请求头都是固定的，只有少部分情况下，会需要一些特殊的请求头，这里将普适性的请求头作为基础配置。当需要特殊请求头时，将特殊请求头作为参数传入，覆盖基础配置

```js
const service = axios.create({

    timeout： 30000,// 请求 30s 超时
    headers: {
      get: {
        'Content-Type':'application/x-www-form-urlencoded;charset=utf-
        '
        //在开发中，一般还需要单点登录或者其他功能的通用请求头，可以一并配置进来
      },
      post: {
        'Content-Type': 'application/json;charset=utf-8'
        //在开发中，一般还需要单点登录或者其他功能的通用请求头，可以一并配置进来
      }
    },
  })
```

**封装请求方法**

先引入封装好的方法，在要调用的接口重新封装成一个方法暴露出去

```js
// get 请求
export function httpGet({
url,
params = {}
}) {
return new Promise((resolve, reject) => {
axios.get(url, {
params
}).then((res) => {
resolve(res.data)
}).catch(err => {
reject(err)
})
})
}

// post
// post请求
export function httpPost({
url,
data = {},
params = {}
}) {
return new Promise((resolve, reject) => {
axios({
url,
method: 'post',
transformRequest: [function (data) {
let ret = '
for (let it in data) {
ret += encodeURIComponent(it) + '='+ encodeURIComponent(data[it
) + '&'

return ret
}],
//发送的数据
data,
// url参数
params

}).then(res => {
resolve(res.data)
})
})
}
```

把封装的方法放在一个 api.js 文件中

```js
import { httpGet, httpPost } from './http'
export const getorglist = (params = {}) => httpGet({ url: 'apps/api/org/lis
t', params })
```

页面中就能直接调用

```js
//.vue
import { getorglist } from '@/assets/js/api'

getorglist({ id: 200 }).then(res => {
    console.log(res)
  })
```

这样可以把 api统一管理起来，以后维护修改只需要在api.js 文件操作即可

**请求拦截器**

请求拦截器可以在每个请求里加上token，做了统一处理后维护起来也方便

```js
//请求拦截器
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断是否存在token
    //如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录
    情况，此处token一般是用户完成登录后储存到localstorage里的
    token&& (config.headers.Authorization = token)
    return config
  }
  error => {
    return Promise.error(error)
  })
```

**响应拦截器**

响应拦截器可以在接收到响应后先做一层操作，如根据状态码判断登录状态、授权

```js
// 响应拦截器
axios.interceptors.response.use(response => {
    //如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      if (response.data.code === 511) {
        // 未授权调取授权接口
      } else if (response.data.code === 510) {
        // 未登录跳转登录页
      } else {
        return Promise.resolve(response)
      }
    } else {
      return Promise.reject(response)
    }
  }, error => {
    // 我们可以在这里对异常状态作统一处理
    if (error.response.status) {
      //处理请求失败的情况
      //对不同返回码对相应处理
      return Promise.reject(error.response)
    }
  })
```

### 选型总结

封装是编程中很有意义的手段，简单的axios封装，就可以让我们可以领略到它的魅力

- 封装axios没有一个绝对的标准，只要你的封装可以满足你的项目需求，并且用起来方便，那就是一个好的封装方案

## 21. 是怎么处理Vue项目中的错误的?

### 错误类型与接口处理

任何一个框架，对于错误的处理都是一种必备的能力

在Vue中，则是定义了一套对应的错误处理规则给到使用者，且在源代码级别，对部分必要的过程做了一定的错误处理。

主要的错误来源包括：

后端接口错误

代码中本身逻辑错误

**后端接口错误**

通过axios的interceptor实现网络请求的 response先进行一层拦截

```js
apiClient.interceptors.response.use(
response=> {
return response;

error => {
if (error.response.status == 401) {
router.push({ name: "Login" });
} else {
message.error("出错了");
return Promise.reject(error);
}
}
);
```

### 组件与全局错误处理

**代码逻辑问题**

**全局设置错误处理**

设置全局错误处理函数

```js
Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  //\`info是Vue特定的错误信息，比如错误所在的生命周期钩子
  // 只在 2.2.0+可用
}
```

errorHandler指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例

不过值得注意的是，在不同 Vue 版本中，该全局API作用的范围会有所不同：

从2.2.0起，这个钩子也会捕获组件生命周期钩子里的错误。同样的，当这个钩子是 undefined
时，被捕获的错误会通过console.error输出而避免应用崩
从2.4.0起，这个钩子也会捕获Vue自定义事件处理函数内部的错误了
从2.6.0起，这个钩子也会捕获v-onDOM监听器内部抛出的错误。另外，如果任何被覆盖的钩子
或处理函数返回一个Promise链(例如async函数)，则来自其Promise链的错误也会被处理

**生命周期钩子**

errorCaptured是2.5.0新增的一个生命钩子函数，当捕获到一个来自子孙组件的错误时被调用

基本类型

```ts
(err: Error, vm: Component, info: string) => ?boolean
```

此钩子会收到三个参数:错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播

参考官网，错误传播规则如下：

默认情况下，如果全局的 config.errorHandler 被定义，所有的错误仍会发送它，因此这些错误仍然会向单一的分析服务的地方进行汇报

如果一个组件的继承或父级从属链路中存在多个 errorCaptured 钩子，则它们将会被相同的错

误逐个唤起。

- 如果此 errorCaptured钩子自身抛出了一个错误，则这个新错误和原本被捕获的错误都会发送给全局的 config.errorHandler

一个errorCaptured钩子能够返回 false 以阻止错误继续向上传播。本质上是说“这个错误已经被搞定了且应该被忽略”。它会阻止其它任何会被这个错误唤起的 errorCaptured 钩子和全局的 config.errorHandler

下面来看个例子

定义一个父组件 cat

```js
Vue.component('cat', {
    template:
    <div>
    <h1>Cat： </h1>
    <slot></slot>
    </div>`,
    props:{
      name:{
        required:true,
        type:String
      }
    },
    errorCaptured(err,vm,info) {
      console.log(`cat EC: ${err.toString()}\ninfo: ${info}`);
      return false;
    }

  });
```

定义一个子组件 kitten，其中 dontexist()并没有定义，存在错误

```js
Vue.component('kitten', {
    template:'<div><h1>Kitten: {{ dontexist() }}</h1></div>',
    props:{
      name:{
        required:true,
        type:String
      }
    }
  });
```

页面中使用组件

```html
<div id="app" v-cloak>
  <cat name="my cat">
    <kitten></kitten>
  </cat>
</div>
```

在父组件的 errorCaptured则能够捕获到信息

```js
cat EC: TypeError: dontexist is not a function
info: render
```

### 错误传播源码

异常处理源码

源码位置：/src/core/util/error.js

```ts
//Vue 全局配置，也就是上面的Vue.config
import config from '../config'
import { warn } from './debug'
//判断环境
import { inBrowser, inWeex } from './env'
// 判断是否是Promise，通过val.then ==='function'&& val.catch ==='functio
n', val ! === null && val !== undefined
import { isPromise } from 'shared/util'
// 当错误函数处理错误时，停用deps跟踪以避免可能出现的infinite rendering
// 解决以下出现的问题https://github.com/vuejs/vuex/issues/1505的问题
import { pushTarget, popTarget } from '../observer/dep

export function handleError (err: Error, vm: any, info: string) {
// Deactivate deps tracking while processing error handler to avoid p
ossible infinite rendering.
pushTarget()
try {
// vm指当前报错的组件实例
if (vm) {
let cur = vm
//首先获取到报错的组件，之后递归查找当前组件的父组件，依次调用errorCap
tured 方法。
//在遍历调用完所有errorCaptured 方法、或errorCaptured 方法有报
错时，调用globalHandleError 方法
while ((cur = cur.$parent)) {
const hooks = cur.$options.errorCaptured
// 判断是否存在errorCaptured钩子函数
if (hooks) {
//选项合并的策略，钩子函数会被保存在一个数组中
for (let i = 0; i < hooks.length; i++) {
//如果errorCaptured 钩子执行自身抛出了错误，
// 则用try{}catch{}捕获错误，将这个新错误和原本被捕获的
错误都会发送给全局的config.errorHandler
//调用globalHandleError方法
try {
//当前errorCaptured执行，根据返回是否是false值
// 是false,capture = true,阻止其它任何会被这个
错误唤起的 errorCaptured 钩子和全局的 config.errorHandler
// 是true capture = fale，组件的继承或父级从属链
路中存在的多个errorCaptured钩子，会被相同的错误逐个唤起
//调用对应的钩子函数，处理错误
const capture = hooks[i].call(cur, err, vm, i
nfo) === false
if(capture) return
} catch (e) {
```

38 globalHandleError(e, cur, 'errorCaptured hoo
k')
}
}
}
}
}
//除非禁止错误向上传播，否则都会调用全局的错误处理函数
globalHandleError(err, vm, info)
} finally {
popTarget()
}
}
// 异步错误处理函数
export function invokeWithErrorHandling (
handler: Function,
context: any,
args: null | any[],
vm: any,
info: string
){
let res
59-
try {
// 根据参数选择不同的handle执行方式
res = args ? handler.apply(context, args) : handler.call(
context)
// handle返回结果存在
// res. isVue an flag to avoid this being observed, 如果传
入值的isVue为ture时(即传入的值是Vue实例本身)不会新建observer实例
// isPromise(res) 判断val.then === 'function'&& val.catc
h === 'function', val ! === null && val !== undefined
// !res.\_handled\_handle是Promise 实例的内部变量之一，默认是
false，代表onFulfilled,onRejected是否被处理
if(res && !res.\_isVue && isPromise(res) && !res. \_handled
) {
res.catch(e => handleError(e, vm, info + (Promise/a
sync)\`))
// avoid catch triggering multiple times when nested
69 calls
// 避免嵌套调用时catch多次的触发
res.\_handled = true
}
} catch (e) {
// 处理执行错误
```js
handleError(e, vm, info)
}
return res
}
```

```js

//全局错误处理

function globalHandleError (err, vm, info) {

//获取全局配置，判断是否设置处理函数，默认undefined

//已配置

if (config.errorHandler) {

// try{}catch{} 住全局错误处理函数

try {

//执行设置的全局错误处理函数，handle error想干啥就干啥

return config.errorHandler.call(null, err, vm, info)

} catch (e) {

// 如果开发者在errorHandler函数中手动抛出同样错误信息throw err

//判断err信息是否相等，避免log两次

// 如果抛出新的错误信息throw err Error('你好毒'),将会一起log输出

if (e !== err) {

logError(e, null, 'config.errorHandler')

}

}

}

// 未配置常规log输出

logError(err, vm, info)

}

// 错误输出函数

function logError (err, vm, info) {

if (process.env.NODE_ENV !== 'production') {

warn(`Error in ${info}: "${err.toString()}", vm)

}

/* istanbul ignore else */

if ((inBrowser || inWeex) && typeof console !== 'undefined') {

console.error(err)

} else {

throw err

}

}
```

### 处理流程总结

handleError在需要捕获异常的地方调用，首先获取到报错的组件，之后递归查找当前组件的父组件，依次调用 errorCaptured 方法，在遍历调用完所有 errorCaptured 方法或 errorCaptured 方法有报错时，调用 globalHandleError 方法

globalHandleError 调用全局的 errorHandler 方法，再通过 logError判断环境输出错误信息

invokeWithErrorHandling更好的处理异步错误信息

logError判断环境，选择不同的抛错方式。非生产环境下，调用 warn方法处理错误

## 22. 你了解axios的原理吗？有看过它的源码吗?

### Axios 的调用方式

关于axios的基本使用，上篇文章已经有所涉及，这里再稍微回顾下：

发送请求

```js
import axios from 'axios';

axios(config)//直接传入配置
axios(url[,config]) // 传入url和配置
axios[method](url[，option])//直接调用请求方式方法，传入url和配置
axios[method](url[，data[，option]])//直接调用请求方式方法，传入data、url和配
置
axios.request(option) // 调用 request 方法

const axiosInstance = axios.create(config)
// axiosInstance 也具有以上 axios 的能力

axios.all([axiosInstance1, axiosInstance2]).then(axios.spread(response1, r
    esponse2))
// 调用 all 和传入 spread 回调
```

**请求拦截器**

```js
axios.interceptors.request.use(function (config) {
    // 这里写发送请求前处理的代码
    return config;
  }, function (error) {
    //这里写发送请求错误相关的代码
    return Promise.reject(error);
  });
```

**响应拦截器**

```js
axios.interceptors.response.use(function (response) {
    //这里写得到响应数据后处理的代码
    return response;
  }, function (error) {
    // 这里写得到错误响应处理的代码
    return Promise.reject(error);
  });
```

**取消请求**

```js
//方式一
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('xxxx', {
    cancelToken: source.token
  })
// 取消请求(请求原因是可选的)
source.cancel('主动取消请求');

//方式二
const CancelToken = axios.CancelToken;
let cancel;

axios.get('xxxx', {
    cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      })
  });
cancel('主动取消请求');
```

### 简易 Axios 实现

构建一个Axios构造函数，核心代码为 request

```js
class Axios {
constructor() {

}

request(config) {
return new Promise(resolve => {
const {url = '', method = 'get', data = {}} = config;
// 发送ajax请求
const xhr = new XMLHttpRequest();
xhr.open(method, url, true);
xhr.onload = function() {
console.log(xhr.responseText)
resolve(xhr.responseText);
}
xhr.send(data);
})
}

```

导出 axios 实例

```js
//最终导出axios的方法，即实例的request方法
function CreateAxiosFn() {
  let axios = new Axios();
  let req= axios.request.bind(axios);
  returnreq;
}

//得到最后的全局变量axios
let axios = CreateAxiosFn():
上述就已经能够实现 axios({ })这种方式的请求
下面是来实现下axios.method()这种形式的请求
```

```js
// 定义get,post...方法，挂在到Axios原型上
const methodsArr = ['get', 'delete', 'head', 'options', 'put', 'patch', 'p
ost'];
methodsArr.forEach(met => {
Axios.prototype[met] = function() {
console.log('执行'+met+'方法');
// 处理单个方法
if (['get', 'delete', 'head', 'options'].includes(met)) { // 2个参
数(url[,config])
return this.request({
method: met,
url: arguments[0],
...arguments[1] || {}
})
} else { // 3个参数(url[,data[,config]])
return this.request({
method: met,
url: arguments[0],
data: arguments[1] || {},
...arguments[2] || {}
})
}

}
})
```

将Axios.prototype上的方法搬运到 request上

首先实现个工具类，实现将b 方法混入到 a，并且修改 this指向

```js
const utils = {
  extend(a,b, context) {
    for(let key in b) {
      if(b.hasOwnProperty(key)) {
        if (typeof b[key] === 'function') {
          a[key] = b[key].bind(context);
        } else {
          a[key] = b[key]
        }
      }

    }
  }
}
```

**修改导出的方法**

```js
function CreateAxiosFn() {
  let axios = new Axios();

  let req = axios.request.bind(axios);
  //增加代码
  utils.extend(req, Axios.prototype, axios)

  return req;
}
```

**构建拦截器的构造函数**

```js
class InterceptorsManage {
  constructor() {
    this.handlers = [];
  }

  use(fullfield, rejected) {
    this.handlers.push({
        fullfield,
        rejected
      })
  }
}
```

实现axios.interceptors.response.use 和axios.interceptors.request.use

```js
class Axios {
  constructor() {
    //新增代码
    this.interceptors = {
      request: new InterceptorsManage,
      response: new InterceptorsManage
    }
  }

  request(config) {

  }
}
```

执行语句 axios.interceptors.response.use 和axios.interceptors.request.use的时候，实现获取 axios实例上的interceptors对象，然后再获取response或request拦截器，再执行对应的拦截器的 use方法

把Axios上的方法和属性搬到 request 过去

```js
function CreateAxiosFn() {
  let axios = new Axios();

  let req = axios.request.bind(axios);
  // 混入方法，处理axios的request方法，使之拥有get,post...方法
  utils.extend(req, Axios.prototype, axios)
  //新增代码
  utils.extend(req, axios)
  return req;
}
```

现在 request 也有了 interceptors 对象，在发送请求的时候，会先获取 request 拦截器的 handlers的方法来执行

首先将执行ajax的请求封装成一个方法

```js
request(config) {
this.sendAjax(config)
}
sendAjax(config){
return new Promise(resolve => {
const {url = '', method = 'get', data = {}} = config;
// 发送ajax请求
console.log(config);
const xhr = new XMLHttpRequest();
xhr.open(method, url, true);
xhr.onload = function() {
console.log(xhr.responseText)
resolve(xhr.responseText);

xhr.send(data);
(})

```

获得 handlers 中的回调

```js
request(config) {
  //拦截器和请求组装队列
  let chain = [this.sendAjax.bind(this), undefined] // 成对出现的，失败回调
  暂时不处理

  //请求拦截
  this.interceptors.request.handlers.forEach(interceptor => {
      chain.unshift(interceptor.fullfield, interceptor.rejected)
    })

  //响应拦截
  this.interceptors.response.handlers.forEach(interceptor => {
      chain.push(interceptor.fullfield, interceptor.rejected)
    })

  //执行队列，每次执行一对，并给promise赋最新的值
  let promise = Promise.resolve(config);
  while(chain.length > 0) {
    promise = promise.then(chain.shift(), chain.shift())
  }
  return promise;
}
```

```js
chains大概是['fulfilled1','reject1','fulfilled2','reject2','this.sendAja
x','undefined','fulfilled2','reject2','fulfilled1','reject1']这种形式
```

这样就能够成功实现一个简易版

### 实例创建与请求入口

首先看看目录结构

/1ib/ #项目源码目
/adapters/ #定义发送请求的适配器
http.js #node环境http对象
xhr.js #浏览器环境XML对象
/cance1/ #定义取消功能
/helpers/ #一些辅助方法
/core/ #一些核心功能
Axios.js # axios实例构造函数
createError.js #抛出错误
dispatchRequest.js #用来调用http请求适配器方法发送请求
InterceptorManager.js #拦截器管理器
mergeConfig.js #合并参数
settle.js #根据http响应状态，改变Promise的状态
transformData.js #改变数据格式
axios.js #入口，创建构造函数
defaults.js #默认配置
utils.js #公用工具

axios发送请求有很多实现的方法，实现入口文件为axios.js

```js
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);

  //instance指向了request方法，且上下文指向context，所以可以直接以instance(opt
  ion）方式调用
  // Axios.prototype.request 内对第一个参数的数据类型判断，使我们能够以 instance
  (url，option) 方式调用
  var instance = bind(Axios.prototype.request, context);

  //把Axios.prototype上的方法扩展到instance对象上，
  //并指定上下文为context，这样执行Axios原型链上的方法时，this会指向context
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  //把context对象上的自身属性和方法扩展到instance上
  //注:因为extend内部使用的forEach方法对对象做forin遍历时，只遍历对象本身的属
  性，而不会遍历原型链上的属性
  //这样，instance 就有了defaults、interceptors 属性。
  utils.extend(instance, context);
  return instance;
}

// Create the default instance to be exported 创建—个由默认配置生成的axios实
例
var axios = createInstance(defaults);

// Factory for creating new instances 扩展axios.create工厂函数，内部也是 crea
teInstance
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Exposeall/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};
module.exports = axios;
```

主要核心是 Axios.prototype.request，各种请求方式的调用实现都是在request 内部实现的，简单看下 request 的逻辑

```js
Axios.prototype.request = function request(config) {
  // Allow for axios('example/url'[, config]) a la fetch API
  // 判断 config 参数是否是字符串，如果是则认为第一个参数是 URL，第二个参数是真正的c
  onfig
  if (typeof config === 'string') {
    config = arguments[1] || {};
    //把 url 放置到 config 对象中，便于之后的 mergeConfig
    config.url = arguments[0];
  } else {
    // 如果 config 参数是否是字符串，则整体都当做config
    config = config || {};
  }
  // 合并默认配置和传入的配置
  config = mergeConfig(this.defaults, config);
  //设置请求方法
  config.method = config.method ? config.method.toLowerCase() : 'get';
  /*
  something...此部分会在后续拦截器单独讲述
  */
};

// 在 Axios 原型上挂载'delete'，'get'，'head'，'options'且不传参的请求方法，
实现内部也是 request
utils.forEach(['delete','get', 'head', 'options'], function forEachMethod
  NoData(method) {
    Axios.prototype[method] = function(url, config) {
      return this.request(utils.merge(config || {}, {
            method: method,
            url: url
          }));
    };
  });

//在 Axios 原型上挂载'post'，'put'，patch'且传参的请求方法，实现内部同样也是
request
utils.forEach(['post','put','patch'], function forEachMethodWithData(met
    hod) {
    Axios.prototype[method] = function(url, data, config) {
      return this.request(utils.merge(config || {}, {
            method: method,
            url: url,
            data: data
          }));
    };
  });
```

request入口参数为config，可以说config贯彻了 axios的一生

axios 中的 config 主要分布在这几个地方：

- 默认配置 defaults.js

config.method默认为 get

调用 createInstance 方法创建 axios 实例，传入的config

- 直接或间接调用 request 方法，传入的 config

```js
// axios.js
// 创建一个由默认配置生成的axios实例
var axios = createInstance(defaults);

// 扩展axios.create工厂函数，内部也是 createInstance
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Axios.js
//合并默认配置和传入的配置
config = mergeConfig(this.defaults, config);
//设置请求方法
config.method = config.method ? config.method.toLowerCase() : 'get';
```

s.default request参数

从源码中，可以看到优先级：默认配置对象 default < method:get < Axios 的实例属性 thi

下面重点看看request 方法

```js
Axios.prototype.request = function request(config) {
  /*
  先是 mergeConfig ...等，不再阐述
  */
  // Hook up interceptors middleware 创建拦截器链. dispatchRequest 是重中之
  重，后续重点
  var chain = [dispatchRequest, undefined];

  // push各个拦截器方法 注意:interceptor.fulfilled 或 interceptor.rejected 是
  可能为undefined
  this.interceptors.request.forEach(function unshiftRequestInterceptors(in
      terceptor) {
      //请求拦截器逆序注意此处的 forEach是自定义的拦截器的forEach方法
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

  this.interceptors.response.forEach(function pushResponseInterceptors(int
      erceptor) {
      //响应拦截器顺序 注意此处的 forEach 是自定义的拦截器的forEach方法
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

  //初始化一个promise对象，状态为resolved，接收到的参数为已经处理合并过的config对象
  var promise = Promise.resolve(config);

  // 循环拦截器的链
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift()); // 每—次向外弹出
    拦截器
  }
  // 返回 promise
  return promise;
};
```

拦截器 interceptors 是在构建axios 实例化的属性

```js
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(), // 请求拦截
    response: new InterceptorManager() // 响应拦截
  };
}
```

### 拦截器、请求派发与取消

```js
//拦截器的初始化其实就是一组钩子函数
function InterceptorManager() {
this.handlers = [];

//调用拦截器实例的use时就是往钩子函数中push方法
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
this.handlers.push({
fulfilled: fulfilled,
rejected: rejected
});
return this.handlers.length - 1;
};

//拦截器是可以取消的，根据use的时候返回的ID，把某一个拦截器方法置为null
// 不能用splice 或者slice 的原因是删除之后id就会变化，导致之后的顺序或者是操作
不可控
InterceptorManager.prototype.eject = function eject(id) {
if (this.handlers[id]) {
this.handlers[id] = null;
}
};

//这就是在 Axios的request方法中 中循环拦截器的方法 forEach 循环执行钩子函数
InterceptorManager.prototype.forEach = function forEach(fn) {
utils.forEach(this.handlers, function forEachHandler(h) {
if (h !== null) {
fn(h);
}
});
}
```

请求拦截器方法是被 unshift到拦截器中，响应拦截器是被push到拦截器中的。最终它们会拼接上一个叫 dispatchRequest的方法被后续的promise顺序执行

```js
var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
var combineURLs = require('./../helpers/combineURLs');

//判断请求是否已被取消，如果已经被取消，抛出已取消
function throwIfCancellationRequested(config) {
if (config.cancelToken) {
config.cancelToken.throwIfRequested();
}
}

module.exports = function dispatchRequest(config) {
throwIfCancellationRequested(config);

//如果包含baseUrl，并且不是config.url绝对路径，组合baseUrl以及config.url
if (config.baseURL && !isAbsoluteURL(config.url)) {
//组合baseURL与url形成完整的请求路径
config.url = combineURLs(config.baseURL, config.url);
}

config.headers = config.headers || {};

//使用/lib/defaults.js中的transformRequest方法，对config.headers和config.d
ata进行格式化
// 比如将headers中的Accept，Content-Type统一处理成大写
// 比如如果请求正文是一个Object会格式化为JSON字符串，并添加application/json;cha
rset=utf-8的Content-Type
//等一系列操作
config.data = transformData(
config.data,
config.headers,
config.transformRequest
)1

// 合并不同配置的headers，config.headers的配置优先级更高
config.headers = utils.merge(
config.headers.common || {},
config.headers[config.method] || {},
config.headers || {}
);

//删除headers中的method属性
```

```js
utils.forEach(
['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],

function cleanHeaderConfig(method) {

delete config.headers[method]:

}

);

//如果config配置了adapter，使用config中配置adapter的替代默认的请求方法

var adapter = config.adapter || defaults.adapter;

//使用adapter方法发起请求(adapter根据浏览器环境或者Node环境会有不同)

return adapter(config).then(

// 请求正确返回的回调

function onAdapterResolution(response) {

//判断是否以及取消了请求，如果取消了请求抛出以取消

throwIfCancellationRequested(config);

//使用/lib/defaults.js中的transformResponse方法，对服务器返回的数据进行格
式化

//例如，使用JSON.parse对响应正文进行解析

response.data = transformData(

response.data,

response.headers,

config.transformResponse

);

return response;

},
//请求失败的回调

function onAdapterRejection(reason) {

if (!isCancel(reason)) {

throwIfCancellationRequested(config);

if (reason && reason.response) {

reason.response.data = transformData(

reason.response.data,
reason.response.headers,

config.transformResponse

);

}

}

return Promise.reject(reason);

}

);

};
```

再来看看axios 是如何实现取消请求的，实现文件在CancelToken.js

```js
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }
  // 在 CancelToken 上定义—个pending 状态的 promise，将 resolve 回调赋值给外
  部变量 resolvePromise
  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

  var token = this;
  //立即执行传入的executor函数，将真实的cancel 方法通过参数传递出去。
  //—旦调用就执行 resolvePromise 即前面的 promise 的 resolve，就更改promise的
  状态为resolve。
  //那么xhr中定义的 CancelToken.promise.then方法就会执行，从而xhr内部会取消请求
  executor(function cancel(message) {
      //判断请求是否已经取消过，避免多次执行
      if (token.reason) {
        return;
      }
      token.reason = new Cancel(message);
      resolvePromise(token.reason);
    });
}

CancelToken.source = function source() {
  // source 方法就是返回了一个 CancelToken 实例，与直接使用 new CancelToken 是一
  样的操作
  var cancel;
  var token = new CancelToken(function executor(c) {
      cancel = c;
    });
  // 返回创建的 CancelToken 实例以及取消方法
  return {
    token: token,
    cancel: cancel
  };
};
```

实际上取消请求的操作是在xhr.js中也有响应的配合的

```js
D JavaScript
if (config.cancelToken) {
  config.cancelToken.promise.then(function onCanceled(cancel) {
      if (!request) {
        return;
      }
      // 取消请求
      request.abort();
      reject(cancel);
    });
}
```

巧妙的地方在 CancelToken 中 executor 函数，通过 resolve函数的传递与执行，控制 promise的状态

## 23. Vue要做权限管理该怎么做?

### 权限控制目标

权限是对特定资源的访问许可，所谓权限控制，也就是确保用户只能访问到被分配的资源而前端权限归根结底是请求的发起权，请求的发起可能有下面两种形式触发

- 页面加载触发

- 页面上的按钮点击触发

总的来说，所有的请求发起都触发自前端路由或视图

所以我们可以从这两方面入手，对触发权限的源头进行控制，最终要实现的目标是：

路由方面，用户登录后只能看到自己有权访问的导航菜单，也只能访问自己有权访问的路由地址，否则将跳转 4xx 提示页

视图方面，用户只能看到自己有权浏览的内容和有权操作的控件

- 最后再加上请求控制作为最后一道防线，路由可能配置失误，按钮可能忘了加权限，这种时候请求

### 权限层级与接口校验

前端权限控制可以分为四个方面：

- 接口权限

- 按钮权限

- 菜单权限

- 路由权限

**接口权限**

接口权限目前一般采用 jwt的形式来验证，没有通过的话一般返回401，跳转到登录页面重新进行登录

登录完拿到 token，将 token存起来，通过 axios 请求拦截器进行拦截，每次请求的时候头部携带token

```js
axios.interceptors.request.use(config => {
    config.headers['token'] = cookie.get('token')
    return config
  })
axios.interceptors.response.use(res=>{},{response}=>{
    if (response.data.code === 40099 || response.data.code === 40098) { //t
      oken过期或者错误
      router.push('/login')
    }
  })
```

### 路由与菜单权限

**路由权限控制**

方案一

初始化即挂载全部路由，并且在路由上标记相应的权限信息，每次路由跳转前做校验

```js
const routerMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'pagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }, {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'directivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permissi
          on
        }
      }]
  }]
```

这种方式存在以下四种缺点：

加载所有的路由，如果路由很多，而用户并不是所有的路由都有权限访问，对性能会有影响。

全局路由守卫里，每次路由跳转都要做权限判断。

- 菜单信息写死在前端，要改个显示文字或权限信息，需要重新编译

- 菜单跟路由耦合在一起，定义路由的时候还有添加菜单显示标题，图标之类的信息，而且路由不一定作为菜单显示，还要多加字段进行标识

**方案二**

初始化的时候先挂载不需要权限控制的路由，比如登录页，404等错误页。如果用户通过URL进行强制访问，则会直接进入404，相当于从源头上做了控制

登录后，获取用户的权限信息，然后筛选有权限访问的路由，在全局路由守卫里进行调用 addRoutes 添加路由

```js
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'// progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permission judge function
function hasPermission(roles, permissionRoles) {
if (roles.indexOf('admin') >= 0) return true // admin permission passed
directly
if (!permissionRoles) return true
return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/authredirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
NProgress.start() // start progress bar
if (getToken()) { // determine if there has token
/* has token*/
if (to.path === '/login') {
next({ path: '/' })
NProgress.done() // if current page is dashboard will not trigger af
terEach hook, so manually handle it
} else {
if（store.getters.roles.length === 0） { // 判断当前用户是否已拉取完user_
info信息
store.dispatch('GetUserInfo').then(res => { // 拉取user_info
const roles = res.data.roles // note: roles must be a array! suc
h as: ['editor', 'develop']
store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据
roles权限生成可访问的路由表
router.addRoutes(store.getters.addRouters)// 动态添加可访问路由
表
next({ ...to, replace: true }) // hack方法确保addRoutes已完成,
set the replace: true so the navigation will not leave a history record
})
}).catch((err) => {
store.dispatch('FedLogOut').then(() => {
Message.error(err | 'Verification failed, please login again'
)
next({ path: /' })
```

```js
})
})

} else {

//没有动态改变权限的需求可直接next(）删除下方权限判断↓

if (hasPermission(store.getters.roles, to.meta.roles)) {

next()//

} else {

next({ path: '/401', replace: true, query: { noGoBack: true }})

}

//可删 ↑

}

}

} else {

/* has no token*/

if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入

next()

} else {

next('/login') // 否则全部重定向到登录页

NProgress.done() // if current page is login will not trigger afterE
ach hook, so manually handle it

}

}

})

router.afterEach(() => {

NProgress.done() // finish progress bar

})
```

按需挂载，路由就需要知道用户的路由权限，也就是在用户登录进来的时候就要知道当前用户拥有哪些路由权限

这种方式也存在了以下的缺点：

全局路由守卫里，每次路由跳转都要做判断

- 菜单信息写死在前端，要改个显示文字或权限信息，需要重新编译

- 菜单跟路由耦合在一起，定义路由的时候还有添加菜单显示标题，图标之类的信息，而且路由不一定作为菜单显示，还要多加字段进行标识

**菜单权限**

菜单权限可以理解成将页面与理由进行解耦

**方案一**

菜单与路由分离，菜单由后端返回

**前端定义路由信息**

```js
{
  name: "login",
  path: "/login",
  component: () => import("@/pages/Login.vue")
}
```

name字段都不为空，需要根据此字段与后端返回菜单做关联，后端返回的菜单信息中必须要有 name 对应的字段，并且做唯一性校验

全局路由守卫里做判断

```js
function hasPermission(router, accessMenu) {
if (whiteList.indexOf(router.path) !== -1) {
return true;
}
let menu = Util.getMenuByName(router.name, accessMenu);
if (menu.name) {
return true;
}
return false;

}

Router.beforeEach(async (to, from, next) => {
if (getToken()) {
let userInfo = store.state.user.userInfo;
if (!userInfo.name) {
try {
await store.dispatch("GetUserInfo")
await store.dispatch('updateAccessMenu')
if (to.path === '/login') {
next({ name: 'home_index' })
} else {
//Util.toDefaultPage([...routers], to.name, router, next);
next({ ...to， replace：true })//菜单权限更新完成,重新进—次当前路由
}
}
catch (e) {
if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
next()
} else {
next('/login')

} else {
if (to.path === '/login') {
next({ name: 'home_index' })
} else {
if (hasPermission(to, store.getters.accessMenu)) {
Util.toDefaultPage(store.getters.accessMenu,to, routes, next);
} else {
next({ path: '/403',replace:true })
}
}
}
} else {
```

```js
if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
next()

} else {

next('/login')

}

}

let menu = Util.getMenuByName(to.name, store.getters.accessMenu);

Util.title(menu.title);

});

Router.afterEach((to) => {

window.scrollTo(0, 0);

});
```

每次路由跳转的时候都要判断权限，这里的判断也很简单，因为菜单的 name与路由的 name 是一一对应的，而后端返回的菜单就已经是经过权限过滤的

如果根据路由name找不到对应的菜单，就表示用户有没权限访问

如果路由很多，可以在应用初始化的时候，只挂载不需要权限控制的路由。取得后端返回的菜单后，根据菜单与路由的对应关系，筛选出可访问的路由，通过addRoutes动态挂载

这种方式的缺点：

菜单需要与路由做一一对应，前端添加了新功能，需要通过菜单管理功能添加新的菜单，如果菜单配置的不对会导致应用不能正常使用

- 全局路由守卫里，每次路由跳转都要做判断

**菜单权限方案二**

菜单和路由都由后端返回

前端统一定义路由组件

```ts
const Home = () => import("../pages/Home.vue");
const UserInfo = () => import("../pages/UserInfo.vue");
export default {
  home: Home,
  userInfo: UserInfo
};
```

**后端路由组件返回以下格式**

```js

{
  name: "home",
  path: "/",
  component: "home"
},
{
  name: "home",
  path: "/userinfo",
  component: "userInfo"
}
```

在将后端返回路由通过 addRoutes动态挂载之间，需要将数据处理一下，将component字段换为真正的组件

如果有嵌套路由，后端功能设计的时候，要注意添加相应的字段，前端拿到数据也要做相应的处理这种方法也会存在缺点：

全局路由守卫里，每次路由跳转都要做判断

- 前后端的配合要求更高

### 按钮权限与方案选择

**按钮权限**

**按钮权限方案一**

按钮权限也可以用 v-if 判断

但是如果页面过多，每个页面页面都要获取用户权限 role 和路由表里的 meta.btnPermissions，然后再做判断

这种方式就不展开举例了

**按钮权限方案二**

通过自定义指令进行按钮权限的判断

首先配置路由

```js
{
  path: '/permission',
  component: Layout,
  name：'权限测试'，
  meta: {
    btnPermissions: ['admin', 'supper', 'normal']
  },
  //页面需要的权限
  children: [{
      path: 'supper',
      component: _import('system/supper'),
      name：「权限测试页'
      meta: {
        btnPermissions: ['admin','supper']
      }//页面需要的权限
    },
    {
      path: 'normal',
      component: _import('system/normal'),
      name：'权限测试页'
      meta: {
        btnPermissions: ['admin']
      }//页面需要的权限
    }]
}
```

**自定义权限鉴定指令**

```js
import Vue from 'vue'
/**权限指令**/
const has = Vue.directive('has', {
    bind: function (el, binding, vnode) {
      //获取页面按钮权限
      let btnPermissionsArr = [];
      if(binding.value){
        //如果指令传值，获取指令参数，根据指令参数和当前登录人按钮权限做比较。
        btnPermissionsArr = Array.of(binding.value);
      }else{
        //否则获取路由中的参数，根据路由的btnPermissionsArr和当前登录人按钮权
        限做比较。
        btnPermissionsArr = vnode.context.$route.meta.btnPermissions;
      }
      if (!Vue.prototype.$_has(btnPermissionsArr)) {
        el.parentNode.removeChild(el);
      }
    }
  });
// 权限检查方法
Vue.prototype.$_has = function (value) {
  let isExist = false;
  //获取用户按钮权限
  let btnPermissionsStr = sessionStorage.getItem("btnPermissions");
  if (btnPermissionsStr == undefined || btnPermissionsStr == null) {
    return false;
  }
  if (value.indexOf(btnPermissionsStr) > -1) {
    isExist = true;
  }
  return isExist;
};
export {has}
```

在使用的按钮中只需要引用 v-has 指令

```js
<el-button @click='editClick'type="primary" v-has>编辑</el-button>
```

**小结**

关于权限如何选择哪种合适的方案，可以根据自己项目的方案项目，如考虑路由与菜单是否分离

```js
<keep-alive>
<component :is="view"></component>
</keep-alive>
```

## 24. 说说你对keep-alive的理解是什么？

### 缓存能力与生命周期

keep-alive是vue中的内置组件，能在组件切换过程中将状态保留在内存中，防止重复渲染DOM

keep-alive包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们

keep-alive 可以设置以下props属性：

include-字符串或正则表达式。只有名称匹配的组件会被缓存

exclude-字符串或正则表达式。任何名称匹配的组件都不会被缓存

max-数字。最多可以缓存多少组件实例

关于keep-alive的基本用法：

使用 includes 和 exclude

```html
<keep-alive include="a,b">
<component :is="view"></component>
</keep-alive>

<!--正则表达式（使用`v-bind`） -->
<keep-alive :include="/a|b/">
<component :is="view"></component>
</keep-alive>

<!--数组（使用`v-bind`）-->
<keep-alive :include="['a', 'b']">
<component :is="view"></component>
</keep-alive>
```

匹配首先检查组件自身的 name 选项，如果 name 选项不可用，则匹配它的局部注册名称(父组件components 选项的键值)，匿名组件不能被匹配

设置了keep-alive缓存的组件，会多出两个生命周期钩子（activated与deactivated）：

首次进入组件时： beforeRouteEnter V beforeCreate > created> mounted a
ctivated >……> beforeRouteLeave > deactivated

再次进入组件时：beforeRouteEnter > activated >......> beforeRouteLeave V
deactivated

### 路由缓存场景

使用原则：当我们在某些场景下不需要让页面重新加载时我们可以使用keepalive

举个栗子:

当我们从 首页一>列表页一> 商详页一> 再返回，这时候列表页应该是需要 keep-alive

从 首页 一> 列表页 一> 商详页 一> 返回到列表页(需要缓存)一> 返回到首页(需要缓存)一> 再次进入列表页(不需要缓存)，这时候可以按需来控制页面的keep-alive

在路由中设置keepAlive属性判断是否需要缓存

```js
{
  path: 'list',
  name:'itemList'，// 列表页
  component (resolve) {
    require(['@/pages/item/list'], resolve)
  },
  meta: {
    keepAlive: true,
    title:'列表页'
  }
}
```

使用 <keep-alive>

```html
<div id="app" class='wrapper'>
<keep-alive>
<!-- 需要缓存的视图组件 -->
<router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
<!-- 不需要缓存的视图组件 -->
<router-view v-if="!$route.meta.keepAlive"></router-view>
</div>
```

### 缓存实现原理

keep-alive 是 vue 中内置的一个组件

源码位置：src/core/components/keep-alive.js

```js
export default {
name: 'keep-alive',
abstract: true,

props: {
include: [String, RegExp, Array],
exclude: [String, RegExp, Array],
max: [String, Number]
},

created ( ) {
this.cache = Object.create(null)
this.keys = []
},

destroyed () {
for (const key in this.cache) {
pruneCacheEntry(this.cache, key, this.keys)
}
},

mounted ( ) {
this.$watch('include', val => {
pruneCache(this, name => matches(val, name))
})
this.$watch('exclude', val => {
pruneCache(this, name => !matches(val, name))
})
},

render()
/* 获取默认插槽中的第一个组件节点 */
constslot = this.$slots.default
constvnode = getFirstComponentChild(slot)
/* 获取该组件节点的 componentOptions */
const componentOptions =vnode && vnode.componentOptions

if (componentOptions) {
/*获取该组件节点的名称，优先获取组件的name字段，如果name不存在则获取组件的tag
*/
const name = getComponentName(componentOptions)

const { include, exclude } = this
/*如果name不在include中或者存在于exclude中则表示不缓存，直接返回vnode */
if (
(include && (!name || !matches(include, name))) ||
// excluded

(exclude && name && matches(exclude, name))

) {

return vnode

}

const { cache, keys } = this

/*获取组件的key值*/

const key = vnode.key == null

// same constructor may get registered as different local componen
ts

// so cid alone is not enough (#3269)

? componentOptions.Ctor.cid + (componentOptions.tag ?`::${compone
ntOptions.tag}: '')

: vnode.key

/* 拿到key值后去this.cache对象中去寻找是否有该值，如果有则表示该组件有缓存，即
命中缓存 */

if (cache[key]) {

vnode.componentInstance =cache[key].componentInstance

// make current key freshest

remove(keys, key)

keys.push(key)

}

/*如果没有命中缓存，则将其设置进缓存*/

else {

cache[key] = vnode

keys.push(key)

// prune oldest entry

/*如果配置了max并且缓存的长度超过了this.max，则从缓存中删除第一个*/

if (this.max && keys.length > parseInt(this.max)) {

pruneCacheEntry(cache, keys[0], keys, this._vnode)

}

vnode.data.keepAlive = true

return vnode || (slot && slot[0])

}
```

可以看到该组件没有template，而是用了 render，在组件渲染的时候会自动执行render函数this.cache是一个对象，用来存储需要缓存的组件，它将以如下形式存储：

```js
this.cache = {
  'key1':'组件1',
  'key2':'组件2',
  // ...
}
```

在组件销毁的时候执行pruneCacheEntry函数

```ts
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  /*判断当前没有处于被渲染状态的组件，将其销毁*/
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}
```

在mounted 钩子函数中观测 include 和 exclude 的变化，如下：

```js
mounted ()
this.$watch('include', val => {
pruneCache(this, name => matches(val, name))
})
this.$watch('exclude', val => {
pruneCache(this, name => !matches(val, name))

}
```

如果include 或exclude发生了变化，即表示定义需要缓存的组件的规则或者不需要缓存的组件的规则发生了变化，那么就执行pruneCache函数，函数如下：

```js
function pruneCache (keepAliveInstance, filter) {
  const { cache, keys, \_vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode = cache[key]
    if (cachedNode) {
      const name = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, \_vnode)
      }
    }
  }
}
```

在该函数内对this.cache对象进行遍历，取出每一项的name值，用其与新的缓存规则进行匹配，如果匹配不上，则表示在新的缓存规则下该组件已经不需要被缓存，则调用pruneCacheEntry函数将其从 this.cache对象剔除即可

关于keep-alive的最强大缓存功能是在 render函数中实现

首先获取组件的 key 值：

```js
const key = vnode.key == null
? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
: vnode.key
```

拿到key值后去 this.cache对象中去寻找是否有该值，如果有则表示该组件有缓存，即命中缓存，如下：

```js
/*如果命中缓存，则直接从缓存中拿vnode的组件实例*/
if (cache[key]) {
  vnode.componentInstance = cache[key].componentInstance
  /*调整该组件key的顺序，将其从原来的地方删掉并重新放在最后一个*/
  remove(keys, key)
  keys.push(key)
}
```

直接从缓存中拿 vnode的组件实例，此时重新调整该组件key的顺序，将其从原来的地方删掉并重新放在 this.keys 中最后一个

this.cache对象中没有该key值的情况，如下：

```js
/* 如果没有命中缓存，则将其设置进缓存 */
else {
  cache[key] = vnode
  keys.push(key)
  /* 如果配置了max并且缓存的长度超过了this.max，则从缓存中删除第一个 */
  if (this.max && keys.length > parseInt(this.max)) {
    pruneCacheEntry(cache, keys[0], keys, this.\_vnode)
  }
}
```

表明该组件还没有被缓存过，则以该组件的 key为键，组件vnode为值，将其存

此时再判断 this.keys 中缓存组件的数量是否超过了设置的最大缓存数量值 this.max，如果超过了，则把第一个缓存组件删掉

### 缓存后的数据刷新

解决方案可以有以下两种：

- beforeRouteEnter

- actived

**beforeRouteEnter**

每次组件渲染的时候，都会执行beforeRouteEnter

```js
beforeRouteEnter(to, from, next){
  next(vm=>{
      console.log(vm)
      // 每次进入路由执行
      vm.getData()// 获取数据
    })
},
```

**actived**

在keep-alive缓存的组件被激活的时候，都会执行actived钩子

```js
activated(){
  this.getData() // 获取数据
}，
```
注意:服务器端渲染期间avtived不被调用

## 25. 你对SPA单页面的理解，它的优缺点分别是什么？如何实现SPA应用呢

### SPA 与 MPA 的差异

SPA(single-pageapplication)，翻译过来就是单页应用 SPA是一种网络应用程序或网站的模型，它通过动态重写当前页面来与用户交互，这种方法避免了页面之间切换打断用户体验在单页应用中，所有必要的代码（HTML、JavaScript和CSS）都通过单个页面的加载而检索，或者根据需要(通常是为响应用户操作）动态装载适当的资源并添加到页面页面在任何时间点都不会重新加载，也不会将控制转移到其他页面举个例子来讲就是一个杯子，早上装的牛奶，中午装的是开水，晚上装的是茶，我们发现，变的始终是杯子里的内容，而杯子始终是那个杯子。

我们熟知的JS框架如react，vue，angular，ember都属于 SPA

**SPA和MPA的区别**

上面大家已经对单页面有所了解了，下面来讲讲多页应用MPA(MultiPage-pageapplication)，翻译过来就是多页应用在MPA中，每个页面都是一个主页面，都是独立的当我们在访问另一个页面的时候，都需要重新加载html、css、js文件，公共文件则根据需求按需加载。

**单页应用与多页应用的区别**

- 单页面应用(SPA) | 多页面应用(MPA)
- 组成 | 一个主页面和多个页面片段 | 多个主页面
- 刷新方式 | 局部刷新 | 整页刷新
- url模式 | 哈希模式 | 历史模式
- SEO搜索引擎优化 | 难实现，可使用SSR方式改善 | 容易实现
- 数据传递 | 容易 | 通过url、cookie、localStorage等传递
- 页面切换 | 速度快，用户体验良好 | 切换加载资源，速度慢，用户体验差
- 维护成本 | 相对容易 | 相对复杂

### 优缺点

优点：

具有桌面应用的即时性、网站的可移植性和可访问性

- 用户体验好、快，内容的改变不需要重新加载整个页面

- 良好的前后端分离，分工更明确

缺点：

- 不利于搜索引擎的抓取

- 首次渲染速度相对较慢

### 路由实现原理

**原理**

1. 监听地址栏中 hash 变化驱动界面变化

2. 用pushsate 记录浏览器的历史，驱动界面发送变化

**实现**

**hash 模式**

核心通过监听url中的hash来进行路由跳转

```js
// 定义 Router
class Router {
  constructor () {
    this.routes = {}; // 存放路由path及callback
    this.currentUrl = '';

    //监听路由change调用相对应的路由回调
    window.addEventListener('load', this.refresh, false);
    window.addEventListener('hashchange', this.refresh, false);
  }

  route(path, callback){
    this.routes[path] = callback;
  }

  push(path) {
    this.routes[path] && this.routes[path]()
  }
}

// 使用 router
window.miniRouter = new Router();
miniRouter.route('/', () => console.log('page1'))
miniRouter.route('/page2', () => console.log('page2'))

miniRouter.push('/') // page1
miniRouter.push('/page2') // page2
```

**history模式**

history 模式核心借用 HTML5 history api，api 提供了丰富的 router 相关属性先了解一个几个相关的api

history.pushState 浏览器历史纪录添加记录

history.replaceState修改浏览器历史纪录中当前纪录

history.popState 当history 发生变化时触发

```js
// 定义 Router
class Router {
constructor () {
this.routes = {};
this.listerPopState()
}

init(path) {
history.replaceState({path: path}, null, path);
this.routes[path] && this.routes[path]();

route(path, callback){
this.routes[path] = callback;
}

push(path) {
history.pushState({path: path}, null, path);
this.routes[path] && this.routes[path]();
}

listerPopState () {
window.addEventListener('popstate', e => {
const path = e.state && e.state.path;
this.routers[path] && this.routers[path]()
})
}
}

// 使用 Router

window.miniRouter = new Router();
miniRouter.route('/', ()=> console.log('page1'))
miniRouter.route('/page2', ()=> console.log('page2'))

//跳转
miniRouter.push('/page2') // page2
```

### SEO 方案

下面给出基于 Vue的 SPA 如何实现 SE0的三种方式

**1. SSR服务端渲染**

将组件或页面通过服务器生成html，再返回给浏览器，如 nuxt.js

**2. 静态化**

目前主流的静态化主要有两种：(1)一种是通过程序将动态页面抓取并保存为静态页面，这样的页面的实际存在于服务器的硬盘中(2)另外一种是通过WEB服务器的URLRewrite的方式，它的原理是通过web服务器内部模块按一定规则将外部的URL请求转化为内部的文件地址，一句话来说就是把外部请求的静态地址转化为实际的动态页面地址，而静态页面实际是不存在的。这两种方法都达到了实现URL静态化的效果

**3. 使用 Phantomjs 针对爬虫处理**

原理是通过Nginx配置，判断访问来源是否为爬虫，如果是则搜索引擎的爬虫请求会转发到一个node server，再通过PhantomJS来解析完整的HTML，返回给爬虫。下面是大致流程图

## 26. SPA首屏加载速度慢的怎么解决?

### 首屏指标与慢因

首屏时间(First Contentful Paint)，指的是浏览器从响应用户输入网址地址，到首屏内容渲染完成的时间，此时整个网页不一定要全部渲染完成，但需要展示当前视窗需要的内容

首屏加载可以说是用户体验中最重要的环节

**关于计算首屏时间**

利用 performance.timing 提供的数据：

通过 DOMContentLoad或者 performance 来计算出首屏时间

```js
//方案一：
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('first contentful painting');
  });
// 方案二:
performance.getEntriesByName("first-contentful-paint")[0].startTime

// performance.getEntriesByName("first-contentful-paint")[0]
// 会返回一个 PerformancePaintTiming的实例，结构如下：
{
  name:"first-contentful-paint",
  entryType: "paint",
  startTime:507.80000002123415,
  duration: 0,
};
```

**加载慢的原因**

在页面渲染的过程，导致加载速度慢的因素可能如下：

网络延时问题

资源文件体积是否过大

- 资源是否重复发送请求去加载了

- 加载脚本的时候，渲染内容堵塞了

### 代码拆分与缓存

常见的几种SPA首屏优化方式

- 减小入口文件积

静态资源本地缓存

UI框架按需加载

图片资源的压缩

- 组件重复打包

- 开启GZip压缩

使用SSR

**减小入口文件体积**

常用的手段是路由懒加载，把不同路由对应的组件分割成不同的代码块，待路由被请求的时候会单独打包路由，使得入口文件变小，加载速度大大增加

在vue-router配置路由的时候，采用动态加载路由的形式

```js
routes:[
path: 'Blogs',
name: 'ShowBlogs',
component: () => import('./components/ShowBlogs.vue')
```

以函数的形式加载路由，这样就可以把各自的路由文件分别打包，只有在解析给定的路由时，才会加载路由组件

**静态资源本地缓存**

后端返回资源问题：

- 采用 HTTP 缓存，设置 Cache-Control，Last-Modified，Etag 等响应头

采用 Service Worker 离线缓存

前端合理利用 localStorage

### 依赖与静态资源优化

**UI框架按需加载**

在日常使用 UI框架，例如 element-UI、或者 antd，我们经常性直接引用整个 UI库

```js
import ElementUI from 'element-ui'
Vue.use(ElementUI)
```

但实际上我用到的组件只有按钮，分页，表格，输入与警告所以我们要按需引用

```js
import { Button, Input, Pagination, Table, TableColumn, MessageBox } from
```

'element-ui';
```js
Vue.use(Button)
Vue.use(Input)
Vue.use(Pagination)
```

**组件重复打包**

假设A.js文件是一个常用的库，现在有多个路由使用了A.js文件，这就造成了重复下载

1minChunks:3

解决方案：在webpack的config 文件中，修改CommonsChunkPlugin的配置

minChunks为3表示会把使用3次及以上的包抽离出来，放进公共依赖文件，避免了重复加载组件

**图片资源的压缩**

图片资源虽然不在编码过程中，但它却是对页面性能影响最大的因素

对于所有的图片资源，我们可以进行适当的压缩

对页面上使用到的icon，可以使用在线字体图标，或者雪碧图，将众多小图标合并到同一张图上，用以减轻http请求压力。

### 压缩、SSR 与总结

**开启GZip压缩**

拆完包之后，我们再用 gzip做一下压缩 安装compression-webpack-plugin

```js
cnmp i compression-webpack-plugin -D
```

在vue.congig.js中引入并修改webpack配置

```js
const CompressionPlugin = require('compression-webpack-plugin')

configureWebpack: (config) => {
if(process.env.NODE_ENV === 'production') {
//为生产环境修改配置...
config.mode = 'production'
return {
plugins: [new CompressionPlugin({
test：/\.js$|\.html$|\.css/，//匹配文件名
threshold:10240，//对超过10k的数据进行压缩
deleteOriginalAssets: false //是否删除原文件
})]
}
}
```

在服务器我们也要做相应的配置如果发送请求的浏览器支持gzip，就发送给它 gzip格式的文件我的服务器是用express框架搭建的只要安装一下compression就能使用

```js
const compression = require('compression')
app.use(compression())// 在其他中间件使用之前调用
```

**使用SSR**

SSR(Server side），也就是服务端渲染，组件或页面通过服务器生成html字符串，再发送到浏览器从头搭建一个服务端渲染是很复杂的，vue应用建议使用Nuxt.js 实现服务端渲染

**小结**

减少首屏渲染时间的方法有很多，总的来讲可以分成两大部分：资源加载优化和页面渲染优化。

大家可以根据自己项目的情况选择各种方式进行首屏渲染的优化

## 27. Vue项目本地开发完成后部署到服务器后报404是什么原因呢?

```html
server {
listen 80;
server_name www.xxx.com;

location / {
index /data/dist/index.html;
}
}
```

### 部署流程

前后端分离开发模式下，前后端是独立布署的，前端只需要将最后的构建物上传至目标服务器的web容器指定的静态目录下即可

我们知道vue项目在构建后，是生成一系列的静态文件

常规布署我们只需要将这个目录上传至目标服务器即可

```bash
//scp 上传user为主机登录用户，host为主机外网ip，xx为web容器静态资源路径
scp dist.zip user@host:/xx/xx/xx
```

让 web 容器跑起来，以nginx为例

配置完成记得重启 nginx

```bash
//检查配置是否正确
nginx -t
// 平滑重启
nginx -s reload
```

操作完后就可以在浏览器输入域名进行访问了

当然上面只是提到最简单也是最直接的一种布署方式

什么自动化，镜像，容器，流水线布署，本质也是将这套逻辑抽象，隔离，用程序来代替重复性的劳动，本文不展开

### History 模式刷新 404 的原因

这是一个经典的问题，相信很多同学都有遇到过，那么你知道其真正的原因吗？

我们先还原一下场景：

vue项目在本地时运行正常，但部署到服务器中，刷新页面，出现了404错误

先定位一下，HTTP404错误意味着链接指向的资源不存在

问题在于为什么不存在？且为什么只有history模式下会出现这个问题？

**为什么history模式下有问题**

ue 是属于单页应用(single-page application)

而SPA是一种网络应用程序或网站的模型，所有用户交互是通过动态重写当前页面，前面我们也看到了，不管我们应用有多少页面，构建物都只会产出一个index.html

现在，我们回头来看一下我们的nginx配置

```js
server {
  listen 80;
  server\_name www.xxx.com;
  location / {
    index /data/dist/index.html;
  }
}
```

可以根据 nginx 配置得出，当我们在地址栏输入www.xxx.com 时，这时会打开我们 dist目录下的index.html 文件，然后我们在跳转路由进入到www.xxx.com/login

关键在这里，当我们在 website.com/login 页执行刷新操作，nginx location 是没有相关配置的，所以就会出现404的情况

**为什么hash模式下没有问题**

router hash 模式我们都知道是用符号#表示的，如website.com/#/login，hash 的值为#/login

它的特点在于： hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对服务端完全没有影响，因此改变 hash 不会重新加载页面

hash 模式下，仅 hash 符号之前的内容会被包含在请求中，如 website.com/#/login 只有website.com 会被包含在请求中，因此对于服务端来说，即使没有配置location，也不会返回404错误

### 服务端回退配置

看到这里我相信大部分同学都能想到怎么解决问题了，

产生问题的本质是因为我们的路由是通过JS来执行视图切换的，

当我们进入到子路由时刷新页面，web容器没有相对应的页面此时会出现404

所以我们只需要配置将任意页面都重定向到 index.html，把路由交由前端处理

对 nginx 配置文件.conf 修改，添加 try\_files \$uri \$uri/ /index.html;

```bash
server {
listen 80;
server\_name www.xxx.com;
location / {
index /data/dist/index.html;
try\_files \$uri \$uri/ /index.html;
}
}
```

修改完配置文件后记得配置的更新

1 nginx -s reload

这么做以后，你的服务器就不再返回404 错误页面，因为对于所有路径都会返回 index.html 文件为了避免这种情况，你应该在Vue 应用里面覆盖所有的路由情况，然后在给出一个404页面

```js
const router = new VueRouter({
    mode: 'history',
    routes: [
      { path: '*', component: NotFoundComponent }
    ]
  })
```

## 28. SSR解决了什么问题？有做过SSR吗？你是怎么做的？

### SSR 的工作方式

Server-Side Rendering 我们称其为SSR，意为服务端渲染

指由服务侧完成页面的HTML结构拼接的页面处理技术，发送到浏览器，然后为其绑定状态与事件，成为完全可交互页面的过程

先来看看Web 3个阶段的发展史：

传统服务端渲染SSR

- 单页面应用SPA

服务端渲染SSR

**传统web开发**

网页内容在服务端渲染完成，一次性传输到浏览器

打开页面查看源码，浏览器拿到的是全部的dom结构

**单页应用SPA**

单页应用优秀的用户体验，使其逐渐成为主流，页面内容由JS渲染出来，这种方式称为客户端渲打开页面查看源码，浏览器拿到的仅有宿主元素#app，并没有内容

**服务端渲染SSR**

SSR解决方案，后端渲染出完整的首屏的dom结构返回，前端拿到的内容包括首屏及完整spa结构，应用激活后依然按照 spa 方式运行

看完前端发展，我们再看看Vue官方对 SSR的解释：

ue.js是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出Vue组件，进行生成DOM和操作DOM。然而，也可以将同一个组件渲染为服务器端的HTML字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序

服务器渲染的Vue.js应用程序也可以被认为是"同构"或"通用"，因为应用程序的大部分代码都可以在服务器和客户端上运行

我们从上门解释得到以下结论:

ue SSR是一个在SPA上进行改良的服务端渲染

通过 Vue SSR 渲染的页面，需要在客户端激活才能实现交互

ue SSR将包含两部分：服务端渲染的首屏，包含交互的SPA

### 解决的问题与代价

SSR主要解决了以下两种问题：

seo:搜索引擎优先爬取页面 HTML 结构，使用 ssr时，服务端已经生成了和业务想关联的HTML，有利于 seo

首屏呈现渲染：用户无需等待页面所有js加载完成就可以看到页面视图(压力来到了服务器，所以需要权衡哪些用服务端渲染，哪些交给客户端

但是使用 SSR同样存在以下的缺点：

- 复杂度：整个项目的复杂度

- 库的支持性，代码兼容

- 性能问题

- 每个请求都是n个实例的创建，不然会污染，消耗会变得很大

缓存 node serve、nginx判断当前用户有没有过期，如果没过期的话就缓存，用刚刚的结果。

降级：监控cpu、内存占用过多，就spa，返回单个的壳

- 服务器负载变大，相对于前后端分离服务器只需要提供静态资源来说，服务器负载更大，所以要慎

**使用前评估**

所以在我们选择是否使用SSR前，我们需要慎重问问自己这些问题：

1. 需要 SE0的页面是否只是少数几个，这些是否可以使用预渲染(Prerender SPA Plugin)实现

2. 首屏的请求响应逻辑是否复杂，数据返回是否大量且缓慢

### 同构应用结构

对于同构开发，我们依然使用webpack打包，我们要解决两个问题：服务端首屏渲染和客户端激活这里需要生成一个服务器bundle文件用于服务端首屏渲染和一个客户端bundle文件用于客户端激活

代码结构除了两个不同入口之外，其他结构和之前vue应用完全相同

```js
src
router
index.js # 路由声明
store
index.js # 全局状态
main.js #用于创建vue实例
entry-client.js #客户端入口，用于静态内容“激活”
entry-server.js #服务端入口，用于首屏内容渲染
```

**路由配置**

```js
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
//导出工厂函数

export function createRouter() {
return new Router({
mode: 'history',
routes:[
//客户端没有编译器，这里要写成渲染函数
{ path: "/", component: { render: h => h('div', 'index page')
}}
{ path: "/detail", component: { render: h => h('div', 'detail
page')} }

});
}
```

**主文件main.js**

跟之前不同，主文件是负责创建vue实例的工厂，每次请求均会有独立的vue实例创建

```js
import Vue from "vue";
import App from "./App.vue";
import { createRouter } from "./router";
//导出Vue实例工厂函数，为每次请求创建独立实例
//上下文用于给vue实例传递参数
export function createApp(context) {
  const router = createRouter();
  constapp = new Vue({
      router,
      context,
      render: h => h(App)
    });
  return { app, router };
}
```

编写服务端入口 src/entry-server.js

它的任务是创建Vue实例并根据传入 url指定首屏

```js
import { createApp } from "./main";
//返回一个函数，接收请求上下文，返回创建的vue实例
export default context => {
  //这里返回一个Promise，确保路由或组件准备就绪
  return new Promise((resolve, reject) => {
      const { app, router } = createApp(context);
      // 跳转到首屏的地址
      router.push(context.url);
      // 路由就绪，返回结果
      router.onReady(() => {
          resolve(app);
        }, reject);
    });
};
```

编写客户端入口 entry-client.js

客户端入口只需创建vue实例并执行挂载，这一步称为激活

```js
import { createApp } from "./main";
// 创建vue、router实例
const { app, router } = createApp();
// 路由就绪，执行挂载
router.onReady(() => {
    app.$mount("#app");
  });
```

### 构建、数据预取与激活

**对 webpack 进行配置**

**安装依赖**

```js
npminstall webpack-node-externals lodash.merge -D
```

对 vue.config.js 进行配置

```js
//两个插件分别负责打包客户端和服务端
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const nodeExternals = require("webpack-node-externals");
const merge = require("lodash.merge");
//根据传入环境变量决定入口文件和相应配置项
const TARGET NODE = process.env.WEBPACK TARGET === "node":
const target = TARGET_NODE ? "server" : "client";
module.exports = {
CSS: {
extract: false
},
outputDir:'./dist/'+target,
configureWebpack: () => ({
// 将 entry 指向应用程序的 server / client 文件
entry:`./src/entry-${target}.js`,
// 对 bundle renderer 提供 source map 支持
devtool: 'source-map',
//target设置为node使webpack以Node适用的方式处理动态导入，
//并且还会在编译Vue组件时告知`vue-loader`输出面向服务器代码。
target: TARGET_NODE ? "node" : "web",
//是否模拟node全局变量
node: TARGET_NODE ? undefined : false,
output: {
//此处使用Node风格导出模块
libraryTarget: TARGET_NODE ? "commonjs2" : undefined
},
// https://webpack.js.org/configuration/externals/#function
// https://github.com/liady/webpack-node-externals
//外置化应用程序依赖模块。可以使服务器构建速度更快，并生成较小的打包文件。
externals: TARGET_NODE
nodeExternals({
//不要外置化webpack需要处理的依赖模块。
//可以在这里添加更多的文件类型。例如，未处理*.vue原始文件，
//还应该将修改`global、(例如polyfill)的依赖模块列入白名单
whitelist: [/\.css$/]
})
: undefined,
optimization: {
splitChunks: undefined
},
//这是将服务器的整个输出构建为单个JSON文件的插件。
//服务端默认文件名为`vue-ssr-server-bundle.json
// 客户端默认文件名为`vue-ssr-client-manifest.json`。
plugins: [TARGET_NODE ? new VueSSRServerPlugin() : new
```

```js
VueSSRClientPlugin()]
}),

chainWebpack: config => {

// cli4项目添加

if (TARGET_NODE) {

config.optimization.delete('splitChunks')

}

config.module

.rule("vue")

.use("vue-loader")

.tap(options => {

merge(options, {

optimizeSSR: false

});

});

}

};
```

对脚本进行配置，安装依赖

1 npm i cross-env -D

定义创建脚本 package.json

```js
"scripts": {
  "build:client": "vue-cli-service build",
  "build:server": "cross-env WEBPACK\_TARGET=node vue-cli-service build",
  "build": "npm run build:server && npm run build:client"
}
```

执行打包：npm run build

最后修改宿主文件/public/index.html

```js
npm install -S vuex
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"content="width=device-width,initial-scale=1.
">
<title>Document</title>
</head>
<body>
<!--vue-ssr-outlet-->
</body>
</html>
```

是服务端渲染入口位置，注意不能为了好看而在前后加空格

安装 vuex

创建 vuex 工厂函数

```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export function createStore () {
return new Vuex.Store({
state: {
count:108

mutations: {
add(state){
state.count += 1;

}
})
}
```

在main.js 文件中挂载 store

```ts
import { createStore } from './store'
export function createApp (context) {
  //创建实例
  const store = createStore()
  const app = new Vue({
      store，// 挂载
      render: h => h(App)
    })
  return { app, router, store }
}
```

服务器端渲染的是应用程序的"快照"，如果应用依赖于一些异步数据，那么在开始渲染之前，需要先预取和解析好这些数据

在store 进行一步数据获取

```js
export function createStore() {
  return new Vuex.Store({
      mutations: {
        // 加一个初始化
        init(state, count) {
          state.count = count;
        },
      },
      actions: {
        // 加一个异步请求count的action
        getCount({ commit }) {
          return new Promise(resolve => {
              setTimeout(() => {
                  commit("init", Math.random() * 100);
                  resolve();
                }, 1000);
            });
        },
      },
    });
}
```

组件中的数据预取逻辑

```js
export default {
  asyncData({ store, route }) { // 约定预取逻辑编写在预取钩子asyncData中
    // 触发 action 后，返回 Promise 以便确定请求结果
    return store.dispatch("getCount");
  }
};
```

服务端数据预取， entry-server.js

```js
import { createApp } from "./app";
export default context => {
  return new Promise((resolve, reject) => {
      // 拿出store和router实例
      const { app, router, store } = createApp(context);
      router.push(context.url);
      router.onReady(() => {
          //获取匹配的路由组件数组
          const matchedComponents = router.getMatchedComponents();

          //若无匹配则抛出异常
          if (!matchedComponents.length) {
            return reject({ code: 404 });
          }

          //对所有匹配的路由组件调用可能存在的`asyncData()
          Promise.all(
            matchedComponents.map(Component => {
                if (Component.asyncData) {
                  return Component.asyncData({
                      store,
                      route: router.currentRoute,
                    });
                }
              }),
          )
          .then(() => {
              //所有预取钩子 resolve后，
              // store 已经填充入渲染应用所需状态
              //将状态附加到上下文，且template选项用于renderer时，
              //状态将自动序列化为`window.__INITIAL_STATE_`，并注入HTML
              context.state = store.state;
              resolve(app);
            })
          .catch(reject);
        }, reject);
    });
};
```

客户端在挂载到应用程序之前，store 就应该获取到状态，entry-client.js

```js
// 导出store
const { app, router, store } = createApp();
//当使用 template 时，context.state将作为window._INITIAL_STATE_状态自动嵌
入到最终的 HTML
//在客户端挂载到应用程序之前，store 就应该获取到状态：
if (window.__INITIAL_STATE_) {
  store.replaceState(window._INITIAL_STATE_);
}
```

**客户端数据预取处理， main.js**

```js
Vue.mixin({
    beforeMount() {
      const { asyncData } = this.$options;
      if (asyncData) {
        // 将获取数据操作分配给promise
        //以便在组件中，我们可以在数据准备就绪后
        //通过运行this.dataPromise.then(...)来执行其他任务
        this.dataPromise = asyncData({
            store: this.$store,
            route: this.$route,
          });
      }
    },
  });
```

**修改服务器启动文件**

```js
// 获取文件路径
const resolve = dir => require('path').resolve(__dirname, dir)
//第1 步：开放dist/client目录，关闭默认下载index页的选项，不然到不了后面路由
app.use(express.static(resolve('../dist/client'), {index: false}))
// 第 2 步：获得一个createBundleRenderer
const { createBundleRenderer } = require("vue-server-renderer");
// 第 3 步：服务端打包文件地址
const bundle = resolve("../dist/server/vue-ssr-server-bundle.json");
// 第 4 步：创建渲染器
const renderer = createBundleRenderer(bundle, {
runInNewContext: false,// https://ssr.vuejs.org/zh/api/#runinnewconte
xt
template: require('fs').readFileSync(resolve("../public/index.html"),
"utf8")，//宿主文件
clientManifest: require(resolve("../dist/client/vue-ssr-clientmanifes
t.json")) //客户端清单
});
app.get('*', async (req,res)=>{
//设置url和title两个重要参数
const context = {
title:'ssr test',
url:req.url
}
const html = await renderer.renderToString(context);
res.send(html)
})
```

**小结**

使用 ssr 不存在单例模式，每次用户请求都会创建一个新的 vue 实例

实现 ssr 需要实现服务端首屏渲染和客户端激活

服务端异步获取数据 asyncData可以分为首屏异步获取和切换组件获取首屏异步获取数据，在服务端预渲染的时候就应该已经完成

切换组件通过mixin混入，在beforeMount钩子完成数据获取

## 29. Vue3有了解过吗？能说说跟Vue2的区别吗?

### Vue 3 的设计方向

关于vue3的重构背景，尤大是这样说的：

「Vue新版本的理念成型于2018年末，当时Vue2的代码库已经有两岁半了。比起通用软件的生命周期来这好像也没那么久，但在这段时期，前端世界已经今昔非比了

在我们更新(和重写）Vue的主要版本时，主要考虑两点因素：首先是新的JavaScript语言特性在主流浏览器中的受支持水平；其次是当前代码库中随时间推移而逐渐暴露出来的一些设计和架构问题」

简要就是：

利用新的语言特性(es6)

解决架构问题

**哪些变化**

**What's coming in Vue 3.0**

Make it faster

- Make it smaller

- Make it more maintainable

- Make it easier to target native

- Make your life easier

Vue3 的新特性概览如下：

· 速度更快

- 体积减少

- 更易维护

- 更接近原生

- 更易使用

**速度更快**

vue3 相比 vue2

- 重写了虚拟 Dom 实现

- 编译模板的优化

- 更高效的组件初始化

undate性能提高1.3\~2倍

SSR速度提高了2\~3倍

**Performance**

Rewritten virtual dom implementation Compiler-informed fast paths More efficient component initialization 1.3\~2x better update performance 2\~3x faster SSR\*

**体积更小**

通过 webpack的 tree-shaking功能，可以将无用模块“剪辑”，仅打包需要的

能够tree-shaking，有两大好处：

对开发人员，能够对vue实现更多其他的功能，而不必担忧整体体积过大

- 对使用者，打包出来的包体积变小了

vue可以开发出更多其他的功能，而不必担忧vue打包出来的整体体积过多

**Tree-shaking**

- Most optional features (e.g. v-model, <transition>) are now tree-shakable

Bare-bone HelloWorld size: 13.5kb

0 11.75kb with only Composition API support

All runtime features included: 22.5kb

0 More features but still lighter than Vue 2

**更易维护**

**compositon Api**

- 可与现有的 Options API一起使用

- 灵活的逻辑组合与复用

ue3 模块可以和其他框架搭配使用

**Composition API**

Usable alongside existing Options API Flexible logic composition and reuse Reactivity module can be used as a standalone library

**更好的Typescript支持**

UE3是基于 typescipt编写的，可以享受到自动的类型定义提示

Better TypeScript Support

Codebase written in TS w/ auto-generated type definitions

- API is the same in JS and TS In fact, code will also be largely the same

TSX support

- Class component is still supported (vue-classcomponent@next is currently in alpha)

**编译器重写**

**Compiler Rewrite**

Pluggable architecture

Parser w/ location info (source maps!)

Serve as infrastructure for more robust IDE support

**更接近原生**

可以自定义渲染API

**Custom Renderer API**

import { createRenderer } from '@vue/runtime-core'

const { render } = createRenderer({ nodeOps,
patchData

**更易使用**

响应式 Api 暴露出来

**Exposed reactivity API**

import { observable, effect } from 'vue'

const state = observable({ count: 0
3)
effect(() => {
console.log(\`count is: \${state.count}\`)
}） // count is：0

state.count++ // count is: 1

轻松识别组件重新渲染原因

Easily identify why a component is re-rendering

const Comp = { render(props) { return h('div', props.count) }， renderTriggered(event) { debugger }
}

### 新增能力

ue3中需要关注的一些新功能包括：

- framents

- Teleport

- composition Api

- createRenderer

**framents**

在 Vue3.x中，组件现在支持有多个根节点

```js
<!-- Layout.vue -->
<template>
<header>...</header>
<main v-bind="\$attrs">...</main>
<footer>...</footer>
</template>
```

**Teleport**

Teleport 是一种能够将我们的模板移动到 DOM 中 Vue app 之外的其他位置的技术，就有点像哆啦A梦的“任意门”

在 vue2 中，像 modals，toast 等这样的元素，如果我们嵌套在 Vue 的某个组件内部，那么处理嵌套组件的定位、z-index 和样式就会变得很困难

通过Teleport，我们可以在组件的逻辑位置写模板代码，然后在Vue 应用范围之外渲染它

```html
<button @click="showToast" class="btn">打开 toast</button>
<!-- to 属性就是目标位置 -->
<teleport to="#teleport-target">
<div v-if="visible" class="toast-wrap">
<div class="toast-msg">我是一个 Toast 文案</div>
</div>
</teleport>
```

**createRenderer**

通过createRenderer，我们能够构建自定义渲染器，我们能够将 vue 的开发模型扩展到其他平台

我们可以将其生成在 canvas画布上

关于createRenderer，我们了解下基本使用，就不展开讲述了

```ts
import { createRenderer } from '@vue/runtime-core'

const { render, createApp } = createRenderer({
    patchProp,
    insert,
    remove,
    createElement,
    //...
  })

export { render, createApp }

export * from '@vue/runtime-core'
```

**composition Api**

compositionApi，也就是组合式 api，通过这种形式，我们能够更加容易维护我们的代码，将相同功能的变量进行一个集中式的管理

关于 composition api 的使用，这里展开来讲

简单使用:

```js
export default {
  setup() {
    const count = ref(0)
    const double = computed(() => count.value * 2)
    function increment() {
      count.value++
    }
    onMounted(() => console.log('component mounted!'))
    return {
      count,
      double,
      increment
    }
  }
}
```

### 非兼容变更

**Global API**

- 全局 Vue API 已更改为使用应用程序实例

全局和内部 API 已经被重构为可 tree-shakable

**模板指令**

- 组件上 v-model 用法已更改

`<template v-for>`和 非 v-for节点上 key用法已更改

- 在同一元素上使用的 v-if 和 v-for 优先级已更改

v-bind="object" 现在排序敏感

v-for 中的 ref 不再注册 ref 数组

**组件**

只能使用普通函数创建功能组件

functional 属性在单文件组件（SFC）

异步组件现在需要 defineAsyncComponent 方法来创建

**渲染函数**

- 渲染函数 API 改变

\$scopedSlots property 已删除，所有插槽都通过 \$slots 作为函数暴露

自定义指令 API已更改为与组件生命周期一致

- 一些转换 class 被重命名了：

v-enter -> v-enter-from

v-leave -> v-leave-from

组件watch 选项和实例方法 \$watch不再支持点分隔字符串路径，请改用计算函数作为参数

在 Vue 2.x 中，应用根容器的 outerHTML 将替换为根组件模板(如果根组件没有模板/渲染选项，则最终编译为模板)。VUE3.x现在使用应用程序容器的 innerHTML。

**其他改变**

destroyed 生命周期选项被重命名为 unmounted

beforeDestroy 生命周期选项被重命名为 beforeUnmount

[prop default工厂函数不再有权访问 this 是上下文

- 自定义指令API已更改为与组件生命周期一致

- data 应始终声明为函数

来自 mixin 的 data 选项现在可简单地合并

- attribute 强制策略已更改

- 一些过渡 class 被重命名

组建watch 选项和实例方法 \$watch不再支持以点分隔的字符串路径。请改用计算属性函数作为参数。

`<template>`没有特殊指令的标记（v-if/else-if/else、v-for 或 v-slot）现在被视为普通元素，并将生成原生的`<template>`元素，而不是渲染其内部内容。

在Vue 2.x 中，应用根容器的 outerHTML 将替换为根组件模板(如果根组件没有模板/渲染选项，则最终编译为模板)。Vue 3.x 现在使用应用容器的 innerHTML，这意味着容器本身不再被视为模板的一部分。

### 移除的 API

keyCode 支持作为 v-on 的修饰符

\$on，\$off 和 \$once 实例方法

- 过滤filter

- 内联模板 attribute

\$destroy 实例方法。用户不应再手动管理单个Vue 组件的生命周期。

---

## 1. Vue3.0 所采用的 Composition Api 与 Vue2.x 使用的 Options Api 有什么不同?

### Composition API 解决的问题

Composition API 可以说是 Vue3的最大特点，那么为什么要推出 Composition Api，解决了什么问题?

通常使用Vue2开发的项目，普遍会存在以下问题：

代码的可读性随着组件变大而变差

- 每一种代码复用的方式，都存在缺点

- TypeScript支持有限

以上通过使用 Composition Api 都能迎刃而解

### 组织逻辑的差异

**Options API**

Options API，即大家常说的选项API，即以 vue 为后缀的文件，通过定义 methods，computed，watch，data等属性与方法，共同处理页面逻辑

看下面这段代码：

可以看到 Options API 的代码编写方式，如果是组件状态，则写在data属性上，如果是方法，则写在methods 属性上...

用组件的选项（data、computed、methods、watch）组织逻辑在大多数情况下都有效然而，当组件变得复杂，导致对应属性的列表也会增长，这可能会导致组件难以阅读和理解

**Composition Api**

在Vue3 Composition API中，组件根据逻辑功能来组织的，一个功能所定义的所有 API会放在一起(更加的高内聚，低耦合)

即使项目很大，功能很多，我们都能快速的定位到这个功能所用到的所有API

下面对 Composition Api 与 Options Api进行两大方面的比较

- 逻辑组织

- 逻辑复用

**Options API**

假设一个组件是一个大型组件，其内部有很多处理逻辑关注点

可以看到，这种碎片化使得理解和维护复杂组件变得困难

选项的分离掩盖了潜在的逻辑问题。此外，在处理单个逻辑关注点时，我们必须不断地“跳转”相关代码的选项块

**Compostion API**

而 Composition API 正是解决上述问题，将某个逻辑关注点相关的代码全都放在一个函数里，这样当需要修改一个功能时，就不再需要在文件中跳来跳去

下面举个简单例子，将处理count属性相关的代码放在同一个函数了

```js
function useCount() {
  let count = ref(10);
  let double = computed(() => {
      return count.value * 2;
    });

  const handleConut = () => {
    count.value = count.value * 2;
  };

  console.log(count);

  return {
    count,
    double,
    handleConut,
  };
}
```

**组件上中使用 count**

```js
export default defineComponent({
    setup() {
      const { count, double, handleConut } = useCount();
      return {
        count,
        double,
        handleConut
      }
    },
  });
```

再来一张图进行对比，可以很直观地感受到 Composition API在逻辑组织方面的优势，以后修改一个属性功能的时候，只需要跳到控制该属性的方法中即可

### 逻辑复用方式

在Vue2中，我们是用过mixin去复用相同的逻辑

下面举个例子，我们会另起一个mixin.js 文件

```js
export const MoveMixin = {
data() {
return {
x: 0,
y: 0,
};
},

methods: {
handleKeyup(e) {
console.log(e.code);
// 上下左右 x y
switch (e.code) {
case "ArrowUp":
this.y--;
break;
case "ArrowDown":
this.y++;
break;
case "ArrowLeft":
this.x--;
break;
case "ArrowRight":
this.x++;
break;
}
},
},

mounted() {
window.addEventListener("keyup", this.handleKeyup);
},

unmounted( ) {
window.removeEventListener("keyup", this.handleKeyup);

};
```

**然后在组件中使用**

```js
<template>
<div>
Mouse position: x {{ x }} / y {{ y }}
</div>
</template>
<script>
import mousePositionMixin from './mouse'
export default {
  mixins: [mousePositionMixin]
}
</script>
```

使用单个 mixin似乎问题不大，但是当我们一个组件混入大量不同的 mixins 的时候

```js
mixins: [mousePositionMixin, fooMixin, barMixin, otherMixin]
```

会存在两个非常明显的问题：

- 命名冲突

数据来源不清晰

现在通过 Composition API 这种方式改写上面的代码

```js
import { onMounted, onUnmounted, reactive } from "vue";
export function useMove() {
  const position = reactive({
      x: 0,
      y: 0,
    });

  const handleKeyup = (e) => {
    console.log(e.code);
    // 上下左右 x y
    switch (e.code) {
      case "ArrowUp":
      // y.value--;
      position.y--;
      break;
      case "ArrowDown":
      // y.value++;
      position.y++;
      break;
      case "ArrowLeft":
      // x.value--;
      position.x--;
      break;
      case "ArrowRight":
      // x.value++;
      position.x++;
      break;
    }
  };

  onMounted(() => {
      window.addEventListener("keyup", handleKeyup);
    });

  onUnmounted(() => {
      window.removeEventListener("keyup", handleKeyup);
    });

  return { position };
}
```

**在组件中使用**

```vue
<template>
  <div>
    Mouse position: x {{ x }} / y {{ y }}
  </div>
</template>

<script>
import { toRefs } from "vue";
import { useMove } from "./useMove";

export default {
  setup() {
    const { position } = useMove();
    const { x, y } = toRefs(position);
    return { x, y };
  },
};
</script>
```

可以看到，整个数据来源清晰了，即使去编写更多的hook函数，也不会出现命名冲突的问题

### 选型结论

在逻辑组织和逻辑复用方面，Composition API 是优于 Options API

因为Composition API几乎是函数，会有更好的类型推断。

Composition API 对 tree-shaking 友好，代码也更容易压缩

CompositionAPI中见不到 this 的使用，减少了 this 指向不明的情况

如果是小型组件，可以继续使用 Options API，也是十分友好的

## 2. Vue3.0的设计目标是什么？做了哪些优化

### 设计目标

不以解决实际业务痛点的更新都是耍流氓，下面我们来列举一下Vue3 之前我们或许会面临的问题

- 随着功能的增长，复杂组件的代码变得越来越难以维护

- 缺少一种比较「干净」的在多个组件之间提取和复用逻辑的机制

类型推断不够友好

bundle的时间太久了

而Vue3 经过长达两三年时间的筹备，做了哪些事情?

我们从结果反推

· 更小

- 更快

- TypeScript支持

- API设计一致性

提高自身可维护性

- 开放更多底层功能

一句话概述，就是更小更快更友好了

**更小**

ue3移除一些不常用的 API

引入tree-shaking，可以将无用模块“剪辑”，仅打包需要的，使打包的整体体积变小了

**更快**

主要体现在编译方面：

- diff算法优化

- 静态提升

事件监听缓存

- SSR优化

**更友好**

vue3在兼顾vue2的options API的同时还推出了 composition API，大大增加了代码的逻辑组织和代码复用能力

这里代码简单演示下：

存在一个获取鼠标位置的函数

```js
import { toRefs, reactive } from 'vue';
function useMouse(){
const state = reactive({x:0,y:0});
const update = e=>{
state.x = e.pageX;
state.y = e.pageY;
onMounted(()=>{
window.addEventListener('mousemove',update);
})
onUnmounted(()=>{
window.removeEventListener('mousemove',update);
})

return toRefs(state);
}
```

我们只需要调用这个函数，即可获取x、y的坐标，完全不用关注实现过程

试想一下，如果很多类似的第三方库，我们只需要调用即可，不必关注实现过程，开发效率大大提高同时，VUE3是基于 typescipt编写的，可以享受到自动的类型定义提示

### 源码与工程优化

vue3从很多层面都做了优化，可以分成三个方面：

· 源码

- 性能

- 语法 API

**源码**

源码可以从两个层面展开：

- 源码管理

- TypeScript

**源码管理**

vue3 整个源码是通过 monorepo的方式维护的，根据功能将不同的模块拆分到packages目录下面不同的子目录中

packages compiler-core compiler-dom compiler-sfc compiler-ssr reactivity runtime-core runtime-dom runtime-test server-renderer shared size-check template-explorer vue

这样使得模块拆分更细化，职责划分更明确，模块之间的依赖关系也更加明确，开发人员也更容易阅读、理解和更改所有模块源码，提高代码的可维护性

另外一些 package （比如 reactivity 响应式库）是可以独立于 Vue 使用的，这样用户如果只想使用Vue3的响应式能力，可以单独依赖这个响应式库而不用去依赖整个Vue

**TypeScript**

ue3 是基于 typeScript编写的，提供了更好的类型检查，能支持复杂的类型推导

### 运行时性能优化

vue3 是从什么哪些方面对性能进行进一步优化呢?

- 体积优化

- 编译优化

数据劫持优化

这里讲述数据劫持：

在 vue2中，数据劫持是通过 Object.defineProperty，这个 API有一些缺陷，并不能检测对象属性的添加和删除

```js
Object.defineProperty(data, 'a',{
    get( ){
      // track
    },
    set( ){
      // trigger
    }
  })
```

尽管Vue为了解决这个问题提供了set和delete实例方法，但是对于用户来说，还是增加了一定的心智负担

同时在面对嵌套层级比较深的情况下，就存在性能问题

default {
data: {
```js
a: {
b: {
d：1
}
```

相比之下，vue3 是通过 proxy监听整个对象，那么对于删除还是监听当然也能监听到

同时 Proxy 并不能监听到内部深层次的对象变化，而 Vue3 的处理方式是在 getter 中去递归响应式，这样的好处是真正访问到的内部对象才会变成响应式，而不是无脑递归

### Composition API 优化

这里当然说的就是composition API，其两大显著的优化：

优化逻辑组织

优化逻辑复用

**逻辑组织**

一张图，我们可以很直观地感受到Composition API在逻辑组织方面的优势

相同功能的代码编写在一块，而不像options API那样，各个功能的代码混成一块

**逻辑复用**

在vue2中，我们是通过mixin实现功能混合，如果多个 mixin混合，会存在两个非常明显的问题：命名冲突和数据来源不清晰

而通过composition这种形式，可以将一些复用的代码抽离出来作为一个函数，只要的使用的地方直接进行调用即可

同样是上文的获取鼠标位置的例子

```js
import { toRefs, reactive, onUnmounted, onMounted } from 'vue';
function useMouse(){
  const state = reactive({x:0,y:0});
  const update = e=>{
    state.x = e.pageX;
    state.y = e.pageY;
  }
  onMounted(()=>{
      window.addEventListener('mousemove',update);
    })
  onUnmounted(()=>{
      window.removeEventListener('mousemove',update);
    })

  return toRefs(state);
}
```

**组件使用**

```js
import useMousePosition from './mouse'
export default {
setup(){
const { x, y } = useMousePosition( )
return { x, y }

}
```

可以看到，整个数据来源清晰了，即使去编写更多的hook函数，也不会出现命名冲突的问题

## 3. 用 Vue 3.0 写过组件吗？如果想实现一个 Modal，你会怎么设计？

### 组件目标与需求

组件就是把图形、非图形的各种逻辑均抽象为一个统一的概念(组件)来实现开发的模式

现在有一个场景，点击新增与编辑都弹框出来进行填写，功能上大同小异，可能只是标题内容或者是显示的主体内容稍微不同

这时候就没必要写两个组件，只需要根据传入的参数不同，组件显示不同内容即可

这样，下次开发相同界面程序时就可以写更少的代码，意义着更高的开发效率，更少的 Bug和更少的程序体积

**需求分析**

实现一个Modal组件，首先确定需要完成的内容：

- 遮罩层

- 标题内容

- 主体内容

确定和取消按钮

主体内容需要灵活，所以可以是字符串，也可以是一段html代码

特点是它们在当前 vue实例之外独立存在，通常挂载于 body 之上

除了通过引入import的形式，我们还可通过API的形式进行组件的调用

### 结构与主体实现

首先看看大致流程：

- 目录结构

- 组件内容

- 实现 API 形式

- 事件处理

· 其他完善

**目录结构**

Modal组件相关的目录结构

```text
plugins
modal
Content.tsx // 维护 Modal 的内容，用于 h 函数和 jsx 语法
Modal.vue // 基础组件
config.ts // 全局默认配置
index.ts // 入口
locale // 国际化相关
index.ts
lang
en-US.ts
zh-CN.ts
zh-TW.ts
modal.type.ts // ts类型声明相关
```

因为 Modal 会被 app.use(Modal) 调用作为一个插件，所以都放在 plugins 目录下

**组件内容**

首先实现modal.vue的主体显示内容大致如下

```vue
<Teleport to="body" :disabled="!isTeleport">
  <div v-if="modelValue" class="modal">
    <div
      class="mask"
      :style="style"
      @click="maskClose && !loading && handleCancel()"
    ></div>
    <div class="modal__main">
      <div class="modal__title line line--b">
        <span>{{ title || t("r.title") }}</span>
        <span
          v-if="close"
          :title="t('r.close')"
          class="close"
          @click="!loading && handleCancel()"
        >x</span>
      </div>
      <div class="modal__content">
        <Content v-if="typeof content === 'function'" :render="content" />
        <slot v-else>
          {{ content }}
        </slot>
      </div>
      <div class="modal__btns line line--t">
        <button :disabled="loading" @click="handleConfirm">
          <span v-if="loading" class="loading"></span>{{ t("r.confirm") }}
        </button>
        <button @click="!loading && handleCancel()">
          {{ t("r.cancel") }}
        </button>
      </div>
    </div>
  </div>
</Teleport>
```

最外层上通过Vue3 Teleport 内置组件进行包裹，其相当于传送门，将里面的内容传送至 body之上

并且从DOM结构上来看，把modal该有的内容(遮罩层、标题、内容、底部按钮)都实现了关于主体内容

```html
<div class="modal content">
  <Content v-if="typeof content==='function'"
  :render="content" />
  <slot v-else>
    {{content}}
  </slot>
</div>
```

可以看到根据传入content的类型不同，对应显示不同得到内容

最常见的则是通过调用字符串和默认插槽的形式

```html
//默认插槽
<Modal v-model="show"
title="演示 slot">
<div>hello world~</div>
</Modal>

//字符串
<Modal v-model="show"
title="演示 content"
content="hello world~"/>
```

通过API形式调用Modal组件的时候，content可以使用下面两种

- h 函数

```js
$modal.show({
    title:'演示 h 函数'
    content(h) {
      return h(
        'div',
        {
          style: 'color:red;',
          onClick: ($event: Event) => console.log('clicked', $event.target)
        },
        'hello world ~'
      );
    }
  });
```

- JSX

```ts
$modal.show({
    title:'演示 jsx 语法',
    content() {
      return (
        <div
        onClick={($event: Event) => console.log('clicked', $event.target)}
        >
        hello world ~
        </div>
      );
    }
  });
```

### API 调用方式

那么组件如何实现 API形式调用Modal组件呢?

在Vue2中，我们可以借助Vue 实例以及 Vue.extend的方式获得组件实例，然后挂载到 body 上

```js
import Modal from './Modal.vue';
const ComponentClass = Vue.extend(Modal);
const instance = new ComponentClass({ el: document.createElement("div") });
document.body.appendChild(instance.$el);
```

虽然Vue3移除了Vue.extend 方法，但可以通过createVNode 实现

```js
import Modal from './Modal.vue';
const container = document.createElement('div');
const vnode = createVNode(Modal);
render(vnode, container);
const instance = vnode.component;
document.body.appendChild(container);
```

在 Vue2中，可以通过 this的形式调用全局 API

```js
export default {
  install(vue) {
    vue.prototype.$create = create
  }
}
```

而在 Vue3的 setup 中已经没有 this 概念了，需要调用 app.config.globalProperties挂载到全局

```js
export default {
  install(app) {
    app.config.globalProperties.$create = create
  }
}
```

### 事件处理与完善

下面再看看看Modal组件内部是如何处理「确定」「取消」事件的，既然是Vue3，当然采用 Composition API 形式

```js
// Modal.vue
setup(props, ctx) {
  let instance = getCurrentInstance(); // 获得当前组件实例
  onBeforeMount(() => {
      instance._hub = {
        'on-cancel': () => {},
        'on-confirm': () => {}
      };
    });

  const handleConfirm = () => {
    ctx.emit('on-confirm');
    instance._hub['on-confirm']();
  };
  const handleCancel = () => {
    ctx.emit('on-cancel');
    ctx.emit('update:modelValue', false);
    instance._hub['on-cancel']();
  };

  return {
    handleConfirm,
    handleCancel
  };
}
```

在上面代码中，可以看得到除了使用传统emit的形式使父组件监听，还可通过\_hub属性中添加on-cancel、on-confirm方法实现在API 中进行监听

> 原文此处只有一个被截断的 `show` 方法轮廓，无法可靠恢复其参数和实现；完整的 `_hub` 事件处理逻辑见下方代码。

下面再来目睹下\_hub是如何实现

```js
// index.ts
app.config.globalProperties.$modal = {
show({
/* 其他选项 */
onConfirm,
onCancel
}) {
/* ... */

const { props, _hub } = instance;

const _closeModal = () => {
props.modelValue = false;
container.parentNode!.removeChild(container);
};
//往_hub新增事件的具体实现
Object.assign(_hub, {
async 'on-confirm'() {
if (onConfirm) {
const fn = onConfirm();
// 当方法返回为 Promise
if (fn && fn.then) {
try {
props.loading = true;
await fn;
props.loading = false;
_closeModal();
} catch (err) {
// 发生错误时，不关闭弹框
console.error(err);
props.loading = false;
}
} else {
_closeModal();
}
} else {
_closeModal();
}
},
'on-cancel'() {
onCancel && onCancel();
_closeModal();
}
});
}
```

**其他完善**

关于组件实现国际化、与 TypeScript 结合，大家可以根据自身情况在此基础上进行更改

## 4. Vue3.0性能提升主要是通过哪几方面体现的?

### 编译阶段优化

回顾Vue2，我们知道每个组件实例都对应一个watcher 实例，它会在组件渲染的过程中把用到的数据property记录为依赖，当依赖发生改变，触发 setter，则会通知watcher，从而使关联的组件重新渲染

试想一下，一个组件结构如下

```vue
<template>
<div id="content">
<p class="text">静态文本</p>
<p class="text">静态文本</p>
<p class="text">{{ message }}</p>
<p class="text">静态文本</p>

<p class="text">静态文本</p>
</div>
</template>
```

可以看到，组件内部只有一个动态节点，剩余一堆都是静态节点，所以这里很多 diff 和遍历其实都是不需要的，造成性能浪费

因此，Vue3在编译阶段，做了进一步优化。主要有如下：

- diff算法优化

- 静态提升

- 事件监听缓存

- SSR优化

### PatchFlag 与静态提升

**diff 算法优化**

vue3 在diff 算法中相比 vue2 增加了静态标记

关于这个静态标记，其作用是为了会发生变化的地方添加一个flag标记，下次发生变化的时候直接找该地方进行比较

已经标记为静态节点的 p 标签在 diff 过程中则不会比较，把性能进一步提高

关于静态类型枚举如下

```js
export const enum PatchFlags {
TEXT = 1,// 动态的文本节点
CLASS = 1 << 1, // 2 动态的 class
STYLE = 1 << 2, // 4 动态的 style
PROPS = 1 << 3， // 8 动态属性，不包括类名和样式
FULL_PROPS = 1 << 4, // 16动态 key，当 key 变化时需要完整的 diff 算法做比较
HYDRATE\_EVENTS = 1 << 5， // 32 表示带有事件监听器的节点
STABLE\_FRAGMENT =1 << 6，// 64 —个不会改变子节点顺序的 Fragment
KEYED\_FRAGMENT = 1 << 7, // 128 带有 key 属性的 Fragment
UNKEYED\_FRAGMENT = 1 << 8， // 256 子节点没有 key 的 Fragment
NEED\_PATCH = 1 << 9, // 512
DYNAMIC\_SLOTS = 1 << 10, // 动态 solt
HOISTED = -1，// 特殊标志是负整数表示永远不会用作diff
BAIL = -2 // —个特殊的标志，指代差异算法
```

15}

**静态提升**

ue3中对不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用

这样就免去了重复的创建节点，大型应用会受益于这个改动，免去了重复的创建操作，优化了运行时候的内存占用

```text
<span>你好</span>

<div>{{ message }}</div>
```

**没有做静态提升之前**

```js
export function render(_ctx, _cache, $props, $setup, $data, $options) {
return (_openBlock(), _createBlock(_Fragment, null, [
_createVNode("span", null,"你好"),
_createVNode("div", null, _toDisplayString(_ctx.message), 1 /* TEXT */)
1, 64 /* STABLE_FRAGMENT */))
}
```

**做了静态提升之后**

```js
const _hoisted_1 = /*#__PURE__*/_createVNode("span", null,"你好", -1 /* H
OISTED */)

export function render(_ctx, _cache, $props, $setup, $data, $options) {
return(_openBlock(), _createBlock(_Fragment, null, [
_hoisted_1,
_createVNode("div", null, _toDisplayString(_ctx.message), 1 /* TEXT */
)
1, 64 /* STABLE_FRAGMENT */))
}

// Check the console for the AST
```

静态内容\_hoisted\_1 被放置在render 函数外，每次渲染的时候只要取\_hoisted\_1 即可

同时 \_hoisted\_1 被打上了 PatchFlag，静态标记值为-1，特殊标志是负整数表示永远不会用于Diff

### 事件监听与 SSR 优化

**事件监听缓存**

默认情况下绑定事件行为会被视为动态绑定，所以每次都会去追踪它的变化

```text
<div>
<button @click = 'onClick'>点我</button>
</div>
```

**没开启事件监听器缓存**

```js
export const render = /*#__PURE__*/_withId(function render(_ctx, _cache, $p
rops, $setup, $data, $options) {
return (_openBlock(), _createBlock("div", null, [
_createVNode("button", { onClick: _ctx.onClick }, "点我", 8 /* PROPS */
, ["onClick"])
// PROPS = 1 << 3，动态属性，
但不包含类名和样式
1))
})
```

**开启事件侦听器缓存后**

```js
export function render(_ctx, _cache, $props, $setup, $data, $options) {
return (_openBlock(), _createBlock("div", null, [
_createVNode("button", {
onClick: _cache[1] | (_cache[1] = (...args) =>(_ctx.onClick(...args
)))
}，"点我")
1))
}
```

上述发现开启了缓存后，没有了静态标记。也就是说下次diff算法的时候直接使用

**SSR优化**

当静态内容大到一定量级时候，会用createStaticVNode 方法在客户端去生成一个static node，这些静态 node，会被直接写入 innerHTML，就不需要创建对象，然后根据对象渲染

```vue
<div>
<div>
<span>你好</span>
</div>
...// 很多个静态属性
<div>
<span>{{ message }}</span>
</div>
</div>
```

**编译后**

编译结果会把静态节点合并为可直接写入的 HTML 字符串，只对 `message` 等动态内容调用插值渲染。

> 原编译产物中的字符串边界、函数名和参数存在跨行错位，无法可靠还原，因此省略损坏代码片段。

### 体积与响应式系统

相比Vue2 ，Vue3整体体积变小了，除了移出一些不常用的API，再重要的是 Tree shaking。任何一个函数，如ref、reactive、computed等，仅仅在用到的时候才打包，没用到的模块都被摇掉，打包的整体体积变小

```js
import { computed, defineComponent, ref } from 'vue';
export default defineComponent({
    setup(props, context) {
      const age = ref(18)

      let state = reactive({
          name:'test'
        })

      const readonlyAge = computed(() => age.value++) // 19

      return {
        age,
        state,
        readonlyAge
      }
    }
  });
```

**响应式系统**

vue2 中采用 defineProperty 来劫持整个对象，然后进行深度遍历所有属性，给每个属性添加getter 和 setter，实现响应式

vue3 采用 proxy 重写了响应式系统，因为 proxy 可以对整个对象进行监听，所以不需要深度遍历

可以监听动态属性的添加

可以监听到数组的索引和数组length属性

可以监听删除属性

## 5. Vue3.0里为什么要用 Proxy API 替代defineProperty API?

### defineProperty 的响应式机制

定义:Object.defineProperty()方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象

**为什么能实现响应式**

通过defineProperty 两个属性，get 及 set

- get

属性的getter函数，当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入this对象(由于继承关系，这里的this并不一定是定义该属性的对象)。该函数的返回值会被用作属性的值

属性的setter函数，当属性值被修改时，会调用此函数。该方法接受一个参数(也就是被赋予的新值)，会传入赋值时的this对象。默认为undefined

下面通过代码展示：

定义一个响应式函数defineReactive

```js
function update() {
app.innerText = obj.foo

function defineReactive(obj, key, val) {
Object.defineProperty(obj, key, {
get( ) {
console.log(`get ${key}:${val}`);
return val
},
set(newVal) {
if (newVal !== val) {
val = newVal
update()
}
}
})
}
```

调用defineReactive，数据发生变化触发update方法，实现数据响应式

```js
const obj = {}
defineReactive(obj, 'foo','')
setTimeout(()=>{
    obj.foo = new Date().toLocaleTimeString()
  },1000)
```

在对象存在多个key情况下，需要进行遍历

```js
function observe(obj) {
if (typeof obj !== 'object' || obj == null) {
return

Object.keys(obj).forEach(key => {
defineReactive(obj, key, obj[key])
})
}
```

如果存在嵌套对象的情况，还需要在defineReactive中进行递归

```js
function defineReactive(obj, key, val) {
  observe(val)
  Object.defineProperty(obj, key, {
      get( ) {
        console.log(`get ${key}:${val}`);
        return val
      },
      set(newVal) {
        if (newVal !== val) {
          val = newVal
          update()
        }
      }
    })
}
```

当给key赋值为对象的时候，还需要在 set属性中进行递归

```js
set(newVal) {
  if (newVal !== val) {
    observe(newVal) //新值是对象的情况
    notifyUpdate()
  }
}
```

上述例子能够实现对一个对象的基本响应式，但仍然存在诸多问题

现在对一个对象进行删除与添加属性操作，无法劫持到

```js
const obj = {
  foo: "foo",
  bar: "bar"
}
observe(obj)
delete obj.foo // no ok
obj.jar = 'xxx' // no ok
```

当我们对一个数组进行监听的时候，并不那么好使了

```js
const arrData = [1,2,3,4,5];
arrData.forEach((val,index)=>{
    defineProperty(arrData,index,val)
  })
arrData.push() // no ok
arrData.pop() // no ok
arrDate[0] = 99 // ok
```

可以看到数据的api无法劫持到，从而无法实现数据响应式，

所以在 Vue2中，增加了 set、delete API，并且对数组 api方法进行一个重写

还有一个问题则是，如果存在深层的嵌套对象关系，需要深层的进行监听，造成了性能的极大问题

### defineProperty 的局限

检测不到对象属性的添加和删除

数组API 方法无法监听到

需要对每个属性进行遍历监听，如果嵌套对象，需要深层监听，造成性能问题

### Proxy 的实现方式

Proxy的监听是针对一个对象的，那么对这个对象的所有操作会进入监听操作，这就完全可以代理所有属性了

在ES6系列中，我们详细讲解过Proxy的使用，就不再述说了

下面通过代码进行展示：

定义一个响应式方法 reactive

```js
function reactive(obj) {
if (typeof obj !== 'object' && obj != null) {
return obj
}
// Proxy相当于在对象外层加拦截
const observed = new Proxy(obj, {
get(target, key, receiver) {
const res = Reflect.get(target, key, receiver)
console.log(`获取${key}:${res}`)
return res
},
set(target, key, value, receiver) {
const res = Reflect.set(target, key, value, receiver)
console.log(设置${key}:${value}`)
return res
},
deleteProperty(target, key) {
const res = Reflect.deleteProperty(target, key)
console.log(`删除${key}:${res}`)
return res
}
})
return observed

```

测试一下简单数据的操作，发现都能劫持

```js
const state = reactive({
    foo:'foo'
  })
//1.获取
state.foo// ok
// 2.设置已存在属性
state.foo = 'fooooooo' // ok
//3.设置不存在属性
state.dong = 'dong' // ok
// 4.删除属性
delete state.dong // ok
```

再测试嵌套对象情况，这时候发现就不那么OK了

```js
function observe(obj) {
if (typeof obj !== 'object' || obj == null) {
return

Object.keys(obj).forEach(key => {
defineReactive(obj, key, obj[key])
})
}
```

```js
const state = reactive({
    bar: { a: 1 }
  })
//设置嵌套对象属性
state.bar.a = 10 // no ok
```

如果要解决，需要在get之上再进行一层代理

```js
function reactive(obj) {
if (typeof obj !== 'object' && obj != null) {
return obj
}
//Proxy相当于在对象外层加拦截
const observed = new Proxy(obj, {
get(target, key, receiver) {
const res = Reflect.get(target, key, receiver)
console.log(`获取${key}:${res}`)
return isObject(res) ? reactive(res): res
},
return observed
}
```

### 两种方案的取舍

Object.defineProperty 只能遍历对象属性进行劫持

Proxy直接可以劫持整个对象，并返回一个新对象，我们可以只操作新的对象达到响应式目的

```js
function reactive(obj) {
  if (typeof obj !== 'object' && obj != null) {
    return obj
  }
  // Proxy相当于在对象外层加拦截
  const observed = new Proxy(obj, {
      get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver)
        console.log(`获取${key}:${res}`)
        return res
      },
      set(target, key, value, receiver) {
        const res = Reflect.set(target, key, value, receiver)
        console.log(`设置${key}:${value}`)
        return res
      },
      deleteProperty(target, key) {
        const res = Reflect.deleteProperty(target, key)
        console.log(`删除${key}:${res}`)
        return res
      }
    })
  return observed
}
```

Proxy可以直接监听数组的变化（push、shift、splice）

```js
const obj = [1,2,3]
const proxyObj = reactive(obj)
proxyObj.push(4)// ok
```

Proxy有多达13种拦截方法,不限于 apply、ownKeys、deleteProperty、has等等，这是Object.defineProperty不具备的

正因为defineProperty自身的缺陷，导致Vue2在实现响应式过程需要实现其他的方法辅助(如重写数组方法、增加额外 set、delete方法)

```js
//数组重写
const originalProto = Array-prototype
const arrayProto = Object.create(originalProto)
['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'].forEach(m
ethod => {
arrayProto[method] = function () {
originalProto[method].apply(this.arguments)
dep.notice()
}
});

// set、delete
Vue.set(obj,'bar','newbar')
Vue.delete(obj),'bar')
```

Proxy 不兼容IE，也没有polyfill，defineProperty 能支持到IE9

## 6. 说说Vue 3.0中Treeshaking特性？举例说明一下?

### Tree Shaking 的含义

Tree shaking 是一种通过清除多余代码方式来优化项目打包体积的技术，专业术语叫Dead code elimination

简单来讲，就是在保持代码运行结果不变的前提下，去除无用的代码

如果把代码打包比作制作蛋糕，传统的方式是把鸡蛋（带壳）全部丢进去搅拌，然后放入烤箱，最后把(没有用的)蛋壳全部挑选并剔除出去

而treeshaking则是一开始就把有用的蛋白蛋黄(import)放入搅拌，最后直接作出蛋糕

也就是说，tree shaking 其实是找出使用的代码

在Vue2中，无论我们使用什么功能，它们最终都会出现在生产代码中。主要原因是Vue实例在项目中是单例的，捆绑程序无法检测到该对象的哪些属性在代码中被使用到

```js
import Vue from 'vue'

Vue.nextTick(() => {})
```

而Vue3源码引入 tree shaking特性，将全局API进行分块。如果您不使用其某些功能，它们将不会包含在您的基础包中

```ts
import { nextTick, observable } from 'vue'

nextTick(() => {})
```

### 基于 ES Modules 的消除过程

Tree shaking 是基于 ES6 模板语法（ import与 exports），主要是借助 ES6 模块的静态编译思想，在编译时就能确定模块的依赖关系，以及输入和输出的变量

Tree shaking 无非就是做了两件事：

编译阶段利用 ES6 Module 判断哪些模块已经加载

判断那些模块和变量未被使用或者引用，进而删除对应代码

下面就来举个例子：

通过脚手架 vue-cli 安装Vue2 与 Vue3项目

```bash
vue create vue-demo
```

```vue
<script>
export default {
data: () => ({
count: 1,
}),
};
</script>
```

### Vue 2 与 Vue 3 的打包差异

**Vue 2 项目**

组件中使用data 属性

对项目进行打包，体积如下：

```text
File                                      Size
dist/js/chunk-vendors.28d0d835.js         89.59 KiB
dist/js/app.3f482fc1.js                     2.01 KiB
```

为组件设置其他属性（computed、watch）

```js
export default {
data: () => ({
question:"",
count: 1,
}),
computed: {
double: function () {
return this.count * 2;
},
},
watch: {
question: function (newQuestion, oldQuestion) {
this.answer = 'xxxx'
}
};
```

再一次打包，发现打包出来的体积并没有变化

```text
File                                      Size
dist/js/chunk-vendors.28d0d835.js         89.59 KiB
dist/js/app.94092e3d.js                     2.07 KiB
```

**Vue3 项目**

组件中简单使用

```js
import { reactive, defineComponent } from "vue";
export default defineComponent({
    setup( ) {
      const state = reactive({
          count: 1,
        });
      return {
        state,
      };
    }
  });
```

将项目进行打包

```bash
DONE Compiled successfully in 12015ms
File Size
dist\js\chunk-vendors.de2030ce.js 78.91 KiB
dist\js\app.c06bf53e.js 1.92 KiB
```

在组件中引入 computed和 watch

Gzipped 29.62 KiB 0.93 KiB

```js
import { reactive, defineComponent, computed, watch } from "vue";
export default defineComponent({
    setup() {
      const state = reactive({
          count: 1,
        });
      const double = computed(() => {
          return state.count * 2;
        });

      watch(
        () => state.count,
        (count, preCount) => {
          console.log(count);
          console.log(preCount);
        }
      );
      return {
        state,
        double,
      };
    },
  });
```

再次对项目进行打包，可以看到在引入 computer和watch之后，项目整体体积变大了

DONE Compiled successfully in 8011ms
File Size
dist\js\chunk-vendors.19e22567.js 79.05 KiB
dist\js\app.00e83bfe.js 2.15 KiB

Gzipped
29.64 KiB
1.00 KiB

### 收益

通过Treeshaking，Vue3 给我们带来的好处是：

- 减少程序体积（更小）

- 减少程序执行时间(更快)

- 便于将来对程序架构进行优化(更友好)
