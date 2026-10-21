/**
 * Offer LP problem (registry section `problem`): plain pre-line, H2, and six
 * short paragraphs in a reading column. No cards, no icons, no CTA. Server
 * component, no DS import.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const PARAGRAPHS = [
  'You pull into the driveway after a ten-hour day. You open Facebook to "quickly post something."',
  'Five minutes later you close it. Nothing posted.',
  "That's not laziness. The job comes first. It always will.",
  "The hard part was never pressing post. It's deciding what to say at 9pm, then making it look right.",
  "Meanwhile, people look you up before they call. They find a page that went quiet in [MONTH] and wonder if you're still open.",
  "You are. Your page just doesn't show it.",
] as const

export function Offer99Problem({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-problem-heading`
  return (
    <PageSection flush {...slotProps(lp, 'problem')} aria-labelledby={headingId} width="prose">
      <div className="flex flex-col gap-3">
        <p className="font-text text-brand-body-strong text-brand-ink">Sound familiar?</p>
        <DisplayHeading level={2} id={headingId} size="h2">
          &quot;I&apos;ll Post Something Tomorrow.&quot;
        </DisplayHeading>
      </div>
      <div className="flex flex-col gap-5 font-text text-brand-body-lg leading-7 text-brand-ink">
        {PARAGRAPHS.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </PageSection>
  )
}
