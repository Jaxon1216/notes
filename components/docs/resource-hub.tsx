import {
  ArrowUpRight,
  BookOpenText,
  Boxes,
  HeartHandshake,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'

import { RESOURCE_ENTRIES, type ResourceKind } from '@/lib/resource-directory'

type ResourceHubItem = {
  title: string
  description: string
  href: string
  kinds: ResourceKind[]
  icon: typeof BookOpenText
  tone: 'blue' | 'violet' | 'amber' | 'rose'
}

const RESOURCE_HUB_ITEMS: ResourceHubItem[] = [
  {
    title: '优质博客',
    description: '只收录持续写作、主题清晰，值得长期订阅的独立技术博客。',
    href: '/docs/resources/blogs',
    kinds: ['blog'],
    icon: BookOpenText,
    tone: 'blue',
  },
  {
    title: '开源项目',
    description: '挑选可读源码、可实际运行，或能借鉴工程设计的项目。',
    href: '/docs/resources/projects',
    kinds: ['project'],
    icon: Boxes,
    tone: 'violet',
  },
  {
    title: '工具与平台',
    description: '收录日常开发、部署、协作与观测中真正节省时间的工具。',
    href: '/docs/resources/tools',
    kinds: ['tool'],
    icon: Wrench,
    tone: 'amber',
  },
  {
    title: '友情链接',
    description: '认识持续写作、认真做项目，也值得长期关注的独立站点。',
    href: '/docs/resources/friends',
    kinds: [],
    icon: HeartHandshake,
    tone: 'rose',
  },
]

function countEntries(kinds: ResourceKind[]) {
  return RESOURCE_ENTRIES.filter((entry) => kinds.includes(entry.kind)).length
}

export function ResourceHub() {
  return (
    <section className="resource-hub" aria-label="资源中心分类">
      <div className="resource-hub__intro">
        <p>RESOURCE HUB</p>
        <h2>把值得收藏的链接，整理成下一次行动的入口。</h2>
        <span>
          每一类都使用统一的数据结构维护，填入固定字段后即可自动生成卡片。
        </span>
      </div>

      <div className="resource-hub__grid">
        {RESOURCE_HUB_ITEMS.map((item) => {
          const Icon = item.icon
          const count = item.kinds.length ? countEntries(item.kinds) : null

          return (
            <Link
              className="resource-hub__card"
              data-tone={item.tone}
              href={item.href}
              key={item.href}
              prefetch={false}
            >
              <span className="resource-hub__icon">
                <Icon aria-hidden="true" size={21} />
              </span>
              <span className="resource-hub__card-body">
                <span className="resource-hub__card-topline">
                  <strong>{item.title}</strong>
                  {count === null ? (
                    <em>持续收录</em>
                  ) : (
                    <em>{count ? `${count} 项` : '待收录'}</em>
                  )}
                </span>
                <span>{item.description}</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="resource-hub__arrow" size={18} />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
