/**
 * LANDING-PAGE REGISTRY. One entry per paid landing page, keyed by slug. The
 * slug names the ad / campaign the page is built for, and the page lives at
 * `/lp/<slug>` (its Paper frame is named `lp/<slug>` too). Every LP can have
 * its own layout, so the entry says which layout component renders it and
 * which sections it shows, in order.
 *
 * Adding an LP = one entry here (plus, optionally, a new layout component in
 * components/lp/layouts/ registered in its layout map). Routes, static
 * params, metadata, sitemap, tracking attributes and attribution all read
 * from this file.
 *
 * Server-safe and client-safe: no DS, no browser globals, no env reads.
 * Imports nothing from site.config.ts (site.config imports this file).
 */

/** Ad platform the LP's traffic comes from. */
export type LpChannel = 'meta' | 'google' | 'tiktok' | 'other'

/** `draft` LPs are served (for review) but never indexed or listed; `live` LPs are in rotation. */
export type LpStatus = 'draft' | 'live'

/**
 * Layout components that can render an LP. Each key maps to a component in
 * components/lp/layouts/index.ts (`LP_LAYOUTS`). Add the key here and the
 * component there together.
 */
export const LP_LAYOUT_KEYS = ['template', 'offer-99-cold', 'offer-99-retarget'] as const
export type LpLayoutKey = (typeof LP_LAYOUT_KEYS)[number]

/**
 * Every section slot an LP can list. A layout declares which of these it can
 * render; the build fails if an entry lists a section its layout does not
 * support (checked in components/lp/layouts/index.ts).
 */
export const LP_SECTION_IDS = [
  'hero',
  'proof',
  'process',
  'honesty',
  'guarantee',
  'faq',
  'form',
  // Direct-response slots used by the offer LPs (layouts `offer-99-*`).
  'problem',
  'mechanism',
  'offer-stack',
  'objections',
  'objections-faq',
  'final-cta',
] as const
export type LpSectionId = (typeof LP_SECTION_IDS)[number]

/** Billing interval of a subscription offer. */
export type LpOfferInterval = 'month' | 'year'

/**
 * What an LP sells when it sells directly (a paid checkout, not a lead
 * form). An LP WITH an offer sends its buy CTAs to
 * `/lp/<offer.checkoutSlug>/checkout` (the purchase page); several LPs (cold,
 * retargeting) share one checkout by naming the same `checkoutSlug`. The
 * checkout page renders only for slugs whose entry has an offer.
 *
 * The Stripe price id is NOT here (this module reads no env): the server maps
 * `checkoutSlug` to its price env var in lib/checkout_server.ts.
 */
export interface LpOffer {
  /** Product name for the order summary and analytics. Placeholder. */
  name: string
  /** Price per interval in whole currency units (99 = $99.00). */
  price: number
  /** ISO 4217, upper case. */
  currency: 'USD'
  interval: LpOfferInterval
  /**
   * Slug of the LP that hosts this offer's checkout page
   * (`/lp/<checkoutSlug>/checkout`). Must be an LP with an offer whose
   * `checkoutSlug` is itself (validated at load).
   */
  checkoutSlug: string
}

export interface LandingPage {
  /**
   * URL segment and stable analytics id: `/lp/<slug>`, `data-page-key`
   * `lp:<slug>`, event param `lp_slug`. Name it after the ad it serves.
   * Lowercase kebab-case. Never rename once traffic has run on it.
   */
  slug: string
  /** Internal name for humans (reports, the Paper frame description). */
  name: string
  /** The ad / campaign this page serves. `[CONFIRM]` until the ad exists. */
  campaign: string
  channel: LpChannel
  /** The offer angle / hook the page argues. Placeholder until written. */
  offerAngle: string
  /** Which layout component renders the page. */
  layout: LpLayoutKey
  /** Ordered section slot ids the layout renders. */
  sections: readonly LpSectionId[]
  /** Metadata title (fed through the "%s | Testify" template). Placeholder. */
  title: string
  /** Meta / Open Graph / Twitter description. Placeholder. */
  description: string
  /**
   * Index switch for this LP. Default false: paid pages should not compete
   * with site pages in search. Still gated by the launch flag and `status`.
   */
  indexable: boolean
  status: LpStatus
  /** Last real content change, static ISO date (YYYY-MM-DD), for the sitemap. */
  updated: string
  /** What this LP sells through `/lp/<checkoutSlug>/checkout`. Absent = no checkout. */
  offer?: LpOffer
}

