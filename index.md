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
body.homepage .VPDoc .aside { display: none !important; }
body.homepage .VPDoc, body.homepage .vp-doc { padding: 0 !important; }
body.homepage .VPDocFooter, body.homepage .VPLastUpdated { display: none !important; }

.home-shell {
  max-width: 1320px;
  margin: 0 auto;
  padding: 32px 24px 56px;
}

/* ============ Terminal Hero ============ */
.term {
  position: relative;
  background: #0d1117;
  color: #e6edf3;
  border-radius: 14px;
  border: 1px solid #21262d;
  overflow: hidden;
  font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  box-shadow:
    0 1px 0 rgba(255,255,255,0.05) inset,
    0 30px 60px -20px rgba(0,0,0,0.45),
    0 18px 36px -18px rgba(99, 102, 241, 0.18);
  margin-bottom: 24px;
}

.dark .term {
  box-shadow:
    0 1px 0 rgba(255,255,255,0.05) inset,
    0 30px 60px -20px rgba(0,0,0,0.7),
    0 18px 36px -18px rgba(99, 102, 241, 0.22);
}

.term::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 0%, rgba(45, 212, 191, 0.15), transparent 40%),
    radial-gradient(circle at 80% 100%, rgba(167, 139, 250, 0.18), transparent 45%),
    linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
  pointer-events: none;
}

.term-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(180deg, #161b22, #0d1117);
  border-bottom: 1px solid #21262d;
  position: relative;
}

