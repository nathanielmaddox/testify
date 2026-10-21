import type { ReactNode } from 'react'
import { cx } from './cx'

export interface ProcessStep {
  title: string
  body: ReactNode
  /** Finished steps take the done fill on their number (done = finished work only). */
  done?: boolean
}

export interface ProcessStepsProps {
  /**
   * Three to six steps, in order. Four is the original layout and renders the
   * same as before; three uses three columns on lg, five and six use three.
   */
  steps:
    | readonly [ProcessStep, ProcessStep, ProcessStep]
    | readonly [ProcessStep, ProcessStep, ProcessStep, ProcessStep]
    | readonly [ProcessStep, ProcessStep, ProcessStep, ProcessStep, ProcessStep]
    | readonly [ProcessStep, ProcessStep, ProcessStep, ProcessStep, ProcessStep, ProcessStep]
  /** Heading level for step titles. Default 3. */
  headingLevel?: 3 | 4
  className?: string
}

/**
 * Three to six steps, in order. White cards lifted off the canvas (shadow-raised,
 * no border). Step numbers use the display face with tabular figures; a finished
 * step's number sits on done-bg with ink text and says "done" to screen readers.
 */
export function ProcessSteps({ steps, headingLevel = 3, className }: ProcessStepsProps) {
  const Heading = `h${headingLevel}` as const
  const list: readonly ProcessStep[] = steps
  const lgColumns = list.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
  return (
    <ol className={cx('grid gap-brand-grid md:grid-cols-2', lgColumns, className)}>
      {list.map((step, index) => (
        <li
          key={`${index}-${step.title}`}
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