/** Placeholder value for any fact the owner has not confirmed yet. */
export const CONFIRM = '[CONFIRM]'

/**
 * `confirmation` is a static child of /lp (old-URL redirect), so it can never
 * be a slug; `checkout` is reserved so `/lp/checkout` never reads as an LP.
 */
const RESERVED_SLUGS = new Set(['confirmation', 'checkout'])

/**
 * The $99/month offer: content CREATION, delivered ready to post (not
 * account management). Shared by its cold and retargeting LPs; both check
 * out on `/lp/done-for-you-99/checkout`. Terms are `[CONFIRM]` in the brief.
 */
const OFFER_99 = {
  name: 'Ready-to-Post Content, monthly',
  price: 99,
  currency: 'USD',
  interval: 'month',
  checkoutSlug: 'done-for-you-99',
} as const satisfies LpOffer
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const ENTRIES = [
  {
    slug: 'sample-ad',
    name: 'Sample ad LP (template)',
    campaign: CONFIRM,
    channel: 'meta',
    offerAngle: CONFIRM,
    layout: 'template',
    sections: ['hero', 'proof', 'process', 'honesty', 'guarantee', 'faq', 'form'],
    title: 'Landing page',
    description: 'Placeholder landing page description for the Testify offer.',
    indexable: false,
    status: 'draft',
    updated: '2026-10-09',
  },
  {
    // Cold paid social (Meta). Direct-response order: hook, proof, problem,
    // mechanism, offer stack, risk reversal, objections, close.
    slug: 'done-for-you-99',
    name: '$99/month ready-to-post content, cold (Meta)',
    campaign: CONFIRM,
    channel: 'meta',
    offerAngle: CONFIRM,
    layout: 'offer-99-cold',
    sections: [
      'hero',
      'proof',
      'problem',
      'mechanism',
      'offer-stack',
      'guarantee',
      'objections-faq',
      'final-cta',
    ],
    title: 'Ready-to-post content',
    description: 'Placeholder description of the Testify ready-to-post content offer.',
    indexable: false,
    status: 'draft',
    updated: '2026-10-09',
    offer: OFFER_99,
  },
  {
    // Retargeting (visited, did not buy): objections first, then proof, the
    // stack and risk reversal again, then the close.
    slug: 'done-for-you-99-back',
    name: '$99/month ready-to-post content, retargeting',
    campaign: CONFIRM,
    channel: 'meta',
    offerAngle: CONFIRM,
    layout: 'offer-99-retarget',
    sections: ['hero', 'objections', 'proof', 'offer-stack', 'guarantee', 'final-cta'],
    title: 'Ready-to-post content',
    description: 'Placeholder description of the Testify ready-to-post content offer.',
    indexable: false,
    status: 'draft',
    updated: '2026-10-09',
    offer: OFFER_99,
  },
] as const satisfies readonly LandingPage[]

/** Where the bare `/lp` (and old `/lp/confirmation`) links go, and the site header CTA. */
export const DEFAULT_LP_SLUG: string = 'sample-ad'

