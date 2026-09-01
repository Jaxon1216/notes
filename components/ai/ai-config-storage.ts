import {
  AI_CONFIG_STORAGE_KEY,
  type AiProviderConfig,
} from '@/lib/ai/config'

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function normalizeAiConfig(config: AiProviderConfig): AiProviderConfig {
  return {
    baseURL: config.baseURL.trim(),
    apiKey: config.apiKey.trim(),
    model: config.model.trim(),
  }
}

export function isCompleteAiConfig(
  config: AiProviderConfig | null,
): config is AiProviderConfig {
  return Boolean(
    config &&
      isNonEmptyString(config.baseURL) &&
      isNonEmptyString(config.apiKey) &&
      isNonEmptyString(config.model),
  )
}

export function loadAiConfig(): AiProviderConfig | null {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(AI_CONFIG_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const config = parsed as Partial<AiProviderConfig>
    if (
      !isNonEmptyString(config.baseURL) ||
      !isNonEmptyString(config.apiKey) ||
      !isNonEmptyString(config.model)
    ) {
      return null
    }

    return normalizeAiConfig({
      baseURL: config.baseURL,
      apiKey: config.apiKey,
      model: config.model,
    })
  } catch {
    return null
  }
}

export function saveAiConfig(config: AiProviderConfig) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(
    AI_CONFIG_STORAGE_KEY,
    JSON.stringify(normalizeAiConfig(config)),
  )
}

export function clearAiConfig() {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem(AI_CONFIG_STORAGE_KEY)
}
