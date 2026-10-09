import { PageSkeleton, type SlotSpec } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('privacy')

/** Privacy policy skeleton. The policy body is filled later. */
const SLOTS: readonly SlotSpec[] = [{ slot: 'body', label: 'Privacy policy' }]

export default function PrivacyPage() {
  return <PageSkeleton routeKey="privacy" slots={SLOTS} />
}
