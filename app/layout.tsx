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
  // Situation: 1080x1080 PNG 曾同时承担 favicon 和 Apple 图标，单文件约 862 KB。
  // Task: 保持现有品牌图案和旧 PNG 路径，同时降低浏览器标签页的资源成本。
  // Action: favicon 改用轻量 SVG，Apple Touch Icon 使用缩放后的 180x180 PNG。
  // Result: PNG 降至约 54 KB，普通浏览器主要加载约 805 B 的矢量图标。
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
