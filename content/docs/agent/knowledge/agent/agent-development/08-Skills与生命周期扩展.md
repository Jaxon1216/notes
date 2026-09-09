---
title: Skills 与生命周期扩展
---

[返回 Agent 应用开发总览](../Agent应用开发.md)

## 50. MCP 和 Skills 有什么区别？

### 回答重点

MCP 给 Agent 提供"工具"，Skills 给 Agent 提供"方法论"，两者解决的是完全不同层面的问题。

MCP 全称 Model Context Protocol，是一套标准化的**工具调用协议**，让 AI Agent 能调用外部服务。查数据库、调 API、读文件系统，都是通过 MCP 来实现的。它解决的是 Agent "能不能做"的问题。

Skills 是一套指令文档，告诉 Agent 遇到某类任务应该怎么做、按什么顺序做、要注意什么。它解决的是 Agent "会不会做"和"做得好不好"的问题。

MCP 相当于给厨师配了一套厨具，锅碗瓢盆、烤箱微波炉；Skills 相当于给厨师一本菜谱，红烧肉先焯水再上色，火候多大放多少料。光有工具不知道怎么用，做不出好菜；光有菜谱没有工具，也做不了饭。



|维度|MCP|Skills|
|---|---|---|
|本质|工具调用协议|指令知识文档|
|解决的问题|Agent 能力边界扩展|Agent 任务执行质量|
|运行时行为|发起外部调用，获取结果|注入上下文，引导决策|
|技术形态|客户端-服务端架构，JSON-RPC 通信|Markdown 文件，纯文本|
|开发成本|需要写代码，部署服务|主要写文档就行，可零代码、也可提供脚本|
|动态性|实时调用，结果随外部状态变化|静态知识，加载后不变|

### 扩展知识

### 两者的协作关系

实际的 Agent 系统中，MCP 和 Skills 通常是配合使用的。看一个典型场景：

> 用户说："帮我创建一个 MCP Server"

Agent 的处理流程是这样的：

首先系统识别出这是一个"创建 MCP Server"的任务，加载对应的 Skill。然后 Agent 读取 Skill 中定义的标准流程，包括创建项目结构、写 Server 代码、配置 Transport、注册 Tools 等步骤。在执行过程中，Agent 通过 MCP 协议调用文件系统工具来创建文件、调用终端工具来安装依赖。



Skill 决定了"做事的顺序和方法"，MCP 提供了"做事所需的工具"，两者缺一不可。

### 与其他相似概念的对比

面试中可能还会追问 Skills 和其他概念的区别，这里一并梳理。

### Skills vs System Prompt

System Prompt 是全局性的，每次对话都会生效；Skill 是按需加载的，只在匹配到特定任务时才注入。如果所有知识都塞进 System Prompt，上下文会过长、Token 浪费严重。

Skills 的设计就是为了解决这个问题，把**知识模块化**，按需组装。

### Skills vs RAG

RAG 侧重于"检索知识来回答问题"，检索粒度是知识片段 Chunk，产出的是信息。Skills 侧重于"加载流程来指导行动"，加载粒度是完整的操作文档，产出的是行为。

在 Agent 系统中，两者可能同时存在：Skill 告诉 Agent 怎么处理文档问答任务，RAG 负责在执行过程中检索具体知识。

### Skills vs Function Calling

Function Calling 和 MCP 类似，都是让 LLM 能调用外部函数。Skills 和 Function Calling 处于不同层次：Function Calling 是能力层，管的是"能做什么"；Skills 是策略层，管的是"怎么做"。

### 什么时候用 Skills，什么时候用 MCP

给一个简单的判断标准：

1）想让 Agent 能做某件事，比如读数据库、发邮件、操作浏览器，上 MCP 2）想让 Agent 把某件事做好，比如按照团队规范写代码、按标准流程做 Code Review，上 Skills 3）大多数实际场景两者都需要，组合使用就对了

---

## 51. Skills 体系应该怎么设计？

### 回答重点

设计 Skills 体系分三个层面来讲：单个 Skill 怎么写、多个 Skills 怎么组织、上线后怎么维护。

1）单个 Skill 至少要把四件事写清楚：什么时候触发、任务目标是什么、分步骤的操作流程要具体到每一步用什么工具传什么参数、边界情况和常见错误。最后这部分往往是从踩坑经验中提炼出来的，也是最值钱的。

2）当 Skills 数量上来之后，需要合理的目录结构。按领域分目录，每个 Skill 独立一个文件夹，里面放 SKILL.md 和可能需要的模板文件：

