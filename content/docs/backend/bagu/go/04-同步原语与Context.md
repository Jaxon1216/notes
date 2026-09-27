---
title: 同步原语与 Context
description: Mutex、atomic、Once、WaitGroup、sync.Map 与 Context 高频面试题。
tags:
  - 服务端八股
  - Go
  - 并发
status: published
updatedAt: '2026-09-27'
---

## 除了 `Mutex`，还有哪些方式可以安全访问共享状态？

### 回答重点

常见方案包括：

- 通过 channel 转移数据所有权或串行化操作。
- 用 `sync.RWMutex` 保护读多写少、且需要维护复合不变量的状态。
- 用 `sync/atomic` 更新单个计数器、指针或状态位。
- 用 `sync.Map` 处理它明确优化的并发 Map 场景。
- 通过不可变数据和复制减少共享可变状态。

选择依据不是“哪个一定更快”，而是状态是否共享、一次操作涉及几个字段、是否需要阻塞等待，以及能否清楚表达内存同步关系。

## Go 如何实现原子操作？

### 回答重点

`sync/atomic` 为整数、指针和少量封装类型提供不可分割的读、写、交换、比较交换与加法操作。标准工具链会根据目标架构生成相应的原子指令或等价序列。

Go 的原子操作还建立内存顺序。若一个原子操作 A 的效果被原子操作 B 观察到，则 A 在 B 之前同步；标准库将这些操作解释为顺序一致。

原子操作只保证单次操作的原子性。多个变量之间的复合约束通常仍需要锁，或把状态编码到一个可原子更新的值中。

## 原子操作和锁有什么区别？

### 回答重点

- 原子操作适合一个机器字大小的独立状态，API 小、开销低，但算法更难推理。
- 锁保护的是临界区，可以让多个字段和多个步骤作为整体保持一致。
- 锁竞争时可能挂起 goroutine；原子重试循环在高竞争下可能浪费 CPU。
- 不能仅凭“无锁”判断更快，必须基于真实负载做基准测试。

## `sync.Mutex` 的基本实现思路是什么？

### 回答重点

`sync.Mutex` 的零值可直接使用。快速路径通过原子操作尝试取得锁；竞争发生后，慢路径会结合短暂自旋、等待队列和运行时信号量挂起或唤醒 goroutine。

标准运行时长期采用正常模式与饥饿模式平衡吞吐和公平：

- 正常模式允许被唤醒的等待者与新到达的 goroutine 竞争，吞吐较高。
- 等待过久时可以进入饥饿模式，锁直接移交给等待队列中的 goroutine，限制长期饥饿。

字段布局、状态位和阈值均属于运行时实现细节。可靠代码只应依赖 `Lock`、`Unlock` 与内存模型承诺。

## Mutex 自旋会不会持续占用大量 CPU？

### 回答重点

运行时只会在满足多核、锁预计很快释放等条件时进行有限次数的主动自旋。条件不满足或自旋失败后，goroutine 会进入等待状态。

这不能替代应用层优化。若临界区过长或竞争激烈，应缩小锁范围、拆分锁、减少共享状态，或重新设计数据流。

## Mutex 解锁后哪个等待者先获得锁？

### 回答重点

不能依赖固定顺序。正常模式下，被唤醒的等待者还可能和新到达的 goroutine 竞争；饥饿模式更偏向队列中的长期等待者。

`sync.Mutex` 不提供业务层 FIFO 公平性保证。如果业务必须严格排队，应显式实现队列或使用更合适的协调模型。

## `sync.Once` 有什么作用？

### 回答重点

`Once.Do(f)` 保证同一个 `Once` 实例只调用一次 `f`，并且其他调用只有在这次调用返回后才会继续。

需要注意：

- 不要在 `f` 内递归调用同一个 `Once.Do`，否则会死锁。
- 如果 `f` panic，这次调用仍被视为已经完成，后续 `Do` 不会重试。
- `Once` 第一次使用后不能复制。

Go 标准库还提供 `sync.OnceFunc`、`sync.OnceValue` 和 `sync.OnceValues`，可减少手工封装。

## `sync.WaitGroup` 如何实现等待？

### 回答重点

可以把 `WaitGroup` 理解为计数器加等待机制：

