---
layout: doc
---

<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.classList.add('homepage')
})

onUnmounted(() => {
  document.body.classList.remove('homepage')
})
</script>

<div class="home-page">
  <header class="home-hero">
    <div>
      <p class="home-kicker">Easton Notes</p>
      <h1>工程实践知识库</h1>
    </div>
    <p class="home-subtitle">前端、服务端、Agent 应用开发、个人开发常用资料统一入口。</p>
    <div class="home-stats" aria-label="站点统计">
      <div><strong>62</strong><span>篇文章</span></div>
      <div><strong>5</strong><span>主栏目</span></div>
      <div><strong>4</strong><span>已有内容</span></div>
    </div>
  </header>

  <nav class="home-quick" aria-label="快速入口">
        <a href="/frontend/knowledge/ajax-promise-axios/01-手撕Promise与异步编程">前端</a>
        <a href="#backend">服务端</a>
        <a href="/algorithm/basics/algorithm">算法</a>
        <a href="/agent/knowledge/agent/Agent应用开发">Agent</a>
        <a href="/dev/linux/linux">开发常用</a>
        <a class="home-quick-contribute" href="/README#贡献优质好文项目">贡献指南</a>
  </nav>

  <main class="home-layout">
  <section class="home-section" id="frontend">
    <div class="home-section-main">
      <div>
        <p class="home-kicker">frontend</p>
        <h2>前端</h2>
        <p>沉淀 Web 框架、工程化、浏览器基础和前端项目实践。</p>
      </div>
      <a class="home-section-link" href="/frontend/knowledge/ajax-promise-axios/01-手撕Promise与异步编程">进入栏目</a>
    </div>
    <div class="home-section-meta">
      <span>3 个方向</span>
      <span>22 篇文章</span>
    </div>
    <div class="home-child-grid">
      <a class="home-child" href="/frontend/knowledge/ajax-promise-axios/01-手撕Promise与异步编程">
        <div>
          <h3>知识八股</h3>
          <p>框架原理、浏览器机制、手写题和高频基础知识。</p>
        </div>
        <span>15 篇</span>
      </a>
      <a class="home-child" href="/frontend/interview/00-面经4.9">
        <div>
          <h3>面经</h3>
          <p>面试复盘、题目整理和表达素材。</p>
        </div>
        <span>1 篇</span>
      </a>
      <a class="home-child" href="/frontend/resources/projects/vue3rabbit/01-基础与项目搭建">
        <div>
          <h3>优质好文项目<span class="home-tag">可贡献</span></h3>
          <p>值得精读的文章、开源项目和实战案例。</p>
        </div>
        <span>6 篇</span>
      </a>
    </div>
  </section>

  <section class="home-section is-empty" id="backend">
    <div class="home-section-main">
      <div>
        <p class="home-kicker">backend</p>
        <h2>服务端</h2>
        <p>整理 API、数据库、服务治理和后端工程实践。</p>
      </div>
      <span class="home-section-link is-disabled">等待内容</span>
    </div>
    <div class="home-section-meta">
      <span>3 个方向</span>
      <span>0 篇文章</span>
    </div>
    <div class="home-child-grid">
      <div class="home-child is-empty">
        <div>
          <h3>知识八股</h3>
          <p>网络、数据库、缓存、并发和系统设计基础。</p>
        </div>
        <span>待补充</span>
      </div>
      <div class="home-child is-empty">
        <div>
          <h3>面经</h3>
          <p>服务端方向的面试复盘与问题清单。</p>
        </div>
        <span>待补充</span>
      </div>
      <div class="home-child is-empty">
        <div>
          <h3>优质好文项目</h3>
          <p>后端工程与架构方向的优质内容收藏。</p>
        </div>
        <span>待补充</span>
      </div>
    </div>
  </section>

  <section class="home-section" id="algorithm">
    <div class="home-section-main">
      <div>
        <p class="home-kicker">algorithm</p>
        <h2>算法</h2>
        <p>沉淀算法基础、C++ 常用知识和 LeetCode 刷题体系。</p>
      </div>
      <a class="home-section-link" href="/algorithm/basics/algorithm">进入栏目</a>
    </div>
    <div class="home-section-meta">
      <span>2 个方向</span>
      <span>32 篇文章</span>
    </div>
    <div class="home-child-grid">
      <a class="home-child" href="/algorithm/basics/algorithm">
        <div>
          <h3>基础与 C++</h3>
          <p>算法基础、STL、C++ 语法细节和常用模板。</p>
        </div>
        <span>3 篇</span>
      </a>
      <a class="home-child" href="/algorithm/leetcode/灵神算法/01-相向双指针（一）">
        <div>
          <h3>LeetCode 专题</h3>
          <p>按题型和方法整理的刷题路线、题解和复盘。</p>
        </div>
        <span>29 篇</span>
      </a>
    </div>
  </section>

  <section class="home-section" id="agent">
    <div class="home-section-main">
      <div>
        <p class="home-kicker">agent</p>
        <h2>Agent 应用开发</h2>
        <p>记录 Agent 产品、工具调用、工作流和应用开发经验。</p>
      </div>
      <a class="home-section-link" href="/agent/knowledge/agent/Agent应用开发">进入栏目</a>
    </div>
    <div class="home-section-meta">
      <span>3 个方向</span>
      <span>2 篇文章</span>
    </div>
    <div class="home-child-grid">
      <a class="home-child" href="/agent/knowledge/agent/Agent应用开发">
        <div>
          <h3>知识八股</h3>
          <p>按 Agent 应用开发和 LLM 原理拆分的高频基础知识。</p>
        </div>
        <span>2 篇</span>
      </a>
      <div class="home-child is-empty">
        <div>
          <h3>面经</h3>
          <p>Agent 与 AI 应用方向的面试材料。</p>
        </div>
        <span>待补充</span>
      </div>
      <div class="home-child is-empty">
        <div>
          <h3>优质好文项目</h3>
          <p>Agent 应用、框架、案例和工程实践推荐。</p>
        </div>
        <span>待补充</span>
      </div>
    </div>
  </section>

  <section class="home-section" id="dev">
    <div class="home-section-main">
      <div>
        <p class="home-kicker">dev</p>
        <h2>个人开发常用</h2>
        <p>放置日常开发中反复会用到的规范、命令和工具笔记。</p>
      </div>
      <a class="home-section-link" href="/dev/linux/linux">进入栏目</a>
    </div>
    <div class="home-section-meta">
      <span>5 个方向</span>
      <span>6 篇文章</span>
    </div>
    <div class="home-child-grid">
      <div class="home-child is-empty">
        <div>
          <h3>开发规范</h3>
          <p>提交、命名、文档和协作约定。</p>
        </div>
        <span>待补充</span>
      </div>
      <a class="home-child" href="/dev/linux/linux">
        <div>
          <h3>Linux 常用命令</h3>
          <p>Shell、文件、进程、网络和排障命令。</p>
        </div>
        <span>1 篇</span>
      </a>
      <a class="home-child" href="/dev/git/git">
        <div>
          <h3>Git 基础</h3>
          <p>分支、提交、回滚、冲突和协作流程。</p>
        </div>
        <span>1 篇</span>
      </a>
      <a class="home-child" href="/dev/tools/docker">
        <div>
          <h3>工具配置</h3>
          <p>Docker、编辑器、Markdown 和常用工具。</p>
        </div>
        <span>2 篇</span>
      </a>
      <a class="home-child" href="/dev/notes/tips">
        <div>
          <h3>杂记与读书</h3>
          <p>零散技巧、读书笔记和暂未归档的个人资料。</p>
        </div>
        <span>2 篇</span>
      </a>
    </div>
  </section>
  </main>
</div>
