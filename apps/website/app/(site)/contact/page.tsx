import { PageSkeleton, type SlotSpec } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('contact')

/** Contact skeleton. The form slot is filled later. */
const SLOTS: readonly SlotSpec[] = [
  { slot: 'intro', label: 'Introduction' },
  { slot: 'form', label: 'Contact form' },
]

export default function ContactPage() {
  return <PageSkeleton routeKey="contact" slots={SLOTS} />
}
