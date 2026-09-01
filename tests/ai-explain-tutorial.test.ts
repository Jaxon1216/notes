import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const page = fs.readFileSync(
  path.join(process.cwd(), 'content/docs/dev/tools/ai-explain.mdx'),
  'utf8',
)

describe('AI explanation tutorial images', () => {
  it('uses markdown images so Fumadocs can resolve files next to the article', () => {
    expect(page).not.toMatch(/<img\b[^>]*src=["']\.\/img\//)
    expect(page).toContain('](./img/ai-explain-selection-trigger.png)')
    expect(page).toContain('](./img/ai-explain-sidebar.png)')
  })
})
