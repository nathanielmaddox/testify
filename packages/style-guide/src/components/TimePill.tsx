'use client'

import { Button } from '@otesse/design-system'
import type { ReactNode } from 'react'
import { cx } from './cx'

export interface TimePillProps {
  /** The slot time, for example "10:30 am". */
  children: ReactNode
  /** The chosen slot: ink fill, white label. */
  selected?: boolean
  /** Taken or past slot: sunken fill, struck-through label. */
  disabled?: boolean
  onSelect?: () => void
  className?: string
}

/** Paper H06-0 time slot: 40px tall, full column width, pill, 1px border-strong, 14px/20 500. */
const BASE =
  'h-10 w-full px-4 text-sm font-medium font-text text-brand-ink bg-brand-surface border border-brand-border-strong'

const HOVER = 'enabled:hover:border-brand-ink'

const SELECTED = 'bg-brand-ink border-brand-ink text-brand-inverse-ink enabled:hover:bg-brand-ink'

const DISABLED =
  'disabled:opacity-100 disabled:bg-brand-surface-sunken disabled:border-brand-border disabled:text-brand-ink-subtle disabled:line-through disabled:cursor-not-allowed'

/**
 * One selectable time slot in the booking time column, built on the DS Button.
 * `aria-pressed` carries the selected state.
 */
export function TimePill({
  children,
  selected = false,
  disabled = false,
  onSelect,
  className,
}: TimePillProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="md"
      radius="full"
      motion="none"
      data-brand-ring=""
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect?.()}
      styleOverrides={{ focusRingWidth: '2px', focusRingOffset: '2px' }}
      className={cx(BASE, !disabled && HOVER, selected && SELECTED, DISABLED, className)}
    >
      {children}
    </Button>
  )
}
