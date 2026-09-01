import {
  BookOpenText,
  ChevronDown,
  GitFork,
  GitPullRequestArrow,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

import { getHomeData } from '@/lib/content'
import { SiteSearchTrigger } from '@/components/site/site-search-trigger'
import { SiteThemeSwitch } from '@/components/site/site-theme-switch'

const CONTRIBUTION_HREF = '/docs/dev/conventions/open-source-contribution'

export function SiteHeader() {
  const data = getHomeData()

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="Easton Notes 首页">
          <span className="site-header__brand-mark">
            <BookOpenText aria-hidden="true" size={17} />
          </span>
          <span>Easton Notes</span>
        </Link>

        <nav className="site-header__nav" aria-label="主导航">
          {data.sections.map((section) => {
            const defaultChild =
              section.children.find((child) => child.child.key === 'knowledge') ??
              section.children[0]
            const href = defaultChild?.href || section.href || '/docs'

            return (
              <div className="site-header__nav-item" key={section.section.key}>
                <Link href={href}>
                  {section.section.navTitle ?? section.section.title}
                  <ChevronDown aria-hidden="true" size={14} />
                </Link>
                <div className="site-header__nav-menu">
                  {section.children.map((child) => (
                    <Link href={child.href || href} key={child.child.key}>
                      <span>{child.child.title}</span>
                      <small>
                        {child.fileCount > 0 ? `${child.fileCount} 篇` : '整理中'}
                      </small>
                    </Link>
                  ))}
                </div>
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
          <a
            className="site-header__icon"
            href="https://github.com/Jaxon1216/notes"
            aria-label="GitHub 仓库"
            rel="noreferrer"
            target="_blank"
          >
            <GitFork aria-hidden="true" size={18} />
          </a>
          <SiteThemeSwitch />
        </div>
      </div>
    </header>
  )
}
