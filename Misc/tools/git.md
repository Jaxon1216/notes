# Git 实战指南：从入门到团队协作

---

## 一、Git 仓库初始化

### 知识点讲解

**Git 仓库的两种创建方式**

---

### 方式一：克隆远程仓库（推荐）

```bash
# 1. 克隆远程仓库到本地
git clone https://github.com/用户名/仓库名.git

# 2. 进入目录
cd 仓库名

# 3. 开始工作
git add .
git commit -m "feat: 添加新功能"
git push
```

**适用场景：**
- 加入现有项目
- 开始一个新的 GitHub 项目
- ⭐ **最常用方式**

---

### 方式二：本地初始化

```bash
# 1. 创建项目目录
mkdir my-project
cd my-project

# 2. 初始化 Git 仓库
git init

# 3. 关联远程仓库
git remote add origin https://github.com/用户名/仓库名.git

# 4. 首次推送
git add .
git commit -m "chore: 初始化项目"
git push -u origin main
```

**适用场景：**
- 本地已有项目，想上传到 GitHub
- 完全从零开始的项目

---

### 查看和修改远程仓库地址

```bash
# 查看远程仓库配置
git remote -v
# 输出示例：
# origin  https://github.com/user/repo.git (fetch)
# origin  https://github.com/user/repo.git (push)

# 修改远程仓库地址
git remote set-url origin https://github.com/新用户名/新仓库名.git

# 添加多个远程仓库
git remote add upstream https://github.com/原作者/仓库名.git
```

---

### 📝 要点测验

<details>
<summary>git init 和 git clone 的区别是什么？</summary>

| 命令 | 作用 | 远程仓库 | 历史记录 |
|------|------|---------|---------|
| **git init** | 在当前目录初始化新仓库 | ❌ 需要手动关联 | ❌ 无历史 |
| **git clone** | 克隆远程仓库到本地 | ✅ 自动关联 | ✅ 完整历史 |

**实际工作流：**
- 新项目：`git init` → 创建 GitHub 仓库 → `git remote add`
- 加入项目：直接 `git clone`（推荐）
</details>

<details>
<summary>如何检查分支的远程仓库配置？</summary>

```bash
# 查看所有分支配置
git config --list | grep branch

# 查看特定分支的远程配置
git config branch.main.remote
# 输出：origin

# 查看特定分支的远程分支
git config branch.main.merge
# 输出：refs/heads/main
```

**常见问题：**
当看到推送目标与预期不符时，检查 `git config branch.<分支名>.remote` 配置，确保与 `git remote -v` 显示的 URL 一致。
</details>

---

## 二、Git 基础命令

### 知识点讲解

**Git 的工作流程**

```
工作区（Working Directory）
    ↓ git add
暂存区（Staging Area）
    ↓ git commit
本地仓库（Local Repository）
    ↓ git push
远程仓库（Remote Repository）
```

---

### 基础命令速查表

| 命令 | 作用 | 示例 |
|------|------|------|
| `git add` | 添加文件到暂存区 | `git add .`（全部）<br>`git add file.js`（单个） |
| `git commit` | 提交到本地仓库 | `git commit -m "feat: 添加登录功能"` |
| `git push` | 推送到远程仓库 | `git push origin main` |
| `git pull` | 拉取远程更新 | `git pull origin main` |
| `git status` | 查看工作区状态 | `git status` |
| `git log` | 查看提交历史 | `git log`（按 `q` 退出） |
| `git diff` | 查看修改内容 | `git diff` |

---

### git add 详解

```bash
# 添加所有修改
git add .

# 添加指定文件
git add index.html style.css

# 添加所有 .js 文件
git add *.js

# 交互式添加（选择性添加）
git add -p
```

---

### git commit 详解

```bash
# 基本提交
git commit -m "fix: 修复登录bug"

# 追加到上一次提交（修改提交信息）
git commit --amend -m "fix: 修复登录和注册bug"

# 快捷方式：add + commit
git commit -am "refactor: 重构代码"
# 注意：只对已跟踪的文件有效，新文件必须先 git add
```

---

### git push 详解

