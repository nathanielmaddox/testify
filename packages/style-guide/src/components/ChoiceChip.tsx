'use client'

import { Button } from '@otesse/design-system'
import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { BrandIcon } from './BrandIcon'
import { FieldMessages, useFieldIds } from './field-parts'
import { cx } from './cx'

export interface ChoiceChipProps {
  children: ReactNode
  /** Chosen. Single choice: ink fill, no icon. Multiple choice: ink fill with a check. */
  selected?: boolean | undefined
  disabled?: boolean | undefined
  /** Checkbox semantics (role="checkbox") instead of radio (role="radio"). Default false. */
  multiple?: boolean | undefined
  /** Called with the next selected value. Single choice always receives true. */
  onToggle?: ((next: boolean) => void) | undefined
  className?: string | undefined
}

/** Paper H02-0: 44px tall, 20px sides, pill, 1px border, 16px/24 500 label. */
const BASE =
  'h-11 px-5 text-base font-medium font-text text-brand-ink border border-brand-border-strong bg-brand-surface'

/** Hover is a border change only; the label does not move. */
const HOVER = 'enabled:hover:border-brand-ink'

/** Selected: ink fill, inverse label. */
const SELECTED =
  'bg-brand-ink border-brand-ink text-brand-inverse-ink enabled:hover:bg-brand-ink enabled:hover:border-brand-ink'

/** Disabled: sunken fill, hairline border, ink-subtle label, full opacity (not the DS wash). */
const DISABLED =
  'disabled:opacity-100 disabled:bg-brand-surface-sunken disabled:border-brand-border disabled:text-brand-ink-subtle disabled:cursor-not-allowed'

/**
 * One selectable chip, built on the DS Button. Radio semantics by default
 * (`role="radio"` + `aria-checked`); `multiple` gives checkbox semantics and a
 * 16px check before the label when selected. Keep labels on one line: chips
 * wrap in ChoiceChipGroup, never truncate. The tab stop is set by ChoiceChipGroup
 * (single choice), so a chip has no tabIndex prop.
 */
export function ChoiceChip({
  children,
  selected = false,
  disabled = false,
  multiple = false,
  onToggle,
  className,
}: ChoiceChipProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="md"
      radius="full"
      motion="none"
      data-brand-ring=""
      role={multiple ? 'checkbox' : 'radio'}
      aria-checked={selected}
      disabled={disabled}
      iconLeft={multiple && selected ? <BrandIcon name="Check" size="xs" /> : undefined}
      onClick={() => onToggle?.(multiple ? !selected : true)}
      styleOverrides={{ focusRingWidth: '2px', focusRingOffset: '2px' }}
      className={cx(
        BASE,
        !disabled && HOVER,
        selected && SELECTED,
        DISABLED,
        multiple && selected ? 'pl-4' : null,
        className
      )}
    >
      {children}
    </Button>
  )
}

export interface ChoiceChipGroupProps {
  /** Visible group label. Required: the group is named by it. */
  label: string
  /** One line under the label that helps (14px, ink-muted). */
  description?: string | undefined
  /** Error message (words, with an icon). Shown under the chips. */
  error?: string | undefined
  /**
   * Shows the same required asterisk as the form field labels. Single choice also
   * sets `aria-required`; multiple choice gets visually hidden "(required)" text,
   * because a group role takes no aria-required. Default false.
   */
  required?: boolean | undefined
  /** Checkbox group (`role="group"`) instead of a radio group (`role="radiogroup"`). Default false. */
  multiple?: boolean | undefined
  /** Used as the id base for the label, description and error. Generated when omitted. */
  name?: string | undefined
  className?: string | undefined
  /** ChoiceChip elements, rendered directly inside the group. */
  children: ReactNode
}

/**
 * A row of ChoiceChip. Single choice is a radiogroup with a roving tabindex: after
 * each render the DOM gives tabIndex 0 to the checked enabled chip (the first
 * enabled chip when none is checked) and -1 to every other chip. Arrow keys move
 * focus and select the next enabled chip; Home and End select the first and last.
 * Multiple choice is a group of checkboxes, and every chip stays tabbable.
 * The error line uses the same field message as the form fields.
 */
export function ChoiceChipGroup({
  label,
  description,
  error,
  required = false,
  multiple = false,
  name,
  className,
  children,
}: ChoiceChipGroupProps) {
  const ids = useFieldIds(name)
  const groupRef = useRef<HTMLDivElement>(null)
  const labelId = `${ids.fieldId}-label`
  const describedBy =
    [error ? ids.errorId : undefined, description ? ids.helperId : undefined]
      .filter(Boolean)
      .join(' ') || undefined

  // Roving tabindex, set on the DOM after every render. React does not own tabIndex
  // here, so the two never fight. Chips are read by role, so this works for any
  // child wrapper that renders a [role="radio"] button.
  useLayoutEffect(() => {
    const group = groupRef.current
    if (multiple || !group) return
    const chips = Array.from(group.querySelectorAll<HTMLButtonElement>('[role="radio"]'))
    const enabled = chips.filter((chip) => !chip.disabled)
    const stop = enabled.find((chip) => chip.getAttribute('aria-checked') === 'true') ?? enabled[0]
    for (const chip of chips) chip.tabIndex = chip === stop ? 0 : -1
  })

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (multiple || !groupRef.current) return
    const chips = Array.from(
      groupRef.current.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)')
    )
    if (chips.length === 0) return
    let next: HTMLButtonElement | undefined
    if (event.key === 'Home') {
      next = chips[0]
    } else if (event.key === 'End') {
      next = chips[chips.length - 1]
    } else {
      const step = ARROW_STEP[event.key]
      const at = chips.indexOf(document.activeElement as HTMLButtonElement)
      if (!step || at === -1) return
      next = chips[(at + step + chips.length) % chips.length]
    }
    if (!next) return
    event.preventDefault()
    next.focus()
    next.click()
  }

  return (
    <div
      ref={groupRef}
      role={multiple ? 'group' : 'radiogroup'}
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      aria-required={!multiple && required ? true : undefined}
      onKeyDown={onKeyDown}
      className={cx('flex flex-col gap-3', className)}
    >
      <p id={labelId} className="font-text text-sm font-medium text-brand-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-brand-danger-fg">
            *
          </span>
        ) : null}
        {required && multiple ? <span className="sr-only"> (required)</span> : null}
      </p>
      {description ? (
        <p id={ids.helperId} className="font-text text-brand-small text-brand-ink-muted">
          {description}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">{children}</div>
      <FieldMessages ids={ids} error={error} />
    </div>
  )
}

const ARROW_STEP: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
}
