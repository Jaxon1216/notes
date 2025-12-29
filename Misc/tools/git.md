## 初始化环境（先远程后本地）
```bash
git clone https://github.com/用户名/仓库名.git

# 3. 进入目录开始工作
cd 仓库名
# 添加文件、提交、推送...
```

## 修改远程仓库地址
- 查看远程仓库指向

```bash
git remote -v
```
## 节点操作
### 基础

  - `git commit`(创建并指向新的子节点) 与 parent 节点
  - `git branch`
  - `git branch` 加一个 `-a` 查看所有分支，按`q`退出
  - `git checkout`(换*)，简洁版本（`git checkout -b <your-branch-name>`）
  - `git merge`(差不多把对面分支连到自己身上，)
  - `git rebase` 对面(把自己搞个副本作为对面子级)
  - `git log` 查看历史提交记录,按q退出
  - `git remote -v` 查看关联仓库
  - `git add remote
### 进阶：

  - 分离 head：head, 直接 checkout 目前分支所指的记录，head 就指过去了
  - 相对引用：`checkout 目标^`（把目标移动到目标的父级, 或者 `～1`），感觉有点单向链表，结构体指针的味道，分支是命名指针，head 是指向指针的指针，commit 链就是单向链表
  - `git branch -f` (force) `main HEAD~3`：main 强制指向 (head 的父级上 3 个单位)，（不需要换过去分支，便捷）
  - `git reset HEAD~1`，回到父级，但是子级还在但是未加入暂存区，对于远程无效
  - `git revert HEAD` (当前*)，一个新的提交，引入了更改，状态与上上级相同，远程有效

### git pull

  - `git fetch`：只更新远程指针，不动你本地分支。从远处拿过来，
  - `git pull`：fetch + merge（最常用）
  - `git pull --rebase`：fetch + rebase（让你的提交排在远程节点后面）
  - `git push`：把你本地的节点推到远程（相当于反向传递链表）。


## 正确删除文件
- `git rm -r name` // remove, recursive 递归, 定位到根目录，name 直接从下一级开始。
## Git 分支配置与远程仓库 URL 不匹配
- 当看到推送目标与预期不符时，检查 git config branch.<分支名>.remote 配置
- 确保分支的远程仓库配置与 git remote -v 显示的 URL 一致
- 使用 git config --list | grep branch 可以快速查看所有分支配置


## 📋 Git Commit 类型详解表

| 类型 | 含义 | 使用场景 | 示例（带作用域） |
|------|------|----------|------------------|
| **feat** | 新功能 | 新增模块、页面、API接口、功能点 | `feat(login): 添加微信扫码登录`<br>`feat(user): 新增个人中心页面` |
| **fix** | 修复Bug | 修复代码错误、功能异常、逻辑问题 | `fix(payment): 修复支付宝支付失败`<br>`fix(ui): 修复按钮点击无效问题` |
| **docs** | 文档更新 | 更新README、API文档、代码注释、帮助文档 | `docs(readme): 更新项目安装步骤`<br>`docs(api): 添加用户接口文档` |
| **refactor** | 代码重构 | 优化代码结构、重命名变量、提取函数 | `refactor(auth): 重构权限验证逻辑`<br>`refactor(utils): 提取公共工具函数` |
| **style** | 代码样式 | 空格、缩进、分号、引号等不影响功能的格式调整 | `style(css): 调整全局样式格式`<br>`style(js): 统一使用单引号` |
| **perf** | 性能优化 | 减少加载时间、优化算法、减少内存使用 | `perf(image): 图片懒加载优化`<br>`perf(api): 优化数据库查询性能` |
| **test** | 测试相关 | 添加/修改单元测试、集成测试 | `test(login): 添加登录功能测试`<br>`test(user): 完善用户注册测试` |
| **chore** | 杂项任务 | 更新依赖包、修改配置文件、构建脚本 | `chore(deps): 更新axios到最新版本`<br>`chore(config): 修改数据库连接配置` |

---

## 🎯 **作用域示例说明**

### **括号里的作用域表示：**
1. **模块/组件**：`feat(user)`、`fix(payment)`
2. **文件类型**：`docs(api)`、`style(css)`
3. **功能区域**：`refactor(auth)`、`test(login)`
4. **技术栈**：`chore(deps)`、`build(webpack)`

### **实际工作流示例：**
```bash
# 早上开发新功能
git commit -m "feat(order): 添加订单评价功能"

# 下午修复bug  
git commit -m "fix(cart): 修复购物车数量计算错误"

# 晚上更新文档
git commit -m "docs(install): 添加Docker部署文档"
```

### **可以省略作用域的情况：**
```bash
# 跨模块的小修复
git commit -m "fix: 修复几个拼写错误"

# 整体文档更新
git commit -m "docs: 更新项目简介"

# 简单的工具更新
git commit -m "chore: 更新.gitignore文件"
```

---

**简单记：括号里是告诉别人"我在改哪个部分"**，比如`feat(user)`就是在用户模块加新功能，`fix(payment)`就是在支付模块修bug。