'use client'

import { Card, Icon } from '@otesse/design-system'
import type { ReactNode } from 'react'

export interface HonestyBlockProps {
  /** Block headline, e.g. "What we do not do". */
  title: string
  /** Things the service does NOT do, in plain words. */
  items: readonly string[]
  /** Optional closing note (14px, ink-subtle). */
  note?: ReactNode
  /** Heading level for the title. Default 3. */
  headingLevel?: 2 | 3 | 4
}

/**
 * "What we do not do": a plain list of limits, inside a DS Card (bordered, no
 * shadow: never border + shadow on one element). DS Icon marks each line;
 * the icon is decorative, the sentence carries the meaning.
 */
export function HonestyBlock({ title, items, note, headingLevel = 3 }: HonestyBlockProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <Card variant="bordered" radius="xl" padding="lg">
      <div className="flex flex-col gap-5">
        <Heading className="font-display text-brand-h4 text-brand-ink">{title}</Heading>
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 font-text text-brand-body text-brand-ink-muted"
            >
              <span className="mt-0.5 text-brand-ink-subtle">
                <Icon lucide="Minus" decorative size="md" color="inherit" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {note ? <p className="font-text text-brand-small text-brand-ink-subtle">{note}</p> : null}
      </div>
    </Card>
  )
}
