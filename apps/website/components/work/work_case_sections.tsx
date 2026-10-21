// The case-study template's sections, in Paper order, from one story's registry content. Server-safe; the proof grid is the DS table in a client module, and the CTAs are client modules.
import { SectionHeader } from '@/components/site/section_header'
import { ProfileGridMock } from '@/components/work/phone_mock'
import { WorkCompareTable } from '@/components/work/work_compare_table'
import { WorkClosingCta, WorkCta } from '@/components/work/work_cta'
import { WorkSection } from '@/components/work/work_section'
import { workTradeLabel } from '@/components/work/work_labels'
import { EmphasisPanel } from '@testify/style-guide/components/EmphasisPanel'
import { MediaFrame } from '@testify/style-guide/components/MediaFrame'
import { WorkTextLink } from '@/components/work/work_text_link'
import { routes } from '@/lib/site.config'
import { getNextWorkStory, workPath, type WorkSectionId, type WorkStory } from '@/lib/work'

type SectionProps = { story: WorkStory }

/** Story hero: kicker, the outcome headline, the owner portrait and summary, the CTAs and byline. */
function StoryHero({ story }: SectionProps) {
  const { hero } = story.content
  return (
    <WorkSection id="story-hero" slot="story-hero" labelledBy="story-hero-heading">
      <SectionHeader
        id="story-hero-heading"
        level={1}
        kicker={hero.kicker}
        heading={story.outcomeHeadline}
        size="display-xl"
      />
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
        <div className="w-full max-w-sm lg:w-[440px] lg:shrink-0" data-trade={story.trade}>
          <MediaFrame kind="image" ratio="1:1" alt="Owner portrait" />
        </div>
        <div className="flex max-w-xl flex-col gap-6">
          <p className="font-text text-brand-body text-brand-ink-muted">{hero.summary}</p>
          <div className="flex flex-wrap items-center gap-6">
            <WorkCta tone="action" />
            <WorkTextLink href="#story-snapshot-heading">See how the month runs ↓</WorkTextLink>
          </div>
          <p className="font-text text-brand-small text-brand-ink-subtle">{hero.byline}</p>
        </div>
      </div>
    </WorkSection>
  )
}