function validate(entries: readonly LandingPage[]): void {
  const seen = new Set<string>()
  for (const entry of entries) {
    if (!SLUG_RE.test(entry.slug)) throw new Error(`LP slug "${entry.slug}" must be kebab-case.`)
    if (RESERVED_SLUGS.has(entry.slug)) throw new Error(`LP slug "${entry.slug}" is reserved.`)
    if (seen.has(entry.slug)) throw new Error(`LP slug "${entry.slug}" is listed twice.`)
    if (new Set(entry.sections).size !== entry.sections.length) {
      throw new Error(`LP "${entry.slug}" lists a section twice.`)
    }
    seen.add(entry.slug)
  }
  // Every offer checks out on an LP that exists, sells an offer and hosts its
  // own checkout, so a checkout page never points somewhere else.
  const index = new Map(entries.map((entry) => [entry.slug, entry]))
  for (const entry of entries) {
    if (!entry.offer) continue
    const host = index.get(entry.offer.checkoutSlug)
    if (!host?.offer || host.offer.checkoutSlug !== host.slug) {
      throw new Error(
        `LP "${entry.slug}" checks out on "${entry.offer.checkoutSlug}", which is not an LP hosting its own checkout.`
      )
    }
  }
  if (!seen.has(DEFAULT_LP_SLUG))
    throw new Error(`DEFAULT_LP_SLUG "${DEFAULT_LP_SLUG}" is not an LP.`)
}

validate(ENTRIES)

/** Every LP, in registry order. */
export const landingPages: readonly LandingPage[] = ENTRIES

const bySlug = new Map<string, LandingPage>(landingPages.map((entry) => [entry.slug, entry]))

/** The LP for a slug, or null when no such LP exists. */
export function getLandingPage(slug: string): LandingPage | null {
  return bySlug.get(slug) ?? null
}

export function getDefaultLandingPage(): LandingPage {
  return bySlug.get(DEFAULT_LP_SLUG) as LandingPage
}

/** `/lp/<slug>` */
export function lpPath(slug: string): string {
  return `/lp/${slug}`
}

/** `/lp/<slug>/confirmation` */
export function lpConfirmationPath(slug: string): string {
  return `${lpPath(slug)}/confirmation`
}

/** `/lp/<slug>/checkout` (the purchase page). */
export function lpCheckoutPath(slug: string): string {
  return `${lpPath(slug)}/checkout`
}

/**
 * Where an LP's buy CTAs go: `/lp/<offer.checkoutSlug>/checkout`, or null
 * when the LP sells nothing directly. Add stored attribution AFTER mount
 * (`useAttributedHref` / `withStoredAttribution`), never during render.
 */
export function lpCheckoutHref(lp: LandingPage): string | null {
  return lp.offer ? lpCheckoutPath(lp.offer.checkoutSlug) : null
}

/**
 * Whether `/lp/<slug>/checkout` is served: the LP exists and has an offer.
 * The checkout page itself belongs to the HOST LP (`offer.checkoutSlug`);
 * an LP that only shares an offer redirects there (see the checkout route).
 */
export function getOfferLandingPage(slug: string): LandingPage | null {
  const lp = bySlug.get(slug)
  return lp?.offer ? lp : null
}

/** LP slugs that host a checkout page (their offer's `checkoutSlug` is themselves). */
export function checkoutHostSlugs(): string[] {
  return landingPages
    .filter((lp) => lp.offer && lp.offer.checkoutSlug === lp.slug)
    .map((lp) => lp.slug)
}

/** Analytics page key of an LP: `lp:<slug>`. */
export function lpPageKey(slug: string): `lp:${string}` {
  return `lp:${slug}`
}

/** Paper frame name for an LP design: `lp/<slug>`. */
export function lpFrameName(slug: string): string {
  return `lp/${slug}`
}

/**
 * The LP slug a path belongs to (`/lp/<slug>` or `/lp/<slug>/...`), or ''
 * when the path is not a registered LP. Used by attribution.
 */
export function lpSlugFromPath(pathname: string): string {
  const match = /^\/lp\/([^/?#]+)/.exec(pathname)
  const slug = match?.[1] ?? ''
  return bySlug.has(slug) ? slug : ''
}
