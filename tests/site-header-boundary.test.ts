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

  it('uses only the Fumadocs header on mobile docs pages', () => {
    const docsLayout = fs.readFileSync(
      path.join(root, 'app/docs/layout.tsx'),
      'utf8',
    )
    const styles = fs.readFileSync(path.join(root, 'app/global.css'), 'utf8')

    expect(docsLayout).toContain(
      "containerProps={{ className: 'docs-layout' }}",
    )
    expect(styles).toContain(
      '.docs-layout {\n  --fd-banner-height: var(--site-header-height);\n}',
    )
    expect(styles).toMatch(
      /@media \(width < 48rem\) \{\s+body:has\(\.docs-layout\) \.site-header \{\s+display: none;\s+\}\s+\.docs-layout \{\s+--site-header-height: 0px;\s+--fd-banner-height: 0px;\s+\}\s+\}/,
    )
  })

  it('does not close the menu inside Link onClick, so client navigation can finish', () => {
    const header = fs.readFileSync(
      path.join(root, 'components/site/site-header.tsx'),
      'utf8',
    )
    const menuLinks = header.match(/<Link[\s\S]*?<\/Link>/g) ?? []

    expect(menuLinks.length).toBeGreaterThan(0)
    expect(header).toContain("dispatch({ type: 'route-change' })")

    for (const link of menuLinks) {
      expect(link).not.toContain("type: 'close'")
    }
  })
})
