'use client'

/**
 * Get started step 4: the month grid, the time column, the time zone line and
 * the booking action. Open days and times come from GET /api/bookings for the
 * visible month, in the chosen zone. The booking goes to POST /api/bookings,
 * and the stored result (connected, bookingId, inviteStatus) is what the booked
 * page shows. The zone is stored with the booking so the .ics file agrees.
 */

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button, ValidationMessage } from '@otesse/design-system'
import { SubmitButton } from '@testify/style-guide/components/ActionButton'
import { BookingDayCell, BookingDayGrid } from '@testify/style-guide/components/BookingDayCell'
import { BrandIcon } from '@testify/style-guide/components/BrandIcon'
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { Kicker } from '@testify/style-guide/components/Kicker'
import { SelectField } from '@testify/style-guide/components/SelectField'
import { TextLink } from '@testify/style-guide/components/TextLink'
import { TimePill } from '@testify/style-guide/components/TimePill'
import {
  BOOKED_PATH,
  CALL_LENGTH_MINUTES,
  firstIncompleteQualifierStep,
  formatDayLabel,
  toDateKey,
  zoneLongName,
  type BookingApiResponse,
  type BookingSlotsResponse,
  type DaySlot,
  type GetStartedState,
} from '@/lib/get_started'
import { routes } from '@/lib/site.config'
import { FlowBackButton } from './flow_actions'
import { FlowStepIndicator } from './step_indicator'
import { useGetStartedState } from './use_get_started_state'

/** Id of the time zone select, named by the Change control's aria-controls. */
const ZONE_SELECT_ID = 'gs-zone-select'

/** Zones the visitor can switch to. The browser's own zone is added first when it is not listed. */
const ZONE_CHOICES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
] as const

const SLOT_TAKEN_COPY =
  "That time was just booked by someone else. Pick another time and we'll hold it for you."
const BOOK_FAILED_COPY =
  "We couldn't book that just now. Your answers are saved. Try again in a moment."

interface ZoneChoice {
  timeZone: string
  zoneLabel: string
}

/** Short zone label for an IANA zone, such as "MST" or "PDT", at the current date. */
function zoneLabelFor(timeZone: string): string {
  try {
    const part = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' })
      .formatToParts(new Date())
      .find((item) => item.type === 'timeZoneName')
    return part?.value ?? timeZone
  } catch {
    return timeZone
  }
}

function cityOf(timeZone: string): string {
  return (timeZone.split('/').pop() ?? timeZone).replace(/_/g, ' ')
}

