import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { CheckoutTracker } from '@/components/lp/checkout_tracker'
import { PageSkeleton, SectionSlot } from '@/components/skeleton/page_skeleton'
import { CHECKOUT_API_PATH, CHECKOUT_UI_MODE } from '@/lib/checkout'
import { lpConfirmationPath, getOfferLandingPage, lpCheckoutPath } from '@/lib/landing_pages'
import { lpCheckoutMetadata } from '@/lib/metadata'
import { lpTrackingAttrs } from '@/lib/tracking'

/** Rendered per request: never cached (also `Cache-Control: no-store`, next.config.js). */
export const dynamic = 'force-dynamic'

/**
 * PURCHASE page skeleton for an offer LP: `/lp/<slug>/checkout`, funnel step
 * `checkout`, between the LP and its confirmation page. Same focused (lp)
 * chrome: wordmark only, no nav. Always `noindex, nofollow`, never in the
 * sitemap.
 *
 * Served only for slugs whose registry entry has an `offer`; any other slug
 * is a 404. An LP that shares another LP's offer (e.g. the retargeting LP)
 * 307s to its `offer.checkoutSlug` checkout, keeping the query string, so
 * there is one purchase page per offer.
 *
 * Slots: order-summary, included-recap, guarantee, form (contact + business
 * name; posts `CheckoutRequest` to `/api/checkout`), payment (Stripe element
 * mount), trust-row, after-you-pay. Stripe returns the buyer to
 * `/lp/<slug>/confirmation?session_id=...` (`stripeSuccessUrl`).
 */
const SLOTS = [
  { slot: 'order-summary', label: 'Order summary' },
  { slot: 'included-recap', label: 'What is included' },
  { slot: 'guarantee', label: 'Guarantee' },
  { slot: 'form', label: 'Contact and business name' },
  { slot: 'payment', label: 'Payment (Stripe element)' },
  { slot: 'trust-row', label: 'Trust row' },
  { slot: 'after-you-pay', label: 'What happens after you pay' },
] as const

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
      {SLOTS.map(({ slot, label }) => {
        if (slot === 'order-summary') {
          return (
            <SectionSlot
              key={slot}
              idPrefix={idPrefix}
              slot={slot}
              label={label}
              data-offer-name={offer.name}
              data-offer-price={String(offer.price)}
              data-offer-currency={offer.currency}
              data-offer-interval={offer.interval}
            />
          )
        }
        if (slot === 'form') {
          return (
            <SectionSlot
              key={slot}
              idPrefix={idPrefix}
              slot={slot}
              label={label}
              data-lp-slug={lp.slug}
              data-checkout-api={CHECKOUT_API_PATH}
              data-success-path={lpConfirmationPath(lp.slug)}
            />
          )
        }
        if (slot === 'payment') {
          return (
            <SectionSlot
              key={slot}
              idPrefix={idPrefix}
              slot={slot}
              label={label}
              data-stripe-ui-mode={CHECKOUT_UI_MODE}
            />
          )
        }
        return <SectionSlot key={slot} idPrefix={idPrefix} slot={slot} label={label} />
      })}
      <CheckoutTracker
        lpSlug={lp.slug}
        formSlotId={`${idPrefix}-form`}
        value={offer.price}
        currency={offer.currency}
      />
    </PageSkeleton>
  )
}
