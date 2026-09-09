---
title: LangChain 核心机制
---

[返回 Agent 应用开发总览](../Agent应用开发.md)

## 19. LangChain 是什么？为什么说它类似 Java 生态里的 Spring？

### 回答重点

LangChain 是一个专门用来构建大语言模型应用的开源框架，定位类似 Java 生态里的 Spring，把 LLM 开发中常用的组件都封装好了，文档加载、向量数据库、外部 API 调用、对话记忆管理这些脏活累活，框架都帮你处理了，开箱即用。

传统 LLM 开发有三个头疼的问题：

1）**上下文管理难**：聊几轮之后模型就"忘了"之前说的话，得自己写逻辑拼接历史消息。LangChain 的 Memory 组件直接搞定，对话历史缓存、实体关系跟踪都有现成实现。

2）**多工具协同麻烦**：比如用户问"2025年全球GDP排名"，模型自己答不了，得去调搜索引擎或数据库。LangChain 内置了一堆 Tools，搜索引擎、数据库查询、HTTP 请求都能直接用，还能让模型自己决定什么时候调哪个工具。

3）**复杂任务编排复杂**：一个任务可能涉及多次 LLM 调用和工具调用，比如"分析财报→提取关键指标→生成可视化建议"，手写这种流程代码很乱。LangChain 用 Chains 和 Agents 把这些操作串成工作流，逻辑清晰好维护。



LangChain 的几个实用特性：

1）内置 RetrievalQA 等预制链，5 行代码就能搭出一个知识库问答系统

2）支持 OpenAI、Hugging Face、Anthropic 等主流模型，甚至可以混合调用，比如用 GPT-4 生成创意，再用 Claude 审核合规性

3）配套的 LangSmith 平台支持全链路监控、成本分析和性能优化，乐天集团用 LangSmith 把 API 调用成本降了 60%

### 1.0 版本核心更新

2025 年 10 月 22 日发布的 LangChain 1.0，把定位从"LLM 工具链"升级为"LLM 应用开发全栈框架"，承诺 2.0 版本前无破坏性变更：

1）上下文管理升级：不光能缓存对话历史，还加了向量化存储、语义记忆优化、记忆过期策略、多轮对话摘要压缩，Token 成本能省不少

2）多工具协同升级：Core 层做了标准化抽象接口，对接外部工具、数据源不用再重复适配不同工具的调用逻辑

3）复杂任务编排升级：深度整合 LangGraph，支持可视化状态图编排和多智能体协作，告别旧版本线性链式调用的局限

|升级点|0.x 版本|1.0 版本|
|---|---|---|
|架构分层|高度耦合|拆分为 Core / Community / Partner 三层|
|核心执行接口|各组件接口不统一|所有组件统一实现 Runnable 接口|
|调用方式|仅支持同步|原生支持 invoke / ainvoke / stream 三种模式|
|复杂流程编排|线性 Chain，难以分支循环|深度集成 LangGraph，支持状态图、多智能体协作|
|稳定性承诺|无明确承诺|承诺 2.0 前无破坏性变更|

### 扩展知识

### 0.x 版本核心模块

**Chains**

LLMChain 是最基础的链，直接调用 LLM 生成内容。RetrievalQA 是做 RAG 的，先从向量数据库检索相关文档，再把文档塞给 LLM 生成答案。RouterChain 可以根据输入内容动态路由到不同的处理链，比如中文问题走中文链，技术问题走技术知识库链。

**Agents**

ReAct 模式是经典的"思考→行动→观察"循环，用户问"杭州今天天气如何"，Agent 会先思考需要调天气 API，然后执行调用，拿到结果后再组织回答。OpenAI Function Calling 则是直接让模型调用预定义的函数，省去了手动解析 JSON 的麻烦。

**Memory**

ConversationBufferMemory 最简单，把对话历史全存下来。VectorStoreRetrieverMemory 更智能，把记忆存到向量数据库里，用户提到"上周会议记录"，能通过语义检索自动关联相关文档。

### 1.0 架构拆分详解



1.0 最大的变化是架构解耦。以前组件耦合严重，改一个地方可能牵连一堆。现在拆成三层：

1）**Core 层**：定义核心抽象，Model、Retriever、Tool、Chain 这些基础接口都在这里，所有组件的兼容性靠它保证

2）**Community 层**：社区贡献的第三方集成，各种 LLM 适配器、向量数据库对接、工具插件都在这，不用重复造轮子

3）**Plus 层**：企业级功能，LangSmith 监控平台、LangServe 部署服务的商用支持

### 统一的 Runnable 接口

