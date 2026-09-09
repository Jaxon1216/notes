import './global.css'

import { Analytics } from '@vercel/analytics/next'
import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SiteHeader } from '@/components/site/site-header'
import { getHomeData } from '@/lib/content'
import { siteUrl } from '@/lib/site-url'

const siteName = 'Easton Notes'
const siteDescription = '面向前端、服务端与 Agent 应用开发的个人技术知识库'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: 'summary',
    title: siteName,
    description: siteDescription,
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/site-icon.png', sizes: '180x180', type: 'image/png' }],
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
