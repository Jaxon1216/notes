'use client'

import { useChat } from '@ai-sdk/react'
import {
  Bot,
  LoaderCircle,
  RefreshCw,
  Send,
  Settings,
  X,
} from 'lucide-react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'

import {
  AI_DEFAULT_QUESTION,
  type AiProviderConfig,
  type AiQuote,
} from '@/lib/ai/config'

import { isCompleteAiConfig, loadAiConfig } from './ai-config-storage'
import { AiSettingsForm } from './ai-settings-form'
import { AiMarkdown } from './ai-markdown'

type AiExplainSidebarProps = {
  open: boolean
  quote: AiQuote | null
  onClose: () => void
}

function getMessageText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('')
}

function trimQuote(text: string) {
  return text.replace(/\s+/g, ' ').trim()
}

const AI_SIDEBAR_WIDTH_STORAGE_KEY = 'easton-ai-sidebar-width-v1'
const DEFAULT_SIDEBAR_WIDTH = 460
const MIN_SIDEBAR_WIDTH = 360
const SIDEBAR_EDGE_GAP = 96

function getMaxSidebarWidth() {
  if (typeof window === 'undefined') return 760

  return Math.min(820, window.innerWidth - SIDEBAR_EDGE_GAP)
}

function clampSidebarWidth(width: number) {
  return Math.min(Math.max(width, MIN_SIDEBAR_WIDTH), getMaxSidebarWidth())
}

function loadSidebarWidth() {
  if (typeof window === 'undefined') return DEFAULT_SIDEBAR_WIDTH

  const stored = Number.parseInt(
    window.localStorage.getItem(AI_SIDEBAR_WIDTH_STORAGE_KEY) ?? '',
    10,
  )

  return Number.isFinite(stored)
    ? clampSidebarWidth(stored)
    : clampSidebarWidth(DEFAULT_SIDEBAR_WIDTH)
}

