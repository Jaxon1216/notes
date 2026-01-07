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

<style>
/* 只在主页应用这些样式 */
body.homepage .VPDoc .container,
body.homepage .VPDoc .content,
body.homepage .VPDoc .content-container {
  max-width: none !important;
  padding: 0 !important;
}

body.homepage .VPDoc .aside {
  display: none !important;
}

body.homepage .VPDoc,
body.homepage .vp-doc {
  padding: 0 !important;
}

/* 隐藏主页的更新时间 */
body.homepage .VPDocFooter,
body.homepage .VPLastUpdated {
  display: none !important;
}

.directory-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 20px 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
}

.category-section {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 14px;
  transition: all 0.2s ease;
  border: 1px solid var(--vp-c-divider);
}

.category-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 10px;
}

.category-meta {
  font-size: 13px;
  font-weight: 400;
  color: var(--vp-c-text-3);
  margin-left: auto;
}

.tree-container {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
}

.tree-item {
  display: flex;
  align-items: center;
  padding: 1px 0;
  color: var(--vp-c-text-2);
}

.tree-file {
  text-decoration: none !important;
  border-radius: 4px;
  padding: 2px 6px;
  margin: -2px -6px;
  transition: background-color 0.2s;
}

.tree-file:hover {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-brand);
}

.tree-prefix {
  color: var(--vp-c-text-3);
  white-space: pre;
}

.tree-name {
  flex: 1;
}

