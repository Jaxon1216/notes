# JS 转 Go：并发与 Channel

> **本页关键词**：并发 vs 并行、goroutine、channel、缓冲、select、WaitGroup、context、worker pool、泄漏

---

## 一、模型差在哪

JS 主线程是事件循环：await 让出线程，真正并行要靠 Worker。Go 的 goroutine 由运行时调度到多个 OS 线程上，**既能并发也能并行**。

先区分两个词：

- **并发**：多个任务在同一段时间内都在推进，不一定同一瞬间一起跑。JS 事件循环能做到这种并发。
- **并行**：多个任务在同一瞬间真的跑在多个 CPU 核上。Go 的多个 goroutine 可以被调度到多个 OS 线程上，所以能并行。

可以粗略理解成：

```text
JS async/await：一个主线程不断切任务，适合 IO 等待
Go goroutine：很多轻量任务交给 Go runtime 调度，可以吃多核
```

口号：**不要用共享内存通信，用通信来共享内存。** 数据通过 channel 交出去，而不是到处加锁（锁仍然有，`sync.Mutex` 用于确实要共享的状态）。

| | Goroutine | OS 线程 | JS 异步 |
| --- | --- | --- | --- |
| 栈 | 起始约 2KB，可增长 | 约 MB 级 | 调用栈 + 闭包 |
| 创建成本 | 很低 | 高 | Promise 对象开销小，但不吃多核 CPU |
| 调度 | Go runtime M:N | 内核 | 事件循环 |

主 goroutine 结束，整个进程退出，不等待其他 goroutine。所以不能只 `go f()` 然后立刻 `return`。

这点容易踩：`go f()` 的意思是“启动一个新 goroutine 去跑 f”，不是“等 f 跑完”。如果 `main` 直接结束，后台 goroutine 还没来得及输出也会被进程一起带走。

---

## 二、Goroutine

```go
go simulateTask("A", 2*time.Second)
go func(name string) {
    fmt.Println("hi", name)
}("g")
```

先读语法：

- `go simulateTask(...)`：新开一个 goroutine 执行这个函数调用。
- `go func(...) { ... }("g")`：新开一个 goroutine 执行匿名函数，并把 `"g"` 作为参数传进去。
- `go` 后面必须是**函数调用**，不能只写函数名。

同步不要用 `time.Sleep` 碰运气，用 `WaitGroup` 或 channel。`WaitGroup` 可以理解成一个计数器：启动任务前加 1，任务结束减 1，主 goroutine 等计数归零。

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

这段代码的运行过程是：

1. 每次循环 `wg.Add(1)`，表示多了一个要等待的任务。
2. goroutine 里 `defer wg.Done()`，表示函数结束时计数减 1。
3. `wg.Wait()` 会阻塞，直到所有任务都 `Done`。

`}(i)` 是故意把循环变量 `i` 作为参数传入。Go 1.22 之前，闭包直接捕获循环变量容易拿到最后一轮的值；即使新版本修了这个坑，显式传参仍然更好读。

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

channel 是 goroutine 之间传值的管道。先读几个操作：

- `make(chan string)`：创建一个传 `string` 的无缓冲 channel。
- `make(chan string, 2)`：创建一个缓冲区大小为 2 的 channel。
- `ch <- "hi"`：往 channel 里发送。
- `msg := <-ch`：从 channel 里接收。
- `v, ok := <-ch`：接收值，同时判断 channel 是否已经关闭且读完。
- `close(ch)`：关闭 channel，告诉接收方“后面没有新值了”。

无缓冲 channel 像一次当面交接：发送方和接收方必须同时到场，否则先到的人会等。

```go
ch := make(chan string)

go func() {
    ch <- "hi" // 等到有人接收，这行才继续往下
}()

msg := <-ch
fmt.Println(msg)
```

缓冲 channel 像一个有容量的队列：队列没满时发送方可以先放进去，队列为空时接收方会等。

方向约束（编译期）：

```go
func produce(out chan<- string) { out <- "x"; close(out) }
func consume(in <-chan string)  { fmt.Println(<-in) }
```

这里的箭头位置表示方向：

- `chan<- string`：只能发送，函数内部不能从它接收。
- `<-chan string`：只能接收，函数内部不能往它发送。

