/**
 * Offer LP guarantee (registry section `guarantee`): plain pre-line, H2, sub,
 * the five promises word for word through GuaranteeList, and the close line.
 * No CTA. Server component; the grid is the brand GuaranteeList.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { GuaranteeList, type Guarantee } from '@testify/style-guide/components/GuaranteeList'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const PROMISES: readonly Guarantee[] = [
  {
    title: "Love It or It's Free.",
    body: "If your first month isn't worth it to you, tell us within [7] days after it ends and we refund the full $99. You keep all 60 pieces.",
  },
  {
    title: 'On Time, or That Week Is Free.',
    body: 'Your week of posts and stories is in your portal every [DAY] by [TIME]. If a week is late, that week is free.',
  },
  {
    title: 'Unlimited Edits.',
    body: 'Want a change? Ask in the portal and we redo it within [N] business days. As many times as you like.',
  },
  {
    title: 'No Contract.',
    body: "Cancel in your portal in 2 clicks, any month. Everything you've received stays yours.",
  },
  {
    title: 'Your Accounts Stay Yours.',
    body: 'We never ask for your passwords. Nothing goes out unless you post it.',
  },
]

export function Offer99Guarantee({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-guarantee-heading`
  return (
    <PageSection flush {...slotProps(lp, 'guarantee')} aria-labelledby={headingId} width="grid">
      <div className="flex flex-col gap-3">
        <p className="font-text text-brand-body-strong text-brand-ink">
          Burned before? We take the risk.
        </p>
        <DisplayHeading
          level={2}
          id={headingId}
          size="h2"
          lead="Either you love having a post and a story for every day, or you get your money back and keep everything we made."
        >
          Five Promises. All the Risk Is Ours.
        </DisplayHeading>
      </div>
      <div className="flex flex-col gap-8">
        <GuaranteeList guarantees={PROMISES} headingLevel={3} columns={3} />
      </div>
    </PageSection>
  )
}
