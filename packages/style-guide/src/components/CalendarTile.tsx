import type { CSSProperties } from 'react'
import { ordinal, type CalendarTileState } from './calendar-plan'
import { cx } from './cx'

export type { CalendarTileState } from './calendar-plan'

export interface CalendarTileProps {
  /** Day number (1-based), shown as an ordinal with tabular figures. */
  day: number
  state: CalendarTileState
  /** Plain-words label for the state ("Today", "Video 3 ready"). */
  label: string
  /** Position in the calendar; drives the fill stagger. Default 0. */
  index?: number
  className?: string
}

/** Tile frame (border) per state. The frame shows even before the fill lands. */
const FRAME: Record<CalendarTileState, string> = {
  past: 'border border-dashed border-brand-border-strong',
  today: 'border border-brand-ink',
  milestone: 'border-2 border-brand-ink',
  waiting: 'border border-dashed border-brand-border-strong',
  first: 'border border-brand-done-border',
  done: 'border border-brand-done-border',
}

/** Fill layer per state (null = no fill: the tile is an outline). */
const FILL: Record<CalendarTileState, string | null> = {
  past: null,
  today: 'bg-brand-ink',
  milestone: 'bg-brand-surface',
  waiting: null,
  first: 'bg-brand-done-bg-strong',
  done: 'bg-brand-done-bg',
}

/** Text colours per state. On done fills text is ink / ink-muted, never ink-subtle (4.09:1). */
const TEXT: Record<CalendarTileState, { day: string; label: string }> = {
  past: { day: 'text-brand-ink-subtle', label: 'text-brand-ink-subtle' },
  today: { day: 'text-brand-action-quiet-ink', label: 'text-brand-action-quiet-ink' },
  milestone: { day: 'text-brand-ink', label: 'text-brand-ink' },
  waiting: { day: 'text-brand-ink-muted', label: 'text-brand-ink-muted' },
  first: { day: 'text-brand-ink', label: 'text-brand-ink' },
  done: { day: 'text-brand-ink', label: 'text-brand-ink-muted' },
}

/**
 * One day of the 30-day calendar. Server-safe. The fill is a separate
 * aria-hidden layer so the text is always readable; ProgressCalendar animates
 * only that layer (pending -> filling) through its `group/calendar` data state.
 * Milestone is white + 2px ink border, never violet.
 */
export function CalendarTile({ day, state, label, index = 0, className }: CalendarTileProps) {
  const fill = FILL[state]
  const fillStyle: CSSProperties = {
    animationDelay: `calc(var(--calendar-fill-stagger) * ${index})`,
  }
  return (
    <li
      data-state={state}
      className={cx(
        'relative flex min-h-28 flex-col justify-between gap-2 rounded-tile p-3',
        FRAME[state],
        className
      )}
    >
      {fill ? (
        <span
          aria-hidden="true"
          data-tf-motion=""
          style={fillStyle}
          className={cx(
            'pointer-events-none absolute inset-0 rounded-[inherit]',
            'group-data-[fill=pending]/calendar:opacity-0',
            'group-data-[fill=filling]/calendar:animate-brand-tile-fill',
            fill
          )}
        />
      ) : null}
      <span className={cx('relative font-display text-brand-h4 tabular-nums', TEXT[state].day)}>
        {ordinal(day)}
      </span>
      <span className={cx('relative font-text text-brand-small', TEXT[state].label)}>{label}</span>
    </li>
  )
}
