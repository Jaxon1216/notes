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