```bash
# 推送到默认远程分支
git push

# 推送到指定远程和分支
git push origin main

# 首次推送（设置上游分支）
git push -u origin main
# 之后就可以直接 git push

# 强制推送（⚠️ 危险操作）
git push --force
# 更安全的版本：
git push --force-with-lease
```

---

### git pull 详解

```bash
# 拉取并合并（默认行为）
git pull
# 等价于：git fetch + git merge

# 拉取并变基
git pull --rebase
# 等价于：git fetch + git rebase
```

---

### 📝 要点测验

<details>
<summary>git pull 和 git fetch 有什么区别？</summary>

```bash
# git fetch：只下载，不合并
git fetch origin
# 更新远程跟踪分支（origin/main），但不影响本地分支

# git pull：下载并合并
git pull origin main
# 等价于：
git fetch origin
git merge origin/main
```

**工作流对比：**

| 命令 | 下载远程更新 | 合并到本地 | 安全性 |
|------|------------|-----------|--------|
| **git fetch** | ✅ | ❌ | ✅ 安全（可以先查看） |
| **git pull** | ✅ | ✅ | ⚠️ 可能产生冲突 |

**最佳实践：**
```bash
# 谨慎的做法
git fetch origin
git log origin/main  # 查看远程更新
git merge origin/main  # 确认无误后再合并

# 快捷的做法
git pull  # 直接拉取并合并
```
</details>

<details>
<summary>git commit --amend 的使用场景是什么？</summary>

**场景一：修改提交信息**

```bash
# 刚刚提交，发现 commit message 写错了
git commit -m "fix: 修复bug"
git commit --amend -m "fix: 修复登录bug"
```

**场景二：追加遗漏的文件**

```bash
git commit -m "feat: 添加用户模块"
# 糟糕，忘记添加 user.css 了
git add user.css
git commit --amend --no-edit
# --no-edit 表示不修改提交信息
```

**⚠️ 注意：**
- 只能修改**最后一次提交**
- 如果已经 `git push`，不要使用 `--amend`（会改变提交历史）
- 如果必须修改已推送的提交，需要 `git push --force`（团队协作中很危险）
</details>

---

## 三、Git 分支管理

### 知识点讲解

**分支的本质**

Git 的分支本质是一个**指向某次提交的指针**。理解这一点，分支操作就变得很简单了。

```
main  ───●───●───●
              ↑
            HEAD
```

---

### 分支基础命令

```bash
# 查看所有分支
git branch
# 加 * 的是当前分支

# 查看所有分支（包括远程）
git branch -a
# 按 q 退出

# 创建新分支
git branch feature-login

# 切换分支
git checkout feature-login

# 创建并切换（快捷方式）⭐
git checkout -b feature-login

# 删除分支
git branch -d feature-login

# 强制删除（未合并的分支）
git branch -D feature-login
```

---

### 分支合并

#### 方式一：merge（合并）

```bash
# 将 feature 分支合并到 main
git checkout main
git merge feature-login
```

**效果：**

```
main    ───●───●───●───●  (合并提交)
            \         /
feature     ●───●───●
```

**特点：**
- 保留完整的分支历史
- 会产生一个"合并提交"
- 分支图会有分叉

---

#### 方式二：rebase（变基）

```bash
# 将当前分支变基到 main
git checkout feature-login
git rebase main
```

**效果：**

```
# 变基前
main    ───●───●───●
            \
feature     ●───●

# 变基后
main    ───●───●───●───●'───●'
                    (feature 的副本)
```

**特点：**
- 历史呈直线
- 没有合并提交
- **会改变提交历史**（慎用）

---

### merge vs rebase 对比

| 对比项 | merge | rebase |
|-------|-------|--------|
| **历史记录** | 保留分支历史 | 线性历史 |
| **合并提交** | ✅ 产生 | ❌ 没有 |
| **改变历史** | ❌ 不改变 | ✅ 改变 |
| **适用场景** | ⭐ 团队协作（主分支） | 个人分支整理 |
| **安全性** | ✅ 安全 | ⚠️ 危险（已推送的分支） |

---

### 📝 要点测验

<details>
<summary>什么时候用 merge，什么时候用 rebase？</summary>

**merge 适用场景：**
- 将功能分支合并到主分支（如 `feature → main`）
- 团队协作的公共分支
- 希望保留完整的分支历史

