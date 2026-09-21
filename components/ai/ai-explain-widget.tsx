'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { AiQuote } from '@/lib/ai/config'

import { appendToQuote, getCombinedQuoteLength } from './ai-quote'
import { AiSelectionTrigger } from './ai-selection-trigger'
import { useTextSelection, type TextSelectionState } from './use-text-selection'

// Situation: 侧栏依赖 @ai-sdk/react、react-markdown 和 rehype-highlight，静态引入会把
//            这些库打进每个文档页首屏，但多数访客从不触发 AI，移动端更是完全不显示。
// Task: 把重型依赖移出文档页首屏 bundle，同时保证桌面用户点开侧栏时几乎无感。
// Action: 用 next/dynamic(ssr:false) 懒加载侧栏，仅在打开时挂载；出现划词选区即预取 chunk。
// Result: 文档页 First Load JS 下降，AI 相关代码只在真正需要时按需加载。
const loadSidebar = () => import('./ai-explain-sidebar')

const AiExplainSidebar = dynamic(
  () => loadSidebar().then((mod) => mod.AiExplainSidebar),
  { ssr: false },
)

function preloadSidebar() {
  void loadSidebar()
}

function createQuote(text: string): AiQuote {
  return {
    id: `${Date.now()}-${text.length}`,
    text,
    pageTitle: document.title,
    pageUrl: window.location.pathname,
  }
}

function createSelectionKey(selection: TextSelectionState) {
  if (!selection.text || !selection.rect) return ''

  return [
    selection.text,
    Math.round(selection.rect.top),
    Math.round(selection.rect.left),
    Math.round(selection.rect.width),
    Math.round(selection.rect.height),
  ].join(':')
}

export function AiExplainWidget() {
  const pathname = usePathname()
  const selection = useTextSelection()
  const [open, setOpen] = useState(false)
  const [quote, setQuote] = useState<AiQuote | null>(null)
  const [quoteCount, setQuoteCount] = useState(0)
  const [handledSelectionKey, setHandledSelectionKey] = useState('')
  const hasPreloadedRef = useRef(false)
  const selectionKey = createSelectionKey(selection)
  const isAppending = open && quote !== null
  const nextQuoteLength = quote
    ? getCombinedQuoteLength(quote, selection.text)
    : selection.text.length

  // 出现有效划词选区时后台预取侧栏 chunk，用户点击触发浮标时几乎无等待。
  useEffect(() => {
    if (hasPreloadedRef.current || !selectionKey) return
    hasPreloadedRef.current = true
    preloadSidebar()
  }, [selectionKey])

  useEffect(() => {
    setOpen(false)
    setQuote(null)
    setQuoteCount(0)
    setHandledSelectionKey('')
  }, [pathname])

  function handleExplain(text: string) {
    if (isAppending && quote) {
      const nextQuote = appendToQuote(quote, text)
      if (!nextQuote) return

      setQuote(nextQuote)
      setQuoteCount((count) => count + 1)
      setHandledSelectionKey(selectionKey)
      return
    }

    setQuote(createQuote(text))
    setQuoteCount(1)
    setHandledSelectionKey(selectionKey)
    setOpen(true)
  }

  return (
    <>
      <AiSelectionTrigger
        selection={selection}
        hidden={open && selectionKey === handledSelectionKey}
        mode={isAppending ? 'append' : 'explain'}
        totalQuoteLength={nextQuoteLength}
        onExplain={handleExplain}
      />
      {open ? (
        <AiExplainSidebar
          open={open}
          quote={quote}
          quoteCount={quoteCount}
          onClose={() => {
            setOpen(false)
            setQuote(null)
            setQuoteCount(0)
          }}
        />
      ) : null}
    </>
  )
}
