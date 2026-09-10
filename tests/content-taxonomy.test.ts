import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { SITE_SECTIONS } from '../site.config'

const root = process.cwd()

describe('content taxonomy', () => {
  it('uses 教程、八股、面经 for frontend, backend and Agent', () => {
    for (const key of ['frontend', 'backend', 'agent']) {
      const section = SITE_SECTIONS.find((item) => item.key === key)

      expect(section?.children.map((item) => item.title)).toEqual([
        '教程',
        '八股',
        '面经',
      ])
      expect(section?.children.map((item) => item.dir)).toEqual([
        'tutorial',
        'bagu',
        'interview',
      ])
    }
  })

  it('keeps algorithms and resources as independent sections', () => {
    expect(SITE_SECTIONS.map((section) => section.key)).toEqual([
      'frontend',
      'backend',
      'agent',
      'algorithm',
      'resources',
      'dev',
    ])
    expect(
      SITE_SECTIONS.find((section) => section.key === 'resources')?.children,
    ).toEqual([])
  })

  it('removes the old knowledge and per-direction resource directories', () => {
    for (const section of ['frontend', 'backend', 'agent']) {
      expect(
        fs.existsSync(path.join(root, 'content/docs', section, 'knowledge')),
      ).toBe(false)
      expect(
        fs.existsSync(path.join(root, 'content/docs', section, 'resources')),
      ).toBe(false)
    }
  })

  it('keeps permanent redirects for previous public URLs', () => {
    const config = fs.readFileSync(path.join(root, 'next.config.mjs'), 'utf8')

    expect(config).toContain("source: '/docs/frontend/knowledge/:path*'")
    expect(config).toContain("destination: '/docs/frontend/tutorial/:path*'")
    expect(config).toContain("source: '/docs/backend/knowledge/:path*'")
    expect(config).toContain("destination: '/docs/backend/tutorial/:path*'")
    expect(config).toContain("source: '/docs/agent/knowledge/:path*'")
    expect(config).toContain("destination: '/docs/agent/bagu/:path*'")
    expect(config).toContain("destination: '/docs/resources'")
  })
})
