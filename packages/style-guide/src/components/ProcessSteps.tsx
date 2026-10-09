import type { ReactNode } from 'react'
import { cx } from './cx'

export interface ProcessStep {
  title: string
  body: ReactNode
  /** Finished steps take the done fill on their number (done = finished work only). */
  done?: boolean
}

export interface ProcessStepsProps {
  /** Exactly four steps. */
  steps: readonly [ProcessStep, ProcessStep, ProcessStep, ProcessStep]
  /** Heading level for step titles. Default 3. */
  headingLevel?: 3 | 4
  className?: string
}

/**
 * Four steps, in order. White cards lifted off the canvas (shadow-raised, no
 * border). Step numbers use the display face with tabular figures; a finished
 * step's number sits on done-bg with ink text and says "done" to screen readers.
 */
export function ProcessSteps({ steps, headingLevel = 3, className }: ProcessStepsProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <ol className={cx('grid gap-brand-grid sm:grid-cols-2 lg:grid-cols-4', className)}>
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="flex flex-col gap-4 rounded-card bg-brand-surface p-6 shadow-raised"
        >
          <span
            className={cx(
              'inline-flex size-11 items-center justify-center rounded-pill font-display text-brand-h4 tabular-nums',
              step.done
                ? 'bg-brand-done-bg text-brand-ink'
                : 'border border-brand-border-strong text-brand-ink'
            )}
          >
            {index + 1}
            {step.done ? <span className="sr-only"> (done)</span> : null}
          </span>
          <Heading className="font-display text-brand-h4 text-brand-ink">{step.title}</Heading>
          <div className="font-text text-brand-body text-brand-ink-muted">{step.body}</div>
        </li>
      ))}
    </ol>
  )
}
