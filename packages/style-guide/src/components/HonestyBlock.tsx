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
 * "What we do not do": a plain list of limits on the brand surface (white,
 * rounded-card, shadow-raised, no border), the same lifted card as every other
 * contained block. The DS Card stops at 12px corners and pairs border with
 * shadow, so it is not used here.
 *
 * Marker: a native list bullet in ink-subtle. The DS Icon cannot resolve a
 * lucide name without a registry at e7d37602 (see GuaranteeList), which left an
 * indent with nothing in it; a list marker is real, visible and announced as a
 * list. DS-free, so server-safe.
 */
export function HonestyBlock({ title, items, note, headingLevel = 3 }: HonestyBlockProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <div className="rounded-card bg-brand-surface p-brand-card shadow-raised">
      <div className="flex flex-col gap-5">
        <Heading className="font-display text-brand-h4 text-brand-ink">{title}</Heading>
        <ul className="flex list-disc flex-col gap-3 pl-5 marker:text-brand-ink-subtle">
          {items.map((item) => (
            <li key={item} className="max-w-measure font-text text-brand-body text-brand-ink-muted">
              {item}
            </li>
          ))}
        </ul>
        {note ? (
          <p className="max-w-measure-caption font-text text-brand-small text-brand-ink-subtle">
            {note}
          </p>
        ) : null}
      </div>
    </div>
  )
}
