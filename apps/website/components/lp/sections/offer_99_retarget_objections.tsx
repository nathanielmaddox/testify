/**
 * Retargeting objections (Paper frame "Section - Catches", registry section
 * `objections`): six "yes, but" questions, each answered in one card, and the
 * note on what the plan does not cover. Server component, no DS import.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const CATCHES = [
  {
    question: '"Do I still post it?"',
    answer: 'Yes. About a minute each. Caption written, file ready, day set.',
  },
  {
    question: '"How much of my time?"',
    answer: 'About 5 minutes a week to answer, plus posting. The rest is ours.',
  },
  {
    question: '"Is there a contract?"',
    answer: 'No. Cancel in your portal in 2 clicks, any month.',
  },
  {
    question: '"Do you need my passwords?"',
    answer: 'No. Never. Nothing goes out unless you post it.',
  },
  {
    question: '"Do I have to be on camera?"',
    answer: 'No. Posts are made from your job photos, your work, or graphics.',
  },
  {
    question: '"Will it sound like me?"',
    answer: "It's made from your answers. Want a change? We redo it, as many times as you like.",
  },
] as const

export function Offer99RetargetObjections({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-objections-heading`
  return (
    <PageSection flush {...slotProps(lp, 'objections')} aria-labelledby={headingId} width="grid">
      <DisplayHeading
        level={2}
        id={headingId}
        size="h2"
        kicker={'Every "yes, but…", answered.'}
        lead="So nothing surprises you after you sign up."
      >
        Every Catch, Answered Upfront
      </DisplayHeading>
      <ul className="grid gap-brand-grid md:grid-cols-2 lg:grid-cols-3">
        {CATCHES.map((item) => (
          <li key={item.question} className="grid">
            <div className="flex flex-col items-start gap-4 rounded-card bg-brand-surface p-brand-card shadow-raised">
              <h3 className="font-display text-brand-h4 text-brand-ink">{item.question}</h3>
              <p className="max-w-measure font-text text-brand-body text-brand-ink-muted">
                {item.answer}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="font-text text-brand-small text-brand-ink-muted">
        Not in this plan: posting to your accounts, answering comments and messages, paid ads. Want
        those? That&apos;s our full service.
      </p>
    </PageSection>
  )
}
