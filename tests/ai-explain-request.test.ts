import { describe, expect, it } from 'vitest'

import {
  MAX_AI_API_KEY_LENGTH,
  MAX_AI_BASE_URL_LENGTH,
  MAX_AI_ID_LENGTH,
  MAX_AI_MODEL_LENGTH,
  MAX_AI_PAGE_TITLE_LENGTH,
  MAX_AI_PAGE_URL_LENGTH,
  MAX_EXPLAIN_MESSAGE_COUNT,
  MAX_EXPLAIN_MESSAGE_TEXT_LENGTH,
  MAX_EXPLAIN_REQUEST_BODY_BYTES,
  MAX_EXPLAIN_TOTAL_MESSAGE_TEXT_LENGTH,
  readLimitedJsonBody,
  validateContentLength,
  validateExplainRequestBody,
} from '../lib/ai/explain-request'
import { FixedWindowRateLimiter } from '../lib/ai/fixed-window-rate-limit'

function createValidBody(): Record<string, any> {
  return {
    messages: [
      {
        id: 'message-1',
        role: 'user',
        parts: [{ type: 'text', text: '解释这段内容' }],
      },
    ],
    config: {
      baseURL: 'https://api.openai.com/v1',
      apiKey: 'test-key',
      model: 'test-model',
    },
    quote: {
      id: 'quote-1',
      text: 'const answer = 42',
      pageTitle: '测试页面',
      pageUrl: '/docs/test',
    },
  }
}

function expectInvalid(body: unknown, message: string) {
  const result = validateExplainRequestBody(body)

  expect(result.ok).toBe(false)
  if (!result.ok) {
    expect(result.error).toContain(message)
  }
}

describe('AI explain request structure', () => {
  it('accepts and normalizes user/assistant text messages', () => {
    const body = createValidBody()
    body.messages = [
      {
        id: 'message-1',
        role: 'user',
        parts: [{ type: 'text', text: '  第一问  ' }],
      },
      {
        id: 'message-2',
        role: 'assistant',
        parts: [
          { type: 'text', text: '第一' },
          { type: 'text', text: '答' },
        ],
      },
      {
        id: 'message-3',
        role: 'user',
        parts: [{ type: 'text', text: '追问' }],
      },
    ]

    const result = validateExplainRequestBody(body)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.messages[0].parts).toEqual([
        { type: 'text', text: '第一问' },
      ])
      expect(result.value.messages[1].parts).toEqual([
        { type: 'text', text: '第一答' },
      ])
    }
  })

  it('rejects empty messages, unknown roles and non-text parts', () => {
    const empty = createValidBody()
    empty.messages[0].parts = [{ type: 'text', text: '   ' }]
    expectInvalid(empty, '消息内容不能为空')

    const unknownRole = createValidBody()
    unknownRole.messages[0].role = 'system'
    expectInvalid(unknownRole, 'role 只允许')

    const unknownPart = createValidBody()
    unknownPart.messages[0].parts = [{ type: 'step-start' }]
    expectInvalid(unknownPart, '只允许 text part')
  })

  it('rejects unknown request fields and conversations not ending in user', () => {
    const unknownField = createValidBody()
    unknownField.unexpected = true
    expectInvalid(unknownField, '请求结构不合法')

    const assistantLast = createValidBody()
    assistantLast.messages[0].role = 'assistant'
    expectInvalid(assistantLast, '最后一条消息必须来自 user')
  })

  it('limits message count, individual text and total text', () => {
    const tooMany = createValidBody()
    tooMany.messages = Array.from(
      { length: MAX_EXPLAIN_MESSAGE_COUNT + 1 },
      (_, index) => ({
        id: `message-${index}`,
        role: 'user',
        parts: [{ type: 'text', text: 'x' }],
      }),
    )
    expectInvalid(tooMany, '消息数量')

    const singleTooLong = createValidBody()
    singleTooLong.messages = [
      {
        id: 'assistant-1',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: 'x'.repeat(MAX_EXPLAIN_MESSAGE_TEXT_LENGTH + 1),
          },
        ],
      },
      {
        id: 'user-1',
        role: 'user',
        parts: [{ type: 'text', text: '继续' }],
      },
    ]
    expectInvalid(singleTooLong, '单条消息')

    const totalTooLong = createValidBody()
    totalTooLong.messages = [
      ...Array.from({ length: 3 }, (_, index) => ({
        id: `assistant-${index}`,
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: 'x'.repeat(MAX_EXPLAIN_MESSAGE_TEXT_LENGTH),
          },
        ],
      })),
      {
        id: 'user-last',
        role: 'user',
        parts: [{ type: 'text', text: 'x' }],
      },
    ]
    expect(
      totalTooLong.messages.reduce(
        (total: number, message: Record<string, any>) =>
          total + message.parts[0].text.length,
        0,
      ),
    ).toBe(MAX_EXPLAIN_TOTAL_MESSAGE_TEXT_LENGTH + 1)
    expectInvalid(totalTooLong, '消息文本总长度')
  })

  it.each([
    ['baseURL', 'config', 'baseURL', MAX_AI_BASE_URL_LENGTH],
    ['API Key', 'config', 'apiKey', MAX_AI_API_KEY_LENGTH],
    ['model', 'config', 'model', MAX_AI_MODEL_LENGTH],
    ['引用 id', 'quote', 'id', MAX_AI_ID_LENGTH],
    ['pageTitle', 'quote', 'pageTitle', MAX_AI_PAGE_TITLE_LENGTH],
    ['pageUrl', 'quote', 'pageUrl', MAX_AI_PAGE_URL_LENGTH],
  ])('limits %s length', (label, section, field, maxLength) => {
    const body = createValidBody()
    body[section][field] = 'x'.repeat(maxLength + 1)

    expectInvalid(body, label)
  })

  it('limits message id length', () => {
    const body = createValidBody()
    body.messages[0].id = 'x'.repeat(MAX_AI_ID_LENGTH + 1)

    expectInvalid(body, '消息 id')
  })
})