export function AiExplainSidebar({
  open,
  quote,
  onClose,
}: AiExplainSidebarProps) {
  const [config, setConfig] = useState<AiProviderConfig | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [input, setInput] = useState('')
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
  const lastPreparedQuoteIdRef = useRef<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const isResizingRef = useRef(false)
  const sidebarWidthRef = useRef(DEFAULT_SIDEBAR_WIDTH)

  useEffect(() => {
    const storedConfig = loadAiConfig()
    const storedSidebarWidth = loadSidebarWidth()
    setConfig(storedConfig)
    setShowSettings(!storedConfig)
    setSidebarWidth(storedSidebarWidth)
    sidebarWidthRef.current = storedSidebarWidth
  }, [])

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      if (!isResizingRef.current) return

      const nextWidth = clampSidebarWidth(window.innerWidth - event.clientX)
      sidebarWidthRef.current = nextWidth
      setSidebarWidth(nextWidth)
    }

    function handlePointerUp() {
      if (!isResizingRef.current) return

      isResizingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.localStorage.setItem(
        AI_SIDEBAR_WIDTH_STORAGE_KEY,
        String(sidebarWidthRef.current),
      )
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [])

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/ai/explain',
      }),
    [],
  )

  const {
    messages,
    sendMessage,
    setMessages,
    stop,
    status,
    error,
    clearError,
  } = useChat({
    id: quote?.id ?? 'ai-empty',
    transport,
    throttle: 50,
  })

  const isBusy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    if (!quote) return
    if (lastPreparedQuoteIdRef.current === quote.id) return

    lastPreparedQuoteIdRef.current = quote.id
    setInput(AI_DEFAULT_QUESTION)
    setMessages([])
    clearError()
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ block: 'end' })
    })
  }, [clearError, quote, setMessages])

  useEffect(() => {
    if (!open) return

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, open, status])

  if (!open) return null

  function handleConfigSave(nextConfig: AiProviderConfig) {
    setConfig(nextConfig)
    setShowSettings(false)
  }

  function handleConfigClear() {
    setConfig(null)
    setMessages([])
    setShowSettings(true)
  }

  function explainAgain() {
    if (!quote || !isCompleteAiConfig(config) || isBusy) return

    setInput('')
    setMessages([])
    clearError()
    lastPreparedQuoteIdRef.current = quote.id

    void sendMessage(
      { text: AI_DEFAULT_QUESTION },
      {
        body: {
          config,
          quote,
        },
      },
    )
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const text = input.trim()
    if (!text || !quote || !isCompleteAiConfig(config) || isBusy) return

    setInput('')
    clearError()
    void sendMessage(
      { text },
      {
        body: {
          config,
          quote,
        },
      },
    )
  }

  return (
    <aside
      className="ai-explain-sidebar"
      style={{ width: sidebarWidth }}
      aria-label="AI 解释侧栏"
    >
      <button
        type="button"
        className="ai-explain-sidebar__resize"
        aria-label="调整 AI 解释侧栏宽度"
        title="拖拽调整宽度"
        onPointerDown={(event) => {
          event.preventDefault()
          isResizingRef.current = true
          document.body.style.cursor = 'col-resize'
          document.body.style.userSelect = 'none'
        }}
      />
      <header className="ai-explain-sidebar__header">
        <div>
          <p>AI 解释</p>
          <span>{config?.model || '未配置模型'}</span>
        </div>
        <div className="ai-explain-sidebar__tools">
          <button
            type="button"
            title="设置"
            aria-label="设置"
            onClick={() => setShowSettings((value) => !value)}
          >
            <Settings aria-hidden="true" size={16} />
          </button>
          <button
            type="button"
            title="关闭"
            aria-label="关闭"
            onClick={() => {
              stop()
              onClose()
            }}
          >
            <X aria-hidden="true" size={16} />
          </button>
        </div>
      </header>

      {quote ? (
        <section className="ai-explain-sidebar__quote" aria-label="当前引用">
          <span>引用</span>
          <p>{trimQuote(quote.text)}</p>
        </section>
      ) : null}

      {showSettings || !isCompleteAiConfig(config) ? (
        <AiSettingsForm
          onSave={handleConfigSave}
          onClear={handleConfigClear}
        />
      ) : null}

      <section className="ai-explain-sidebar__messages" aria-live="polite">
        {messages.length === 0 && !error ? (
          <div className="ai-explain-sidebar__empty">
            <Bot aria-hidden="true" size={18} />
            <p>
              {quote
                ? '输入问题，或点击“重新解释”开始。'
                : '先选中正文内容，我会围绕引用解释。'}
            </p>
          </div>
        ) : null}

        {messages.map((message) => {
          const text = getMessageText(message)
          if (!text) return null

          return (
            <article
              className={`ai-explain-message is-${message.role}`}
              key={message.id}
            >
              <span>{message.role === 'user' ? '你' : 'AI'}</span>
              {message.role === 'assistant' ? (
                <div className="ai-explain-markdown">
                  <AiMarkdown>{text}</AiMarkdown>
                </div>
              ) : (
                <p>{text}</p>
              )}
            </article>
          )
        })}

        {isBusy ? (
          <div className="ai-explain-sidebar__status">
            <LoaderCircle aria-hidden="true" size={15} />
            <span>生成中</span>
          </div>
        ) : null}

        {error ? (
          <div className="ai-explain-sidebar__error">
            AI 服务请求失败，请检查 baseURL、API Key 和 model。
          </div>
        ) : null}
        <div ref={messagesEndRef} aria-hidden="true" />
      </section>

      <form className="ai-explain-sidebar__composer" onSubmit={submitMessage}>
        <textarea
          value={input}
          placeholder="继续追问当前引用..."
          rows={3}
          disabled={!quote || !isCompleteAiConfig(config) || isBusy}
          onChange={(event) => setInput(event.target.value)}
        />
        <div>
          <button
            type="button"
            className="is-ghost"
            disabled={!quote || !isCompleteAiConfig(config) || isBusy}
            onClick={explainAgain}
          >
            <RefreshCw aria-hidden="true" size={15} />
            重新解释
          </button>
          {isBusy ? (
            <button type="button" className="is-ghost" onClick={stop}>
              停止
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || !quote || !isCompleteAiConfig(config)}
            >
              <Send aria-hidden="true" size={15} />
              发送
            </button>
          )}
        </div>
      </form>
    </aside>
  )
}
