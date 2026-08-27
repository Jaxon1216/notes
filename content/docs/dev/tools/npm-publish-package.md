# 如何发布 npm 包

这篇记录从一个最小 npm 包开始，走完初始化、编写代码、配置 `package.json`、发布前检查、正式发布和后续更新的流程。

## 创建项目并初始化

先创建项目目录，再执行 `npm init` 生成 `package.json`。

```bash
mkdir my-nailong
cd my-nailong
npm init -y
```

`npm init -y` 会使用默认值快速生成配置。后面可以手动修改 `name`、`version`、`description`、`main` 等字段。

## 编写项目代码

不同类型的包，目录结构会略有不同。核心思路是：源码放在 `src`，发布产物放在 `dist`，入口文件在 `package.json` 中声明清楚。

### 如果是前端 UI 组件类

常见目录结构：

```text
my-button/
├── src/
│   ├── Button.tsx
│   └── index.ts
├── dist/
├── package.json
├── tsconfig.json
└── README.md
```

通常需要关注：

- 是否同时输出 ESM 和 CommonJS。
- 是否把 `react`、`vue` 这类宿主框架放到 `peerDependencies`。
- 是否生成类型声明文件，例如 `dist/index.d.ts`。

### 如果是后端中间件类

npm 包常见于 Node.js 生态，例如 Express / Koa 中间件。

```text
my-middleware/
├── src/
│   └── index.ts
├── dist/
├── package.json
├── tsconfig.json
└── README.md
```

中间件类包要尽量保持依赖少、入口清晰，并在 README 中写明使用方式。

```js
const myMiddleware = require("my-middleware");

app.use(myMiddleware());
```

### 如果是脚本类

脚本类包通常会提供命令行入口，需要配置 `bin` 字段。

```text
my-cli/
├── bin/
│   └── my-cli.js
├── src/
│   └── index.js
├── package.json
└── README.md
```

`bin/my-cli.js` 第一行要加 shebang：

```js
#!/usr/bin/env node

console.log("hello cli");
```

shebang 就是文件第一行的 `#!...`。它告诉操作系统：当这个文件被当成命令直接执行时，应该用哪个解释器来运行它。

这里的 `#!/usr/bin/env node` 表示：去当前环境变量 `PATH` 里找到 `node`，然后用这个 `node` 执行脚本。这样比写死 `/usr/local/bin/node` 更稳，因为不同电脑上的 Node 安装路径可能不一样。

对应的 `package.json`：

```json
{
  "bin": {
    "my-cli": "./bin/my-cli.js"
  }
}
```

发布后别人就可以执行：

```bash
npx my-cli
```

### 如果是 skills 类

如果是给某个 Agent / CLI 系统使用的 skill 包，重点是把 skill 入口、说明文档、脚本和依赖约定写清楚。

```text
my-skill/
├── SKILL.md
├── reference/
├── scripts/
│   └── run.js
├── package.json
└── README.md
```

这类包除了能安装，还要让使用者知道：

- skill 的触发场景是什么。
- 需要哪些环境变量、命令行工具或权限。
- 入口文件或脚本应该如何调用。

## 编写 package.json

`package.json` 是 npm 包最重要的配置文件。一个最小可发布配置如下：

```json
{
  "name": "my-nailong",
  "version": "1.0.0",
  "description": "A simple nailong utility",
  "main": "index.js",
  "keywords": ["nailong", "promise", "utils"],
  "author": "你的名字",
  "license": "MIT"
}
```

`main` 表示这个包被别人 `require("my-nailong")` 时默认加载哪个入口文件。

例如包里有一个 `index.js`：

```js
function nailong(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = nailong;
```

并且 `package.json` 写了：

```json
{
  "main": "index.js"
}
```

那么使用者就可以这样引入：

```js
const nailong = require("my-nailong");
```

如果你的构建产物在 `dist/index.js`，那 `main` 通常就写成：

```json
{
  "main": "dist/index.js"
}
```

这里的 `name` 就是安装时使用的名字：

```bash
npm install my-nailong
```

### 包名规则

npm 包名主要分两种：

- 普通包名：例如 `lodash`、`vite`，需要在 npm 全站唯一。
- 作用域包名：例如 `@author/my-nailong`，属于某个用户或组织空间。

如果普通包名被占用，可以考虑使用作用域包名：

```json
{
  "name": "@your-name/my-nailong"
}
```

作用域包默认可能会被当成私有包发布。公开发布时需要加：

```bash
npm publish --access public
```

### 版本号规则

社区通常使用语义化版本号：`major.minor.patch`。

- `major`：不兼容的破坏性更新，例如 `1.0.0` 到 `2.0.0`。
- `minor`：向下兼容的新功能，例如 `1.0.0` 到 `1.1.0`。
- `patch`：向下兼容的问题修复，例如 `1.0.0` 到 `1.0.1`。

举几个例子：

