const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

// 子目录内部过滤用（系统文件等）
const IGNORE = ['node_modules', '.git', '.DS_Store', 'README.md'];

// ====== 白名单：只有列在这里的顶层文件夹才会出现在首页 ======
// 与 .vitepress/config.mts 中的 SHOW_DIRS 保持一致
const SHOW_DIRS = [
  'Leetcode',
  'Frontend',
  'cs-core',
  'Projects',
  'Misc',
  // 'openclaw',   // 取消注释即可公开
  // 'img',        // 取消注释即可公开
];

// Directory name mapping (English -> Chinese)
const DIR_MAPPING = {
  'HDU': '数据结构',
  'Leetcode': 'Leetcode',
  'PTA': 'PTA',
  'STL': 'STL',
  'JavaScript': 'JavaScript',
  'CSS': 'CSS',
  'articles': '文章',
  'Miscellaneous': '杂项',
  'PurpleBook': '紫书',
  'TipsAndTricks': '技巧',
  'BinarySearch': '二分查找',
  'SlidingWindow': '滑动窗口',
  'DataStructure': '数据结构',
  'Intro': '入门题单',
  'String': '串',
  'SinglyLinkedList': '单向链表',
  'Stack': '栈',
  'StackAndQueue': '栈和队列',
  'Queue': '队列',
  'SequentialList': '顺序表',
  'Frontend': '前端',
  'cs-core': '计算机基础',
  'Misc': '其他',
  'dataStruct': '数据结构',
  'networks': '计算机网络',
  'os': '操作系统'
};

const CATEGORY_ACCENTS = {
  'Leetcode': '#ef4444',
  'Frontend': '#3b82f6',
  'cs-core': '#8b5cf6',
  'Projects': '#10b981',
  'Misc': '#64748b',
};

const CATEGORY_ICONS = {
  'Leetcode': '🧩',
  'Frontend': '🎨',
  'cs-core': '💻',
  'Projects': '🚀',
  'Misc': '📦',
};

function getDisplayName(name) {
  return DIR_MAPPING[name] || name;
}

// Get file's last git commit time
function getGitTime(filePath) {
  try {
    const result = execSync(
      `git log -1 --format="%at" -- "${filePath}"`,
      { cwd: ROOT, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    if (result) {
      return new Date(parseInt(result) * 1000);
    }
  } catch (e) {
    // File not in git or git error, fallback to mtime
  }
  try {
    return fs.statSync(filePath).mtime;
  } catch (e) {
    return new Date();
  }
}

// Get all markdown files in a directory recursively
function getAllMdFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    if (IGNORE.includes(file) || file.startsWith('.')) return;
    const fullPath = path.join(dirPath, file);
    if (!fs.existsSync(fullPath)) return;
    
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllMdFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.md')) {
      arrayOfFiles.push({
        path: fullPath,
        gitTime: getGitTime(fullPath)
      });
    }
  });

  return arrayOfFiles;
}

// Build directory tree structure
function buildDirTree(dirPath, basePath = '') {
  if (!fs.existsSync(dirPath)) return [];
  
  const items = fs.readdirSync(dirPath);
  const result = [];

  // Sort: directories first, then files
  items.sort((a, b) => {
    const aPath = path.join(dirPath, a);
    const bPath = path.join(dirPath, b);
    const aIsDir = fs.existsSync(aPath) && fs.statSync(aPath).isDirectory();
    const bIsDir = fs.existsSync(bPath) && fs.statSync(bPath).isDirectory();
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.localeCompare(b);
  });

  items.forEach(item => {
    if (IGNORE.includes(item) || item.startsWith('.') || item.endsWith('.cpp') || item.endsWith('.exe')) return;
    
    const fullPath = path.join(dirPath, item);
    if (!fs.existsSync(fullPath)) return;
    
    const stat = fs.statSync(fullPath);
    const relativePath = basePath ? `${basePath}/${item}` : item;

    if (stat.isDirectory()) {
      const children = buildDirTree(fullPath, relativePath);
      if (children.length > 0) {
        result.push({
          type: 'dir',
          name: item,
          displayName: getDisplayName(item),
          path: relativePath,
          children: children
        });
      }
    } else if (item.endsWith('.md')) {
      const name = item.replace('.md', '');
      const displayName = name === 'note' ? '笔记' : name;
      const gitTime = getGitTime(fullPath);
      
      result.push({
        type: 'file',
        name: name,
        displayName: displayName,
        path: relativePath.replace('.md', ''),
        gitTime: gitTime
      });
    }
  });

  return result;
}

