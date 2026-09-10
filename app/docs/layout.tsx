import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'

import { AiExplainWidget } from '@/components/ai/ai-explain-widget'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

export default function Layout({ children }: { children: ReactNode }) {
  // Situation: 文档移动端曾同时渲染全站头部和 Fumadocs 头部，占用两行空间。
  // Task: 只在文档小屏场景移除重复头部，不能影响首页或桌面文档导航。
  // Action: 给 DocsLayout 增加专用边界类，由响应式 CSS 精确切换头部和高度变量。
  // Result: 移动端保留搜索、侧栏和目录能力，首屏减少一整行重复导航。
  return (
    <DocsLayout
      containerProps={{ className: 'docs-layout' }}
      tree={source.getPageTree()}
      tabs={false}
      {...baseOptions()}
    >
      {children}
      <AiExplainWidget />
    </DocsLayout>
  )
}
