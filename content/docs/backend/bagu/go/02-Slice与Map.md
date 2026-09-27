---
title: Slice 与 Map
description: 数组、切片和 Map 的语义、扩容、并发安全与版本差异。
tags:
  - 服务端八股
  - Go
  - 数据结构
status: published
updatedAt: '2026-09-27'
---

## 数组和 slice 有什么区别？

### 回答重点

- 数组类型包含长度，`[3]int` 和 `[4]int` 是不同类型；slice 类型 `[]int` 不包含固定长度。
- 数组赋值和传参会复制全部元素。
- slice 是描述一段底层数组的值，复制 slice 只会复制描述符。
- 数组可以比较，但前提是元素类型可比较；slice 只能和 `nil` 比较。
- slice 的长度可以通过切片表达式改变，容量不足时 `append` 会分配新的底层数组。

“slice 是引用传递”并不准确。Go 仍然是值传递，只是两个 slice 值可能引用同一个底层数组。

## slice 的底层结构是什么？

### 回答重点

从语义上看，slice 由三部分信息组成：

- 指向底层数组某个元素的引用。
- 长度 `len`。
- 容量 `cap`。

运行时可用类似下面的结构表达它，但字段布局属于实现细节：

```go
type sliceHeader struct {
	data unsafe.Pointer
	len  int
	cap  int
}
```

业务代码不应依赖运行时私有结构。需要与底层内存交互时优先使用 `unsafe.Slice`、`unsafe.String` 等受约束的 API。

## slice 如何扩容？

### 回答重点

当 `append` 后的新长度不超过原容量时，slice 复用原底层数组；容量不足时，运行时分配新数组、复制已有元素并返回新的 slice。

当前标准工具链会综合旧容量、所需容量、元素大小和内存分配器的 size class 计算新容量。常见趋势是小容量增长更快，大容量增长更平缓，但“始终翻倍”或“始终增长 1.25 倍”都不是语言保证。

面试时应区分：

- **稳定语义**：容量不足可能更换底层数组，旧 slice 不会自动指向新数组。
- **版本实现**：具体阈值和最终容量会随 Go 版本、元素大小和内存对齐变化。

## 从一个 slice 截取出另一个 slice，修改会互相影响吗？

### 回答重点

只要两个 slice 仍共享同一个底层数组，修改重叠范围内的元素就会互相可见。`append` 是否切断共享关系取决于目标 slice 的剩余容量。

三下标切片可以限制容量，避免后续 `append` 覆盖原 slice 的剩余区域：

```go
package main

import "fmt"

func main() {
	base := []int{1, 2, 3, 4}
	view := base[1:3:3] // len=2, cap=2
	view = append(view, 99)

	fmt.Println(base) // [1 2 3 4]
	fmt.Println(view) // [2 3 99]
}
```

如果需要彻底解除共享关系，可以使用 `slices.Clone` 或 `append([]T(nil), src...)` 复制数据。

## slice 作为函数参数时会改变原 slice 吗？

### 回答重点

函数拿到的是 slice 描述符的副本：

- 修改 `s[i]` 会修改共享底层数组，因此调用方通常能看到元素变化。
- 在函数内执行 `s = append(s, value)` 只改变局部描述符，调用方的长度和容量不会自动变化。
- 如果要让调用方接收追加后的 slice，应该返回新 slice，通常不需要传 `*[]T`。

```go
package main

import "fmt"

func appendValue(s []int, value int) []int {
	return append(s, value)
}

func main() {
	values := []int{1, 2}
	values = appendValue(values, 3)
	fmt.Println(values)
}
```

## Map 的底层实现是什么？

### 回答重点

Map 的语言语义是哈希表，但具体数据结构不属于 Go 语言规范。

Go 1.23 及更早版本的标准工具链常用 `hmap`、`bmap`、桶和溢出桶解释实现；从 Go 1.24 起，内置 Map 改为基于 Swiss Table 的实现。因此，把 `hmap` 和“每桶 8 个键值对”描述成所有 Go 版本的固定结构已经过时。

面试时更稳定的回答是：

1. 运行时根据键的哈希值定位候选位置。
2. 发生冲突时继续探测并比较键。
3. 负载上升或存储布局退化时进行增长或重组。
4. 扩容和迭代细节属于版本相关实现，不应成为业务代码依赖。

