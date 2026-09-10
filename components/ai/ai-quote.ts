import { MAX_QUOTE_LENGTH, type AiQuote } from '@/lib/ai/config'

const APPENDED_QUOTE_SEPARATOR = '\n\n'

export function getCombinedQuoteLength(quote: AiQuote, text: string) {
  return (
    quote.text.length +
    APPENDED_QUOTE_SEPARATOR.length +
    text.length
  )
}

export function appendToQuote(quote: AiQuote, text: string) {
  if (getCombinedQuoteLength(quote, text) > MAX_QUOTE_LENGTH) {
    return null
  }

  return {
    ...quote,
    text: `${quote.text}${APPENDED_QUOTE_SEPARATOR}${text}`,
  }
}
