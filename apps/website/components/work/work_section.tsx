// Server-safe section wrapper for the work pages: a flush <section> built from the style-guide PageSection, named by a heading id (or an aria-label when the heading is inside a shared block without an id). Flush: the page's stack (`gap-brand-section-gap`) sets the gap between sections, so sections carry no vertical padding of their own.
import { PageSection, type PageSectionWidth } from '@testify/style-guide/components/PageSection'
import type { ReactNode } from 'react'

export interface WorkSectionProps {
  /** Section id, also the `data-slot` value. */
  id: string
  /** Slot name for analytics and tests. */
  slot: string
  /** Id of the heading that names this section. Prefer this. */
  labelledBy?: string
  /** Accessible name, only when no heading carries an id. */
  label?: string
  width?: PageSectionWidth
  children: ReactNode
}

export function WorkSection({
  id,
  slot,
  labelledBy,
  label,
  width = 'grid',
  children,
}: WorkSectionProps) {
  return (
    <PageSection
      as="section"
      id={id}
      data-slot={slot}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
      width={width}
      flush
    >
      {children}
    </PageSection>
  )
}
