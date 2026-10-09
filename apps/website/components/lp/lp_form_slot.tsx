'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SectionSlot } from '@/components/skeleton/page_skeleton'
import { routes } from '@/lib/site.config'
import { withAttribution } from '@/lib/tracking'

/**
 * LP form/checkout slot. Empty for now; it already carries the onward href
 * (`data-success-href`) to the conversion page with the visitor's UTM and
 * click-id params preserved, so the form wired in later redirects there.
 */
function LpFormSlotWithParams() {
  const searchParams = useSearchParams()
  return (
    <SectionSlot
      routeKey="lp"
      slot="form"
      label="Form and checkout"
      data-success-href={withAttribution(routes.lpConfirmation.path, searchParams)}
    />
  )
}

export function LpFormSlot() {
  // Suspense keeps /lp statically rendered; params resolve on the client.
  return (
    <Suspense
      fallback={
        <SectionSlot
          routeKey="lp"
          slot="form"
          label="Form and checkout"
          data-success-href={routes.lpConfirmation.path}
        />
      }
    >
      <LpFormSlotWithParams />
    </Suspense>
  )
}
