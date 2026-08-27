'use client'

import { Sparkles } from 'lucide-react'

import {
  AI_TRIGGER_LABEL,
  MAX_QUOTE_LENGTH,
} from '@/lib/ai/config'

import type { TextSelectionState } from './use-text-selection'

type AiSelectionTriggerProps = {
  selection: TextSelectionState
  hidden?: boolean
  onExplain: (text: string) => void
}

export function AiSelectionTrigger({
  selection,
  hidden = false,
  onExplain,
}: AiSelectionTriggerProps) {
  if (hidden || !selection.text || !selection.rect) return null

  const isTooLong = selection.text.length > MAX_QUOTE_LENGTH
  const top = Math.max(selection.rect.top - 42, 12)
  const left = Math.min(
    selection.rect.left + selection.rect.width,
    window.innerWidth - 56,
  )

  return (
    <button
      type="button"
      className="ai-selection-trigger"
      style={{ left, top }}
      title={isTooLong ? `选中内容不能超过 ${MAX_QUOTE_LENGTH} 个字符` : AI_TRIGGER_LABEL}
      aria-label={AI_TRIGGER_LABEL}
      disabled={isTooLong}
      onMouseDown={(event) => {
        event.preventDefault()
      }}
      onClick={() => {
        if (!isTooLong) onExplain(selection.text)
      }}
    >
      <Sparkles aria-hidden="true" size={16} />
    </button>
  )
}
