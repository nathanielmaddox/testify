'use client'

import { Card, Icon } from '@otesse/design-system'
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
 * Guarantees as a grid of DS Cards (bordered, no shadow). The check uses done-fg:
 * a guarantee is a promise about finished work. Icons are decorative.
 */
export function GuaranteeList({ guarantees, headingLevel = 3 }: GuaranteeListProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <ul className="grid gap-brand-grid md:grid-cols-2">
      {guarantees.map((guarantee) => (
        <li key={guarantee.title} className="grid">
          <Card variant="bordered" radius="xl" padding="lg">
            <div className="flex items-start gap-4">
              <span className="mt-1 text-brand-done-fg">
                <Icon lucide="Check" decorative size="lg" color="inherit" />
              </span>
              <div className="flex flex-col gap-2">
                <Heading className="font-display text-brand-h4 text-brand-ink">
                  {guarantee.title}
                </Heading>
                <div className="font-text text-brand-body text-brand-ink-muted">
                  {guarantee.body}
                </div>
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  )
}
