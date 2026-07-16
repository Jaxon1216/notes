# Knowledge Site UI and Information Architecture Redesign

## Goal

Rework the current VitePress study-notes site into a clearer, directory-first technical knowledge base. The new site should make it fast to enter the right topic area, support future growth, and document a simple contribution path for curated resources.

## Decisions

- Use a mixed site identity: personal knowledge base plus a curated resource area.
- Redesign the homepage as a directory-first index, not a visual dashboard.
- Reorganize source files into English paths with Chinese display names.
- Do not preserve old article URLs after migration.
- Start with a minimal UI, while shaping the configuration so dynamic metadata such as counts or recent updates can be added later.

## New Information Architecture

The source tree should use stable English directory names:

```text
frontend/
  knowledge/
  interview/
  resources/

backend/
  knowledge/
  interview/
  resources/

agent/
  knowledge/
  interview/
  resources/

dev/
  conventions/
  linux/
  git/
  tools/
  notes/
```

The UI should render these paths with Chinese display names:

```text
前端
  知识八股
  面经
  优质好文项目

服务端
  知识八股
  面经
  优质好文项目

Agent 应用开发
  知识八股
  面经
  优质好文项目

个人开发常用
  开发规范
  Linux 常用命令
  Git 基础
  工具配置
  随手记
```

## Content Migration Rules

Existing content should be moved conservatively:

- `Frontend/Knowledge/**` -> `frontend/knowledge/**`
- `Frontend/Handwrite/**` -> `frontend/knowledge/handwrite/**`
- `Frontend/Project/**` -> `frontend/resources/projects/**`
- `Misc/interview/**` -> `frontend/interview/**` unless a file is clearly cross-domain.
- `Misc/tools/Linux.md` -> `dev/linux/linux.md`
- `Misc/tools/git.md` -> `dev/git/git.md`
- `Misc/tools/docker.md` -> `dev/tools/docker.md`
- `Misc/tools/markdwon.md` -> `dev/tools/markdown.md`
- `Misc/tools/lexicon.md` -> `dev/notes/lexicon.md`
- `Misc/tricks/**` -> `dev/notes/**`
- `Misc/articles/algorithm/**` and `Leetcode/**` can stay under a dedicated `algorithm` area only if added to the approved IA later. For this first implementation, either place them under `dev/notes/algorithm/` or leave them unmigrated and out of the main nav. Prefer the smaller route that keeps the first UI redesign focused.
- `MathModelAgent/**` should not be silently folded into the new nav. It should become `agent/resources/math-model-agent/**` only if the content is intended for the public Agent section.

Because old URLs do not need compatibility, moved files do not require redirects.

## Homepage Design

The homepage should be a compact directory index.

Top section:

- Site title.
- One-sentence positioning: "面向前端、服务端与 Agent 应用开发的个人技术知识库。"
- No terminal animation, large hero illustration, or decorative dashboard visuals.

Main section:

- Four primary blocks: 前端, 服务端, Agent 应用开发, 个人开发常用.
- Each block contains its child categories as direct links.
- Each block has a short description that explains when to enter it.
- The layout should be scannable on desktop and mobile:
  - Desktop: two-column grid or four balanced blocks depending on available width.
  - Mobile: single-column stacked blocks.

Contribution entry:

- Keep contribution guidance low-emphasis on the homepage.
- For `resources` categories, include a short label such as "欢迎通过 PR 补充优质文章和项目".
- Put detailed contribution instructions in `README.md`.

## Visual Style

Use a quiet documentation style:

- Prefer white or near-white surfaces with clear borders.
- Keep border radius at 8px or less for cards and panels.
- Use restrained accent colors rather than gradient-heavy decoration.
- Keep typography compact and readable.
- Preserve dark mode support through VitePress variables.
- Avoid nested cards and oversized marketing sections.

## Configuration Model

Replace duplicated directory constants with one shared section model used by nav, sidebar, and homepage generation.

The model should contain:

- `key`: stable identifier, such as `frontend`.
- `dir`: source directory.
- `title`: Chinese display title.
- `description`: short homepage description.
- `children`: ordered category definitions.

Example shape:

```ts
type SiteSection = {
  key: string
  dir: string
  title: string
  description: string
  children: Array<{
    key: string
    dir: string
    title: string
    description: string
  }>
}
```

The implementation can keep this in a CommonJS-compatible module if both `.vitepress/config.mts` and `scripts/generate-dashboard.cjs` need to consume it.

## README Requirements

Update `README.md` so a new contributor can understand:

- How to run locally: `npm run docs:dev`.
- How to build: `npm run docs:build`.
- Where to add new notes.
- How to add a curated resource:
  - Choose the matching direction, such as `frontend/resources/`.
  - Add a Markdown file with title, link, reason for recommendation, and tags.
  - Open a PR with a clear title.
- What not to add:
  - Duplicated low-quality link dumps.
  - Content without a short recommendation reason.
  - Files outside the approved directory structure unless the IA is updated first.

## Non-Goals

- No old URL redirect compatibility.
- No database or CMS.
- No dynamic runtime content loading.
- No major visual mockup system.
- No complex contribution automation in this pass.

## Validation

After implementation:

- `npm run docs:build` should pass.
- Homepage should show the four primary sections and their child entries.
- Main nav and sidebar should use the new English directories with Chinese display names.
- README should describe the new contribution flow.
- Existing staged `MathModelAgent` changes should not be reverted or accidentally unstaged unless intentionally migrated as part of the approved implementation plan.
