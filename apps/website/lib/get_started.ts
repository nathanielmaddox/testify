/**
 * Get started flow: step definitions, copy, options, validation and the
 * sessionStorage contract. Server-safe (no DS import, no browser globals at
 * import time); the storage helpers only touch `window` when called.
 *
 * Copy is taken verbatim from the Paper frames (Testify Web - Get started).
 * Owner placeholders ([N], [CONFIRM], [NAME], [EMAIL], [LEGAL ENTITY]) stay
 * literal until the owner fills them. Validation messages follow the Get
 * started skill audit (docs/skill-audit/get-started.md).
 *
 * PII rule: answers live in sessionStorage only. Never put them in a URL.
 */
import { routes } from './site.config'

export const GET_STARTED_STORAGE_KEY = 'tfy_get_started'

export interface ChoiceOption {
  value: string
  label: string
}

/** Step values as the form holds them: text for text fields, a list for multi-choice. */
export type StepValues = Record<string, string | string[]>

export interface Booking {
  /** Local calendar day, YYYY-MM-DD. */
  date: string
  /** Slot label exactly as shown, for example "10:30 AM". */
  time: string
  /** Short zone label shown to the visitor, for example "MST". */
  zoneLabel: string
  /**
   * IANA zone the slot's wall-clock time is in: the browser's zone or the one
   * the visitor picked, for example "America/Phoenix".
   */
  timeZone: string
  /** True only when the booking API created the booking. Missing on older saves: read as false. */
  connected?: boolean
  /** Provider booking id, when one was created. */
  bookingId?: string
  /** Whether the provider sent the invite. Only "sent" may be shown as sent. */
  inviteStatus?: InviteStatus
}

/** Whether the provider sent the invite (mirrors lib/integrations `InviteStatus`). */
export type InviteStatus = 'sent' | 'not-sent' | 'pending'

/** One bookable start time from the bookings API, in the visitor's zone. */
export interface DaySlot {
  /** ISO 8601 instant of the slot start. */
  startsAt: string
  /** Label shown to the visitor, for example "10:30 AM". */
  label: string
}

/** GET /api/bookings: slots for one month, keyed by day. */
export type BookingSlotsResponse =
  | { ok: true; connected: boolean; timeZone: string; days: Record<string, DaySlot[]> }
  | { ok: false; reason: string; message?: string }

/** POST /api/bookings: the booking result the visitor's choice is stored with. */
export type BookingApiResponse =
  | {
      ok: true
      connected: boolean
      bookingId?: string
      inviteStatus?: InviteStatus
      answersSaved: boolean
    }
  | { ok: false; connected: boolean; reason: string; message?: string; answersSaved?: boolean }

export interface GetStartedState {
  aboutYou?: StepValues
  yourBusiness?: StepValues
  yourGoals?: StepValues
  booking?: Booking
}

export type FieldKind = 'text' | 'email' | 'tel' | 'url' | 'choice' | 'multi' | 'textarea'

export interface FieldSpec {
  key: string
  kind: FieldKind
  label: string
  required: boolean
  placeholder?: string
  helper?: string
  autoComplete?: string
  options?: readonly ChoiceOption[]
  maxLength?: number
  requiredError?: string
  invalidError?: string
}

export interface QualifierStepSpec {
  step: 1 | 2 | 3
  stateKey: 'aboutYou' | 'yourBusiness' | 'yourGoals'
  path: string
  prevPath: string | null
  nextPath: string
  title: string
  lead: string
  /** One line above the buttons (the confidence line). */
  confirm: string
  submitLabel: string
  fields: readonly FieldSpec[]
}

/* ---------- Options (verbatim from Paper) ---------- */

export const ROLE_OPTIONS = [
  { value: 'owner', label: "Yes, it's my business" },
  { value: 'manager', label: 'I manage it' },
  { value: 'other', label: 'Something else' },
] as const satisfies readonly ChoiceOption[]

export const BUSINESS_TYPE_OPTIONS = [
  { value: 'trades', label: 'Trades & home services' },
  { value: 'clinic', label: 'Clinic or med spa' },
  { value: 'salon', label: 'Salon or beauty' },
  { value: 'other', label: 'Another local service' },
] as const satisfies readonly ChoiceOption[]

export const TEAM_SIZE_OPTIONS = [
  { value: 'just-me', label: 'Just me' },
  { value: '2-5', label: '2-5' },
  { value: '6-20', label: '6-20' },
  { value: '21+', label: '21+' },
] as const satisfies readonly ChoiceOption[]

