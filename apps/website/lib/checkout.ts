/**
 * Checkout contract shared by the purchase page (`/lp/<slug>/checkout`) and
 * `POST /api/checkout`. Client-safe: no secrets, no Stripe SDK. The server
 * side lives in lib/checkout_server.ts.
 *
 * Flow: offer LP CTA -> `/lp/<checkoutSlug>/checkout` (attributed) -> the
 * form posts a `CheckoutRequest` to the API -> the API creates a Stripe
 * Checkout Session (mode subscription) -> Stripe returns the visitor to
 * `stripeSuccessUrl(slug)` = `/lp/<slug>/confirmation?session_id={CHECKOUT_SESSION_ID}`.
 */
import { encodeAttribution, getAttribution } from './attribution'

export const CHECKOUT_API_PATH = '/api/checkout'

/**
 * How Stripe collects payment. `embedded_page`: Stripe's embedded Checkout
 * mounts in the page's `payment` slot (needs NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 * and @stripe/stripe-js when the UI is built). `hosted_page`: redirect to
 * checkout.stripe.com. [CONFIRM] with the owner (brief: embedded or redirect).
 */
export type CheckoutUiMode = 'embedded_page' | 'hosted_page'
export const CHECKOUT_UI_MODE: CheckoutUiMode = 'embedded_page'

/** Contact fields the checkout form collects. */
export interface CheckoutContact {
  email: string
  name: string
  businessName: string
}

/** Body of `POST /api/checkout`. */
export interface CheckoutRequest {
  /** The checkout host LP (`/lp/<slug>/checkout`). */
  slug: string
  contact: CheckoutContact
  /**
   * Stored first/last touch, encoded with `encodeAttribution`. The server
   * re-validates it with `decodeAttribution`, so only allow-listed params
   * reach Stripe metadata. Absent when nothing was captured.
   */
  attribution?: string
}

export type CheckoutErrorCode =
  | 'checkout_not_configured'
  | 'invalid_request'
  | 'unknown_offer'
  | 'forbidden_origin'
  | 'stripe_error'

export type CheckoutResponse =
  | { ok: true; mode: 'embedded_page'; sessionId: string; clientSecret: string }
  | { ok: true; mode: 'hosted_page'; sessionId: string; url: string }
  | { ok: false; error: CheckoutErrorCode; message: string }

/** Field limits, shared by the form and the API. */
export const CHECKOUT_LIMITS = { email: 254, name: 120, businessName: 160 } as const

/**
 * Browser: start the purchase for checkout host `slug`. Attaches the stored
 * attribution (`getAttribution()`) in the body, never in a URL. The caller
 * mounts embedded Checkout with `clientSecret`, or follows `url` (hosted).
 */
export async function startCheckout(
  slug: string,
  contact: CheckoutContact
): Promise<CheckoutResponse> {
  const stored = getAttribution()
  const body: CheckoutRequest = {
    slug,
    contact,
    ...(stored ? { attribution: encodeAttribution(stored) } : {}),
  }
  try {
    const response = await fetch(CHECKOUT_API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return (await response.json()) as CheckoutResponse
  } catch {
    return { ok: false, error: 'stripe_error', message: 'Checkout could not be started.' }
  }
}
