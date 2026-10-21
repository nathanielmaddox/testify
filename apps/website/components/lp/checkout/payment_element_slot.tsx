'use client'

// Payment slot for the checkout pay form. Owner ruling: payment details are collected ONLY by the
// Stripe Payment Element (card, Apple Pay, Google Pay, Link). No custom wallet buttons or card fields.
// onPaymentDetailsEntered is the add_payment_info hook point: it must fire only once the element
// reports complete payment details, never on submit or session creation.

import { CHECKOUT_UI_MODE } from '@/lib/checkout'
//
// TODO(stripe): the Stripe client packages (@stripe/stripe-js, @stripe/react-stripe-js) are not in
// apps/website/package.json yet, and we do not add dependencies here. When they are added, mount the
// real Payment Element inside this region: wrap the form in <Elements> with
// `{ clientSecret, appearance: stripeAppearance, fonts: stripeFonts }` (packages/style-guide
// stripe-appearance.ts), using NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY. The clientSecret comes from the
// POST /api/checkout response (embedded_page mode). Call trackAddPaymentInfo from the element's
// change handler once the details are complete.

export function PaymentElementSlot({
  idPrefix,
  clientSecret,
  headingId,
  onPaymentDetailsEntered,
}: {
  idPrefix: string
  /** Set once POST /api/checkout returns an embedded session (not yet mounted: see TODO above). */
  clientSecret: string | null
  headingId: string
  /**
   * Hook point for add_payment_info. TODO(stripe): call this from the Payment Element's change
   * handler when the element reports complete details. Nothing calls it yet because no element is
   * mounted, so add_payment_info does not fire at all until then.
   */
  onPaymentDetailsEntered?: () => void
}) {
  // TODO(stripe): remove this line when the Payment Element change handler calls onPaymentDetailsEntered.
  void onPaymentDetailsEntered
  return (
    <section
      id={`${idPrefix}-payment`}
      aria-labelledby={headingId}
      data-stripe-ui-mode={CHECKOUT_UI_MODE}
      data-stripe-ready={clientSecret ? 'pending-mount' : 'not-started'}
      className="flex flex-col gap-3"
    >
      <h3 id={headingId} className="sr-only">
        Payment details
      </h3>
      <div className="flex min-h-[200px] flex-col items-stretch justify-center gap-2 rounded-tile border border-dashed border-brand-border-strong p-6 text-center">
        <p className="font-text text-brand-small text-brand-ink-subtle">
          Secure payment fields load here.
        </p>
      </div>
    </section>
  )
}
