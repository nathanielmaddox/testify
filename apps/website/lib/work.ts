/**
 * WORK REGISTRY ("Our work"). One entry per client story, keyed by slug. The
 * listing `/work` shows the featured story and the story grid from here, and
 * each story is told on the case-study template at `/work/<slug>`.
 *
 * Adding a story = one entry here. Static params, metadata, sitemap,
 * breadcrumb JSON-LD, tracking attributes and the listing all read from this
 * file. Every client fact is a `[CONFIRM]` placeholder until the owner and
 * the client sign it off.
 *
 * CONSENT RULE (who sees what):
 * - PUBLIC = `status: 'published'` AND `consent: 'approved'`. Only public
 *   stories are listed on /work, served at /work/<slug> in a production
 *   build, and (with the launch flag on) indexed and put in the sitemap.
 * - Anything else (a draft, or a published story whose consent is still
 *   pending) is a PREVIEW story: rendered only while previews are on
 *   (`next dev`, or a build with `NEXT_PUBLIC_WORK_PREVIEW=true`), always
 *   `noindex, nofollow`, never in the sitemap. Previews off = 404.
 * - The preview flag can never be on together with the launch flag
 *   (`NEXT_PUBLIC_SITE_INDEXABLE=true`): that build fails here.
 *
 * Server-safe and client-safe: no DS, no browser globals. Env is read with
 * dot access (typed in lib/env.d.ts). Imports nothing from site.config.ts.
 */

/** Trade a story belongs to. Drives the `?trade=` filter on /work. */
export const WORK_TRADES = [
  'trades-home-services',
  'clinics-med-spas',
  'salons-beauty',
  'local-pros',
] as const
export type WorkTrade = (typeof WORK_TRADES)[number]

/** Value of the `?trade=` filter: a trade, or `all` (missing or unknown). */
export type WorkTradeFilter = WorkTrade | 'all'

/** `draft` = being written; `published` = signed off for the public site. */
export type WorkStatus = 'draft' | 'published'

/** Client consent to tell the story publicly. Only `approved` can ever go public. */
export type WorkConsent = 'pending' | 'approved'

/**
 * Every section slot the case-study template (`/work/<slug>`) can render, in
 * template order. Paper frame: "Testify Web - Our work / Case study".
 */
export const WORK_SECTION_IDS = [
  'story-hero',
  'stats',
  'snapshot',
  'before-after',
  'what-broken',
  'timeline',
  'what-changed',
  'can-show-cant-claim',
  'in-their-words',
  'differently-next',
  'next-story',
  'cta',
] as const
export type WorkSectionId = (typeof WORK_SECTION_IDS)[number]

/** One number on the story, always with where it came from. */
export interface WorkStat {
  label: string
  value: string
  /** Where the number comes from, plus its date range. */
  source: string
}

export interface WorkStory {
  /**
   * URL segment and stable analytics id: `/work/<slug>`, `data-page-key`
   * `work:<slug>`. Lowercase kebab-case. Never rename once public.
   */
  slug: string
  /** Client business name as shown on the page. Placeholder until consent. */
  clientName: string
  trade: WorkTrade
  town: string
  /** Outcome headline (story hero, featured card, grid card). Placeholder. */
  outcomeHeadline: string
  /** e.g. "90 days". */
  timeframe: string
  /** Testify services used on this engagement. */
  servicesUsed: readonly string[]
  /** The one story in the listing's featured slot. At most one public story. */
  featured: boolean
  status: WorkStatus
  consent: WorkConsent
  /** Story numbers, each with its source. Placeholders until real. */
  stats: readonly WorkStat[]
  /** Ordered section slot ids the case-study template renders. */
  sections: readonly WorkSectionId[]
  /** Metadata title (fed through the "%s | Testify" template). Placeholder. */
  title: string
  /** Meta / Open Graph / Twitter description. Placeholder. */
  description: string
  /** Last real content change, static ISO date (YYYY-MM-DD), for the sitemap. */
  updated: string
}

/** Placeholder value for any fact the owner has not confirmed yet. */
export const CONFIRM = '[CONFIRM]'

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const ENTRIES = [
  {
    slug: 'sample-story',
    clientName: `${CONFIRM} Client name`,
    trade: 'trades-home-services',
    town: `${CONFIRM} Town`,
    outcomeHeadline: `${CONFIRM} From a page that went quiet to [N] videos a month, 90 days in`,
    timeframe: '90 days',
    servicesUsed: [`${CONFIRM} Service`],
    featured: true,
    status: 'draft',
    consent: 'pending',
    stats: [
      { label: `${CONFIRM} Stat 1`, value: '[N]', source: `${CONFIRM} Source, date range` },
      { label: `${CONFIRM} Stat 2`, value: '[N]', source: `${CONFIRM} Source, date range` },
      { label: `${CONFIRM} Stat 3`, value: '[N]', source: `${CONFIRM} Source, date range` },
    ],
    sections: WORK_SECTION_IDS,
    title: 'Sample story',
    description: 'Placeholder description of a Testify client story.',
    updated: '2026-10-09',
  },
] as const satisfies readonly WorkStory[]

