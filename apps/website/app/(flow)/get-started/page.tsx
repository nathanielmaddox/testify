/**
 * Get started, step 1 of 4 (About you). Route /get-started. Renders the shared
 * page skeleton around the qualifier step; metadata comes from the routes registry.
 */

import type { Metadata } from 'next'
import { QualifierStep } from '@/components/get_started/qualifier_step'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata('getStarted')

/** Get started, step 1 of 4: About you. */
export default function GetStartedPage() {
  return (
    <PageSkeleton routeKey="getStarted" slots={[]}>
      <QualifierStep step={1} />
    </PageSkeleton>
  )
}
