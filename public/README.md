# Public 静态资源目录

此目录用于存放 Next.js 直接公开访问的静态资源。

## Favicon

当前站点使用：

- `favicon.svg`：浏览器标签页使用的轻量矢量图标
- `site-icon.png`：Apple Touch Icon，固定为 `180x180` PNG；保留此路径以兼容旧引用

如需新增全站静态资源，放在本目录后可通过根路径访问，例如 `public/example.png` 对应 `/example.png`。
