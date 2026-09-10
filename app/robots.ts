import type { MetadataRoute } from 'next'

import { absoluteSiteUrl, siteUrl } from '@/lib/site-url'

// Situation: 没有 robots.txt 时，搜索引擎缺少统一抓取规则和 sitemap 发现入口。
// Task: 明确允许公开知识库被抓取，并把爬虫引导到当前部署域名的 sitemap。
// Action: 使用 Next.js MetadataRoute 生成规则，URL 全部复用统一 siteUrl。
// Result: 部署后自动得到类型安全的 /robots.txt，不需要维护静态域名文件。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: absoluteSiteUrl('/sitemap.xml'),
    host: siteUrl,
  }
}
