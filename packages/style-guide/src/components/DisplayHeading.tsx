import type { ReactNode } from 'react'
import { Kicker } from './Kicker'
import { cx } from './cx'

export type DisplayHeadingLevel = 1 | 2 | 3 | 4
export type DisplayHeadingSize = 'display-xl' | 'display' | 'h1' | 'h2' | 'h3' | 'h4'

export interface DisplayHeadingProps {
  /** Semantic level (h1..h4). One h1 per page. */
  level: DisplayHeadingLevel
  /**
   * Visual size; defaults by level (1 = display, 2 = h2, 3 = h3, 4 = h4).
   * `display-xl` is the Paper hero and closing scale (hero H1 and closing H2 only).
   */
  size?: DisplayHeadingSize
  /** Optional pill label rendered above the headline. */
  kicker?: ReactNode
  /** The ONE sub-line under the headline (lead style, ink-muted, 48ch). */
  lead?: ReactNode
  id?: string
  className?: string
  children: ReactNode
}

const SIZE: Record<DisplayHeadingSize, string> = {
  'display-xl': 'text-brand-display-xl',
  display: 'text-brand-display',
  h1: 'text-brand-h1',
  h2: 'text-brand-h2',
  h3: 'text-brand-h3',
  h4: 'text-brand-h4',
}

const DEFAULT_SIZE: Record<DisplayHeadingLevel, DisplayHeadingSize> = {
  1: 'display',
  2: 'h2',
  3: 'h3',
  4: 'h4',
}

/**
 * Headline block: optional Kicker, the headline in the display face with tight
 * tracking (display sizes only) and a ~22ch measure, then one lead line.
 * Left-aligned by rule.
 */
export function DisplayHeading({
  level,
  size,
  kicker,
  lead,
  id,
  className,
  children,
}: DisplayHeadingProps) {
  const Tag = `h${level}` as const
  return (
    <div className={cx('flex flex-col items-start gap-6', className)}>
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <Tag
        id={id}
        className={cx(
          'max-w-measure-heading text-balance font-display text-brand-ink',
          SIZE[size ?? DEFAULT_SIZE[level]]
        )}
      >
        {children}
      </Tag>
      {lead ? (
        <p className="max-w-measure-narrow font-text text-brand-lead text-brand-ink-muted">
          {lead}
        </p>
      ) : null}
    </div>
  )
}
