'use client'

import { Button } from '@otesse/design-system'
import {
  useLayoutEffect,
  useRef,
  type AriaAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cx } from './cx'

export interface BookingDayCellProps {
  /** Day of the month, shown with tabular figures. */
  day: number
  /** The chosen day: ink disc, white figure. */
  selected?: boolean | undefined
  /** Today: a 1px border-strong ring. `aria-current="date"` unless overridden. */
  today?: boolean | undefined
  /** Past or unavailable day. Not a choice; the figure stays readable. */
  disabled?: boolean | undefined
  onSelect?: (() => void) | undefined
  /** Accessible name, for example "Wednesday 14 October". Default: the day number. */
  label?: string | undefined
  /** Overrides the default `aria-current` (`"date"` on today). */
  'aria-current'?: AriaAttributes['aria-current'] | undefined
  className?: string | undefined
}

/** Paper H06-0 day cell: 40px circle, 14px/20 500 tabular figure. */
const BASE =
  'h-10 w-10 min-w-10 p-0 text-sm font-medium tabular-nums font-text text-brand-ink bg-transparent border border-transparent'

const HOVER = 'enabled:hover:border-brand-ink'

const TODAY = 'border-brand-border-strong'

const SELECTED = 'bg-brand-ink border-brand-ink text-brand-inverse-ink enabled:hover:bg-brand-ink'

/**
 * Past and unavailable days read as ink-subtle rather than Paper's border-strong
 * (#8D8579, 3.6:1 on white), which fails text contrast at 14px. Disabled stays
 * unclickable; the figure is still legible.
 */
const DISABLED = 'disabled:opacity-100 disabled:text-brand-ink-subtle disabled:cursor-not-allowed'

/**
 * One day in the booking calendar, built on the DS Button. Selection uses
 * `aria-pressed`; today marks itself with `aria-current="date"`. Inside a
 * BookingDayGrid the grid sets the tab stop; used alone, the cell is a normal button.
 */
export function BookingDayCell({
  day,
  selected = false,
  today = false,
  disabled = false,
  onSelect,
  label,
  'aria-current': ariaCurrent,
  className,
}: BookingDayCellProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="md"
      radius="full"
      motion="none"
      data-brand-ring=""
      data-booking-day=""
      aria-pressed={selected}
      aria-label={label}
      aria-current={ariaCurrent ?? (today ? 'date' : undefined)}
      disabled={disabled}
      onClick={() => onSelect?.()}
      styleOverrides={{ focusRingWidth: '2px', focusRingOffset: '2px' }}
      className={cx(
        BASE,
        !disabled && HOVER,
        today && !selected && TODAY,
        selected && SELECTED,
        DISABLED,
        className
      )}
    >
      {day}
    </Button>
  )
}

export interface BookingDayGridProps {
  /** Accessible name for the calendar, for example "Pick a day". */
  label: string
  /** BookingDayCell elements in calendar order, starting on the first weekday. */
  children: ReactNode
  className?: string | undefined
}

/**
 * Keyboard and tab behaviour for a month of BookingDayCell. Exactly one day is a
 * tab stop: the selected day, else today, else the first enabled day. Left and
 * right move by one day, up and down by one week (seven cells), Home and End go to
 * the first and last enabled day. Moving focus does not select; Enter or Space
 * does, as on any button. Disabled days are skipped in the direction of travel.
 */
export function BookingDayGrid({ label, children, className }: BookingDayGridProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Roving tabindex across the day buttons, applied after each render.
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const days = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-booking-day]'))
    const enabled = days.filter((day) => !day.disabled)
    const stop =
      enabled.find((day) => day.getAttribute('aria-pressed') === 'true') ??
      enabled.find((day) => day.getAttribute('aria-current') === 'date') ??
      enabled[0]
    for (const day of days) day.tabIndex = day === stop ? 0 : -1
  })

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const root = ref.current
    if (!root) return
    const days = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-booking-day]'))
    const at = days.indexOf(document.activeElement as HTMLButtonElement)
    if (at === -1) return
    let target: HTMLButtonElement | undefined
    if (event.key === 'Home') {
      target = days.find((day) => !day.disabled)
    } else if (event.key === 'End') {
      target = [...days].reverse().find((day) => !day.disabled)
    } else {
      const step = DAY_STEP[event.key]
      if (step === undefined) return
      // Walk in the direction of travel, skipping disabled days, until one is enabled.
      for (let i = at + step; i >= 0 && i < days.length; i += step) {
        const candidate = days[i]
        if (candidate && !candidate.disabled) {
          target = candidate
          break
        }
      }
    }
    if (!target) return
    event.preventDefault()
    target.focus()
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cx('grid grid-cols-7 gap-1', className)}
    >
      {children}
    </div>
  )
}

/** Arrow keys in a day grid: one day left or right, one week (seven cells) up or down. */
const DAY_STEP: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
}
