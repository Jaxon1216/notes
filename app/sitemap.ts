import type { MetadataRoute } from 'next'

import { absoluteSiteUrl } from '@/lib/site-url'
import { source } from '@/lib/source'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', ...source.getPages().map((page) => page.url)].map((url) => ({
    url: absoluteSiteUrl(url),
  }))
}
