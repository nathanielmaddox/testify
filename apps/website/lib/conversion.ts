/**
 * Conversion page contract (`/lp/<slug>/confirmation`, one per LP). Server-safe.
 *
 * The page only renders for a request that names WHAT converted:
 * - `session_id`: a Stripe Checkout session id (`cs_test_...` / `cs_live_...`),
 *   put there by Stripe from `stripeSuccessUrl()` -> purchase_complete
 * - `lead`: an opaque lead token issued by the lead store -> lead_submit
 *
 * Nothing else belongs in that URL: no email, name, phone or UTM params
 * (attribution lives in first-party storage, lib/attribution.ts).
 */
import { lpConfirmationPath } from './landing_pages'
import { siteConfig } from './site.config'
import type { TrackEvent } from './tracking'

/** Conversion value sent with lead_submit / purchase_complete. From the offer. */
export const CONVERSION_VALUE = siteConfig.offer.price
export const CONVERSION_CURRENCY = siteConfig.offer.currency

export const CONVERSION_PARAMS = { stripe: 'session_id', lead: 'lead' } as const

/** Stripe Checkout session ids: cs_test_ / cs_live_ then an opaque token. */
const STRIPE_SESSION_RE = /^cs_(?:test|live)_[A-Za-z0-9]{10,250}$/

/** True for a Stripe Checkout session id shape. Shape only: the server still verifies it. */
export function isStripeSessionId(value: string): boolean {
  return STRIPE_SESSION_RE.test(value)
}
/** Lead tokens: URL-safe opaque id (uuid, nanoid, ulid all fit). No '@', no spaces. */
const LEAD_TOKEN_RE = /^[A-Za-z0-9_-]{16,128}$/

export type ConversionKind = 'purchase' | 'lead'

export type ConversionResult =
  | {
      ok: true
      kind: ConversionKind
      /** The id, reused as analytics eventID / transaction_id for dedupe. */
      id: string
      event: Extract<TrackEvent, 'purchase_complete' | 'lead_submit'>
      /** The query param the id came from. */
      param: (typeof CONVERSION_PARAMS)[keyof typeof CONVERSION_PARAMS]
      /** false while only the shape is checked. */
      verified: boolean
    }
  | { ok: false; reason: 'missing' | 'invalid' }

type ParamsLike = Record<string, string | string[] | undefined>

function single(value: string | string[] | undefined): string | undefined | null {
  if (value === undefined) return undefined
  // A repeated param is ambiguous: treat it as invalid, never pick one.
  if (Array.isArray(value)) return value.length === 1 ? (value[0] ?? null) : null
  return value
}

/**
 * Shape check only: is this request naming a conversion at all? Always
 * `verified: false`. The server adds the source-of-truth check in
 * `verifyConversion` (lib/conversion_server.ts), which is server-only because
 * the Stripe lookup needs the secret key. This module stays client-safe.
 */
export function checkConversionShape(params: ParamsLike): ConversionResult {
  const sessionId = single(params[CONVERSION_PARAMS.stripe])
  const lead = single(params[CONVERSION_PARAMS.lead])

  if (sessionId === undefined && lead === undefined) return { ok: false, reason: 'missing' }
  // Both at once is not a shape any flow produces.
  if (sessionId !== undefined && lead !== undefined) return { ok: false, reason: 'invalid' }

  if (sessionId !== undefined) {
    if (!sessionId || !STRIPE_SESSION_RE.test(sessionId)) return { ok: false, reason: 'invalid' }
    return {
      ok: true,
      kind: 'purchase',
      id: sessionId,
      event: 'purchase_complete',
      param: CONVERSION_PARAMS.stripe,
      verified: false,
    }
  }

  if (!lead || !LEAD_TOKEN_RE.test(lead)) return { ok: false, reason: 'invalid' }
  return {
    ok: true,
    kind: 'lead',
    id: lead,
    event: 'lead_submit',
    param: CONVERSION_PARAMS.lead,
    verified: false,
  }
}

/** Relative confirmation href of LP `lpSlug` for a lead token (that LP's form redirects here). */
export function leadConfirmationHref(lpSlug: string, leadToken: string): string {
  return `${lpConfirmationPath(lpSlug)}?${CONVERSION_PARAMS.lead}=${encodeURIComponent(leadToken)}`
}

/**
 * Absolute Stripe Checkout `success_url` for LP `lpSlug`. Stripe substitutes
 * the literal `{CHECKOUT_SESSION_ID}` placeholder, so it must stay unencoded.
 */
export function stripeSuccessUrl(lpSlug: string): string {
  return `${siteConfig.url}${lpConfirmationPath(lpSlug)}?${CONVERSION_PARAMS.stripe}={CHECKOUT_SESSION_ID}`
}
