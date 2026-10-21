/**
 * Bookings API for the get-started flow.
 *
 * `GET /api/bookings?month=YYYY-MM&timeZone=<IANA>`: the open slots of one month,
 * keyed by day, in the visitor's zone. With no booking provider connected, the
 * slots come from the mocked generator and the response says `connected: false`.
 *
 * `POST /api/bookings`: books one slot. JSON body only: the chosen slot and the
 * three qualifier answers. The server re-validates every answer, derives the slot
 * start itself, saves the answers through the data store when one is connected,
 * then creates the booking. With no booking provider, the choice is accepted and
 * answered `ok: true, connected: false`, so the booked page shows its warning.
 * No outside call is ever reported as a success.
 *
 * Answers travel in the body, never in a URL. `X-Robots-Tag: noindex` comes from
 * next.config.js (`/api/:path*`). Adapters: lib/integrations (see INTEGRATIONS.md).
 */
import { NextResponse } from 'next/server'
import { overRateLimit, parseJsonObject, sameOrigin, statusForFailure } from '@/lib/api_guard'
import {
  bookableDayKeys,
  fullNameOf,
  isValidDateKey,
  isValidTimeZone,
  mockSlotsForDay,
  QUALIFIER_STEPS,
  SLOT_LABEL_PATTERN,
  slotStart,
  validateQualifierStep,
  type BookingApiResponse,
  type BookingSlotsResponse,
  type StepValues,
} from '@/lib/get_started'
import { getIntegrations, type BookingRequest, type IntegrationFailure } from '@/lib/integrations'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/
const MAX_BODY_BYTES = 16_384
const MAX_TEXT = 1_000
const MAX_LIST = 20
const STEP_KEYS = ['aboutYou', 'yourBusiness', 'yourGoals'] as const

