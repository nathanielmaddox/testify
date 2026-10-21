import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { LeadConfirmation } from '@/components/lp/confirmation/lead_confirmation'
import { PaymentPending } from '@/components/lp/confirmation/payment_pending'
import { PurchaseConfirmation } from '@/components/lp/confirmation/purchase_confirmation'
import { ConversionTracker } from '@/components/lp/conversion_tracker'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { verifyConversion } from '@/lib/conversion_server'
import { getLandingPage, lpPath } from '@/lib/landing_pages'
import { lpConfirmationMetadata } from '@/lib/metadata'
import { lpTrackingAttrs } from '@/lib/tracking'

/** Rendered per request: the page depends on the conversion id in the URL. */
export const dynamic = 'force-dynamic'

/**
 * Confirmation page for LP `<slug>`: the CONVERSION page (funnel step "conversion") that the LP's
 * checkout or form lands on after a successful submit. Always noindex, never in the sitemap,
 * `Cache-Control: private, no-store` (next.config.js, `/lp/:slug/confirmation`).
 *
 * Unknown slug: 404. It renders only for a request carrying a valid conversion id (`session_id`
 * from Stripe or a `lead` token, see lib/conversion.ts); anything else is sent back to `/lp/<slug>`.
 * A `purchase` gets the purchase confirmation (Paper "lp/done-for-you-99/confirmation") only when
 * Stripe verifies the session as paid; otherwise a neutral "confirming" state. A `lead` gets the lead
 * confirmation. `ConversionTracker` fires the event once per id, with `lp_slug`, and fires
 * `purchase_complete` only for a verified purchase.
 */
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

  const idPrefix = `lp-${lp.slug}-confirmation`
  // A purchase shows the paid confirmation only once Stripe verifies it. Until then the page is neutral.
  let body: ReactNode
  if (conversion.kind === 'lead') body = <LeadConfirmation idPrefix={idPrefix} />
  else if (conversion.verified) {
    body = <PurchaseConfirmation idPrefix={idPrefix} referenceId={conversion.id} />
  } else body = <PaymentPending idPrefix={idPrefix} />
  return (
    <PageSkeleton
      tracking={lpTrackingAttrs(lp.slug, 'lpConfirmation')}
      idPrefix={idPrefix}
      slots={[]}
    >
      {body}
      <ConversionTracker
        event={conversion.event}
        id={conversion.id}
        param={conversion.param}
        lpSlug={lp.slug}
        verified={conversion.verified}
      />
    </PageSkeleton>
  )
}
