'use client'

/**
 * Get started, the booked page (the conversion page): the call's day, time and
 * zone, the calendar file and what happens next. Reads the booking from
 * sessionStorage; a missing or malformed booking sends the visitor back to step 4.
 * Both come from the stored booking result: a warning shows unless the booking
 * provider created it, and an invite is claimed as sent only when the provider
 * reported `inviteStatus: 'sent'`.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ActionButton } from '@testify/style-guide/components/ActionButton'
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { Kicker } from '@testify/style-guide/components/Kicker'
import { Notice } from '@testify/style-guide/components/Notice'
import { TextLink } from '@testify/style-guide/components/TextLink'
import { BOOKING_PATH, buildBookingIcs, formatDayLabel, zoneLongName } from '@/lib/get_started'
import { routes } from '@/lib/site.config'
import { FlowStepIndicator } from './step_indicator'
import { useGetStartedState } from './use_get_started_state'

const WHAT_HAPPENS_NEXT = [
  {
    number: '01',
    text: "We read your answers. Before the call we look at your business and where it's online now.",
  },
  {
    number: '02',
    text: 'Fifteen minutes together. You leave with [N] post ideas and a first look at your month.',
  },
  {
    number: '03',
    text: 'You decide. If you go ahead, your first posts come to you for your OK before anything goes live.',
  },
] as const

/**
 * Step 5, the conversion page: the booked call and what happens next. Reads
 * the booking from sessionStorage. With no booking it sends the visitor back
 * to the calendar step.
 */
/** Heading lead. Claims an invite is on its way only once the booking API is connected. */
function inviteLead(email: string, inviteSent: boolean): string {
  if (inviteSent) {
    return email
      ? `Your invite is on its way to ${email}. See you on the call.`
      : 'Your invite is on its way. See you on the call.'
  }
  return email
    ? `We'll send your invite to ${email}. See you on the call.`
    : "We'll send your invite. See you on the call."
}

export function BookedSummary() {
  const router = useRouter()
  const { state, ready } = useGetStartedState()
  const booking = state?.booking
  const rawEmail = state?.aboutYou?.['email']
  const email = typeof rawEmail === 'string' ? rawEmail.trim() : ''
  const connected = booking?.connected === true
  const inviteSent = connected && booking?.inviteStatus === 'sent'

  useEffect(() => {
    if (ready && !booking) router.replace(BOOKING_PATH)
  }, [ready, booking, router])

  function addToCalendar() {
    if (!booking) return
    const ics = buildBookingIcs(booking)
    if (!ics) return
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'testify-call.ics'
    document.body.appendChild(link)
    link.click()
    link.remove()
    // Revoke after a short delay: some browsers read the blob after click() returns.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="flex w-full flex-col items-center gap-12 px-brand-gutter py-16">
      <FlowStepIndicator current={5} />

      {booking ? (
        <div className="flex w-full max-w-[1152px] flex-col gap-10">
          {connected ? null : (
            <Notice
              tone="warning"
              description="Booking isn't connected yet. Your answers are saved in this browser only."
            />
          )}
          <div className="flex flex-col gap-4">
            <Kicker className="self-start">BOOKED</Kicker>
            <DisplayHeading level={1} size="h1" lead={inviteLead(email, inviteSent)}>
              You&apos;re booked.
            </DisplayHeading>
          </div>

          <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
            <section
              aria-labelledby="gs-call-title"
              className="flex w-full flex-col gap-6 rounded-[40px] bg-brand-surface p-6 shadow-md sm:p-8 xl:w-[600px] xl:shrink-0"
            >
              <h2 id="gs-call-title" className="font-display text-brand-h3 text-brand-ink">
                Your call
              </h2>
              <dl className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <dt className="w-[72px] shrink-0 font-text text-brand-small font-semibold text-brand-ink-muted">
                    When
                  </dt>
                  <dd className="font-text text-brand-body text-brand-ink">
                    {formatDayLabel(booking.date)} at {booking.time}{' '}
                    <abbr title={zoneLongName(booking.timeZone)} className="no-underline">
                      {booking.zoneLabel}
                    </abbr>
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-[72px] shrink-0 font-text text-brand-small font-semibold text-brand-ink-muted">
                    How
                  </dt>
                  <dd className="font-text text-brand-body text-brand-ink">
                    {inviteSent
                      ? '15-minute video call. The link is in your invite.'
                      : '15-minute video call.'}
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-[72px] shrink-0 font-text text-brand-small font-semibold text-brand-ink-muted">
                    With
                  </dt>
                  <dd className="font-text text-brand-body text-brand-ink">[NAME], Testify</dd>
                </div>
              </dl>
              <div className="flex flex-wrap items-center gap-5">
                <ActionButton onClick={addToCalendar}>Add to calendar</ActionButton>
                <TextLink href={routes.contact.path}>Reschedule or cancel</TextLink>
              </div>
            </section>

            <section
              aria-labelledby="gs-next-title"
              className="flex w-full flex-col gap-6 rounded-[40px] bg-brand-surface p-6 shadow-md sm:p-8 xl:w-[504px] xl:shrink-0"
            >
              <h2 id="gs-next-title" className="font-display text-brand-h3 text-brand-ink">
                What happens next
              </h2>
              <ol className="flex flex-col gap-5">
                {WHAT_HAPPENS_NEXT.map((item) => (
                  <li key={item.number} className="flex gap-4">
                    <span className="w-8 shrink-0 font-text text-brand-small font-semibold text-brand-ink">
                      {item.number}
                    </span>
                    <span className="font-text text-brand-body text-brand-ink">{item.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-text text-brand-body text-brand-ink">
              Nothing to prepare. Bring your questions.
            </p>
            {inviteSent ? (
              <p className="font-text text-brand-small text-brand-ink-muted">
                No email in a few minutes? Check spam, or{' '}
                <TextLink href={routes.contact.path}>resend the invite</TextLink>.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
