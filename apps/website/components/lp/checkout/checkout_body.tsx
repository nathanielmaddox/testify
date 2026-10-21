// Checkout body: the story column (left) and the sticky pay card (right), then the trust row.
// Owner ruling (checkout-99-v4): story left, one sticky pay card right; the card stays in view on
// large screens and stacks below the story on small ones. Server component: it composes the client
// form and FAQ, the server story blocks and the trust row, and formats the offer price for them.
import { PageSection } from '@testify/style-guide/components/PageSection'
import { CheckoutFaq } from './checkout_faq'
import { CheckoutForm } from './checkout_form'
import { CheckoutPromises } from './checkout_promises'
import { CheckoutTrustRow } from './checkout_trust_row'
import { AfterPaySteps, OrderSummary } from './order_summary'

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
  const amountLabel = `$${offer.price}`
  const priceLabel = `$${offer.price}/${offer.interval}`
  return (
    <PageSection as="div" flush width="grid" className="pb-16">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.38fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
        <div className="flex min-w-0 flex-col gap-10">
          <OrderSummary
            idPrefix={idPrefix}
            offerName={offer.name}
            amountLabel={`${amountLabel}.00`}
            priceLabel={priceLabel}
            currency={offer.currency}
            interval={offer.interval}
            price={offer.price}
          />
          <CheckoutPromises idPrefix={idPrefix} />
          <AfterPaySteps idPrefix={idPrefix} />
          <CheckoutFaq idPrefix={idPrefix} />
        </div>
        <div className="min-w-0 lg:sticky lg:top-[88px]">
          <CheckoutForm
            idPrefix={idPrefix}
            slug={slug}
            successPath={successPath}
            amountLabel={amountLabel}
            priceLabel={priceLabel}
            guaranteeTitle="Love It or It's Free."
            guaranteeBody={`If your first month isn't worth it to you, tell us within [7] days after it ends and we refund the full ${amountLabel}. You keep all 60 pieces.`}
            value={offer.price}
            currency={offer.currency}
          />
        </div>
      </div>
      <CheckoutTrustRow idPrefix={idPrefix} />
    </PageSection>
  )
}
