/**
 * Retargeting first month (Paper frame "Section - First month", new registry
 * section `first-month`): the first 30 days as five steps, beside a static
 * feed-post mock, then the buy CTA. Server component, no DS import. The mock's
 * tile labels (Copy caption, Download, Mark as posted, Ask for a change) are
 * decorative: the mock is an illustration, not a working control.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
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
    what: '60 pieces made, a post and a story for every day. Not worth it? Full refund, and you keep them.',
  },
] as const

const TILE_LINE = 'Water heater swap, one morning'
const POST_BODY =
  'Water heater swap, done in one morning. Two hours, one crew, hot water back before lunch.'

export function Offer99RetargetFirstMonth({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-first-month-heading`
  return (
    <PageSection flush {...slotProps(lp, 'first-month')} aria-labelledby={headingId} width="grid">
      <DisplayHeading
        level={2}
        id={headingId}
        size="h2"
        kicker="Here's your first month, day by day…"
        lead={'No mystery, no waiting for a "kick-off call". Here\'s every step.'}
      >
        Your First 30 Days, Step by Step
      </DisplayHeading>
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
        <ol className="flex flex-col gap-5">
          {STEPS.map((step, index) => (
            <li key={step.when} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className={
                  index < 2
                    ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-ink font-text text-[15px] font-semibold text-brand-canvas'
                    : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-border-strong bg-brand-surface font-text text-[15px] font-semibold text-brand-ink'
                }
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
        <div className="flex flex-col gap-4">
          <div
            aria-hidden="true"
            className="flex flex-col gap-5 rounded-card bg-brand-surface p-6 shadow-raised"
          >
            <div className="flex items-center justify-between">
              <span className="font-text text-brand-small font-semibold text-brand-ink">
                Feed post
              </span>
              <span className="rounded-pill bg-brand-canvas px-3 py-1 font-text text-brand-small font-semibold text-brand-ink">
                Post on Tuesday
              </span>
            </div>
            <div className="flex h-[360px] flex-col justify-end rounded-card bg-brand-done-bg p-6">
              <span className="font-display text-brand-h3 text-brand-ink">{TILE_LINE}</span>
            </div>
            <p className="font-text text-brand-body text-brand-ink">{POST_BODY}</p>
            <div className="flex gap-2">
              <span className="flex h-11 flex-1 items-center justify-center rounded-pill border border-brand-ink font-text text-brand-small font-semibold text-brand-ink">
                Copy caption
              </span>
              <span className="flex h-11 flex-1 items-center justify-center rounded-pill border border-brand-ink font-text text-brand-small font-semibold text-brand-ink">
                Download
              </span>
            </div>
            <span className="flex h-11 items-center justify-center rounded-pill bg-brand-ink font-text text-brand-small font-semibold text-brand-canvas">
              Mark as posted
            </span>
            <span className="self-center font-text text-brand-small text-brand-ink underline">
              Ask for a change
            </span>
          </div>
          <p className="font-text text-brand-small text-brand-ink-subtle">
            Example week. Demo business.
          </p>
        </div>
      </div>
      {href ? (
        <BuyCta
          href={href}
          lpSlug={lp.slug}
          label="Yes! Turn On My Open Sign"
          tone="action"
          caption="$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free."
        />
      ) : null}
    </PageSection>
  )
}
