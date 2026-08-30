import { GitBranch, GitPullRequestArrow } from 'lucide-react'
import Link from 'next/link'

import { getHomeData } from '@/lib/content'

const CONTRIBUTION_HREF = '/docs/dev/conventions/open-source-contribution'

export function SiteHeader() {
  const data = getHomeData()

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="Easton Notes 首页">
          <span className="site-header__brand-mark">EN</span>
          <span>Easton Notes</span>
        </Link>

        <nav className="site-header__nav" aria-label="主导航">
          <Link href="/docs">Docs</Link>
          {data.sections.map((section) => (
            <Link href={section.href || '/docs'} key={section.section.key}>
              {section.section.navTitle ?? section.section.title}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link className="site-header__contribute" href={CONTRIBUTION_HREF}>
            <GitPullRequestArrow aria-hidden="true" size={16} />
            <span>开源贡献</span>
          </Link>
          <a
            className="site-header__icon"
            href="https://github.com/Jaxon1216/cpp-notes"
            aria-label="GitHub 仓库"
            rel="noreferrer"
            target="_blank"
          >
            <GitBranch aria-hidden="true" size={18} />
          </a>
        </div>
      </div>
    </header>
  )
}
