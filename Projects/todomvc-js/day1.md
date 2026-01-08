## 语义化标签

| 标签 | 本质语义 |
| :--- | :--- |
| `header` | 页面 / 区块的头部 |
| `nav` | 导航链接集合 |
| `main` | 页面主内容（唯一） |
| `section` | 有主题的内容区块 |
| `article` | 可独立发布的内容 |
| `aside` | 关联但非主线内容 |
| `footer` | 页面 / 区块的尾部 |
| `div` | **没有语义的容器** |

## CSS 布局技巧

### 1. 侧边栏固定定位（Fixed Positioning）

```css
.sidebar {
  width: var(--sidebar-width);
  background-color: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}
```

*   **`position: fixed` —— “定身术”**
    *   **作用**：将元素脱离正常的文档流，相对于浏览器窗口（Viewport）进行定位。
    *   **效果**：无论页面内容多长，滑动滚动条时，侧边栏都会死死地“钉”在屏幕左侧，不随滚动消失。

*   **`left, top, bottom: 0` —— “三根钉子”**
    *   `top: 0`：顶端钉在窗口最上方。
    *   `left: 0`：左侧钉在窗口最左方。
    *   `bottom: 0`：底端钉在窗口最下方。
    *   **核心目的**：纵向撑满全屏。同时设置 top 和 bottom，CSS 会强制高度等于浏览器窗口高度。
    *   **思考**：为什么没写 `right: 0`？如果写了，侧边栏会横向拉满全屏，遮住内容区。因为已设置固定宽度 `width: var(--sidebar-width)`。

*   **`flex-direction: column` —— “排队术”**
    *   **背景**：`display: flex` 默认子元素横向排列。
    *   **作用**：强制子元素竖着排（像叠罗汉）。
    *   **效果**：标题、菜单、页脚自动垂直排列，整齐有序。

### 2. 主内容区自适应布局（Flex: 1）

```css
.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: 40px 48px;
  background-color: var(--main-bg);
}
```

*   **`flex: 1` —— “吞掉所有剩下的空间”**
    *   **场景**：父盒子 `.app-container` (`display: flex`) 有两个子盒子：
        1.  `.sidebar` (固定宽 240px)
        2.  `.main-content` (设置 `flex: 1`)
    *   **作用**：侧边栏占 240px，剩下的右边所有空间都会被自动填满。
    *   **拆解 `flex: 1`**：
        *   `flex-grow: 1`：有剩余空间就扩展。
        *   `flex-shrink: 1`：空间不够就缩小。
        *   `flex-basis: 0%`：基础大小。
    *   **对比**：不写 `flex: 1`，宽度由内容决定，可能缩在左侧留白。

*   **`margin-left: var(--sidebar-width)`**
    *   **原因**：`.sidebar` 设置了 `position: fixed`（脱离文档流），不占位置。
    *   **作用**：给侧边栏“腾位子”，防止主内容区钻到侧边栏下面。

### 3. 导航按钮交互细节

```css
.nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 14px 16px;
    margin-bottom: 6px;
    border-radius: var(--border-radius);
    color: var(--text-primary);
    transition: background-color 0.2s;
    text-align: left;
}
```

*   **`width: 100%` —— “横向占位”**
    *   强制按钮填满父容器。增大点击热区，提升交互体验。

*   **`align-items: center` —— “垂直对齐”**
    *   配合 `display: flex`，让图标和文字中轴线对齐，解决高度不一致导致的错位。

*   **`transition: background-color 0.2s` —— “丝滑补间”**
    *   鼠标移入（:hover）时，背景色在 0.2秒内平滑淡入，增加“高级感”和“呼吸感”。

*   **`text-align: left` —— “内容靠左”**
    *   **作用**：强制文字左对齐。
    *   **必要性**：
        1.  覆盖浏览器默认样式（button 默认居中）。
        2.  即使 Flex 布局下 `justify-content` 默认左对齐，但在 Flex 失效或处理纯文本时，它是双重保险。

### 4. 页面切换魔法（Tab 切换）

```css
.view {
  display: none;
}

.view.active {
  display: block;
}
```

*   **原理**：
    *   **`.view { display: none; }`**：默认隐藏所有功能区（Todo、倒数日、路线图）。
    *   **`.view.active { display: block; }`**：只有贴上 `active` 标签的元素才会显示。
*   **交互逻辑**：JS 负责“贴标签”和“撕标签”（操作 class），CSS 负责“显示”和“隐藏”，实现逻辑解耦。

### 5. 输入框组布局

```css
.todo-input-container {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
}
```

*   **`display: flex`**：让输入框和按钮“肩并肩”横向排列，避免换行和对齐问题。
*   **`gap: 12px`**：最爽的属性！自动在子元素之间插入 12px 间距，替代传统的 `margin`。
*   **伸缩控制**：配合子元素 `flex: 1`，可实现输入框自动填满剩余空间。

