# 知识性
### `return`、`break`、`return 0` 

### 一句话结论

- 在 `void` 函数里用 `return;` 直接结束函数。
- `break;` 只退出当前循环/`switch`，函数还会继续往下执行。
- `return 0;` 是“有返回值的函数”返回整数 0。

#### 最小示例

```cpp
void LinkedList::ascinsert(eleType value) {
    if (size == 0) {
        insert(0, value);
        return;                 // 提前结束整个函数
    }
    ListNode* curr = head;
    for (int i = 0; i < size; ++i) {
        if (value <= curr->data) {
            insert(i, value);
            return;             // 找到位置后直接结束函数
        }
        curr = curr->next;
    }
    insert(size, value);
}
```

#### 如果把第二个 `return` 换成 `break` 会怎样？

```cpp
void LinkedList::ascinsert(eleType value){
    if (size == 0) { insert(0, value); return; }
    ListNode* curr = head;
    for (int i = 0; i < size; ++i){
        if (value <= curr->data){
            insert(i, value);
            break;              // 只跳出 for 循环
        }
        curr = curr->next;
    }
    insert(size, value);        // 仍会执行 → 造成重复插入
}
```

- 核心原因：`break` 只离开循环，函数没有结束；而 `return` 结束整个函数。

####  `return;` 和 `return 0;`

- `return 0;`：用于有返回值的函数，返回整数 0。
- `return;`：用于 `void` 函数，只退出函数，不返回值。

```cpp
int main() { return 0; }
int add(int a, int b) { return a + b; }
void ascinsert(eleType v) { /* ... */ return; }
```

#### 速查表

| 语句        | 适用场景           | 作用                    |
| ----------- | ------------------ | ----------------------- |
| `break;`    | 循环或 `switch` 内 | 跳出当前循环/`switch`   |
| `return;`   | `void` 函数        | 立即结束整个函数        |
| `return 0;` | 返回 `int` 的函数  | 结束函数并返回 `0`      |

### delete

#### delete

```cpp
int* p = new int(5);    // 单个对象
delete p;               // 正确：不需要[]

int* arr = new int[10]; // 数组
delete[] arr;           // 必须加[]

// 错误示范
int* wrong = new int[10];
delete wrong;           // 未使用[] → 内存泄漏/未定义行为
```

- 不需要加`[]`的情况：
  1. 释放**单个对象**时用`delete`
  2. 当指针是`nullptr`时（`delete nullptr`安全但无意义）

- 必须加`[]`的情况：
  - 释放数组时用`delete[]`
  - 与`new[]`严格配对使用

- 核心原则：`new`和`delete`形式必须匹配

---

### c中的打印
```c
if(x >= 10) 
    printf("%c", 'A' + x - 10);
else 
    printf("%d", x);
```

`printf` 是 C 语言中用于格式化输出的标准函数。格式说明符以 `%` 开头，指定如何显示后续参数。

在上面的代码中：
- `%c` 是字符格式说明符，它将整数值转换为对应的 ASCII 字符。`'A' + x - 10` 计算出 A-F 对应的字符。
- `%d` 是十进制整数格式说明符，直接输出数字。

其他常见的格式说明符：
- `%s`: 字符串
- `%f`: 浮点数
- `%x`: 十六进制数（小写 a-f）
- `%X`: 十六进制数（大写 A-F）
- `%p`: 指针地址

C++ 中通常使用 `cout` 进行输出：
```cpp
if(x >= 10) 
    cout << static_cast<char>('A' + x - 10);
else 
    cout << x;
```
C 的 `printf` 需要手动指定格式，而 C++ 的 `cout` 会根据变量类型自动选择格式。


---
### 易混括号

#### `Type name[N]` - 数组声明
```cpp
Queue<int> q[1001];  // 创建1001个队列对象 ❗易错点
vector<int> v[5];    // 创建5个vector对象
```
**特点：** 创建N个独立的Type对象  
**坑点：** 这不是1个大小为N的队列，而是N个独立的队列！
#### `Type name(N)` - 带参构造
```cpp
vector<int> v(100);  // 1个vector，含100个元素
string s(5, 'a');    // 1个string，5个'a'
```
**特点：** 创建1个对象，初始化N个内容
#### `Type name{N}` - 列表初始化
```cpp
vector<int> v{1,2,3}; // 1个vector，元素为1,2,3
int arr[]{1,2,3};     // 3个int的数组
```
**特点：** 使用花括号指定初始值
##### 快速记忆
- `[N]` → 多个对象（N个Type）
- `(N)` → 单个对象，N个内容  
- `{N}` → 初始化值为N


### i++和++i

之前都是似懂非懂，现在来总结一下：
  - 区别能体现：涉及立刻赋值，立刻打印，数组索引，return， 条件判断
  - 一样效果：循环，单独写一行，函数调用`fun（xxx）`；



# 非知识性
### index.md无内容但侧边栏显示仓库
- index.md只有前置信息无实际内容，侧边栏仓库信息配置在主题配置文件的`projects`和`repository`部分，非Markdown文件内容决定。

#### Hexo中repository/index.md与主题配置的关系
在Hexo博客系统中，`source/repository/index.md`文件与侧边栏显示的GitHub仓库列表之间存在一种特殊的关系：

1. **index.md文件的作用**：
   - 这个文件主要是创建一个名为"Repositories"的页面路由（/repository/）
   - 它包含前置信息（Front Matter）定义了页面标题、布局等基本属性
   - 文件本身可以不包含任何内容，因为实际显示的仓库信息是从主题配置中获取的

2. **主题配置中的仓库设置**：
   - 在`themes/pure/_config.yml`文件中，仓库信息通过两个部分配置：
     ```yaml
     repository:
       platform: github # 托管平台（github | gitee）
       username: Jaxon1216 # 用户名
     ```
     和
     ```yaml
     projects:
       cofess/hexo-theme-pure: https://github.com/cofess/hexo-theme-pure
     ```
   - `repository`部分定义了平台和用户名
   - `projects`部分直接列出了要显示的特定仓库

3. **工作原理**：
   - 当访问`/repository/`页面时，Hexo使用`layout: repository`指定的布局模板
   - 该模板会读取主题配置文件中的`repository`和`projects`部分
   - 即使`index.md`文件中没有内容，模板也会根据配置信息渲染出仓库列表

这就是为什么即使`source/repository/index.md`文件中没有任何内容，侧边栏仍然能够显示GitHub仓库的原因。修改仓库显示需要编辑主题配置文件，而不是修改index.md文件。