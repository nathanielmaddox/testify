/**
 * Retargeting objections (registry section `objections`): six "yes, but"
 * questions, each answered in one card, three per row from lg. Plain pre-line,
 * H2, no CTA. Server component, no DS import beyond the heading.
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
      <div className="flex flex-col gap-3">
        <p className="font-text text-brand-body-strong text-brand-ink">
          Every &quot;yes, but&hellip;&quot;, answered.
        </p>
        <DisplayHeading
          level={2}
          id={headingId}
          size="h2"
          lead="So nothing surprises you after you sign up."
        >
          Every Catch, Answered Upfront
        </DisplayHeading>
      </div>
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
    </PageSection>
  )
}
