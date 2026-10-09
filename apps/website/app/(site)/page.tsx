import { PageSkeleton, type SlotSpec } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'
import { jsonLdScriptProps, serviceJsonLd } from '@/lib/structured_data'

export const metadata = pageMetadata('home')

/**
 * Home skeleton. Sections in order; content comes later. Carries the offer as
 * Service + Offer JSON-LD (lib/structured_data.ts).
 */
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
  return (
    <>
      <script {...jsonLdScriptProps(serviceJsonLd())} />
      <PageSkeleton routeKey="home" slots={SLOTS} />
    </>
  )
}
