import type { Metadata } from 'next'
import { getRoute, siteConfig, type RouteEntry, type RouteKey } from './site.config'

/**
 * Whether a route may be indexed right now: the launch flag AND the route's
 * own flag. The conversion page is never indexable, whatever its flags say.
 */
export function isRouteIndexable(route: RouteEntry): boolean {
  if (route.pageType === 'conversion') return false
  return siteConfig.indexable && route.indexable
}

/** Per-page metadata from the routes registry: title, canonical, robots. */
export function pageMetadata(routeKey: RouteKey): Metadata {
  const route = getRoute(routeKey)
  const indexable = isRouteIndexable(route)
  return {
    title: route.title,
    alternates: { canonical: route.path },
    openGraph: { url: route.path },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  }
}
