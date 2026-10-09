/**
 * Site-wide settings and the ROUTES REGISTRY. Every value here is a
 * PLACEHOLDER until the real brand, domain and copy are decided. Pages,
 * metadata, robots, sitemap, header and footer all read from this one file, so
 * adding a page, renaming a nav item or flipping a route's indexing happens
 * here and nowhere else.
 */

/** What a route is for. Drives chrome, indexing defaults and tracking. */
export type PageType = 'site' | 'lp' | 'conversion' | 'legal'

/** Position in the paid funnel. Only funnel routes carry one. */
export type FunnelStep = 'landing' | 'conversion'

export interface RouteEntry {
  /** Stable id used by pages, tracking attributes and analytics. Never rename. */
  key: RouteKey
  /** URL path, leading slash, no trailing slash. */
  path: string
  /** Placeholder metadata title (fed through the "%s | Testify" template). */
  title: string
  /** Label used when the route appears in a nav or footer list. */
  navLabel: string
  pageType: PageType
  /** Route-level index switch. Still gated by `siteConfig.indexable` (launch flag). */
  indexable: boolean
  /** Listed in sitemap.xml. Only ever true for indexable routes. */
  inSitemap: boolean
  /** Listed in the site header and the footer's site column. */
  inNav: boolean
  funnelStep?: FunnelStep
}

export type RouteKey = 'home' | 'about' | 'contact' | 'privacy' | 'terms' | 'lp' | 'lpConfirmation'

/**
 * Paid landing page indexing. Off by default: /lp is for paid traffic and
 * should not compete with the site pages in search. Flip to true to index it.
 */
const LP_INDEXABLE = false

/**
 * Every route the app serves, in display order. The (site) and (lp) route
 * groups under app/ must match `pageType`: `lp` and `conversion` routes live
 * under app/(lp), everything else under app/(site).
 */
export const routes = {
  home: {
    key: 'home',
    path: '/',
    title: 'Home',
    navLabel: 'Home',
    pageType: 'site',
    indexable: true,
    inSitemap: true,
    inNav: true,
  },
  about: {
    key: 'about',
    path: '/about',
    title: 'About',
    navLabel: 'About',
    pageType: 'site',
    indexable: true,
    inSitemap: true,
    inNav: true,
  },
  contact: {
    key: 'contact',
    path: '/contact',
    title: 'Contact',
    navLabel: 'Contact',
    pageType: 'site',
    indexable: true,
    inSitemap: true,
    inNav: true,
  },
  privacy: {
    key: 'privacy',
    path: '/privacy',
    title: 'Privacy policy',
    navLabel: 'Privacy',
    pageType: 'legal',
    indexable: true,
    inSitemap: true,
    inNav: false,
  },
  terms: {
    key: 'terms',
    path: '/terms',
    title: 'Terms of service',
    navLabel: 'Terms',
    pageType: 'legal',
    indexable: true,
    inSitemap: true,
    inNav: false,
  },
  lp: {
    key: 'lp',
    path: '/lp',
    title: 'Landing page',
    navLabel: 'Get started',
    pageType: 'lp',
    indexable: LP_INDEXABLE,
    inSitemap: LP_INDEXABLE,
    inNav: false,
    funnelStep: 'landing',
  },
  // The conversion page: where the LP form/checkout lands after a successful
  // submit. Always noindex and never in the sitemap (enforced in lib/metadata.ts
  // and app/sitemap.ts as well, not only by these flags).
  lpConfirmation: {
    key: 'lpConfirmation',
    path: '/lp/confirmation',
    title: 'Confirmation',
    navLabel: 'Confirmation',
    pageType: 'conversion',
    indexable: false,
    inSitemap: false,
    inNav: false,
    funnelStep: 'conversion',
  },
} as const satisfies Record<RouteKey, RouteEntry>

export const routeList: readonly RouteEntry[] = Object.values(routes)

export function getRoute(key: RouteKey): RouteEntry {
  return routes[key]
}

export interface NavLink {
  label: string
  href: string
}

function toNavLink(route: RouteEntry): NavLink {
  return { label: route.navLabel, href: route.path }
}

const url = (process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3200').replace(/\/+$/, '')

export const siteConfig = {
  /** Brand name shown in the header, footer, metadata and title template. */
  name: 'Testify',
  /** One-line description for metadata. */
  description: 'Placeholder description for the Testify website.',
  /** Canonical origin, no trailing slash. Read from NEXT_PUBLIC_SITE_URL. */
  url,
  /**
   * Launch gate. Stays false until launch, so a placeholder site is never
   * indexed. Flip with NEXT_PUBLIC_SITE_INDEXABLE=true on production only.
   * A route is indexed only when this AND its own `indexable` are true.
   */
  indexable: process.env['NEXT_PUBLIC_SITE_INDEXABLE'] === 'true',
  /** Site header and footer site column, generated from the registry. */
  nav: routeList.filter((route) => route.inNav).map(toNavLink),
  /** Legal links for both footers, generated from the registry. */
  legal: routeList.filter((route) => route.pageType === 'legal').map(toNavLink),
  /** Site header call to action: always the paid landing page. */
  cta: toNavLink(routes.lp),
}
