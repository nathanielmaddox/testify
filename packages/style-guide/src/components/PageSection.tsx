import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

export type PageSectionWidth = 'content' | 'grid' | 'form' | 'prose'
export type PageSectionTone = 'canvas' | 'canvas-alt'

export interface PageSectionProps extends HTMLAttributes<HTMLElement> {
  /** Element to render. Default `section`. */
  as?: 'section' | 'div' | 'header' | 'footer' | 'aside'
  /**
   * Inner width. `content` (880px) is the default for headings, text and 2-up;
   * `grid` (1200px) is for grids only (3-up cards, the calendar); `form` (480px)
   * for single-column forms; `prose` (65ch) for long text.
   */
  width?: PageSectionWidth
  /** Page ground. `canvas-alt` is a recessed band; use sparingly. */
  tone?: PageSectionTone
  /** Drop the fluid section padding (64 to 128px) when sections must sit flush. */
  flush?: boolean
  children: ReactNode
}

const WIDTH: Record<PageSectionWidth, string> = {
  content: 'max-w-content',
  grid: 'max-w-grid',
  form: 'max-w-form',
  prose: 'max-w-measure',
}

const TONE: Record<PageSectionTone, string> = {
  canvas: 'bg-brand-canvas',
  'canvas-alt': 'bg-brand-canvas-alt',
}

/**
 * Section rhythm + measure. Fluid vertical padding (--section-y), fluid side
 * gutter (--gutter), a centred inner column at one of the layout widths, and a
 * 48px stack gap between its children (headline block to content).
 */
export function PageSection({
  as: Tag = 'section',
  width = 'content',
  tone = 'canvas',
  flush = false,
  className,
  children,
  ...rest
}: PageSectionProps) {
  return (
    <Tag
      className={cx(TONE[tone], 'px-brand-gutter', !flush && 'py-brand-section', className)}
      {...rest}
    >
      <div className={cx('mx-auto flex w-full flex-col gap-12', WIDTH[width])}>{children}</div>
    </Tag>
  )
}
