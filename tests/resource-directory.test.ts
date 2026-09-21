import { describe, expect, it } from 'vitest'

import {
  RESOURCE_ENTRIES,
  RESOURCE_KIND_LABELS,
  filterResourceEntries,
  validateResourceDirectory,
} from '../lib/resource-directory'
import { FRIEND_LINKS, validateFriendLinks } from '../lib/friend-links'

describe('resource directories', () => {
  it('defines a focused set of resource collections', () => {
    expect(Object.keys(RESOURCE_KIND_LABELS).sort()).toEqual([
      'blog',
      'project',
      'tool',
    ])
  })

  it('includes structured blog content and validates the shared fields', () => {
    expect(RESOURCE_ENTRIES).toEqual([
      expect.objectContaining({
        title: '江旭的技术博客',
        href: 'https://www.jiangxu.net/blog',
        kind: 'blog',
      }),
    ])
    expect(validateResourceDirectory(RESOURCE_ENTRIES)).toEqual([])
    expect(
      validateResourceDirectory([
        {
          title: '',
          scenario: '',
          description: '',
          href: 'http://example.com',
          kind: 'blog',
        },
      ]),
    ).toEqual([
      'resources[0] 缺少 title',
      'resources[0] 缺少 scenario',
      'resources[0] 缺少 description',
      'resources[0] 缺少 HTTPS href',
    ])
  })

  it('filters a collection by its fixed page type', () => {
    const entries = [
      {
        title: '博客',
        scenario: '长期订阅',
        description: '技术博客。',
        href: 'https://blog.example.com',
        kind: 'blog' as const,
      },
      {
        title: '工具',
        scenario: '日常开发',
        description: '开发工具。',
        href: 'https://tool.example.com',
        kind: 'tool' as const,
      },
    ]

    expect(filterResourceEntries(entries, 'blog')).toEqual([entries[0]])
    expect(filterResourceEntries(entries, 'project')).toEqual([])
  })

  it('keeps friend links as the same structured collection', () => {
    expect(FRIEND_LINKS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Magic Resume',
          href: 'https://magic-resume.cn',
          trackingEvent: 'magic_resume_link_click',
        }),
      ]),
    )
    expect(validateFriendLinks(FRIEND_LINKS)).toEqual([])
    expect(
      validateFriendLinks([
        { title: '', scenario: '', href: 'http://example.com', description: '' },
      ]),
    ).toEqual([
      'friendLinks[0] 缺少 title',
      'friendLinks[0] 缺少 scenario',
      'friendLinks[0] 缺少 description',
      'friendLinks[0] 缺少 HTTPS href',
    ])
  })
})
