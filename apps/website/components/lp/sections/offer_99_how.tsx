/**
 * Offer LP mechanism (registry section `mechanism`): plain pre-line, H2, sub,
 * the three steps on the brand ProcessSteps (each chip as a short muted line
 * at the end of its body), then the "After you sign up" list. No CTA. Server
 * component, no DS import.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { ProcessSteps } from '@testify/style-guide/components/ProcessSteps'
import { slotProps, type LpSectionProps } from './section_props'

const STEPS = [
  {
    title: 'You answer.',
    body: 'Every Monday we send three or four quick questions. "What job are you proudest of this week?" Reply by text or voice note. Send a couple of phone photos if you have them. No photos that week? We make graphics instead.',
    chip: 'Less than a customer call',
  },
  {
    title: 'We make it.',
    body: 'Seven posts, seven stories, every caption in your words, and the day each one goes out. It lands in your portal every [DAY] by [TIME].',
    chip: 'Our job',
  },
  {
    title: 'You press post.',
    body: 'Open the portal. Copy the caption. Download the file. Post. About a minute each.',
    chip: 'About a minute each',
  },
] as const

const AFTER_SIGNUP = [
  { label: 'Today:', text: 'tell us your trade and town, right after checkout. Two minutes.' },
  { label: 'Day 1 to 2:', text: 'your first questions arrive.' },
  { label: 'By day [N]:', text: 'your first week is in your portal.' },
  { label: 'Every [DAY] after:', text: 'a new week, on time.' },
] as const

/** A step body: the copy, then its chip as a short muted line. */
function stepBody(step: (typeof STEPS)[number]) {
  return (
    <>
      {step.body}
      <span className="mt-2 block text-brand-small">{step.chip}</span>
    </>
  )
}

export function Offer99How({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-mechanism-heading`
  const steps = [
    { title: STEPS[0].title, body: stepBody(STEPS[0]) },
    { title: STEPS[1].title, body: stepBody(STEPS[1]) },
    { title: STEPS[2].title, body: stepBody(STEPS[2]) },
  ] as const
  return (
    <PageSection flush {...slotProps(lp, 'mechanism')} aria-labelledby={headingId} width="grid">
      <div className="flex flex-col gap-3">
        <p className="font-text text-brand-body-strong text-brand-ink">
          We call it the Monday Coffee Questions.
        </p>
        <DisplayHeading level={2} id={headingId} size="h2" lead="Three steps. One of them is ours.">
          You Answer. We Make It. You Press Post.
        </DisplayHeading>
      </div>
      <ProcessSteps steps={steps} />
      <div className="flex flex-col gap-4">
        <p className="font-text text-brand-body-strong text-brand-ink">After you sign up</p>
        <ul className="flex flex-col gap-3 font-text text-brand-body-lg leading-7 text-brand-ink">
          {AFTER_SIGNUP.map((line) => (
            <li key={line.label}>
              <strong className="font-semibold">{line.label}</strong> {line.text}
            </li>
          ))}
        </ul>
      </div>
    </PageSection>
  )
}
