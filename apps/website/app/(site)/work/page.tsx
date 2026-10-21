import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { SectionHeader } from '@/components/site/section_header'
import { WorkClosingCta } from '@/components/work/work_cta'
import {
  ListingCompare,
  ListingProcess,
  ListingWontShow,
} from '@/components/work/work_listing_sections'
import { WorkSamples } from '@/components/work/work_listing_samples'
import { WorkSection } from '@/components/work/work_section'
import { FeaturedStoryCard, WorkStoryGrid } from '@/components/work/work_story_cards'
import { WorkTradeFilter } from '@/components/work/work_trade_filter'
import { pageMetadata } from '@/lib/metadata'
import { pageTrackingAttrs } from '@/lib/tracking'
import { getFeaturedWorkStory, getWorkGridStories } from '@/lib/work'

export const metadata = pageMetadata('work')

/**
 * "Our work" LISTING (Paper frame "Testify Web - Our work"). Sections in Paper
 * order: hero (with the trade filter), featured story, story grid, samples,
 * what you won't see, how it runs, compare, closing CTA. Stories come from the
 * work registry (lib/work.ts) and only the viewable ones show. Static page; the
 * trade filter reads `?trade=` on the client.
 */
export default function WorkPage() {
  const featured = getFeaturedWorkStory()
  const grid = getWorkGridStories()
  return (
    <PageSkeleton tracking={pageTrackingAttrs('work')} idPrefix="work" slots={[]}>
      <div className="flex flex-col gap-brand-section-gap pb-brand-section-gap pt-12">
        <WorkSection id="work-hero" slot="hero" labelledBy="work-hero-heading">
          <SectionHeader
            id="work-hero-heading"
            level={1}
            kicker="Our work"
            heading="Quiet pages, back on schedule."
            sub="Local businesses that stopped posting. What changed, and what it cost the owner each week."
            size="display-xl"
          />
          <WorkTradeFilter />
        </WorkSection>
        {featured ? (
          <WorkSection id="work-featured" slot="featured" labelledBy="work-featured-heading">
            <FeaturedStoryCard story={featured} />
          </WorkSection>
        ) : null}
        <WorkSection id="work-grid" slot="grid" labelledBy="work-grid-heading">
          <SectionHeader
            id="work-grid-heading"
            kicker="Recent work"
            heading="Recent work, by trade."
            size="display"
          />
          <WorkStoryGrid stories={grid} />
        </WorkSection>
        <WorkSection id="work-samples" slot="samples" labelledBy="work-samples-heading">
          <SectionHeader
            id="work-samples-heading"
            kicker="Samples"
            heading="What the posts look like."
            sub="Posts, carousels, stories and replies, made for service businesses."
            size="display"
          />
          <WorkSamples />
        </WorkSection>
        <WorkSection id="work-wont-show" slot="wont-show" labelledBy="work-wont-show-heading">
          <ListingWontShow />
        </WorkSection>
        <WorkSection id="work-process" slot="process" labelledBy="work-process-heading">
          <ListingProcess />
        </WorkSection>
        <WorkSection id="work-compare" slot="compare" labelledBy="work-compare-heading">
          <ListingCompare />
        </WorkSection>
        <WorkSection id="work-cta" slot="cta" labelledBy="work-cta-heading">
          <WorkClosingCta
            headingId="work-cta-heading"
            kicker="Next step"
            headline="Get your page posting again."
            sub="Answer three quick questions, then pick a time. We'll plan your first month with you on the call."
            reassurance="You leave the call with [N] post ideas for your business, hire us or not."
          />
        </WorkSection>
      </div>
    </PageSkeleton>
  )
}
