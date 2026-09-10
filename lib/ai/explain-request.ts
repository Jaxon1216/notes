import {
  MAX_QUESTION_LENGTH,
  MAX_QUOTE_LENGTH,
  type AiProviderConfig,
  type AiQuote,
} from './config'

export const MAX_EXPLAIN_REQUEST_BODY_BYTES = 128 * 1024
export const MAX_EXPLAIN_MESSAGE_COUNT = 24
export const MAX_EXPLAIN_MESSAGE_PART_COUNT = 8
export const MAX_EXPLAIN_MESSAGE_TEXT_LENGTH = 8000
export const MAX_EXPLAIN_TOTAL_MESSAGE_TEXT_LENGTH = 24000
export const MAX_AI_BASE_URL_LENGTH = 2048
export const MAX_AI_API_KEY_LENGTH = 4096
export const MAX_AI_MODEL_LENGTH = 256
export const MAX_AI_ID_LENGTH = 128
export const MAX_AI_PAGE_TITLE_LENGTH = 300
export const MAX_AI_PAGE_URL_LENGTH = 2048

export type ExplainTextMessage = {
  id: string
  role: 'user' | 'assistant'
  parts: Array<{
    type: 'text'
    text: string
  }>
}

export type ExplainRequestBody = {
  messages: ExplainTextMessage[]
  config: AiProviderConfig
  quote: AiQuote
}

type ValidationError = {
  ok: false
  error: string
  status: 400 | 413
}

type ValidationSuccess<Value> = {
  ok: true
  value: Value
}

export type ValidationResult<Value> =
  | ValidationSuccess<Value>
  | ValidationError

const ROOT_KEYS = new Set(['messages', 'config', 'quote'])
const CONFIG_KEYS = new Set(['baseURL', 'apiKey', 'model'])
const QUOTE_KEYS = new Set(['id', 'text', 'pageTitle', 'pageUrl'])
const MESSAGE_KEYS = new Set(['id', 'role', 'parts'])
const TEXT_PART_KEYS = new Set(['type', 'text'])

function validationError(error: string, status: 400 | 413 = 400) {
  return { ok: false, error, status } as const
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  allowedKeys: ReadonlySet<string>,
) {
  return Object.keys(value).every((key) => allowedKeys.has(key))
}

function readBoundedString(
  value: unknown,
  label: string,
  maxLength: number,
  optional = false,
): ValidationResult<string | undefined> {
  if (value === undefined && optional) {
    return { ok: true, value: undefined }
  }

  if (typeof value !== 'string') {
    return validationError(`${label} 必须是字符串。`)
  }

  if (value.length > maxLength) {
    return validationError(`${label} 不能超过 ${maxLength} 个字符。`)
  }

  const normalized = value.trim()

  if (!normalized) {
    if (optional) {
      return { ok: true, value: undefined }
    }

    return validationError(`${label} 不能为空。`)
  }

  return { ok: true, value: normalized }
}

export function validateContentLength(
  contentLength: string | null,
  maxBytes = MAX_EXPLAIN_REQUEST_BODY_BYTES,
): ValidationResult<number | undefined> {
  if (contentLength === null) {
    return { ok: true, value: undefined }
  }

  const normalized = contentLength.trim()
  if (!/^\d+$/.test(normalized)) {
    return validationError('Content-Length 不合法。')
  }

  const length = BigInt(normalized)
  if (length > BigInt(maxBytes)) {
    return validationError('请求体过大。', 413)
  }

  return { ok: true, value: Number(length) }
}

// Situation: Content-Length 可能缺失或被伪造，直接 request.json() 会先把整包数据读入内存。
// Task: 无论请求头是否可信，都必须把实际接收的 UTF-8 数据限制在 128 KiB 内。
// Action: 流式读取字节并累计大小，超限立即取消 reader，再对完整文本执行 JSON.parse。
// Result: 大包在解析和业务校验前被 413 拒绝，服务端内存占用有明确上限。
export async function readLimitedJsonBody(
  request: Request,
  maxBytes = MAX_EXPLAIN_REQUEST_BODY_BYTES,
): Promise<ValidationResult<unknown>> {
  const declaredLength = validateContentLength(
    request.headers.get('content-length'),
    maxBytes,
  )

  if (!declaredLength.ok) {
    return declaredLength
  }

  const reader = request.body?.getReader()
  if (!reader) {
    return validationError('请求体不是合法 JSON。')
  }

  const decoder = new TextDecoder('utf-8', { fatal: true })
  let byteLength = 0
  let text = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      byteLength += value.byteLength
      if (byteLength > maxBytes) {
        await reader.cancel().catch(() => undefined)
        return validationError('请求体过大。', 413)
      }

      text += decoder.decode(value, { stream: true })
    }

    text += decoder.decode()
  } catch {
    return validationError('请求体不是合法 UTF-8 JSON。')
  } finally {
    reader.releaseLock()
  }

  try {
    return { ok: true, value: JSON.parse(text) as unknown }
  } catch {
    return validationError('请求体不是合法 JSON。')
  }
}