.term-dot {
  width: 12px; height: 12px; border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.25);
}
.term-dot.r { background: #ff5f56; }
.term-dot.y { background: #ffbd2e; }
.term-dot.g { background: #27c93f; }

.term-title {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #7d8590;
  letter-spacing: 0.04em;
}

.term-title b { color: #e6edf3; font-weight: 600; }

.term-body {
  padding: 24px 28px 28px;
  font-size: 14px;
  line-height: 1.85;
  position: relative;
  min-height: 280px;
}

.term-line {
  display: flex;
  flex-wrap: wrap;
  gap: 0 10px;
  white-space: pre-wrap;
  opacity: 0;
  animation: termAppear 0.01s linear forwards;
}

@keyframes termAppear {
  to { opacity: 1; }
}

/* 真·打字机：内容容器 max-width 由 0 → 80ch，配合 steps() 离散展开 */
.t-typed {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  max-width: 0;
  vertical-align: bottom;
  animation: typed 0.45s steps(28, end) forwards;
}

@keyframes typed {
  to { max-width: 80ch; }
}

/* 每一行的 stagger：先出现 prompt（行整体 appear），稍后开始打字 */
.term-line.l1                  { animation-delay: 0.00s; }
.term-line.l1 .t-typed         { animation-delay: 0.05s; }
.term-line.l2                  { animation-delay: 0.55s; }
.term-line.l2 .t-typed         { animation-delay: 0.60s; }
.term-line.l3                  { animation-delay: 1.10s; }
.term-line.l3 .t-typed         { animation-delay: 1.15s; }
.term-line.l4                  { animation-delay: 1.65s; }
.term-line.l4 .t-typed         { animation-delay: 1.70s; }
.term-line.l5                  { animation-delay: 2.20s; }
.term-line.l5 .t-typed         { animation-delay: 2.25s; }
.term-line.l6                  { animation-delay: 2.75s; }
.term-line.l6 .t-typed         { animation-delay: 2.80s; }
.term-line.l7                  { animation-delay: 3.30s; }
.term-line.l7 .t-typed         { animation-delay: 3.35s; }
.term-line.l8                  { animation-delay: 3.85s; }
.term-line.l8 .t-typed         { animation-delay: 3.90s; }

.t-prompt { color: #2dd4bf; user-select: none; }
.t-prompt::before { content: '~'; color: #7d8590; margin-right: 8px; }
.t-prompt::after  { content: '$'; color: #7d8590; margin-left: 4px; }
.t-cmd { color: #e6edf3; }
.t-out { color: #adbac7; padding-left: 22px; display: inline-block; }
.t-key { color: #79c0ff; }
.t-str { color: #a5d6ff; }
.t-num { color: #ffa657; }
.t-cat {
  color: var(--acc, #2dd4bf);
  text-shadow: 0 0 18px color-mix(in srgb, var(--acc, #2dd4bf) 50%, transparent);
  cursor: pointer;
  transition: filter 0.2s;
  display: inline-block;
}
.t-cat:hover { filter: brightness(1.4); }

/* 行光标：跟随每一行的打字过程，在该行末尾闪烁 */
.row-cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background: #2dd4bf;
  vertical-align: -2px;
  margin-left: 2px;
  opacity: 0;
}

/* 非永久行：只在自己打字窗口（0.55s）内闪烁，过后立即隐藏 */
.term-line:not(.l8) .row-cursor {
  animation: rowCursorActive 0.55s steps(1) forwards;
}

@keyframes rowCursorActive {
  0%, 24%   { opacity: 1; }
  25%, 49%  { opacity: 0; }
  50%, 74%  { opacity: 1; }
  75%, 99%  { opacity: 0; }
  100%      { opacity: 0; }
}

/* l8 行：永久闪烁 */
.term-line.l8 .row-cursor {
  animation: blink 1s steps(1) infinite;
}

/* 每行 cursor 的启动时刻 = 该行 typed 的启动时刻 */
.term-line.l1 .row-cursor { animation-delay: 0.05s; }
.term-line.l2 .row-cursor { animation-delay: 0.60s; }
.term-line.l3 .row-cursor { animation-delay: 1.15s; }
.term-line.l4 .row-cursor { animation-delay: 1.70s; }
.term-line.l5 .row-cursor { animation-delay: 2.25s; }
.term-line.l6 .row-cursor { animation-delay: 2.80s; }
.term-line.l7 .row-cursor { animation-delay: 3.35s; }
.term-line.l8 .row-cursor { animation-delay: 3.90s; }

.t-cursor {
  display: inline-block;
  width: 8px; height: 16px;
  background: #2dd4bf;
  vertical-align: -2px;
  margin-left: 4px;
  animation: blink 1s steps(1) infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}

/* ============ Bento Grid ============ */
.bento {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 130px;
  gap: 14px;
}

.b-card {
  position: relative;
  border-radius: 14px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  padding: 18px 20px;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.25s, box-shadow 0.25s;
  text-decoration: none !important;
  color: inherit !important;
  display: flex;
  flex-direction: column;
  isolation: isolate;
}

.b-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, color-mix(in srgb, var(--acc, var(--vp-c-brand-1)) 14%, transparent), transparent 60%);
  opacity: 0.55;
  z-index: -1;
  transition: opacity 0.3s;
}

.b-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--acc, var(--vp-c-brand-1)) 55%, transparent);
  box-shadow: 0 14px 32px -16px color-mix(in srgb, var(--acc, var(--vp-c-brand-1)) 55%, transparent);
}

.b-card:hover::before { opacity: 1; }

.b-emoji {
  position: absolute;
  right: -10px; bottom: -22px;
  font-size: 130px;
  line-height: 1;
  opacity: 0.10;
  filter: saturate(1.3);
  pointer-events: none;
  z-index: -1;
  transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s;
}

.b-card:hover .b-emoji {
  transform: rotate(-8deg) scale(1.08);
  opacity: 0.18;
}

/* sizes */
.b-feature   { grid-column: span 8; grid-row: span 2; }
.b-stats     { grid-column: span 4; grid-row: span 2; }
.b-recent    { grid-column: span 4; grid-row: span 3; }
.b-cat       { grid-column: span 4; grid-row: span 1; }
.b-cat-tall  { grid-column: span 4; grid-row: span 2; }
.b-quote     { grid-column: span 8; grid-row: span 1; }

.b-label {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  font-weight: 600;
  margin-bottom: 8px;
}

.b-title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--vp-c-text-1);
  margin: 0 0 6px;
  padding: 0;
}

/* VitePress 给 vp-doc 内的 h2/h3 加了较大的 margin/padding/border-bottom，需要清掉 */
.vp-doc .b-title {
  margin: 0 0 6px !important;
  padding: 0 !important;
  border-bottom: none !important;
}
.vp-doc .b-card h2,
.vp-doc .b-card h3 {
  margin-top: 0 !important;
  border-top: none !important;
}

.b-sub {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

.b-foot {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.b-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--acc, var(--vp-c-brand-1)) 14%, transparent);
  color: var(--acc, var(--vp-c-brand-1));
  font-size: 11px;
  font-weight: 700;
}

.b-arrow {
  font-size: 16px;
  color: var(--acc, var(--vp-c-brand-1));
  transition: transform 0.25s;
}
.b-card:hover .b-arrow { transform: translate(4px, -4px); }

/* feature card */
.b-feature .b-title { font-size: 28px; }
.b-feature .feature-meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

/* stats */
.b-stats { background: linear-gradient(135deg, #0d9488, #2dd4bf); color: #fff !important; border: none; }
.b-stats::before { display: none; }
.b-stats .b-label { color: rgba(255,255,255,0.75); }
.b-stats .stat-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 6px; }
.b-stats .stat-num { font-size: 36px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
.b-stats .stat-key { font-size: 12px; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.1em; }
.b-stats .stat-divider { height: 1px; background: rgba(255,255,255,0.18); margin: 14px 0; }
.b-stats:hover { transform: translateY(-4px); box-shadow: 0 14px 32px -10px rgba(13, 148, 136, 0.55); }

/* recent list */
.b-recent ul { list-style: none; padding: 0; margin: 8px 0 0; display: flex; flex-direction: column; gap: 6px; }
.b-recent li a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--vp-c-text-1) !important;
  text-decoration: none !important;
  font-size: 13px;
  transition: background 0.2s, transform 0.2s;
}
.b-recent li a:hover {
  background: var(--vp-c-bg);
  transform: translateX(2px);
}
.b-recent .r-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--acc, var(--vp-c-brand-1));
  flex-shrink: 0;
}
.b-recent .r-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.b-recent .r-date { font-size: 11px; color: var(--vp-c-text-3); flex-shrink: 0; }

/* quote */
.b-quote {
  background: var(--vp-c-bg);
  border: 1px dashed var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
}
.b-quote::before { display: none; }
.b-quote-text {
  font-size: 15px;
  font-style: italic;
  color: var(--vp-c-text-2);
  text-align: center;
  letter-spacing: 0.01em;
}
.b-quote-text b { color: var(--vp-c-brand-1); font-style: normal; font-weight: 700; }

@media (max-width: 1024px) {
  .b-feature, .b-recent, .b-quote { grid-column: span 12; }
  .b-stats                        { grid-column: span 12; grid-row: span 1; }
  .b-cat, .b-cat-tall             { grid-column: span 6; grid-row: span 1; }
  .b-recent                       { grid-row: span 2; }
}

@media (max-width: 640px) {
  .home-shell { padding: 20px 14px 40px; }
  .term-body { padding: 16px 18px; font-size: 13px; min-height: auto; }
  .bento { grid-auto-rows: 110px; gap: 10px; }
  .b-stats, .b-cat, .b-cat-tall { grid-column: span 12; grid-row: span 1; }
  .b-feature, .b-recent { grid-row: span 2; }
  .b-emoji { font-size: 90px; }
}
</style>

<div class="home-shell">

<div class="term">
  <div class="term-bar">
    <span class="term-dot r"></span>
    <span class="term-dot y"></span>
    <span class="term-dot g"></span>
    <span class="term-title"><b>EastonJiang</b>@notes — zsh — 80×24</span>
  </div>
  <div class="term-body">
    <div class="term-line l1"><span class="t-prompt"></span><span class="t-cmd"><span class="t-typed">whoami</span></span><span class="row-cursor"></span></div>
    <div class="term-line l2"><span class="t-out"><span class="t-typed">EastonJiang · <span class="t-key">Frontend</span> developer who writes things down.</span></span><span class="row-cursor"></span></div>
    <div class="term-line l3"><span class="t-prompt"></span><span class="t-cmd"><span class="t-typed">cat ~/notes/<span class="t-key">stats</span>.json</span></span><span class="row-cursor"></span></div>
    <div class="term-line l4"><span class="t-out"><span class="t-typed">{ "articles": <span class="t-num">71</span>, "categories": <span class="t-num">3</span>, "last_update": <span class="t-str">"today"</span> }</span></span><span class="row-cursor"></span></div>
    <div class="term-line l5"><span class="t-prompt"></span><span class="t-cmd"><span class="t-typed">ls categories/</span></span><span class="row-cursor"></span></div>
    <div class="term-line l6"><span class="t-out"><span class="t-typed"><span class="t-cat" style="--acc: #3b82f6">[前端]</span> <span class="t-cat" style="--acc: #64748b">[其他]</span> <span class="t-cat" style="--acc: #ef4444">[Leetcode]</span></span></span><span class="row-cursor"></span></div>
    <div class="term-line l7"><span class="t-prompt"></span><span class="t-cmd"><span class="t-typed">echo $MOTTO</span></span><span class="row-cursor"></span></div>
    <div class="term-line l8"><span class="t-out"><span class="t-typed">"<span class="t-str">持续输出，对抗时间</span>"</span><span class="row-cursor"></span></span></div>
  </div>
</div>

<div class="bento">
  <a class="b-card b-feature" href="/Frontend/Handwrite/前端手写25题" style="--acc: #3b82f6">
    <div class="b-emoji">🎨</div>
    <div class="feature-meta">
      <span class="b-pill">🎨 前端</span>
      <span class="b-label" style="margin: 0;">06/08 · today</span>
    </div>
    <div class="b-label">最新一篇 · LATEST</div>
    <h2 class="b-title">前端手写25题</h2>
    <p class="b-sub">点开继续阅读，从最近留下的脚印开始。</p>
    <div class="b-foot">
      <span>Continue Reading</span>
      <span class="b-arrow">↗</span>
    </div>
  </a>
  <div class="b-card b-stats">
    <div class="b-label">Knowledge Base</div>
    <div class="stat-row"><div class="stat-num">71</div><div class="stat-key">Articles</div></div>
    <div class="stat-divider"></div>
    <div class="stat-row"><div class="stat-num">3</div><div class="stat-key">Categories</div></div>
    <div class="stat-divider"></div>
    <div class="stat-row"><div class="stat-num">2</div><div class="stat-key">This Week</div></div>
  </div>
  <div class="b-card b-recent">
    <div class="b-label">📌 最近更新</div>
    <h3 class="b-title" style="font-size: 18px;">Recently Wrote</h3>
    <ul>
      <li><a href="/Frontend/Handwrite/前端手写25题" style="--acc: #3b82f6"><span class="r-dot"></span><span class="r-title">前端手写25题</span><span class="r-date">06/08</span></a></li>
      <li><a href="/Misc/interview/面经4.9" style="--acc: #64748b"><span class="r-dot"></span><span class="r-title">面经4.9</span><span class="r-date">06/08</span></a></li>
      <li><a href="/Frontend/Handwrite/01.top-high-frequency" style="--acc: #3b82f6"><span class="r-dot"></span><span class="r-title">01.top-high-frequency</span><span class="r-date">04/23</span></a></li>
      <li><a href="/Frontend/Handwrite/00.content" style="--acc: #3b82f6"><span class="r-dot"></span><span class="r-title">00.content</span><span class="r-date">04/23</span></a></li>
      <li><a href="/Frontend/Handwrite/02.super-high-frequency" style="--acc: #3b82f6"><span class="r-dot"></span><span class="r-title">02.super-high-frequency</span><span class="r-date">04/23</span></a></li>
    </ul>
  </div>
  <a class="b-card b-cat-tall" href="/Frontend/Handwrite/前端手写25题" style="--acc: #3b82f6">
    <div class="b-emoji">🎨</div>
    <div class="b-label">🎨 前端</div>
    <h3 class="b-title" style="font-size: 20px;">Web · 框架 · 工程化</h3>
    <p class="b-sub">最新：前端手写25题</p>
    <div class="b-foot">
      <span class="b-pill">28 篇</span>
      <span class="b-arrow">↗</span>
    </div>
  </a>
  <a class="b-card b-cat" href="/Misc/interview/面经4.9" style="--acc: #64748b">
    <div class="b-emoji">📦</div>
    <div class="b-label">📦 其他</div>
    <h3 class="b-title" style="font-size: 16px;">工具 · 经验 · 杂记</h3>
    <div class="b-foot">
      <span class="b-pill">14 篇</span>
      <span class="b-arrow">↗</span>
    </div>
  </a>
  <a class="b-card b-cat" href="/Leetcode/灵神算法/09-二叉树与递归 - 深入理解" style="--acc: #ef4444">
    <div class="b-emoji">🧩</div>
    <div class="b-label">🧩 Leetcode</div>
    <h3 class="b-title" style="font-size: 16px;">算法 · 题解 · 模板</h3>
    <div class="b-foot">
      <span class="b-pill">29 篇</span>
      <span class="b-arrow">↗</span>
    </div>
  </a>
  <div class="b-card b-quote">
    <div class="b-quote-text">「不积跬步，无以至千里」 — <b>把每一次思考都留下痕迹</b></div>
  </div>
</div>

</div>
