/**
 * Get started, step 2 of 4 (Your business). Route /get-started/business. Renders
 * the shared page skeleton around the qualifier step; metadata comes from the routes registry.
 */

import type { Metadata } from 'next'
import { QualifierStep } from '@/components/get_started/qualifier_step'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata('getStartedBusiness')

/** Get started, step 2 of 4: Your business. */
export default function GetStartedBusinessPage() {
  return (
    <PageSkeleton routeKey="getStartedBusiness" slots={[]}>
      <QualifierStep step={2} />
    </PageSkeleton>
  )
}
