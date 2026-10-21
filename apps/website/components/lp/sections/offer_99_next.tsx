/**
 * Offer LP next steps (Paper "a-next", registry section `next`): what happens
 * when the visitor clicks, in four steps. Paper's frame has no buy CTA in this
 * section, so none is drawn here (the CTA sits in the sections around it).
 * Server component; ProcessSteps is the brand composition for exactly four steps.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { ProcessSteps } from '@testify/style-guide/components/ProcessSteps'
import { slotProps, type LpSectionProps } from './section_props'

export function Offer99Next({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-next-heading`
  return (
    <PageSection flush {...slotProps(lp, 'next')} aria-labelledby={headingId} width="grid">
      <DisplayHeading
        level={2}
        id={headingId}
        size="h2"
        kicker="Here's what happens when you click."
        lead={
          'No onboarding calls. No 40-page questionnaire. No waiting around for a "strategy session".'
        }
      >
        Your First Week, Ready by Day [N]
      </DisplayHeading>
      <ProcessSteps
        steps={[
          {
            title: 'Click the button and fill in the secure checkout.',
            body: 'About 2 minutes. Apple Pay and Google Pay work too.',
          },
          {
            title: 'Tell us your trade and your town.',
            body: 'One short form on the next page. Drop in a few job photos if you have them.',
          },
          {
            title: 'Your first questions arrive within a day or two.',
            body: 'Answer by text or voice note, over your coffee.',
          },
          {
            title: 'By day [N], your first week is ready.',
            body: 'Seven posts and seven stories, captions written, posting days set. You tap copy, tap post, and your page wakes up.',
          },
        ]}
      />
    </PageSection>
  )
}
