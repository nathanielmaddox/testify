/**
 * Offer LP closing (Paper "a-close", registry section `final-cta`) and the
 * P.S. block (Paper "a-ps", registry section `ps`). Server components. The
 * 30-day grid above the close is a decorative layout: the brand
 * ProgressCalendar labels its tiles as video milestones, which does not match
 * this grid, so it is not used here.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { slotProps, type LpSectionProps } from './section_props'

const DAYS = Array.from({ length: 30 }, (_, index) => index + 1)

export function Offer99Close({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-final-cta-heading`
  return (
    <PageSection flush {...slotProps(lp, 'final-cta')} aria-labelledby={headingId} width="grid">
      <ol aria-hidden="true" className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {DAYS.map((day) => (
          <li
            key={day}
            className="flex aspect-square flex-col justify-between rounded-tile bg-brand-surface p-2 shadow-raised"
          >
            <span className="font-text text-[12px] font-semibold text-brand-ink">{day}</span>
            <span className="flex items-end gap-1">
              <span className="h-3.5 w-2 rounded-[2px] bg-brand-ink" />
              <span className="h-4 w-4 rounded-[4px] bg-brand-done-bg" />
            </span>
          </li>
        ))}
      </ol>
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-text text-brand-body-strong text-brand-ink">
          So here&apos;s where you&apos;re at…
        </p>
        <DisplayHeading
          level={2}
          id={headingId}
          size="h2"
          lead="One road costs you less than one appointment a month. The other costs you another quiet month."
        >
          A Full Page, or Another Quiet Month?
        </DisplayHeading>
        <p className="font-text text-brand-small text-brand-ink-muted">
          Every week you wait, your page stays quiet.
        </p>
        {href ? (
          <BuyCta
            href={href}
            lpSlug={lp.slug}
            label="Yes! Turn On My Open Sign: $99/Month"
            tone="action"
            caption="$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free."
          />
        ) : null}
      </div>
    </PageSection>
  )
}

export function Offer99Ps({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-ps-heading`
  return (
    <PageSection flush {...slotProps(lp, 'ps')} aria-labelledby={headingId} width="prose">
      <div className="flex flex-col gap-6 font-text text-brand-body-xl leading-8 text-brand-ink">
        <p id={headingId}>To your success,</p>
        <p className="font-display text-brand-body-xl font-semibold leading-7">[SIGNATURE]</p>
        <p>[NAME], [ROLE], Testify</p>
        <p>
          P.S. If you skimmed to the bottom (most busy owners do, and I don&apos;t blame you),
          here&apos;s the whole thing in one breath: we make a post and a story for every day of the
          month from your real jobs, captions written in your voice, each one telling you which day
          it goes out. Your part takes less time each week than one customer call, then you press
          post. It&apos;s $99 a month, no contract, and your first month is love it or it&apos;s
          free.
        </p>
        <p>
          P.P.S. Remember: even if you ask for your money back after the first month, you keep all
          60 pieces. That&apos;s a month of your page looking open, busy and proud of its work, and
          the risk sits entirely with us.
        </p>
        <p>
          P.P.P.S. Sign up today and your first week of posts and stories is in your portal by
          [DATE]. Wait a month, and that&apos;s one more month of a page stuck on [MONTH].
        </p>
        {href ? (
          <BuyCta
            href={href}
            lpSlug={lp.slug}
            label="Yes! Turn On My Open Sign: $99/Month"
            tone="action"
            caption="$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free."
          />
        ) : null}
      </div>
    </PageSection>
  )
}
