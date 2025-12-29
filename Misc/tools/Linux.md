## macOS前端开发常用Linux命令速查表

| 命令 | 用途 | 前端常见场景 |
|------|------|-------------|
| `ls -la` | 查看文件详细列表 | 查看项目目录结构、检查隐藏文件 |
| `cd` | 切换目录 | `cd ~/projects` 进入项目目录 |
| `pwd` | 显示当前目录 | 确认当前工作路径 |
| `mkdir` | 创建目录 | `mkdir src/components` 创建组件目录 |
| `rm -rf` | 强制删除 | `rm -rf node_modules` 删除依赖（谨慎使用） |
| `cp` | 复制文件 | `cp .env.example .env` 复制环境配置文件 |
| `mv` | 移动/重命名 | `mv old.js new.js` 重命名文件 |
| `cat` | 查看文件内容 | `cat package.json` 查看项目配置 |
| `head/tail` | 查看文件头尾 | `tail -f server.log` 实时查看日志 |
| `grep` | 搜索文本 | `grep -r "export const" src/` 搜索导出声明 |
| `find` | 查找文件 | `find . -name "*.jsx"` 查找React组件文件 |
| `ps aux` | 查看进程 | `ps aux \| grep node` 查找Node进程 |
| `kill -9` | 强制结束进程 | `kill -9 <PID>` 结束卡死的开发服务器 |
| `lsof -i` | 查看端口占用 | `lsof -i :3000` 检查3000端口谁在用 |
| `curl` | HTTP请求 | `curl localhost:3000/api/health` 测试API |
| `chmod +x` | 添加执行权限 | `chmod +x deploy.sh` 使部署脚本可执行 |
| `df -h` | 查看磁盘空间 | 检查磁盘剩余空间 |
| `du -sh` | 查看目录大小 | `du -sh node_modules` 查看依赖包大小 |
| `history` | 查看命令历史 | 找回忘记的命令 |
| `\|\|` | 管道组合 | `npm run build \|\| echo "构建失败"` |
| `alias` | 命令别名 | `alias gp="git pull"` 简化常用命令 |
| `open` | 打开文件/目录 | `open .` 在Finder中打开当前目录 |


## 前端开发必备别名（加到~/.zshrc）

```bash
alias ns="npm start"
alias nd="npm run dev"
alias nt="npm test"
alias nb="npm run build"
alias gp="git pull"
alias gl="git log --oneline"
alias gs="git status"
```


## 最常用的5个组合命令

```bash
# 1. 查找并删除所有node_modules
find . -name "node_modules" -type d -exec rm -rf {} +

# 2. 搜索代码中的console.log
grep -r "console.log" src/ --include="*.js"

# 3. 统计项目JS代码行数
find src -name "*.js" -o -name "*.jsx" | xargs wc -l

# 4. 查看大文件（超过100M）
find . -type f -size +100M | xargs ls -lh

# 5. 批量修改文件扩展名
find . -name "*.jsx" -exec rename 's/\.jsx$/.tsx/' {} \;
```


## 前端开发术语扫盲表

### 一、操作系统相关

| 术语 | 通俗解释 | 前端开发中的用途 |
|------|----------|-----------------|
| **Shell** | 操作系统的"命令行界面" | 在终端里输入命令的地方 |
| **Terminal（终端）** | 运行Shell的窗口程序 | 就是那个黑框/白框窗口 |
| **~/.zshrc** | 个人化的命令设置文件 | 用来存你的快捷命令（别名） |
| **PATH** | 系统找程序的"地址本" | 告诉系统去哪找npm、node等程序 |
| **环境变量** | 系统运行的"全局设置" | 比如设置`NODE_ENV=production` |
| **根目录 `/`** | 电脑的"最顶层文件夹" | 系统核心文件所在地 |
| **家目录 `~`** | 你的"个人专属文件夹" | `/Users/你的名字/`，放你的项目 |
| **当前目录 `.`** | "我现在在哪里" | 终端当前所在的文件夹 |
| **父目录 `..`** | "上一级文件夹" | `cd ..` 返回上级 |

