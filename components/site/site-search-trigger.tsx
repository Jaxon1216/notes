'use client'

import { Search } from 'lucide-react'
import { useSearchContext } from 'fumadocs-ui/contexts/search'

export function SiteSearchTrigger() {
  const { setOpenSearch } = useSearchContext()

  return (
    <button
      className="site-header__search"
      type="button"
      aria-label="搜索文档"
      onClick={() => setOpenSearch(true)}
    >
      <Search aria-hidden="true" size={16} />
      <span>搜索</span>
      <kbd>⌘K</kbd>
    </button>
  )
}
