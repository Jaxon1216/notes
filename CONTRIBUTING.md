# 贡献指南

感谢你参与 Easton Notes。提交内容前，请先确认改动符合当前信息架构和写作规范。

## 开始之前

- 阅读 [写作规范](docs/writing-style.md) 和 [PR 规范](docs/pull-request.md)。
- 使用 AI 整理面经、八股或资源时，同时阅读 [AI 协作贡献规范](docs/ai-contribution.md)。
- 一个分支和一个 PR 只处理一个主题，不混入无关重构或格式化。

## 提交流程

1. 从最新的 `main` 创建分支，例如 `docs/react-hooks`、`feat/search` 或 `fix/broken-link`。
2. 安装依赖：`npm ci`。
3. 按仓库目录和现有风格完成改动。
4. 运行与改动范围对应的检查。
5. 使用 Conventional Commits 提交，例如 `docs(react): add hooks notes`。
6. 推送分支并创建 PR，填写关联 Issue、影响范围和实际验证结果。

协作者默认通过功能分支和 PR 提交改动。仓库管理员可以直接处理低风险的小改；涉及共享功能、路由、构建链路或协作规则时，仍建议通过 PR 接受 Review。

## 本地检查

普通内容改动至少运行：

```bash
npm run check:content
npm run check:images
npm run build
```

代码、配置、构建链路或较大范围的改动运行：

```bash
npm run validate
```

如果某项检查无法运行，请在 PR 的“验证结果”中说明原因和替代验证方式。

## 内容要求

- 教程、八股、面经和开发笔记放入 `content/docs/` 下最贴近的栏目。
- 资源推荐维护在 `lib/resource-directory.ts`，页面入口位于 `content/docs/resources/`。
- 新目录同步维护 `meta.json`，并确认侧边栏顺序。
- 图片放在当前专题附近的 `img/` 目录，正文使用相对路径。
- 提交前检查事实准确性、内容来源、版权和敏感信息。
- 不提交密钥、个人隐私、构建产物或与本次改动无关的文件。

## License

提交贡献即表示你同意以仓库的 [MIT License](LICENSE) 发布该贡献。
