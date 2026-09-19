import { ArrowUpRight } from 'lucide-react'

import type { LinkEntry } from '@/lib/link-entry'

type LinkCollectionProps<T extends LinkEntry> = {
  entries: readonly T[]
  empty: {
    title: string
    description: string
  }
  className?: string
  getTrackingEvent?: (entry: T) => string | undefined
  variant?: 'standard' | 'featured'
  showDomain?: boolean
}

function getLinkDomain(href: string) {
  return new URL(href).hostname.replace(/^www\./, '')
}

// 所有外部站点目录复用同一组字段：标题、使用场景、描述、链接。
// 数据只需遵循 LinkEntry 即可渲染，避免每种资源页面各自维护卡片结构。
export function LinkCollection<T extends LinkEntry>({
  entries,
  empty,
  className = '',
  getTrackingEvent,
  variant = 'standard',
  showDomain = false,
}: LinkCollectionProps<T>) {
  if (!entries.length) {
    return (
      <section className={`link-collection link-collection--empty ${className}`}>
        <p>{empty.title}</p>
        <span>{empty.description}</span>
      </section>
    )
  }

  return (
    <section
      className={`link-collection ${className}`}
      aria-label="站点目录"
      data-variant={variant}
    >
      <div className="link-collection__list">
        {entries.map((entry) => {
          // Umami 会自动监听带有 data-umami-event 的链接，无需客户端脚本或事件处理器。
          const trackingEvent = getTrackingEvent?.(entry)
          const eventAttributes = trackingEvent
            ? {
                'data-umami-event': trackingEvent,
                'data-umami-event-site': entry.title,
                'data-umami-event-target': entry.href,
              }
            : {}

          return (
            <article className="link-collection__card" key={entry.href}>
              <div className="link-collection__card-header">
                <div className="link-collection__title">
                  {showDomain ? (
                    <p className="link-collection__domain">
                      {getLinkDomain(entry.href)}
                    </p>
                  ) : null}
                  <h3>{entry.title}</h3>
                </div>
                <a
                  aria-label={`在新标签页打开 ${entry.title}`}
                  href={entry.href}
                  rel="noreferrer"
                  target="_blank"
                  {...eventAttributes}
                >
                  <ArrowUpRight aria-hidden="true" size={17} />
                </a>
              </div>
              <dl>
                <div>
                  <dt>使用场景</dt>
                  <dd>{entry.scenario}</dd>
                </div>
                <div>
                  <dt>描述</dt>
                  <dd>{entry.description}</dd>
                </div>
              </dl>
              <a
                className="link-collection__visit"
                href={entry.href}
                rel="noreferrer"
                target="_blank"
                {...eventAttributes}
              >
                访问站点 <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            </article>
          )
        })}
      </div>
    </section>
  )
}
