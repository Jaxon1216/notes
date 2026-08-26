# 渲染与 Hydration

## 标题内链接导致 `<a>` 嵌套

- 现象：Console 报 `In HTML, <a> cannot be a descendant of <a>` 或 `a cannot contain a nested <a>`。
- 原因：Markdown 标题里写了 `[text](url)`，Fumadocs 标题组件又会给标题生成锚点链接。
- 处理：标题只保留纯文本，把链接移到标题下方普通段落。
- 检查：`rg -n "^#{1,6} .*\\[[^\\]]+\\]\\(" content/docs -g "*.md" -g "*.mdx"` 应无输出；必要时跑 `npm run docs:build`。
