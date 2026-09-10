import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from 'ai'
import { isIP } from 'node:net'

import {
  AI_EXPLAIN_INSTRUCTIONS,
  type AiQuote,
} from '@/lib/ai/config'
import {
  MAX_EXPLAIN_REQUEST_BODY_BYTES,
  readLimitedJsonBody,
  validateContentLength,
  validateExplainRequestBody,
} from '@/lib/ai/explain-request'
import { FixedWindowRateLimiter } from '@/lib/ai/fixed-window-rate-limit'
import {
  normalizeHostname,
  validateProviderBaseURL,
} from '@/lib/ai/provider-url'

export const runtime = 'nodejs'
export const maxDuration = 30

const AI_EXPLAIN_RATE_LIMIT_REQUESTS = 10
const AI_EXPLAIN_RATE_LIMIT_WINDOW_MS = 60_000
const AI_EXPLAIN_RATE_LIMIT_MAX_CLIENTS = 10_000

const bestEffortRateLimiter = new FixedWindowRateLimiter({
  limit: AI_EXPLAIN_RATE_LIMIT_REQUESTS,
  windowMs: AI_EXPLAIN_RATE_LIMIT_WINDOW_MS,
  maxEntries: AI_EXPLAIN_RATE_LIMIT_MAX_CLIENTS,
})

function jsonError(
  message: string,
  status = 400,
  headers?: HeadersInit,
) {
  return Response.json(
    { error: message },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        ...headers,
      },
    },
  )
}

function getClientIdentifier(headers: Headers) {
  for (const header of [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
  ]) {
    const candidate = headers.get(header)?.split(',')[0]?.trim()
    if (!candidate || candidate.length > 128) continue

    const normalized = normalizeHostname(candidate)
    if (isIP(normalized)) return normalized
  }

  return 'unknown'
}

async function secureFetch(input: RequestInfo | URL, init?: RequestInit) {
  const requestURL =
    typeof input === 'string' || input instanceof URL ? input.toString() : input.url
  const validation = await validateProviderBaseURL(requestURL)

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

// Situation: 公开转发接口会同时面对超大请求、伪造消息、频繁调用和恶意 Provider URL。
// Task: 在任何模型请求发生前建立可预测的资源上限与安全边界。
// Action: 依次执行体积检查、限流、JSON 读取、结构校验和 Provider URL 校验。
// Result: 非法请求会在明确阶段以 400/413/429 拒绝，合法流式会话保持原链路。
export async function POST(req: Request) {
  const contentLength = validateContentLength(
    req.headers.get('content-length'),
    MAX_EXPLAIN_REQUEST_BODY_BYTES,
  )

  if (!contentLength.ok) {
    return jsonError(contentLength.error, contentLength.status)
  }

  const rateLimit = bestEffortRateLimiter.check(
    getClientIdentifier(req.headers),
  )

  if (!rateLimit.allowed) {
    return jsonError('请求过于频繁，请稍后再试。', 429, {
      'Retry-After': String(rateLimit.retryAfterSeconds),
    })
  }

  const parsedBody = await readLimitedJsonBody(req)
  if (!parsedBody.ok) {
    return jsonError(parsedBody.error, parsedBody.status)
  }

  const validatedBody = validateExplainRequestBody(parsedBody.value)
  if (!validatedBody.ok) {
    return jsonError(validatedBody.error, validatedBody.status)
  }

  const { config, messages, quote } = validatedBody.value
  const validatedBaseURL = await validateProviderBaseURL(config.baseURL)

  if (!validatedBaseURL.ok) {
    return jsonError(validatedBaseURL.error)
  }

  try {
    const provider = createOpenAICompatible({
      name: 'user-provider',
      apiKey: config.apiKey,
      baseURL: validatedBaseURL.baseURL,
      includeUsage: true,
      fetch: secureFetch,
    })
    const result = streamText({
      model: provider(config.model),
      instructions: buildInstructions(quote),
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    })

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        onError: () => 'AI 服务请求失败，请检查 baseURL、API Key 和 model。',
      }),
    })
  } catch {
    return jsonError('AI 服务请求失败，请检查配置后重试。', 502)
  }
}
