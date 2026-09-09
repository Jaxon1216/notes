import { describe, expect, it } from 'vitest'

import { resolveSiteUrl } from '../lib/site-url'

describe('site URL resolution', () => {
  it('prefers the explicit public site URL and removes trailing paths and slashes', () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: 'https://notes.example.com///',
        VERCEL_PROJECT_PRODUCTION_URL: 'production.vercel.app',
        VERCEL_URL: 'preview.vercel.app',
      }),
    ).toBe('https://notes.example.com')
  })

  it('falls back through Vercel production and deployment URLs', () => {
    expect(
      resolveSiteUrl({
        VERCEL_PROJECT_PRODUCTION_URL: 'production.vercel.app',
        VERCEL_URL: 'preview.vercel.app',
      }),
    ).toBe('https://production.vercel.app')

    expect(resolveSiteUrl({ VERCEL_URL: 'preview.vercel.app/' })).toBe(
      'https://preview.vercel.app',
    )
  })

  it('uses an explicit localhost origin without deployment variables', () => {
    expect(resolveSiteUrl({})).toBe('http://localhost:3000')
  })

  it('rejects non-HTTP site URLs', () => {
    expect(() =>
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'ftp://notes.example.com' }),
    ).toThrow('Site URL must use HTTP or HTTPS')
  })
})