```text
skills/ ├── coding/ │ ├── create-api/ │ ├── code-review/ │ └── refactor/ ├── devops/ │ ├── deploy/ │ └── monitoring/ └── project/ ├── create-pr/ └── write-docs/
```

3）Skills 是活的文档，需要一套**反馈闭环**：用了效果好的标记为"验证通过"，效果差的分析原因修改，定期清理过时的 Skills 避免误导 Agent。



### 扩展知识

### Skills 匹配策略

当 Skill 库里有几十上百个 Skills 时，怎么高效匹配到对应的 Skill 就成了关键问题。常见的匹配策略有三种。

### 关键词规则匹配

在 Agent 的 System Prompt 中列出所有可用 Skills 的简短描述和触发关键词，让 LLM 自行判断是否需要加载某个 Skill。Cursor 目前就是这么做的，在 System Prompt 里放一个 Skills 清单，每个条目包含名称、路径和一句话描述。实现简单，但 Skills 数量多了之后会占用大量上下文窗口。

### 语义检索匹配

对所有 Skill 的描述信息做 Embedding，当用户输入任务时，通过语义相似度检索最匹配的 Skills。本质上就是把 RAG 的思路用在了 Skill 匹配上。可以支持大规模 Skill 库，但有检索准确率的问题，可能漏掉重要的 Skill 或者匹配到不相关的。

### 分层路由

先用一个轻量模型做粗筛，判断任务属于哪个大类，比如编码、运维、写作，再从对应类别下精确匹配具体的 Skill。类似于搜索引擎的"先分类再检索"，是目前比较有前景的方案，能兼顾效率和准确率。

分层路由的匹配流程：用户输入任务后，先经过一个轻量分类模型，判断任务属于哪个大类，如编码、运维、写作。然后在对应类别的 Skill 子集中，通过关键词或语义匹配找到具体的 Skill 文件。最后加载匹配到的 Skill 注入 LLM 上下文。



### 实际项目中的常见挑战

### Skill 冲突

当多个 Skills 同时被加载，且指令存在矛盾时，Agent 会产生困惑。比如一个 Skill 说"代码要加详细注释"，另一个说"代码应该自解释，少写注释"。比较好的做法是设计优先级机制，项目级 Skill 优先于全局 Skill，具体 Skill 优先于通用 Skill。

### Skill 的时效性

技术更新很快，去年写的 Skill 里引用的 API 可能已经废弃了，推荐的依赖版本可能有安全漏洞。如果 Agent 按过时的 Skill 执行，产出的结果就有问题了。好的做法是给 Skill 加上版本号和最后更新日期，定期 Review。对于变化快的领域，比如前端框架，可以在 Skill 里引用外部链接，不要硬编码具体版本号。

### Skill 效果评估

怎么衡量一个 Skill 好不好用？不像模型微调有 Loss 曲线可以看，Skill 的效果更难量化。需要建立评估指标，比如任务完成率、用户修改率也就是 Agent 产出的结果被用户改了多少、执行步骤数等。收集足够多的数据后，持续迭代优化 Skill 内容。

### 面试官追问

### 提问：Skill 冲突这个问题，除了优先级机制还有没有其他解决思路？

回答：可以做 Skill 的作用域隔离。比如把 Skills 按生命周期阶段分组，编码阶段的 Skill 和 Review 阶段的 Skill 不会同时加载，天然避免冲突。另一个思路是让 Agent 在检测到冲突时主动询问用户，把决策权交出来。还有一种更激进的做法是 Skill 合并，如果两个 Skill 有重叠的部分，定期把它们合并成一个更完整的 Skill，从源头消灭冲突。

### 提问：如果让你从 0 搭建一个团队级的 Skills 管理系统，你会怎么设计？

回答：核心要搞定三件事。第一是 Skill 的存储和版本管理，用 Git 仓库就行，跟代码一样走 PR 流程。第二是匹配引擎，项目初期 Skills 少的时候用关键词匹配就够了，等数量到 50 个以上再切到语义检索或分层路由。第三也是最重要的，要建一套效果追踪机制，每次 Skill 被调用后记录任务是否成功、用户有没有手动修改输出、执行耗时多少。有了这些数据才能持续优化 Skill 质量。

### 提问：你说 Skill 可以自动生成，这个靠谱吗？准确率怎么保证？

回答：目前还不太靠谱，只能做到半自动。AI 可以根据一次成功的执行记录生成 Skill 的初稿，但质量参差不齐。关键问题在于 AI 很难判断哪些步骤是通用的、哪些是只针对当前任务的特殊操作。通常的做法是 AI 生成初稿，人工 Review 后修改发布。实测下来大概 60-70% 的步骤是有用的，剩下的需要人工调整。

