import { NextResponse } from 'next/server'
import {
  CHECKOUT_LIMITS,
  type CheckoutContact,
  type CheckoutErrorCode,
  type CheckoutRequest,
  type CheckoutResponse,
} from '@/lib/checkout'
import { overRateLimit, parseJsonObject, sameOrigin, visitorMessage } from '@/lib/api_guard'
import { getIntegrations } from '@/lib/integrations'

/**
 * `POST /api/checkout`: creates the Checkout Session for an offer LP's purchase page through the
 * payments adapter (`getIntegrations().payments`, lib/integrations/providers/stripe.ts). Body:
 * `CheckoutRequest` (lib/checkout.ts). Returns `CheckoutResponse`: the embedded client secret or the
 * hosted URL, or `{ ok: false, error }`.
 *
 * Without a connected payments provider the adapter answers `checkout_not_configured` (503) and makes
 * no call. Success lands on `/lp/<slug>/confirmation?session_id=...` (stripeSuccessUrl).
 * `X-Robots-Tag: noindex` comes from next.config.js (`/api/:path*`).
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 10

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

/** HTTP status for an error code the adapter returns. */
function statusFor(error: CheckoutErrorCode): number {
  switch (error) {
    case 'unknown_offer':
      return 404
    case 'checkout_not_configured':
      return 503
    case 'invalid_request':
      return 400
    case 'forbidden_origin':
      return 403
    case 'rate_limit':
      return 429
    default:
      return 502
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return fail(403, 'forbidden_origin', 'Cross-site request refused.')
  if (overRateLimit('checkout', request, RATE_MAX, RATE_WINDOW_MS)) {
    return fail(429, 'rate_limit', 'Too many tries. Wait a few minutes, then try again.')
  }

  const body = await parseJsonObject(request)
  if (!body) return fail(400, 'invalid_request', 'Body must be a JSON object.')

  const contact = parseContact(body['contact'])
  if (!contact) return fail(400, 'invalid_request', 'Email, name and business name are required.')

  const slug = typeof body['slug'] === 'string' ? body['slug'] : ''
  const attribution = typeof body['attribution'] === 'string' ? body['attribution'] : undefined
  const checkoutRequest: CheckoutRequest = {
    slug,
    contact,
    ...(attribution !== undefined ? { attribution } : {}),
  }

  const result = await getIntegrations().payments.createCheckoutSession(checkoutRequest)
  if (result.ok)
    return NextResponse.json<CheckoutResponse>(result, { headers: { 'Cache-Control': 'no-store' } })
  // The adapter's message is for server logs. The visitor gets a generic line for the same code.
  console.warn(`[checkout] adapter failed (${result.error}): ${result.message}`)
  return fail(
    statusFor(result.error),
    result.error,
    visitorMessage(result.error === 'checkout_not_configured' ? 'not-connected' : 'provider-error')
  )
}