type Answers = Record<(typeof STEP_KEYS)[number], StepValues>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function reply<T extends BookingApiResponse | BookingSlotsResponse>(body: T, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

/**
 * The line a visitor may see for a failure reason. Adapter messages are for the
 * server log only and never reach the response body.
 */
function visitorMessage(reason: string): string {
  switch (reason) {
    case 'not-connected':
      return "Booking isn't connected yet."
    case 'slot-taken':
      return "That time was just booked by someone else. Pick another time and we'll hold it for you."
    case 'invalid-input':
      return "That booking didn't check out. Go back and check your answers."
    case 'rate-limited':
      return 'Too many tries. Wait a minute and try again.'
    default:
      return 'Something went wrong on our side.'
  }
}

/** Booking POSTs per client IP per minute. Shared guard: lib/api_guard.ts. */
const BOOKING_RATE_MAX = 10
const BOOKING_RATE_WINDOW_MS = 60_000

/** Answers per qualifier step. Strings or short string lists only, each within size limits. */
function parseAnswers(raw: unknown): Answers | null {
  if (!isRecord(raw)) return null
  const answers = {} as Answers
  for (const key of STEP_KEYS) {
    const step = raw[key] ?? {}
    if (!isRecord(step)) return null
    const values: StepValues = {}
    for (const [field, value] of Object.entries(step)) {
      if (typeof value === 'string' && value.length <= MAX_TEXT) {
        values[field] = value
      } else if (
        Array.isArray(value) &&
        value.length <= MAX_LIST &&
        value.every((item) => typeof item === 'string' && item.length <= MAX_TEXT)
      ) {
        values[field] = value as string[]
      } else {
        return null
      }
    }
    answers[key] = values
  }
  return answers
}

function textOf(values: StepValues, key: string): string {
  const value = values[key]
  return typeof value === 'string' ? value.trim() : ''
}

/** A provider answer that means "no booking provider is connected". */
const isNotConnected = (result: IntegrationFailure | { ok: true }) =>
  result.ok === false && result.reason === 'not-connected'

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const month = params.get('month') ?? ''
  const timeZone = params.get('timeZone') ?? ''
  if (!MONTH_PATTERN.test(month) || !isValidTimeZone(timeZone)) {
    return reply<BookingSlotsResponse>(
      { ok: false, reason: 'invalid-input', message: visitorMessage('invalid-input') },
      400
    )
  }

  const dates = bookableDayKeys(month, timeZone, new Date())
  const { booking } = getIntegrations()
  const results = await Promise.all(dates.map((date) => booking.listSlots({ date, timeZone })))

  if (results.every(isNotConnected)) {
    const days = Object.fromEntries(dates.map((date) => [date, mockSlotsForDay(date, timeZone)]))
    return reply<BookingSlotsResponse>({ ok: true, connected: false, timeZone, days })
  }

  const failure = results.find((result): result is IntegrationFailure => !result.ok)
  if (failure) {
    console.warn(`[bookings] listSlots failed: ${failure.reason}. ${failure.message}`)
    return reply<BookingSlotsResponse>(
      { ok: false, reason: failure.reason, message: visitorMessage(failure.reason) },
      statusForFailure(failure.reason)
    )
  }

  const days = Object.fromEntries(
    dates.map((date, index) => {
      const result = results[index]
      const slots = result && result.ok ? result.slots : []
      return [date, slots.map((slot) => ({ startsAt: slot.startsAt, label: slot.label }))]
    })
  )
  return reply<BookingSlotsResponse>({ ok: true, connected: true, timeZone, days })
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return reply<BookingApiResponse>(
      { ok: false, connected: false, reason: 'forbidden', message: visitorMessage('forbidden') },
      403
    )
  }
  if (overRateLimit('bookings', request, BOOKING_RATE_MAX, BOOKING_RATE_WINDOW_MS)) {
    return reply<BookingApiResponse>(
      {
        ok: false,
        connected: false,
        reason: 'rate-limited',
        message: visitorMessage('rate-limited'),
      },
      429
    )
  }

  const invalid = () =>
    reply<BookingApiResponse>(
      {
        ok: false,
        connected: false,
        reason: 'invalid-input',
        message: visitorMessage('invalid-input'),
      },
      400
    )
  // A declared length over the cap is refused before the body is read.
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return invalid()
  // Any JSON that is not a plain object (null, arrays, numbers, malformed text) is a 400.
  const body = await parseJsonObject(request)
  if (!body) return invalid()
  const bookingRaw = body['booking']
  if (!isRecord(bookingRaw)) return invalid()
  const date = bookingRaw['date']
  const time = bookingRaw['time']
  const timeZone = bookingRaw['timeZone']
  if (typeof date !== 'string' || typeof time !== 'string' || typeof timeZone !== 'string') {
    return invalid()
  }
  const answers = parseAnswers(body['answers'])
  if (!answers) return invalid()

  // The slot must be a bookable day in the visitor's zone, in the stated label form.
  const bookable =
    isValidDateKey(date) &&
    isValidTimeZone(timeZone) &&
    SLOT_LABEL_PATTERN.test(time) &&
    bookableDayKeys(date.slice(0, 7), timeZone, new Date()).includes(date)
  if (!bookable) return invalid()

  const answersComplete = QUALIFIER_STEPS.every(
    (spec) => Object.keys(validateQualifierStep(spec, answers[spec.stateKey])).length === 0
  )
  if (!answersComplete) return invalid()

  const startsAt = slotStart(date, time, timeZone)
  if (!startsAt) return invalid()

  const name = fullNameOf(answers.aboutYou)
  const email = textOf(answers.aboutYou, 'email')
  const businessName = textOf(answers.yourBusiness, 'businessName')
  const { dataStore, booking: bookingAdapter } = getIntegrations()

  // Answers first, so they persist even when the booking itself is refused.
  const saved = await dataStore.saveGetStartedAnswers({
    answers,
    booking: { date, time, timeZone },
  })
  if (!saved.ok && saved.reason !== 'not-connected') {
    console.warn(`[bookings] answers not saved: ${saved.reason}. ${saved.message}`)
  }
  const answersSaved = saved.ok

  const requestBody: BookingRequest = {
    date,
    time,
    timeZone,
    startsAt: startsAt.toISOString(),
    contact: { name, email },
    businessName,
  }
  const created = await bookingAdapter.createBooking(requestBody)

  if (created.ok) {
    return reply<BookingApiResponse>({
      ok: true,
      connected: true,
      bookingId: created.bookingId,
      inviteStatus: created.inviteStatus,
      answersSaved,
    })
  }
  if (created.reason === 'not-connected') {
    return reply<BookingApiResponse>({ ok: true, connected: false, answersSaved })
  }
  if (created.reason === 'slot-taken') {
    return reply<BookingApiResponse>(
      {
        ok: false,
        connected: true,
        reason: 'slot-taken',
        message: visitorMessage('slot-taken'),
        answersSaved,
      },
      409
    )
  }
  console.warn(`[bookings] createBooking failed: ${created.reason}. ${created.message}`)
  return reply<BookingApiResponse>(
    {
      ok: false,
      connected: created.reason === 'provider-error',
      reason: created.reason,
      message: visitorMessage(created.reason),
      answersSaved,
    },
    statusForFailure(created.reason)
  )
}