---

## 52. 如何做工具注册的 Schema 归一化？

### 回答重点

核心思路就是在工具注册和模型调用之间加一层 **Schema 归一化**（归一化就是"统一格式"的意思）。

工具只用标准 JSON Schema 定义一次，系统根据目标 Provider（模型提供商，比如 OpenAI、Google、Anthropic）自动做清洗和转换，把各家的差异屏蔽掉。

这个问题有多恶心呢？各家 Provider 对 JSON Schema 的支持程度天差地别：



OpenClaw 在 `normalizeToolParameters()` 里集中处理这些适配逻辑，根据当前请求的目标 Provider 选择对应的清洗策略，上层开发者注册工具的时候完全不用操心这些差异。

### 扩展知识

### 为什么不让开发者自己适配

你可能会想，让每个工具开发者针对不同 Provider 写不同版本的 Schema 不就行了？问题是工具的数量和 Provider 的数量是乘法关系。

假设你有 30 个工具、5 个 Provider，那就是 150 份 Schema 要维护。每次某个 Provider 更新了它的 Schema 支持规则，你要改的地方散落在几十个工具定义文件里，根本维护不过来。

所以正确做法就是 OpenClaw 这种"**一次定义，按需转换**"的架构。工具开发者只管用标准 JSON Schema 把参数描述清楚，转换这种脏活累活全交给中间的适配层。

### 源码解析：normalizeToolParameters，Schema 参数归一化

`normalizeToolParameters()` 是整个适配层的入口函数，定义在 `src/agents/pi-tools.schema.ts`。它接收一个工具定义和目标 Provider 信息，输出适配后的工具定义。核心逻辑分三步走：

```typescript
export
function normalizeToolParameters( tool: AnyAgentTool, options?: { modelProvider?: string;
 modelId?: string }, ): AnyAgentTool {
// 第一步：根据 Provider 选择清洗策略
function applyProviderCleaning(s: unknown): unknown {
if (isGeminiProvider)
return cleanSchemaForGemini(s);
if (isXai)
return stripXaiUnsupportedKeywords(s);
return s;
// Anthropic / OpenAI 基本透传 }
// 第二步：如果 Schema 已经是标准 object 格式，直接清洗返回
if ("type" in schema && "properties" in schema && !Array.isArray(schema.anyOf)) {
return { ...tool, parameters: applyProviderCleaning(schema) };
 }
// 第三步：处理 union 类型（anyOf / oneOf）—— 展平为单个 object
const variants = schema[variantKey];
// anyOf 或 oneOf 的数组
// 遍历所有 variant，合并 properties，计算 required 交集
for (const entry of variants) {
for (const [key, value] of Object.entries(props)) { mergedProperties[key] = mergePropertySchemas(mergedProperties[key], value);
 } }
// 输出展平后的 { type: "object", properties: { ... } } 格式
return { ...tool, parameters: applyProviderCleaning(flattenedSchema) };
 }
```

**设计亮点**：展平 union 时通过 `mergePropertySchemas()` 合并同名属性的 enum 值。比如两个 variant 分别有 `action: "read"` 和 `action: "write"`，合并后变成 `action: { enum: ["read", "write"] }`，最大限度保留语义信息。

**required 的计算也很巧妙**：只有在所有 variant 里都出现的 required 字段，才会被保留为最终 required。这避免了展平后某些可选分支的字段被错误地标记为必填。

### 源码解析：normalizeOpenAiFunctionAnthropicToolDefinition，工具格式转换

除了 Schema 内容的差异，不同 Provider 对工具定义的 **外层结构** 也不一样：

|Provider|工具格式|
|---|---|
|OpenAI|`{ type: "function", function: { name, parameters, description } }`|
|Anthropic|`{ name, input_schema, description }`|

`normalizeOpenAiFunctionAnthropicToolDefinition()` 负责把 Anthropic 格式转成 OpenAI 格式，用于那些使用 Anthropic API 但底层走 OpenAI 兼容协议的第三方 Provider：

```typescript
function normalizeOpenAiFunctionAnthropicToolDefinition(tool) {
// 如果已经是 OpenAI 格式（有
function 字段），直接返回
if (toolObj.function && typeof toolObj.function === "object") {
return toolObj;
 }
// 从 Anthropic 格式提取字段，优先取 input_schema，兜底取 parameters
const functionSpec = { name: toolObj.name, parameters: toolObj.input_schema ?? toolObj.parameters ?? { type: "object", properties: { } }, };
// 包装成 OpenAI 的 { type: "function", function: { ... } } 格式
return { type: "function", function: functionSpec };
 }
```

