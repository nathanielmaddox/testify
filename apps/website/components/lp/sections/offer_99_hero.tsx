/**
 * Offer LP hero (cold `done-for-you-99`, and the `closed` and `busiest` hero
 * variants): plain pre-line, display-xl H1 (centered), one sub line, two fact
 * chips (DS Badge, client module), the violet buy CTA with its caption, the
 * thin trust row, then the example-week mock. Only the copy changes between
 * variants (`LandingPage.heroVariant`). Keeps the `lp-<slug>-hero` id the
 * sticky buy bar waits for. Server component; the chips and the buy CTA are
 * client modules. `CHIPS` and `TRUST_ROW` are exported for the retargeting hero.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref, type LpHeroVariant } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { ExampleWeek } from './example_week'
import { HeroChips } from './hero_chips'
import { OPEN_SIGN_BUY_CAPTION, OPEN_SIGN_BUY_LABEL } from './open_sign_copy'
import { slotProps, type LpSectionProps } from './section_props'

export const CHIPS = ['60 pieces a month', 'Your part: less than one customer call a week'] as const

export const TRUST_ROW = [
  'We never need your passwords',
  'Nothing goes out unless you post it',
  'Every file is yours to keep',
  // Says "Secure checkout" only. The Stripe payment element is not mounted yet
  // (components/lp/checkout/payment_element_slot.tsx). Restore "Secure checkout by
  // Stripe" once it is.
  'Secure checkout',
] as const

interface HeroCopy {
  preLine: string
  headline: string
  sub: string
}

const HERO_COPY: Record<LpHeroVariant, HeroCopy> = {
  default: {
    preLine: 'For local pros too busy to post.',
    headline: 'A Fresh Post and Story, Every Single Day',
    sub: 'We make 30 posts and 30 stories a month from your real jobs. You press post.',
  },
  closed: {
    preLine: 'Before they call, they look you up.',
    headline: "Your Page Looks Closed. You're Not.",
    sub: "Before they call, people look you up. Give them a page that's open every day. You press post.",
  },
  busiest: {
    preLine: 'For pros who are flat out every day.',
    headline: 'Look as Busy Online as You Are',
    sub: 'Your days are full of good work nobody online sees. We turn it into a post and a story a day.',
  },
}

export function Offer99Hero({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const copy = HERO_COPY[lp.heroVariant ?? 'default']
  const headingId = `lp-${lp.slug}-hero-heading`
  return (
    <PageSection flush {...slotProps(lp, 'hero')} aria-labelledby={headingId} width="grid">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <p className="font-text text-brand-body-strong text-brand-ink">{copy.preLine}</p>
        <DisplayHeading level={1} size="display-xl" id={headingId} lead={copy.sub} align="center">
          {copy.headline}
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
      <ExampleWeek caption="Example. Demo business." />
    </PageSection>
  )
}
