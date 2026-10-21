/**
 * WORK REGISTRY ("Our work"). One entry per client story, keyed by slug. The
 * listing `/work` shows the featured story and the story grid from here, and
 * each story is told on the case-study template at `/work/<slug>`.
 *
 * Adding a story = one entry here. Static params, metadata, sitemap,
 * breadcrumb JSON-LD, tracking attributes and the listing all read from this
 * file. Copy is Paper's own text, with the placeholders kept ([NAME], [N],
 * [TRADE], [TOWN], [MONTH], [DATE RANGE]). Client facts that Paper does not
 * show (client name, service, page title) are `[CONFIRM]` until signed off.
 *
 * CONSENT RULE (who sees what):
 * - PUBLIC = `status: 'published'` AND `consent: 'approved'`. Only public
 *   stories are listed on /work, served at /work/<slug> in a production
 *   build, and (with the launch flag on) indexed and put in the sitemap.
 * - Anything else (a draft, or a published story whose consent is still
 *   pending) is a PREVIEW story: rendered only while previews are on
 *   (`next dev`, or a build with `NEXT_PUBLIC_WORK_PREVIEW=true`), always
 *   `noindex, nofollow`, never in the sitemap. Previews off = 404.
 * - The status and consent fields are the real gate. Placeholder copy alone
 *   never keeps a story out of production, and production shows no story
 *   until its consent is approved, by design.
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
 * Paper order. Paper frame: "Testify Web - Our work / Case study". Top to
 * bottom: hero, snapshot, what was broken, timeline, before/after, proof,
 * quote, differently, stats panel, next story, closing CTA.
 */
