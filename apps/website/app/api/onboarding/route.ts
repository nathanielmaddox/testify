import { NextResponse } from 'next/server'
import { BUSINESS_TYPE_OPTIONS } from '@/lib/get_started'
import {
  overRateLimit,
  parseJsonObject,
  sameOrigin,
  statusForFailure,
  visitorMessage,
} from '@/lib/api_guard'
import { isStripeSessionId } from '@/lib/conversion'
import {
  getIntegrations,
  MAX_PHOTO_BYTES,
  UPLOAD_ACCEPTED_TYPES,
  type IntegrationFailure,
  type UploadTarget,
} from '@/lib/integrations'

/**
 * `POST /api/onboarding`: saves the onboarding answers from the paid confirmation page. Body (JSON
 * object): `{ referenceId, answers: { trade?, town?, mobile?, platforms? }, photos?: [{ fileName,
 * contentType, sizeBytes }] }`. `referenceId` is the Stripe Checkout session id the confirmation page
 * verified.
 *
 * The session must be verified as paid by the payments adapter. Every photo is validated (type and
 * `MAX_PHOTO_BYTES`) before any upload target is minted. Upload targets come from the upload adapter,
 * and answers are saved only after every target succeeds. Answers are never echoed back.
 *
 * REPLAY: a second successful submit for the same `referenceId` is refused for REPLAY_WINDOW_MS. The
 * guard is in-memory and per instance, so it is a speed bump only. A store-level dedupe on
 * `referenceId` in the data store is the real fix, and it belongs with the data adapter.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RATE_WINDOW_MS = 60_000
const RATE_MAX = 10
const MAX_PHOTOS = 10
const REPLAY_WINDOW_MS = 24 * 60 * 60 * 1000
const TRADE_VALUES = new Set<string>(BUSINESS_TYPE_OPTIONS.map((option) => option.value))
const PLATFORMS = new Set(['facebook', 'instagram'])
const PHONE_RE = /^[0-9+()\-. ]{0,30}$/
const FILE_NAME_MAX = 120

/** Reference ids with a successful save, and when. Per instance, cleared by age. */
const saved = new Map<string, number>()

export type OnboardingResponse =
  { ok: true; id: string; uploads: UploadTarget[] } | IntegrationFailure

function reply(body: OnboardingResponse, status: number) {
  return NextResponse.json<OnboardingResponse>(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

function invalid(message: string) {
  return reply({ ok: false, reason: 'invalid-input', message }, 400)
}

function optionalText(value: unknown, max: number): string | null {
  if (value === undefined) return ''
  if (typeof value !== 'string' || value.length > max) return null
  return value.trim()
}

function parseAnswers(raw: unknown): Record<string, string | string[]> | null {
  if (raw === undefined) return {}
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const input = raw as Record<string, unknown>
  const trade = optionalText(input['trade'], 40)
  const town = optionalText(input['town'], 120)
  const mobile = optionalText(input['mobile'], 30)
  if (trade === null || town === null || mobile === null) return null
  if (trade !== '' && !TRADE_VALUES.has(trade)) return null
  if (mobile !== '' && !PHONE_RE.test(mobile)) return null

  let platforms: string[] = []
  if (input['platforms'] !== undefined) {
    if (!Array.isArray(input['platforms'])) return null
    platforms = input['platforms'].map((item) => String(item))
    if (!platforms.every((item) => PLATFORMS.has(item))) return null
  }
  return { trade, town, mobile, platforms }
}

/** Drops replay records older than the window, so the map stays small. */
function pruneSaved(now: number): void {
  for (const [id, at] of saved) {
    if (now - at >= REPLAY_WINDOW_MS) saved.delete(id)
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return reply(
      { ok: false, reason: 'invalid-input', message: 'Cross-site request refused.' },
      403
    )
  }
  if (overRateLimit('onboarding', request, RATE_MAX, RATE_WINDOW_MS)) {
    return reply(
      { ok: false, reason: 'provider-error', message: 'Too many tries. Try again later.' },
      429
    )
  }

  const body = await parseJsonObject(request)
  if (!body) return invalid('Body must be a JSON object.')

  const referenceId = typeof body['referenceId'] === 'string' ? body['referenceId'] : ''
  if (!isStripeSessionId(referenceId)) return invalid('Unknown order.')

  const now = Date.now()
  pruneSaved(now)
  if (saved.has(referenceId)) return invalid('Answers for this order are already saved.')

  const integrations = getIntegrations()
  if (!(await integrations.payments.verifyPaidSession(referenceId))) {
    return invalid('We could not confirm this order.')
  }

  const answers = parseAnswers(body['answers'])
  if (!answers) return invalid('Answers are not in the expected form.')

  const photoInput = body['photos']
  if (photoInput !== undefined && (!Array.isArray(photoInput) || photoInput.length > MAX_PHOTOS)) {
    return invalid('Too many photos.')
  }
  const photos = Array.isArray(photoInput) ? photoInput : []

  // Validate every photo before minting any upload target, so a bad second file mints nothing.
  const requests = [] as Array<{
    purpose: 'job-photo'
    fileName: string
    contentType: string
    sizeBytes: number
    referenceId: string
  }>
  for (const item of photos) {
    const photo = (item && typeof item === 'object' && !Array.isArray(item) ? item : {}) as Record<
      string,
      unknown
    >
    const fileName = typeof photo['fileName'] === 'string' ? photo['fileName'].trim() : ''
    const contentType = typeof photo['contentType'] === 'string' ? photo['contentType'] : ''
    const sizeBytes = photo['sizeBytes']
    if (!fileName || fileName.length > FILE_NAME_MAX) return invalid('Photo name is not valid.')
    if (!(UPLOAD_ACCEPTED_TYPES as readonly string[]).includes(contentType)) {
      return invalid('Photo type is not accepted.')
    }
    if (typeof sizeBytes !== 'number' || !Number.isInteger(sizeBytes) || sizeBytes <= 0) {
      return invalid('Photo size is not valid.')
    }
    if (sizeBytes > MAX_PHOTO_BYTES) return invalid('Photo is too large.')
    requests.push({ purpose: 'job-photo', fileName, contentType, sizeBytes, referenceId })
  }

  const uploads: UploadTarget[] = []
  for (const request of requests) {
    const target = await integrations.upload.createUploadTarget(request)
    if (!target.ok) {
      console.warn(`[onboarding] upload target failed (${target.reason}): ${target.message}`)
      return reply(
        { ok: false, reason: target.reason, message: visitorMessage(target.reason) },
        statusForFailure(target.reason)
      )
    }
    uploads.push(target)
  }

  const result = await integrations.dataStore.saveOnboardingAnswers({ referenceId, answers })
  if (!result.ok) {
    console.warn(`[onboarding] save failed (${result.reason}): ${result.message}`)
    return reply(
      { ok: false, reason: result.reason, message: visitorMessage(result.reason) },
      statusForFailure(result.reason)
    )
  }
  saved.set(referenceId, now)
  return reply({ ok: true, id: result.id, uploads }, 200)
}