/** Every calendar cell for one month: nulls pad the first week and the last row. */
function monthCells(monthStart: Date): (Date | null)[] {
  const year = monthStart.getFullYear()
  const month = monthStart.getMonth()
  const cells: (Date | null)[] = Array.from({ length: monthStart.getDay() }, () => null)
  const days = new Date(year, month + 1, 0).getDate()
  for (let day = 1; day <= days; day += 1) cells.push(new Date(year, month, day))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

/** YYYY-MM for a local month start, the query the slots route takes. */
function monthKeyOf(monthStart: Date): string {
  return `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`
}

/** The qualifier answers the booking route re-validates and stores. */
function answersOf(state: GetStartedState | null) {
  return {
    aboutYou: state?.aboutYou ?? {},
    yourBusiness: state?.yourBusiness ?? {},
    yourGoals: state?.yourGoals ?? {},
  }
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const ON_THE_CALL = [
  { number: '01', text: '[N] post ideas for your business. Yours to keep, hire us or not.' },
  { number: '02', text: "A first look at your month: what we'd post, and when." },
  { number: '03', text: 'Your monthly price, in writing. No contract.' },
] as const

/**
 * Step 4: pick a day and a time, then book. Left: the month grid and the time
 * column in one card, the time zone line, the selected summary and the buttons.
 * Right: the "On the call" card.
 */
export function BookingStep() {
  const router = useRouter()
  const { state, update } = useGetStartedState()
  const [today, setToday] = useState<Date | null>(null)
  const [monthStart, setMonthStart] = useState<Date | null>(null)
  const [zone, setZone] = useState<ZoneChoice | null>(null)
  const [editingZone, setEditingZone] = useState(false)
  const [day, setDay] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [slotError, setSlotError] = useState<string | null>(null)
  const [slots, setSlots] = useState<Record<string, DaySlot[]>>({})
  const [slotsReady, setSlotsReady] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [connected, setConnected] = useState<boolean | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const now = new Date()
    setToday(now)
    setMonthStart(new Date(now.getFullYear(), now.getMonth(), 1))
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    setZone({ timeZone, zoneLabel: zoneLabelFor(timeZone) })
  }, [])

  useEffect(() => {
    if (!state) return
    const blocking = firstIncompleteQualifierStep(state)
    if (blocking) router.replace(blocking.path)
  }, [state, router])

  // Opening the zone control moves focus into the select it reveals.
  useEffect(() => {
    if (editingZone) document.getElementById(ZONE_SELECT_ID)?.focus()
  }, [editingZone])

  // Slots for the visible month, in the chosen zone. Re-runs on month, zone or retry.
  const zoneTimeZone = zone?.timeZone
  useEffect(() => {
    if (!monthStart || !zoneTimeZone) return
    const controller = new AbortController()
    const params = new URLSearchParams({
      month: monthKeyOf(monthStart),
      timeZone: zoneTimeZone,
    })
    setSlotsReady(false)
    setLoadFailed(false)
    fetch(`/api/bookings?${params.toString()}`, {
      headers: { accept: 'application/json' },
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = (await response.json()) as BookingSlotsResponse
        if (!response.ok || !body.ok) throw new Error('slots unavailable')
        return body
      })
      .then((body) => {
        setSlots(body.days)
        setConnected(body.connected)
        setSlotsReady(true)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setSlots({})
        setLoadFailed(true)
        setSlotsReady(true)
      })
    return () => controller.abort()
  }, [monthStart, zoneTimeZone, reloadKey])

  const browserZone = zone?.timeZone
  const zoneOptions = (
    browserZone && !(ZONE_CHOICES as readonly string[]).includes(browserZone)
      ? [browserZone, ...ZONE_CHOICES]
      : [...ZONE_CHOICES]
  ).map((timeZone) => ({
    value: timeZone,
    label: `${cityOf(timeZone)} (${zoneLabelFor(timeZone)})`,
  }))

  const daySlots: DaySlot[] = day ? (slots[day] ?? []) : []
  const daySummary =
    day && time && zone
      ? `${formatDayLabel(day)} at ${time}, ${zone.zoneLabel}.`
      : day
        ? `${formatDayLabel(day)} selected. Pick a time.`
        : ''
  const currentMonth = today ? new Date(today.getFullYear(), today.getMonth(), 1) : null
  const canGoBack = Boolean(monthStart && currentMonth && monthStart > currentMonth)
  const cells = monthStart ? monthCells(monthStart) : []
  const monthTitle = monthStart
    ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(monthStart)
    : ''

  function shiftMonth(delta: number) {
    setMonthStart((previous) =>
      previous ? new Date(previous.getFullYear(), previous.getMonth() + delta, 1) : previous
    )
    setTime(null)
    setSlotError(null)
  }

  /** Moves focus to the first missing choice: the calendar with no day, else the time column. */
  function focusFirstMissing() {
    const selector = day
      ? '[data-booking-slots] button'
      : '[data-booking-calendar] button:not(:disabled)'
    document.querySelector<HTMLElement>(selector)?.focus()
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    if (!day || !time || !zone) {
      setSlotError('Pick a day and a time first.')
      focusFirstMissing()
      return
    }
    setSubmitting(true)
    setSlotError(null)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          booking: { date: day, time, timeZone: zone.timeZone },
          answers: answersOf(state),
        }),
      })
      const result = (await response.json()) as BookingApiResponse
      if (result.ok) {
        update({
          booking: {
            date: day,
            time,
            zoneLabel: zone.zoneLabel,
            timeZone: zone.timeZone,
            connected: result.connected,
            ...(result.bookingId ? { bookingId: result.bookingId } : {}),
            ...(result.inviteStatus ? { inviteStatus: result.inviteStatus } : {}),
          },
        })
        router.push(BOOKED_PATH)
        return
      }
      if (result.reason === 'slot-taken') {
        // Clear only the time, keep every answer, and refresh the open times.
        setTime(null)
        setReloadKey((key) => key + 1)
        setSlotError(SLOT_TAKEN_COPY)
      } else {
        setSlotError(BOOK_FAILED_COPY)
      }
    } catch {
      setSlotError(BOOK_FAILED_COPY)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-12 px-brand-gutter py-16">
      <FlowStepIndicator current={4} />

      <div className="flex w-full max-w-[1152px] flex-col gap-8">
        <DisplayHeading
          level={1}
          size="h2"
          lead={
            connected === true
              ? "Choose a day, then a time. We'll email your invite right away."
              : 'Choose a day, then a time.'
          }
          id="gs-step-title"
        >
          Pick a time for your {CALL_LENGTH_MINUTES}-minute call.
        </DisplayHeading>

        <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
          <form
            noValidate
            onSubmit={onSubmit}
            aria-labelledby="gs-step-title"
            className="flex w-full flex-col gap-6 xl:w-[600px] xl:shrink-0"
          >
            <div className="flex flex-col gap-6 rounded-[40px] bg-brand-surface p-6 shadow-md lg:flex-row lg:gap-8 lg:p-8">
              <div className="flex w-full flex-col gap-6 lg:w-[304px] lg:shrink-0">
                <div className="flex items-center justify-between">
                  <p className="font-display text-brand-h4 text-brand-ink">{monthTitle}</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      radius="full"
                      motion="none"
                      iconOnly
                      aria-label="Previous month"
                      disabled={!canGoBack}
                      onClick={() => shiftMonth(-1)}
                    >
                      <BrandIcon name="ChevronLeft" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      radius="full"
                      motion="none"
                      iconOnly
                      aria-label="Next month"
                      onClick={() => shiftMonth(1)}
                    >
                      <BrandIcon name="ChevronRight" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-1" data-booking-calendar>
                  {/* Weekday names are in each day's label, so this row is hidden from screen readers. */}
                  <div aria-hidden="true" className="grid grid-cols-7 gap-1 text-center">
                    {WEEKDAYS.map((weekday) => (
                      <span
                        key={weekday}
                        className="font-text text-brand-small font-semibold text-brand-ink-muted"
                      >
                        {weekday}
                      </span>
                    ))}
                  </div>
                  <BookingDayGrid label="Pick a day">
                    {cells.map((cell, index) => {
                      if (!cell || !today) return <span key={`blank-${index}`} aria-hidden="true" />
                      const key = toDateKey(cell)
                      const open = slotsReady && (slots[key] ?? []).length > 0
                      const selected = key === day
                      const isToday = key === toDateKey(today)
                      return (
                        <span key={key} className="flex justify-center">
                          <BookingDayCell
                            day={cell.getDate()}
                            selected={selected}
                            today={isToday}
                            disabled={!open}
                            label={`${formatDayLabel(key)}${open ? '' : ', not available'}`}
                            onSelect={() => {
                              setDay(key)
                              setTime(null)
                              setSlotError(null)
                            }}
                          />
                        </span>
                      )
                    })}
                  </BookingDayGrid>
                </div>
              </div>

              <div
                className="flex w-full flex-col gap-3 lg:w-[180px] lg:shrink-0"
                data-booking-slots
              >
                <p className="font-text text-brand-body-strong text-brand-ink">
                  {day ? formatDayLabel(day) : 'Pick a day to see times.'}
                </p>
                {day && !slotsReady ? (
                  <p className="font-text text-brand-small text-brand-ink-muted">Loading times.</p>
                ) : null}
                {day && slotsReady && loadFailed ? (
                  <p className="font-text text-brand-small text-brand-ink-muted">
                    We couldn&apos;t load times. Try again in a moment.
                  </p>
                ) : null}
                {day && slotsReady && !loadFailed && daySlots.length === 0 ? (
                  <p className="font-text text-brand-small text-brand-ink-muted">
                    No times left on this day. Try another day.
                  </p>
                ) : null}
                {daySlots.map((slot) => (
                  <TimePill
                    key={slot.startsAt}
                    selected={slot.label === time}
                    onSelect={() => {
                      setTime(slot.label)
                      setSlotError(null)
                    }}
                  >
                    {slot.label}
                  </TimePill>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 px-2">
              <p className="font-text text-brand-small text-brand-ink-muted">
                Times shown in{' '}
                {zone ? (
                  <abbr title={zoneLongName(zone.timeZone)} className="no-underline">
                    {zone.zoneLabel}
                  </abbr>
                ) : null}
                .{' '}
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  motion="none"
                  aria-label="Change time zone"
                  aria-expanded={editingZone}
                  aria-controls={editingZone ? ZONE_SELECT_ID : undefined}
                  onClick={() => setEditingZone((open) => !open)}
                >
                  Change
                </Button>
              </p>
              {editingZone && zone ? (
                <SelectField
                  id={ZONE_SELECT_ID}
                  label="Time zone"
                  options={zoneOptions}
                  value={zone.timeZone}
                  onChange={(event) => {
                    const timeZone = event.target.value
                    setZone({ timeZone, zoneLabel: zoneLabelFor(timeZone) })
                    setTime(null)
                    setEditingZone(false)
                  }}
                />
              ) : null}
            </div>

            {/* One polite live line for the day and time choice. */}
            <p aria-live="polite" className="sr-only">
              {daySummary}
            </p>

            {day && time && zone ? (
              <p className="font-text text-brand-body-strong text-brand-ink">
                {formatDayLabel(day)} at {time},{' '}
                <abbr title={zoneLongName(zone.timeZone)} className="no-underline">
                  {zone.zoneLabel}
                </abbr>
              </p>
            ) : null}

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <FlowBackButton onClick={() => router.push(routes.getStartedGoals.path)} />
                <SubmitButton loading={submitting}>Book my call</SubmitButton>
              </div>
              {slotError ? (
                <div role="alert">
                  <ValidationMessage
                    message={slotError}
                    variant="error"
                    size="sm"
                    className="mt-0 items-start text-brand-danger-fg [&>span:first-child]:mt-0.5 [&>span:first-child]:text-brand-danger-fg"
                  />
                </div>
              ) : null}
              <p className="font-text text-brand-small text-brand-ink-muted">
                No time that works? <TextLink href={routes.contact.path}>Email us</TextLink> and
                we&apos;ll find one.
              </p>
            </div>
          </form>

          <aside className="flex w-full flex-col gap-6 rounded-[40px] bg-brand-surface p-6 shadow-md sm:p-8 xl:w-[504px] xl:shrink-0">
            <Kicker>ON THE CALL</Kicker>
            <ol className="flex flex-col gap-5">
              {ON_THE_CALL.map((item) => (
                <li key={item.number} className="flex gap-4">
                  <span className="w-8 shrink-0 font-text text-brand-small font-semibold text-brand-ink">
                    {item.number}
                  </span>
                  <span className="font-text text-brand-body text-brand-ink">{item.text}</span>
                </li>
              ))}
            </ol>
            <p className="border-t border-brand-border pt-5 font-text text-brand-small text-brand-ink-muted">
              Month to month. Your accounts stay yours.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
