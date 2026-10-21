/**
 * Get started, step 4 of 4 (Book a time). Route /get-started/book. Renders the
 * shared page skeleton around the booking step; metadata comes from the routes registry.
 */

import type { Metadata } from 'next'
import { BookingStep } from '@/components/get_started/booking_step'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata('getStartedBook')

/** Get started, step 4 of 4: Book a time. */
export default function GetStartedBookPage() {
  return (
    <PageSkeleton routeKey="getStartedBook" slots={[]}>
      <BookingStep />
    </PageSkeleton>
  )
}
