/**
 * SERVER ONLY. The real payments adapter, and the first one wired. It delegates to
 * `lib/checkout_server.ts` (price lookup, metadata, session params, Stripe client, paid check), so
 * the Stripe rules live in one place.
 *
 * Env: STRIPE_SECRET_KEY (server), STRIPE_PRICE_<OFFER> per offer (server, see `stripePriceId`),
 * NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (public, embedded Checkout), STRIPE_WEBHOOK_SECRET (server,
 * for the webhook handler that is not written yet).
 *
 * `app/api/checkout/route.ts` calls `getIntegrations().payments.createCheckoutSession`, and
 * `lib/conversion_server.ts` calls `verifyPaidSession`. Both reach this file through the selector.
 */
import { CHECKOUT_UI_MODE, type CheckoutRequest, type CheckoutResponse } from '../../checkout'
import {
  checkoutSessionParams,
  createCheckoutCustomer,
  isPaidCheckoutSession,
  missingCheckoutEnv,
  parseCheckoutAttribution,
  stripeClient,
  stripePriceId,
} from '../../checkout_server'
import { getOfferLandingPage } from '../../landing_pages'
import type { PaymentsAdapter } from '../types'

export function createStripePayments(): PaymentsAdapter {
  return {
    async createCheckoutSession(request: CheckoutRequest): Promise<CheckoutResponse> {
      const lp = getOfferLandingPage(request.slug)
      // Only a checkout HOST sells, the same rule as the route.
      if (!lp?.offer || lp.offer.checkoutSlug !== lp.slug) {
        return { ok: false, error: 'unknown_offer', message: 'No checkout for this page.' }
      }

      const missing = missingCheckoutEnv(lp.slug)
      const secretKey = process.env.STRIPE_SECRET_KEY
      const priceId = stripePriceId(lp.slug)
      if (missing.length > 0 || !secretKey || !priceId) {
        console.warn(`[checkout] not configured for "${lp.slug}": missing ${missing.join(', ')}`)
        return {
          ok: false,
          error: 'checkout_not_configured',
          message: 'Checkout is not available yet.',
        }
      }

      try {
        const stripe = await stripeClient(secretKey)
        // Named "First Last" with the email, so the Stripe customer is identifiable.
        const customerId = await createCheckoutCustomer(stripe, request.contact)
        const params = checkoutSessionParams({
          lp,
          priceId,
          contact: request.contact,
          attribution: parseCheckoutAttribution(request.attribution),
          customerId,
        })
        const session = await stripe.checkout.sessions.create(params)
        if (CHECKOUT_UI_MODE === 'embedded_page') {
          if (!session.client_secret) {
            return { ok: false, error: 'stripe_error', message: 'Checkout could not start.' }
          }
          return {
            ok: true,
            mode: 'embedded_page',
            sessionId: session.id,
            clientSecret: session.client_secret,
          }
        }
        if (!session.url) {
          return { ok: false, error: 'stripe_error', message: 'Checkout could not start.' }
        }
        return { ok: true, mode: 'hosted_page', sessionId: session.id, url: session.url }
      } catch (error) {
        console.error('[checkout] Stripe session create failed', error)
        return { ok: false, error: 'stripe_error', message: 'Checkout could not start.' }
      }
    },
    verifyPaidSession: isPaidCheckoutSession,
  }
}
