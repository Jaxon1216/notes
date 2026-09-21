'use client'

import { useEffect, useState } from 'react'

type SiteActivity = {
  online: number
  pageviewsTotal: number
}

type DocsSidebarActivityProps = {
  className?: string
  endpoint?: string
  pollInterval?: number
  summary?: {
    value: string
    label: string
  }
}

function formatCount(value: number) {
  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: 0,
    notation: value >= 100_000 ? 'compact' : 'standard',
  }).format(value)
}

export function DocsSidebarActivity({
  className,
  endpoint = '/api/site-activity',
  pollInterval = 30_000,
  summary,
}: DocsSidebarActivityProps) {
  const [activity, setActivity] = useState<SiteActivity | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch(endpoint, { cache: 'no-store' })

        if (!response.ok) throw new Error('Site activity request failed')

        const data = (await response.json()) as SiteActivity

        if (!Number.isFinite(data.online) || !Number.isFinite(data.pageviewsTotal)) {
          throw new Error('Site activity response is invalid')
        }

        if (!cancelled) setActivity(data)
      } catch {
        if (!cancelled) setActivity(null)
      }
    }

    void load()
    const timer = window.setInterval(() => void load(), pollInterval)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [endpoint, pollInterval])

  return (
    <section
      className={['docs-sidebar-activity', className].filter(Boolean).join(' ')}
      aria-label="站点动态"
      aria-live="polite"
    >
      <div className="docs-sidebar-activity__heading">
        <span className="docs-sidebar-activity__pulse" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>站点动态</span>
        <span className="docs-sidebar-activity__realtime">实时</span>
      </div>
      <div className="docs-sidebar-activity__metrics">
        {summary ? (
          <div className="docs-sidebar-activity__metric">
            <strong>{summary.value}</strong>
            <span>{summary.label}</span>
          </div>
        ) : null}
        <div className="docs-sidebar-activity__metric">
          <strong>{activity ? formatCount(activity.online) : '—'}</strong>
          <span>人正在阅读</span>
        </div>
        <div className="docs-sidebar-activity__metric">
          <strong>{activity ? formatCount(activity.pageviewsTotal) : '—'}</strong>
          <span>累计浏览</span>
        </div>
      </div>
    </section>
  )
}
