'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef } from 'react'

const PAGINATION_SELECTOR = '.docs-pagination a[href]'

// Situation: 在页尾点击上一页/下一页时，App Router 会保留当前纵向位置。
// Task: 新文章应从开头阅读，同时不能破坏浏览器返回时的原阅读位置恢复。
// Action: 只记录分页链接的前进导航，并在目标路由渲染后同步回到页面顶部。
// Result: 翻页从文章开头开始；侧边栏跳转、锚点跳转和历史返回不受影响。
export function DocsPaginationScrollReset() {
  const pathname = usePathname()
  const pendingPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    function recordPaginationNavigation(event: MouseEvent) {
      if (
        event.button !== 0 ||
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return
      }

      const link = event.target.closest<HTMLAnchorElement>(PAGINATION_SELECTOR)

      if (!link || link.target) return

      const destination = new URL(link.href)

      if (destination.origin !== window.location.origin) return

      pendingPathnameRef.current = destination.pathname
    }

    document.addEventListener('click', recordPaginationNavigation, true)

    return () => {
      document.removeEventListener('click', recordPaginationNavigation, true)
    }
  }, [])

  useLayoutEffect(() => {
    if (pendingPathnameRef.current !== pathname) return

    pendingPathnameRef.current = null
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
