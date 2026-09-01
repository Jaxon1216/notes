'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { AiQuote } from '@/lib/ai/config'

import { AiExplainSidebar } from './ai-explain-sidebar'
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
  const [handledSelectionKey, setHandledSelectionKey] = useState('')
  const selectionKey = createSelectionKey(selection)

  useEffect(() => {
    setOpen(false)
    setQuote(null)
    setHandledSelectionKey('')
  }, [pathname])

  function handleExplain(text: string) {
    setQuote(createQuote(text))
    setHandledSelectionKey(selectionKey)
    setOpen(true)
  }

  return (
    <>
      <AiSelectionTrigger
        selection={selection}
        hidden={open && selectionKey === handledSelectionKey}
        onExplain={handleExplain}
      />
      <AiExplainSidebar
        open={open}
        quote={quote}
        onClose={() => {
          setOpen(false)
          setQuote(null)
        }}
      />
    </>
  )
}
