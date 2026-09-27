---
title: Channel 与 Select
description: CSP、Channel 收发与关闭语义、阻塞行为和 Select 高频面试题。
tags:
  - 服务端八股
  - Go
  - 并发
status: published
updatedAt: '2026-09-27'
---

## 什么是 CSP？

### 回答重点

CSP 全称 Communicating Sequential Processes，是一种通过进程间通信描述并发系统的模型。Go 借鉴了 CSP 思想，用 goroutine 表示并发执行单元，用 channel 在 goroutine 之间同步和传递值。

“不要通过共享内存来通信，而要通过通信来共享内存”是一条设计建议，不是强制规则。简单计数器、缓存或需要保护多个字段一致性的场景，锁和原子操作仍然更直接。

## Channel 的语义和底层结构是什么？

### 回答重点

Channel 是带类型的同步队列：

- 无缓冲 channel 的发送和接收必须直接配对。
- 有缓冲 channel 在缓冲区未满时允许发送方继续执行，在缓冲区非空时允许接收方继续执行。
- channel 的零值是 `nil`，对 nil channel 的发送和接收会永久阻塞。

标准运行时通常用 `hchan` 保存缓冲区、发送和接收索引、等待队列、关闭状态及锁。这个结构属于运行时实现，不是语言规范的一部分，不应在业务代码中依赖字段名称和布局。

## 向 Channel 发送数据时会发生什么？

### 回答重点

可以从语义上分成四种情况：

1. 有等待中的接收者时，值直接交给该接收者并唤醒它。
2. 没有接收者但缓冲区有空位时，值进入缓冲区。
3. 没有接收者且缓冲区已满时，发送方阻塞，直到可以完成发送或所在操作被其他控制流取消。
4. 向已关闭 channel 发送会 panic；向 nil channel 发送会永久阻塞。

阻塞的 goroutine 会被运行时挂起，不会持续占用一个操作系统线程忙等。

## 从 Channel 接收数据时会发生什么？

### 回答重点

1. 有等待中的发送者时，接收方与发送方配对。
2. 缓冲区有数据时，从缓冲区取出一个值。
3. 暂无数据且 channel 未关闭时，接收方阻塞。
4. channel 已关闭但缓冲区仍有数据时，继续返回缓冲数据。
5. channel 已关闭且缓冲区为空时，立即返回元素类型零值，双返回形式中的 `ok` 为 `false`。

```go
package main

import "fmt"

func main() {
	ch := make(chan int, 1)
	ch <- 18
	close(ch)

	first, firstOK := <-ch
	second, secondOK := <-ch
	fmt.Println(first, firstOK)   // 18 true
	fmt.Println(second, secondOK) // 0 false
}
```

## 谁应该关闭 Channel？

### 回答重点

通常由发送方关闭，因为发送方最清楚是否还会产生新值。接收方一般不应关闭 channel，否则其他发送方可能对已关闭 channel 发送并触发 panic。

多个发送方共享一个 channel 时，应通过额外协调让一个明确的所有者负责关闭，例如等待所有生产者退出后由协调 goroutine 关闭。

关闭是可选的。只有接收方需要通过“关闭”判断数据流结束，或需要让 `range ch` 退出时才必须关闭。垃圾回收不要求所有 channel 都被关闭。

## 哪些 Channel 操作会阻塞或 panic？

### 回答重点

| 操作 | nil channel | 已关闭 channel |
| --- | --- | --- |
| 接收 | 永久阻塞 | 缓冲耗尽后立即返回零值和 `false` |
| 发送 | 永久阻塞 | panic |
| 关闭 | panic | 再次关闭会 panic |

`close` 的参数必须是可发送的 channel。关闭 `<-chan T` 会在编译期报错，而不是运行时 panic。

## Channel 为什么可能导致内存泄漏？

### 回答重点

Channel 本身通常不是根因，无法退出的 goroutine 才是常见根因。阻塞 goroutine 及其栈上、闭包中引用的对象仍然可达，GC 无法回收这些对象。

常见场景：

- 接收方永远等不到发送或关闭。
- 发送方因接收方提前退出而永久阻塞。
- 无超时、无取消分支的 channel 操作等待外部资源。
- 向无人消费的 channel 持续积压大对象。

治理方式包括明确所有权、使用 `context.Context` 传播取消、为可能无限等待的操作设置超时，并通过 goroutine profile 排查阻塞位置。

## 什么是 `select`？

### 回答重点

`select` 用于等待一组 channel 发送或接收操作：

- 只有一个 case 就绪时执行该 case。
- 多个 case 同时就绪时，从中做伪随机选择。
- 没有 case 就绪且存在 `default` 时立即执行 `default`。
- 没有 case 就绪且不存在 `default` 时，当前 goroutine 阻塞。
- 没有任何 case 的 `select {}` 永久阻塞。

`select` 类似 `switch` 的语法，但它处理的是 channel 通信，不能类比为操作系统 `select` 系统调用的直接封装。

```go
select {
case value := <-values:
	use(value)
case <-ctx.Done():
	return ctx.Err()
}
```

## `select` 的底层执行过程是什么？

### 回答重点

运行时实现会先评估所有 channel 操作涉及的表达式，再检查是否已有可立即执行的 case。多个 case 同时就绪时会打乱轮询顺序，避免固定优先级。

如果没有 case 就绪且没有 `default`，运行时会把当前 goroutine 注册到相关 channel 的等待队列并挂起。某个通信条件满足后，goroutine 被唤醒，同时撤销它在其他 channel 上的等待记录。

具体的内部结构和加锁顺序会随 Go 版本变化。面试中重点说明“多路注册、阻塞、单路唤醒、清理其余等待”即可。

## 如何使用 `select` 实现超时和取消？

### 回答重点

优先把 `context.Context` 的取消信号传入调用链。一次性短超时可以使用 `time.NewTimer`；循环中反复调用 `time.After` 会不断创建定时器，应根据场景复用 `Timer`。

```go
package main

import (
	"context"
	"fmt"
	"time"
)

func receive(ctx context.Context, ch <-chan int) (int, error) {
	select {
	case value := <-ch:
		return value, nil
	case <-ctx.Done():
		return 0, ctx.Err()
	}
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer cancel()

	_, err := receive(ctx, make(chan int))
	fmt.Println(err)
}
```

## 如何避免误用 `default`？

### 回答重点

带 `default` 的 `select` 是非阻塞轮询。把它放在没有退避的无限循环中会制造忙等，持续占用 CPU：

```go
for {
	select {
	case value := <-ch:
		use(value)
	default:
		// 这里若没有阻塞、退避或退出条件，就会忙等。
	}
}
```

如果需求是等待事件，应去掉 `default`；如果需求是周期性检查，应使用定时器、ticker 或显式退避。

### 扩展知识

- [Go 语言规范：Channel 类型](https://go.dev/ref/spec#Channel_types)
- [Go 语言规范：Select 语句](https://go.dev/ref/spec#Select_statements)
