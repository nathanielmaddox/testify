// Lead-form confirmation (Paper "lp/sample-ad/confirmation"). Paper only holds a placeholder here
// ("WHAT HAPPENS NEXT, ProcessSteps"), so the copy is [CONFIRM] until the owner writes it. The
// structure follows Paper: one headline block, then four process steps.
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { ProcessSteps, type ProcessStep } from '@testify/style-guide/components/ProcessSteps'

const STEPS: [ProcessStep, ProcessStep, ProcessStep, ProcessStep] = [
  { title: '[CONFIRM] Step 1', body: '[CONFIRM] Lead confirmation step copy.' },
  { title: '[CONFIRM] Step 2', body: '[CONFIRM] Lead confirmation step copy.' },
  { title: '[CONFIRM] Step 3', body: '[CONFIRM] Lead confirmation step copy.' },
  { title: '[CONFIRM] Step 4', body: '[CONFIRM] Lead confirmation step copy.' },
]

export function LeadConfirmation({ idPrefix }: { idPrefix: string }) {
  const heroId = `${idPrefix}-hero-heading`
  const nextId = `${idPrefix}-next-steps-heading`
  return (
    <>
      <PageSection
        id={`${idPrefix}-hero`}
        aria-labelledby={heroId}
        width="grid"
        flush
        className="pt-20 pb-12"
      >
        <DisplayHeading
          level={1}
          size="h2"
          id={heroId}
          lead="[CONFIRM] Lead confirmation lead line."
        >
          [CONFIRM] Lead confirmation headline
        </DisplayHeading>
      </PageSection>
      <PageSection
        id={`${idPrefix}-next-steps`}
        aria-labelledby={nextId}
        width="grid"
        flush
        className="pb-24"
      >
        <DisplayHeading level={2} size="h3" id={nextId}>
          What happens next
        </DisplayHeading>
        <ProcessSteps steps={STEPS} headingLevel={3} />
      </PageSection>
    </>
  )
}
