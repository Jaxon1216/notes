export const SEARCH_HIGHLIGHT_STORAGE_KEY = 'easton-docs-search-highlight'
export const SEARCH_HIGHLIGHT_EVENT = 'easton-docs-search-highlight'
export const SEARCH_HIGHLIGHT_NAME = 'docs-search'

const MAX_TERMS = 8
const MAX_TERM_LENGTH = 64

export type SearchHighlightKind = 'page' | 'heading' | 'text'

export type SearchHighlightRequest = {
  id: number
  pathname: string
  hash: string
  kind: SearchHighlightKind
  terms: string[]
  snippet: string
}

export function searchTerms(query: string): string[] {
  const seen = new Set<string>()
  const terms: string[] = []

  for (const part of query.trim().split(/\s+/)) {
    const term = part.trim().slice(0, MAX_TERM_LENGTH)
    if (!term) continue

    const key = term.toLocaleLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    terms.push(term)
    if (terms.length >= MAX_TERMS) break
  }

  return terms.sort((left, right) => right.length - left.length)
}

export function matchOffsets(
  text: string,
  terms: string[],
): Array<{ start: number; end: number }> {
  if (text.length === 0 || terms.length === 0) return []

  const pattern = new RegExp(terms.map(escapeRegExp).join('|'), 'giu')
  const matches: Array<{ start: number; end: number }> = []

  for (const match of text.matchAll(pattern)) {
    if (match.index === undefined || match[0].length === 0) continue
    matches.push({ start: match.index, end: match.index + match[0].length })
  }

  return matches
}

export function pathnameFromHref(href: string, base: string): string | null {
  try {
    return new URL(href, base).pathname
  } catch {
    return null
  }
}

export function samePathname(left: string, right: string, base: string): boolean {
  const normalizedLeft = pathnameFromHref(left, base)
  const normalizedRight = pathnameFromHref(right, base)
  return normalizedLeft !== null && normalizedLeft === normalizedRight
}

export function hashFromHref(href: string, base: string): string {
  try {
    const hash = new URL(href, base).hash
    if (!hash) return ''
    return decodeURIComponent(hash.slice(1))
  } catch {
    return ''
  }
}

export function plainSnippet(content: string): string {
  return content
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180)
}

export function normalizeSearchText(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toLocaleLowerCase()
}

export function snippetNeedle(snippet: string, terms: string[]): string {
  const normalized = normalizeSearchText(snippet)
  if (!normalized) return ''

  let index = -1
  for (const term of terms) {
    const found = normalized.indexOf(term.toLocaleLowerCase())
    if (found !== -1 && (index === -1 || found < index)) index = found
  }

  if (index === -1) return normalized.slice(0, 40)
  const start = Math.max(0, index - 12)
  return normalized.slice(start, start + 48)
}

export function createSearchHighlightRequest(
  query: string,
  href: string,
  content: string,
  kind: SearchHighlightKind,
  base: string,
  id = Date.now(),
): SearchHighlightRequest | null {
  const terms = searchTerms(query)
  const pathname = pathnameFromHref(href, base)
  if (!pathname || terms.length === 0) return null
  return {
    id,
    pathname,
    hash: hashFromHref(href, base),
    kind,
    terms,
    snippet: plainSnippet(content),
  }
}

export function parseSearchHighlightRequest(raw: string): SearchHighlightRequest | null {
  try {
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object') return null

    const record = value as Record<string, unknown>
    if (typeof record.pathname !== 'string' || !record.pathname.startsWith('/')) return null
    if (record.kind !== 'page' && record.kind !== 'heading' && record.kind !== 'text') return null
    if (typeof record.hash !== 'string') return null
    if (typeof record.snippet !== 'string') return null
    if (!Array.isArray(record.terms) || record.terms.length === 0) return null
    if (record.terms.some((term) => typeof term !== 'string' || term.length === 0)) return null

    return {
      id: typeof record.id === 'number' ? record.id : 0,
      pathname: record.pathname,
      hash: record.hash,
      kind: record.kind,
      terms: record.terms,
      snippet: record.snippet,
    }
  } catch {
    return null
  }
}

export function publishSearchHighlight(
  query: string,
  href: string,
  content: string,
  kind: SearchHighlightKind,
) {
  if (typeof window === 'undefined') return

  const request = createSearchHighlightRequest(
    query,
    href,
    content,
    kind,
    window.location.origin,
  )
  if (!request) return

  sessionStorage.setItem(SEARCH_HIGHLIGHT_STORAGE_KEY, JSON.stringify(request))
  window.dispatchEvent(new Event(SEARCH_HIGHLIGHT_EVENT))
}

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
