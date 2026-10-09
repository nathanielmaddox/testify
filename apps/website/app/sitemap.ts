import type { MetadataRoute } from 'next'
import { routeList, siteConfig } from '@/lib/site.config'

/**
 * Generated from the routes registry (`lib/site.config.ts`): every route with
 * `inSitemap` and its own `indexable` flag set. The launch flag gates
 * robots.txt, not this list. The conversion page is never listed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return routeList
    .filter((route) => route.inSitemap && route.indexable && route.pageType !== 'conversion')
    .map((route) => ({
      url: `${siteConfig.url}${route.path === '/' ? '' : route.path}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: route.path === '/' ? 1 : route.pageType === 'legal' ? 0.3 : 0.7,
    }))
}
