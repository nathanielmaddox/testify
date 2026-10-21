import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { StorySection } from '@/components/work/work_case_sections'
import { workStoryMetadata } from '@/lib/metadata'
import { routes } from '@/lib/site.config'
import { breadcrumbJsonLd, jsonLdScriptProps } from '@/lib/structured_data'
import { workTrackingAttrs } from '@/lib/tracking'
import { getViewableWorkStory, viewableWorkStories, workPath } from '@/lib/work'

/**
 * One client story on the CASE-STUDY TEMPLATE (Paper frame "Testify Web -
 * Our work / Case study"), at `/work/<slug>`, from the work registry
 * (lib/work.ts). Prerendered for every story this build may show
 * (`viewableWorkStories`: published + consent approved, or every story while
 * previews are on); any other slug is a 404 (`dynamicParams = false`, plus
 * the `notFound()` guard). Sections render in the entry's `sections` order.
 */
export const dynamicParams = false

type Params = Promise<{ slug: string }>

export function generateStaticParams(): Array<{ slug: string }> {
  return viewableWorkStories.map((story) => ({ slug: story.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const story = getViewableWorkStory((await params).slug)
  return story ? workStoryMetadata(story) : {}
}

export default async function WorkStoryPage({ params }: { params: Params }) {
  const story = getViewableWorkStory((await params).slug)
  if (!story) notFound()
  const breadcrumb = breadcrumbJsonLd([
    { name: routes.home.navLabel, path: routes.home.path },
    { name: routes.work.navLabel, path: routes.work.path },
    { name: story.title, path: workPath(story.slug) },
  ])
  return (
    <>
      <script {...jsonLdScriptProps(breadcrumb)} />
      <PageSkeleton
        tracking={workTrackingAttrs(story.slug)}
        idPrefix={`work-${story.slug}`}
        slots={[]}
      >
        <div className="flex flex-col gap-brand-section-gap pb-brand-section-gap pt-12">
          {story.sections.map((section) => (
            <StorySection key={section} section={section} story={story} />
          ))}
        </div>
      </PageSkeleton>
    </>
  )
}