这个函数在 `createAnthropicToolPayloadCompatibilityWrapper()` 中被调用，通过 `onPayload` 钩子在请求发出前拦截并转换工具定义。这种 **装饰器/中间件** 的设计避免了在主流程里堆 if-else，新增兼容性处理只需要再套一层 wrapper。

### 实际踩坑案例

最典型的一个坑是工具参数用了 `oneOf` 来描述"参数可以是字符串或数字"。

在 Anthropic 和 OpenAI 上跑得好好的，换到 Google Gemini 直接炸了，因为 Gemini 压根不认 `oneOf`。OpenClaw 的处理方式就是上面说的展平逻辑：把多个 variant 的 properties 合并到一个 object 里。

另一个常见坑是 OpenAI 要求顶层必须是 `type: "object"`。如果你的工具 Schema 只写了 `properties` 但没写 `type`（TypeBox 的 union 编译结果就是这样），OpenAI 会直接拒绝。`normalizeToolParameters()` 检测到这种情况会自动补上 `type: "object"`。

第三个坑来自第三方 Provider 的协议混搭：有些 Provider 用 Anthropic 的模型，但 API 走 OpenAI 兼容协议，工具格式必须用 OpenAI 的 `{ type: "function", function: {...} }` 包装。

这就是 `normalizeOpenAiFunctionAnthropicToolDefinition` 存在的原因：自动检测并转换格式，调用方完全无感。

---

## 53. Hook/中间件模式如何在 Agent 生命周期中做定制？

### 回答重点

Hook/中间件模式就是在 Agent 的关键生命周期节点上挂自定义逻辑，不动核心代码就能做定制。

通俗理解：Hook 就像流水线上的"检查站"，产品（消息/请求）经过每个检查站时，你可以检查、修改甚至拦截它，但流水线的主体流程不需要改动。

典型场景：

1）模型调用前换模型。比如做 A/B 测试，50% 的请求走 GPT，50% 走 Claude，Hook 里随机一下就搞定，不用改业务代码。

2）构建 System Prompt 时注入额外上下文。比如当前用户偏好用中文回复，Hook 里把这个偏好塞进 prompt 就行。

3）消息收到时做内容审核。用户输入可能包含敏感内容，Hook 里调一下审核 API，命中就拦截，不让请求往下走。

4）Agent 回复后做日志记录和分析，统计 token 消耗、响应时间、模型选择分布这些指标。

OpenClaw 的 Hook 系统分两层：

**内部 Hook** ，事件类型覆盖 `command`、`session`、`agent`、`gateway`、`message`，支持 `{type}:{action}` 粒度，比如 `message:received`、`gateway:startup`。

**插件 Typed Hook** ，提供强类型的 Hook 名：`before_model_resolve` 修改模型选择、`before_prompt_build` 注入上下文和 System Prompt、`llm_input` 拦截 LLM 输入、`subagent_spawning` 拦截子 Agent 创建。

一个请求进来，依次经过：message:received Hook 接收消息，before_model_resolve Hook 决定用哪个模型，before_prompt_build Hook 注入上下文，llm_input Hook 拦截或修改 LLM 输入，模型调用，结果返回，后置 Hook 做日志和分析。

### 扩展知识

### Hook 的注册和优先级

插件注册 Hook 的方式很直观：

```typescript
api.on("before_prompt_build", handler, { priority: 10 });
```

`priority` 控制多个 Hook 的执行顺序，**数字越大优先级越高**（源码中按 `(b.priority ?? 0) - (a.priority ?? 0)` 降序排列）。多个插件都监听同一个事件时，按 priority 从高到低依次执行。

### Hook 的两种执行模式

OpenClaw 的 Hook 分为两类执行模式：

**Void Hook（发射即忘）**：多个 handler **并行**执行，不返回值，用于观测和记录。比如 `message_received`、`agent_end`、`llm_input` 这些都是 void hook，适合做日志、审计、监控这类不影响主流程的事情。

**Modifying Hook（可修改数据）**：多个 handler **串行**按优先级依次执行，每个 handler 的返回值会跟前面的结果合并，最终产出一个修改后的结果。比如 `before_prompt_build` 可以往 prompt 里注入内容，`before_tool_call` 可以拦截或修改工具参数。

这个区分很重要：void hook 因为并行执行所以快，但不能影响数据流；modifying hook 因为串行所以能做管道式的数据变换，但执行顺序依赖 priority。

### 和其他框架的 Hook 机制对比

LangChain 的 Callback 机制也是类似思路，通过 `CallbackManager` 注册 `on_llm_start`、`on_llm_end` 这些回调。

