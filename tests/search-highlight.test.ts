import { describe, expect, it } from 'vitest'

import {
  createSearchHighlightRequest,
  hashFromHref,
  matchOffsets,
  parseSearchHighlightRequest,
  pathnameFromHref,
  plainSnippet,
  samePathname,
  searchTerms,
  snippetNeedle,
} from '../lib/search-highlight'

describe('search highlight terms', () => {
  it('keeps longer terms ahead and ignores case duplicates', () => {
    expect(searchTerms('  effect useEffect Effect ')).toEqual(['useEffect', 'effect'])
  })

  it('matches Chinese and Latin text without crossing a longer term', () => {
    expect(matchOffsets('先看闭包，再看 React Hooks 和 react', ['react hooks', '闭包', 'react'])).toEqual([
      { start: 2, end: 4 },
      { start: 8, end: 19 },
      { start: 22, end: 27 },
    ])
  })

  it('reads the document pathname and heading hash from a search result', () => {
    expect(pathnameFromHref('/docs/frontend/bagu#闭包', 'http://localhost:3000')).toBe(
      '/docs/frontend/bagu',
    )
    expect(hashFromHref('/docs/frontend/bagu#%E9%97%AD%E5%8C%85', 'http://localhost:3000')).toBe(
      '闭包',
    )
    expect(
      samePathname('/docs/前端', '/docs/%E5%89%8D%E7%AB%AF', 'http://localhost:3000'),
    ).toBe(true)
  })

  it('keeps the clicked snippet and drops the dialog highlight tags', () => {
    expect(plainSnippet('先看 <mark>宏任务</mark>，再看微任务')).toBe('先看 宏任务，再看微任务')
  })

  it('builds a needle around the clicked term', () => {
    const needle = snippetNeedle('这时候，事件循环，宏任务，微任务的关系如下', ['宏任务'])
    expect(needle).toContain('宏任务')
    expect(needle.length).toBeLessThanOrEqual(48)
  })

  it('round-trips a highlight request and rejects malformed payloads', () => {
    const request = createSearchHighlightRequest(
      '事件循环',
      '/docs/frontend/bagu/js#事件循环',
      '同步代码先执行，然后处理<mark>事件循环</mark>',
      'text',
      'http://localhost:3000',
      7,
    )

    expect(request).toEqual({
      id: 7,
      pathname: '/docs/frontend/bagu/js',
      hash: '事件循环',
      kind: 'text',
      terms: ['事件循环'],
      snippet: '同步代码先执行，然后处理事件循环',
    })
    expect(parseSearchHighlightRequest(JSON.stringify(request))).toEqual(request)
    expect(parseSearchHighlightRequest('{"pathname":"/docs","terms":["事件循环"]}')).toBeNull()
    expect(parseSearchHighlightRequest('not-json')).toBeNull()
  })
})
