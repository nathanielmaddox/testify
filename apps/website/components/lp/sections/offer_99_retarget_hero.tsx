/**
 * Retargeting hero (Paper frame "Hero"): eyebrow, display headline "Try a
 * Month. Love It or It's Free.", lead, the two fact chips, the violet buy CTA
 * with its caption, and the example-week mock (shared ExampleWeek, which
 * matches the Paper mock). Server component; the buy CTA is the client BuyCta.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { ExampleWeek } from './example_week'
import { slotProps, type LpSectionProps } from './section_props'

const CHIPS = ['60 pieces a month', 'Your part: less than one customer call a week'] as const

export function Offer99RetargetHero({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-hero-heading`
  return (
    <PageSection flush {...slotProps(lp, 'hero')} aria-labelledby={headingId} width="grid">
      <div className="flex flex-col items-start gap-6">
        <p className="font-text text-brand-body-strong text-brand-ink">
          Still thinking it over? Here&apos;s the deal.
        </p>
        <DisplayHeading
          level={1}
          id={headingId}
          lead="Take a whole month for a spin: a post and a story for every day, made from your own jobs, captions in your words, each one telling you which day it goes out. Less time a week than one customer call. You press post. If it doesn't feel worth it, tell us within [7] days after the month ends and you get your money back. No contract. No passwords."
        >
          Try a Month. Love It or It&apos;s Free.
        </DisplayHeading>
        <ul className="flex flex-wrap gap-3">
          {CHIPS.map((chip) => (
            <li
              key={chip}
              className="flex h-11 items-center rounded-pill border border-brand-border-strong bg-brand-surface px-5 font-text text-brand-label text-brand-ink"
            >
              {chip}
            </li>
          ))}
        </ul>
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
      <ExampleWeek storyLabel="Story" compact />
    </PageSection>
  )
}