### 二、文件操作相关

| 术语 | 通俗解释 | 例子 |
|------|----------|------|
| **ls** | "看看这里有什么文件" | `ls` 列出文件 |
| **cd** | "换个地方" | `cd project` 进入project文件夹 |
| **mkdir** | "新建文件夹" | `mkdir src` 创建src文件夹 |
| **rm** | "删除" | `rm file.txt` 删除文件（小心用） |
| **cp** | "复制" | `cp a.js b.js` 复制文件 |
| **mv** | "移动/改名" | `mv old.js new.js` 重命名 |
| **pwd** | "我现在在哪" | 显示当前完整路径 |
| **cat** | "看看文件内容" | `cat index.html` 显示文件内容 |
| **grep** | "在文件里搜索文字" | `grep "function" app.js` 找function |

### 三、开发工具相关

| 术语 | 通俗解释 | 实际意义 |
|------|----------|----------|
| **npm** | JavaScript的"应用商店" | 安装别人写好的代码包 |
| **package.json** | 项目的"说明书" | 记录项目信息、依赖包 |
| **node_modules** | "下载的包存放处" | npm安装的包都放这里 |
| **localhost** | "我的电脑自己" | `localhost:3000` 访问本地服务 |
| **端口** | 程序的"门牌号" | 3000是开发服务器，3306是数据库 |

### 四、网络相关

| 术语 | 通俗解释 | 例子 |
|------|----------|------|
| **localhost** | "我自己的电脑" | 开发时访问`http://localhost:3000` |
| **端口** | 服务的"门牌号" | Web: 80/443, 开发: 3000/8080 |
| **IP地址** | 电脑的"电话号码" | 本地一般是`127.0.0.1` |
| **DNS** | "网址翻译官" | 把`google.com`变成IP |
| **HTTP/HTTPS** | 网站的"快递方式" | HTTP普通快递，HTTPS加密快递 |
| **API** | "数据接口" | 前端问后端要数据的通道 |

### 五、编程概念

| 术语 | 通俗解释 | 前端例子 |
|------|----------|----------|
| **模块** | 代码的"乐高积木" | `import React from 'react'` |
| **组件** | UI的"可复用部件" | `<Button>点击</Button>` |
| **状态** | 组件的"记忆/当前情况" | `const [count, setCount] = useState(0)` |
| **Props** | 给组件的"参数/属性" | `<User name="张三" age={20}>` |
| **异步** | "你先忙着，我等你" | 获取数据时不会卡住页面 |

### 六、前端框架相关

| 术语 | 通俗解释 | 作用 |
|------|----------|------|
| **React** | UI的"乐高搭建系统" | 用组件拼页面 |
| **Vue** | 更"贴心"的UI搭建系统 | 中文友好，易上手 |
| **组件** | 页面的"可复用零件" | 按钮、导航栏、卡片等 |
| **状态管理** | 多个组件的"共享记忆" | Redux、Zustand等 |
| **虚拟DOM** | UI的"设计草图" | 先画草图，再更新真实页面 |
| **Hooks** | React的"魔法工具" | `useState`, `useEffect`等 |
| **JSX** | "在JS里写HTML" | React的语法糖 |

### 七、实用场景对应

#### 当你想要...时
- **运行项目** → `npm start` 或 `npm run dev`
- **安装包** → `npm install 包名`
- **查看当前目录** → `pwd`
- **进入项目** → `cd ~/Documents/project`
- **查看有什么文件** → `ls` 或 `ls -la`
- **删除node_modules重新装** → `rm -rf node_modules && npm install`
- **找代码里的console.log** → `grep -r "console.log" src/`
- **查看谁占了3000端口** → `lsof -i :3000`
- **结束卡住的进程** → `Ctrl+C` 或找到PID后 `kill -9 PID`
