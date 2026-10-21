// Purchase page for an offer LP: /lp/<slug>/checkout. Server component. Renders the intro, the
// checkout body (story column, pay card, trust row) and the checkout tracker. Never indexed.
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { CheckoutBody } from '@/components/lp/checkout/checkout_body'
import { CheckoutIntro } from '@/components/lp/checkout/checkout_intro'
import { CheckoutTracker } from '@/components/lp/checkout_tracker'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { lpConfirmationPath, getOfferLandingPage, lpCheckoutPath } from '@/lib/landing_pages'
import { lpCheckoutMetadata } from '@/lib/metadata'
import { lpTrackingAttrs } from '@/lib/tracking'

/** Rendered per request: never cached (also `Cache-Control: no-store`, next.config.js). */
export const dynamic = 'force-dynamic'

/**
 * PURCHASE page for an offer LP: `/lp/<slug>/checkout`, funnel step `checkout`, between the LP and
 * its confirmation page. Same focused (lp) chrome (wordmark only). Always `noindex, nofollow`,
 * never in the sitemap.
 *
 * Served only for slugs whose registry entry has an `offer`; any other slug is a 404. An LP that
 * shares another LP's offer (the retargeting LP) 307s to its `offer.checkoutSlug` checkout, keeping
 * the query string, so there is one purchase page per offer.
 *
 * Layout (checkout-99-v4): intro, then the story column on the left (order summary, promises, what
 * happens after you pay, FAQ) and one sticky pay card on the right (email, name, business name, the
 * Stripe Payment Element, charge notice, button, guarantee), then the trust row. The form posts `CheckoutRequest` to `/api/checkout`; Stripe
 * returns the buyer to `/lp/<slug>/confirmation?session_id=...` (`stripeSuccessUrl`).
 */
type Params = Promise<{ slug: string }>
type SearchParams = Promise<Record<string, string | string[] | undefined>>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const lp = getOfferLandingPage((await params).slug)
  return lp ? lpCheckoutMetadata(lp) : {}
}

function queryString(searchParams: Record<string, string | string[] | undefined>): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (typeof item === 'string') query.append(key, item)
    }
  }
  const out = query.toString()
  return out ? `?${out}` : ''
}

export default async function LpCheckoutPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const lp = getOfferLandingPage((await params).slug)
  if (!lp?.offer) notFound()
  if (lp.offer.checkoutSlug !== lp.slug) {
    redirect(`${lpCheckoutPath(lp.offer.checkoutSlug)}${queryString(await searchParams)}`)
  }

  const idPrefix = `lp-${lp.slug}-checkout`
  const { offer } = lp
  return (
    <PageSkeleton tracking={lpTrackingAttrs(lp.slug, 'lpCheckout')} idPrefix={idPrefix} slots={[]}>
      <CheckoutIntro idPrefix={idPrefix} />
      <CheckoutBody
        idPrefix={idPrefix}
        slug={lp.slug}
        successPath={lpConfirmationPath(lp.slug)}
        offer={offer}
      />
      <CheckoutTracker
        lpSlug={lp.slug}
        formSlotId={`${idPrefix}-form`}
        value={offer.price}
        currency={offer.currency}
      />
    </PageSkeleton>
  )
}
