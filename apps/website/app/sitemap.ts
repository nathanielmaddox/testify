import type { MetadataRoute } from 'next'
import { isRouteIndexable } from '@/lib/metadata'
import { routeList, siteConfig } from '@/lib/site.config'

/**
 * Generated from the routes registry (`lib/site.config.ts`). Empty while the
 * launch flag is off; after launch, every route with `inSitemap` that is
 * indexable right now (`isRouteIndexable`, which also always excludes the
 * conversion page). `lastModified` is the route's static `updated` date in
 * the registry, never request time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.indexable) return []
  return routeList
    .filter((route) => route.inSitemap && isRouteIndexable(route))
    .map((route) => ({
      url: `${siteConfig.url}${route.path === '/' ? '' : route.path}`,
      lastModified: route.updated,
      changeFrequency: 'monthly',
      priority: route.path === '/' ? 1 : route.pageType === 'legal' ? 0.3 : 0.7,
    }))
}
