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
    let timer: number | undefined

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

    function stopPolling() {
      if (timer !== undefined) {
        window.clearInterval(timer)
        timer = undefined
      }
    }

    function startPolling() {
      if (timer !== undefined) return
      timer = window.setInterval(() => void load(), pollInterval)
    }

    // Situation: 轮询常驻首页和每个文档页，后台标签页也会每 30 秒请求一次。
    // Task: 对齐粒子和 LogoLoop 的可见性约定，页面不可见时不再打点。
    // Action: 隐藏时停止轮询，重新可见时立即补一次数据并恢复定时器。
    // Result: 后台标签停止请求 /api/site-activity，前台体验和刷新频率保持不变。
    function handleVisibilityChange() {
      if (document.hidden) {
        stopPolling()
        return
      }

      void load()
      startPolling()
    }

    if (!document.hidden) {
      void load()
      startPolling()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelled = true
      stopPolling()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [endpoint, pollInterval])

  return (
    <section
      className={['docs-sidebar-activity', className].filter(Boolean).join(' ')}
      aria-label="站点动态"
      aria-live="polite"
    >
      <div className="docs-sidebar-activity__heading">
        <span className="docs-sidebar-activity__dot" aria-hidden="true" />
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
