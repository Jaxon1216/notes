import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai'
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

import {
  AI_EXPLAIN_INSTRUCTIONS,
  MAX_QUESTION_LENGTH,
  MAX_QUOTE_LENGTH,
  type AiProviderConfig,
  type AiQuote,
} from '@/lib/ai/config'

export const runtime = 'nodejs'
export const maxDuration = 30

type ExplainRequestBody = {
  messages?: UIMessage[]
  config?: Partial<AiProviderConfig>
  quote?: Partial<AiQuote>
}

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\./,
  /^10\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^169\.254\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^\[?::1\]?$/i,
  /\.local$/i,
]

const DEFAULT_ALLOWED_AI_HOSTS = [
  'api.openai.com',
  'api.deepseek.com',
  'openrouter.ai',
  'api.siliconflow.cn',
  'ark.cn-beijing.volces.com',
  'dashscope.aliyuncs.com',
  'api.moonshot.cn',
  'api.groq.com',
  'api.mistral.ai',
]

function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status })
}

function readTextPart(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('')
    .trim()
}

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

type BaseURLValidationResult =
  | {
      ok: true
      baseURL: string
    }
  | {
      ok: false
      error: string
    }

function normalizeHostname(hostname: string) {
  return hostname.replace(/^\[(.*)]$/, '$1').toLowerCase()
}

function isPrivateIPv4(address: string) {
  return PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(address))
}

function getIPv4FromMappedIPv6(address: string) {
  const normalized = normalizeHostname(address)
  const match = /^::ffff:(.+)$/i.exec(normalized)
  if (!match) return null

  const suffix = match[1]
  if (suffix.includes('.')) return suffix

  const parts = suffix.split(':')
  if (parts.length !== 2) return null

  const high = Number.parseInt(parts[0], 16)
  const low = Number.parseInt(parts[1], 16)

  if (
    Number.isNaN(high) ||
    Number.isNaN(low) ||
    high < 0 ||
    high > 0xffff ||
    low < 0 ||
    low > 0xffff
  ) {
    return null
  }

  return [
    (high >> 8) & 0xff,
    high & 0xff,
    (low >> 8) & 0xff,
    low & 0xff,
  ].join('.')
}

function isPrivateAddress(address: string) {
  const normalized = normalizeHostname(address)
  const mappedIPv4 = getIPv4FromMappedIPv6(normalized)

  if (isPrivateIPv4(normalized) || (mappedIPv4 && isPrivateIPv4(mappedIPv4))) {
    return true
  }

  if (isIP(normalized) === 6) {
    return (
      normalized === '::' ||
      normalized === '::1' ||
      normalized.startsWith('fc') ||
      normalized.startsWith('fd') ||
      normalized.startsWith('fe8') ||
      normalized.startsWith('fe9') ||
      normalized.startsWith('fea') ||
      normalized.startsWith('feb') ||
      normalized.startsWith('::ffff:127.') ||
      normalized.startsWith('::ffff:10.') ||
      normalized.startsWith('::ffff:192.168.') ||
      /^::ffff:172\.(1[6-9]|2\d|3[0-1])\./.test(normalized)
    )
  }

  return false
}

function getAllowedAIHosts() {
  const configuredHosts =
    process.env.AI_ALLOWED_BASE_URL_HOSTS?.split(',')
      .map((host) => normalizeHostname(host.trim()))
      .filter(Boolean) ?? []

  return new Set([...DEFAULT_ALLOWED_AI_HOSTS, ...configuredHosts])
}

