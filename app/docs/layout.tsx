import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'

import { AiExplainWidget } from '@/components/ai/ai-explain-widget'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={source.getPageTree()} tabMode="top" {...baseOptions()}>
      {children}
      <AiExplainWidget />
    </DocsLayout>
  )
}