```bash
git checkout main
git merge feature-login
```

**rebase 适用场景：**
- 整理自己的提交历史（让提交更清晰）
- 将主分支的更新同步到功能分支

```bash
# 在 feature 分支上
git rebase main
# 让 feature 的提交"搬"到最新的 main 之后
```

**黄金法则：**
> ⚠️ **永远不要 rebase 已经推送到远程的公共分支**
> 
> 原因：rebase 会改变提交历史，其他人拉取时会产生冲突
</details>

<details>
<summary>HEAD 是什么？分离 HEAD 是什么意思？</summary>

**HEAD 的本质：**
- HEAD 是一个指针，指向**当前所在的位置**
- 通常情况下，HEAD 指向某个分支（如 `main`）
- 分支再指向具体的提交

```
HEAD → main → commit-abc123
```

**正常状态：**
```bash
git log --oneline
# * abc1234 (HEAD -> main) 最新提交
```

**分离 HEAD（Detached HEAD）：**

```bash
# 直接 checkout 某个提交
git checkout abc1234

# 提示：You are in 'detached HEAD' state
```

此时 HEAD 直接指向提交，不指向分支：

```
HEAD → commit-abc123
main → commit-xyz789
```

**问题：**
- 在此状态下的新提交不属于任何分支
- 切换分支后，这些提交会丢失

**解决方法：**
```bash
# 为当前状态创建分支
git checkout -b new-branch
```
</details>

---

## 四、Git 进阶操作

### 知识点讲解

**相对引用**

Git 提供了相对引用语法，可以基于当前位置快速定位提交。

---

### 相对引用符号

| 符号 | 含义 | 示例 |
|------|------|------|
| `^` | 父提交（上一个） | `HEAD^` = HEAD 的父提交 |
| `~n` | 第 n 代祖先 | `HEAD~3` = 往上数 3 个提交 |
| `^n` | 第 n 个父提交（用于合并提交） | `HEAD^2` = 合并的第 2 个父提交 |

---

### 相对引用示例

```bash
# 查看上一次提交
git show HEAD^

# 查看上上次提交
git show HEAD^^
# 或者
git show HEAD~2

# 查看 main 分支的上 3 个提交
git show main~3

# 重置到上一次提交
git reset HEAD^
```

**类比理解：**
- `HEAD^` = 爸爸
- `HEAD^^` = 爷爷
- `HEAD~3` = 曾爷爷（往上数 3 代）

---

### 分支强制移动

```bash
# 强制将 main 分支移动到 HEAD 的上 3 个提交
git branch -f main HEAD~3

# 强制将 main 分支移动到指定提交
git branch -f main abc1234

# 强制将当前分支移动
git reset --hard HEAD~3
```

**使用场景：**
- 撤销最近几次提交
- 快速移动分支指针
- ⚠️ 危险操作，谨慎使用

---

### 撤销操作

#### 方式一：reset（重置）

```bash
# 重置到上一次提交（保留修改）
git reset HEAD^

# 重置到上一次提交（丢弃修改）⚠️
git reset --hard HEAD^

# 重置到指定提交
git reset abc1234
```

**工作原理：**

```
重置前：
main ───●───●───●
                ↑
              HEAD

重置后：
main ───●───●
            ↑
          HEAD
（最后一个提交消失了，但文件还在工作区）
```

**⚠️ 注意：**
- `reset` 会改变历史
- 对于**已推送**的提交，**不要用 reset**
- 只适用于本地提交

---

#### 方式二：revert（反做）

```bash
# 撤销最后一次提交
git revert HEAD

# 撤销指定提交
git revert abc1234
```

**工作原理：**

```
反做前：
main ───●───●───●
                ↑
              HEAD

反做后：
main ───●───●───●───●'
                    ↑
                  HEAD
（创建一个新提交，内容与倒数第二个相同）
```

**特点：**
- ✅ 不改变历史（只是新增一个"反向"提交）
- ✅ 适用于远程分支
- ⭐ **团队协作推荐使用**

---

### reset vs revert 对比