export const MAIN_GOAL_OPTIONS = [
  { value: 'look-current', label: 'Look busy and current online' },
  { value: 'more-bookings', label: 'More calls and bookings' },
  { value: 'time-back', label: 'Get my time back' },
  { value: 'hiring', label: 'Help with hiring' },
] as const satisfies readonly ChoiceOption[]

export const POSTING_OPTIONS = [
  { value: 'not-at-all', label: 'Not at all' },
  { value: 'now-and-then', label: 'Now and then' },
  { value: 'most-weeks', label: 'Most weeks' },
] as const satisfies readonly ChoiceOption[]

export const CHANNEL_OPTIONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'google-business-profile', label: 'Google Business Profile' },
  { value: 'none-yet', label: 'None yet' },
] as const satisfies readonly ChoiceOption[]

/** Channel value that clears the others (and is cleared by any other pick). */
export const NONE_CHANNEL = 'none-yet'

export const AGENCY_OPTIONS = [
  { value: 'no', label: 'No' },
  { value: 'went-well', label: 'Yes, it went well' },
  { value: 'did-not-work-out', label: "Yes, it didn't work out" },
] as const satisfies readonly ChoiceOption[]

export const NOTES_MAX_LENGTH = 300

/* ---------- Steps ---------- */

const ABOUT_YOU: QualifierStepSpec = {
  step: 1,
  stateKey: 'aboutYou',
  path: routes.getStarted.path,
  prevPath: null,
  nextPath: routes.getStartedBusiness.path,
  title: "Let's start with you.",
  lead: 'Three quick steps, about two minutes. Then you pick a time for your call.',
  confirm: 'Two more short steps after this.',
  submitLabel: 'Next: your business',
  fields: [
    {
      key: 'fullName',
      kind: 'text',
      label: 'Your name',
      required: true,
      placeholder: 'e.g. Maria Lopez',
      helper: "What we'll call you on the invite.",
      autoComplete: 'name',
      requiredError: "Add your name so we know who we're talking to.",
    },
    {
      key: 'email',
      kind: 'email',
      label: 'Email',
      required: true,
      placeholder: 'e.g. maria@lopezplumbing.com',
      helper: 'Your call details and invite go here.',
      autoComplete: 'email',
      requiredError: 'Add your email. Your call invite goes there.',
      invalidError: 'That email looks incomplete. Check it has an @ and an ending like .com.',
    },
    {
      key: 'phone',
      kind: 'tel',
      label: 'Phone',
      required: false,
      placeholder: 'e.g. (555) 201-4477',
      helper: "Add it if you'd rather we call you.",
      autoComplete: 'tel',
      invalidError: 'That number looks short. Include the area code, or leave it blank.',
    },
    {
      key: 'role',
      kind: 'choice',
      label: 'Are you the owner?',
      required: true,
      options: ROLE_OPTIONS,
      requiredError: 'Pick the option that fits you best.',
    },
  ],
}

const YOUR_BUSINESS: QualifierStepSpec = {
  step: 2,
  stateKey: 'yourBusiness',
  path: routes.getStartedBusiness.path,
  prevPath: routes.getStarted.path,
  nextPath: routes.getStartedGoals.path,
  title: 'Tell us about the business.',
  lead: 'This is how we learn your trade, your town and how your customers talk.',
  confirm: 'One more step, then you pick a time.',
  submitLabel: 'Next: your goals',
  fields: [
    {
      key: 'businessName',
      kind: 'text',
      label: 'Business name',
      required: true,
      placeholder: 'e.g. Lopez Plumbing',
      helper: 'The name your customers know you by.',
      autoComplete: 'organization',
      requiredError: 'Add your business name. A nickname is fine.',
    },
    {
      key: 'businessType',
      kind: 'choice',
      label: 'What kind of business?',
      required: true,
      options: BUSINESS_TYPE_OPTIONS,
      requiredError: 'Pick the closest fit. You can tell us more on the call.',
    },
    {
      key: 'serviceArea',
      kind: 'text',
      label: 'Town or area you serve',
      required: true,
      placeholder: 'e.g. Mesa, AZ',
      helper: 'Where your jobs or clients are.',
      autoComplete: 'address-level2',
      requiredError: 'Add the town or area you work in.',
    },
    {
      key: 'webLink',
      kind: 'url',
      label: 'Website or social page',
      required: false,
      placeholder: 'e.g. lopezplumbing.com',
      helper: 'Helps us see what you already post.',
      autoComplete: 'url',
      invalidError:
        "That link doesn't look right. Try something like lopezplumbing.com, or leave it blank.",
    },
    {
      key: 'teamSize',
      kind: 'choice',
      label: 'How many people work there?',
      required: true,
      options: TEAM_SIZE_OPTIONS,
      helper: 'Count yourself.',
      requiredError: 'Pick a team size. Rough is fine.',
    },
  ],
}

