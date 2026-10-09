import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { ConversionTracker } from '@/components/lp/conversion_tracker'
import { PageSkeleton, type SlotSpec } from '@/components/skeleton/page_skeleton'
import { verifyConversion } from '@/lib/conversion'
import { getLandingPage, lpPath } from '@/lib/landing_pages'
import { lpConfirmationMetadata } from '@/lib/metadata'
import { lpTrackingAttrs } from '@/lib/tracking'

/** Rendered per request: the page depends on the conversion id in the URL. */
export const dynamic = 'force-dynamic'

/**
 * Confirmation skeleton for LP `<slug>`: the CONVERSION page (funnel step
 * "conversion") that the LP's form/checkout lands on after a successful
 * submit. Always noindex, never in the sitemap, `Cache-Control: private,
 * no-store` (next.config.js, `/lp/:slug/confirmation`).
 *
 * Unknown slug: 404. It renders only for a request carrying a valid
 * conversion id (`session_id` from Stripe or a `lead` token, see
 * lib/conversion.ts); anything else is sent back to `/lp/<slug>`. The
 * conversion event fires once per id from `ConversionTracker`, with `lp_slug`.
 */
const SLOTS: readonly SlotSpec[] = [{ slot: 'next-steps', label: 'Next steps' }]

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const lp = getLandingPage((await params).slug)
  return lp ? lpConfirmationMetadata(lp) : {}
}

export default async function LpConfirmationPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const lp = getLandingPage((await params).slug)
  if (!lp) notFound()
  const conversion = await verifyConversion(await searchParams)
  if (!conversion.ok) redirect(lpPath(lp.slug))

  return (
    <PageSkeleton
      tracking={lpTrackingAttrs(lp.slug, 'lpConfirmation')}
      idPrefix={`lp-${lp.slug}-confirmation`}
      slots={SLOTS}
    >
      <ConversionTracker
        event={conversion.event}
        id={conversion.id}
        param={conversion.param}
        lpSlug={lp.slug}
      />
    </PageSkeleton>
  )
}
