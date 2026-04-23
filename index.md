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

body.homepage .VPDocFooter,
body.homepage .VPLastUpdated {
  display: none !important;
}

/* ---------- Hero ---------- */
.dashboard-hero {
  position: relative;
  padding: 52px 24px 40px;
  text-align: center;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 50% 0%, var(--vp-c-brand-soft) 0%, transparent 70%),
    radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.06) 0%, transparent 50%),
    radial-gradient(circle at 80% 60%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 16px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 20px;
  letter-spacing: 0.01em;
  border: 1px solid rgba(13, 148, 136, 0.15);
}

.hero-title {
  font-size: 2.75rem;
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.1;
  margin: 0 0 10px;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, #2dd4bf 40%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin: 0 0 28px;
  font-weight: 400;
}

.hero-stats {
  display: inline-flex;
  gap: 24px;
  margin-bottom: 24px;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  line-height: 1.2;
}

.hero-stat-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-weight: 400;
  letter-spacing: 0.02em;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
  background: var(--vp-c-brand-1);
  color: #fff !important;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px var(--vp-c-brand-soft);
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--vp-c-brand-soft);
  filter: brightness(1.1);
}

.hero-cta-arrow {
  transition: transform 0.2s;
}

.hero-cta:hover .hero-cta-arrow {
  transform: translateX(3px);
}

/* ---------- Cards Grid ---------- */
.directory-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 48px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.category-section {
  background: var(--vp-c-bg-elv);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--vp-c-divider);
  animation: cardSlideIn 0.45s ease backwards;
}

.category-section:hover {
  transform: translateY(-4px);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.06),
    0 4px 10px rgba(0, 0, 0, 0.04);
  border-color: color-mix(in srgb, var(--card-accent, var(--vp-c-brand-1)) 40%, transparent);
}

.dark .category-section:hover {
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.25),
    0 4px 10px rgba(0, 0, 0, 0.15);
}

.category-accent-bar {
  height: 3px;
  background: var(--card-accent, var(--vp-c-brand-1));
  opacity: 0.85;
}

.category-body {
  padding: 16px 18px 18px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 12px;
}

.category-icon {
  font-size: 18px;
  line-height: 1;
}

.category-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}

.category-meta {
  font-size: 12px;
  font-weight: 500;
  color: var(--card-accent, var(--vp-c-brand-1));
  margin-left: auto;
  padding: 2px 10px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--card-accent, var(--vp-c-brand-1)) 10%, transparent);
}

/* ---------- File Tree ---------- */
.tree-container {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.65;
}

.tree-item {
  display: flex;
  align-items: center;
  padding: 1.5px 0;
  color: var(--vp-c-text-2);
}

.tree-file {
  text-decoration: none !important;
  border-radius: 6px;
  padding: 2px 8px;
  margin: -2px -8px;
  transition: all 0.2s ease;
}