/** Snapshot: a plain fact row, no card. */
function Snapshot({ story }: SectionProps) {
  return (
    <WorkSection id="story-snapshot" slot="snapshot" labelledBy="story-snapshot-heading">
      <h2 id="story-snapshot-heading" className="sr-only">
        Snapshot
      </h2>
      <dl className="grid gap-6 border-t border-brand-border-strong pt-6 sm:grid-cols-3 lg:grid-cols-6">
        {story.content.snapshot.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-2">
            <dt className="font-text text-brand-small text-brand-ink-subtle">{fact.label}</dt>
            <dd className="font-text text-brand-body text-brand-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </WorkSection>
  )
}

/** What was broken: three paragraphs in the owner's terms, next to the "before" profile. */
function WhatBroken({ story }: SectionProps) {
  const { broken } = story.content
  return (
    <WorkSection id="story-what-broken" slot="what-broken" labelledBy="story-what-broken-heading">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
        <div className="flex max-w-xl flex-col gap-8">
          <SectionHeader
            id="story-what-broken-heading"
            kicker={broken.kicker}
            heading={broken.heading}
            size="display"
          />
          <div className="flex flex-col gap-5">
            {broken.paragraphs.map((paragraph) => (
              <p key={paragraph} className="font-text text-brand-body text-brand-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-3 lg:shrink-0">
          <p className="self-end font-text text-brand-small text-brand-ink-subtle">
            Profile, before
          </p>
          <ProfileGridMock handle="[business handle]" stat="[N] posts" tiles={6} quiet />
          <p className="font-text text-brand-small text-brand-ink-subtle">{broken.profileNote}</p>
        </div>
      </div>
    </WorkSection>
  )
}

const LANE_GRID = 'grid grid-cols-[200px_repeat(4,minmax(0,1fr))] gap-x-6'
const CARD = 'flex flex-col gap-3 rounded-card bg-brand-surface p-5 shadow-raised'
const OVERLINE = 'font-text text-brand-overline uppercase text-brand-ink-subtle'

/** What we did: a two-lane swimlane over four time columns. Assets sit above the lanes; the two lanes are the owner's part and ours. */
function Timeline({ story }: SectionProps) {
  const { timeline } = story.content
  const columns = timeline.steps
  return (
    <WorkSection id="story-timeline" slot="timeline" labelledBy="story-timeline-heading">
      <SectionHeader
        id="story-timeline-heading"
        kicker={timeline.kicker}
        heading={timeline.heading}
        size="display"
      />
      <div data-slot="swimlane" className="overflow-x-auto">
        <div className="flex min-w-[860px] flex-col">
          <div className={`${LANE_GRID} border-b border-brand-border-strong pb-4`}>
            <span aria-hidden="true" />
            {columns.map((step) => (
              <h3 key={step.title} className="font-display text-brand-h3 text-brand-ink">
                {step.title}
              </h3>
            ))}
          </div>
          <div className={`${LANE_GRID} items-start py-8`} aria-hidden="true">
            <span aria-hidden="true" />
            <div className={CARD}>
              <p className={OVERLINE}>Call notes</p>
              <p className="font-text text-brand-small text-brand-ink">First post, [DATE]</p>
              <div className="flex flex-col gap-2 pt-1">
                <span className="h-2 w-full rounded-full bg-brand-done-bg" />
                <span className="h-2 w-4/5 rounded-full bg-brand-done-bg" />
                <span className="h-2 w-3/5 rounded-full bg-brand-done-bg" />
              </div>
            </div>
            <div className={CARD}>
              <span className="h-28 rounded-md bg-brand-done-bg-strong" />
              <p className="font-text text-brand-small text-brand-ink">[Post caption, one line]</p>
              <p className="font-text text-brand-small text-brand-ink-subtle">
                Posted [DAY], [TIME]
              </p>
            </div>
            <div className={CARD}>
              <p className={OVERLINE}>Post for approval</p>
              <span className="h-[70px] rounded-xl bg-brand-done-bg" />
              <div className="flex gap-2">
                <span className="flex h-10 flex-1 items-center justify-center rounded-full bg-brand-ink font-text text-brand-small font-semibold text-brand-surface">
                  Approve
                </span>
                <span className="flex h-10 flex-1 items-center justify-center rounded-full border border-brand-ink font-text text-brand-small font-semibold text-brand-ink">
                  Change this
                </span>
              </div>
            </div>
            <div className={CARD}>
              <p className={OVERLINE}>[Month] summary</p>
              <p className="font-display text-brand-h3 text-brand-ink">[N]% on time</p>
              <span className="h-2 overflow-hidden rounded-full bg-brand-canvas-alt">
                <span className="block h-full w-4/5 rounded-full bg-brand-done-fg" />
              </span>
              <p className="font-text text-brand-small text-brand-ink-subtle">Source: [SOURCE]</p>
            </div>
          </div>
          <div className={`${LANE_GRID} border-t border-brand-border py-5`}>
            <p className="font-text text-brand-small font-semibold text-brand-ink">
              What [NAME] did
            </p>
            {columns.map((step) => (
              <p key={step.title} className="font-text text-brand-small text-brand-ink-muted">
                {step.owner}
              </p>
            ))}
          </div>
          <div className={`${LANE_GRID} border-t border-brand-border py-5`}>
            <p className="font-text text-brand-small font-semibold text-brand-ink">What we did</p>
            {columns.map((step) => (
              <p key={step.title} className="font-text text-brand-small text-brand-ink-muted">
                {step.we}
              </p>
            ))}
          </div>
        </div>
      </div>
      <p className="font-display text-brand-h3 text-brand-ink">{timeline.total}</p>
    </WorkSection>
  )
}

type BeforeAfterValue = { label: string; value: string }

/** One before or now panel: its head, the four facts, the profile mock and its note. */
function BeforeAfterPanel({
  head,
  values,
  note,
  quiet,
}: {
  head: string
  values: readonly BeforeAfterValue[]
  note: string
  quiet: boolean
}) {
  return (
    <div className="flex flex-col gap-6 rounded-card bg-brand-surface p-brand-card shadow-raised">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-brand-h3 text-brand-ink">{head}</h3>
        <p className="font-text text-brand-small text-brand-ink-subtle">[DATE RANGE]</p>
      </div>
      <dl className="flex flex-col">
        {values.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-6 border-b border-brand-border py-4 last:border-b-0"
          >
            <dt className="font-text text-brand-body text-brand-ink">{row.label}</dt>
            <dd className="font-text text-brand-body-strong text-brand-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
      <ProfileGridMock
        handle="[business handle]"
        stat="[N] posts"
        tiles={quiet ? 6 : 9}
        quiet={quiet}
        bare
      />
      <p className="font-text text-brand-small text-brand-ink-subtle">{note}</p>
    </div>
  )
}

/** Before vs later: the same four facts in two panels, each with its profile, so the eye compares. */
function BeforeAfter({ story }: SectionProps) {
  const { beforeAfter } = story.content
  return (
    <WorkSection
      id="story-before-after"
      slot="before-after"
      labelledBy="story-before-after-heading"
    >
      <SectionHeader
        id="story-before-after-heading"
        kicker={beforeAfter.kicker}
        heading={beforeAfter.heading}
        size="display"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <BeforeAfterPanel
          head={beforeAfter.beforeHead}
          values={beforeAfter.rows.map((row) => ({ label: row.label, value: row.before }))}
          note={beforeAfter.beforeNote}
          quiet
        />
        <BeforeAfterPanel
          head={beforeAfter.afterHead}
          values={beforeAfter.rows.map((row) => ({ label: row.label, value: row.after }))}
          note={beforeAfter.afterNote}
          quiet={false}
        />
      </div>
      <p className="font-text text-brand-small text-brand-ink-subtle">
        {beforeAfter.source} ·{' '}
        <WorkTextLink href="#story-what-changed">How we measure →</WorkTextLink>
      </p>
    </WorkSection>
  )
}

/** What changed: what we can show, against what we will not claim. */
function WhatChanged({ story }: SectionProps) {
  const { whatChanged } = story.content
  return (
    <WorkSection
      id="story-what-changed"
      slot="what-changed"
      labelledBy="story-what-changed-heading"
    >
      <SectionHeader
        id="story-what-changed-heading"
        kicker={whatChanged.kicker}
        heading={whatChanged.heading}
        sub={whatChanged.lead}
        size="display"
      />
      <WorkCompareTable
        featureColumnLabel="What we can show"
        rows={whatChanged.canShow.map((name) => ({ name }))}
        columns={[{ name: "What we don't claim", values: [...whatChanged.cantClaim] }]}
      />
    </WorkSection>
  )
}

/** In their words: the owner's video, then one pull quote with the name. */
function Testimonial({ story }: SectionProps) {
  const { quote } = story.content
  return (
    <WorkSection
      id="story-in-their-words"
      slot="in-their-words"
      labelledBy="story-in-their-words-heading"
    >
      <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
        <div className="w-full max-w-xs lg:shrink-0">
          <MediaFrame kind="video" alt="Owner testimonial video" />
        </div>
        <div className="flex max-w-2xl flex-col gap-8">
          <SectionHeader
            id="story-in-their-words-heading"
            kicker={quote.kicker}
            heading={quote.pullQuote}
            size="h2"
          />
          <div className="flex flex-col gap-1">
            <p className="font-text text-brand-body-strong text-brand-ink">{quote.attribution}</p>
            <p className="font-text text-brand-small text-brand-ink-subtle">{quote.approval}</p>
          </div>
        </div>
      </div>
    </WorkSection>
  )
}

/** What we would change, and what is next: two calm cards. */
function Differently({ story }: SectionProps) {
  const { differently } = story.content
  const cards = [
    {
      kicker: differently.changeKicker,
      heading: differently.changeHeading,
      body: differently.changeBody,
    },
    {
      kicker: differently.nextKicker,
      heading: differently.nextHeading,
      body: differently.nextBody,
    },
  ]
  return (
    <WorkSection
      id="story-differently-next"
      slot="differently-next"
      labelledBy="story-differently-next-heading"
    >
      <h2 id="story-differently-next-heading" className="sr-only">
        What we would do differently, and what is next
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.kicker}
            className="flex flex-col gap-6 rounded-card bg-brand-surface p-brand-card shadow-raised"
          >
            <p className="font-text text-brand-small text-brand-ink-subtle">{card.kicker}</p>
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-brand-h3 text-brand-ink">{card.heading}</h3>
              <p className="font-text text-brand-body text-brand-ink-muted">{card.body}</p>
            </div>
          </div>
        ))}
      </div>
    </WorkSection>
  )
}

/** The numbers: the one dark panel on the page, three figures with sources. */
function StatsPanel({ story }: SectionProps) {
  const { statsPanel } = story.content
  return (
    <WorkSection id="story-stats" slot="stats" labelledBy="story-stats-heading">
      <EmphasisPanel id="story-stats-heading" kicker={statsPanel.kicker} title={statsPanel.heading}>
        <div
          data-stat-count={String(story.stats.length)}
          className="grid w-full grid-cols-1 gap-10 lg:grid-cols-3"
        >
          {story.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-3 border-t border-brand-inverse-ink/20 pt-6"
            >
              <p className="font-display text-brand-h2 tabular-nums text-brand-inverse-ink">
                {stat.value}
              </p>
              <p className="font-text text-brand-body-strong text-brand-inverse-ink">
                {stat.label}
              </p>
              <p className="font-text text-brand-small text-brand-inverse-ink-muted">
                {`Source: ${stat.source}`}
              </p>
            </div>
          ))}
        </div>
      </EmphasisPanel>
    </WorkSection>
  )
}

