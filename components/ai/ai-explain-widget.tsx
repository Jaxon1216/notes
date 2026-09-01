'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

import type { AiQuote } from '@/lib/ai/config'

import { AiExplainSidebar } from './ai-explain-sidebar'
import {
  hasSeenAiOnboarding,
  markAiOnboardingSeen,
} from './ai-config-storage'
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
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showSelectionHint, setShowSelectionHint] = useState(false)
  const selectionKey = createSelectionKey(selection)

  useEffect(() => {
    setOpen(false)
    setQuote(null)
    setHandledSelectionKey('')
    setShowOnboarding(false)
    setShowSelectionHint(false)
  }, [pathname])

  useEffect(() => {
    if (!selection.text || hasSeenAiOnboarding()) return

    setShowSelectionHint(true)
    markAiOnboardingSeen()
  }, [selection.text])

  function handleExplain(text: string) {
    setQuote(createQuote(text))
    setHandledSelectionKey(selectionKey)
    setOpen(true)
    setShowSelectionHint(false)
  }

  function openAssistant() {
    setQuote(null)
    const shouldShowOnboarding = !hasSeenAiOnboarding()
    setShowOnboarding(shouldShowOnboarding)
    setOpen(true)
    if (shouldShowOnboarding) markAiOnboardingSeen()
  }

  return (
    <>
      <AiSelectionTrigger
        selection={selection}
        hidden={open && selectionKey === handledSelectionKey}
        showHint={showSelectionHint}
        onExplain={handleExplain}
      />
      {!open ? (
        <button
          type="button"
          className="ai-explain-launcher"
          onClick={openAssistant}
        >
          <Sparkles aria-hidden="true" size={16} />
          AI 解答
        </button>
      ) : null}
      <AiExplainSidebar
        open={open}
        quote={quote}
        showOnboarding={showOnboarding}
        onDismissOnboarding={() => setShowOnboarding(false)}
        onShowOnboarding={() => setShowOnboarding(true)}
        onClose={() => {
          setOpen(false)
          setQuote(null)
          setShowOnboarding(false)
        }}
      />
    </>
  )
}
