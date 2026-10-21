/**
 * Retargeting offer stack (Paper frame "Section - Deal", registry section
 * `offer-stack`): what the $99 monthly buys, the five things every month, the
 * one-line bonus list, the price line and the buy CTA. Server component.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { slotProps, type LpSectionProps } from './section_props'

const EVERY_MONTH = [
  {
    title: '30 feed posts from your real jobs.',
    body: 'Your page looks alive every time someone checks.',
  },
  { title: '30 stories, one for every day.', body: 'Your page never looks quiet again.' },
  { title: 'Every caption written, in your voice.', body: 'No more blank caption box at 9pm.' },
  { title: 'Your posting day for every piece.', body: 'Zero planning.' },
  { title: 'Your private client portal.', body: 'Copy, download, post: about a minute each.' },
] as const

const BONUSES =
  'Bonuses with your first month: Profile Tune-Up Kit · Your Trade\'s Question List · Ready Replies · "Post It in a Minute" Guide · Your Seasonal Content Calendar'

export function Offer99RetargetDeal({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-offer-stack-heading`
  return (
    <PageSection flush {...slotProps(lp, 'offer-stack')} aria-labelledby={headingId} width="grid">
      <DisplayHeading
        level={2}
        id={headingId}
        size="h2"
        kicker="Here's everything you get…"
        lead="All of it made from your real work. All of it waiting in your portal every week. All of it yours to keep."
      >
        Open Sign: 30 Posts, 30 Stories, 5 Bonuses
      </DisplayHeading>
      <div className="flex flex-col gap-10 rounded-[40px] bg-brand-surface p-10 shadow-raised">
        <div className="flex flex-col">
          <p className="border-b border-brand-border pb-4 font-text text-brand-small font-semibold text-brand-ink-muted">
            Every month
          </p>
          {EVERY_MONTH.map((item) => (
            <div key={item.title} className="flex flex-col gap-1 border-b border-brand-border py-4">
              <h3 className="font-text text-brand-body-strong text-brand-ink">{item.title}</h3>
              <p className="font-text text-brand-small text-brand-ink-muted">{item.body}</p>
            </div>
          ))}
          <div className="mt-4 flex flex-col gap-2 border-t border-brand-ink pt-4">
            <p className="font-text text-brand-small font-semibold text-brand-ink-muted">
              Our line
            </p>
            <p className="font-display text-brand-h3 text-brand-ink">
              That&apos;s 60 finished pieces a month you never have to think up, write or design.
              Your part: about 5 minutes a week.
            </p>
          </div>
        </div>
        <p className="font-text text-brand-body text-brand-ink">{BONUSES}</p>
        <div className="flex flex-col gap-4">
          <p className="font-text text-brand-small text-brand-ink-muted">
            $99/month. [SETUP FEE]. No contract.
          </p>
          {href ? (
            <BuyCta
              href={href}
              lpSlug={lp.slug}
              label="Yes! Turn On My Open Sign"
              tone="action"
              caption="$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free."
            />
          ) : null}
        </div>
      </div>
    </PageSection>
  )
}
