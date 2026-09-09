import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/source', () => ({
  source: {
    getPages: vi.fn(() => [
      { url: '/docs' },
      { url: '/docs/frontend/react' },
    ]),
  },
}))

import robots from '../app/robots'
import sitemap from '../app/sitemap'

describe('SEO discovery routes', () => {
  it('allows crawling and advertises the canonical sitemap location', () => {
    const result = robots()

    expect(result.rules).toEqual({
      userAgent: '*',
      allow: '/',
    })
    expect(new URL(result.sitemap as string).pathname).toBe('/sitemap.xml')
    expect(result.host).toBe(new URL(result.sitemap as string).origin)
  })

  it('lists the homepage and every page supplied by Fumadocs', () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname)

    expect(paths).toEqual(['/', '/docs', '/docs/frontend/react'])
  })
})
