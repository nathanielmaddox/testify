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
export const LP_LAYOUT_KEYS = ['template'] as const
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
] as const
export type LpSectionId = (typeof LP_SECTION_IDS)[number]

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
}

/** Placeholder value for any fact the owner has not confirmed yet. */
export const CONFIRM = '[CONFIRM]'

/** `confirmation` is a static child of /lp (old-URL redirect), so it can never be a slug. */
const RESERVED_SLUGS = new Set(['confirmation'])
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
