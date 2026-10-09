/**
 * Site-wide settings and the ROUTES REGISTRY. Every value here is a
 * PLACEHOLDER until the real brand, domain and copy are decided. Pages,
 * metadata, robots, sitemap, structured data, header and footer all read from
 * this one file, so adding a page, renaming a nav item or flipping a route's
 * indexing happens here and nowhere else.
 *
 * Imported by client components too, so env is read with DOT access
 * (`process.env.NEXT_PUBLIC_X`, typed in lib/env.d.ts), the form Next inlines.
 *
 * Paid landing pages are NOT listed one by one here: `lp` and
 * `lpConfirmation` are route TEMPLATES (`/lp/[slug]`, `/lp/[slug]/confirmation`)
 * that hold the shared page type, funnel step and confirmation copy. Each LP
 * (slug, ad, layout, sections, title, indexing) lives in lib/landing_pages.ts.
 */
import { DEFAULT_LP_SLUG, lpPath } from './landing_pages'

/** What a route is for. Drives chrome, indexing defaults and tracking. */
export type PageType = 'site' | 'lp' | 'checkout' | 'conversion' | 'legal'

/** Position in the paid funnel. Only funnel routes carry one. */
export type FunnelStep = 'landing' | 'checkout' | 'conversion'

export interface RouteEntry {
  /** Stable id used by pages, tracking attributes and analytics. Never rename. */
  key: RouteKey
  /**
   * URL path, leading slash, no trailing slash. For the `lp` / `lpConfirmation`
   * templates this is the route PATTERN (`/lp/[slug]`), never linked directly:
   * build real hrefs with `lpPath(slug)` / `lpConfirmationPath(slug)`.
   */
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
  | 'home'
  | 'work'
  | 'workStory'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'lp'
  | 'lpCheckout'
  | 'lpConfirmation'

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
  // TEMPLATE for every client story (/work/<slug>, the case-study page).
  // Per-story title, description and indexing come from lib/work.ts; this
  // entry only carries the shared page type. Never in the sitemap as a route:
  // app/sitemap.ts lists indexable stories from the work registry.
  workStory: {
    key: 'workStory',
    path: '/work/[slug]',
    title: 'Client story',
    description: 'Placeholder description of a Testify client story.',
    updated: '2026-10-09',
    navLabel: 'Client story',
    pageType: 'site',
    indexable: false,
    inSitemap: false,
    inNav: false,
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
  // TEMPLATE for every paid landing page (/lp/<slug>). Per-LP title,
  // description and indexing come from lib/landing_pages.ts; this entry only
  // carries the shared page type and funnel step. Never in the sitemap as a
  // route: app/sitemap.ts lists indexable live LPs from the LP registry.
  lp: {
    key: 'lp',
    path: '/lp/[slug]',
    title: 'Landing page',
    description: 'Placeholder landing page description for the Testify offer.',
    updated: '2026-10-09',
    navLabel: 'Get started',
    pageType: 'lp',
    indexable: false,
    inSitemap: false,
    inNav: false,
    funnelStep: 'landing',
  },
  // TEMPLATE for every offer LP's PURCHASE page (/lp/<slug>/checkout): the
  // order summary + Stripe payment step between the LP and its confirmation.
  // Served only for LPs with an `offer` (lib/landing_pages.ts). Always
  // noindex, nofollow, never in the sitemap, Cache-Control no-store.
  lpCheckout: {
    key: 'lpCheckout',
    path: '/lp/[slug]/checkout',
    title: 'Checkout',
    description: 'Placeholder checkout page description.',
    updated: '2026-10-09',
    navLabel: 'Checkout',
    pageType: 'checkout',
    indexable: false,
    inSitemap: false,
    inNav: false,
    funnelStep: 'checkout',
  },
  // TEMPLATE for every LP's conversion page (/lp/<slug>/confirmation): where
  // that LP's form/checkout lands after a successful submit. Title and
  // description here are shared by all LPs. Always noindex and never in the
  // sitemap (enforced in lib/metadata.ts and app/sitemap.ts too).
  lpConfirmation: {
    key: 'lpConfirmation',
    path: '/lp/[slug]/confirmation',
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
  /** Site header call to action: the default paid landing page (lib/landing_pages.ts). */
  cta: { label: routes.lp.navLabel, href: lpPath(DEFAULT_LP_SLUG) } satisfies NavLink,
}