1.0 把所有可执行组件都统一到 Runnable 接口下，支持三种调用方式：`invoke()` 同步、`ainvoke()` 异步、`stream()` 流式输出。

以前写 RAG，得用 `RetrievalQA.from_chain_type()` 这种工厂方法，逻辑封装在内部，改起来麻烦。现在用 Runnable 组合组件，像搭积木一样拼流程：

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
# 初始化向量数据库检索器
embeddings = OpenAIEmbeddings()
vectorstore = Chroma(embedding_function=embeddings, persist_directory="./chroma_db")
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
# 定义提示词模板
prompt = ChatPromptTemplate.from_messages([ ("system", "严格根据以下上下文回答问题，不要编造：{context}"), ("human", "我的问题：{question}") ])
# 用 Runnable 拼接链
rag_chain = ( {"context": retriever, "question": RunnablePassthrough()} | prompt | ChatOpenAI(model="gpt-3.5-turbo") )
# 同步执行
result = rag_chain.invoke("LangChain 1.0 最大的变化是什么？")
# 流式输出
#
for chunk in rag_chain.stream("问题"):
    #
    print(chunk.content, end="", flush=True)
```

### 1.0 的 Agents 升级

1.0 的 Agents 基于 LangGraph 重构，从单智能体升级到多智能体协作：

1）**经典 ReAct 模式**：单智能体的"思考→调用工具→观察结果→再思考"循环，1.0 优化了工具调用的重试机制和权限控制

2）**多智能体模式**：比如搭一个销售分析系统，可以有"分析师智能体"负责分析销售数据、"写作智能体"负责生成报告、"发送智能体"负责发邮件给老板，通过 LangGraph 定义智能体间的消息传递和状态流转

### 相关文档与扩展阅读链接

- [LangChain官方文档](https://python.langchain.com/)

LangChain 生态还是比较全面的，包括 LangServe（将链部署为 REST API）、LangSmith（用于调试和监控）等工具，支持从开发到部署的全流程。



### 面试官追问

### 提问：LangChain 和直接调用 OpenAI API 比，什么场景下用 LangChain 更合适？

回答：简单的单轮对话，直接调 API 更轻量。但只要涉及多轮对话记忆、外部工具调用、多步骤任务编排，LangChain 的价值就体现出来了。比如做一个客服机器人，需要记住用户之前说过的订单号，还要能查数据库、调物流接口，这种场景手写逻辑很繁琐，LangChain 几行代码就能搞定。

### 提问：LangChain 的 Memory 组件会不会占用太多 Token？有什么优化手段？

回答：确实会，特别是 ConversationBufferMemory 把所有历史都塞进去，聊多了 Token 就爆了。优化手段有几种：用 ConversationSummaryMemory 把历史压缩成摘要；用 ConversationBufferWindowMemory 只保留最近 N 轮；1.0 版本还支持记忆过期策略，自动清理过时的上下文。

### 提问：LangGraph 和传统的 Chains 有什么本质区别？

回答：Chains 是线性的，A→B→C 顺序执行，想做分支或循环很别扭。LangGraph 是状态图，每个节点是一个处理单元，边可以带条件，支持分支、循环、并行执行。比如做一个审批流程，初审通过走 A 分支，不通过走 B 分支，这种用 LangGraph 画个图就行，用 Chains 得写一堆 if-else。

---

## 20. LangChain 的六大核心组件分别是什么？

LangChain 是一个专门用来开发大语言模型应用的框架，核心就是把 LLM 的能力和外部工具、数据源串起来。它的**六大核心组件**分别是：

1）Models：统一的模型接口层，支持 OpenAI、Anthropic、Mistral、Llama 等主流模型，换模型只需要改一行配置，业务代码不用动。

2）Prompt Templates：提示词模板，把提示词参数化。比如你有个客服场景，用户名、问题内容都是变量，模板引擎会自动填充进去，不用每次手动拼字符串。

3）Memory：记忆组件，分短期和长期两种。短期记忆就是当前会话的上下文，长期记忆一般配合向量数据库，把重要信息持久化下来，下次对话还能调用。

4）Chains：链式调用，把多个处理步骤串成一条流水线。简单任务用 Simple Chain，复杂任务用 Sequential Chain 把子任务串起来，每个环节都能复用。

5）Agents：智能体，基于 ReAct 框架实现。Agent 会根据用户输入动态决定该调哪个工具、执行什么动作，不是写死的流程。

6）Tools：工具集，Agent 调用外部资源的入口，比如 Google 搜索、SQL 查询、调第三方 API，让模型能干的事不只是生成文本。



---

## 21. LangChain 1.x 是怎么从组件库演进为 Agent 操作系统的？

### 回答重点

在 1.x 版本中，LangChain 完成了从“组件库”到“Agent 操作系统”的蜕变，核心架构从四层演进为**包含 LangGraph 在内的全新五大模块**。

1）LangChain Libraries：框架的代码库本体，又细分成三层。langchain-core 是最底层的抽象，定义模型接口、工具接口、向量存储这些基础协议，代码量很少但扩展性强。langchain 是主库，Chain 和 Agent 的编排逻辑都在这里。langchain-community 放的是社区贡献的第三方集成，比如各种模型适配器、文档解析器、向量库连接器。

2）LangGraph (核心编排引擎)： 这是 1.x 最重大的变化。它取代了老旧的 `AgentExecutor`，提供了一个**支持循环、状态持久化和“人在回路” (Human-in-the-loop)** 的图结构运行时。它是构建工业级、可控 Agent 的事实标准。

3）LangChain Middleware (中间件)： 1.x 新增层级，提供如 `SummarizationMiddleware`（长文本自动总结）和 `PIIMiddleware`（脱敏）等能力，让开发者通过“钩子”而非硬编码来处理安全和上下文管理。

3）LangServe：将 Chain 或 Graph 一行代码部署为生产级 REST API。它原生支持 **GPT-5 级别的长文本流式输出**，并自动生成符合 OpenAPI 标准的文档。

4）LangSmith：官方的可观测性平台，链路追踪、调试回放、A/B 测试、性能监控全都有，生产环境排查问题全靠它。

### 扩展知识

### 为什么要拆成这么多包

早期 LangChain 就一个包，所有代码塞一起，结果越来越臃肿。装个 langchain 要拉一堆你根本用不上的依赖，比如你只想用 OpenAI，结果把 Anthropic、Cohere、HuggingFace 的 SDK 全装上了，包大小直接爆炸。

0.1 版本开始拆包，核心抽象放 langchain-core，各家模型适配器独立成 langchain-openai、langchain-anthropic 这种小包，用哪个装哪个。社区贡献的放 langchain-community，官方维护的高质量集成放 langchain 主包。

这么拆的好处是依赖干净、升级风险小。langchain-core 基本不怎么变，业务代码依赖它就不容易被升级搞挂。

### LangServe 的实现细节

LangServe 本质上是把 LCEL 定义的 Chain 包装成 FastAPI 的 endpoint。它自动帮你干这些事：

1）生成 /invoke、/batch、/stream 三个端点，分别对应单次调用、批量调用、流式调用。

2）自动生成 OpenAPI schema，前端可以直接用 swagger 调试。

3）提供 /playground 页面，不写代码也能测试 Chain 的效果。

```python
from fastapi import FastAPI
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langserve import add_routes
app = FastAPI()
prompt = ChatPromptTemplate.from_template("翻译成英文：{text}")
chain = prompt | ChatOpenAI()
# 一行代码把 Chain 变成 API
add_routes(app, chain, path="/translate")
```

部署上线后，客户端调用 POST /translate/invoke，body 传 {"input": {"text": "你好"}} 就行。



### LangSmith 解决什么问题

LLM 应用调试特别头疼，输入输出都是大段文本，出了问题很难定位是哪一步挂的。传统日志只能看到最终结果，中间每个 Chain 节点的输入输出、token 消耗、耗时分布全看不到。

LangSmith 会自动采集每次调用的完整 trace，包括：

1）每个节点的输入输出，精确到每一步 prompt 模板渲染出来是什么样。

2）token 统计，input tokens、output tokens、总花费一目了然。

3）耗时瀑布图，哪个环节慢一眼就能看出来。

4）支持给 trace 打标签、写评注，方便团队协作排查问题。

用法也简单，设置两个环境变量就自动上报：

```bash
export LANGCHAIN_TRACING_V2=true export LANGCHAIN_API_KEY=your_api_key
```

### 面试官追问

### 提问：langchain-core 和 langchain 这两个包到底怎么分工的，我 import 的时候老搞混？

回答：记住一条原则就行，langchain-core 里的东西都是接口和协议，不带具体实现。比如 BaseChatModel、BaseRetriever、RunnableSequence 这些抽象类都在 core 里。langchain 主包放的是基于这些抽象构建的高级功能，比如 create_react_agent、load_tools 这些工厂函数。日常写代码，prompt 模板、output parser 这些从 langchain_core 导入，Agent 相关的从 langchain 导入，模型适配器从对应的 langchain-xxx 包导入。

### 提问：LangServe 的流式响应底层是怎么实现的？

回答：用的 Server-Sent Events，就是 HTTP 长连接持续推送。客户端发请求到 /stream 端点，服务端不是等 LLM 生成完再返回，而是每拿到一个 token 就往连接里写一条事件。前端用 EventSource API 或者 fetch + ReadableStream 接收，逐个 token 渲染出来，用户体验上就是打字机效果。LangServe 封装了这层逻辑，Chain 只要用 LCEL 写的，自动就支持 .stream()，不用自己处理 SSE 协议。

---

## 22. LangChain 的 Model 模块是怎么做统一接口封装的？

### 回答重点

LangChain 的 **Model 模块**就是一层统一的接口封装，让你用同样的代码去调用 OpenAI、Anthropic、Hugging Face 等不同厂商的模型，不用每换一个模型就改一套调用逻辑。

核心组件有这么几块：

1）LLM 和 ChatModel 接口。LLM 接口是传统的文本进文本出，ChatModel 则是专门为对话场景设计的，支持多轮对话的上下文管理。

2）Prompt 模板系统。用来构建和管理提示词，支持变量替换、条件逻辑，生成动态输入内容。

3）输出解析器。把模型吐出来的原始文本转成 JSON、列表这类结构化数据，方便后续处理。

4）同步异步双支持。同步调用、异步处理都能用，高并发场景直接上 async 就行。

5）批量处理和流式输出。一次性处理几十上百个输入，或者边生成边返回给用户看，都支持。

Model I/O 模块的整体架构分为三层：输入层是 Prompt 模板系统，负责构建动态提示词；中间层是 Model 调用层，统一封装了 LLM 和 ChatModel 两类接口，向下对接 OpenAI、Anthropic、HuggingFace 等各厂商 API；输出层是 Output Parser，将原始响应解析成结构化数据。



---

## 23. LangChain Agent 的自主决策能力是怎么实现的？

### 回答重点

LangChain Agent 是框架里负责**自主决策**的组件，核心能力是让 LLM 根据用户输入动态选择该调哪个工具、按什么顺序执行，而不是走写死的流程。

传统的 Chain 是你提前定好第一步干什么、第二步干什么，执行路径是固定的。Agent 不一样，它拿到用户的问题后会先思考这个任务需要哪些信息、该用什么工具获取，执行完一个工具后还会根据返回结果判断够不够，不够就继续调别的工具，直到能给出最终答案。

举个例子，用户问"北京今天天气怎么样，适合跑步吗"。Agent 会先调天气 API 拿到温度、湿度、空气质量这些数据，然后把这些数据喂给 LLM，让它结合健康知识判断适不适合户外运动，最后组织成自然语言回复用户。整个过程 Agent 自己决定先查天气再做判断，不是你硬编码的。



### 扩展知识

### Agent 的决策原理

Agent 能做决策靠的是 ReAct 框架，全称 Reasoning and Acting。核心思想是让模型交替进行"推理"和"行动"，每一步都输出结构化的内容：

1）Thought：模型先说清楚现在在想什么，需要什么信息。

2）Action：决定调用哪个工具，传什么参数。

3）Observation：工具执行完返回的结果。

4）循环往复，直到模型觉得信息够了，输出 Final Answer。

这个过程全靠 prompt 驱动。LangChain 会把所有可用工具的名称、描述、参数格式塞进 system prompt，要求模型按固定格式输出。框架解析模型输出，提取 Action 字段去调用对应工具，再把 Observation 拼回对话历史让模型继续推理。

```python
from langchain_openai import ChatOpenAI
from langchain.agents import create_react_agent, AgentExecutor
from langchain import hub
from langchain_community.tools import DuckDuckGoSearchRun
# 准备工具
search = DuckDuckGoSearchRun()
tools = [search]
# 拉取 ReAct prompt 模板
prompt = hub.pull("hwchase17/react")
# 创建 Agent
llm = ChatOpenAI(model="gpt-4")
agent = create_react_agent(llm, tools, prompt)
# 包装成 executor 才能跑
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
result = executor.invoke({"input": "OpenAI 最新发布了什么产品"})
```

### 不同类型的 Agent

LangChain 提供了好几种 Agent 实现，适用场景不同：

|类型|特点|适用场景|
|---|---|---|
|ReAct Agent|经典的推理-行动循环|通用场景，工具数量不多|
|OpenAI Functions Agent|用 OpenAI 的 function calling|工具调用更稳定，格式不容易乱|
|OpenAI Tools Agent|支持并行调用多个工具|需要同时查多个数据源|
|Structured Chat Agent|支持多输入参数的工具|工具参数复杂的场景|
|Self-Ask Agent|拆解问题后逐个解决|复杂的多跳推理|

0.1 版本之前常用 initialize_agent 这个工厂函数创建 Agent，0.2 版本推荐用 create_react_agent、create_openai_functions_agent 这些更细粒度的函数，可控性更强。

### Agent 和 Chain 怎么选

不是所有场景都适合用 Agent。Agent 的优势是灵活，但灵活的代价是不可控。模型可能调错工具、陷入死循环、token 消耗爆炸，这些问题在生产环境很头疼。

选型建议：

1）流程固定、步骤明确的任务用 Chain。比如"先翻译再总结"这种，用 Chain 串起来就行，没必要让模型自己决策。

2）流程不确定、需要根据中间结果调整的任务用 Agent。比如"帮我调研一下竞品"，不知道要查多少资料、查到什么程度算够，这种交给 Agent 合适。

3）生产环境优先考虑 OpenAI Functions Agent，因为 function calling 是模型原生支持的，格式稳定性比 ReAct 靠纯 prompt 引导要好很多。

### 常见的坑

1）工具描述写不好，模型就选不对工具。描述要清晰说明这个工具干什么、什么时候该用、参数是什么含义，别指望模型自己猜。

2）没设 max_iterations，Agent 可能无限循环。一般设个 10-15 次上限，超了就强制返回。

3）工具太多，模型容易懵。单个 Agent 挂 5-8 个工具差不多了，再多就考虑拆成多个 Agent 分工。

4）没做异常处理，工具调用失败直接崩。要用 handle_parsing_errors=True 让 Agent 能从错误中恢复。

### 面试官追问

### 提问：Agent 执行过程中 token 消耗怎么控制，一个复杂任务跑下来成本会不会很高？

回答：确实会高，每一轮 ReAct 循环都要把历史对话全部发给模型，越到后面 token 越多。控制手段有几个：设 max_iterations 限制最大循环次数；用 ConversationSummaryMemory 压缩历史对话；选便宜的模型跑中间步骤，只在最后一步用贵的模型出结果；还有就是优化工具，让工具返回精简的结果而不是大段原始数据。

### 提问：怎么让 Agent 调用多个工具并行执行，而不是串行一个一个来？

回答：用 OpenAI Tools Agent，它支持 parallel_tool_calls。模型一次可以输出多个 tool_call，框架会并发执行这些工具，把结果一起返回给模型。不过要注意，并行只在工具之间没有依赖关系时才合适，如果后一个工具的输入依赖前一个工具的输出，那还是得串行。

### 提问：Agent 调用工具失败了怎么办，比如 API 超时或者返回了错误？

回答：AgentExecutor 有个 handle_parsing_errors 参数，开启后解析失败不会直接抛异常，而是把错误信息作为 Observation 返回给模型，让模型自己决定怎么处理，可能是重试、换个工具、或者告诉用户这个信息拿不到。更稳妥的做法是在工具层面做 try-catch，工具内部处理异常，返回友好的错误提示而不是让框架崩掉。

---

## 24. LangChain 中 Chain 和 Agent 的本质区别是什么？

### 回答重点

Chain 和 Agent 是 LangChain 里两种完全不同的任务编排方式，核心区别在于**执行流程是固定的还是动态决策的**。

**Chain** 是一条预定义的流水线，步骤写死在代码里，输入进去按顺序走完就出结果。比如"拿到用户问题 → 检索相关文档 → 拼成 prompt → 调 LLM 生成答案"，每一步干什么、下一步去哪都是确定的。

**Agent** 是一个能自己思考的智能体，拿到任务后会判断该用什么工具、该怎么一步步推进。它有一个 ReAct 循环：思考当前状态 → 决定下一个动作 → 执行动作 → 观察结果 → 继续思考，直到任务完成。整个过程是 LLM 在做决策，代码只提供工具和约束。



举几个具体场景：

Chain 适用场景： 1）RAG 问答系统。用户问题进来，检索 → 拼 prompt → 生成答案，流程固定，Chain 跑起来稳定又快。 2）文档摘要。读文档 → 切分 → 分段总结 → 合并，每步都确定。 3）数据清洗流水线。格式转换 → 校验 → 入库，不需要 LLM 动态判断。

Agent 适用场景： 1）复杂信息查询。用户问"帮我查下 OpenAI 最近的股价走势和新闻"，Agent 判断需要先调股票 API 拿数据，再调搜索引擎查新闻，最后整合成答案。 2）代码调试助手。拿到报错后，Agent 决定是先看日志、查文档还是搜 Stack Overflow，根据每一步结果动态调整。 3）自动化办公。用户说"帮我约下周和张三的会议"，Agent 需要查日历、发邮件、等回复，每一步都依赖上一步结果。

---
