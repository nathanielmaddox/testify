/**
 * Offer LP guarantee (Paper "a-guarantees", registry section `guarantee`):
 * the five promises that take the risk off the owner, with the buy CTA.
 * Server component; the grid is the brand GuaranteeList.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { GuaranteeList, type Guarantee } from '@testify/style-guide/components/GuaranteeList'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { slotProps, type LpSectionProps } from './section_props'

const PROMISES: readonly Guarantee[] = [
  {
    title: "Promise #1: Love It or It's Free.",
    body: "If your first month isn't worth it to you, tell us within [7] days after it ends and we refund the full $99. You keep all 60 pieces.",
  },
  {
    title: 'Promise #2: On Time, or That Week Is Free.',
    body: 'Your week of posts and stories is in your portal every [DAY] by [TIME]. If a week is late, that week is free.',
  },
  {
    title: 'Promise #3: Unlimited Edits.',
    body: 'Want a change? Ask in the portal and we redo it within [N] business days. As many times as you like.',
  },
  {
    title: 'Promise #4: No Contract.',
    body: "Cancel in your portal in 2 clicks, any month. Everything you've received stays yours.",
  },
  {
    title: 'Promise #5: Your Accounts Stay Yours.',
    body: 'We never ask for your passwords. Nothing goes out unless you post it.',
  },
]

export function Offer99Guarantee({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-guarantee-heading`
  return (
    <PageSection flush {...slotProps(lp, 'guarantee')} aria-labelledby={headingId} width="grid">
      <DisplayHeading
        level={2}
        id={headingId}
        size="h2"
        kicker="Burned before? We take the risk."
        lead="You can't lose. Either you love having a post and a story for every day, or you get your money back and keep everything we made."
      >
        Five Promises. All the Risk Is Ours.
      </DisplayHeading>
      <div className="flex flex-col gap-8">
        <p className="font-text text-brand-lead text-brand-ink">Here&apos;s how sure we are.</p>
        <GuaranteeList guarantees={PROMISES} headingLevel={3} />
        <p className="font-text text-brand-lead text-brand-ink">
          Read that again. You keep all 60 pieces. Even if you ask for your money back.
        </p>
        <p className="font-display text-brand-h3 text-brand-ink">
          All the risk is on us. The only thing you risk is another month of a quiet page.
        </p>
        {href ? (
          <BuyCta
            href={href}
            lpSlug={lp.slug}
            label="Yes! Turn On My Open Sign: $99/Month"
            tone="action"
          />
        ) : null}
      </div>
    </PageSection>
  )
}
