import { LpFormSlot } from '@/components/lp/lp_form_slot'
import { PageSkeleton, type SlotSpec } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'
import { jsonLdScriptProps, serviceJsonLd } from '@/lib/structured_data'

export const metadata = pageMetadata('lp')

/**
 * Paid landing page skeleton (funnel step "landing"). Sections in order; the
 * form/checkout slot is last and names the conversion page it hands off to.
 * Carries the offer as Service + Offer JSON-LD (lib/structured_data.ts).
 */
const SLOTS: readonly SlotSpec[] = [
  { slot: 'hero', label: 'Hero' },
  { slot: 'proof', label: 'Proof' },
  { slot: 'process', label: 'Process' },
  { slot: 'honesty', label: 'Honesty' },
  { slot: 'guarantee', label: 'Guarantee' },
  { slot: 'faq', label: 'FAQ' },
]

export default function LpPage() {
  return (
    <>
      <script {...jsonLdScriptProps(serviceJsonLd())} />
      <PageSkeleton routeKey="lp" slots={SLOTS}>
        <LpFormSlot />
      </PageSkeleton>
    </>
  )
}