- `patch`：修复 `nailong(1000)` 偶尔不 resolve 的 bug，用户不需要改代码，版本从 `1.0.0` 升到 `1.0.1`。
- `minor`：新增一个 `timeout(promise, ms)` 方法，老的 `nailong(ms)` 还能照常用，版本从 `1.0.0` 升到 `1.1.0`。
- `major`：把原来 `nailong(ms)` 的 CommonJS 用法改成只支持 ESM，用户必须从 `require("my-nailong")` 改成 `import nailong from "my-nailong"`，版本从 `1.0.0` 升到 `2.0.0`。

常用命令：

```bash
npm version patch
npm version minor
npm version major
```

这些命令会自动修改 `package.json` 中的版本号，并生成一个 Git tag。

### files 字段

`files` 字段非常重要，它决定哪些文件会被打进发布包。通常不要把源码草稿、测试快照、临时文件都发布出去。

```json
{
  "files": ["dist", "README.md", "LICENSE"]
}
```

如果包的入口是根目录的 `index.js`，也要包含进去：

```json
{
  "files": ["index.js", "README.md", "LICENSE"]
}
```

常见会自动包含的文件包括 `package.json`、`README`、`LICENSE`，但显式配置 `files` 更容易控制发布内容。

## 登录 npm

先在浏览器注册 npm 账号：

- npm 官网：<https://www.npmjs.com/>

然后在终端登录：

```bash
npm login
```

`npm login` 不是绑定某个项目目录的命令，本质上是在当前电脑保存 npm 登录态。可以在任意目录执行，但通常就在要发布的项目目录里执行，方便后续直接 `npm publish`。

### 选择公网 npm 还是内网 npm

登录和发布时真正要选择的是 `registry`，也就是包要发到哪个 npm 仓库。

- 发给所有人使用的开源包：登录公网 npm，使用官方 registry。
- 只给公司或团队内部使用的包：登录内网 npm / 私有 npm 仓库，使用公司提供的 registry。

可以先查看当前 npm 使用的是哪个 registry：

```bash
npm config get registry
```

公网 npm 官方地址通常是：

```bash
https://registry.npmjs.org/
```

登录公网 npm：

```bash
npm login --registry=https://registry.npmjs.org/
```

发布到公网 npm：

```bash
npm publish --registry=https://registry.npmjs.org/
```

内网 npm 的 registry 地址一般由公司或团队提供，例如：

```bash
https://npm.example.com/
```

登录内网 npm：

```bash
npm login --registry=https://npm.example.com/
```

发布到内网 npm：

```bash
npm publish --registry=https://npm.example.com/
```

如果一个项目固定发布到内网，推荐在项目根目录放 `.npmrc`，避免每次命令都手动带 `--registry`：

```ini
registry=https://npm.example.com/
```

如果只想让某个作用域包走内网，可以只配置这个 scope：

```ini
@your-team:registry=https://npm.example.com/
```

这样 `@your-team/xxx` 会走内网 registry，其他普通包仍然可以走默认 registry。

登录后可以检查当前用户：

```bash
npm whoami
```

## 发布前检查

正式发布前先检查会上传哪些文件：

```bash
npm pack --dry-run
```

重点看输出里的文件列表，确认没有把下面这些内容误发出去：

- `.env`、密钥、token。
- `node_modules`。
- 测试临时文件、截图、日志。
- 没有必要发布的源码草稿。

也可以本地打包一次：

```bash
npm pack
```

它会生成一个 `.tgz` 文件。可以在另一个临时项目中安装测试：

```bash
npm install ../my-nailong/my-nailong-1.0.0.tgz
```

## 正式发布

普通包发布：

```bash
npm publish
```

公开作用域包发布：

```bash
npm publish --access public
```

如果成功，会看到类似信息：

```text
+ my-nailong@1.0.0
```

然后别人就可以安装：

```bash
npm install my-nailong
```

如果发布的是 CLI 包，也可以执行：

```bash
npx my-cli
```

## 更新已发布的包

npm 不允许同一个包名和同一个版本号重复发布。修改代码后，需要先升级版本号，再发布。

```bash
npm version patch
npm publish
```

如果是作用域公开包：

```bash
npm version patch
npm publish --access public
```

## 常用命令

### npm version 相关

```bash
npm version patch  # 修复问题：1.0.0 -> 1.0.1
npm version minor  # 新增功能：1.0.0 -> 1.1.0
npm version major  # 破坏更新：1.0.0 -> 2.0.0
```

查看当前包信息：

```bash
npm view my-nailong
npm view my-nailong versions
```

取消发布要非常谨慎，npm 对已发布包的撤回有时间和依赖限制：

```bash
npm unpublish my-nailong@1.0.0
```

更常见的做法是废弃某个错误版本，并发布新版本：

```bash
npm deprecate my-nailong@1.0.0 "This version has a bug, please upgrade."
```

### 发布前检查

```bash
npm pack --dry-run
npm whoami
npm view my-nailong version
```
