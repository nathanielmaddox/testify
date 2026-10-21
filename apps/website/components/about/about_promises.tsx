// About promises: the dark "What you can hold us to" panel, five promises in a 3+2 grid, then the On-Time Promise.
import { EmphasisPanel } from '@testify/style-guide/components/EmphasisPanel'
import { PageSection } from '@testify/style-guide/components/PageSection'

const PROMISES = [
  { n: '01', text: 'Nothing goes live without your OK. Every post, every reply.' },
  {
    n: '02',
    text: 'Your accounts and files stay yours. You keep the logins. If you leave, it all stays with you.',
  },
  { n: '03', text: 'No contracts. Stay because it works. Leave any month.' },
  {
    n: '04',
    text: 'You never have to be on camera. Hands, tools, the finished job or just your voice.',
  },
  { n: '05', text: 'When you message us, a named person answers within one business day.' },
]

// Paper sets the promises as two rows: three across, then two across.
const PROMISE_ROWS = [PROMISES.slice(0, 3), PROMISES.slice(3)]

const ON_TIME = [
  'Your first posts are ready for your OK by day [N].',
  'If a planned post misses its day, you hear it from us first. Then [REMEDY].',
  'Flag anything and we redo it within [N] business days.',
  "Each month, a one-page summary: what went out, what ran late, what's next.",
]

export function AboutPromises() {
  return (
    <PageSection as="div" flush width="grid" className="pt-brand-section-gap">
      <EmphasisPanel
        id="promises-heading"
        kicker="Our promises"
        title="What you can hold us to."
        bodyWidth="full"
      >
        <div className="flex w-full flex-col gap-4">
          {PROMISE_ROWS.map((row, rowIndex) => (
            <ul key={rowIndex} className="flex w-full flex-col gap-6 lg:flex-row lg:gap-8">
              {row.map((promise) => (
                <li
                  key={promise.n}
                  className="flex min-w-0 flex-1 gap-5 border-t border-current pt-6"
                >
                  <span className="w-7 shrink-0 font-text text-brand-small tabular-nums text-brand-inverse-ink-muted">
                    {promise.n}
                  </span>
                  <span className="font-text text-brand-body-strong text-brand-inverse-ink">
                    {promise.text}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
        <div className="flex w-full flex-col gap-4 border-t border-current pt-8">
          <h3 className="max-w-measure-narrow font-display text-brand-h4 text-brand-inverse-ink">
            The On-Time Promise.
          </h3>
          <p className="max-w-measure-narrow font-text text-brand-body text-brand-inverse-ink-muted">
            We promise dates we can keep. We never promise views, leads or sales.
          </p>
          {ON_TIME.map((line) => (
            <p
              key={line}
              className="max-w-measure-narrow font-text text-brand-body text-brand-inverse-ink"
            >
              {line}
            </p>
          ))}
        </div>
      </EmphasisPanel>
    </PageSection>
  )
}
