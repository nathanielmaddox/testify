import type { Metadata } from 'next'
import { adminConfig, routes, type AdminRouteKey } from './admin.config'

/**
 * Metadata builders for @testify/admin. The admin is internal and is never
 * indexed: every page is noindex, nofollow. There is no Open Graph, no
 * canonical and no sitemap.
 */

const NOT_INDEXED = { index: false, follow: false } as const

/**
 * Root layout metadata: the title template and the icon. No canonical, so a
 * page without `pageMetadata` never claims a canonical URL.
 */
export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(adminConfig.url),
    title: {
      default: adminConfig.name,
      template: `%s | ${adminConfig.name}`,
    },
    description: adminConfig.description,
    applicationName: adminConfig.name,
    icons: {
      icon: [{ url: adminConfig.icon, type: 'image/svg+xml' }],
    },
    robots: NOT_INDEXED,
  }
}

/** Per-page metadata from the routes registry: title, description and noindex. */
export function pageMetadata(routeKey: AdminRouteKey): Metadata {
  const route = routes[routeKey]
  return {
    title: route.title,
    description: route.description,
    robots: NOT_INDEXED,
  }
}
