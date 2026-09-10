'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { AiQuote } from '@/lib/ai/config'

import { AiExplainSidebar } from './ai-explain-sidebar'
import { appendToQuote, getCombinedQuoteLength } from './ai-quote'
import { AiSelectionTrigger } from './ai-selection-trigger'
import { useTextSelection, type TextSelectionState } from './use-text-selection'

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
  const selectionKey = createSelectionKey(selection)
  const isAppending = open && quote !== null
  const nextQuoteLength = quote
    ? getCombinedQuoteLength(quote, selection.text)
    : selection.text.length

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
    </>
  )
}
