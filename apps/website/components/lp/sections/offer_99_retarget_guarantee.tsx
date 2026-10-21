/**
 * Retargeting guarantees (Paper frame "Section - Guarantees", registry section
 * `guarantee`): the five promises as the brand GuaranteeList, then the
 * keep-everything line. No buy CTA here (Paper has none in this section).
 * Server component.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { GuaranteeList, type Guarantee } from '@testify/style-guide/components/GuaranteeList'
import { PageSection } from '@testify/style-guide/components/PageSection'
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

export function Offer99RetargetGuarantee({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-guarantee-heading`
  return (
    <PageSection flush {...slotProps(lp, 'guarantee')} aria-labelledby={headingId} width="grid">
      <DisplayHeading
        level={2}
        id={headingId}
        size="h2"
        kicker="And you're covered five ways…"
        lead="All the risk is on us."
      >
        Love It or It&apos;s Free, Plus Four More
      </DisplayHeading>
      <GuaranteeList guarantees={PROMISES} headingLevel={3} />
      <p className="font-text text-brand-lead font-semibold text-brand-ink">
        Even if you ask for your money back, you keep all 60 pieces.
      </p>
    </PageSection>
  )
}
