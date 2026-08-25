# JS 转 Go：并发与 Channel

> **本页关键词**：并发 vs 并行、goroutine、channel、缓冲、select、WaitGroup、context、worker pool、泄漏

---

## 一、模型差在哪

JS 主线程是事件循环：await 让出线程，真正并行要靠 Worker。Go 的 goroutine 由运行时调度到多个 OS 线程上，**既能并发也能并行**。

口号：**不要用共享内存通信，用通信来共享内存。** 数据通过 channel 交出去，而不是到处加锁（锁仍然有，`sync.Mutex` 用于确实要共享的状态）。

| | Goroutine | OS 线程 | JS 异步 |
| --- | --- | --- | --- |
| 栈 | 起始约 2KB，可增长 | 约 MB 级 | 调用栈 + 闭包 |
| 创建成本 | 很低 | 高 | Promise 对象开销小，但不吃多核 CPU |
| 调度 | Go runtime M:N | 内核 | 事件循环 |

主 goroutine 结束，整个进程退出，不等待其他 goroutine。所以不能只 `go f()` 然后立刻 `return`。

---

## 二、Goroutine

```go
go simulateTask("A", 2*time.Second)
go func(name string) {
    fmt.Println("hi", name)
}("g")
```

`go` 后面必须是函数调用。同步不要用 `time.Sleep` 碰运气，用 `WaitGroup` 或 channel：

```go
var wg sync.WaitGroup
for i := 0; i < 3; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        worker(id)
    }(i) // 把 i 当参数传入；Go 1.22 前闭包直接抓 i 会全是 3
}
wg.Wait()
```

> **面试要点**：`go f()` 不会自动把错误抛给调用方。错误要经 channel 传回，或在 goroutine 里记日志。某个 goroutine 里 panic 且没 recover，**整个进程崩溃**。

---

## 三、Channel

```go
ch := make(chan string)    // 无缓冲
ch := make(chan string, 2) // 缓冲 2
ch <- "hi"                 // 发送
msg := <-ch                // 接收
v, ok := <-ch              // ok=false 表示已关闭且读完
close(ch)                  // 只能关一次；关后发送会 panic
```

方向约束（编译期）：

```go
func produce(out chan<- string) { out <- "x"; close(out) }
func consume(in <-chan string)  { fmt.Println(<-in) }
```

| | 无缓冲 `make(chan T)` | 缓冲 `make(chan T, n)` |
| --- | --- | --- |
| 发送 | 必须有人正在收，否则阻塞 | 未满不阻塞 |
| 接收 | 必须有人正在发 | 空则阻塞 |
| 用途 | 同步握手 | 解耦快慢、限流 |

`nil` channel 上的发送/接收会**永远阻塞**。`close` 只由发送方做；接收方用 `for v := range ch` 读到关闭为止。

```go
go func() { ch <- "done"; close(ch) }()
msg := <-ch
```

---

## 四、Select

同时等多个 channel，哪个就绪走哪个；都就绪则随机挑一个。类似 `Promise.race`，但可同时处理发送和接收。

```go
select {
case msg := <-chA:
    fmt.Println("A", msg)
case msg := <-chB:
    fmt.Println("B", msg)
case <-time.After(time.Second):
    fmt.Println("timeout")
case chC <- "ping":
    fmt.Println("sent")
default:
    fmt.Println("都没就绪，非阻塞")
}
```

`default`：当前没有可执行的 case 就立刻走，用来探测「能不能发/收」而不卡住。

超时用 `time.After` 或 `context.WithTimeout`，不要为每个请求 `Sleep`。

---

## 五、常见模式

**Worker pool**：固定 N 个 worker 从任务 channel 取活，避免「一个请求一个 goroutine」把内存打爆。

```go
jobs := make(chan int, 100)
results := make(chan int, 100)

for w := 0; w < 4; w++ {
    go func() {
        for j := range jobs {
            results <- j * j
        }
    }()
}
for i := 0; i < 20; i++ {
    jobs <- i
}
close(jobs)
```

**Fan-out / Fan-in**：一个 channel 分给多个 worker（out）；多个结果 channel 再合成一个（in）。工作池就是 fan-out 的一种。

**Pipeline**：`chan` 串起来，每级 `for v := range in { out <- f(v) }`，最后 `close(out)`。

**Context 取消**（对照 JS `AbortController`）：

```go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()

go func() {
    select {
    case <-time.After(5 * time.Second):
        fmt.Println("完成")
    case <-ctx.Done():
        fmt.Println("取消:", ctx.Err())
    }
}()
```

请求链路里把 `ctx` 往下传：HTTP Server 自带、gRPC 自带。超时、客户端断开、优雅退出都靠它，而不是全局 flag。

---

## 六、泄漏与锁

泄漏典型原因：

- goroutine 卡在无缓冲发送上，接收方已经走了
- `range ch` 但发送方从不 `close`
- `time.After` 在热循环里创建却没读（用 `time.NewTimer` 并 `Stop`）
- 没有 `ctx.Done()`，后台任务一直活着

channel 由**发送者关闭**；关闭后所有接收者都能感知。重复 close、向已关闭 channel 发送都会 panic。

共享内存时：

```go
var mu sync.Mutex
mu.Lock()
// 改共享数据
mu.Unlock()
```

或 `sync.RWMutex`、原子操作。能用 channel 把所有权交出去时，优先 channel；计数、连接池这类用 Mutex 更直接。

> **面试要点**：能讲清「无缓冲 = 同步、缓冲 = 队列、select = 多路等待、context = 取消树」，再配一个 worker pool，并发题基本够用。
