import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const root = process.cwd()

describe('site header rendering boundary', () => {
  it('keeps filesystem-backed navigation data in the server layout', () => {
    const header = fs.readFileSync(
      path.join(root, 'components/site/site-header.tsx'),
      'utf8',
    )
    const layout = fs.readFileSync(path.join(root, 'app/layout.tsx'), 'utf8')

    expect(header).not.toContain("import { getHomeData } from '@/lib/content'")
    expect(header).not.toContain('const data = getHomeData()')
    expect(layout).toContain("import { getHomeData } from '@/lib/content'")
    expect(layout).toContain('const homeData = getHomeData()')
    expect(layout).toContain('<SiteHeader data={homeData} />')
  })
})