.tree-dir .tree-name {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.tree-date {
  color: var(--vp-c-text-3);
  font-size: 12px;
  margin-left: 16px;
}

.depth-0 { padding-left: 0; }
.depth-1 { padding-left: 20px; }
.depth-2 { padding-left: 40px; }
.depth-3 { padding-left: 60px; }
.depth-4 { padding-left: 80px; }

/* 响应式设计 */
@media (max-width: 1024px) {
  .directory-container {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .directory-container {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 12px;
  }
  
  .category-section {
    padding: 12px;
  }
}
</style>

<div class="directory-container">
  <div class="category-section">
    <div class="category-header">
      <span>📂 前端</span>
      <span class="category-meta">13 篇</span>
    </div>
    <div class="tree-container">
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">CSS/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Frontend/CSS/display">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">display</span>
        <span class="tree-date">12/25</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/CSS/Flex">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">Flex</span>
        <span class="tree-date">12/31</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/CSS/Pseudo-elements">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">Pseudo-elements</span>
        <span class="tree-date">12/25</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/CSS/selectors">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">selectors</span>
        <span class="tree-date">12/25</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/CSS/url">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">url</span>
        <span class="tree-date">12/25</span>
      </a>
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">JavaScript/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Frontend/JavaScript/ECMAScript">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">ECMAScript</span>
        <span class="tree-date">12/25</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/JavaScript/JSadvance">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">JSadvance</span>
        <span class="tree-date">12/29</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/JavaScript/PerformanceAPI">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">PerformanceAPI</span>
        <span class="tree-date">12/29</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/JavaScript/webAPIs">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">webAPIs</span>
        <span class="tree-date">12/26</span>
      </a>
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">Lanqiao/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Frontend/Lanqiao/lanqiao-easy">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">lanqiao-easy</span>
        <span class="tree-date">12/31</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/Lanqiao/lanqiao-mock">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">lanqiao-mock</span>
        <span class="tree-date">12/31</span>
      </a>
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">Vue/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Frontend/Vue/day2">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">day2</span>
        <span class="tree-date">01/07</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/Vue/shanggg">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">shanggg</span>
        <span class="tree-date">01/07</span>
      </a>
    </div>
  </div>
  <div class="category-section">
    <div class="category-header">
      <span>📂 Projects</span>
      <span class="category-meta">5 篇</span>
    </div>
    <div class="tree-container">
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">todomvc/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Projects/todomvc/day1">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">day1</span>
        <span class="tree-date">12/30</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Projects/todomvc/day2">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">day2</span>
        <span class="tree-date">12/31</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Projects/todomvc/day3">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">day3</span>
        <span class="tree-date">01/01</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Projects/todomvc/day4">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">day4</span>
        <span class="tree-date">01/03</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Projects/todomvc/quiz">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">quiz</span>
        <span class="tree-date">01/06</span>
      </a>
    </div>
  </div>
  <div class="category-section">
    <div class="category-header">
      <span>📂 Febagu</span>
      <span class="category-meta">3 篇</span>
    </div>
    <div class="tree-container">
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">CSS/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Febagu/CSS/BasicBoxModel">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">BasicBoxModel</span>
        <span class="tree-date">12/31</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Febagu/CSS/ResponsiveWebDesign">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">ResponsiveWebDesign</span>
        <span class="tree-date">12/31</span>
      </a>
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">HTML/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Febagu/HTML/HTML">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">HTML</span>
        <span class="tree-date">12/28</span>
      </a>
    </div>
  </div>
  <div class="category-section">
    <div class="category-header">
      <span>📂 其他</span>
      <span class="category-meta">8 篇</span>
    </div>
    <div class="tree-container">
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">books/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Misc/books/PurpleBook">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">PurpleBook</span>
        <span class="tree-date">12/25</span>
      </a>
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">interview/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Misc/interview/MockInterviews">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">MockInterviews</span>
        <span class="tree-date">12/25</span>
      </a>
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">tools/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Misc/tools/docker">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">docker</span>
        <span class="tree-date">12/29</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Misc/tools/git">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">git</span>
        <span class="tree-date">12/29</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Misc/tools/lexicon">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">lexicon</span>
        <span class="tree-date">12/31</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Misc/tools/Linux">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">Linux</span>
        <span class="tree-date">12/29</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Misc/tools/markdwon">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">markdwon</span>
        <span class="tree-date">12/30</span>
      </a>
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">tricks/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Misc/tricks/tips">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">tips</span>
        <span class="tree-date">12/25</span>
      </a>
    </div>
  </div>
  <div class="category-section">
    <div class="category-header">
      <span>📂 文章</span>
      <span class="category-meta">3 篇</span>
    </div>
    <div class="tree-container">
      <a class="tree-item tree-file depth-0" href="/articles/algorithm">
        <span class="tree-prefix"></span>
        <span class="tree-name">algorithm</span>
        <span class="tree-date">11/06</span>
      </a>
      <a class="tree-item tree-file depth-0" href="/articles/basicK">
        <span class="tree-prefix"></span>
        <span class="tree-name">basicK</span>
        <span class="tree-date">11/06</span>
      </a>
      <a class="tree-item tree-file depth-0" href="/articles/STL">
        <span class="tree-prefix"></span>
        <span class="tree-name">STL</span>
        <span class="tree-date">12/26</span>
      </a>
    </div>
  </div>
  <div class="category-section">
    <div class="category-header">
      <span>📂 Leetcode</span>
      <span class="category-meta">11 篇</span>
    </div>
    <div class="tree-container">
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">二分查找/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Leetcode/BinarySearch/BinarySearch">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">BinarySearch</span>
        <span class="tree-date">12/08</span>
      </a>
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">数据结构/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Leetcode/DataStructure/Difference">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">Difference</span>
        <span class="tree-date">12/03</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/DataStructure/Enumeration">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">Enumeration</span>
        <span class="tree-date">12/26</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/DataStructure/Heap">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">Heap</span>
        <span class="tree-date">12/03</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/DataStructure/Prefixsum">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">Prefixsum</span>
        <span class="tree-date">12/25</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/DataStructure/Queue">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">Queue</span>
        <span class="tree-date">12/03</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/DataStructure/Stack">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">Stack</span>
        <span class="tree-date">12/03</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/DataStructure/Trie">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">Trie</span>
        <span class="tree-date">12/03</span>
      </a>
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">入门题单/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Leetcode/Intro/note">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">笔记</span>
        <span class="tree-date">12/03</span>
      </a>
      <div class="tree-item tree-dir depth-0">
        <span class="tree-prefix"></span>
        <span class="tree-name">滑动窗口/</span>
      </div>
      <a class="tree-item tree-file depth-1" href="/Leetcode/SlidingWindow/不定长">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">不定长</span>
        <span class="tree-date">12/03</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/SlidingWindow/定长">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">定长</span>
        <span class="tree-date">12/03</span>
      </a>
    </div>
  </div>
</div>
