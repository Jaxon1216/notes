const LOCAL_SITE_URL = 'http://localhost:3000'

type SiteUrlEnvironment = {
  [key: string]: string | undefined
  NEXT_PUBLIC_SITE_URL?: string
  VERCEL_PROJECT_PRODUCTION_URL?: string
  VERCEL_URL?: string
}

function firstConfiguredUrl(environment: SiteUrlEnvironment) {
  return [
    environment.NEXT_PUBLIC_SITE_URL,
    environment.VERCEL_PROJECT_PRODUCTION_URL,
    environment.VERCEL_URL,
  ].find((value) => value?.trim())
}

function addProtocol(value: string) {
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(value)) return value
  return `https://${value}`
}

// Situation: 本地、Vercel 生产域名和 Preview 域名来源不同，SEO URL 又必须是绝对地址。
// Task: 用一个确定的优先级得到合法 HTTP(S) origin，避免各路由各自拼接域名。
// Action: 优先读取显式站点 URL，再回退生产/预览变量，最后使用本地地址。
// Result: canonical、OpenGraph、robots 和 sitemap 始终共享同一个规范化源地址。
export function resolveSiteUrl(environment: SiteUrlEnvironment = process.env) {
  const configuredUrl = firstConfiguredUrl(environment)
  const candidate = configuredUrl
    ? addProtocol(configuredUrl.trim())
    : LOCAL_SITE_URL
  const parsedUrl = new URL(candidate)

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new TypeError('Site URL must use HTTP or HTTPS')
  }

  return parsedUrl.origin
}

export const siteUrl = resolveSiteUrl()

export function absoluteSiteUrl(pathname = '/') {
  return new URL(pathname, `${siteUrl}/`).toString()
}
