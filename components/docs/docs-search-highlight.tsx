'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import {
  SEARCH_HIGHLIGHT_EVENT,
  SEARCH_HIGHLIGHT_NAME,
  SEARCH_HIGHLIGHT_STORAGE_KEY,
  matchOffsets,
  normalizeSearchText,
  parseSearchHighlightRequest,
  samePathname,
  snippetNeedle,
  type SearchHighlightRequest,
} from '@/lib/search-highlight'

const MAX_RANGES = 100
const APPLY_TIMEOUT_MS = 4000

// Situation: 搜索结果只带标题锚点，点进去后停在小节标题，正文里的命中词没有颜色。
// Task: 客户端跳转到目标文档后，只标出被点击的那一条结果，并滚到它。
// Action: 用结果原文在对应标题小节里找到那一段，只给这段里的查询词上色。
// Result: 读者看到自己点的那一句；同一页里的其他命中保持原样。离开该页后高亮消失。
export function DocsSearchHighlight() {
  const pathname = usePathname()

  useEffect(() => {
    let stopped = false
    let observer: MutationObserver | null = null
    let frame = 0
    let timeout = 0
    let paintedId: number | null = null
    const scrollTimers: number[] = []

    function clearHighlight() {
      if (!('highlights' in CSS)) return
      CSS.highlights.delete(SEARCH_HIGHLIGHT_NAME)
    }

    function readRequest(): SearchHighlightRequest | null {
      const raw = sessionStorage.getItem(SEARCH_HIGHLIGHT_STORAGE_KEY)
      if (!raw) return null

      const request = parseSearchHighlightRequest(raw)
      if (!request) {
        sessionStorage.removeItem(SEARCH_HIGHLIGHT_STORAGE_KEY)
        return null
      }

      return request
    }

    function dropRequest(requestId?: number) {
      const current = readRequest()
      if (!current) return
      if (requestId !== undefined && current.id !== requestId) return
      sessionStorage.removeItem(SEARCH_HIGHLIGHT_STORAGE_KEY)
    }

    function schedule() {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        attempt()
      })
    }

    function scheduleDrop(requestId: number, delay: number) {
      window.clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        timeout = 0
        observer?.disconnect()
        observer = null
        dropRequest(requestId)
      }, delay)
    }

    function watchForContent(requestId: number) {
      if (!observer) {
        observer = new MutationObserver(schedule)
        observer.observe(document.body, { childList: true, subtree: true })
      }

      scheduleDrop(requestId, APPLY_TIMEOUT_MS)
    }

    function attempt(dropIfForeign = false) {
      if (stopped) return

      const request = readRequest()
      if (!request) return
      if (!samePathname(request.pathname, pathname, window.location.origin)) {
        if (dropIfForeign) dropRequest(request.id)
        return
      }
      if (paintedId === request.id) return

      const ranges = collectRanges(request)
      if (ranges.length === 0) {
        watchForContent(request.id)
        return
      }

      paintHighlights(ranges)
      for (const timer of scrollTimers) window.clearTimeout(timer)
      scrollTimers.length = 0
      for (const delay of [80, 280]) {
        scrollTimers.push(window.setTimeout(() => scrollToRange(ranges[0]), delay))
      }
      paintedId = request.id
      observer?.disconnect()
      observer = null
      // 等本次 effect 的严格模式重放结束再清掉请求，避免开发环境把高亮清掉后无法再画上。
      scheduleDrop(request.id, 0)
    }

    const style = document.createElement('style')
    style.dataset.searchHighlight = SEARCH_HIGHLIGHT_NAME
    const syncStyle = () => {
      style.textContent = highlightStyle()
    }
    syncStyle()
    document.head.appendChild(style)
    const themeObserver = new MutationObserver(syncStyle)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    attempt(true)
    const onRemember = () => attempt(false)
    window.addEventListener(SEARCH_HIGHLIGHT_EVENT, onRemember)

    return () => {
      stopped = true
      observer?.disconnect()
      themeObserver.disconnect()
      style.remove()
      window.clearTimeout(timeout)
      window.cancelAnimationFrame(frame)
      for (const timer of scrollTimers) window.clearTimeout(timer)
      window.removeEventListener(SEARCH_HIGHLIGHT_EVENT, onRemember)
      clearHighlight()
    }
  }, [pathname])

  return null
}

const BLOCK_SELECTOR = 'p, li, blockquote, pre, td, th, summary, h1, h2, h3, h4, h5, h6'

