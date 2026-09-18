export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = process.env.UMAMI_API_URL?.replace(/\/$/, '')
  const websiteId = process.env.UMAMI_WEBSITE_ID
  const apiKey = process.env.UMAMI_API_KEY

  if (!baseUrl || !websiteId || !apiKey) {
    return Response.json({ error: 'Umami is not configured' }, { status: 500 })
  }

  try {
    const response = await fetch(`${baseUrl}/websites/${websiteId}/active`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    })

    if (!response.ok) {
      return Response.json({ error: 'Unable to read Umami active visitors' }, { status: 502 })
    }

    const { visitors } = (await response.json()) as { visitors: number }

    return Response.json(
      { online: visitors },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return Response.json({ error: 'Unable to reach Umami' }, { status: 502 })
  }
}
