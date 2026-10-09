'use client'

import { useEffect } from 'react'
import { landingLpSlugs } from '@/lib/attribution'
import { track, type TrackProps } from '@/lib/tracking'

/** Ids already fired in this page load (covers Strict Mode double effects). */
const firedThisLoad = new Set<string>()

/**
 * Checkout page events. Renders nothing.
 * - `checkout_view` once per page load on mount (GA4 `checkout_view` /
 *   Meta custom `CheckoutView`).
 * - `begin_checkout` once per page load on the FIRST interaction inside the
 *   form slot (`#<formSlotId>`): GA4 `begin_checkout` / Meta `InitiateCheckout`.
 * - `add_payment_info` is a stub: `trackAddPaymentInfo` is called by the
 *   Stripe element's completion handler once that UI exists.
 *
 * Every event carries `lp_slug` (the checkout host) and the offer value, plus
 * the first/last-touch LP slugs (which LP sent the visitor here).
 */
export function CheckoutTracker({
  lpSlug,
  formSlotId,
  value,
  currency,
}: {
  lpSlug: string
  formSlotId: string
  value: number
  currency: string
}) {
  useEffect(() => {
    const props = checkoutProps(lpSlug, value, currency)
    fireOnce(`checkout_view:${lpSlug}`, () => track('checkout_view', props))

    const form = document.getElementById(formSlotId)
    if (!form) return
    const onFirstInteraction = () =>
      fireOnce(`begin_checkout:${lpSlug}`, () => track('begin_checkout', props))
    form.addEventListener('focusin', onFirstInteraction, { once: true })
    form.addEventListener('pointerdown', onFirstInteraction, { once: true })
    return () => {
      form.removeEventListener('focusin', onFirstInteraction)
      form.removeEventListener('pointerdown', onFirstInteraction)
    }
  }, [lpSlug, formSlotId, value, currency])

  return null
}

function fireOnce(key: string, fire: () => void): void {
  if (firedThisLoad.has(key)) return
  firedThisLoad.add(key)
  fire()
}

function checkoutProps(lpSlug: string, value: number, currency: string): TrackProps {
  const landing = landingLpSlugs()
  return {
    lp_slug: lpSlug,
    value,
    currency,
    first_lp_slug: landing.first || undefined,
    last_lp_slug: landing.last || undefined,
  }
}

/**
 * STUB: call from the Stripe element's `onChange`/completion handler when
 * the payment details become complete. Fires once per page load.
 */
export function trackAddPaymentInfo(lpSlug: string, value: number, currency: string): void {
  fireOnce(`add_payment_info:${lpSlug}`, () =>
    track('add_payment_info', checkoutProps(lpSlug, value, currency))
  )
}
