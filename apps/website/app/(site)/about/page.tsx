import { PageSkeleton, type SlotSpec } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('about')

/** About skeleton. Sections in order; content comes later. */
const SLOTS: readonly SlotSpec[] = [
  { slot: 'intro', label: 'Introduction' },
  { slot: 'story', label: 'Story' },
  { slot: 'cta', label: 'Call to action' },
]

export default function AboutPage() {
  return <PageSkeleton routeKey="about" slots={SLOTS} />
}
