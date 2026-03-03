# Performance API 性能监控

> **本页关键词**：Performance API、Navigation Timing、Resource Timing、User Timing、PerformanceObserver

---

## 一、Performance API 总览

### 定义与能力

**Performance API** 是浏览器提供的一组用于高精度测量网页性能的接口。解决的问题是：浏览器在**何时**、**做了什么**、**耗时多少**。

与 `Date.now()` 对比：

- 精度更高（微秒级）
- 以浏览器内部时间轴为基准
- 可测量网络、渲染、JS 执行等阶段

### 应用场景

- 分析页面加载慢的原因（DNS、TCP、TTFB、DOM 等）
- 衡量首屏、可交互时间等用户体验指标
- 做性能监控、埋点、报警
- 评估优化效果

---

## 二、核心对象与高精度时间

### window.performance

```javascript
console.log(window.performance);
```

入口对象，包含时间基准、性能记录访问与管理接口。

### performance.now()

```javascript
performance.now();
```

- 返回从页面加载开始的相对时间（毫秒，精度高于 `Date.now()`）
- 不受系统时间修改影响
- 常用于函数耗时、动画帧间隔、算法对比

---

## 三、Performance Entry

**Performance Entry** 表示一条性能事件，如：加载 JS 文件、页面导航、开发者打点。

通用结构：

```typescript
{
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}
```

不同类型 Entry 在此基础上扩展字段。

---

## 四、getEntries 系列方法

| 方法 | 说明 |
|------|------|
| `performance.getEntries()` | 返回所有类型 Entry，数据混杂 |
| `performance.getEntriesByType(type)` | 按类型获取（`resource`、`navigation`、`mark`、`measure`），最常用 |
| `performance.getEntriesByName(name, type?)` | 按名称获取 |

```javascript
performance.getEntriesByType('resource');
performance.getEntriesByType('navigation');
performance.getEntriesByType('mark');
performance.getEntriesByType('measure');
```

---

## 五、Navigation Timing（页面加载）

### navigation Entry

```javascript
const nav = performance.getEntriesByType('navigation')[0];
```

描述当前文档的加载过程。普通页面通常只有一条记录。

### 常用字段

| 字段 | 含义 |
|------|------|
| `startTime` | 通常为 0 |
| `type` | navigate / reload / back_forward |
| `domainLookupStart` / `End` | DNS 查询 |
| `connectStart` / `End` | TCP 建立 |
| `requestStart` | 请求发出 |
| `responseEnd` | 响应完成 |
| `domInteractive` | DOM 可交互 |
| `loadEventEnd` | 页面完全加载 |

---

## 六、Resource Timing（资源加载）

```javascript
performance.getEntriesByType('resource');
```

用于分析 JS / CSS / 图片加载耗时、资源是否阻塞、CDN 是否生效。

示例字段：`name`、`entryType`、`initiatorType`（script / link / img / fetch / xmlhttprequest）、`startTime`、`responseEnd`。

---

## 七、User Timing（自定义打点）

```javascript
performance.mark('api-start');
performance.measure('api-cost', 'api-start');
performance.getEntriesByType('measure');
```

SPA 性能监控常用手段：通过 `mark` 记录时间点，`measure` 计算区间耗时。

---

## 八、Performance Observer

`getEntriesByType` 为事后获取，**PerformanceObserver** 可实时监听。

```javascript
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry);
  }
});
observer.observe({ entryTypes: ['resource', 'navigation'] });
```

---

## 九、注意事项

| 问题 | 说明 |
|------|------|
| SPA 路由切换 | 不会产生 navigation entry，需用 mark / measure 自行打点 |
| Entry 缓冲区 | 可能被 `performance.clearResourceTimings()` 清空 |
| 兼容性 | 老浏览器可能缺少 navigation timing level 2，需兜底判断 |

### 安全使用示例

```javascript
function getNavigationTimingSafe() {
  if (!window.performance?.getEntriesByType) return null;
  const entries = performance.getEntriesByType('navigation');
  if (!entries.length) return null;
  return entries[0];
}
```

---

## 十、核心名词与 API 对应

| 名词 | Performance API 字段 |
|------|----------------------|
| DNS | domainLookupStart / End |
| TCP | connectStart / End |
| TLS | secureConnectionStart |
| TTFB | responseStart - requestStart |
| HTML 加载 | responseEnd |
| DOM Ready | domContentLoadedEventEnd |
| 页面完成 | loadEventEnd |

### 核心认知

- DNS / TCP / TLS / TTFB 仅发生在「真正加载页面」时，SPA 路由切换不会重复
- iframe 有独立的 `contentWindow.performance`
- 所有性能数据均为 Entry；`getEntriesByType` 始终返回数组

> **面试要点**：User Timing 是 SPA 性能监控的关键；SPA 无 document 导航，需自行打点；理解 TTFB 对前后端问题定位的意义。
