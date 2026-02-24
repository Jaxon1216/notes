## 开机自启动占用端口

### 习惯开启
`https_proxy=http://127.0.0.1:7897 http_proxy=http://127.0.0.1:7897 openclaw gateway --force`
### 现在已经
1. openclaw gateway stop — 停止 LaunchAgent 服务
2. launchctl bootout — 从系统中卸载
3. 删除了 plist 文件 (~/Library/LaunchAgents/ai.openclaw.gateway.plist) — 防止开机自动加载
以后注意：

- 你习惯在终端手动启动 gateway，就不要再跑 openclaw gateway install 或在 doctor 里选 "Yes" 更新 gateway service config

- 如果以后又出现这个错误，直接跑 launchctl bootout gui/$(id -u)/ai.openclaw.gateway && rm ~/Library/LaunchAgents/ai.openclaw.gateway.plist 就行