export const WORK_SECTION_IDS = [
  'story-hero',
  'snapshot',
  'what-broken',
  'timeline',
  'before-after',
  'what-changed',
  'in-their-words',
  'differently-next',
  'stats',
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

/**
 * One figure on a listing card (the featured card shows one, a grid card
 * shows two). The caption is Paper's full line under the figure, source
 * included, e.g. "Owner time · Source: [DATE RANGE]".
 */
export interface WorkCardFigure {
  value: string
  caption: string
}

/** One labelled fact in the snapshot strip. */
export interface WorkFact {
  label: string
  value: string
}

/** One of the four 90-day steps: what the owner did, and what we did. */
export interface WorkTimelineStep {
  /** Column heading, e.g. "First week". */
  title: string
  /** Lane "What [NAME] did", in minutes. */
  owner: string
  /** Lane "What we did". */
  we: string
}

/** One row of the before/after comparison, same row in both columns. */
export interface WorkBeforeAfterRow {
  label: string
  before: string
  after: string
}

/**
 * Story copy for the case-study template, verbatim from the Paper frame with
 * placeholders kept. Each block maps to one template section.
 */
export interface WorkStoryContent {
  hero: {
    /** Pill above the headline, e.g. "[TRADE] social media case study · [TOWN], [ST]". */
    kicker: string
    /** One summary paragraph under the headline. */
    summary: string
    /** Byline under the CTAs: "[NAME], owner, [BUSINESS], [TOWN]". */
    byline: string
  }
  snapshot: readonly WorkFact[]
  broken: {
    kicker: string
    heading: string
    /** Three short paragraphs in the owner's terms. */
    paragraphs: readonly string[]
    /** Caption under the "before" profile. */
    profileNote: string
  }
  timeline: {
    kicker: string
    heading: string
    /** Four steps in column order. */
    steps: readonly [WorkTimelineStep, WorkTimelineStep, WorkTimelineStep, WorkTimelineStep]
    /** Closing total line under the swimlane. */
    total: string
  }
  beforeAfter: {
    kicker: string
    heading: string
    /** Column heads for the two panels. */
    beforeHead: string
    afterHead: string
    rows: readonly WorkBeforeAfterRow[]
    /** Note under the before profile, e.g. the last post before the rebuild. */
    beforeNote: string
    /** Note under the now profile. */
    afterNote: string
    /**
     * Where each number comes from, ending in the date range. The "How we
     * measure" link follows it on the page.
     */
    source: string
  }
  whatChanged: {
    kicker: string
    heading: string
    lead: string
    /** Left column: what we can show. */
    canShow: readonly string[]
    /** Right column: what we can't claim, same row order. */
    cantClaim: readonly string[]
  }
  quote: {
    kicker: string
    /** The giant pull quote, in the owner's words. */
    pullQuote: string
    /** "[NAME], [ROLE], [BUSINESS], [TOWN]". */
    attribution: string
    approval: string
  }
  differently: {
    changeKicker: string
    changeHeading: string
    changeBody: string
    nextKicker: string
    nextHeading: string
    nextBody: string
  }
  statsPanel: {
    kicker: string
    heading: string
  }
  cta: {
    kicker: string
    headline: string
    /** Sits BELOW the violet CTA, as in Paper. */
    reassurance: string
  }
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
  /**
   * Trade label shown on the listing while the trade is a placeholder, e.g.
   * "[TRADE]". Unset means the trade's own label. Filtering still uses `trade`.
   */
  tradeLabel?: string
  /** Town as shown on the page, e.g. "[TOWN]" in a sample. */
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
  /**
   * Listing figures. The featured card shows the first, a grid card the first
   * two. Each caption carries its source.
   */
  cardFigures: readonly WorkCardFigure[]
  /**
   * Story numbers for the case-study stats panel, in Paper order (%, minutes,
   * hours). Each one carries its source.
   */
  stats: readonly WorkStat[]
  /** Ordered section slot ids the case-study template renders. */
  sections: readonly WorkSectionId[]
  /** Story copy for every section above. */
  content: WorkStoryContent
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

/**
 * Case-study copy shared by the draft sample stories. Placeholders only, as in
 * Paper. It is replaced per story once the client's facts are in.
 */
const SAMPLE_CONTENT: WorkStoryContent = {
  hero: {
    kicker: '[TRADE] social media case study · [TOWN], [ST]',
    summary:
      "[NAME] runs a [N]-person [TRADE] business in [TOWN]. The page sat untouched from [MONTH YEAR]. Now it posts [N] times a month. [NAME]'s part is about [N] minutes a week, on the phone.",
    byline: '[NAME], owner, [BUSINESS], [TOWN]',
  },
  snapshot: [
    { label: 'Business', value: '[TRADE]' },
    { label: 'Team', value: '[N] people' },
    { label: 'Started with us', value: '[MONTH YEAR]' },
    { label: 'What we run', value: 'Planning, posts, replies, summary' },
    { label: "[NAME]'s time", value: 'About [N] min a week' },
    { label: 'Platforms', value: '[PLATFORMS]' },
  ],
  broken: {
    kicker: 'What was broken',
    heading: 'Good at the job. Too busy to post.',
    paragraphs: [
      '[NAME] meant to post. A photo after a good job, a promise to do more next week. Then a job ran late, and next week turned into [MONTH].',
      'The work always came first. Every week ended at a blank screen and no time to fill it.',
      'Meanwhile, customers looked [BUSINESS] up before they called. The newest thing they found was [LAST POST, e.g. a holiday post from last winter].',
    ],
    profileNote: 'Last post: [MONTH YEAR]. [N] unanswered messages.',
  },
  timeline: {
    kicker: 'Week by week',
    heading: "How [NAME]'s month runs now.",
    steps: [
      {
        title: 'First week',
        owner: '[N] min on a call. Named the jobs worth showing.',
        we: "Wrote the month's plan and the question list",
      },
      {
        title: 'First posts (by day [N])',
        owner: '[N] min approving the first posts',
        we: 'Edited, captioned and scheduled [N] posts',
      },
      {
        title: 'Every week',
        owner: '[N] min answering questions, [N] min approving posts and replies',
        we: "Posted on the planned day. Drafted replies for [NAME]'s OK.",
      },
      {
        title: 'Every month',
        owner: '[N] min reading the summary',
        we: 'Sent the summary, a source for every number. Planned next month.',
      },
    ],
    total: "[NAME]'s total: about [N] minutes a week. Ours: everything else.",
  },
  beforeAfter: {
    kicker: 'Before and [N] months later',
    heading: 'Same page, [N] months apart.',
    beforeHead: 'Before · [MONTH YEAR]',
    afterHead: 'Now · [MONTH YEAR]',
    rows: [
      { label: 'Last post', before: '[DATE]', after: '[DATE]' },
      { label: 'Posts a month', before: '[N]', after: '[N]' },
      { label: "[NAME]'s minutes a week", before: '[N]', after: '[N]' },
      { label: 'Messages answered ([N] of [N])', before: '[N]', after: '[N]' },
    ],
    beforeNote: 'Last post: [DATE], [N] months before the rebuild',
    afterNote: 'Last post: [DATE], on schedule',
    source:
      "Where the numbers come from: post dates and counts from the post log. [NAME]'s minutes from [NAME]'s own time log. Messages from the inbox export. [DATE RANGE].",
  },
  whatChanged: {
    kicker: 'The proof',
    heading: "What we can show. What we don't claim.",
    lead: 'Delivery numbers, not views. Your results depend on your trade and town.',
    canShow: [
      'Posts on the planned day: [N] of [N]',
      "[NAME]'s minutes a week, before and now",
      'Median time to answer a message: [N] hours',
    ],
    cantClaim: [
      'Views, followers or reach',
      'That every [TRADE] business will see the same',
      'More calls, bookings or sales',
    ],
  },
  quote: {
    kicker: 'In their words',
    pullQuote: '"[PULL QUOTE: one specific thing that changed, in [NAME]\'s words]"',
    attribution: '[NAME], [ROLE], [BUSINESS], [TOWN]',
    approval: 'Quote approved',
  },
  differently: {
    changeKicker: "What we'd change",
    changeHeading: 'Start drafting replies in week one.',
    changeBody: 'We started in week [N]. Some messages waited longer than they should have.',
    nextKicker: "What's next",
    nextHeading: 'Same rhythm. Next month already planned.',
    nextBody: 'A new plan each month, [N] posts, and a summary with sources.',
  },
  statsPanel: {
    kicker: 'The numbers',
    heading: '[N] posts on time. [N] minutes a week.',
  },
  cta: {
    kicker: 'Your business',
    headline: 'Want your page running like this?',
    reassurance:
      "Answer three quick questions, then pick a time. We'll plan your first month with you on the call.",
  },
}

const ENTRIES = [
  {
    slug: 'sample-story',
    clientName: `${CONFIRM} Client name`,
    trade: 'trades-home-services',
    tradeLabel: '[TRADE]',
    town: '[TOWN]',
    outcomeHeadline: 'Last post: [MONTH]. Now: [N] a month.',
    timeframe: '90 days',
    servicesUsed: [`${CONFIRM} Service`],
    featured: true,
    status: 'draft',
    consent: 'pending',
    cardFigures: [{ value: '[N] min a week', caption: 'Source: [DATE RANGE]' }],
    stats: [
      {
        label: 'Posts that went out on the planned day',
        value: '[N]%',
        source: '[DATE RANGE]',
      },
      {
        label: "[NAME]'s time each week, down from about [N]",
        value: '[N] min',
        source: '[DATE RANGE]',
      },
      {
        label: 'Median time to answer a message',
        value: '[N] hours',
        source: '[DATE RANGE]',
      },
    ],
    sections: WORK_SECTION_IDS,
    content: SAMPLE_CONTENT,
    title: 'Sample story',
    description: 'Placeholder description of a Testify client story.',
    updated: '2026-10-09',
  },
  {
    // Draft sample for the listing grid, card 1 of Paper's "Recent work".
    slug: 'sample-story-two',
    clientName: `${CONFIRM} Client name`,
    trade: 'trades-home-services',
    tradeLabel: '[TRADE]',
    town: '[TOWN]',
    outcomeHeadline: 'From "tomorrow" to [N] posts a month.',
    timeframe: '90 days',
    servicesUsed: [`${CONFIRM} Service`],
    featured: false,
    status: 'draft',
    consent: 'pending',
    cardFigures: [
      { value: '[N] min a week', caption: 'Owner time · Source: [DATE RANGE]' },
      { value: '[N]%', caption: 'On the planned day · Source: [DATE RANGE]' },
    ],
    stats: [
      {
        label: 'Posts that went out on the planned day',
        value: '[N]%',
        source: '[DATE RANGE]',
      },
      {
        label: "[NAME]'s time each week, down from about [N]",
        value: '[N] min',
        source: '[DATE RANGE]',
      },
      {
        label: 'Median time to answer a message',
        value: '[N] hours',
        source: '[DATE RANGE]',
      },
    ],
    sections: WORK_SECTION_IDS,
    content: SAMPLE_CONTENT,
    title: `${CONFIRM} Client story two`,
    description: `${CONFIRM} Placeholder description of a Testify client story.`,
    updated: '2026-10-21',
  },
  {
    // Draft sample for the listing grid, card 2 of Paper's "Recent work".
    slug: 'sample-story-three',
    clientName: `${CONFIRM} Client name`,
    trade: 'trades-home-services',
    tradeLabel: '[TRADE]',
    town: '[TOWN]',
    outcomeHeadline: 'Left an agency. Now every post gets their OK.',
    timeframe: '90 days',
    servicesUsed: [`${CONFIRM} Service`],
    featured: false,
    status: 'draft',
    consent: 'pending',
    cardFigures: [
      { value: '[N]% on schedule', caption: 'Posts delivered on time. Source: [SOURCE]' },
      { value: '[N] hours', caption: 'Median time to answer a message · Source: [SOURCE]' },
    ],
    stats: [
      {
        label: 'Posts that went out on the planned day',
        value: '[N]%',
        source: '[DATE RANGE]',
      },
      {
        label: "[NAME]'s time each week, down from about [N]",
        value: '[N] min',
        source: '[DATE RANGE]',
      },
      {
        label: 'Median time to answer a message',
        value: '[N] hours',
        source: '[DATE RANGE]',
      },
    ],
    sections: WORK_SECTION_IDS,
    content: SAMPLE_CONTENT,
    title: `${CONFIRM} Client story three`,
    description: `${CONFIRM} Placeholder description of a Testify client story.`,
    updated: '2026-10-21',
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
    if (entry.cardFigures.length < 1 || entry.cardFigures.length > 2) {
      throw new Error(`Work story "${entry.slug}" needs one or two listing figures.`)
    }
    if (entry.cardFigures.some((figure) => !figure.caption.includes('Source:'))) {
      throw new Error(`Work story "${entry.slug}" has a listing figure without a source.`)
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
