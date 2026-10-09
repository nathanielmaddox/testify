import type { ReactNode } from 'react'

export interface Guarantee {
  title: string
  body: ReactNode
}

export interface GuaranteeListProps {
  guarantees: readonly Guarantee[]
  /** Heading level for each guarantee title. Default 3. */
  headingLevel?: 3 | 4
}

/**
 * Guarantees as a grid of brand surfaces (white, rounded-card, shadow-raised, no
 * border), matching ProcessSteps. Title and body share one left edge.
 *
 * No icon column: DS `Icon` resolves `lucide="..."` names only through a
 * `registry` prop at e7d37602 and the brand layer cannot import lucide-react
 * (not a dependency here), so a named icon renders nothing and leaves an empty
 * indent. The words carry the meaning; add the check back once a registry exists.
 * DS-free, so server-safe.
 */
export function GuaranteeList({ guarantees, headingLevel = 3 }: GuaranteeListProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <ul className="grid gap-brand-grid md:grid-cols-2">
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
