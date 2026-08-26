# JS 转 Go：Web 与工程实践

> **本页关键词**：net/http、Gin、json tag、中间件、gRPC、go test、表驱动、pprof、多阶段 Docker

---

## 一、HTTP：从 Express 过来

标准库就能起服务，没有「必须装框架」这一说。框架（Gin / Echo / Chi）主要加路由参数、中间件链、绑定。

```go
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello")
})
log.Fatal(http.ListenAndServe(":3000", nil))
```

对照 Express：`http.ResponseWriter` ≈ `res`，`*http.Request` ≈ `req`。默认每个请求一个 goroutine。

路由参数标准库较弱，生产常用 Gin：

```go
r := gin.Default()
r.GET("/hello/:name", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Hello, " + c.Param("name")})
})
r.Run(":3000")
```

| | Go | Node |
| --- | --- | --- |
| 核心 | `net/http` | `http` / Express |
| 并发 | 每请求 goroutine | 事件循环 |
| JSON | `encoding/json` + 结构体 tag | `JSON.parse` / body-parser |
| 静态文件 | `http.FileServer` | `express.static` |
| 错误 | 返回 error + 状态码 | `next(err)` / try/catch |

请求要可取消：用 `r.Context()`，下游查询、RPC 都带上。超时用 `http.Server{ReadTimeout, WriteTimeout}`，不要只靠框架默认。

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

只有**大写字段**会进出 JSON。`json:"-"` 忽略；`omitempty` 零值省略。

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

静态文件：`http.Handle("/", http.FileServer(http.Dir("./public")))`。

实战最小闭环：路由 + JSON CRUD + 日志中间件 + 表驱动测 handler（`httptest`）。不必先上微服务。

---

## 三、微服务只记骨架

Go 适合微服务：二进制小、启动快、goroutine 扛连接。服务间通信常见 gRPC（Protobuf）或 JSON HTTP。

Protobuf 定义服务，再生成代码：

```protobuf
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
}
```

和 REST 比：gRPC 是二进制、有 IDL、自带流；浏览器直连不方便，对外仍常走 HTTP 网关。

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

```bash
go test ./...
go test -cover ./...
go test -bench=. -benchmem
go test -fuzz=FuzzXxx   # 1.18+ 模糊测试
```

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

`CGO_ENABLED=0` 避免依赖 glibc。容器以非 root 跑。K8s 配：

- `livenessProbe`：死了重启
- `readinessProbe`：没准备好不进流量
- `resources.requests/limits`：调度和限流
- 密钥走 Secret，不写进环境示例值

本地多服务用 Compose 即可。Istio / 服务网格是流量治理加层，不是 Go 入门必选项。

CI 最小集：`gofmt` 检查、`go test ./...`、构建镜像、推仓库。健康检查接口返回 200 + 依赖探测（DB ping）。

> **面试要点**：Go 上云的卖点是「单文件、秒级启动、内存小」，对应 Docker 多阶段 + 探针 + 资源限制这三件事。
