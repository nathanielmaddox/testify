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
  | 'getStarted'
  | 'getStartedBusiness'
  | 'getStartedGoals'
  | 'getStartedBook'
  | 'getStartedBooked'

/**
 * Every route the app serves, in display order. The (site) and (lp) route
 * groups under app/ must match `pageType`: `lp` and `conversion` routes live
 * under app/(lp), everything else under app/(site). The get-started flow is
 * the exception: its steps live under app/(flow) with their own chrome, and
 * its booked page (`conversion`) is the one flow route in that group.
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
  // Get started flow (app/(flow)): the site CTA lands on step 1. Steps 1 to 4
  // are noindex and off the sitemap; the booked page is the flow's conversion
  // page (always noindex, rendered per request). Answers live in sessionStorage
  // (lib/get_started.ts); nothing here is personal data.
  getStarted: {
    key: 'getStarted',
    path: '/get-started',
    title: 'Get started',
    description: 'Tell us about you and your business, then pick a time for your 15-minute call.',
    updated: '2026-10-21',
    navLabel: 'Get started',
    pageType: 'site',
    indexable: false,
    inSitemap: false,
    inNav: false,
  },
  getStartedBusiness: {
    key: 'getStartedBusiness',
    path: '/get-started/business',
    title: 'Your business',
    description: 'Tell us about the business: its name, its trade, its town and its team.',
    updated: '2026-10-21',
    navLabel: 'Your business',
    pageType: 'site',
    indexable: false,
    inSitemap: false,
    inNav: false,
  },
  getStartedGoals: {
    key: 'getStartedGoals',
    path: '/get-started/goals',
    title: 'Your goals',
    description:
      'Tell us what would help most, so the ideas we bring to the call fit your business.',
    updated: '2026-10-21',
    navLabel: 'Your goals',
    pageType: 'site',
    indexable: false,
    inSitemap: false,
    inNav: false,
  },
  getStartedBook: {
    key: 'getStartedBook',
    path: '/get-started/book',
    title: 'Book a time',
    description: 'Pick a day and a time for your 15-minute call.',
    updated: '2026-10-21',
    navLabel: 'Book a time',
    pageType: 'site',
    indexable: false,
    inSitemap: false,
    inNav: false,
  },
  getStartedBooked: {
    key: 'getStartedBooked',
    path: '/get-started/booked',
    title: "You're booked",
    description: 'Your call is booked. Your invite is on its way.',
    updated: '2026-10-21',
    navLabel: "You're booked",
    pageType: 'conversion',
    indexable: false,
    inSitemap: false,
    inNav: false,
    funnelStep: 'conversion',
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
    // Matches the LP offer (lib/landing_pages.ts, OFFER_99) so conversion values and JSON-LD name the same product.
    name: 'The Ready-to-Post Plan, monthly',
    // Same copy as the cold offer LP's description (done-for-you-99).
    description: 'Placeholder description of the Testify ready-to-post content offer.',
    price: 99,
    currency: 'USD',
  },
  /** Site header and footer site column, generated from the registry. */
  nav: routeList.filter((route) => route.inNav).map(toNavLink),
  /** Legal links for both footers, generated from the registry. */
  legal: routeList.filter((route) => route.pageType === 'legal').map(toNavLink),
  /** Site header call to action: starts the get-started flow (step 1). */
  cta: { label: 'Get started', href: routes.getStarted.path } satisfies NavLink,
}