参考 [Go 1.24 发布说明](https://go.dev/doc/go1.24#runtime)。

## Map 的遍历有序吗？

### 回答重点

无序。Go 规范明确说明 Map 的迭代顺序未指定，并且不能保证两次遍历顺序一致。

“完全随机”也不准确：规范只承诺顺序不确定，运行时如何选择起点和遍历路径属于实现细节。业务逻辑不得依赖任何观察到的顺序。

## 如何按顺序读取 Map？

### 回答重点

提取键、排序，再按键访问 Map。Go 1.21 以后可以使用 `slices.Sort`：

```go
package main

import (
	"fmt"
	"slices"
)

func main() {
	values := map[int]string{3: "c", 1: "a", 2: "b"}
	keys := make([]int, 0, len(values))
	for key := range values {
		keys = append(keys, key)
	}

	slices.Sort(keys)
	for _, key := range keys {
		fmt.Println(key, values[key])
	}
}
```

## 普通 Map 并发安全吗？

### 回答重点

普通 Map 不提供并发读写安全保证：

- 多个 goroutine 只读同一个不再修改的 Map 是安全的。
- 只要存在并发写入，所有读、写、删除和遍历都必须建立同步。
- 某些并发误用会触发运行时 `fatal error`，但不能把运行时检测当作同步机制；数据竞争本身就已违反要求。

常见方案是使用 `sync.RWMutex` 保护普通 Map，或在符合适用场景时使用 `sync.Map`。应使用 `go test -race` 检测测试覆盖到的竞争。

## Map 的 Key 为什么必须可比较？

### 回答重点

Map 需要在哈希冲突时判断两个键是否相等，因此键类型必须支持 `==` 和 `!=`。

布尔、数值、字符串、指针、channel、interface，以及元素或字段都可比较的数组和结构体可以作为 Key。slice、map 和 function 不可比较，不能直接作为 Key。

interface 类型可以作为 Key，但如果动态值不可比较，插入或查询时会发生 panic。

## Map 什么时候扩容？

### 回答重点

稳定结论是：当负载或内部存储状态不再适合高效插入时，运行时会增长或重组 Map。

具体阈值和策略是实现细节。Go 1.24 的 Swiss Table 实现与旧版桶式实现不同，因此不应继续背诵旧版固定负载因子、溢出桶数量或“等量扩容”的内部条件作为跨版本答案。

工程代码只应依赖以下行为：

- `make(map[K]V, hint)` 的第二个参数是容量提示，不是容量承诺。
- 插入可能触发分配，已有元素地址不稳定。
- Map 不会因为少量 `delete` 自动收缩到最小占用。

## 可以对 Map 元素取地址吗？

### 回答重点

不能直接获取 `&m[key]`。Map 的内部增长和重排可能移动元素，因此索引表达式不是可寻址值。

如果需要修改结构体值，可以取出、修改后写回，或让 Map 存储指针：

```go
package main

type Counter struct {
	Value int
}

func main() {
	values := map[string]Counter{"a": {Value: 1}}
	counter := values["a"]
	counter.Value++
	values["a"] = counter
}
```

## 删除 Map 元素后内存会立即释放吗？

### 回答重点

`delete(m, key)` 会让该键不可见，并清除运行时保存的键和值引用，使其中不再可达的对象有机会被 GC 回收。

但 Map 自身已经申请的内部存储通常不会因为单次删除立即缩小或归还给操作系统。若一个长期存活的 Map 曾经非常大，后来只剩少量元素，可以新建 Map 并迁移仍需保留的数据。

## 可以一边遍历 Map 一边删除吗？

### 回答重点

同一个 goroutine 中可以在 `range` 期间删除尚未遍历到的键。规范规定，被删除且尚未到达的条目不会被产生；遍历期间新增的条目可能出现，也可能不出现。

这不等于允许并发操作。多个 goroutine 同时遍历和写入普通 Map 仍然需要同步。

```go
for key, value := range values {
	if shouldDelete(value) {
		delete(values, key)
	}
}
```

### 扩展知识

- [Go 语言规范：Map 类型](https://go.dev/ref/spec#Map_types)
- [Go 语言规范：`range`](https://go.dev/ref/spec#For_range)
