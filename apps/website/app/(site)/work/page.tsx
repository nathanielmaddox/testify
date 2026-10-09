import { PageSkeleton, type SlotSpec } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('work')

/** Our work skeleton. Sections in order; content comes later. */
const SLOTS: readonly SlotSpec[] = [
  { slot: 'intro', label: 'Introduction' },
  { slot: 'samples', label: 'Sample videos' },
  { slot: 'results', label: 'Client results' },
  { slot: 'cta', label: 'Call to action' },
]

export default function WorkPage() {
  return <PageSkeleton routeKey="work" slots={SLOTS} />
}