// Get root level categories (only from SHOW_DIRS whitelist)
function getRootCategories() {
  const categories = [];

  SHOW_DIRS.forEach(item => {
    const fullPath = path.join(ROOT, item);
    if (!fs.existsSync(fullPath)) return;
    
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const tree = buildDirTree(fullPath, item);
      if (tree.length > 0) {
        const allFiles = getAllMdFiles(fullPath);
        let latestTime = null;
        allFiles.forEach(f => {
          if (!latestTime || f.gitTime > latestTime) {
            latestTime = f.gitTime;
          }
        });

        categories.push({
          name: item,
          displayName: getDisplayName(item),
          tree: tree,
          fileCount: allFiles.length,
          latestTime: latestTime
        });
      }
    }
  });

  // Sort categories by latest update time
  categories.sort((a, b) => {
    if (!a.latestTime) return 1;
    if (!b.latestTime) return -1;
    return b.latestTime - a.latestTime;
  });

  return categories;
}

// Format date as MM/DD
function formatDate(date) {
  if (!date) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
}

// Generate tree HTML for a category
function generateTreeHtml(items, depth = 0) {
  let html = '';
  
  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const prefix = depth === 0 ? '' : (isLast ? '└── ' : '├── ');
    
    if (item.type === 'dir') {
      const openAttr = '';
      html += `      <details class="tree-folder"${openAttr}>
        <summary class="tree-item tree-dir depth-${depth}">
          <span class="tree-prefix">${prefix}</span>
          <span class="tree-toggle"></span>
          <span class="tree-name">${item.displayName}/</span>
        </summary>
        <div class="tree-children">
${generateTreeHtml(item.children, depth + 1)}        </div>
      </details>\n`;
    } else {
      const dateStr = formatDate(item.gitTime);
      html += `      <a class="tree-item tree-file depth-${depth}" href="/${item.path}">
        <span class="tree-prefix">${prefix}</span>
        <span class="tree-name">${item.displayName}</span>
        <span class="tree-date">${dateStr}</span>
      </a>\n`;
    }
  });

  return html;
}

function generateDashboard() {
  const categories = getRootCategories();

  let mostRecentFile = null;
  let mostRecentTime = null;
  let totalFiles = 0;
  categories.forEach(cat => {
    totalFiles += cat.fileCount;
    const allFiles = getAllMdFiles(path.join(ROOT, cat.name));
    allFiles.forEach(f => {
      if (!mostRecentTime || f.gitTime > mostRecentTime) {
        mostRecentTime = f.gitTime;
        mostRecentFile = f.path;
      }
    });
  });

  const continueLink = mostRecentFile
    ? '/' + path.relative(ROOT, mostRecentFile).replace(/\\/g, '/').replace('.md', '')
    : '/';

  let content = `---
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
        <span class="hero-stat-value">${totalFiles}</span>
        <span class="hero-stat-label">Articles</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat-value">${categories.length}</span>
        <span class="hero-stat-label">Categories</span>
      </div>
    </div>
    <a class="hero-cta" href="${continueLink}">
      Continue Reading
      <span class="hero-cta-arrow">→</span>
    </a>
  </div>
</div>

<div class="directory-container">
`;

  categories.forEach((cat, index) => {
    const accent = CATEGORY_ACCENTS[cat.name] || '#0d9488';
    const icon = CATEGORY_ICONS[cat.name] || '📂';
    const delay = (index * 0.06).toFixed(2);
    content += `  <div class="category-section" style="--card-accent: ${accent}; animation-delay: ${delay}s">
    <div class="category-accent-bar"></div>
    <div class="category-body">
      <div class="category-header">
        <span class="category-icon">${icon}</span>
        <span class="category-name">${cat.displayName}</span>
        <span class="category-meta">${cat.fileCount} 篇</span>
      </div>
      <div class="tree-container">
${generateTreeHtml(cat.tree)}      </div>
    </div>
  </div>
`;
  });

  content += `</div>
`;

  fs.writeFileSync(path.join(ROOT, 'index.md'), content);
  console.log('Dashboard generated at index.md');
}

generateDashboard();