方向约束不改变运行时行为，主要是让编译器帮你挡住误用。

| | 无缓冲 `make(chan T)` | 缓冲 `make(chan T, n)` |
| --- | --- | --- |
| 发送 | 必须有人正在收，否则阻塞 | 未满不阻塞 |
| 接收 | 必须有人正在发 | 空则阻塞 |
| 用途 | 同步握手 | 解耦快慢、限流 |

`nil` channel 上的发送/接收会**永远阻塞**。`close` 只由发送方做；接收方用 `for v := range ch` 读到关闭为止。

```go
ch := make(chan string)

go func() {
    ch <- "done"
    close(ch)
}()

for msg := range ch {
    fmt.Println(msg)
}
```

关闭 channel 不是“销毁变量”，而是告诉接收方不会再有新值。已经发送进去的值仍然可以被读完。读完后再接收，会拿到元素类型的零值，并且 `ok == false`。

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

`select` 的关键是“等事件”，不是“按顺序判断”。上面这些 case 谁先就绪就执行谁。几个点要记住：

- `case msg := <-chA`：等 `chA` 有值可读。
- `case chC <- "ping"`：等 `chC` 可以发送。
- `case <-time.After(time.Second)`：最多等 1 秒，超时后这个 case 就绪。
- `default`：没有任何 case 就绪时立刻执行，所以它会让 `select` 变成非阻塞。

超时用 `time.After` 或 `context.WithTimeout`，不要为每个请求 `Sleep`。`Sleep` 只是傻等，不能响应取消；`select` + `context` 才能在“完成、超时、取消”之间选一个。

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

这段代码里：

- `jobs` 是任务队列。
- `results` 是结果队列。
- 4 个 goroutine 同时从 `jobs` 里取任务，谁空闲谁拿下一个。
- `close(jobs)` 表示任务投递结束，worker 里的 `for j := range jobs` 会在读完后退出。

如果不限制 worker 数量，而是在大循环里无限 `go func()`，瞬时任务多时会把内存、数据库连接或下游服务打爆。worker pool 的意义就是“控制并发度”。

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

`context` 可以理解成 Go 里的取消信号树，接近 JS 的 `AbortController`。`ctx.Done()` 是一个 channel：一旦超时、手动取消或客户端断开，它就会被关闭，所有监听它的 goroutine 都能收到信号。

请求链路里把 `ctx` 往下传：HTTP Server 自带、gRPC 自带。超时、客户端断开、优雅退出都靠它，而不是全局 flag。

日常规则：

- 函数接收 `ctx context.Context` 时，一般放第一个参数。
- 创建了 `cancel` 就尽量 `defer cancel()`，及时释放定时器等资源。
- 下游 DB、RPC、HTTP 请求都优先使用支持 context 的 API。

---

## 六、泄漏与锁

goroutine 泄漏就是：你以为任务结束了，但某个 goroutine 还卡在那里，永远不退出。它不像内存泄漏那样直观，但会慢慢吃掉 goroutine 数、内存、连接和定时器。

典型原因：

- goroutine 卡在无缓冲发送上，接收方已经走了
- `range ch` 但发送方从不 `close`
- `time.After` 在热循环里创建却没读（用 `time.NewTimer` 并 `Stop`）
- 没有 `ctx.Done()`，后台任务一直活着

channel 由**发送者关闭**；关闭后所有接收者都能感知。重复 close、向已关闭 channel 发送都会 panic。接收方不要 close channel，因为接收方通常不知道还有没有其他发送者。

共享内存时：

```go
var mu sync.Mutex
mu.Lock()
// 改共享数据
mu.Unlock()
```

项目里更常写成：

```go
mu.Lock()
defer mu.Unlock()
// 改共享数据
```

这样即使中间提前 `return`，锁也会释放。

或 `sync.RWMutex`、原子操作。能用 channel 把所有权交出去时，优先 channel；计数、缓存、连接池这类共享状态，用 Mutex 更直接。

> **面试要点**：能讲清「无缓冲 = 同步、缓冲 = 队列、select = 多路等待、context = 取消树」，再配一个 worker pool，并发题基本够用。
