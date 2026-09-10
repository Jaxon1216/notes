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
  mode?: 'explain' | 'append'
  totalQuoteLength?: number
  onExplain: (text: string) => void
}

export function AiSelectionTrigger({
  selection,
  hidden = false,
  mode = 'explain',
  totalQuoteLength = selection.text.length,
  onExplain,
}: AiSelectionTriggerProps) {
  if (hidden || !selection.text || !selection.rect) return null

  const isTooLong = totalQuoteLength > MAX_QUOTE_LENGTH
  const label = mode === 'append' ? '追加引用' : 'AI 解答'
  const accessibleLabel =
    mode === 'append' ? '追加选中内容到当前对话' : AI_TRIGGER_LABEL
  const top = Math.max(selection.rect.top - 42, 12)
  const left = Math.min(
    selection.rect.left + selection.rect.width,
    window.innerWidth - 150,
  )

  return (
    <button
      type="button"
      className="ai-selection-trigger"
      style={{ left, top }}
      title={
        isTooLong
          ? `引用总长度不能超过 ${MAX_QUOTE_LENGTH} 个字符`
          : accessibleLabel
      }
      aria-label={accessibleLabel}
      disabled={isTooLong}
      onMouseDown={(event) => {
        event.preventDefault()
      }}
      onClick={() => {
        if (!isTooLong) onExplain(selection.text)
      }}
    >
      <Sparkles aria-hidden="true" size={16} />
      <span>{label}</span>
    </button>
  )
}
