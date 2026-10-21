import type { ReactNode } from 'react'

export interface Guarantee {
  title: string
  body: ReactNode
}

export interface GuaranteeListProps {
  guarantees: readonly Guarantee[]
  /** Heading level for each guarantee title. Default 3. */
  headingLevel?: 3 | 4 | undefined
  /**
   * Columns: 2 (default) is one column at base and two from md. 3 adds three
   * columns from lg (one, then two, then three).
   */
  columns?: 2 | 3 | undefined
}

/**
 * Guarantees as a grid of brand surfaces (white, rounded-card, shadow-raised, no
 * border), matching ProcessSteps. Title and body share one left edge.
 *
 * No icon column: the words carry the meaning. Add an icon with BrandIcon if a
 * design needs one. DS-free, so server-safe.
 */
export function GuaranteeList({ guarantees, headingLevel = 3, columns = 2 }: GuaranteeListProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <ul
      className={
        columns === 3
          ? 'grid gap-brand-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : 'grid gap-brand-grid md:grid-cols-2'
      }
    >
      {guarantees.map((guarantee) => (
        <li key={guarantee.title} className="grid">
          <div className="flex flex-col items-start gap-2 rounded-card bg-brand-surface p-brand-card text-left shadow-raised">
            <Heading className="font-display text-brand-h4 text-brand-ink">
              {guarantee.title}
            </Heading>
            <div className="max-w-measure font-text text-brand-body text-brand-ink-muted">
              {guarantee.body}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
