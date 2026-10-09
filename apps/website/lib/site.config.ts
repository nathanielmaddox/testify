/**
 * Site-wide settings and the ROUTES REGISTRY. Every value here is a
 * PLACEHOLDER until the real brand, domain and copy are decided. Pages,
 * metadata, robots, sitemap, structured data, header and footer all read from
 * this one file, so adding a page, renaming a nav item or flipping a route's
 * indexing happens here and nowhere else.
 *
 * Imported by client components too, so env is read with DOT access
 * (`process.env.NEXT_PUBLIC_X`, typed in lib/env.d.ts), the form Next inlines.
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
  /** Placeholder meta / Open Graph / Twitter description for this route. */
  description: string
  /**
   * Last real content change, static ISO date (YYYY-MM-DD). Feeds the sitemap
   * `lastModified`. Bump it by hand when the page content really changes.
   */
  updated: string
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

export type RouteKey =
  'home' | 'work' | 'about' | 'contact' | 'privacy' | 'terms' | 'lp' | 'lpConfirmation'

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
    description: 'Placeholder home page description for Testify.',
    updated: '2026-10-09',
    navLabel: 'Home',
    pageType: 'site',
    indexable: true,
    inSitemap: true,
    inNav: true,
  },
  work: {
    key: 'work',
    path: '/work',
    title: 'Our work',
    description: 'Placeholder description of the Our work page.',
    updated: '2026-10-09',
    navLabel: 'Our work',
    pageType: 'site',
    indexable: true,
    inSitemap: true,
    inNav: true,
  },
  about: {
    key: 'about',
    path: '/about',
    title: 'About',
    description: 'Placeholder description of the About page.',
    updated: '2026-10-09',
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
    description: 'Placeholder description of the Contact page.',
    updated: '2026-10-09',
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
    description: 'Placeholder description of the privacy policy.',
    updated: '2026-10-09',
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
    description: 'Placeholder description of the terms of service.',
    updated: '2026-10-09',
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
    description: 'Placeholder landing page description for the Testify offer.',
    updated: '2026-10-09',
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
    description: 'Placeholder confirmation page description.',
    updated: '2026-10-09',
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

const DEV_SITE_URL = 'http://localhost:3200'

/**
 * Resolve the canonical origin. While the launch flag is off a missing URL
 * falls back to localhost so dev and previews keep working. Once the site is
 * indexable, a missing, localhost or *.vercel.app URL would publish wrong
 * canonicals, sitemap and structured data, so the build fails instead.
 */
export function resolveSiteUrl(raw: string | undefined, indexable: boolean): string {
  const value = (raw ?? '').trim().replace(/\/+$/, '')
  if (indexable) {
    let host = ''
    try {
      host = value ? new URL(value).hostname.toLowerCase() : ''
    } catch {
      host = ''
    }
    const isLocal = host === '' || host === 'localhost' || host === '127.0.0.1'
    if (isLocal || host.endsWith('.vercel.app')) {
      throw new Error(
        `NEXT_PUBLIC_SITE_INDEXABLE=true needs NEXT_PUBLIC_SITE_URL set to the real production origin (got "${raw ?? ''}"). Localhost and *.vercel.app are refused.`
      )
    }
  }
  return value || DEV_SITE_URL
}

const indexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true'

/** Social share image slot. `null` until a real image exists in public/. */
export interface ShareImage {
  /** Path under public/ (resolved against metadataBase) or absolute URL. */
  url: string
  width: number
  height: number
  alt: string
}

export const siteConfig = {
  /** Brand name shown in the header, footer, metadata and title template. */
  name: 'Testify',
  /** One-line description for metadata. */
  description: 'Placeholder description for the Testify website.',
  /** Canonical origin, no trailing slash. Read from NEXT_PUBLIC_SITE_URL. */
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, indexable),
  /**
   * Launch gate. Stays false until launch, so a placeholder site is never
   * indexed. Flip with NEXT_PUBLIC_SITE_INDEXABLE=true on production only.
   * A route is indexed only when this AND its own `indexable` are true.
   */
  indexable,
  /** Locale for Open Graph and the html lang. */
  locale: 'en_US',
  /** Favicon / app icon in public/. */
  icon: '/icon.svg',
  /**
   * Default Open Graph / Twitter image (1200x630). Placeholder slot: set to
   * e.g. `{ url: '/og.png', width: 1200, height: 630, alt: '...' }` once the
   * file exists in public/.
   */
  shareImage: null as ShareImage | null,
  /** Organization facts for JSON-LD. Placeholders. */
  organization: {
    legalName: 'Testify',
    /** Logo path in public/ for JSON-LD. */
    logo: '/icon.svg',
    /** Official profile URLs (social, directories) once they exist. */
    sameAs: [] as string[],
  },
  /**
   * The one offer. Drives Service/Offer JSON-LD and conversion values in
   * analytics (value + currency), so price changes happen here only.
   */
  offer: {
    /** Stable id for analytics `item_id` / `content_ids`. Never rename. */
    id: 'testify-offer',
    name: 'Placeholder offer name',
    description: 'Placeholder description of the Testify offer.',
    price: 99,
    currency: 'USD',
  },
  /** Site header and footer site column, generated from the registry. */
  nav: routeList.filter((route) => route.inNav).map(toNavLink),
  /** Legal links for both footers, generated from the registry. */
  legal: routeList.filter((route) => route.pageType === 'legal').map(toNavLink),
  /** Site header call to action: always the paid landing page. */
  cta: toNavLink(routes.lp),
}
