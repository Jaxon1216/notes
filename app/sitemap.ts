import type { MetadataRoute } from 'next'

import { absoluteSiteUrl } from '@/lib/site-url'
import { source } from '@/lib/source'

// Situation: 文档持续增删，手写 sitemap 很容易漏页或保留已经失效的地址。
// Task: 让搜索引擎发现首页和所有可构建文档，同时保持单一内容数据源。
// Action: 直接从 Fumadocs source 读取页面 URL，再统一转换成绝对地址。
// Result: 每次构建都会自动生成与当前内容树一致的 /sitemap.xml。
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', ...source.getPages().map((page) => page.url)].map((url) => ({
    url: absoluteSiteUrl(url),
  }))
}
