/**
 * Get started, step 3 of 4 (Your goals). Route /get-started/goals. Renders the
 * shared page skeleton around the qualifier step; metadata comes from the routes registry.
 */

import type { Metadata } from 'next'
import { QualifierStep } from '@/components/get_started/qualifier_step'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata('getStartedGoals')

/** Get started, step 3 of 4: Your goals. */
export default function GetStartedGoalsPage() {
  return (
    <PageSkeleton routeKey="getStartedGoals" slots={[]}>
      <QualifierStep step={3} />
    </PageSkeleton>
  )
}