区别在于 LangChain 的 Callback 更偏向观察和记录，OpenClaw 的 Hook 可以直接修改数据流，比如 `before_model_resolve` 可以换掉模型、`llm_input` 可以改写输入内容，**拦截能力**更强。



---

## 54. 面试问答合集


面试问答

开始面试

隐藏答案

### 回答重点

**短期记忆**就是当前对话的上下文，所有的历史消息、system prompt、工具调用结果都在里面，直接存在 context window 里，LLM 每次推理都能看到。就像你正在开会，桌上摊开的文件就是短期记忆，随时能看到，但桌子大小有限。生命周期等于一次会话，会话结束就没了。

**长期记忆**是跨会话持久化的知识，比如用户偏好、项目上下文、过往的决策记录。就像你的档案柜，里面存了过去的工作记录，需要的时候去查。这些数据存在外部存储里（向量数据库、文件系统等），需要的时候通过检索注入到 context 里。

两者最根本的区别：

- 短期记忆精度高但容量有限，受 context window 上限约束，塞满了就得做压缩或截断。
- 长期记忆容量几乎无限，但检索有损，搜出来的内容不一定完全匹配当前需要。



### 扩展知识

### 短期记忆的管理策略

context window 总归是有上限的。一个复杂的编程任务聊上一会儿，消息加上工具调用结果轻轻松松超过 100K token。

这时候就得做 **compaction（压缩）**，常见的有三种策略：

1）滑动窗口，只保留最近 N 轮对话，最简单但会丢失早期重要上下文。

2）摘要压缩，让 LLM 对历史对话生成一段摘要替换掉原始消息，LangChain 的 ConversationSummaryMemory 就是这个思路。

3）选择性保留，根据消息的重要性打分，重要的原文保留，不重要的压缩或丢弃。

生产环境一般是组合使用。比如 system prompt 和最近 5 轮对话原文保留，更早的历史做摘要压缩，工具调用结果只保留关键片段。

### 长期记忆的存储和检索

长期记忆的核心问题是"存什么"和"怎么搜"。

存储内容一般分三类：

- 事实性知识，像"用户更喜欢 Spring Boot 不用 Quarkus"
- 经验性知识，像"上次部署踩了端口冲突的坑"
- 还有项目上下文，代码结构、技术栈选型记录这些。

检索方式主流是**混合检索**：

- 向量搜索负责"意思相近"的语义匹配（比如搜"跨域问题"能找到"CORS 配置"）
- 全文搜索负责"精确关键词"匹配（直接匹配 CORS 这个词）

两者的结果做 rerank（重新排序融合）。

之所以需要混合是因为单纯靠向量搜索不靠谱。比如用户说"找一下上次 CORS 配置"，向量搜索可能返回一堆跟跨域沾边但不相关的内容，全文搜索直接匹配 CORS 关键词准得多。

反过来，只用全文搜索也不行，比如用户说"上次那个安全策略怎么配的"，全文搜索搜不到"CORS"，但向量搜索能通过语义关联找到。所以两者互补才是最优解。

### 短期记忆到长期记忆的自动转化

一个关键设计模式是 **Memory Flush（记忆刷盘）**：当对话接近压缩阈值时，系统先触发一次 LLM 调用，让模型把当前会话中的关键信息（决策、待办、偏好等）提取出来写到持久化存储里，然后再做压缩。

这样即使历史消息被压缩或丢弃，关键信息还能通过长期记忆检索回来。

还有一种常见做法是**会话结束时自动归档**，系统把本次会话内容持久化成记忆文件，实现短期记忆到长期记忆的自然过渡。

MemGPT 把这个机制做得更极致，它直接让 LLM 自主管理自己的记忆，模型可以主动决定把什么存进长期记忆、什么时候从长期记忆里检索、什么时候更新或删除旧记忆。本质上是把记忆管理也变成了一种工具调用。

**整个循环**：短期记忆（context window）→ 触发压缩阈值 → Memory Flush 提取关键信息 → 写入长期记忆 → 新会话启动时 → 混合检索 → 注入 context window → 又成为短期记忆的一部分。

### 常见的坑

1）长期记忆写入太频繁会导致噪音过多，检索质量下降。要做去重和过期清理，比如 30 天没被检索命中的记忆自动降权。

2）embedding 模型换了之后旧的向量全部作废，需要重新索引。生产环境要在记忆数据里同时存原文，方便后续迁移。

3）短期记忆的 compaction 策略如果太激进，模型会出现"失忆"的表现，前面说过的事情后面忘了。要在 token 节省和上下文质量之间找平衡。

---
