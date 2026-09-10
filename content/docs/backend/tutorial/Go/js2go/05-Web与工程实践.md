# JS 转 Go：Web 与工程实践

> **本页关键词**：net/http、Gin、json tag、中间件、gRPC、go test、表驱动、pprof、多阶段 Docker

---

## 一、HTTP：从 Express 过来

标准库就能起服务，没有「必须装框架」这一说。框架（Gin / Echo / Chi）主要加路由参数、中间件链、绑定。

最小服务：

```go
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello")
})
log.Fatal(http.ListenAndServe(":3000", nil))
```

先读这段代码：

- `http.HandleFunc("/", handler)`：给路径 `/` 注册一个处理函数。
- `func(w http.ResponseWriter, r *http.Request)`：这是标准库 handler 的固定签名。
- `w http.ResponseWriter`：响应写入器，接近 Express 的 `res`。
- `r *http.Request`：请求对象，接近 Express 的 `req`。
- `http.ListenAndServe(":3000", nil)`：监听 3000 端口并启动服务。
- `log.Fatal(...)`：如果服务启动失败，打印错误并退出进程。

对照 Express：

```js
app.get("/", (req, res) => {
  res.send("Hello");
});
app.listen(3000);
```

Go 标准库默认每个请求一个 goroutine，所以 handler 里可以写同步风格代码；但请求取消、超时和共享变量仍要认真处理。

路由参数标准库较弱，生产常用 Gin：

```go
r := gin.Default()
r.GET("/hello/:name", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Hello, " + c.Param("name")})
})
r.Run(":3000")
```

Gin 这段更接近 Express：

- `gin.Default()` 创建带日志和 recover 中间件的路由器。
- `r.GET("/hello/:name", ...)` 注册 GET 路由，`:name` 是路径参数。
- `c *gin.Context` 把请求、响应、参数、JSON 输出等能力包在一起。
- `c.Param("name")` 读取路径参数。
- `c.JSON(200, gin.H{...})` 返回 JSON。

| | Go | Node |
| --- | --- | --- |
| 核心 | `net/http` | `http` / Express |
| 并发 | 每请求 goroutine | 事件循环 |
| JSON | `encoding/json` + 结构体 tag | `JSON.parse` / body-parser |
| 静态文件 | `http.FileServer` | `express.static` |
| 错误 | 返回 error + 状态码 | `next(err)` / try/catch |

请求要可取消：用 `r.Context()`，下游查询、RPC 都带上。超时用 `http.Server{ReadTimeout, WriteTimeout}`，不要只靠框架默认。

`r.Context()` 的意义是：客户端断开、请求超时或服务关闭时，context 会收到取消信号。数据库查询、RPC 调用如果带着这个 context，就能及时停掉，不会在后台继续浪费资源。

---

## 二、JSON、中间件、静态文件

```go
type User struct {
    Name string `json:"name"`
    Age  int    `json:"age"`
}

func userHandler(w http.ResponseWriter, r *http.Request) {
    var u User
    if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
        http.Error(w, "bad json", http.StatusBadRequest)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(u)
}
```

这段代码可以拆开读：

- `var u User`：声明一个 `User`，字段都是零值。
- `json.NewDecoder(r.Body).Decode(&u)`：从请求 body 读取 JSON，并写入 `u`。这里传 `&u`，因为解码器要修改这个变量。
- `http.Error(...)`：返回错误状态码和文本。
- `w.Header().Set("Content-Type", "application/json")`：设置响应头。
- `json.NewEncoder(w).Encode(u)`：把 `u` 编码成 JSON 写回响应。

只有**大写字段**会进出 JSON。`json:"-"` 忽略；`omitempty` 零值省略。

```go
type User struct {
    Name     string `json:"name"`
    Password string `json:"-"`
    Nickname string `json:"nickname,omitempty"`
}
```

这里 `Password` 不会出现在 JSON 里；`Nickname` 如果是空字符串，也会被省略。

标准库中间件就是包一层 `http.Handler`：

```go
func Logger(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Printf("%s %s", r.Method, r.URL.Path)
        next.ServeHTTP(w, r)
    })
}
http.ListenAndServe(":3000", Logger(http.DefaultServeMux))
```

先读类型：

- `http.Handler` 是接口，核心方法是 `ServeHTTP(w, r)`。
- `Logger(next http.Handler) http.Handler` 表示：接收一个 handler，返回一个新的 handler。
- 新 handler 先打印日志，再调用 `next.ServeHTTP(w, r)` 把请求交给下一层。

