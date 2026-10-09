import { PageSkeleton, type SlotSpec } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('home')

/** Home skeleton. Sections in order; content comes later. */
const SLOTS: readonly SlotSpec[] = [
  { slot: 'hero', label: 'Hero' },
  { slot: 'proof', label: 'Proof' },
  { slot: 'process', label: 'Process' },
  { slot: 'calendar', label: 'Calendar' },
  { slot: 'honesty', label: 'Honesty' },
  { slot: 'guarantee', label: 'Guarantee' },
  { slot: 'faq', label: 'FAQ' },
  { slot: 'cta', label: 'Call to action' },
]

export default function HomePage() {
  return <PageSkeleton routeKey="home" slots={SLOTS} />
}
