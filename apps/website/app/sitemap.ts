import type { MetadataRoute } from 'next'
import { landingPages, lpPath } from '@/lib/landing_pages'
import { isLpIndexable, isRouteIndexable } from '@/lib/metadata'
import { routeList, siteConfig } from '@/lib/site.config'

/**
 * Generated from the routes registry (`lib/site.config.ts`) and the LP
 * registry (`lib/landing_pages.ts`). Empty while the launch flag is off;
 * after launch:
 * - every route with `inSitemap` that is indexable right now
 *   (`isRouteIndexable`, which also always excludes the conversion page; the
 *   `lp` / `lpConfirmation` templates have `inSitemap: false`)
 * - every LP that `isLpIndexable` (its own `indexable` + `status: 'live'`)
 * `lastModified` is the entry's static `updated` date, never request time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.indexable) return []
  const siteRoutes: MetadataRoute.Sitemap = routeList
    .filter((route) => route.inSitemap && isRouteIndexable(route))
    .map((route) => ({
      url: `${siteConfig.url}${route.path === '/' ? '' : route.path}`,
      lastModified: route.updated,
      changeFrequency: 'monthly',
      priority: route.path === '/' ? 1 : route.pageType === 'legal' ? 0.3 : 0.7,
    }))
  const lps: MetadataRoute.Sitemap = landingPages.filter(isLpIndexable).map((lp) => ({
    url: `${siteConfig.url}${lpPath(lp.slug)}`,
    lastModified: lp.updated,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))
  return [...siteRoutes, ...lps]
}
