export type AiProviderConfig = {
  baseURL: string
  apiKey: string
  model: string
}

export type AiQuote = {
  id: string
  text: string
  pageTitle?: string
  pageUrl?: string
}

export const AI_CONFIG_STORAGE_KEY = 'easton-ai-config-v1'
export const AI_TRIGGER_LABEL = '解释选中内容'
export const AI_DEFAULT_QUESTION = '解释这段内容'
export const AI_TRIGGER_ICON_NAME = 'sparkles'

export const MAX_QUOTE_LENGTH = 4000
export const MAX_QUESTION_LENGTH = 1000

export const AI_EXPLAIN_INSTRUCTIONS = `你是 Easton Notes 技术知识库的阅读解释助手。
优先解释用户引用的内容。
回答使用中文，保持准确、清晰、分层。
如果引用内容是代码，说明核心逻辑、关键 API、易错点。
如果用户继续追问，围绕当前引用上下文回答。
不知道或引用不足时，明确说明需要更多上下文，不编造。`