| 对比项 | reset | revert |
|-------|-------|--------|
| **改变历史** | ✅ 改变 | ❌ 不改变 |
| **工作方式** | 回退指针 | 创建新提交 |
| **远程分支** | ❌ 不适用 | ✅ 适用 |
| **使用场景** | 本地撤销 | ⭐ 远程撤销 |

---

### 📝 要点测验

<details>
<summary>HEAD^、HEAD^^、HEAD~2 有什么区别？</summary>

**单 ^ 符号：**
- `HEAD^` = 父提交（第 1 代）
- `HEAD^^` = 父提交的父提交（第 2 代）
- `HEAD^^^` = 第 3 代（太长，不推荐）

**~ 符号：**
- `HEAD~1` = `HEAD^`
- `HEAD~2` = `HEAD^^`
- `HEAD~3` = `HEAD^^^`

**推荐用法：**
- 往上 1 代：用 `HEAD^`
- 往上多代：用 `HEAD~n`

**特殊情况（合并提交）：**

```
main ───●───●───●
            ↑   ↑
          ^2   ^1 (默认)
```

合并提交有两个父提交：
- `HEAD^` 或 `HEAD^1`：主分支的父提交
- `HEAD^2`：被合并分支的父提交
</details>

<details>
<summary>什么时候用 reset，什么时候用 revert？</summary>

**使用决策树：**

```
提交是否已经 push 到远程？
├─ 否 → 用 git reset（简单快速）
└─ 是 → 用 git revert（安全）
```

**reset 场景（本地）：**

```bash
# 刚刚提交，发现代码有问题，想重新改
git reset HEAD^
# 提交撤销，修改保留在工作区

# 想完全丢弃最近 3 次提交
git reset --hard HEAD~3
```

**revert 场景（远程）：**

```bash
# 昨天的提交有 bug，但已经 push 了
git revert abc1234

# 推送到远程
git push
# 其他人拉取时，会看到一个"撤销"提交，不会混乱
```

**对比效果：**

| 操作 | 本地历史 | 远程历史 | 团队影响 |
|------|---------|---------|---------|
| **reset + push --force** | 改变 | 改变 | ❌ 灾难性 |
| **revert + push** | 增加 | 增加 | ✅ 无影响 |
</details>

---

## 五、Git 远程协作

### 知识点讲解

**远程协作的核心命令**

---

### fetch、pull、push 详解

**命令关系图：**

```
远程仓库
    ↓ git fetch（只下载）
本地远程跟踪分支（origin/main）
    ↓ git merge
本地分支（main）
    ↓ git push
远程仓库
```

---

### git fetch

```bash
# 拉取所有远程分支的更新
git fetch origin

# 拉取指定分支
git fetch origin main

# 拉取所有远程仓库
git fetch --all
```

**效果：**
- 更新 `origin/main`（远程跟踪分支）
- **不影响**你的 `main` 分支
- 可以先查看再决定是否合并

---

### git pull

```bash
# 拉取并合并（最常用）
git pull

# 等价于：
git fetch origin
git merge origin/main

# 拉取并变基
git pull --rebase

# 等价于：
git fetch origin
git rebase origin/main
```

**pull 的两种策略：**

| 策略 | 命令 | 特点 | 使用场景 |
|------|------|------|---------|
| **merge** | `git pull` | 产生合并提交 | ⭐ 默认，安全 |
| **rebase** | `git pull --rebase` | 线性历史 | 个人分支整理 |

---

### git push

```bash
# 推送到默认远程分支
git push

# 推送到指定远程和分支
git push origin feature-login

# 首次推送（设置上游分支）
git push -u origin feature-login

# 推送所有分支
git push --all

# 推送标签
git push --tags
```

---

### 文件删除操作

```bash
# 删除文件并暂存删除操作
git rm file.txt

# 删除目录（递归）
git rm -r directory/

# 只从 Git 删除，保留本地文件
git rm --cached file.txt

# 提交删除
git commit -m "chore: 删除不需要的文件"
```

---

### 📝 要点测验

<details>
<summary>为什么推荐用 git fetch 而不是直接 git pull？</summary>

**git pull 的风险：**

```bash
git pull
# ⚠️ 直接合并，可能产生冲突
# ⚠️ 无法预览远程更新
# ⚠️ 可能破坏本地开发
```

