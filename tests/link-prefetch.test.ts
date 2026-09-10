import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { HomeHero } from '../components/home/home-hero'
import { SiteHeader } from '../components/site/site-header'
import { HOME_LOGO_ITEMS } from '../lib/home-visuals'

type LinkCall = {
  className?: string
  href?: string
  prefetch?: boolean
  role?: string
}

const linkCalls = vi.hoisted(() => [] as LinkCall[])

vi.mock('next/link', async () => {
  const { createElement: createMockElement } = await import('react')

  return {
    default: ({
      children,
      prefetch,
      ...props
    }: LinkCall & { children?: ReactNode }) => {
      linkCalls.push({ ...props, prefetch })
      return createMockElement('a', props, children)
    },
  }
})

vi.mock('next/image', async () => {
  const { createElement: createMockElement } = await import('react')

  return {
    default: ({
      priority: _priority,
      ...props
    }: {
      priority?: boolean
      [key: string]: unknown
    }) => createMockElement('img', props),
  }
})

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('@/components/home/particles-wrapper', () => ({
  ParticlesWrapper: () => null,
}))

vi.mock('@/components/site/site-search-trigger', () => ({
  SiteSearchTrigger: () => null,
}))

vi.mock('@/components/site/site-theme-switch', () => ({
  SiteThemeSwitch: () => null,
}))

function findByClass(className: string) {
  const links = linkCalls.filter((link) => link.className === className)

  expect(links.length, `missing Link with class ${className}`).toBeGreaterThan(0)
  return links
}

describe('route prefetch policy', () => {
  beforeEach(() => {
    linkCalls.length = 0
  })

  it('prefetches only the primary home action among visible home links', () => {
    renderToStaticMarkup(
      createElement(HomeHero, {
        data: { sections: [], totalFiles: 12, activeSections: 3 },
      }),
    )

    expect(findByClass('home-primary-action')).toMatchObject([{ prefetch: true }])
    expect(findByClass('home-topic-tag').every((link) => link.prefetch === false)).toBe(
      true,
    )
    expect(findByClass('home-secondary-action')).toMatchObject([
      { prefetch: false },
    ])
  })

  it('disables prefetch for original and duplicate internal logo links', () => {
    renderToStaticMarkup(
      createElement(HomeHero, {
        data: { sections: [], totalFiles: 12, activeSections: 3 },
      }),
    )

    const logoLinks = findByClass('logoloop__link')
    const internalLogoCount = HOME_LOGO_ITEMS.filter((item) =>
      item.href?.startsWith('/'),
    ).length

    expect(logoLinks.length).toBeGreaterThan(internalLogoCount)
    expect(logoLinks.length % internalLogoCount).toBe(0)
    expect(logoLinks.every((link) => link.prefetch === false)).toBe(true)
  })

  it('keeps primary header navigation at its default and defers low-frequency links', () => {
    renderToStaticMarkup(
      createElement(SiteHeader, {
        data: { sections: [], totalFiles: 0, activeSections: 0 },
      }),
    )

    expect(findByClass('site-header__brand')).toMatchObject([
      { href: '/', prefetch: undefined },
    ])
    expect(findByClass('site-header__ai-guide')).toMatchObject([
      { prefetch: false },
    ])
    expect(findByClass('site-header__contribute')).toMatchObject([
      { prefetch: false },
    ])
  })

  it('renders a section without children as a direct navigation link', () => {
    renderToStaticMarkup(
      createElement(SiteHeader, {
        data: {
          sections: [
            {
              section: {
                key: 'resources',
                dir: 'resources',
                title: '资源推荐',
                description: '精选技术资源。',
                children: [],
              },
              href: '/docs/resources',
              fileCount: 1,
              childCount: 0,
              children: [],
            },
          ],
          totalFiles: 1,
          activeSections: 1,
        },
      }),
    )

    expect(findByClass('site-header__nav-link')).toMatchObject([
      { href: '/docs/resources' },
    ])
  })
})
