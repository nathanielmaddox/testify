'use client'

// Story cards for /work: the featured card with its before and now phone mocks, the grid cards and the closing "next" card. The grid filters by `?trade=`, read on the client so /work stays static.
import { Link } from '@otesse/design-system'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, type ReactNode } from 'react'
import { useAttributedHref } from '@/components/lp/use_attributed_href'
import { PhoneMock } from '@/components/work/phone_mock'
import { workTradeLabel } from '@/components/work/work_labels'
import { siteConfig } from '@/lib/site.config'
import { parseWorkTrade, workPath, type WorkStory, type WorkTradeFilter } from '@/lib/work'

const READ_STORY = "Read [NAME]'s story →"

/** Paper's outlined ink pill for a card's link: the DS button link in its outline colour. */
function StoryPill({
  href,
  children,
  ...rest
}: {
  href: string
  children: ReactNode
  'aria-label'?: string
}) {
  return (
    <Link
      href={href}
      variant="button"
      color="outline"
      size="large"
      linkComponent={NextLink}
      {...rest}
    >
      {children}
    </Link>
  )
}

/** Accessible name for a story link: the visible words plus the story's outcome headline. */
function readStoryLabel(story: WorkStory): string {
  return `Read [NAME]'s story: ${story.outcomeHeadline}`
}

/** One labelled profile mock in the featured card. Decorative; the headline carries the meaning. */
function FeaturedPhone({
  label,
  stat,
  quiet,
  tone,
}: {
  label: string
  stat: string
  quiet: boolean
  tone: string
}) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      <p className={`font-text text-brand-overline uppercase ${tone}`}>{label}</p>
      <PhoneMock handle="[BUSINESS]" stat={stat} tiles={6} quiet={quiet} bare />
    </div>
  )
}

/** The one wide card: before and now phones left, outcome and one hero figure right. */
export function FeaturedStoryCard({ story }: { story: WorkStory }) {
  const [figure] = story.cardFigures
  return (
    <article
      data-story-slug={story.slug}
      data-story-href={workPath(story.slug)}
      data-trade={story.trade}
      data-card="featured"
      className="grid grid-cols-1 gap-10 rounded-card bg-brand-surface p-brand-card shadow-raised md:grid-cols-2"
    >
      <div className="grid grid-cols-2 items-start gap-4">
        <FeaturedPhone
          label="Before · [MONTH YEAR]"
          stat="Last post: [N] months ago"
          quiet
          tone="text-brand-ink-subtle"
        />
        <FeaturedPhone
          label="Now · [MONTH YEAR]"
          stat="[N] posts this month"
          quiet={false}
          tone="text-brand-action-text"
        />
      </div>
      <div className="flex flex-col justify-between gap-8">
        <div className="flex flex-col gap-4">
          <p className="font-text text-brand-small text-brand-ink-subtle">
            {`${workTradeLabel(story)} · ${story.town} · Featured story`}
          </p>
          <h2
            id="work-featured-heading"
            className="max-w-measure-heading text-balance font-display text-brand-h2 text-brand-ink"
          >
            {story.outcomeHeadline}
          </h2>
        </div>
        <div className="flex flex-col gap-6">
          {figure ? (
            <div className="flex flex-col gap-2">
              <p className="font-display text-brand-h2 tabular-nums text-brand-ink">
                {figure.value}
              </p>
              <p className="font-text text-brand-small text-brand-ink-subtle">{figure.caption}</p>
            </div>
          ) : null}
          <StoryPill href={workPath(story.slug)} aria-label={readStoryLabel(story)}>
            {READ_STORY}
          </StoryPill>
        </div>
      </div>
    </article>
  )
}

/** One grid card: trade, outcome, two figures with their captions, read link. */
function StoryGridCard({ story }: { story: WorkStory }) {
  return (
    <article
      data-story-slug={story.slug}
      data-story-href={workPath(story.slug)}
      data-trade={story.trade}
      data-card="grid"
      className="flex flex-col justify-between gap-8 rounded-card bg-brand-surface p-brand-card shadow-raised"
    >
      <div className="flex flex-col gap-4">
        <p className="font-text text-brand-small text-brand-ink-subtle">
          {`${workTradeLabel(story)} · ${story.town}`}
        </p>
        <h3 className="font-display text-brand-h4 text-brand-ink">{story.outcomeHeadline}</h3>
      </div>
      <div className="flex flex-col gap-6">
        {story.cardFigures.map((figure) => (
          <div key={figure.caption} className="flex flex-col gap-1">
            <p className="font-display text-brand-h4 tabular-nums text-brand-ink">{figure.value}</p>
            <p className="font-text text-brand-small text-brand-ink-subtle">{figure.caption}</p>
          </div>
        ))}
      </div>
      <StoryPill href={workPath(story.slug)} aria-label={readStoryLabel(story)}>
        {READ_STORY}
      </StoryPill>
    </article>
  )
}

/** The last grid slot: the quiet call to action that stands in for a next story. */
function NextStoryCard() {
  const href = useAttributedHref(siteConfig.cta.href)
  return (
    <article
      data-card="next"
      className="flex flex-col justify-between gap-8 rounded-card bg-brand-surface p-brand-card shadow-raised"
    >
      <div className="flex flex-col gap-4">
        <p className="font-text text-brand-small text-brand-ink-subtle">Next story</p>
        <h3 className="font-display text-brand-h4 text-brand-ink">Your page could be next.</h3>
        <p className="font-text text-brand-body text-brand-ink-muted">
          Answer three quick questions. Then pick a time to talk.
        </p>
      </div>
      <StoryPill href={href}>Get started →</StoryPill>
    </article>
  )
}

function StoryGridList({
  stories,
  trade,
}: {
  stories: readonly WorkStory[]
  trade: WorkTradeFilter
}) {
  const visible = trade === 'all' ? stories : stories.filter((story) => story.trade === trade)
  return (
    <div
      data-slot="grid-list"
      data-active-trade={trade}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {visible.map((story) => (
        <StoryGridCard key={story.slug} story={story} />
      ))}
      <NextStoryCard />
    </div>
  )
}

function StoryGridFromQuery({ stories }: { stories: readonly WorkStory[] }) {
  const trade = parseWorkTrade(useSearchParams().get('trade'))
  return <StoryGridList stories={stories} trade={trade} />
}

/** The grid of viewable stories, filtered by `?trade=`, ending in the next-story card. */
export function WorkStoryGrid({ stories }: { stories: readonly WorkStory[] }) {
  return (
    <Suspense fallback={<StoryGridList stories={stories} trade="all" />}>
      <StoryGridFromQuery stories={stories} />
    </Suspense>
  )
}