/** Next story: the following viewable story, or a link back to the listing when this is the only one. */
function NextStory({ story }: SectionProps) {
  const next = getNextWorkStory(story.slug)
  return (
    <WorkSection id="story-next-story" slot="next-story" labelledBy="story-next-story-heading">
      {next ? (
        <div
          data-next-slug={next.slug}
          data-next-href={workPath(next.slug)}
          className="flex flex-wrap items-end justify-between gap-6 border-t border-brand-border-strong pt-8"
        >
          <div className="flex flex-col gap-3">
            <p className="font-text text-brand-small text-brand-ink-subtle">
              Not yet? Read the next story:
            </p>
            <h2 id="story-next-story-heading" className="font-display text-brand-h2 text-brand-ink">
              {`${workTradeLabel(next)} · ${next.town}: ${next.outcomeHeadline}`}
            </h2>
          </div>
          <WorkTextLink
            id="story-next-story-read"
            href={workPath(next.slug)}
            aria-labelledby="story-next-story-heading story-next-story-read"
          >
            Read it →
          </WorkTextLink>
        </div>
      ) : (
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-brand-border-strong pt-8">
          <h2 id="story-next-story-heading" className="font-display text-brand-h2 text-brand-ink">
            More of our work
          </h2>
          <WorkTextLink href={routes.work.path}>See all our work →</WorkTextLink>
        </div>
      )}
    </WorkSection>
  )
}

