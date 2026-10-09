import { PageSkeleton, type SlotSpec } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('terms')

/** Terms of service skeleton. The terms body is filled later. */
const SLOTS: readonly SlotSpec[] = [{ slot: 'body', label: 'Terms of service' }]

export default function TermsPage() {
  return <PageSkeleton routeKey="terms" slots={SLOTS} />
}