这和 Express 中间件“先做点事，再 `next()`”很像，只是 Go 标准库里 `next` 是一个 `http.Handler`。

静态文件：`http.Handle("/", http.FileServer(http.Dir("./public")))`。

实战最小闭环：路由 + JSON CRUD + 日志中间件 + 表驱动测 handler（`httptest`）。不必先上微服务。

---

## 三、微服务只记骨架

Go 适合微服务：二进制小、启动快、goroutine 扛连接。服务间通信常见 gRPC（Protobuf）或 JSON HTTP。

Protobuf 先定义服务契约，再生成 Go / TS / Java 等语言的代码：

```protobuf
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
}
```

这段读作：`UserService` 有一个 `GetUser` 方法，接收 `GetUserRequest`，返回 `User`。

和 REST 比：

- gRPC 是二进制协议，传输效率高。
- Protobuf 是 IDL，接口结构更明确，能生成类型代码。
- gRPC 自带流式调用，适合服务间通信。
- 浏览器直连不方便，对外仍常走 HTTP 网关。

其余工程点当清单，不必背实现：

- **发现**：K8s DNS / Consul；本地写死地址即可
- **配置**：环境变量 + 文件；十二要素，密钥不要进镜像
- **熔断**：下游持续失败就快速返回，避免雪崩（`gobreaker` 一类库）
- **追踪**：请求带 `trace id`，OpenTelemetry
- **网关**：鉴权、限流、路由；业务服务不对外暴露

> **面试要点**：能说清「同步 RPC 用 gRPC、对外 API 用 HTTP 网关、超时和熔断必须有」，比默写一段 Consul 注册代码有用。

---

## 四、测试与调试

测试文件：`foo_test.go`，和源码同包（可测未导出符号）或 `package foo_test`（只测公开 API）。

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b, want int
    }{
        {"正数", 1, 2, 3},
        {"零", 0, 1, 1},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := Add(tt.a, tt.b); got != tt.want {
                t.Fatalf("got %d want %d", got, tt.want)
            }
        })
    }
}

func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(1, 2)
    }
}
```

表驱动测试的核心是：把多组输入和期望值放进一个切片，然后循环跑同一段断言。它比复制多份测试函数更好维护。

这段里匿名结构体的字段含义是：

- `name`：子测试名字。
- `a, b`：输入。
- `want`：期望输出。
- `t.Run(tt.name, ...)`：每条 case 单独成为一个子测试，失败时更容易定位。

```bash
go test ./...
go test -cover ./...
go test -bench=. -benchmem
go test -fuzz=FuzzXxx   # 1.18+ 模糊测试
```

这些命令分别是：

- `go test ./...`：测试当前模块下所有包。
- `go test -cover ./...`：带覆盖率。
- `go test -bench=. -benchmem`：跑 benchmark，并显示内存分配。
- `go test -fuzz=FuzzXxx`：跑模糊测试。

HTTP 用 `net/http/httptest` 起内存 Server，不必听端口。调试：VS Code Delve，或日志 + `pprof`：

```go
import _ "net/http/pprof"
go http.ListenAndServe("localhost:6060", nil)
# go tool pprof http://localhost:6060/debug/pprof/profile
```

CPU、堆、goroutine 阻塞都能看。优化前先 pprof，不要猜。

---

## 五、云原生部署

Go 静态链接，镜像可以很小。多阶段构建：

```dockerfile
FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /server ./cmd/server

FROM alpine:3.20
RUN adduser -D app
COPY --from=build /server /server
USER app
ENTRYPOINT ["/server"]
```

这叫多阶段构建：

- 第一阶段用 Go 镜像编译，里面有完整工具链。
- 第二阶段只复制编译好的 `/server`，运行镜像更小。
- `CGO_ENABLED=0` 尽量产出不依赖 C 运行库的二进制，减少环境问题。
- `USER app` 让容器以非 root 用户运行。

K8s 配：

- `livenessProbe`：死了重启
- `readinessProbe`：没准备好不进流量
- `resources.requests/limits`：调度和限流
- 密钥走 Secret，不写进环境示例值

本地多服务用 Compose 即可。Istio / 服务网格是流量治理加层，不是 Go 入门必选项。

CI 最小集：`gofmt` 检查、`go test ./...`、构建镜像、推仓库。健康检查接口返回 200 + 依赖探测（DB ping）。

> **面试要点**：Go 上云的卖点是「单文件、秒级启动、内存小」，对应 Docker 多阶段 + 探针 + 资源限制这三件事。
