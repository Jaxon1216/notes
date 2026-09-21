'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef } from 'react'

// Situation: 在 /docs 内通过侧边栏、翻页、面包屑或正文互链跳转时，App Router 会保留当前纵向位置，
//   读者点开新文章却停在半中间，而不是从开头读起。旧实现只覆盖页尾翻页链接。
// Task: 让站内前进式跳转都回到顶部，同时不破坏浏览器返回时的原阅读位置，也不影响锚点跳转。
// Action: 捕获站内链接点击并记录目标路径；带锚点或指向当前页的链接跳过，仅在目标渲染完成且这次跳转确实来自点击时滚回顶部。
// Result: 侧边栏、翻页、面包屑、搜索结果和正文互链都从文章开头开始；历史返回和锚点跳转不受影响。
export function DocsScrollReset() {
  const pathname = usePathname()
  const pendingPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    function recordNavigation(event: MouseEvent) {
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

      const link = event.target.closest<HTMLAnchorElement>('a[href]')

      if (!link || link.target) return

      const destination = new URL(link.href)

      if (destination.origin !== window.location.origin) return
      // 带锚点的链接交给浏览器/Next 跳到对应标题，不强制回到顶部。
      if (destination.hash) return
      // 指向当前页自身（无锚点）时没有需要重置的滚动位置。
      if (destination.pathname === window.location.pathname) return

      pendingPathnameRef.current = destination.pathname
    }

    document.addEventListener('click', recordNavigation, true)

    return () => {
      document.removeEventListener('click', recordNavigation, true)
    }
  }, [])

  useLayoutEffect(() => {
    if (pendingPathnameRef.current !== pathname) return

    pendingPathnameRef.current = null
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
