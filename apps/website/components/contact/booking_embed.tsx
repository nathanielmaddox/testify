'use client'

// Booking card: the owner's scheduling page in an iframe when NEXT_PUBLIC_BOOKING_EMBED_URL is set,
// otherwise a calendar-style placeholder (a month grid beside four sample times, all inert).
import { Link } from '@otesse/design-system'
import { BookingDayCell, BookingDayGrid } from '@testify/style-guide/components/BookingDayCell'
import { TimePill } from '@testify/style-guide/components/TimePill'
import { useEffect, useState, type ReactNode } from 'react'

const SAMPLE_TIMES = ['10:00 am', '11:30 am', '1:00 pm', '3:30 pm']
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** The embed URL, only when it is an https address. Read at build time for the client bundle. */
function embedUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_BOOKING_EMBED_URL?.trim()
  if (!raw || !raw.startsWith('https://')) return null
  return raw
}

function Embed({ url }: { url: string }) {
  return (
    <div className="flex flex-col gap-4">
      <iframe
        src={url}
        title="Book a time"
        loading="lazy"
        className="block min-h-[720px] w-full border-0"
      />
      <p className="text-center font-text text-brand-small text-brand-ink-subtle">
        Calendar not loading?{' '}
        <Link href={url} target="_blank" rel="noopener noreferrer">
          Open it in a new tab.
        </Link>
      </p>
    </div>
  )
}

/** The current month, today marked, past days disabled. Rendered after mount so the date is the visitor's. */
function MonthGrid() {
  const [today, setToday] = useState<Date | null>(null)
  useEffect(() => setToday(new Date()), [])
  if (!today) return null

  const year = today.getFullYear()
  const month = today.getMonth()
  const todayDate = today.getDate()
  const leading = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const cells: ReactNode[] = []
  for (let i = 0; i < leading; i++) cells.push(<span key={`lead-${i}`} aria-hidden="true" />)
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    cells.push(
      <BookingDayCell
        key={d}
        day={d}
        today={d === todayDate}
        disabled={d < todayDate}
        label={date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
      />
    )
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <p className="font-text text-brand-body-strong text-brand-ink">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day, i) => (
          <span key={i} className="font-text text-brand-caption text-brand-ink-subtle">
            {day}
          </span>
        ))}
      </div>
      <BookingDayGrid label="Pick a day">{cells}</BookingDayGrid>
    </div>
  )
}

function Placeholder() {
  return (
    <div className="flex flex-col gap-8">
      {/* inert: not focusable and hidden from assistive tech. Nothing here is a real choice yet. */}
      <div inert aria-hidden="true" className="flex flex-col gap-10 lg:flex-row lg:gap-14">
        <MonthGrid />
        <div className="flex flex-col gap-2 lg:w-56 lg:shrink-0">
          {SAMPLE_TIMES.map((time) => (
            <TimePill key={time}>{time}</TimePill>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 text-center">
        <p className="font-text text-brand-body text-brand-ink-muted">
          Your booking calendar goes here.
        </p>
        {process.env.NODE_ENV !== 'production' ? (
          <p className="font-text text-brand-small text-brand-ink-subtle">
            Set NEXT_PUBLIC_BOOKING_EMBED_URL to embed it.
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function BookingEmbed() {
  const url = embedUrl()
  return (
    <div className="rounded-[40px] bg-brand-surface p-5 shadow-raised md:p-14">
      {url ? <Embed url={url} /> : <Placeholder />}
    </div>
  )
}
