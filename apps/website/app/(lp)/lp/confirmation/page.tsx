import { PageSkeleton, type SlotSpec } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('lpConfirmation')

/**
 * Confirmation skeleton: the CONVERSION page (funnel step "conversion") that
 * the LP form/checkout lands on after a successful submit. Always noindex and
 * never in the sitemap. It fires no event yet; lead_submit / purchase_complete
 * are emitted once the analytics provider is wired into lib/tracking.ts.
 */
const SLOTS: readonly SlotSpec[] = [{ slot: 'next-steps', label: 'Next steps' }]

export default function LpConfirmationPage() {
  return <PageSkeleton routeKey="lpConfirmation" slots={SLOTS} />
}