const YOUR_GOALS: QualifierStepSpec = {
  step: 3,
  stateKey: 'yourGoals',
  path: routes.getStartedGoals.path,
  prevPath: routes.getStartedBusiness.path,
  nextPath: routes.getStartedBook.path,
  title: 'What would help most?',
  lead: 'Your answers shape the ideas we bring to the call.',
  confirm: 'Last step next: pick a time that suits you.',
  submitLabel: 'Pick a time',
  fields: [
    {
      key: 'mainGoal',
      kind: 'choice',
      label: 'What matters most right now?',
      required: true,
      options: MAIN_GOAL_OPTIONS,
      helper: 'Pick one.',
      requiredError: "Pick the one that matters most. We'll cover the rest on the call.",
    },
    {
      key: 'postingNow',
      kind: 'choice',
      label: 'How often do you post today?',
      required: true,
      options: POSTING_OPTIONS,
      requiredError: "Pick the closest answer. There's no wrong one.",
    },
    {
      key: 'channels',
      kind: 'multi',
      label: 'Where is the business online now?',
      required: true,
      options: CHANNEL_OPTIONS,
      helper: 'Pick all that apply.',
      requiredError: 'Pick where you\'re online now, or "None yet".',
    },
    {
      key: 'agencyBefore',
      kind: 'choice',
      label: 'Have you used an agency before?',
      required: true,
      options: AGENCY_OPTIONS,
      requiredError: "Pick one so we know where you're starting from.",
    },
    {
      key: 'notes',
      kind: 'textarea',
      label: 'Anything we should know before the call?',
      required: false,
      placeholder: 'e.g. Spring is our busy season and we want more of those jobs.',
      maxLength: NOTES_MAX_LENGTH,
      invalidError: "That's over 300 characters. Trim it a little, or save the rest for the call.",
    },
  ],
}

export const QUALIFIER_STEPS = [ABOUT_YOU, YOUR_BUSINESS, YOUR_GOALS] as const

export function getQualifierStep(step: 1 | 2 | 3): QualifierStepSpec {
  if (step === 1) return ABOUT_YOU
  if (step === 2) return YOUR_BUSINESS
  return YOUR_GOALS
}

/* ---------- Booking step (step 4) ---------- */

export const BOOKING_PATH = routes.getStartedBook.path
export const BOOKED_PATH = routes.getStartedBooked.path

/**
 * Slot labels the mocked slot generator offers on every open weekday. Used only
 * when no booking provider is connected (see app/api/bookings/route.ts).
 */
export const SLOT_TIMES = ['9:00 AM', '9:30 AM', '10:30 AM', '11:00 AM'] as const

/** A slot label as shown to the visitor, for example "10:30 AM". Providers may use any label of this form. */
export const SLOT_LABEL_PATTERN = /^(\d{1,2}):(\d{2}) (AM|PM)$/

const INVITE_STATUSES: readonly InviteStatus[] = ['sent', 'not-sent', 'pending']

/** How far ahead the calendar offers days, in days. */
export const BOOKING_WINDOW_DAYS = 60

/* ---------- Validation ---------- */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value)
}

function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, '').length >= 10
}

/** Accepts a bare domain ("lopezplumbing.com") or a full URL. */
export function normalizeWebLink(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(withScheme)
    if (!url.hostname.includes('.') || /\s/.test(trimmed)) return null
    return url.toString()
  } catch {
    return null
  }
}

function asText(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : ''
}

function asList(value: string | string[] | undefined): string[] {
  return Array.isArray(value) ? value : []
}

/**
 * Field-level errors for one qualifier step. Empty object = step is valid.
 * Keys are field keys; values are the message the field shows.
 */
export function validateQualifierStep(
  spec: QualifierStepSpec,
  values: StepValues
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of spec.fields) {
    const raw = values[field.key]
    const requiredMessage = field.requiredError ?? 'Add this to continue.'
    if (field.kind === 'multi') {
      const list = asList(raw)
      if (field.required && list.length === 0) errors[field.key] = requiredMessage
      continue
    }
    const text = asText(raw).trim()
    if (field.kind === 'choice') {
      const allowed = (field.options ?? []).map((option) => option.value)
      if (!allowed.includes(text) && field.required) errors[field.key] = requiredMessage
      continue
    }
    if (!text) {
      if (field.required) errors[field.key] = requiredMessage
      continue
    }
    if (field.kind === 'email' && !isValidEmail(text)) {
      errors[field.key] = field.invalidError ?? 'Check this email.'
    } else if (field.kind === 'tel' && !isValidPhone(text)) {
      errors[field.key] = field.invalidError ?? 'Check this number.'
    } else if (field.kind === 'url' && normalizeWebLink(text) === null) {
      errors[field.key] = field.invalidError ?? 'Check this link.'
    } else if (field.maxLength !== undefined && text.length > field.maxLength) {
      errors[field.key] = field.invalidError ?? 'Trim this a little.'
    }
  }
  return errors
}