**git fetch 的优势：**

```bash
# 1. 先拉取，不合并
git fetch origin

# 2. 查看远程更新
git log origin/main

# 3. 查看差异
git diff main origin/main

# 4. 确认无误后再合并
git merge origin/main
```

**最佳实践：**
- 不确定远程有什么更新：用 `git fetch`
- 确定远程更新安全：用 `git pull`
- 团队协作频繁：用 `git pull --rebase`（保持历史整洁）
</details>

<details>
<summary>git rm 和直接删除文件有什么区别？</summary>

**直接删除：**

```bash
# 用系统命令删除
rm file.txt

# Git 状态
git status
# Changes not staged for commit:
#   deleted:    file.txt

# 还需要暂存删除操作
git add file.txt
git commit -m "chore: 删除文件"
```

**git rm：**

```bash
# 删除并暂存
git rm file.txt

# Git 状态
git status
# Changes to be committed:
#   deleted:    file.txt

# 直接提交
git commit -m "chore: 删除文件"
```

**对比：**

| 操作 | 删除本地文件 | 暂存删除 | 步骤 |
|------|------------|---------|------|
| **rm + git add** | ✅ | 需要 add | 2 步 |
| **git rm** | ✅ | ✅ 自动 | ⭐ 1 步 |
| **git rm --cached** | ❌ 保留 | ✅ | 从版本控制移除，但保留文件 |
</details>

---

## 六、Git Commit 规范（Conventional Commits）

### 知识点讲解

**为什么需要规范化的提交信息？**

* 📜 自动生成 CHANGELOG
* 🔍 快速定位历史记录
* 🤝 提升团队协作效率
* 🚀 支持自动化流程（CI/CD）

---

### Commit 类型详解

| 类型 | 含义 | 使用场景 | 示例 |
|------|------|----------|------|
| **feat** | 新功能 | 新增模块、页面、功能点 | `feat(login): 添加微信扫码登录` |
| **fix** | 修复 Bug | 修复代码错误、功能异常 | `fix(payment): 修复支付宝支付失败` |
| **docs** | 文档更新 | 更新 README、API 文档 | `docs(api): 添加用户接口文档` |
| **style** | 代码样式 | 格式调整（不影响功能） | `style: 统一使用单引号` |
| **refactor** | 代码重构 | 优化代码结构 | `refactor(auth): 重构权限验证逻辑` |
| **perf** | 性能优化 | 提升性能 | `perf(image): 图片懒加载优化` |
| **test** | 测试相关 | 添加/修改测试 | `test(login): 添加登录功能测试` |
| **chore** | 杂项任务 | 更新依赖、配置文件 | `chore(deps): 更新 axios 版本` |
| **build** | 构建相关 | 修改构建工具、配置 | `build(webpack): 优化打包配置` |
| **ci** | CI/CD 配置 | 修改持续集成配置 | `ci: 添加 GitHub Actions 配置` |
| **revert** | 回退 | 回退之前的提交 | `revert: 回退 feat(login) 提交` |

---

### Commit 消息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

**示例：**

```
feat(user): 添加用户个人中心页面

- 实现用户信息展示
- 添加头像上传功能
- 集成编辑个人资料表单

Closes #123
```

**各部分说明：**

| 部分 | 必填 | 说明 |
|------|------|------|
| **type** | ✅ | 提交类型 |
| **scope** | ❌ | 影响范围（模块/组件） |
| **subject** | ✅ | 简短描述（50 字以内） |
| **body** | ❌ | 详细描述 |
| **footer** | ❌ | 关联 Issue、破坏性变更 |

---

### 作用域（Scope）示例

```bash
# 模块/组件
feat(user): 添加用户注册功能
fix(payment): 修复支付失败问题

# 文件类型
docs(api): 更新 API 文档
style(css): 调整全局样式

# 功能区域
refactor(auth): 重构权限验证
test(login): 添加登录测试

# 技术栈
chore(deps): 更新依赖包
build(webpack): 优化构建配置
```

---

### 实际工作流示例

