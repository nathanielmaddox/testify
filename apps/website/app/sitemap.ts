import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site.config'

/** One entry per route listed in `siteConfig.routes`. Add routes there, not here. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return siteConfig.routes.map((route) => ({
    url: `${siteConfig.url}${route === '/' ? '' : route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }))
}
