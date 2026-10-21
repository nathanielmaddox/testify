import { NextResponse } from 'next/server'
import {
  overRateLimit,
  parseJsonObject,
  sameOrigin,
  statusForFailure,
  visitorMessage,
} from '@/lib/api_guard'
import { isStripeSessionId } from '@/lib/conversion'
import { getIntegrations, type IntegrationFailure } from '@/lib/integrations'

/**
 * `POST /api/feedback`: saves the "What almost stopped you" answer from the paid confirmation page.
 * Body (JSON object): `{ referenceId, page, message, contactEmail? }`. `referenceId` is the Stripe
 * Checkout session id the confirmation page verified; the payments adapter must confirm it as paid
 * before anything is saved. `page` is the path (no query string). Nothing goes in the URL.
 *
 * Responses follow the adapter result: `{ ok: true, id }`, or `{ ok: false, reason, message }` with a
 * visitor-safe message. The adapter's own message is logged on the server only.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RATE_WINDOW_MS = 60_000
const RATE_MAX = 5
const MESSAGE_MAX = 2000
const PAGE_MAX = 200
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type FeedbackResponse = { ok: true; id: string } | IntegrationFailure

function reply(body: FeedbackResponse, status: number) {
  return NextResponse.json<FeedbackResponse>(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

function invalid(message: string) {
  return reply({ ok: false, reason: 'invalid-input', message }, 400)
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return reply(
      { ok: false, reason: 'invalid-input', message: 'Cross-site request refused.' },
      403
    )
  }
  if (overRateLimit('feedback', request, RATE_MAX, RATE_WINDOW_MS)) {
    return reply(
      { ok: false, reason: 'provider-error', message: 'Too many tries. Try again later.' },
      429
    )
  }

  const body = await parseJsonObject(request)
  if (!body) return invalid('Body must be a JSON object.')

  const referenceId = typeof body['referenceId'] === 'string' ? body['referenceId'] : ''
  if (!isStripeSessionId(referenceId)) return invalid('Unknown order.')

  const payments = getIntegrations().payments
  if (!(await payments.verifyPaidSession(referenceId))) {
    return invalid('We could not confirm this order.')
  }

  const message = typeof body['message'] === 'string' ? body['message'].trim() : ''
  if (!message || message.length > MESSAGE_MAX) return invalid('Write a short message first.')

  const page = typeof body['page'] === 'string' ? body['page'].trim() : ''
  if (!page || page.length > PAGE_MAX || !page.startsWith('/') || page.includes('?')) {
    return invalid('Page is not valid.')
  }

  const rawEmail = body['contactEmail']
  let contactEmail: string | undefined
  if (rawEmail !== undefined && rawEmail !== '') {
    if (typeof rawEmail !== 'string' || rawEmail.length > 254 || !EMAIL_RE.test(rawEmail.trim())) {
      return invalid('Email is not valid.')
    }
    contactEmail = rawEmail.trim()
  }

  const saved = await getIntegrations().dataStore.saveFeedback({
    page,
    message,
    ...(contactEmail ? { contactEmail } : {}),
  })
  if (!saved.ok) {
    console.warn(`[feedback] save failed (${saved.reason}): ${saved.message}`)
    return reply(
      { ok: false, reason: saved.reason, message: visitorMessage(saved.reason) },
      statusForFailure(saved.reason)
    )
  }
  return reply({ ok: true, id: saved.id }, 200)
}