async function validateBaseURL(
  value: string,
): Promise<BaseURLValidationResult> {
  let url: URL

  try {
    url = new URL(value)
  } catch {
    return { ok: false, error: 'baseURL 不是合法 URL。' }
  }

  const isLocalDevHost =
    process.env.NODE_ENV !== 'production' &&
    (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
  const hostname = normalizeHostname(url.hostname)

  if (url.protocol !== 'https:' && !isLocalDevHost) {
    return { ok: false, error: '生产环境只允许使用 HTTPS baseURL。' }
  }

  if (
    process.env.NODE_ENV === 'production' &&
    !getAllowedAIHosts().has(hostname)
  ) {
    return {
      ok: false,
      error: '当前 baseURL 域名不在站点允许列表中。',
    }
  }

  if (
    !isLocalDevHost &&
    PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(hostname))
  ) {
    return { ok: false, error: 'baseURL 不能指向本机或内网地址。' }
  }

  if (!isLocalDevHost) {
    try {
      const records = await lookup(url.hostname, {
        all: true,
        verbatim: true,
      })

      if (
        records.length === 0 ||
        records.some((record) => isPrivateAddress(record.address))
      ) {
        return { ok: false, error: 'baseURL 不能指向本机或内网地址。' }
      }
    } catch {
      return { ok: false, error: '无法解析 baseURL 域名。' }
    }
  }

  return {
    ok: true,
    baseURL: url.toString().replace(/\/$/, ''),
  }
}

async function secureFetch(input: RequestInfo | URL, init?: RequestInit) {
  const requestURL =
    typeof input === 'string' || input instanceof URL ? input.toString() : input.url
  const validation = await validateBaseURL(requestURL)

  if (!validation.ok) {
    throw new Error(validation.error)
  }

  const response = await fetch(input, {
    ...init,
    redirect: 'manual',
  })

  if (response.status >= 300 && response.status < 400) {
    throw new Error('AI provider redirects are not supported.')
  }

  return response
}

function buildInstructions(quote: AiQuote) {
  const sourceLine = [quote.pageTitle, quote.pageUrl]
    .filter(Boolean)
    .join(' - ')

  return `${AI_EXPLAIN_INSTRUCTIONS}

当前用户引用如下：
"""
${quote.text}
"""

${sourceLine ? `引用来源：${sourceLine}` : ''}

回答时请优先围绕这段引用解释。`
}

export async function POST(req: Request) {
  let body: ExplainRequestBody

  try {
    body = await req.json()
  } catch {
    return jsonError('请求体不是合法 JSON。')
  }

  const baseURL = normalizeString(body.config?.baseURL)
  const apiKey = normalizeString(body.config?.apiKey)
  const model = normalizeString(body.config?.model)
  const quoteText = normalizeString(body.quote?.text)
  const messages = Array.isArray(body.messages) ? body.messages : []

  if (!baseURL || !apiKey || !model) {
    return jsonError('请先完整配置 baseURL、API Key 和 model。')
  }

  if (!quoteText) {
    return jsonError('请选择要解释的内容。')
  }

  if (quoteText.length > MAX_QUOTE_LENGTH) {
    return jsonError(`选中内容不能超过 ${MAX_QUOTE_LENGTH} 个字符。`)
  }

  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'user')
  const latestQuestion = latestUserMessage ? readTextPart(latestUserMessage) : ''

  if (latestQuestion.length > MAX_QUESTION_LENGTH) {
    return jsonError(`问题不能超过 ${MAX_QUESTION_LENGTH} 个字符。`)
  }

  const validatedBaseURL = await validateBaseURL(baseURL)

  if (!validatedBaseURL.ok) {
    return jsonError(validatedBaseURL.error)
  }

  const provider = createOpenAICompatible({
    name: 'user-provider',
    apiKey,
    baseURL: validatedBaseURL.baseURL,
    includeUsage: true,
    fetch: secureFetch,
  })

  const result = streamText({
    model: provider(model),
    instructions: buildInstructions({
      id: normalizeString(body.quote?.id) || 'selection',
      text: quoteText,
      pageTitle: normalizeString(body.quote?.pageTitle) || undefined,
      pageUrl: normalizeString(body.quote?.pageUrl) || undefined,
    }),
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: () => 'AI 服务请求失败，请检查 baseURL、API Key 和 model。',
    }),
  })
}
