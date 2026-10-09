import type { Metadata } from 'next'
import { lpCheckoutPath, lpConfirmationPath, lpPath, type LandingPage } from './landing_pages'
import { getRoute, routes, siteConfig, type RouteEntry, type RouteKey } from './site.config'
import { isWorkPublic, workPath, type WorkStory } from './work'

/**
 * Metadata builders. Next merges metadata SHALLOWLY: a page's `openGraph` or
 * `twitter` object replaces the root one wholesale. So every page object is
 * built from the same base here (type, siteName, locale, image slot), never
 * from a bare `{ url }`.
 */

type OpenGraph = NonNullable<Metadata['openGraph']>
type Twitter = NonNullable<Metadata['twitter']>
type Robots = NonNullable<Metadata['robots']>

/**
 * Whether a route may be indexed right now: the launch flag AND the route's
 * own flag. The conversion and checkout pages are never indexable, whatever
 * their flags say.
 */
export function isRouteIndexable(route: RouteEntry): boolean {
  if (route.pageType === 'conversion' || route.pageType === 'checkout') return false
  return siteConfig.indexable && route.indexable
}

/**
 * Whether an LP may be indexed right now: the launch flag AND the LP's own
 * `indexable` AND `status: 'live'` (a draft LP is never indexed).
 */
export function isLpIndexable(lp: LandingPage): boolean {
  return siteConfig.indexable && lp.indexable && lp.status === 'live'
}

/**
 * Whether a client story may be indexed right now: the launch flag AND
 * `status: 'published'` AND `consent: 'approved'` (`isWorkPublic`). Preview
 * stories (drafts, pending consent) are never indexed.
 */
export function isWorkIndexable(story: WorkStory): boolean {
  return siteConfig.indexable && isWorkPublic(story)
}

/** Full document title as the template renders it (og/twitter skip the template). */
function fullTitle(route: RouteEntry | null): string {
  if (!route || route.path === '/') return siteConfig.name
  return `${route.title} | ${siteConfig.name}`
}

function shareImages() {
  const image = siteConfig.shareImage
  return image ? [{ ...image }] : undefined
}

/** Shared Open Graph fields every page carries. `url` only when given. */
export function baseOpenGraph(input: {
  title: string
  description: string
  url?: string
}): OpenGraph {
  const images = shareImages()
  return {
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: input.title,
    description: input.description,
    ...(input.url ? { url: input.url } : {}),
    ...(images ? { images } : {}),
  }
}

/** Shared Twitter card fields. Large card only once a share image exists. */
export function baseTwitter(input: { title: string; description: string }): Twitter {
  const images = shareImages()
  return {
    card: images ? 'summary_large_image' : 'summary',
    title: input.title,
    description: input.description,
    ...(images ? { images: images.map((image) => image.url) } : {}),
  }
}

/**
 * Robots per route:
 * - indexable (launch flag on + route flag on): index, follow
 * - the paid LP when not indexable: noindex, FOLLOW (its links stay crawlable)
 * - everything else when not indexable, and the conversion page always:
 *   noindex, nofollow
 */
export function routeRobots(route: RouteEntry): Robots {
  if (isRouteIndexable(route)) return { index: true, follow: true }
  if (route.pageType === 'lp') return { index: false, follow: true }
  return { index: false, follow: false }
}

/**
 * Root layout metadata. Deliberately has NO canonical and NO og:url, so a
 * route that forgets `pageMetadata` never claims to be the home page.
 */
export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    icons: {
      icon: [{ url: siteConfig.icon, type: 'image/svg+xml' }],
    },
    openGraph: baseOpenGraph({ title: siteConfig.name, description: siteConfig.description }),
    twitter: baseTwitter({ title: siteConfig.name, description: siteConfig.description }),
    robots: siteConfig.indexable ? { index: true, follow: true } : { index: false, follow: false },
  }
}

/**
 * Per-page metadata from the routes registry: title, description, robots,
 * Open Graph and Twitter (merged over the shared base), and a canonical only
 * when the route is indexable (a noindex page names no canonical).
 */
export function pageMetadata(routeKey: RouteKey): Metadata {
  const route = getRoute(routeKey)
  const indexable = isRouteIndexable(route)
  const title = fullTitle(route)
  const social = { title, description: route.description }
  return {
    // Home uses the bare brand name; other routes go through the template.
    title: route.path === '/' ? { absolute: siteConfig.name } : route.title,
    description: route.description,
    ...(indexable ? { alternates: { canonical: route.path } } : {}),
    openGraph: baseOpenGraph({ ...social, url: route.path }),
    twitter: baseTwitter(social),
    robots: routeRobots(route),
  }
}

/**
 * Metadata for one paid landing page (`/lp/<slug>`), from the LP registry
 * (lib/landing_pages.ts). `noindex, follow` unless `isLpIndexable`; a
 * canonical only when indexable.
 */
export function lpMetadata(lp: LandingPage): Metadata {
  const indexable = isLpIndexable(lp)
  const path = lpPath(lp.slug)
  const social = { title: `${lp.title} | ${siteConfig.name}`, description: lp.description }
  return {
    title: lp.title,
    description: lp.description,
    ...(indexable ? { alternates: { canonical: path } } : {}),
    openGraph: baseOpenGraph({ ...social, url: path }),
    twitter: baseTwitter(social),
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
  }
}

/**
 * Metadata for an LP's conversion page (`/lp/<slug>/confirmation`). Copy is
 * shared by every LP (the `lpConfirmation` route template); always
 * `noindex, nofollow`, never a canonical.
 */
export function lpConfirmationMetadata(lp: LandingPage): Metadata {
  const route = routes.lpConfirmation
  const social = { title: fullTitle(route), description: route.description }
  return {
    title: route.title,
    description: route.description,
    openGraph: baseOpenGraph({ ...social, url: lpConfirmationPath(lp.slug) }),
    twitter: baseTwitter(social),
    robots: routeRobots(route),
  }
}

/**
 * Metadata for an offer LP's purchase page (`/lp/<slug>/checkout`). Copy is
 * shared by every checkout (the `lpCheckout` route template) with the offer
 * name in the title; always `noindex, nofollow`, never a canonical.
 */
export function lpCheckoutMetadata(lp: LandingPage): Metadata {
  const route = routes.lpCheckout
  const title = lp.offer ? `${route.title}: ${lp.offer.name}` : route.title
  const social = { title: `${title} | ${siteConfig.name}`, description: route.description }
  return {
    title,
    description: route.description,
    openGraph: baseOpenGraph({ ...social, url: lpCheckoutPath(lp.slug) }),
    twitter: baseTwitter(social),
    robots: routeRobots(route),
  }
}

/**
 * Metadata for one client story (`/work/<slug>`), from the work registry
 * (lib/work.ts). `index, follow` + canonical only when `isWorkIndexable`;
 * otherwise `noindex, nofollow` and no canonical.
 */
export function workStoryMetadata(story: WorkStory): Metadata {
  const indexable = isWorkIndexable(story)
  const path = workPath(story.slug)
  const social = { title: `${story.title} | ${siteConfig.name}`, description: story.description }
  return {
    title: story.title,
    description: story.description,
    ...(indexable ? { alternates: { canonical: path } } : {}),
    openGraph: baseOpenGraph({ ...social, url: path }),
    twitter: baseTwitter(social),
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  }
}
