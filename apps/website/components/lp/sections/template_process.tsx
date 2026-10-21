/**
 * Template LP process (registry section `process`, Paper "How it works
 * section"): the brand ProcessSteps. Paper names the component but gives no
 * steps, so three numbered placeholder steps stand in until the owner writes them.
 * Paper has only component annotations for this section, so the headline is a
 * placeholder too: [PROCESS HEADLINE].
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { ProcessSteps, type ProcessStep } from '@testify/style-guide/components/ProcessSteps'
import { slotProps, type LpSectionProps } from './section_props'

const STEPS: readonly [ProcessStep, ProcessStep, ProcessStep] = [
  { title: '[STEP 1 TITLE]', body: '[STEP 1 BODY]' },
  { title: '[STEP 2 TITLE]', body: '[STEP 2 BODY]' },
  { title: '[STEP 3 TITLE]', body: '[STEP 3 BODY]' },
]

export function TemplateProcess({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-process-heading`
  return (
    <PageSection flush {...slotProps(lp, 'process')} aria-labelledby={headingId} width="grid">
      <DisplayHeading level={2} id={headingId} size="h2">
        [PROCESS HEADLINE]
      </DisplayHeading>
      <ProcessSteps steps={STEPS} />
    </PageSection>
  )
}
