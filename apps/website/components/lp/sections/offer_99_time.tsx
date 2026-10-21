/**
 * Offer LP time section (Paper "a-time", registry section `time`): what a
 * month of posting costs you yourself, against the service, as a comparison.
 * Server component; the comparison is the client OfferCompare.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { OfferCompare, type OfferCompareRow } from './offer_99_compare'
import { slotProps, type LpSectionProps } from './section_props'

const BODY = 'font-text text-brand-body-lg leading-7 text-brand-ink'

const COMPARE: readonly OfferCompareRow[] = [
  { yourself: 'Thinking up 60 things to post', withService: 'Done for you' },
  {
    yourself: 'Shooting photos that look right',
    withService: 'We use the photos you already take',
  },
  {
    yourself: 'Writing 30 captions and 30 story lines',
    withService: 'Done for you, in your words',
  },
  { yourself: 'Designing 60 posts and stories', withService: 'Done for you' },
  { yourself: 'Deciding which day each one goes out', withService: 'Done for you' },
  { yourself: 'Posting', withService: 'You, about a minute each' },
  {
    yourself: 'Total: [N] hours a month / evenings and weekends',
    withService: '20 minutes a month, plus posting',
  },
]

export function Offer99Time({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-time-heading`
  return (
    <PageSection flush {...slotProps(lp, 'time')} aria-labelledby={headingId} width="prose">
      <div className="flex flex-col gap-10">
        <DisplayHeading
          level={2}
          id={headingId}
          size="h2"
          kicker="Let's talk about your evenings."
          lead="Making a post and a story for every day is a part-time job. We take the whole job. You keep the few minutes of answers and the minute it takes to press post."
        >
          Get Your Evenings Back
        </DisplayHeading>
        <div className="flex flex-col gap-5">
          <p className={BODY}>
            Here&apos;s what a month of showing up every day really costs, if you do it yourself.
          </p>
          <p className={BODY}>
            Coming up with 60 things to say. Taking photos that actually look right. Writing 30
            captions and 30 story lines. Designing and resizing every single one.
          </p>
          <p className={BODY}>That&apos;s evenings and weekends, every month.</p>
          <p className={BODY}>
            Hours you could spend with your family. On the next quote. Or just sitting down for
            once.
          </p>
          <p className={BODY}>Now here&apos;s what it costs with us.</p>
          <p className={BODY}>
            About 20 minutes a month, less than one appointment. Plus about a minute to post each
            piece.
          </p>
        </div>
        <OfferCompare
          rows={COMPARE}
          yourselfLabel="Doing it yourself, every month"
          serviceLabel="With Open Sign"
        />
        <p className="font-display text-[32px] leading-9 tracking-[-0.02em] text-brand-ink">
          60 pieces a month. Less than one appointment&apos;s worth of your time.
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
