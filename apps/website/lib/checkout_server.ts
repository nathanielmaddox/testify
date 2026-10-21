/**
 * SERVER ONLY: reads secrets. Import from route handlers / server actions,
 * never from a client module. Builds the Stripe Checkout Session for an offer
 * LP. No live call happens unless STRIPE_SECRET_KEY and the offer's price env
 * var are both set.
 */
import type Stripe from 'stripe'
import { decodeAttribution, type AttributionTouch, type StoredAttribution } from './attribution'
import { CHECKOUT_UI_MODE, type CheckoutContact } from './checkout'
import { stripeSuccessUrl } from './conversion'
import { lpCheckoutPath, type LandingPage } from './landing_pages'
import { siteConfig } from './site.config'

/**
 * Stripe Price id per checkout host slug: a recurring Price (the $99/month
 * one for `done-for-you-99`). A new offer adds a case here plus its env var
 * in lib/env.d.ts and .env.example.
 */
export function stripePriceId(checkoutSlug: string): string | undefined {
  switch (checkoutSlug) {
    case 'done-for-you-99':
      return process.env.STRIPE_PRICE_DONE_FOR_YOU_99 || undefined
    default:
      return undefined
  }
}

/** What is missing for a checkout to run (for server logs, never the response). */
export function missingCheckoutEnv(checkoutSlug: string): string[] {
  const missing: string[] = []
  if (!process.env.STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY')
  if (!stripePriceId(checkoutSlug)) missing.push(`Stripe price for "${checkoutSlug}"`)
  return missing
}

/** Stripe metadata caps: 50 keys, 40-char keys, 500-char values. */
const META_MAX_KEYS = 50
const META_MAX_KEY = 40
const META_MAX_VALUE = 500

function touchMetadata(prefix: 'first' | 'last', touch: AttributionTouch): Record<string, string> {
  const out: Record<string, string> = {
    [`${prefix}_landing_path`]: touch.landingPath,
    [`${prefix}_lp_slug`]: touch.lpSlug ?? '',
    [`${prefix}_referrer_host`]: touch.referrerHost,
    [`${prefix}_at`]: touch.at,
  }
  for (const [key, value] of Object.entries(touch.params)) {
    if (value) out[`${prefix}_${key}`] = value
  }
  return out
}

/**
 * Session + subscription metadata: the LP slug plus the stored first/last
 * touch (allow-listed params only, see `getAttribution()`). Contact details
 * go to Stripe's own fields; the business name is the one kept here.
 */
export function checkoutMetadata(input: {
  lpSlug: string
  firstName: string
  lastName: string
  businessName: string
  attribution: StoredAttribution | null
}): Record<string, string> {
  const meta: Record<string, string> = {
    lp_slug: input.lpSlug,
    first_name: input.firstName,
    last_name: input.lastName,
    business_name: input.businessName,
    ...(input.attribution ? touchMetadata('first', input.attribution.first) : {}),
    ...(input.attribution ? touchMetadata('last', input.attribution.last) : {}),
  }
  return Object.fromEntries(
    Object.entries(meta)
      .filter(([, value]) => value !== '')
      .slice(0, META_MAX_KEYS)
      .map(([key, value]) => [key.slice(0, META_MAX_KEY), value.slice(0, META_MAX_VALUE)])
  )
}

/**
 * The one Stripe client for this server. Loaded lazily so an unconfigured deploy never touches the SDK.
 */
export async function stripeClient(secretKey: string): Promise<Stripe> {
  const { default: StripeSdk } = await import('stripe')
  return new StripeSdk(secretKey)
}

/**
 * True only when Stripe reports the Checkout Session as paid. A missing key, a network error or an
 * unknown id all read as NOT paid, so a conversion is never trusted on error.
 */
export async function isPaidCheckoutSession(sessionId: string): Promise<boolean> {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return false
  try {
    const stripe = await stripeClient(secretKey)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session.payment_status === 'paid'
  } catch (error) {
    console.error('[checkout] Stripe session retrieve failed', error)
    return false
  }
}

/**
 * Creates the Stripe Customer for a checkout, named "First Last" with the email and business name.
 * Call it before `checkoutSessionParams` and pass the id as `customerId`, so the Stripe customer
 * carries the name. Throws on a Stripe error; the caller answers `stripe_error`.
 */
export async function createCheckoutCustomer(
  stripe: Stripe,
  contact: CheckoutContact
): Promise<string> {
  const customer = await stripe.customers.create({
    email: contact.email,
    name: `${contact.firstName} ${contact.lastName}`,
    metadata: { business_name: contact.businessName },
  })
  return customer.id
}

/** Parse the client's encoded attribution; anything malformed reads as none. */
export function parseCheckoutAttribution(raw: unknown): StoredAttribution | null {
  return typeof raw === 'string' && raw.length <= 4096 ? decodeAttribution(raw) : null
}

/**
 * Stripe Checkout Session params for an offer LP: mode subscription, the
 * offer's recurring price, success via `stripeSuccessUrl(slug)`
 * (`/lp/<slug>/confirmation?session_id={CHECKOUT_SESSION_ID}`, read by
 * `verifyConversion`).
 */
export function checkoutSessionParams(input: {
  lp: LandingPage
  priceId: string
  contact: CheckoutContact
  attribution: StoredAttribution | null
  /** A Customer created with `createCheckoutCustomer`. When set, Stripe uses its name and email. */
  customerId?: string
}): Stripe.Checkout.SessionCreateParams {
  const { lp, priceId, contact, attribution, customerId } = input
  const metadata = checkoutMetadata({
    lpSlug: lp.slug,
    firstName: contact.firstName,
    lastName: contact.lastName,
    businessName: contact.businessName,
    attribution,
  })
  const customer = customerId ? { customer: customerId } : { customer_email: contact.email }
  const shared: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    ...customer,
    client_reference_id: lp.slug,
    metadata,
    subscription_data: { metadata },
  }
  if (CHECKOUT_UI_MODE === 'embedded_page') {
    // Embedded Checkout returns to return_url, with the same placeholder contract.
    return { ...shared, ui_mode: 'embedded_page', return_url: stripeSuccessUrl(lp.slug) }
  }
  return {
    ...shared,
    ui_mode: 'hosted_page',
    success_url: stripeSuccessUrl(lp.slug),
    cancel_url: `${siteConfig.url}${lpCheckoutPath(lp.slug)}`,
  }
}
