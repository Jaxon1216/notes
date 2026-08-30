import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { CSSProperties, ReactNode } from 'react'

import { AiExplainWidget } from '@/components/ai/ai-explain-widget'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

export default function Layout({ children }: { children: ReactNode }) {
  const docsContainerStyle = {
    '--fd-banner-height': 'var(--site-header-height)',
  } as CSSProperties

  return (
    <DocsLayout
      containerProps={{ style: docsContainerStyle }}
      tree={source.getPageTree()}
      tabMode="top"
      {...baseOptions()}
    >
      {children}
      <AiExplainWidget />
    </DocsLayout>
  )
}
