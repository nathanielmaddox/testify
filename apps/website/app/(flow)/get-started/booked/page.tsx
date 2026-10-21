/**
 * Get started, booked page (the conversion page). Route /get-started/booked.
 * Per-request and never cached: the booking is per visitor and lives in
 * sessionStorage. The no-store header is set in next.config.js.
 */

import type { Metadata } from 'next'
import { BookedSummary } from '@/components/get_started/booked_summary'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'

/** The flow's conversion page: rendered per request, never indexed, never cached. */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata('getStartedBooked')

/** Get started, booked: the confirmed call and what happens next. */
export default function GetStartedBookedPage() {
  return (
    <PageSkeleton routeKey="getStartedBooked" slots={[]}>
      <BookedSummary />
    </PageSkeleton>
  )
}
