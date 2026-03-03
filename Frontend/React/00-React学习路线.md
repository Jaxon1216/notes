# React 学习路线

> **本页关键词**：学习路线、核心概念、组件化、性能优化、路由、状态管理

---

## 一、学习路径概览

React 学习按「核心思想 → 组件化 → 工程能力」递进：

| 阶段 | 核心内容 | 对应笔记 |
|------|----------|----------|
| **第一阶段** | 核心概念、JSX、useState、useEffect | [[01-核心概念与基础语法]] |
| **第二阶段** | 组件拆分、props、状态提升、React.memo、useCallback、自定义 Hook | [[02-组件化与性能优化]] |
| **第三阶段** | React Router、useContext、useReducer | [[03-路由与状态管理]] |

---

## 二、详细学习顺序

### 1. 核心基础（必掌握）

- **UI = f(state)**：理解 React 的更新机制（state 变化 → 函数重新执行 → diff）
- **JSX/TSX**：本质是 `React.createElement` 的语法糖
- **useState**：状态声明与更新
- **useEffect**：副作用与依赖数组
- **组件即函数**：每次 state 变化，组件函数会重新执行

### 2. 组件化

- **props 传递**：父 → 子单向数据流
- **状态提升**：兄弟组件共享状态
- **re-render 机制**：父组件 re-render 会带动所有子组件 re-render

### 3. 性能优化

- **React.memo**：根据 props 未变时跳过渲染
- **useCallback**：稳定函数引用，避免 props 引用变化导致无效 re-render
- **useMemo**：缓存计算结果

### 4. 逻辑复用

- **自定义 Hook**：以 `use` 开头，抽离并复用状态逻辑（类似 Vue 3 的 Composable）

### 5. 路由与状态管理

- **React Router**：`BrowserRouter`、`Routes`、`Route`、`Link`、`useParams`
- **useContext**：跨组件共享数据（类似 Vue 的 provide/inject）
- **useReducer**：复杂状态集中管理，dispatch + reducer 模式

---

## 三、笔记索引

| 文件 | 内容范围 |
|------|----------|
| [[01-核心概念与基础语法]] | JSX/TSX、useState、useEffect、条件渲染与列表渲染、闭包与 key |
| [[02-组件化与性能优化]] | props、re-render 机制、React.memo、useCallback、useMemo、自定义 Hook |
| [[03-路由与状态管理]] | React Router、useParams、useContext、useReducer、Context + useReducer 实战 |

---

## 四、学习建议

1. **动手优先**：边看边敲，不只看不写
2. **理解 re-render**：用 `console.log` 观察组件执行时机，理解父组件 re-render 对子组件的影响
3. **用 Todo 串联**：从计数器到 Todo List，再到路由、Context，用同一项目贯穿全部知识点