/** True when every field of a qualifier step is valid in the stored state. */
export function isQualifierStepComplete(state: GetStartedState, step: 1 | 2 | 3): boolean {
  const spec = getQualifierStep(step)
  return Object.keys(validateQualifierStep(spec, state[spec.stateKey] ?? {})).length === 0
}

/**
 * Where a visitor should be sent when the state is incomplete: the first
 * qualifier step that is not complete, or null when all three are complete.
 */
export function firstIncompleteQualifierStep(state: GetStartedState): QualifierStepSpec | null {
  for (const spec of QUALIFIER_STEPS) {
    if (!isQualifierStepComplete(state, spec.step)) return spec
  }
  return null
}

/* ---------- Calendar and slot helpers (pure, date-only) ---------- */

/** YYYY-MM-DD for a local calendar day. */
export function toDateKey(day: Date): string {
  const y = day.getFullYear()
  const m = String(day.getMonth() + 1).padStart(2, '0')
  const d = String(day.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** A local Date at midnight for a YYYY-MM-DD key. */
export function fromDateKey(key: string): Date {
  const [year = 1970, month = 1, day = 1] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** Milliseconds at UTC midnight of a YYYY-MM-DD key, for whole-day arithmetic. */
function utcDayMs(dateKey: string): number {
  const [year = 1970, month = 1, day = 1] = dateKey.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

/** The calendar day (YYYY-MM-DD) an instant falls on in an IANA zone. */
export function zoneDateKey(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant)
}

/**
 * Bookable day keys of one month (YYYY-MM) as seen in a zone at `now`: weekdays
 * from tomorrow for BOOKING_WINDOW_DAYS. Weekends and past days are never bookable.
 */
export function bookableDayKeys(month: string, timeZone: string, now: Date): string[] {
  const [year = 1970, monthNumber = 1] = month.split('-').map(Number)
  const todayMs = utcDayMs(zoneDateKey(now, timeZone))
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()
  const keys: string[] = []
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${month}-${String(day).padStart(2, '0')}`
    const diff = Math.round((utcDayMs(key) - todayMs) / 86_400_000)
    if (diff < 1 || diff > BOOKING_WINDOW_DAYS) continue
    const weekday = new Date(Date.UTC(year, monthNumber - 1, day)).getUTCDay()
    if (weekday !== 0 && weekday !== 6) keys.push(key)
  }
  return keys
}

/** Mocked slots for one day, used only when no booking provider is connected. */
export function mockSlotsForDay(dateKey: string, timeZone: string): DaySlot[] {
  return SLOT_TIMES.flatMap((label) => {
    const start = slotStart(dateKey, label, timeZone)
    return start ? [{ startsAt: start.toISOString(), label }] : []
  })
}

/** Calendar day check: YYYY-MM-DD that names a real day (rejects 2026-02-30). */
export function isValidDateKey(key: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false
  return toDateKey(fromDateKey(key)) === key
}

/** True when the runtime knows the IANA zone name. */
export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone })
    return true
  } catch {
    return false
  }
}

/** Offset from UTC, in minutes, of an IANA zone at one instant (east of UTC is positive). */
function zoneOffsetMinutes(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(instant)
  const field = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value)
  const wallAsUtc = Date.UTC(
    field('year'),
    field('month') - 1,
    field('day'),
    field('hour'),
    field('minute'),
    field('second')
  )
  const wholeSecond = Math.floor(instant.getTime() / 1000) * 1000
  return Math.round((wallAsUtc - wholeSecond) / 60_000)
}

/**
 * The UTC instant of a wall-clock time in an IANA zone. Two passes: the offset
 * at the naive instant, then the offset at the corrected instant, so a slot
 * near a daylight-saving change still lands on the right instant.
 *
 * Self-check (worked by hand; this app has no unit-test runner). Date
 * 2026-10-21, 10:30 AM:
 *   America/Phoenix   is UTC-7 all year (no DST)   -> 2026-10-21T17:30:00Z
 *   America/New_York  is EDT, UTC-4, on this date  -> 2026-10-21T14:30:00Z
 * One wall-clock label gives two instants, so the .ics must use the zone the
 * slot was chosen in, never the browser's zone.
 */
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const wallAsUtc = Date.UTC(year, month - 1, day, hour, minute)
  const firstGuess = wallAsUtc - zoneOffsetMinutes(new Date(wallAsUtc), timeZone) * 60_000
  return new Date(wallAsUtc - zoneOffsetMinutes(new Date(firstGuess), timeZone) * 60_000)
}

/**
 * Start of the slot as a UTC instant. The day key and the label ("10:30 AM")
 * are wall-clock time in `timeZone`. Null when any part is malformed.
 */
export function slotStart(dateKey: string, time: string, timeZone: string): Date | null {
  const match = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(time)
  if (!match || !isValidDateKey(dateKey) || !isValidTimeZone(timeZone)) return null
  const clock = Number(match[1])
  const minute = Number(match[2])
  if (clock < 1 || clock > 12 || minute > 59) return null
  const hour = (clock % 12) + (match[3] === 'PM' ? 12 : 0)
  const [year = 1970, month = 1, day = 1] = dateKey.split('-').map(Number)
  return zonedTimeToUtc(year, month, day, hour, minute, timeZone)
}

/** Long zone name, such as "Mountain Standard Time", for a title attribute. */
export function zoneLongName(timeZone: string): string {
  try {
    const part = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'long' })
      .formatToParts(new Date())
      .find((item) => item.type === 'timeZoneName')
    return part?.value ?? timeZone
  } catch {
    return timeZone
  }
}

/** "Wed, Oct 14" for a day key. */
export function formatDayLabel(dateKey: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(fromDateKey(dateKey))
}

/* ---------- sessionStorage contract ---------- */

/** A stored booking is usable only when every part is well formed. */
function isBooking(value: unknown): value is Booking {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  const { date, time, zoneLabel, timeZone, connected, inviteStatus } = candidate
  return (
    typeof date === 'string' &&
    isValidDateKey(date) &&
    typeof time === 'string' &&
    SLOT_LABEL_PATTERN.test(time) &&
    typeof zoneLabel === 'string' &&
    zoneLabel.length > 0 &&
    typeof timeZone === 'string' &&
    isValidTimeZone(timeZone) &&
    (connected === undefined || typeof connected === 'boolean') &&
    (inviteStatus === undefined || INVITE_STATUSES.includes(inviteStatus as InviteStatus))
  )
}

/**
 * Reads the flow state. Empty object when storage is missing, blocked or corrupt.
 * A malformed booking is dropped, so the booked page falls back to "no booking".
 */
export function readGetStartedState(): GetStartedState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.sessionStorage.getItem(GET_STARTED_STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    const { booking, ...rest } = parsed as GetStartedState
    return isBooking(booking) ? { ...rest, booking } : rest
  } catch {
    return {}
  }
}

/** Writes the flow state. Silently does nothing when storage is blocked. */
export function writeGetStartedState(state: GetStartedState): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(GET_STARTED_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage blocked: the flow still works for this page view.
  }
}

/* ---------- Progress rail and calendar file ---------- */

/** Progress rail labels, in order (Paper: About you, Your business, Your goals, Book a time). */
export const GET_STARTED_STEP_LABELS = [
  'About you',
  'Your business',
  'Your goals',
  'Book a time',
] as const

/** Path of each progress step, in the same order as the labels. */
export const GET_STARTED_STEP_PATHS = [
  routes.getStarted.path,
  routes.getStartedBusiness.path,
  routes.getStartedGoals.path,
  routes.getStartedBook.path,
] as const

/** Length of the booked call, in minutes (Paper: 15-minute call). */
export const CALL_LENGTH_MINUTES = 15

/**
 * An .ics calendar file for the booked call. The slot is converted from the
 * zone it was chosen in (booking.timeZone) to UTC, so every calendar app shows
 * the event at the moment the visitor picked, whatever their browser's zone.
 * DTSTART and DTEND use the UTC form (trailing Z), so no TZID is needed.
 * The invite email and the visitor's details are deliberately left out.
 */
export function buildBookingIcs(booking: Booking, now: Date = new Date()): string | null {
  const start = slotStart(booking.date, booking.time, booking.timeZone)
  if (!start) return null
  const end = new Date(start.getTime() + CALL_LENGTH_MINUTES * 60_000)
  const stamp = (date: Date) =>
    date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, 'Z')
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Testify//Get started//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${stamp(start)}-${booking.date}@testify`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${CALL_LENGTH_MINUTES}-minute call with Testify`,
    'DESCRIPTION:The video call link is in your invite.',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  // RFC 5545 line endings are CRLF, including after the last line.
  return `${lines.join('\r\n')}\r\n`
}
