import { describe, expect, it, vi } from 'vitest'

import {
  isAllowedAIHostname,
  isBlockedHostname,
  isBlockedNetworkAddress,
  validateProviderBaseURL,
} from '../lib/ai/provider-url'

describe('AI provider SSRF address boundaries', () => {
  it.each([
    ['0.255.255.255', true],
    ['1.0.0.1', false],
    ['9.255.255.255', false],
    ['10.0.0.0', true],
    ['10.255.255.255', true],
    ['11.0.0.0', false],
    ['100.63.255.255', false],
    ['100.64.0.0', true],
    ['100.127.255.255', true],
    ['100.128.0.0', false],
    ['127.255.255.255', true],
    ['128.0.0.0', false],
    ['169.253.255.255', false],
    ['169.254.0.0', true],
    ['169.254.255.255', true],
    ['169.255.0.0', false],
    ['172.15.255.255', false],
    ['172.16.0.0', true],
    ['172.31.255.255', true],
    ['172.32.0.0', false],
    ['192.168.0.1', true],
    ['192.169.0.1', false],
    ['::', true],
    ['::1', true],
    ['::ffff:127.0.0.1', true],
    ['::ffff:7f00:1', true],
    ['fc00::1', true],
    ['fdff::1', true],
    ['fe7f::1', false],
    ['fe80::1', true],
    ['febf::1', true],
    ['fec0::1', true],
    ['feff:ffff::1', true],
    ['ff00::1', true],
    ['ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', true],
    ['2606:4700:4700::1111', false],
  ])('classifies %s as blocked=%s', (address, blocked) => {
    expect(isBlockedNetworkAddress(address)).toBe(blocked)
  })

  it.each([
    ['localhost', true],
    ['docs.localhost', true],
    ['provider.local', true],
    ['notlocalhost.example', false],
    ['local.example.com', false],
  ])('classifies host %s as blocked=%s', (hostname, blocked) => {
    expect(isBlockedHostname(hostname)).toBe(blocked)
  })
})

describe('AI provider host validation', () => {
  it('matches production allowlist hosts exactly', () => {
    const allowedHosts = new Set(['api.example.com'])

    expect(isAllowedAIHostname('API.EXAMPLE.COM.', allowedHosts)).toBe(true)
    expect(isAllowedAIHostname('api.example.com.evil.test', allowedHosts)).toBe(
      false,
    )
    expect(isAllowedAIHostname('example.com', allowedHosts)).toBe(false)
  })

  it('accepts an allowlisted HTTPS host that resolves publicly', async () => {
    const result = await validateProviderBaseURL(
      'https://api.example.com/v1/',
      {
        isProduction: true,
        allowedHosts: new Set(['api.example.com']),
        resolveAddresses: async () => [{ address: '8.8.8.8' }],
      },
    )

    expect(result).toEqual({
      ok: true,
      baseURL: 'https://api.example.com/v1',
    })
  })

  it('rejects lookalike hosts before DNS lookup', async () => {
    const resolveAddresses = vi.fn(async () => [{ address: '8.8.8.8' }])
    const result = await validateProviderBaseURL(
      'https://api.example.com.evil.test/v1',
      {
        isProduction: true,
        allowedHosts: new Set(['api.example.com']),
        resolveAddresses,
      },
    )

    expect(result.ok).toBe(false)
    expect(resolveAddresses).not.toHaveBeenCalled()
  })

  it('rejects a public hostname when any DNS answer is private', async () => {
    const result = await validateProviderBaseURL(
      'https://api.example.com/v1',
      {
        isProduction: true,
        allowedHosts: new Set(['api.example.com']),
        resolveAddresses: async () => [
          { address: '8.8.8.8' },
          { address: '10.0.0.1' },
        ],
      },
    )

    expect(result).toEqual({
      ok: false,
      error: 'baseURL 不能指向本机或内网地址。',
    })
  })

  it('allows only localhost and 127.0.0.1 to use HTTP in development', async () => {
    const resolveAddresses = vi.fn(async () => [{ address: '8.8.8.8' }])

    await expect(
      validateProviderBaseURL('http://localhost:1234/v1', {
        isProduction: false,
        resolveAddresses,
      }),
    ).resolves.toEqual({
      ok: true,
      baseURL: 'http://localhost:1234/v1',
    })

    expect(resolveAddresses).not.toHaveBeenCalled()

    const publicHttp = await validateProviderBaseURL(
      'http://api.example.com/v1',
      {
        isProduction: false,
        resolveAddresses,
      },
    )
    expect(publicHttp.ok).toBe(false)
  })

  it('rejects direct private addresses and URL credentials', async () => {
    await expect(
      validateProviderBaseURL('https://192.168.1.1/v1', {
        isProduction: false,
      }),
    ).resolves.toMatchObject({ ok: false })

    await expect(
      validateProviderBaseURL('https://user:secret@api.example.com/v1', {
        isProduction: false,
        resolveAddresses: async () => [{ address: '8.8.8.8' }],
      }),
    ).resolves.toEqual({
      ok: false,
      error: 'baseURL 不能包含用户名或密码。',
    })
  })
})