/**
 * Previews (drafts and not-yet-consented stories) render in `next dev`, or
 * in a build with NEXT_PUBLIC_WORK_PREVIEW=true. Never with the launch flag.
 */
const previewFlag = process.env.NEXT_PUBLIC_WORK_PREVIEW === 'true'
if (previewFlag && process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true') {
  throw new Error(
    'NEXT_PUBLIC_WORK_PREVIEW=true cannot be used with NEXT_PUBLIC_SITE_INDEXABLE=true: unconsented stories would go live.'
  )
}
export const workPreviewEnabled: boolean = previewFlag || process.env.NODE_ENV === 'development'

function validate(entries: readonly WorkStory[]): void {
  const seen = new Set<string>()
  for (const entry of entries) {
    if (!SLUG_RE.test(entry.slug)) throw new Error(`Work slug "${entry.slug}" must be kebab-case.`)
    if (seen.has(entry.slug)) throw new Error(`Work slug "${entry.slug}" is listed twice.`)
    if (new Set(entry.sections).size !== entry.sections.length) {
      throw new Error(`Work story "${entry.slug}" lists a section twice.`)
    }
    if (entry.stats.some((stat) => !stat.source.trim())) {
      throw new Error(`Work story "${entry.slug}" has a stat without a source.`)
    }
    seen.add(entry.slug)
  }
  const featuredPublic = entries.filter((entry) => entry.featured && isWorkPublic(entry))
  if (featuredPublic.length > 1) {
    throw new Error(`More than one public story is featured: ${featuredPublic.map((e) => e.slug)}`)
  }
}

/** Published AND consent approved: the only stories the public may ever see. */
export function isWorkPublic(story: WorkStory): boolean {
  return story.status === 'published' && story.consent === 'approved'
}

/** Whether /work/<slug> renders in this build (public, or previews on). */
export function isWorkViewable(story: WorkStory): boolean {
  return isWorkPublic(story) || workPreviewEnabled
}

validate(ENTRIES)

/** Every story in the registry, in registry order (viewable or not). */
export const workStories: readonly WorkStory[] = ENTRIES

/** Stories this build serves and lists, in registry order. */
export const viewableWorkStories: readonly WorkStory[] = workStories.filter(isWorkViewable)

const bySlug = new Map<string, WorkStory>(workStories.map((entry) => [entry.slug, entry]))

/** The story for a slug, or null when no such story exists. */
export function getWorkStory(slug: string): WorkStory | null {
  return bySlug.get(slug) ?? null
}

/** The story for a slug only when this build may render it, else null (404). */
export function getViewableWorkStory(slug: string): WorkStory | null {
  const story = getWorkStory(slug)
  return story && isWorkViewable(story) ? story : null
}

/** The listing's featured story: the first viewable `featured` story, or null. */
export function getFeaturedWorkStory(): WorkStory | null {
  return viewableWorkStories.find((story) => story.featured) ?? null
}

/** The listing grid: every viewable story except the featured one. */
export function getWorkGridStories(): readonly WorkStory[] {
  const featured = getFeaturedWorkStory()
  return viewableWorkStories.filter((story) => story !== featured)
}

/** The story after this one (wraps), for the "next story" slot; null if alone. */
export function getNextWorkStory(slug: string): WorkStory | null {
  const index = viewableWorkStories.findIndex((story) => story.slug === slug)
  if (index < 0 || viewableWorkStories.length < 2) return null
  return viewableWorkStories[(index + 1) % viewableWorkStories.length] ?? null
}

/** Parse `?trade=`: a known trade, else `all`. */
export function parseWorkTrade(raw: string | string[] | null | undefined): WorkTradeFilter {
  const value = Array.isArray(raw) ? raw[0] : raw
  return (WORK_TRADES as readonly string[]).includes(value ?? '') ? (value as WorkTrade) : 'all'
}

/** `/work/<slug>` */
export function workPath(slug: string): string {
  return `/work/${slug}`
}

/** Analytics page key of a story: `work:<slug>`. */
export function workPageKey(slug: string): `work:${string}` {
  return `work:${slug}`
}

/** Paper frames: the listing and the case-study template. */
export const WORK_FRAMES = {
  listing: 'Testify Web - Our work',
  story: 'Testify Web - Our work / Case study',
} as const