### 6. 输入框交互美化（Focus 状态）

```css
.todo-input {
  flex: 1;
  padding: 14px 18px;
  background-color: #f8f9fa;
  border: 2px solid transparent; /* 预留边框位置 */
  border-radius: var(--border-radius);
  font-size: 15px;
  outline: none; /* 去掉默认丑边框 */
  transition: all 0.2s;
}

.todo-input:focus {
  background-color: white;
  border-color: var(--primary-color);
}

.todo-input::placeholder {
  color: #95a5a6;
}
```

*   **`.todo-input:focus` —— “变身时刻”**
    *   **`background-color: white`**：点击变白，像聚光灯打亮，暗示“可输入”。
    *   **`border-color: var(--primary-color)`**：配合 `outline: none`，替换浏览器默认丑框，显示自定义蓝边框。
    *   **`transition`**：让颜色变化丝滑过渡。

*   **`::placeholder`**：修改提示文字颜色（灰青色），区分主次，统一浏览器表现。

### 7. Flex 布局中的 margin: auto

```css
.todo-count {
  margin-left: auto;
  font-size: 13px;
  color: #95a5a6;
}
```

*   **作用**：在 Flex 容器中，“独占右侧”。
*   **原理**：`margin-left: auto` 会自动吃掉所有剩余空间，把当前元素挤到最右边，同时把前面的元素推到最左边。
*   **对比**：比 `justify-content: space-between` 更灵活，适合“左边一组，右边孤零零一个”的布局。

### 8. 列表项样式与装饰

```css
.todo-list {
  list-style: none; /* 去掉小圆点 */
  margin-bottom: 20px;
}
.todo-item.completed .todo-text {
  text-decoration: line-through; /* 画横线 */
  color: #95a5a6;
}
```

*   **`list-style: none`**：拆地基。去掉 `ul/li` 默认的小圆点，方便自定义卡片样式。
*   **`text-decoration: line-through`**：给反馈。经典的“任务已完成”视觉表现（中划线）。

## JavaScript 核心逻辑

### 1. 确保 DOM 加载（DOMContentLoaded）

```js
document.addEventListener('DOMContentLoaded', function() {
    initTodoList();
});
```

*   **含义**：监听 HTML 结构加载完成事件。
*   **目的**：防止 JS 执行时 DOM 元素还没渲染出来（导致 `Cannot read property... of null` 报错）。

### 2. 获取元素的方式对比

| 特性 | `getElementById` | `querySelector` |
| :--- | :--- | :--- |
| **性格** | 专一的定位器 | 全能的万能钥匙 |
| **规则** | 只能用 ID，不加 `#` | 支持 ID、类、标签，需加 `#` 或 `.` |
| **写法** | `('todo-input')` | `('#todo-input')` |
| **性能** | 极快（索引查找） | 稍慢（全局扫描） |
| **唯一性** | 只找一个 ID | 只找第一个匹配项 |

### 3. 事件委托与 DOM 操作

```js
todoList.addEventListener('click', function(event) {
    const target = event.target; // 实际点击的元素
    
    // 1. 认亲大法：找最近的 li 祖先
    const todoItem = target.closest('.todo-item');
    if (!todoItem) return;
    
    // 2. 查看铭牌：获取自定义属性 data-id
    const todoId = parseInt(todoItem.getAttribute('data-id'));
    
    // 3. 身份核验：判断点击的是否为删除按钮
    if (target.classList.contains('todo-delete')) {
        deleteTodo(todoId);
    }
});
```

*   **`closest('.todo-item')`**：向上查找最近的指定类名祖先。用于从内层按钮找到外层卡片容器。
*   **`getAttribute('data-id')`**：获取 HTML 自定义属性（身份 ID）。
*   **`classList.contains('todo-delete')`**：检查类名。在事件委托中筛选出特定的触发元素（如删除按钮）。

### 4. 数组过滤（删除逻辑）

```js
function deleteTodo(id) {
    // filter 返回新数组，覆盖旧数组
    todos = todos.filter(function(item) {
        return item.id !== id; // “只要 ID 不等于我选中的那个，都留下”
    });
    renderTodos();
}
```

*   **核心**：使用 `filter` 方法生成一个剔除了目标 ID 的新数组，实现不可变数据的删除操作。

### 5. 事件监听器的生命周期

*   **误区**：函数结束后监听器是否还在？
*   **真相**：
    *   **安装**：`addEventListener` 将监听任务挂载到 DOM 元素上。
    *   **持久化**：进入浏览器的“事件表格”托管，**不再依赖当初的函数**。
    *   **生效**：只要 DOM 元素还在页面上，监听器就一直有效，哪怕初始化函数已经执行完毕销毁了。
    *   **比喻**：装修工（函数）装好报警器（监听器）后离开，报警器依然会工作。
