# Agent Skills 从概念到实战

> 一篇面向 **普通开发者 / AI 工具使用者** 的教学型科普文档，带你真正搞懂什么是 Agent Skills、它为什么出现、工作原理是什么，以及如何在 **Cloud Code、Cursor、Codex 等 IDE / Agent 工具中使用它**。

---

## 一、Agent Skills 是什么？一句话讲清楚

**Agent Skills 本质上是一种「可按需加载的结构化提示词机制」。**

如果用一个直观的比喻：

* **Prompt**：像一次性把整本书塞给 AI
* **Agent Skills**：像一本

  * 📑 **目录（Metadata）**
  * 📖 **正文（Instructions）**
  * 📎 **附录（Resources）**

AI 先只看「目录」，**只有在确认需要时，才会翻到正文或附录**。

> 官方常见定义：
>
> > Agent Skills = 一种“渐进式披露（Progressive Disclosure）”的 Prompt 组织方式

---

## 二、为什么 Agent Skills 会火？

在 2025 年下半年之前，大多数 AI Agent 主要依赖两种方式：

### 1️⃣ 传统 Prompt（问题）

* 所有指令一次性塞进上下文
* Prompt 越来越长、越来越难维护
* Token 消耗极高

### 2️⃣ MCP（Model Context Protocol）

* 解决了 **工具调用** 问题
* 但：

  * 编写成本高（Node / Python 服务）
  * 不适合管理复杂提示词

### Agent Skills 的出现，正好补上了中间这一块空白：

| 维度       | Prompt | Skills           | MCP  |
| -------- | ------ | ---------------- | ---- |
| 主要用途     | 直接对话   | 提示词管理            | 工具调用 |
| Token 消耗 | 高      | **低**            | 中    |
| 编写难度     | 低      | **很低（Markdown）** | 高    |
| 是否按需加载   | ❌      | **✅**            | ❌    |

> 2025 年 12 月 18 日，Anthropic 正式将 **Agent Skills 发布为开放标准**，使其和 MCP 一样，走向跨平台、通用规范。

---

## 三、Agent Skills 的三层结构（核心原理）

一个完整的 Skill，通常由 **三层组成**：

```
Skill Folder/
├── Skill.md          # 必须
├── scripts/          # 可选：脚本
├── references/       # 可选：参考资料
└── assets/           # 可选：图片等资源
```

### 1️⃣ Metadata（元数据层）——目录

写在 `Skill.md` 顶部，用 `---` 包裹。

作用：

* 告诉 AI：**这个 Skill 是干什么的**
* **什么时候应该调用它**

示例：

```markdown
---
name: 字幕转Markdown
description: 当用户提供 SRT 字幕文件，希望整理成 Markdown 笔记时使用
---
```

⚠️ **这一部分永远会被加载进上下文，但内容必须非常精简**。

---

### 2️⃣ Instructions（指令层）——正文

* 写在 `Skill.md` 的元数据下面
* 用 Markdown 组织
* 描述 **AI 的角色、任务、约束、输出格式**

示例片段：

```markdown
你是一个专业的字幕文本处理助手。

## 任务
- 将 SRT 字幕完整转换为 Markdown
- 禁止删减、总结、省略

## 格式要求
- 保留时间顺序
- 在关键位置插入截图占位符：

![[IMAGE_HERE]]
```

📌 **只有当 AI 决定“要用这个 Skill”时，这一层才会被加载**。

---

### 3️⃣ Resources（资源层）——附录

Skill 文件夹中，除了 `Skill.md` 以外的所有内容，统称为资源层。

可以是：

* 📄 示例文档（references）
* 🐍 Python / Shell 脚本（scripts）
* 🖼 图片、模板（assets）

关键特性：

> **资源层也是按需加载的，AI 只会在“认为有必要”时读取。**

---

## 四、Agent Skills 的完整运行流程（非常重要）

以下流程几乎适用于所有支持 Skills 的 Agent：

### 🧠 Step 1：收集目录

* Agent 扫描本地所有 `Skill.md`
* 只读取 **Metadata**
* 形成一个「可用技能列表」

### 🧠 Step 2：模型决策

* 用户问题 + Skills 元数据 → 发给大模型
* 模型判断：

  * 不用 Skill
  * 或选择某一个 Skill

### 🧠 Step 3：加载指令

* Agent 加载选中 Skill 的 **Instructions**
* 发送给模型

### 🧠 Step 4：按需读取资源

* 如果指令中需要：

  * 读文件
  * 跑脚本
* 才会加载对应资源

👉 这就是 **渐进式披露（Progressive Disclosure）**。

---

## 五、在 Cloud Code 中使用 Agent Skills（入门实战）

### 1️⃣ Skill 的目录位置

项目级 Skills：

```
project/
└── .cloud/
    └── skills/
        └── your-skill/
            └── Skill.md
```

### 2️⃣ 创建第一个 Skill

示例：**字幕转 Markdown**

```text
.cloud/skills/字幕转markdown/Skill.md
```

写好 Metadata + Instructions 即可生效。

### 3️⃣ 启动 & 查看 Skills

```bash
cloud
/skills
```

### 4️⃣ 使用 Skill

* 拖入字幕文件
* AI 识别到场景
* 询问是否调用 Skill
* 确认 → 自动执行

---

## 六、全局 Skills（一次编写，处处可用）

你可以把 Skills 变成「全局技能库」：

```
~/.cloud/cloudcode/skills/
```

放到这里的 Skill：

* 对所有项目生效
* 非常适合：写作、总结、格式化、代码风格统一等

---

## 七、在 Cursor / Codex 等 IDE 中使用 Skills

### Cursor / Codex 的基本思路

* 每个 Agent 都有自己的配置目录
* 只需：

  * 开启 Skills 功能
  * 把 `.cloud` 改成对应目录

### Codex 示例

```text
.codex/skills/字幕转markdown/Skill.md
```

启动后：

```bash
codex
/skills
```

即可看到 Skills。

---

## 八、进阶：Skills + 脚本（资源层）

### 为什么要用脚本？

* AI 不适合：

  * 视频截图
  * 批量文件处理
* 但 AI **很适合决定“什么时候调用脚本”**

### 示例：字幕 + 视频 → 图文 Markdown

```
字幕转markdown/
├── Skill.md
└── scripts/
    └── capture.py
```

特点：

* Python 脚本 **不进入上下文**
* 只执行结果
* Token 消耗极低

⚠️ 注意：

> Scripts 依赖本地环境，成功率不如 MCP

---

## 九、Agent Skills vs Prompt vs MCP（终极对比）

| 项目    | Prompt | Skills | MCP   |
| ----- | ------ | ------ | ----- |
| 核心能力  | 表达需求   | 管理提示词  | 工具调用  |
| 上下文效率 | ❌      | ✅      | ❌     |
| 编写成本  | 低      | **很低** | 高     |
| 脚本稳定性 | ❌      | 一般     | **高** |

### 最佳实践建议

* **Prompt**：临时问题
* **Skills**：

  * 写作风格
  * 固定流程
  * 长期可复用能力
* **MCP**：

  * GitHub
  * 数据库
  * 外部 API

👉 **Skills 管提示词，MCP 管工具**

---

## 十、Skills + MCP 协作范式（未来趋势）

典型模式：

1. Skill 定义完整流程逻辑
2. 在指令中指定：

   * 什么时候用 MCP
   * 用哪个工具
3. MCP 负责稳定执行

示例：

* Skill：帮我写作 + 发布流程
* MCP：

  * 创建 GitHub 仓库
  * 上传文件

这是目前 **最强 Agent 组合方案**。

---