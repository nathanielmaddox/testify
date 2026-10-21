/**
 * Retargeting hero (registry section `hero`): plain pre-line, display H1
 * "Try a Month. Love It or It's Free.", one sub line, the two fact chips, the
 * violet buy CTA with its caption, the trust row (shared with the cold hero),
 * and the compact example-week mock. Server component; the buy CTA is the
 * client BuyCta.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { ExampleWeek } from './example_week'
import { HeroChips } from './hero_chips'
import { CHIPS, TRUST_ROW } from './offer_99_hero'
import { OPEN_SIGN_BUY_CAPTION, OPEN_SIGN_BUY_LABEL } from './open_sign_copy'
import { slotProps, type LpSectionProps } from './section_props'

export function Offer99RetargetHero({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-hero-heading`
  return (
    <PageSection flush {...slotProps(lp, 'hero')} aria-labelledby={headingId} width="grid">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <p className="font-text text-brand-body-strong text-brand-ink">
          Still thinking it over? Here&apos;s the deal.
        </p>
        <DisplayHeading
          level={1}
          size="display-xl"
          id={headingId}
          align="center"
          lead="A full month of posts and stories, made from your real jobs. You press post."
        >
          Try a Month. Love It or It&apos;s Free.
        </DisplayHeading>
        <HeroChips items={CHIPS} />
        {href ? (
          <BuyCta
            href={href}
            lpSlug={lp.slug}
            label={OPEN_SIGN_BUY_LABEL}
            tone="action"
            caption={OPEN_SIGN_BUY_CAPTION}
            placement="hero"
          />
        ) : null}
        <p className="font-text text-brand-small text-brand-ink-muted">{TRUST_ROW.join(' · ')}</p>
      </div>
      <ExampleWeek storyLabel="Story" compact caption="Example. Demo business." />
    </PageSection>
  )
}