/** Closing CTA: the page's one violet action. The section is named by its headline. */
function Cta({ story }: SectionProps) {
  const { cta } = story.content
  return (
    <WorkSection id="story-cta" slot="cta" labelledBy="story-cta-heading">
      <WorkClosingCta
        headingId="story-cta-heading"
        kicker={cta.kicker}
        headline={cta.headline}
        reassurance={cta.reassurance}
      />
    </WorkSection>
  )
}

/** Renders one template section by id. Keep this switch in step with WORK_SECTION_IDS. */
export function StorySection({ section, story }: { section: WorkSectionId; story: WorkStory }) {
  switch (section) {
    case 'story-hero':
      return <StoryHero story={story} />
    case 'snapshot':
      return <Snapshot story={story} />
    case 'what-broken':
      return <WhatBroken story={story} />
    case 'timeline':
      return <Timeline story={story} />
    case 'before-after':
      return <BeforeAfter story={story} />
    case 'what-changed':
      return <WhatChanged story={story} />
    case 'in-their-words':
      return <Testimonial story={story} />
    case 'differently-next':
      return <Differently story={story} />
    case 'stats':
      return <StatsPanel story={story} />
    case 'next-story':
      return <NextStory story={story} />
    case 'cta':
      return <Cta story={story} />
  }
}
