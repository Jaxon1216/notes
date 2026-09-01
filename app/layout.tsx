import './global.css'

import { Analytics } from '@vercel/analytics/next'
import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SiteHeader } from '@/components/site/site-header'
import { getHomeData } from '@/lib/content'

export const metadata: Metadata = {
  title: {
    default: 'Easton Notes',
    template: '%s | Easton Notes',
  },
  description: '面向前端、服务端与 Agent 应用开发的个人技术知识库',
  icons: {
    icon: '/site-icon.png',
    apple: '/site-icon.png',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const homeData = getHomeData()

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          <SiteHeader data={homeData} />
          {children}
        </RootProvider>
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  )
}
