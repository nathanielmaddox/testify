// Checkout body: two columns under the intro. LEFT the plan card (offer name, price, four included
// items). RIGHT the pay card, sticky at lg and stacked below the plan card on small screens.
// Owner ruling: the checkout page does only this. 64px between the intro and the columns.
//
// CUT from this page (components kept in the folder, not rendered here):
// - CheckoutPromises ("You're covered five ways"): too much for the page; the reassurance line
//   under the button carries the guarantee.
// - CheckoutFaq (two questions): cut, no FAQ on the purchase page.
// - CheckoutTrustRow (Stripe line, setup-fee placeholder, legal links): cut; the footer carries the
//   legal links on the (lp) chrome.
// - AfterPaySteps ("What happens after you pay"): cut; the confirmation page explains next steps.
// - OrderSummary (kicker pill, tax row, totals, "Your part" line): replaced by CheckoutPlanCard.
// - The guarantee block and the support line: folded into the one reassurance line.
// - The auto-renewal charge paragraph: its one legal sentence stays as small muted text under the
//   reassurance line, in CheckoutForm.
// - StickyBuyBar and the person/quote card: not on this page (the sticky bar is LP-only, and the
//   person card belongs to the confirmation page).
import { PageSection } from '@testify/style-guide/components/PageSection'
import { CheckoutForm } from './checkout_form'
import { CheckoutPlanCard } from './checkout_plan_card'

export interface CheckoutOffer {
  name: string
  /** Whole currency units, 99 = $99. */
  price: number
  currency: string
  interval: string
}

export function CheckoutBody({
  idPrefix,
  slug,
  successPath,
  offer,
}: {
  idPrefix: string
  slug: string
  successPath: string
  offer: CheckoutOffer
}) {
  const priceLabel = `$${offer.price}/${offer.interval}`
  return (
    <PageSection as="div" flush width="grid" className="pt-16 pb-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-14">
        <div className="min-w-0">
          <CheckoutPlanCard idPrefix={idPrefix} offerName={offer.name} priceLabel={priceLabel} />
        </div>
        <div className="min-w-0 lg:sticky lg:top-[88px]">
          <CheckoutForm
            idPrefix={idPrefix}
            slug={slug}
            successPath={successPath}
            priceLabel={priceLabel}
            value={offer.price}
            currency={offer.currency}
          />
        </div>
      </div>
    </PageSection>
  )
}