function collectRanges(request: SearchHighlightRequest): Range[] {
  const content = findContent(request.pathname)
  if (!content) return []

  const target = findHighlightTarget(content, request)
  if (!target) return []

  const ranges: Range[] = []
  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue) return NodeFilter.FILTER_REJECT
      const parent = node.parentElement
      if (!parent || parent.closest('button, script, style, noscript')) {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })

  let current = walker.nextNode()
  while (current && ranges.length < MAX_RANGES) {
    const text = current.nodeValue ?? ''
    for (const offset of matchOffsets(text, request.terms)) {
      const range = document.createRange()
      range.setStart(current, offset.start)
      range.setEnd(current, offset.end)
      ranges.push(range)
      if (ranges.length >= MAX_RANGES) break
    }
    current = walker.nextNode()
  }

  return ranges
}

function findHighlightTarget(
  content: HTMLElement,
  request: SearchHighlightRequest,
): HTMLElement | null {
  const article = content.closest('article')
  const heading = request.hash ? document.getElementById(request.hash) : null

  if (request.kind === 'heading' && heading instanceof HTMLElement) return heading

  if (request.kind === 'page') {
    // 正文自带一级标题时不会再渲染 DocsTitle，标题在内容区里。
    const title = article?.querySelector(':scope > h1') ?? content.querySelector('h1')
    return title instanceof HTMLElement ? title : null
  }

  const scopes: Element[] =
    heading instanceof HTMLElement ? sectionNodes(heading) : [content]
  const needle = snippetNeedle(request.snippet, request.terms)
  if (!needle) return heading instanceof HTMLElement ? heading : null

  let best: HTMLElement | null = null
  for (const scope of scopes) {
    const candidates: Element[] = []
    if (scope.matches(BLOCK_SELECTOR)) candidates.push(scope)
    candidates.push(...scope.querySelectorAll(BLOCK_SELECTOR))

    for (const candidate of candidates) {
      if (!(candidate instanceof HTMLElement)) continue
      const text = normalizeSearchText(candidate.textContent ?? '')
      if (!text.includes(needle)) continue
      if (!best || text.length < normalizeSearchText(best.textContent ?? '').length) {
        best = candidate
      }
    }
  }

  return best
}

function sectionNodes(heading: HTMLElement): Element[] {
  const level = headingLevel(heading) ?? 6
  const nodes: Element[] = [heading]
  let sibling = heading.nextElementSibling

  while (sibling) {
    const siblingLevel = headingLevel(sibling)
    if (siblingLevel !== null && siblingLevel <= level) break
    nodes.push(sibling)
    sibling = sibling.nextElementSibling
  }

  return nodes
}

function headingLevel(element: Element): number | null {
  const match = /^H([1-6])$/.exec(element.tagName)
  return match ? Number(match[1]) : null
}

function findContent(pathname: string) {
  for (const node of document.querySelectorAll<HTMLElement>('[data-ai-doc-content]')) {
    const pagePath = node.dataset.pagePath
    if (pagePath && samePathname(pagePath, pathname, window.location.origin)) return node
  }

  return null
}

function highlightStyle() {
  const dark = document.documentElement.classList.contains('dark')
  const color = dark ? '#60a5fa' : '#2563eb'
  const amount = dark ? '42%' : '34%'

  return `::highlight(${SEARCH_HIGHLIGHT_NAME}) { background-color: color-mix(in srgb, ${color} ${amount}, transparent); color: inherit; }`
}

function paintHighlights(ranges: Range[]) {
  if (ranges.length === 0 || !('highlights' in CSS) || typeof Highlight === 'undefined') return

  CSS.highlights.set(SEARCH_HIGHLIGHT_NAME, new Highlight(...ranges))
}

function scrollToRange(range: Range) {
  const rect = range.getBoundingClientRect()
  if (rect.height === 0 && rect.width === 0) return

  const topInset = topObstruction() + 20
  const bottomInset = 24
  if (rect.top >= topInset && rect.bottom <= window.innerHeight - bottomInset) return

  const top = window.scrollY + rect.top - topInset
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'

  window.scrollTo({ top: Math.max(0, top), behavior })
}

function topObstruction() {
  let bottom = 0

  for (const node of document.body.querySelectorAll('*')) {
    if (!(node instanceof HTMLElement)) continue

    const style = getComputedStyle(node)
    if (style.position !== 'sticky' && style.position !== 'fixed') continue
    if (style.display === 'none' || style.visibility === 'hidden') continue

    const rect = node.getBoundingClientRect()
    // 只避开贴在视口顶部的横条。侧栏也是 sticky，但高度很大，不能拿来当正文上边距。
    if (rect.height <= 0 || rect.height > 160 || rect.top > 120 || rect.bottom <= 0) continue
    if (rect.width < window.innerWidth * 0.6) continue

    bottom = Math.max(bottom, rect.bottom)
  }

  return bottom
}