```bash
# 早上开发新功能
git commit -m "feat(order): 添加订单评价功能"

# 下午修复 bug
git commit -m "fix(cart): 修复购物车数量计算错误"

# 晚上更新文档
git commit -m "docs(install): 添加 Docker 部署文档"

# 重构代码
git commit -m "refactor(utils): 提取公共工具函数"

# 性能优化
git commit -m "perf(image): 实现图片懒加载"
```

---

### 可以省略作用域的情况

```bash
# 跨模块的小修复
git commit -m "fix: 修复几个拼写错误"

# 整体文档更新
git commit -m "docs: 更新项目简介"

# 简单的工具更新
git commit -m "chore: 更新 .gitignore 文件"

# 初始化项目
git commit -m "chore: 初始化项目"
```

---

### 📝 要点测验

<details>
<summary>如何区分 feat 和 fix？</summary>

**判断标准：**

```
是在修复已有功能的问题吗？
├─ 是 → fix
└─ 否 → feat
```

**示例：**

```bash
# ✅ feat：新增功能
git commit -m "feat(user): 添加忘记密码功能"
# 之前没有这个功能，现在新增了

# ✅ fix：修复 bug
git commit -m "fix(user): 修复忘记密码邮件发送失败"
# 这个功能本来就有，但出问题了

# ✅ feat：功能增强
git commit -m "feat(login): 支持手机号登录"
# 虽然登录功能已存在，但这是新增的登录方式

# ✅ fix：功能修复
git commit -m "fix(login): 修复手机号登录验证码错误"
# 手机号登录已经有了，现在修复它的问题
```
</details>

<details>
<summary>refactor 和 chore 有什么区别？</summary>

**refactor（重构）：**
- 改变代码结构，但**不改变功能**
- 目的是提升代码质量、可维护性
- 涉及业务逻辑代码

```bash
# ✅ refactor 示例
git commit -m "refactor(auth): 将权限验证逻辑抽取为独立函数"
git commit -m "refactor(api): 统一错误处理方式"
git commit -m "refactor(user): 优化用户数据处理流程"
```

**chore（杂项）：**
- 不涉及业务逻辑
- 维护性工作（依赖更新、配置修改、构建脚本）

```bash
# ✅ chore 示例
git commit -m "chore(deps): 更新 vue 到 3.4.0"
git commit -m "chore: 添加 ESLint 配置"
git commit -m "chore: 更新 .gitignore 文件"
```

**记忆技巧：**
- **refactor**：改**代码**，不改功能
- **chore**：改**工具/配置**，不碰业务
</details>

---

## 总结：Git 核心命令速查表

| 分类 | 命令 | 作用 | 使用频率 |
|------|------|------|---------|
| **初始化** | `git clone <url>` | 克隆远程仓库 | ⭐⭐⭐ |
| | `git init` | 初始化本地仓库 | ⭐⭐ |
| **基础操作** | `git add .` | 添加所有修改 | ⭐⭐⭐⭐⭐ |
| | `git commit -m "..."` | 提交 | ⭐⭐⭐⭐⭐ |
| | `git push` | 推送到远程 | ⭐⭐⭐⭐⭐ |
| | `git pull` | 拉取远程更新 | ⭐⭐⭐⭐⭐ |
| **分支操作** | `git checkout -b <name>` | 创建并切换分支 | ⭐⭐⭐⭐ |
| | `git merge <branch>` | 合并分支 | ⭐⭐⭐⭐ |
| | `git branch -d <name>` | 删除分支 | ⭐⭐⭐ |
| **撤销操作** | `git reset HEAD^` | 撤销本地提交 | ⭐⭐⭐ |
| | `git revert <commit>` | 撤销远程提交 | ⭐⭐⭐ |
| **查看状态** | `git status` | 查看工作区状态 | ⭐⭐⭐⭐⭐ |
| | `git log` | 查看提交历史 | ⭐⭐⭐⭐ |
| | `git diff` | 查看修改内容 | ⭐⭐⭐ |

---

> **学习建议**
>
> * ⭐ 新手必会：add、commit、push、pull、status
> * ⭐ 进阶掌握：分支操作、merge、reset
> * ⭐ 团队协作：Commit 规范、revert、fetch
> * ⭐ 高级技巧：rebase、cherry-pick、stash
