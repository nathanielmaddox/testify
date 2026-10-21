/**
 * Retargeting first month (registry section `first-month`): the first 30 days
 * as a day-by-day list under a plain pre-line and H2. No CTA, no mock. Server
 * component, no DS import beyond the heading.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const STEPS = [
  { when: 'Today', what: 'Tell us your trade and town. Two minutes.' },
  {
    when: 'Day 1 to 2',
    what: 'Your first questions arrive. About as long as one customer call to answer.',
  },
  { when: 'By day [N]', what: 'Your first week of posts and stories is in your portal.' },
  { when: 'Every [DAY] after', what: 'A new week, on time, or that week is free.' },
  {
    when: 'End of month one',
    what: 'A post and a story for every day, all yours to keep. Not worth it? Full refund.',
  },
] as const

export function Offer99RetargetFirstMonth({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-first-month-heading`
  return (
    <PageSection flush {...slotProps(lp, 'first-month')} aria-labelledby={headingId} width="prose">
      <div className="flex flex-col gap-3">
        <p className="font-text text-brand-body-strong text-brand-ink">
          Here&apos;s your first month, day by day.
        </p>
        <DisplayHeading level={2} id={headingId} size="h2">
          Your First 30 Days, Step by Step
        </DisplayHeading>
      </div>
      <ol className="flex flex-col gap-6">
        {STEPS.map((step, index) => (
          <li key={step.when} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-border-strong bg-brand-surface font-text text-brand-small font-semibold text-brand-ink"
            >
              {index + 1}
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="font-text text-brand-body-strong text-brand-ink">{step.when}</h3>
              <p className="font-text text-brand-body text-brand-ink-muted">{step.what}</p>
            </div>
          </li>
        ))}
      </ol>
    </PageSection>
  )
}