describe('AI explain request body size', () => {
  it('rejects an oversized Content-Length with 413', () => {
    const result = validateContentLength(
      String(MAX_EXPLAIN_REQUEST_BODY_BYTES + 1),
    )

    expect(result).toEqual({
      ok: false,
      error: '请求体过大。',
      status: 413,
    })
  })

  it('counts actual UTF-8 bytes instead of JavaScript characters', async () => {
    const json = JSON.stringify({ value: '中文内容' })
    const utf8Bytes = new TextEncoder().encode(json).byteLength
    expect(utf8Bytes).toBeGreaterThan(json.length)

    const result = await readLimitedJsonBody(
      new Request('https://example.com/api/ai/explain', {
        method: 'POST',
        body: json,
      }),
      utf8Bytes - 1,
    )

    expect(result).toEqual({
      ok: false,
      error: '请求体过大。',
      status: 413,
    })
  })

  it('accepts JSON exactly at the UTF-8 byte limit', async () => {
    const json = JSON.stringify({ value: '中文内容' })
    const utf8Bytes = new TextEncoder().encode(json).byteLength
    const result = await readLimitedJsonBody(
      new Request('https://example.com/api/ai/explain', {
        method: 'POST',
        body: json,
      }),
      utf8Bytes,
    )

    expect(result).toEqual({
      ok: true,
      value: { value: '中文内容' },
    })
  })
})

describe('best-effort fixed-window rate limiter', () => {
  it('returns retry timing and resets after the window', () => {
    const limiter = new FixedWindowRateLimiter({
      limit: 2,
      windowMs: 10_000,
      maxEntries: 10,
    })

    expect(limiter.check('client-a', 1_000).allowed).toBe(true)
    expect(limiter.check('client-a', 1_100).allowed).toBe(true)
    expect(limiter.check('client-a', 1_500)).toMatchObject({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 10,
    })
    expect(limiter.check('client-a', 11_000)).toMatchObject({
      allowed: true,
      remaining: 1,
    })
  })

  it('evicts old entries instead of allowing the map to grow without bound', () => {
    const limiter = new FixedWindowRateLimiter({
      limit: 1,
      windowMs: 10_000,
      maxEntries: 2,
    })

    limiter.check('client-a', 0)
    limiter.check('client-b', 0)
    limiter.check('client-c', 0)

    expect(limiter.entryCount).toBe(2)
    expect(limiter.check('client-a', 1).allowed).toBe(true)
    expect(limiter.entryCount).toBe(2)
  })
})
