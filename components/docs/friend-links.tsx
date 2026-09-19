import { Plus } from 'lucide-react'

import { LinkCollection } from '@/components/docs/link-collection'
import { FRIEND_LINKS } from '@/lib/friend-links'

export function FriendLinks() {
  return (
    <section className="friend-links" aria-label="友情链接">
      <LinkCollection
        className="friend-links__collection"
        empty={{
          title: '第一位友链，正在等你。',
          description: '这里不做流量交换列表，只收录持续产出、内容可信的个人技术站或开源社区。',
        }}
        entries={FRIEND_LINKS}
        getTrackingEvent={(entry) => entry.trackingEvent}
        showDomain
        variant="featured"
      />

      <div className="friend-links__apply">
        <Plus aria-hidden="true" size={18} />
        <div>
          <strong>想加入这份清单？</strong>
          <span>
            在 GitHub Issue 或 PR 中留下站点名称、HTTPS 地址、简介与本站链接，我们会定期核验。
          </span>
        </div>
      </div>
    </section>
  )
}
