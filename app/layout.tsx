import './global.css'

import { Analytics } from '@vercel/analytics/next'
import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Metadata } from 'next'
import Script from 'next/script'
import type { ReactNode } from 'react'

import { SiteHeader } from '@/components/site/site-header'
import { getHomeData } from '@/lib/content'
import { siteUrl } from '@/lib/site-url'

const siteName = 'Easton Notes'
const siteDescription = '面向前端、服务端与 Agent 应用开发的个人技术知识库'

// Situation: 相对 canonical 和 OpenGraph URL 缺少统一站点源地址时会生成错误链接。
// Task: 让首页、文档页和社交分享元数据在本地与 Vercel 环境中使用同一基准。
// Action: 由 siteUrl 提供 metadataBase，并在根布局声明默认 canonical 与分享信息。
// Result: 搜索引擎和社交平台可以稳定识别站点主页，文档页再按路由覆盖 URL。
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
  // Situation: 站点图标此前区分轻量 SVG favicon 与 180x180 PNG 的 Apple 图标。
  // Task: 按需求移除独立 favicon，统一改用 site-icon.png 承担浏览器与 Apple 图标。
  // Action: icon 与 apple 均指向 site-icon.png，并删除不再引用的 favicon.svg。
  // Result: 全站图标来源单一，浏览器标签页与桌面书签共用同一品牌图案。
  icons: {
    icon: [{ url: '/site-icon.png', type: 'image/png' }],
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
        {process.env.VERCEL ? (
          <Script
            defer
            src="https://umami.jiangxu.net/script.js"
            data-website-id="e7c41115-bc88-4f80-b82b-4afa3b749f5f"
          />
        ) : null}
      </body>
    </html>
  )
}
