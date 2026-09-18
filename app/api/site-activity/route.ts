export const dynamic = 'force-dynamic'

const PAGEVIEW_CACHE_MS = 5 * 60 * 1000

let pageviewCache: { value: number; expiresAt: number } | undefined

export async function GET() {
  const baseUrl = process.env.UMAMI_API_URL?.replace(/\/$/, '')
  const websiteId = process.env.UMAMI_WEBSITE_ID
  const apiKey = process.env.UMAMI_API_KEY

  if (!baseUrl || !websiteId || !apiKey) {
    return Response.json({ error: 'Umami is not configured' }, { status: 500 })
  }

  try {
    const onlineRequest = fetch(`${baseUrl}/websites/${websiteId}/active`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    })

    const cachedPageviews = pageviewCache
    const needsPageviewRefresh = !cachedPageviews || cachedPageviews.expiresAt < Date.now()
    const pageviewRequest = needsPageviewRefresh
      ? fetch(`${baseUrl}/websites/${websiteId}/stats?startAt=0&endAt=${Date.now()}`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          cache: 'no-store',
        })
      : undefined

    const [onlineResponse, pageviewResponse] = await Promise.all([
      onlineRequest,
      pageviewRequest,
    ])

    if (!onlineResponse.ok || (pageviewResponse && !pageviewResponse.ok)) {
      return Response.json({ error: 'Unable to read Umami activity' }, { status: 502 })
    }

    const { visitors } = (await onlineResponse.json()) as { visitors: number }
    let pageviewsTotal = cachedPageviews?.value

    if (pageviewResponse) {
      const { pageviews } = (await pageviewResponse.json()) as { pageviews: number }

      if (!Number.isFinite(pageviews)) {
        return Response.json({ error: 'Invalid Umami statistics response' }, { status: 502 })
      }

      pageviewsTotal = pageviews
      pageviewCache = { value: pageviews, expiresAt: Date.now() + PAGEVIEW_CACHE_MS }
    }

    if (!Number.isFinite(visitors) || !Number.isFinite(pageviewsTotal)) {
      return Response.json({ error: 'Invalid Umami activity response' }, { status: 502 })
    }

    return Response.json(
      { online: visitors, pageviewsTotal },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      },
    )
  } catch {
    return Response.json({ error: 'Unable to reach Umami' }, { status: 502 })
  }
}
