import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageSkeleton, SectionSlot } from '@/components/skeleton/page_skeleton'
import { workStoryMetadata } from '@/lib/metadata'
import { routes } from '@/lib/site.config'
import { breadcrumbJsonLd, jsonLdScriptProps } from '@/lib/structured_data'
import { workTrackingAttrs } from '@/lib/tracking'
import {
  getNextWorkStory,
  getViewableWorkStory,
  viewableWorkStories,
  workPath,
  type WorkSectionId,
  type WorkStory,
} from '@/lib/work'

/**
 * One client story on the CASE-STUDY TEMPLATE (Paper frame "Testify Web -
 * Our work / Case study"), at `/work/<slug>`, from the work registry
 * (lib/work.ts). Prerendered for every story this build may show
 * (`viewableWorkStories`: published + consent approved, or every story while
 * previews are on); any other slug is a 404 (`dynamicParams = false`, plus
 * the `notFound()` guard). Skeleton slots in the entry's `sections` order.
 */
export const dynamicParams = false

type Params = Promise<{ slug: string }>

/** Author-facing names of the template sections (never shown). */
const SECTION_LABELS = {
  'story-hero': 'Story hero (trade + town, outcome headline, media)',
  stats: '3-stat strip, each with source and date range',
  snapshot: 'Snapshot strip (business, team, started, services, owner time, timeframe)',
  'before-after': 'Before vs 90 days later',
  'what-broken': 'What was broken',
  timeline: 'What we did: 90-day swimlane',
  'what-changed': 'What changed (proof row)',
  'can-show-cant-claim': "What we can show vs what we can't claim",
  'in-their-words': 'In their words',
  'differently-next': "What we'd do differently, and what's next",
  'next-story': 'Next story',
  cta: 'Closing call to action',
} as const satisfies Record<WorkSectionId, string>

export function generateStaticParams(): Array<{ slug: string }> {
  return viewableWorkStories.map((story) => ({ slug: story.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const story = getViewableWorkStory((await params).slug)
  return story ? workStoryMetadata(story) : {}
}

/** Data attributes a section slot carries, so later content can bind to the story. */
function sectionData(story: WorkStory, section: WorkSectionId): Record<`data-${string}`, string> {
  switch (section) {
    case 'story-hero':
      return { 'data-trade': story.trade }
    case 'stats':
      return { 'data-stat-count': String(story.stats.length) }
    case 'next-story': {
      const next = getNextWorkStory(story.slug)
      return next ? { 'data-next-slug': next.slug, 'data-next-href': workPath(next.slug) } : {}
    }
    default:
      return {}
  }
}

export default async function WorkStoryPage({ params }: { params: Params }) {
  const story = getViewableWorkStory((await params).slug)
  if (!story) notFound()
  const idPrefix = `work-${story.slug}`
  const breadcrumb = breadcrumbJsonLd([
    { name: routes.home.navLabel, path: routes.home.path },
    { name: routes.work.navLabel, path: routes.work.path },
    { name: story.title, path: workPath(story.slug) },
  ])
  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />
      <PageSkeleton tracking={workTrackingAttrs(story.slug)} idPrefix={idPrefix} slots={[]}>
        {story.sections.map((section) => (
          <SectionSlot
            key={section}
            idPrefix={idPrefix}
            slot={section}
            label={SECTION_LABELS[section]}
            {...sectionData(story, section)}
          />
        ))}
      </PageSkeleton>
    </>
  )
}
