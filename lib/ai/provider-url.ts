import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

export const DEFAULT_ALLOWED_AI_HOSTS = [
  'api.openai.com',
  'api.deepseek.com',
  'openrouter.ai',
  'api.siliconflow.cn',
  'ark.cn-beijing.volces.com',
  'dashscope.aliyuncs.com',
  'api.moonshot.cn',
  'api.groq.com',
  'api.mistral.ai',
] as const

type AddressRecord = {
  address: string
}

type AddressResolver = (hostname: string) => Promise<readonly AddressRecord[]>

type ProviderBaseURLValidationOptions = {
  isProduction?: boolean
  allowedHosts?: ReadonlySet<string>
  resolveAddresses?: AddressResolver
}

export type ProviderBaseURLValidationResult =
  | {
      ok: true
      baseURL: string
    }
  | {
      ok: false
      error: string
    }

export function normalizeHostname(hostname: string) {
  return hostname
    .replace(/^\[(.*)]$/, '$1')
    .replace(/\.$/, '')
    .toLowerCase()
}

function parseIPv4(address: string) {
  if (isIP(address) !== 4) return null
  return address.split('.').map((part) => Number.parseInt(part, 10))
}

function getIPv4FromMappedIPv6(address: string) {
  const normalized = normalizeHostname(address)
  const match = /^::ffff:(.+)$/i.exec(normalized)
  if (!match) return null

  const suffix = match[1]
  if (isIP(suffix) === 4) return suffix

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

function isBlockedIPv4(address: string) {
  const parts = parseIPv4(address)
  if (!parts) return false

  const [first, second, third] = parts

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 0 && third === 0) ||
    (first === 192 && second === 0 && third === 2) ||
    (first === 192 && second === 168) ||
    (first === 198 && (second === 18 || second === 19)) ||
    (first === 198 && second === 51 && third === 100) ||
    (first === 203 && second === 0 && third === 113) ||
    first >= 224
  )
}

export function isBlockedNetworkAddress(address: string) {
  const normalized = normalizeHostname(address)
  const mappedIPv4 = getIPv4FromMappedIPv6(normalized)

  if (mappedIPv4) {
    return isBlockedIPv4(mappedIPv4)
  }

  if (isIP(normalized) === 4) {
    return isBlockedIPv4(normalized)
  }

  if (isIP(normalized) !== 6) {
    return false
  }

  if (normalized === '::' || normalized === '::1') {
    return true
  }

  const firstHextet = Number.parseInt(normalized.split(':')[0], 16)

  return (
    (firstHextet & 0xfe00) === 0xfc00 ||
    (firstHextet & 0xffc0) === 0xfe80 ||
    (firstHextet & 0xffc0) === 0xfec0 ||
    (firstHextet & 0xff00) === 0xff00 ||
    normalized.startsWith('2001:db8:')
  )
}

export function isBlockedHostname(hostname: string) {
  const normalized = normalizeHostname(hostname)

  return (
    normalized === 'localhost' ||
    normalized.endsWith('.localhost') ||
    normalized.endsWith('.local') ||
    isBlockedNetworkAddress(normalized)
  )
}

export function getAllowedAIHosts(
  configuredHosts = process.env.AI_ALLOWED_BASE_URL_HOSTS,
) {
  const extraHosts =
    configuredHosts
      ?.split(',')
      .map((host) => normalizeHostname(host.trim()))
      .filter(Boolean) ?? []

  return new Set([
    ...DEFAULT_ALLOWED_AI_HOSTS.map(normalizeHostname),
    ...extraHosts,
  ])
}

export function isAllowedAIHostname(
  hostname: string,
  allowedHosts: ReadonlySet<string>,
) {
  return allowedHosts.has(normalizeHostname(hostname))
}

async function resolvePublicAddresses(hostname: string) {
  return lookup(hostname, {
    all: true,
    verbatim: true,
  })
}

// Situation: 用户可配置 Provider URL，攻击者可能借服务端请求访问内网或元数据地址。
// Task: 只允许可信 HTTPS 域名，并防住直接 IP、DNS 私网解析和重定向绕过。
// Action: 校验协议与精确 allowlist，再解析全部地址并拒绝任一非公网 IPv4/IPv6。
// Result: 合法 OpenAI-compatible 服务可用，localhost 仅在开发环境例外放行。
export async function validateProviderBaseURL(
  value: string,
  options: ProviderBaseURLValidationOptions = {},
): Promise<ProviderBaseURLValidationResult> {
  let url: URL

  try {
    url = new URL(value)
  } catch {
    return { ok: false, error: 'baseURL 不是合法 URL。' }
  }

  const hostname = normalizeHostname(url.hostname)
  const isProduction =
    options.isProduction ?? process.env.NODE_ENV === 'production'
  const isLocalDevHost =
    !isProduction &&
    (hostname === 'localhost' || hostname === '127.0.0.1')

  if (url.username || url.password) {
    return { ok: false, error: 'baseURL 不能包含用户名或密码。' }
  }

  if (url.protocol !== 'https:' && !isLocalDevHost) {
    return { ok: false, error: '生产环境只允许使用 HTTPS baseURL。' }
  }

  if (
    isProduction &&
    !isAllowedAIHostname(
      hostname,
      options.allowedHosts ?? getAllowedAIHosts(),
    )
  ) {
    return {
      ok: false,
      error: '当前 baseURL 域名不在站点允许列表中。',
    }
  }

  if (!isLocalDevHost && isBlockedHostname(hostname)) {
    return { ok: false, error: 'baseURL 不能指向本机或内网地址。' }
  }

  if (!isLocalDevHost) {
    try {
      const records = await (
        options.resolveAddresses ?? resolvePublicAddresses
      )(hostname)

      if (
        records.length === 0 ||
        records.some((record) => isBlockedNetworkAddress(record.address))
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