.tree-file:hover {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.tree-file:hover .tree-name {
  color: var(--vp-c-brand-1);
}

.tree-prefix {
  color: var(--vp-c-text-3);
  white-space: pre;
  opacity: 0.5;
}

.tree-name {
  flex: 1;
  transition: color 0.2s;
}

.tree-dir .tree-name {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.tree-date {
  color: var(--vp-c-text-3);
  font-size: 11px;
  margin-left: 16px;
  opacity: 0.7;
}

.depth-0 { padding-left: 0; }
.depth-1 { padding-left: 20px; }
.depth-2 { padding-left: 40px; }
.depth-3 { padding-left: 60px; }
.depth-4 { padding-left: 80px; }

/* ---------- Collapsible Folders ---------- */
.tree-folder {
  border: none;
  margin: 0;
  padding: 0;
}

.tree-folder > summary {
  list-style: none;
  cursor: pointer;
  user-select: none;
}

.tree-folder > summary::-webkit-details-marker {
  display: none;
}

.tree-folder > summary::marker {
  content: '';
}

.tree-toggle {
  display: inline-block;
  width: 14px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  font-size: 10px;
  color: var(--vp-c-text-3);
  transition: transform 0.2s ease;
  margin-right: 4px;
  flex-shrink: 0;
}

.tree-toggle::before {
  content: '▶';
}

.tree-folder[open] > summary .tree-toggle {
  transform: rotate(90deg);
}

.tree-folder > summary:hover .tree-toggle {
  color: var(--vp-c-brand-1);
}

.tree-children {
  overflow: hidden;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---------- Responsive ---------- */
@media (max-width: 1024px) {
  .directory-container {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-hero {
    padding: 36px 16px 28px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .directory-container {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0 16px 36px;
  }

  .category-body {
    padding: 14px 16px 16px;
  }

  .hero-stats {
    gap: 16px;
  }
}
</style>

<div class="dashboard-hero">
  <div class="hero-glow"></div>
  <div class="hero-content">
    <div class="hero-badge">📖 Personal Knowledge Base</div>
    <h1 class="hero-title">Study Notes</h1>
    <p class="hero-desc">A growing collection of notes, solutions, and insights</p>
    <div class="hero-stats">
      <div class="hero-stat">
        <span class="hero-stat-value">69</span>
        <span class="hero-stat-label">Articles</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat-value">3</span>
        <span class="hero-stat-label">Categories</span>
      </div>
    </div>
    <a class="hero-cta" href="/Leetcode/灵神算法/09-二叉树与递归 - 深入理解">
      Continue Reading
      <span class="hero-cta-arrow">→</span>
    </a>
  </div>
</div>

<div class="directory-container">
  <div class="category-section" style="--card-accent: #ef4444; animation-delay: 0.00s">
    <div class="category-accent-bar"></div>
    <div class="category-body">
      <div class="category-header">
        <span class="category-icon">🧩</span>
        <span class="category-name">Leetcode</span>
        <span class="category-meta">29 篇</span>
      </div>
      <div class="tree-container">
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-0">
          <span class="tree-prefix"></span>
          <span class="tree-toggle"></span>
          <span class="tree-name">灵神算法/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/01-相向双指针（一）">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">01-相向双指针（一）</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/02-相向双指针（二）">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">02-相向双指针（二）</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/03-滑动窗口">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">03-滑动窗口</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/04-二分查找">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">04-二分查找</span>
        <span class="tree-date">03/24</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/05-二分查找 - 变形">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">05-二分查找 - 变形</span>
        <span class="tree-date">03/25</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/06-链表 - 反转系列">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">06-链表 - 反转系列</span>
        <span class="tree-date">03/30</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/07-链表 - 快慢指针">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">07-链表 - 快慢指针</span>
        <span class="tree-date">04/19</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/08-链表 - 删除系列">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">08-链表 - 删除系列</span>
        <span class="tree-date">03/30</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/09-二叉树与递归 - 深入理解">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">09-二叉树与递归 - 深入理解</span>
        <span class="tree-date">04/23</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/10-二叉树与递归 - 灵活运用">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">10-二叉树与递归 - 灵活运用</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/11-二叉树与递归 - 前序中序后序">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">11-二叉树与递归 - 前序中序后序</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/12-二叉树与递归 - 最近公共祖先">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">12-二叉树与递归 - 最近公共祖先</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/13-二叉树 - BFS">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">13-二叉树 - BFS</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/14-回溯 - 子集型">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">14-回溯 - 子集型</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/15-回溯 - 组合型与剪枝">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">15-回溯 - 组合型与剪枝</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/16-回溯 - 排列型">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">16-回溯 - 排列型</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/17-动态规划 - 从记忆化搜索到递推">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">17-动态规划 - 从记忆化搜索到递推</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/18-0-1背包 完全背包">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">18-0-1背包 完全背包</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/19-最长公共子序列 LCS">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">19-最长公共子序列 LCS</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/20-最长递增子序列 LIS">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">20-最长递增子序列 LIS</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/21-状态机 DP - 买卖股票系列">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">21-状态机 DP - 买卖股票系列</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/22-区间 DP">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">22-区间 DP</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/23-树形 DP - 直径系列">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">23-树形 DP - 直径系列</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/24-树形 DP - 最大独立集">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">24-树形 DP - 最大独立集</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/25-树形 DP - 最小支配集">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">25-树形 DP - 最小支配集</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/26-单调栈">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">26-单调栈</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/27-单调队列">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">27-单调队列</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/Basic1">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">Basic1</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Leetcode/灵神算法/灵神算法-01-08-整合草稿">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">灵神算法-01-08-整合草稿</span>
        <span class="tree-date">04/19</span>
      </a>
        </div>
      </details>
      </div>
    </div>
  </div>
  <div class="category-section" style="--card-accent: #3b82f6; animation-delay: 0.06s">
    <div class="category-accent-bar"></div>
    <div class="category-body">
      <div class="category-header">
        <span class="category-icon">🎨</span>
        <span class="category-name">前端</span>
        <span class="category-meta">27 篇</span>
      </div>
      <div class="tree-container">
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-0">
          <span class="tree-prefix"></span>
          <span class="tree-toggle"></span>
          <span class="tree-name">Handwrite/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-1" href="/Frontend/Handwrite/00.content">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">00.content</span>
        <span class="tree-date">04/23</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/Handwrite/01.top-high-frequency">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">01.top-high-frequency</span>
        <span class="tree-date">04/23</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/Handwrite/02.super-high-frequency">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">02.super-high-frequency</span>
        <span class="tree-date">04/23</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/Handwrite/03.high-frequency">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">03.high-frequency</span>
        <span class="tree-date">04/23</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/Handwrite/04.medium-frequency">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">04.medium-frequency</span>
        <span class="tree-date">04/23</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/Handwrite/05.low-frequency">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">05.low-frequency</span>
        <span class="tree-date">04/23</span>
      </a>
        </div>
      </details>
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-0">
          <span class="tree-prefix"></span>
          <span class="tree-toggle"></span>
          <span class="tree-name">Knowledge/</span>
        </summary>
        <div class="tree-children">
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-1">
          <span class="tree-prefix">├── </span>
          <span class="tree-toggle"></span>
          <span class="tree-name">ajax-promise-axios/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-2" href="/Frontend/Knowledge/ajax-promise-axios/01-手撕Promise与异步编程">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">01-手撕Promise与异步编程</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Knowledge/ajax-promise-axios/02-事件循环机制">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">02-事件循环机制</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Knowledge/ajax-promise-axios/03-AJAX前端网络通信">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">03-AJAX前端网络通信</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Knowledge/ajax-promise-axios/axios">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">axios</span>
        <span class="tree-date">03/21</span>
      </a>
        </div>
      </details>
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-1">
          <span class="tree-prefix">├── </span>
          <span class="tree-toggle"></span>
          <span class="tree-name">React/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-2" href="/Frontend/Knowledge/React/00-React学习路线">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">00-React学习路线</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Knowledge/React/01-核心概念与基础语法">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">01-核心概念与基础语法</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Knowledge/React/02-组件化与性能优化">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">02-组件化与性能优化</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Knowledge/React/03-路由与状态管理">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">03-路由与状态管理</span>
        <span class="tree-date">03/21</span>
      </a>
        </div>
      </details>
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-1">
          <span class="tree-prefix">└── </span>
          <span class="tree-toggle"></span>
          <span class="tree-name">Vue/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-2" href="/Frontend/Knowledge/Vue/01-工程创建与响应式基础">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">01-工程创建与响应式基础</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Knowledge/Vue/02-监听器与组件进阶">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">02-监听器与组件进阶</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Knowledge/Vue/03-Pinia状态管理">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">03-Pinia状态管理</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Knowledge/Vue/04-组件通信与Pinia高级">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">04-组件通信与Pinia高级</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Knowledge/Vue/05-指令体系与响应式进阶">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">05-指令体系与响应式进阶</span>
        <span class="tree-date">03/21</span>
      </a>
        </div>
      </details>
        </div>
      </details>
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-0">
          <span class="tree-prefix"></span>
          <span class="tree-toggle"></span>
          <span class="tree-name">Lanqiao/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-1" href="/Frontend/Lanqiao/01-蓝桥模拟题">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">01-蓝桥模拟题</span>
        <span class="tree-date">03/03</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Frontend/Lanqiao/02-蓝桥基础题">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">02-蓝桥基础题</span>
        <span class="tree-date">03/03</span>
      </a>
        </div>
      </details>
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-0">
          <span class="tree-prefix"></span>
          <span class="tree-toggle"></span>
          <span class="tree-name">Project/</span>
        </summary>
        <div class="tree-children">
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-1">
          <span class="tree-prefix">└── </span>
          <span class="tree-toggle"></span>
          <span class="tree-name">vue3rabbit/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-2" href="/Frontend/Project/vue3rabbit/01-基础与项目搭建">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">01-基础与项目搭建</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Project/vue3rabbit/02-Layout与Home页">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">02-Layout与Home页</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Project/vue3rabbit/03-分类页">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">03-分类页</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Project/vue3rabbit/04-商品详情">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">04-商品详情</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Project/vue3rabbit/05-登录与用户系统">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">05-登录与用户系统</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Frontend/Project/vue3rabbit/06-SKU组件">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">06-SKU组件</span>
        <span class="tree-date">03/21</span>
      </a>
        </div>
      </details>
        </div>
      </details>
      </div>
    </div>
  </div>
  <div class="category-section" style="--card-accent: #64748b; animation-delay: 0.12s">
    <div class="category-accent-bar"></div>
    <div class="category-body">
      <div class="category-header">
        <span class="category-icon">📦</span>
        <span class="category-name">其他</span>
        <span class="category-meta">13 篇</span>
      </div>
      <div class="tree-container">
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-0">
          <span class="tree-prefix"></span>
          <span class="tree-toggle"></span>
          <span class="tree-name">文章/</span>
        </summary>
        <div class="tree-children">
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-1">
          <span class="tree-prefix">├── </span>
          <span class="tree-toggle"></span>
          <span class="tree-name">algorithm/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-2" href="/Misc/articles/algorithm/algorithm">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">algorithm</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Misc/articles/algorithm/cpp-constructors-overload">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">cpp-constructors-overload</span>
        <span class="tree-date">03/21</span>
      </a>
      <a class="tree-item tree-file depth-2" href="/Misc/articles/algorithm/STL">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">STL</span>
        <span class="tree-date">03/21</span>
      </a>
        </div>
      </details>
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-1">
          <span class="tree-prefix">├── </span>
          <span class="tree-toggle"></span>
          <span class="tree-name">bugs/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-2" href="/Misc/articles/bugs/vitepress-vue-compiler-bug-analysis">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">vitepress-vue-compiler-bug-analysis</span>
        <span class="tree-date">03/21</span>
      </a>
        </div>
      </details>
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-1">
          <span class="tree-prefix">└── </span>
          <span class="tree-toggle"></span>
          <span class="tree-name">ptojects/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-2" href="/Misc/articles/ptojects/todomvc-js">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">todomvc-js</span>
        <span class="tree-date">03/21</span>
      </a>
        </div>
      </details>
        </div>
      </details>
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-0">
          <span class="tree-prefix"></span>
          <span class="tree-toggle"></span>
          <span class="tree-name">books/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-1" href="/Misc/books/PurpleBook">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">PurpleBook</span>
        <span class="tree-date">12/25</span>
      </a>
        </div>
      </details>
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-0">
          <span class="tree-prefix"></span>
          <span class="tree-toggle"></span>
          <span class="tree-name">interview/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-1" href="/Misc/interview/MockInterviews">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">MockInterviews</span>
        <span class="tree-date">12/25</span>
      </a>
        </div>
      </details>
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-0">
          <span class="tree-prefix"></span>
          <span class="tree-toggle"></span>
          <span class="tree-name">tools/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-1" href="/Misc/tools/docker">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">docker</span>
        <span class="tree-date">12/29</span>
      </a>
      <a class="tree-item tree-file depth-1" href="/Misc/tools/git">
        <span class="tree-prefix">├── </span>
        <span class="tree-name">git</span>
        <span class="tree-date">01/09</span>
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
        </div>
      </details>
      <details class="tree-folder">
        <summary class="tree-item tree-dir depth-0">
          <span class="tree-prefix"></span>
          <span class="tree-toggle"></span>
          <span class="tree-name">tricks/</span>
        </summary>
        <div class="tree-children">
      <a class="tree-item tree-file depth-1" href="/Misc/tricks/tips">
        <span class="tree-prefix">└── </span>
        <span class="tree-name">tips</span>
        <span class="tree-date">12/25</span>
      </a>
        </div>
      </details>
      </div>
    </div>
  </div>
</div>
