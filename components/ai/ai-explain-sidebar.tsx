'use client'

import { useChat } from '@ai-sdk/react'
import { Bot, LoaderCircle, RefreshCw, Send, Settings, X } from 'lucide-react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
  AI_DEFAULT_QUESTION,
  type AiProviderConfig,
  type AiQuote,
} from '@/lib/ai/config'

import { isCompleteAiConfig, loadAiConfig } from './ai-config-storage'
import { AiSettingsForm } from './ai-settings-form'

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

export function AiExplainSidebar({
  open,
  quote,
  onClose,
}: AiExplainSidebarProps) {
  const [config, setConfig] = useState<AiProviderConfig | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [input, setInput] = useState('')
  const lastAutoQuoteIdRef = useRef<string | null>(null)

  useEffect(() => {
    const storedConfig = loadAiConfig()
    setConfig(storedConfig)
    setShowSettings(!storedConfig)
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

  const canRequest = open && quote && isCompleteAiConfig(config)
  const isBusy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    if (!canRequest || !quote || !config) return
    if (lastAutoQuoteIdRef.current === quote.id) return

    lastAutoQuoteIdRef.current = quote.id
    setInput('')
    setMessages([])
    clearError()

    void sendMessage(
      { text: AI_DEFAULT_QUESTION },
      {
        body: {
          config,
          quote,
        },
      },
    )
  }, [canRequest, clearError, config, quote, sendMessage, setMessages])

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
    lastAutoQuoteIdRef.current = quote.id

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

  function submitMessage(event: React.FormEvent<HTMLFormElement>) {
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
    <aside className="ai-explain-sidebar" aria-label="AI 解释侧栏">
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
            <p>选中文档内容后，我会围绕引用解释。</p>
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
              <p>{text}</p>
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
