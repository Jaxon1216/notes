'use client'

import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { AiProviderConfig } from '@/lib/ai/config'

import {
  clearAiConfig,
  loadAiConfig,
  normalizeAiConfig,
  saveAiConfig,
} from './ai-config-storage'

type AiSettingsFormProps = {
  onSave: (config: AiProviderConfig) => void
  onClear: () => void
}

const EMPTY_CONFIG: AiProviderConfig = {
  baseURL: '',
  apiKey: '',
  model: '',
}

export function AiSettingsForm({ onSave, onClear }: AiSettingsFormProps) {
  const [config, setConfig] = useState<AiProviderConfig>(EMPTY_CONFIG)
  const [error, setError] = useState('')

  useEffect(() => {
    setConfig(loadAiConfig() ?? EMPTY_CONFIG)
  }, [])

  function updateField<Key extends keyof AiProviderConfig>(
    key: Key,
    value: AiProviderConfig[Key],
  ) {
    setConfig((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function handleSave() {
    const nextConfig = normalizeAiConfig(config)

    if (!nextConfig.baseURL || !nextConfig.apiKey || !nextConfig.model) {
      setError('请填写 baseURL、API Key 和 model。')
      return
    }

    try {
      new URL(nextConfig.baseURL)
    } catch {
      setError('baseURL 不是合法 URL。')
      return
    }

    saveAiConfig(nextConfig)
    setConfig(nextConfig)
    setError('')
    onSave(nextConfig)
  }

  function handleClear() {
    clearAiConfig()
    setConfig(EMPTY_CONFIG)
    setError('')
    onClear()
  }

  return (
    <form
      className="ai-settings-form"
      onSubmit={(event) => {
        event.preventDefault()
        handleSave()
      }}
    >
      <label>
        <span>Base URL</span>
        <input
          value={config.baseURL}
          placeholder="https://api.deepseek.com"
          autoComplete="off"
          onChange={(event) => updateField('baseURL', event.target.value)}
        />
      </label>
      <label>
        <span>API Key</span>
        <input
          value={config.apiKey}
          type="password"
          placeholder="sk-..."
          autoComplete="off"
          onChange={(event) => updateField('apiKey', event.target.value)}
        />
      </label>
      <label>
        <span>Model</span>
        <input
          value={config.model}
          placeholder="deepseek-v4-pro"
          autoComplete="off"
          onChange={(event) => updateField('model', event.target.value)}
        />
      </label>
      {error ? <p className="ai-settings-form__error">{error}</p> : null}
      <div className="ai-settings-form__actions">
        <button type="submit">保存配置</button>
        <button type="button" className="is-ghost" onClick={handleClear}>
          <Trash2 aria-hidden="true" size={15} />
          清除
        </button>
      </div>
      <p className="ai-settings-form__notice">
        配置只保存在当前浏览器；请求 AI 时会发送到本站 API
        用于转发，不会持久化。生产环境仅允许站点配置的模型服务域名。
      </p>
    </form>
  )
}
