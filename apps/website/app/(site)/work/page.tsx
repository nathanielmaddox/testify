import { PageSkeleton, SectionSlot, type SlotSpec } from '@/components/skeleton/page_skeleton'
import { WorkTradeFilter } from '@/components/work/work_trade_filter'
import { pageMetadata } from '@/lib/metadata'
import { pageTrackingAttrs } from '@/lib/tracking'
import { getFeaturedWorkStory, getWorkGridStories, workPath, type WorkStory } from '@/lib/work'

export const metadata = pageMetadata('work')

/**
 * "Our work" LISTING (Paper frame "Testify Web - Our work"). Skeleton slots
 * in the order of docs/work-page-direction.md; content comes later. Featured
 * story and grid come from the work registry (lib/work.ts): only stories this
 * build may show (`viewableWorkStories`: public, or previews on). Each story
 * is an empty placeholder keyed by `data-story-slug` / `data-trade`, so the
 * `?trade=` filter (hero) can act on them later. Static page.
 */
const SLOTS = {
  hero: { slot: 'hero', label: 'Hero (kicker, H1, line, trade filter)' },
  featured: { slot: 'featured', label: 'Featured story' },
  grid: { slot: 'grid', label: 'Story grid (+ "your business could be next")' },
  process: { slot: 'process', label: 'How every engagement runs (90-day track)' },
  questions: { slot: 'questions', label: 'Questions this page answers' },
  samples: { slot: 'samples', label: 'Sample videos (phone rail)' },
  wontShow: { slot: 'wont-show', label: "What you won't see here" },
  cta: { slot: 'cta', label: 'Closing call to action' },
} as const satisfies Record<string, SlotSpec>

const ID_PREFIX = 'work'

/** Empty placeholder for one story card; the real card is a DS composition later. */
function StoryCardSlot({ story, variant }: { story: WorkStory; variant: 'featured' | 'grid' }) {
  return (
    <article
      data-story-slug={story.slug}
      data-story-href={workPath(story.slug)}
      data-trade={story.trade}
      data-card={variant}
    />
  )
}

export default function WorkPage() {
  const featured = getFeaturedWorkStory()
  const grid = getWorkGridStories()
  return (
    <PageSkeleton tracking={pageTrackingAttrs('work')} idPrefix={ID_PREFIX} slots={[]}>
      <SectionSlot idPrefix={ID_PREFIX} {...SLOTS.hero}>
        <WorkTradeFilter />
      </SectionSlot>
      <SectionSlot
        idPrefix={ID_PREFIX}
        {...SLOTS.featured}
        data-story-slug={featured?.slug ?? undefined}
      >
        {featured ? <StoryCardSlot story={featured} variant="featured" /> : null}
      </SectionSlot>
      <SectionSlot idPrefix={ID_PREFIX} {...SLOTS.grid} data-story-count={String(grid.length)}>
        {grid.map((story) => (
          <StoryCardSlot key={story.slug} story={story} variant="grid" />
        ))}
      </SectionSlot>
      <SectionSlot idPrefix={ID_PREFIX} {...SLOTS.process} />
      <SectionSlot idPrefix={ID_PREFIX} {...SLOTS.questions} />
      <SectionSlot idPrefix={ID_PREFIX} {...SLOTS.samples} />
      <SectionSlot idPrefix={ID_PREFIX} {...SLOTS.wontShow} />
      <SectionSlot idPrefix={ID_PREFIX} {...SLOTS.cta} />
    </PageSkeleton>
  )
}
