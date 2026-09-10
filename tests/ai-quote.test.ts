import { describe, expect, it } from 'vitest'

import {
  appendToQuote,
  getCombinedQuoteLength,
} from '../components/ai/ai-quote'
import { MAX_QUOTE_LENGTH, type AiQuote } from '../lib/ai/config'

const quote: AiQuote = {
  id: 'session-1',
  text: 'first excerpt',
  pageTitle: 'Test page',
  pageUrl: '/docs/test',
}

describe('AI quote aggregation', () => {
  it('appends context without changing the active chat id', () => {
    const appended = appendToQuote(quote, 'second excerpt')

    expect(appended).toEqual({
      ...quote,
      text: 'first excerpt\n\nsecond excerpt',
    })
    expect(appended?.id).toBe(quote.id)
  })

  it('rejects an append that would exceed the request quote limit', () => {
    const fullQuote = {
      ...quote,
      text: 'a'.repeat(MAX_QUOTE_LENGTH - 2),
    }

    expect(getCombinedQuoteLength(fullQuote, 'b')).toBe(
      MAX_QUOTE_LENGTH + 1,
    )
    expect(appendToQuote(fullQuote, 'b')).toBeNull()
  })
})
