import type { ReactNode } from 'react'
import { cx } from './cx'

export type AnnotationKind = 'circle' | 'underline' | 'arrow' | 'note'

export interface AnnotationProps {
  /** circle / underline wrap `children`; arrow and note stand alone. */
  kind: AnnotationKind
  /** The real text being marked (circle, underline). Stays in the accessibility tree. */
  children?: ReactNode
  /** Margin-note text (kind="note"). Decorative: it must repeat something the page already says. */
  note?: string
  /** Brand slot switch: false renders only `children`, no mark. Default true. */
  enabled?: boolean
  className?: string
}

/** Hand-drawn strokes. viewBoxes are stretched to the wrapped text (preserveAspectRatio none). */
const PATHS = {
  circle:
    'M104 7 C 44 3, 7 20, 8 41 C 9 63, 58 77, 110 75 C 160 73, 196 59, 193 37 C 190 15, 146 4, 86 11',
  underline: 'M3 11 C 48 4, 116 15, 197 6',
  arrowShaft: 'M6 52 C 22 26, 44 14, 70 15',
  arrowHead: 'M57 6 L 72 15 L 59 25',
} as const

const STROKE = {
  fill: 'none',
  stroke: 'var(--mark)',
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
} as const

/**
 * The human hand: the only ornament, used at most twice per page. Every mark is
 * aria-hidden and drawn in `mark` (decorative, never the sole carrier of
 * meaning). The page must read the same with `enabled={false}`.
 */
export function Annotation({ kind, children, note, enabled = true, className }: AnnotationProps) {
  if (!enabled) return children ? <>{children}</> : null

  if (kind === 'note') {
    return (
      <span
        aria-hidden="true"
        className={cx(
          'inline-block -rotate-2 font-hand text-brand-hand text-brand-ink-muted',
          className
        )}
      >
        {note}
      </span>
    )
  }

  if (kind === 'arrow') {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 80 60"
        className={cx('inline-block h-12 w-16', className)}
      >
        <path d={PATHS.arrowShaft} {...STROKE} />
        <path d={PATHS.arrowHead} {...STROKE} />
      </svg>
    )
  }

  const isCircle = kind === 'circle'
  return (
    <span className={cx('relative inline-block', className)}>
      {children}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={isCircle ? '0 0 200 80' : '0 0 200 16'}
        preserveAspectRatio="none"
        className={
          isCircle
            ? 'pointer-events-none absolute -inset-x-[0.35em] -inset-y-[0.3em] h-[calc(100%+0.6em)] w-[calc(100%+0.7em)] overflow-visible'
            : 'pointer-events-none absolute inset-x-0 -bottom-[0.25em] h-[0.4em] w-full overflow-visible'
        }
      >
        <path d={isCircle ? PATHS.circle : PATHS.underline} {...STROKE} />
      </svg>
    </span>
  )
}
