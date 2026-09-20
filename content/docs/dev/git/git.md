# Git 常用命令速查

面向日常开发的极简 Git 手册，只保留高频命令：提交、同步、分支、合并。规范化的 commit message 约定见 [开源贡献规范](../conventions/open-source-contribution.md)。

## 工作流概览

```text
工作区（Working Directory）
    ↓ git add
暂存区（Staging Area）
    ↓ git commit
本地仓库（Local Repository）
    ↕ git push / git pull（git fetch + merge）
远程仓库（Remote Repository）
```

## 提交：add / commit

```bash
# 添加到暂存区
git add .                 # 全部改动
git add index.html app.js # 指定文件
git add -p                # 交互式选择片段

# 提交到本地仓库
git commit -m "feat: 添加登录功能"
git commit -am "fix: 修复注册校验"   # add + commit，仅对已跟踪文件有效
git commit --amend -m "修正后的信息"  # 修改最近一次提交（勿对已推送的提交使用）
```

## 同步：push / pull / fetch

```bash
# 推送
git push                        # 推送到已关联的上游分支
git push -u origin main         # 首次推送并设置上游，之后直接 git push

# 拉取
git pull                        # = git fetch + git merge
git pull --rebase               # = git fetch + git rebase，保持提交线性

# 只下载不合并，先看再决定
git fetch origin
git log origin/main             # 查看远程新提交
git merge origin/main           # 确认无误后再合并
```

`git fetch` 只更新远程跟踪分支（如 `origin/main`），不动本地分支，最安全；`git pull` 是「fetch + 合并」的快捷方式，可能触发冲突。

## 分支：branch / checkout

```bash
# 查看
git branch                      # 本地分支，* 为当前分支
git branch -a                   # 含远程分支

# 创建 / 切换
git branch feature-login        # 只创建，不切换
git checkout feature-login      # 切换分支
git checkout -b feature-login   # 创建并切换（最常用）

# 基于远程分支创建本地分支并建立跟踪关系
git checkout -t origin/feature-login
# 等价于 git checkout -b feature-login origin/feature-login
# 之后该分支的 git pull / git push 会自动对应 origin/feature-login

# 删除
git branch -d feature-login     # 删除已合并分支
git branch -D feature-login     # 强制删除（未合并）
```

> `git checkout -t`（`--track`）用于「远程有、本地还没有」的分支：拉一份到本地并绑定上游，省去手动 `-u` 设置。新版 Git 也可以用 `git switch -c feature-login origin/feature-login` 或直接 `git switch feature-login`（自动跟踪同名远程分支）。

## 合并：merge / rebase

```bash
# merge：把目标分支合并进当前分支，保留分叉历史
git checkout main
git merge feature-login         # 产生一个合并提交

# rebase：把当前分支的提交“搬”到目标分支最新提交之后，历史线性
git checkout feature-login
git rebase main
```

| | merge | rebase |
|---|---|---|
| 历史 | 保留分叉，有合并提交 | 线性，无多余合并提交 |
| 适用 | 公共分支、需要保留合并记录 | 个人分支整理、同步主干 |
| 风险 | 历史较乱 | 改写提交哈希，**已推送的分支慎用** |

冲突处理：解决冲突文件后 `git add`，merge 用 `git commit` 完成，rebase 用 `git rebase --continue` 继续（放弃用 `git rebase --abort`）。

## 推荐插件：Git Graph

VS Code 扩展 [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)：在侧边栏可视化提交历史与分支走向，点选提交即可查看 diff、创建分支、cherry-pick、merge/rebase，比命令行更直观地理解分支结构。安装后在源代码管理面板或命令面板执行 `Git Graph: View Git Graph` 打开。