- `Add` 增加或减少待完成任务数。
- `Done` 等价于 `Add(-1)`。
- `Wait` 在计数器归零前阻塞。

内部通常通过原子状态保存任务数和等待者数，并用运行时信号量挂起与唤醒等待者。具体字段布局属于版本实现。

最重要的使用约束是：

- 正数 `Add` 应在启动 goroutine 之前完成，避免 `Wait` 过早返回。
- 计数器不能减成负数。
- `WaitGroup` 第一次使用后不能复制。
- 复用前必须确保上一轮 `Wait` 已返回。

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	for i := 0; i < 3; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			fmt.Println(id)
		}(i)
	}
	wg.Wait()
}
```

## `sync.Map` 的适用场景是什么？

### 回答重点

大多数代码应优先使用带 `Mutex` 或 `RWMutex` 的普通 Map，因为它有具体类型，也更容易维护跨多个字段的不变量。

`sync.Map` 主要针对两类场景优化：

1. 一个 Key 通常只写一次、读取很多次，例如只增长的缓存。
2. 多个 goroutine 读写互不相交的 Key 集合。

“读多写少就一定用 `sync.Map`”过于粗糙。应按访问模式和基准结果选择。

## `sync.Map` 的底层一定是 `read` 和 `dirty` 两个 Map 吗？

### 回答重点

不一定。部分 Go 版本使用只读快照 `read`、加锁的 `dirty` 和未命中计数实现 `sync.Map`，其中还会出现 `nil`、`expunged` 等状态。

这些都是标准库内部实现，不是 API 契约，后续版本可以替换数据结构。面试时如果讨论 `read`/`dirty`，必须注明对应源码版本；工程代码只依赖 `Load`、`Store`、`LoadOrStore`、`Range` 等公开行为。

`Range` 也不保证一致快照。并发修改时，它可能观察到某个 Key 在调用期间任一时刻的值。

## `Context` 是什么？

### 回答重点

`context.Context` 是在调用链之间传播截止时间、取消信号和请求范围值的接口：

```go
type Context interface {
	Deadline() (deadline time.Time, ok bool)
	Done() <-chan struct{}
	Err() error
	Value(key any) any
}
```

`Context` 的核心是协作式取消。取消只会关闭 `Done` 并记录原因，不会强制终止 goroutine；下游代码必须主动监听并返回。

## `Context` 的主要用途是什么？

### 回答重点

- 为请求设置超时或截止时间。
- 在调用链中级联传播取消。
- 携带请求范围元数据，例如 trace ID。

规范用法：

- `ctx` 通常作为函数第一个参数，不存入长期存活的结构体。
- 不传 `nil` Context，不确定时使用 `context.TODO()`。
- `Value` 不用于传递普通可选参数。
- 创建可取消子 Context 后应调用返回的 `cancel`，及时释放定时器和父子引用。

## `Context.Value` 如何查找？

### 回答重点

由 `context.WithValue` 构成的 Context 会保存一个键值和父 Context。查找时从当前节点向父链逐层比较 Key，找到后返回；到根节点仍未找到则返回 `nil`。

Key 必须可比较，推荐定义未导出的自有类型，避免不同包使用相同字符串发生冲突：

```go
package main

import (
	"context"
	"fmt"
)

type requestIDKey struct{}

func main() {
	ctx := context.WithValue(context.Background(), requestIDKey{}, "req-1")
	fmt.Println(ctx.Value(requestIDKey{}))
}
```

## `Context` 如何被取消？

### 回答重点

- `WithCancel` 返回显式 `cancel` 函数。
- `WithTimeout` 和 `WithDeadline` 在定时器到期时取消。
- 父 Context 取消会向可取消的后代传播。
- `WithCancelCause` 等 API 还可以记录取消原因。

多个 goroutine 可以同时等待 `ctx.Done()`。channel 关闭会广播取消信号，而不是只唤醒一个接收者。

### 扩展知识

- [`sync` 包文档](https://pkg.go.dev/sync)
- [`sync/atomic` 包文档](https://pkg.go.dev/sync/atomic)
- [`context` 包文档](https://pkg.go.dev/context)
- [Go 内存模型](https://go.dev/ref/mem)
