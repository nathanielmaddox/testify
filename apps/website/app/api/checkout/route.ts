import { NextResponse } from 'next/server'
import {
  CHECKOUT_LIMITS,
  CHECKOUT_UI_MODE,
  type CheckoutContact,
  type CheckoutErrorCode,
  type CheckoutResponse,
} from '@/lib/checkout'
import {
  checkoutSessionParams,
  missingCheckoutEnv,
  parseCheckoutAttribution,
  stripePriceId,
} from '@/lib/checkout_server'
import { getOfferLandingPage } from '@/lib/landing_pages'

/**
 * `POST /api/checkout`: creates the Stripe Checkout Session (mode
 * subscription) for an offer LP's purchase page. Body: `CheckoutRequest`
 * (lib/checkout.ts). Returns `CheckoutResponse`: the embedded client secret
 * or the hosted URL, or `{ ok: false, error }`.
 *
 * STRUCTURE ONLY until keys exist: without STRIPE_SECRET_KEY and the offer's
 * price env var it answers 503 `checkout_not_configured` and makes no call.
 * Success lands on `/lp/<slug>/confirmation?session_id=...` (stripeSuccessUrl);
 * session + subscription metadata carry the LP slug and stored attribution.
 * `X-Robots-Tag: noindex` comes from next.config.js (`/api/:path*`).
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function fail(status: number, error: CheckoutErrorCode, message: string) {
  return NextResponse.json<CheckoutResponse>(
    { ok: false, error, message },
    { status, headers: { 'Cache-Control': 'no-store' } }
  )
}

function text(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed && trimmed.length <= max ? trimmed : null
}

function parseContact(raw: unknown): CheckoutContact | null {
  if (!raw || typeof raw !== 'object') return null
  const input = raw as Record<string, unknown>
  const email = text(input['email'], CHECKOUT_LIMITS.email)
  const name = text(input['name'], CHECKOUT_LIMITS.name)
  const businessName = text(input['businessName'], CHECKOUT_LIMITS.businessName)
  if (!email || !EMAIL_RE.test(email) || !name || !businessName) return null
  return { email, name, businessName }
}

/** Same-origin only: a browser POST from another site is refused. */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return fail(403, 'forbidden_origin', 'Cross-site request refused.')

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return fail(400, 'invalid_request', 'Body must be JSON.')
  }

  const slug = typeof body['slug'] === 'string' ? body['slug'] : ''
  const lp = getOfferLandingPage(slug)
  // Only a checkout HOST sells (an LP sharing an offer checks out on its host).
  if (!lp?.offer || lp.offer.checkoutSlug !== lp.slug) {
    return fail(404, 'unknown_offer', 'No checkout for this page.')
  }

  const missing = missingCheckoutEnv(lp.slug)
  const secretKey = process.env.STRIPE_SECRET_KEY
  const priceId = stripePriceId(lp.slug)
  if (missing.length > 0 || !secretKey || !priceId) {
    console.warn(`[checkout] not configured for "${lp.slug}": missing ${missing.join(', ')}`)
    return fail(503, 'checkout_not_configured', 'Checkout is not available yet.')
  }

  const contact = parseContact(body['contact'])
  if (!contact) return fail(400, 'invalid_request', 'Email, name and business name are required.')

  const params = checkoutSessionParams({
    lp,
    priceId,
    contact,
    attribution: parseCheckoutAttribution(body['attribution']),
  })

  try {
    // Loaded only once keys exist, so an unconfigured deploy never touches the SDK.
    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(secretKey)
    const session = await stripe.checkout.sessions.create(params)
    const headers = { 'Cache-Control': 'no-store' }
    if (CHECKOUT_UI_MODE === 'embedded_page') {
      if (!session.client_secret) return fail(502, 'stripe_error', 'Checkout could not start.')
      return NextResponse.json<CheckoutResponse>(
        {
          ok: true,
          mode: 'embedded_page',
          sessionId: session.id,
          clientSecret: session.client_secret,
        },
        { headers }
      )
    }
    if (!session.url) return fail(502, 'stripe_error', 'Checkout could not start.')
    return NextResponse.json<CheckoutResponse>(
      { ok: true, mode: 'hosted_page', sessionId: session.id, url: session.url },
      { headers }
    )
  } catch (error) {
    console.error('[checkout] Stripe session create failed', error)
    return fail(502, 'stripe_error', 'Checkout could not start.')
  }
}
