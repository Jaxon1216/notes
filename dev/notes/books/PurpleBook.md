
---

总结知识点，记录答疑解惑，记录实践所得。

---

# 算法竞赛入门经典

## 第一章
这一章是c语言程序设计入门，涉及到编译，算术表达式，整数和浮点数，

#### 必须熟练
- 输入浮点数是`%lf`输出是`%f`
- 数学库跟c++不一样，是`math.h`不是`cmath`
- 定义派：`const pi = acos（-1.0）`
- 输入不要忘记`&`
- 非>与>或
#### 做题得出
- 数字反转题，本来输出25，想要输出025，改格式：`%03d`,0填充，长度3
- 整数类型有限，从`-2^31~2^31-1`,`1e9.32`；
- 浮点有精度界限（double 能精确表示整数直到 `2^53≈9e15`），**15**位
- 浮点运算产生特殊值`（inf、-inf、NaN）`而不会直接崩溃；
- 整数除以 0 是危险的（未定义），常会崩溃，报错，比如`1/0`
- 输入正整数a，输出三角函数要变成`a*pi/180`
- 闰年: 模4为0 或 模400不为0
- a如果是double，那么`a/9`和`a/9.0`是一样的；如果是int，`（double）a/9`和`a/9.0`一样的

## 第二章
这一章涉及循环，计数器，累加器，调试方法，计时函数，读写文件
#### 必须熟练
- aabb：不要忘了数学特性而老想着取模，`a*1100+b*11`
- 判断完全平方数，`int m = floor(sqrt(n)+0.5);`然后`if(m*m==n)return 1;`,0.5是因为浮点数的运算（和函数）有可能存在误差把0.9999999判成0
- `#include<time.h>`,`(double)clock()/CLOCKS_PER_SEC`
- while里面写`scanf("%d%d",&a,&b)==2 && (a!=0 && b!=0)`来读取多组数据
- 输入输出重定向是使用文件最简单的方法
> `freopen("input.txt","r",stdin); freopen(ouput.txt","w",stdout)`
- 要计算只包含加法、减法和乘法的整数表达式除以正整数n的余数,可以在每步计算之后对n取余,结果不变
#### 做题得出
- 找到正常输出，找不到就输出指定内容的，可以用`int found = 0`
- 题目给的范围到达1e6，就要时常注意又没哟乘法运算，因为1e6做乘法就大于了1e9，直接上`long long`
- 输入c，想输出c位小数，则`printf("%.*f",c,n)`


---

## 第三章

1. 从数组a复制k个元素到b可以这样做：
  - memcpy(b,a,sizeof(int)*k)
  - 如果是浮点型的就改成double，
  - 那对于vector呢？

2. 字符a代表的就是他的ASCII码字符常量用单引号表示，语法上可以当作int使用
3. strchr的作用是在一个字符串中查找单个字符，比如strchr(s,a[i] == NULL)
4. printf输出到屏幕，fprintf输出到文件，sprintf输出到字符串
5. 由于字符串的本质是数组strcpy(a,b),strcmp(a,b),strcat(a,b)进行赋值，比较，连接操作，而不能用"=","==","+="
  - 那对于字符串呢？
6. 有些题目比较有特点，可以边读边写，比如
```c
  int c;
  while(c = getchar() != EOF){
    printf("%c",c);
  }
```
7. printf("%d%o%x\n",a)可以把整数a分别按照十进制，八进制，和十六进制输出；
8. 2的八次方用c语言写出来就是 (2<<8)-1


## 第四章
1. c语言定义结构体
```c
typedef struct{double x,y;} point;
double dist(point a,point b){
  return (a.x-b.x , a.y - b.y);
}
```

2. 递归算阶乘
```c
int f(int n){
  return n == 0 ? 1 : f(n-1)*n;
}
```

3. 栈帧，段，

## 第五章 C++与STL入门

1. const 写法更被推荐，而不是#define声明常数
2. gdb调试
3. cin/cout链接程序与外部，ss链接程序与字符串
```cpp
string line;
while(getine(cin,line)){
  int s = 0 ,x;
  stringstream ss(line);
  while(ss >>  x) s+=x;
  cout << s << "\n";
}
return 0;
```
用字符串初始化一个字符串流对象ss用来读取每个字符；
  - 不能直接下表访问吗？不能getchar？



