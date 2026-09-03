'use client'

import {
  ChevronDown,
  GitPullRequestArrow,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { SiteSearchTrigger } from '@/components/site/site-search-trigger'
import { SiteThemeSwitch } from '@/components/site/site-theme-switch'
import type { HomeData } from '@/lib/content'
import {
  getActiveSectionKey,
  reduceNavigationState,
  type NavigationEvent,
  type NavigationState,
} from '@/lib/site-navigation'

const CONTRIBUTION_HREF = '/docs/dev/conventions/open-source-contribution'

export function SiteHeader({ data }: { data: HomeData }) {
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const [navigation, setNavigation] = useState<NavigationState>({
    openSectionKey: null,
    pinnedSectionKey: null,
  })
  const activeSectionKey = getActiveSectionKey(pathname)

  function dispatch(event: NavigationEvent) {
    setNavigation((state) => reduceNavigationState(state, event))
  }

  useEffect(() => {
    dispatch({ type: 'route-change' })
  }, [pathname])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') dispatch({ type: 'close' })
    }

    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        dispatch({ type: 'close' })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  return (
    <header className="site-header" ref={headerRef}>
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="Easton Notes 首页">
          <span className="site-header__brand-mark">
            <Image
              src="/brand-icon.jpg"
              alt=""
              width={34}
              height={34}
              priority
            />
          </span>
          <span>Easton Notes</span>
        </Link>

        <nav className="site-header__nav" aria-label="主导航">
          {data.sections.map((section) => {
            const defaultChild =
              section.children.find((child) => child.child.key === 'knowledge') ??
              section.children[0]
            const href = defaultChild?.href || section.href || '/docs'
            const menuId = `site-menu-${section.section.key}`
            const isOpen = navigation.openSectionKey === section.section.key
            const isActive = activeSectionKey === section.section.key

            return (
              <div
                className="site-header__nav-item"
                data-active={isActive || undefined}
                data-open={isOpen || undefined}
                key={section.section.key}
                onBlur={(event) => {
                  const next = event.relatedTarget as Node | null
                  if (next && !event.currentTarget.contains(next)) {
                    dispatch({ type: 'close' })
                  }
                }}
                onPointerEnter={() =>
                  dispatch({ type: 'open', key: section.section.key })
                }
                onPointerLeave={() => dispatch({ type: 'leave' })}
              >
                <button
                  type="button"
                  aria-controls={menuId}
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  onClick={() => dispatch({ type: 'pin', key: section.section.key })}
                  onFocus={() => dispatch({ type: 'open', key: section.section.key })}
                >
                  {section.section.navTitle ?? section.section.title}
                  <ChevronDown aria-hidden="true" size={14} />
                </button>
                {isOpen ? (
                  <div className="site-header__nav-menu-shell">
                    <div id={menuId} role="menu" className="site-header__nav-menu">
                      {section.children.map((child) => (
                        <Link
                          href={child.href || href}
                          key={child.child.key}
                          role="menuitem"
                        >
                          <span>{child.child.title}</span>
                          <small>
                            {child.fileCount > 0 ? `${child.fileCount} 篇` : '整理中'}
                          </small>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>

        <div className="site-header__actions">
          <Link className="site-header__ai-guide" href="/docs/dev/tools/ai-explain">
            <Sparkles aria-hidden="true" size={15} />
            <span>AI 解答</span>
            <i>新</i>
          </Link>
          <SiteSearchTrigger />
          <Link className="site-header__contribute" href={CONTRIBUTION_HREF}>
            <GitPullRequestArrow aria-hidden="true" size={16} />
            <span>参与文档贡献</span>
          </Link>
          <SiteThemeSwitch />
        </div>
      </div>
    </header>
  )
}
