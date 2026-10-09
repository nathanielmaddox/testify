import type { ReactNode } from 'react'
import { cx } from './cx'

export interface EmphasisPanelProps {
  /** Panel headline. */
  title: ReactNode
  /** Heading level for the title. Default 2. */
  headingLevel?: 2 | 3
  /** Optional overline above the title. */
  kicker?: ReactNode
  /** Body copy (inverse-ink-muted, 48ch). */
  children?: ReactNode
  id?: string
  className?: string
}

/**
 * The one loud surface: the inverse gradient in a contained, radius-card block.
 * At most two per page, never full-bleed, no border + shadow. The CTA sits UNDER
 * it on the canvas (CtaRow), not inside it. Focus rings inside switch to
 * focus-inverse (white, >=7:1 on every gradient stop) by re-pointing --focus and
 * the DS --color-ring for this subtree.
 */
export function EmphasisPanel({
  title,
  headingLevel = 2,
  kicker,
  children,
  id,
  className,
}: EmphasisPanelProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <section
      aria-labelledby={id}
      className={cx(
        'flex flex-col items-start gap-6 rounded-card bg-brand-inverse p-brand-card',
        '[--color-ring:var(--focus-inverse-rgb)] [--focus:var(--focus-inverse)]',
        className
      )}
    >
      {kicker ? (
        <p className="font-text text-brand-overline uppercase text-brand-inverse-ink-muted">
          {kicker}
        </p>
      ) : null}
      <Heading
        id={id}
        className="max-w-measure-heading text-balance font-display text-brand-h2 text-brand-inverse-ink"
      >
        {title}
      </Heading>
      {children ? (
        <div className="flex max-w-measure-narrow flex-col gap-4 font-text text-brand-lead text-brand-inverse-ink-muted">
          {children}
        </div>
      ) : null}
    </section>
  )
}
