import { describe, expect, it } from 'vitest'

import { frontmatterSchema } from '../lib/frontmatter'

describe('frontmatter schema', () => {
  it('keeps every project field optional for existing documents', () => {
    expect(frontmatterSchema.parse({})).toEqual({})
  })

  it('accepts valid shared and Fumadocs fields', () => {
    expect(
      frontmatterSchema.parse({
        title: 'Metadata 基础',
        description: '统一页面发现信息。',
        tags: ['Next.js', 'SEO'],
        status: 'published',
        updatedAt: '2026-09-10',
        featured: true,
        placeholder: false,
        icon: 'Search',
        full: true,
      }),
    ).toMatchObject({
      title: 'Metadata 基础',
      tags: ['Next.js', 'SEO'],
      status: 'published',
      updatedAt: '2026-09-10',
      featured: true,
      placeholder: false,
      icon: 'Search',
      full: true,
    })
  })

  it.each([
    ['empty title', { title: ' ' }],
    ['empty tags', { tags: [] }],
    ['empty tag', { tags: ['SEO', ''] }],
    ['unknown status', { status: 'private' }],
    ['invalid update date', { updatedAt: '2026-02-29' }],
    ['non-boolean featured flag', { featured: 'yes' }],
  ])('rejects %s', (_name, value) => {
    expect(frontmatterSchema.safeParse(value).success).toBe(false)
  })
})
