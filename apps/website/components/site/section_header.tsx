// Section opener used at the top of every section: kicker, H2 and sub line. Server-safe.

import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { Kicker } from '@testify/style-guide/components/Kicker'

/**
 * Section opener used at the top of every section: kicker pill, one H2, one
 * sub line. Server-safe (no DS import). Kicker to H2 is 16px, H2 to sub is
 * 16px; the 64px gap from the heading block to the section content belongs to
 * the caller. `size` picks the headline scale: `display-xl` is the Paper hero
 * scale (112px), `display` the brand display step, `h2` the default section
 * scale. `id` lands on the heading so a section can point `aria-labelledby` at it.
 */
export function SectionHeader({
  kicker,
  heading,
  sub,
  size = 'h2',
  align = 'left',
  id,
  level = 2,
}: {
  kicker?: string
  heading: string
  sub?: string
  size?: 'display-xl' | 'display' | 'h2'
  align?: 'left' | 'center'
  id?: string
  /** Heading level. Default 2; a page's hero opener passes 1 so the page has its h1. */
  level?: 1 | 2
}) {
  const centered = align === 'center'
  return (
    <div className={`flex flex-col gap-4 ${centered ? 'items-center text-center' : 'items-start'}`}>
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <DisplayHeading level={level} size={size} {...(id !== undefined ? { id } : {})}>
        {heading}
      </DisplayHeading>
      {sub ? (
        <p className="max-w-measure-narrow font-text text-brand-lead text-brand-ink-muted">{sub}</p>
      ) : null}
    </div>
  )
}