function validateMessages(
  value: unknown,
): ValidationResult<ExplainTextMessage[]> {
  if (!Array.isArray(value)) {
    return validationError('messages 必须是数组。')
  }

  if (value.length === 0) {
    return validationError('messages 不能为空。')
  }

  if (value.length > MAX_EXPLAIN_MESSAGE_COUNT) {
    return validationError(
      `消息数量不能超过 ${MAX_EXPLAIN_MESSAGE_COUNT} 条。`,
    )
  }

  const messages: ExplainTextMessage[] = []
  const messageIds = new Set<string>()
  let totalTextLength = 0

  for (const rawMessage of value) {
    if (!isRecord(rawMessage) || !hasOnlyKeys(rawMessage, MESSAGE_KEYS)) {
      return validationError('消息结构不合法。')
    }

    const id = readBoundedString(
      rawMessage.id,
      '消息 id',
      MAX_AI_ID_LENGTH,
    )
    if (!id.ok) return id

    if (messageIds.has(id.value!)) {
      return validationError('消息 id 不能重复。')
    }
    messageIds.add(id.value!)

    if (rawMessage.role !== 'user' && rawMessage.role !== 'assistant') {
      return validationError('消息 role 只允许 user 或 assistant。')
    }

    if (
      !Array.isArray(rawMessage.parts) ||
      rawMessage.parts.length === 0 ||
      rawMessage.parts.length > MAX_EXPLAIN_MESSAGE_PART_COUNT
    ) {
      return validationError(
        `每条消息必须包含 1-${MAX_EXPLAIN_MESSAGE_PART_COUNT} 个文本 part。`,
      )
    }

    let messageText = ''

    for (const rawPart of rawMessage.parts) {
      if (
        !isRecord(rawPart) ||
        !hasOnlyKeys(rawPart, TEXT_PART_KEYS) ||
        rawPart.type !== 'text' ||
        typeof rawPart.text !== 'string'
      ) {
        return validationError('消息只允许 text part。')
      }

      messageText += rawPart.text
    }

    messageText = messageText.trim()
    if (!messageText) {
      return validationError('消息内容不能为空。')
    }

    if (messageText.length > MAX_EXPLAIN_MESSAGE_TEXT_LENGTH) {
      return validationError(
        `单条消息不能超过 ${MAX_EXPLAIN_MESSAGE_TEXT_LENGTH} 个字符。`,
      )
    }

    if (
      rawMessage.role === 'user' &&
      messageText.length > MAX_QUESTION_LENGTH
    ) {
      return validationError(
        `问题不能超过 ${MAX_QUESTION_LENGTH} 个字符。`,
      )
    }

    totalTextLength += messageText.length
    if (totalTextLength > MAX_EXPLAIN_TOTAL_MESSAGE_TEXT_LENGTH) {
      return validationError(
        `消息文本总长度不能超过 ${MAX_EXPLAIN_TOTAL_MESSAGE_TEXT_LENGTH} 个字符。`,
      )
    }

    messages.push({
      id: id.value!,
      role: rawMessage.role,
      parts: [{ type: 'text', text: messageText }],
    })
  }

  if (messages.at(-1)?.role !== 'user') {
    return validationError('最后一条消息必须来自 user。')
  }

  return { ok: true, value: messages }
}

function validateConfig(
  value: unknown,
): ValidationResult<AiProviderConfig> {
  if (!isRecord(value) || !hasOnlyKeys(value, CONFIG_KEYS)) {
    return validationError('config 结构不合法。')
  }

  const baseURL = readBoundedString(
    value.baseURL,
    'baseURL',
    MAX_AI_BASE_URL_LENGTH,
  )
  if (!baseURL.ok) return baseURL

  const apiKey = readBoundedString(
    value.apiKey,
    'API Key',
    MAX_AI_API_KEY_LENGTH,
  )
  if (!apiKey.ok) return apiKey

  const model = readBoundedString(
    value.model,
    'model',
    MAX_AI_MODEL_LENGTH,
  )
  if (!model.ok) return model

  return {
    ok: true,
    value: {
      baseURL: baseURL.value!,
      apiKey: apiKey.value!,
      model: model.value!,
    },
  }
}

function validateQuote(value: unknown): ValidationResult<AiQuote> {
  if (!isRecord(value) || !hasOnlyKeys(value, QUOTE_KEYS)) {
    return validationError('quote 结构不合法。')
  }

  const id = readBoundedString(value.id, '引用 id', MAX_AI_ID_LENGTH)
  if (!id.ok) return id

  const text = readBoundedString(value.text, '选中内容', MAX_QUOTE_LENGTH)
  if (!text.ok) return text

  const pageTitle = readBoundedString(
    value.pageTitle,
    'pageTitle',
    MAX_AI_PAGE_TITLE_LENGTH,
    true,
  )
  if (!pageTitle.ok) return pageTitle

  const pageUrl = readBoundedString(
    value.pageUrl,
    'pageUrl',
    MAX_AI_PAGE_URL_LENGTH,
    true,
  )
  if (!pageUrl.ok) return pageUrl

  return {
    ok: true,
    value: {
      id: id.value!,
      text: text.value!,
      pageTitle: pageTitle.value,
      pageUrl: pageUrl.value,
    },
  }
}

// Situation: TypeScript 的 UIMessage 类型只约束编译期，网络请求仍可能携带任意 JSON。
// Task: 只允许当前解释功能需要的文本会话，并限制历史消息和配置字段规模。
// Action: 逐层校验根对象、消息、文本 part、Provider 配置和引用后生成干净对象。
// Result: 下游 AI SDK 不再接触未知 role/part 或无界文本，错误也能返回明确原因。
export function validateExplainRequestBody(
  value: unknown,
): ValidationResult<ExplainRequestBody> {
  if (!isRecord(value) || !hasOnlyKeys(value, ROOT_KEYS)) {
    return validationError('请求结构不合法。')
  }

  const messages = validateMessages(value.messages)
  if (!messages.ok) return messages

  const config = validateConfig(value.config)
  if (!config.ok) return config

  const quote = validateQuote(value.quote)
  if (!quote.ok) return quote

  return {
    ok: true,
    value: {
      messages: messages.value,
      config: config.value,
      quote: quote.value,
    },
  }
}
