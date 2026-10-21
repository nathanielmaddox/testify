'use client'

import { ValidationMessage } from '@otesse/design-system'
import { useId, type CSSProperties, type ReactNode } from 'react'

/**
 * Shared anatomy for the brand form fields (TextField, TextAreaField, SelectField,
 * CheckboxField, RadioGroupField). Internal: not exported from the package index.
 *
 * Why the fields render their own messages: every DS control prints helper and
 * error text at `text-tiny` (12px) with no state icon, and none of them expose a
 * slot class for it on Input / Textarea. Brand rules need 14px messages and an
 * error that carries an icon as well as colour, so the wrappers never pass
 * `helperText` / `error` to the DS control. They pass `aria-invalid` and
 * `aria-describedby` instead and render the message with DS `ValidationMessage`.
 */

export interface FieldBaseProps {
  /** Visible label. Required: placeholders are never a label. */
  label: string
  /** One line under the field that helps (14px, ink-muted). Hidden while an error shows. */
  helperText?: ReactNode | undefined
  /** Error message (words, not just colour). Shows with an icon in danger-fg. */
  error?: string | undefined
  required?: boolean | undefined
  /** Paper's "Optional" pill beside the label. Default off: existing callers render unchanged. */
  optional?: boolean | undefined
  disabled?: boolean | undefined
  /** Explicit id; generated when omitted. */
  id?: string | undefined
  /** Layout class for the field's outer box (grid placement, width). */
  className?: string | undefined
}

/** Joins id references for aria-describedby; undefined when there are none. */
export function joinIds(...ids: Array<string | undefined>): string | undefined {
  return ids.filter(Boolean).join(' ') || undefined
}

export interface FieldIds {
  fieldId: string
  helperId: string
  errorId: string
}

export function useFieldIds(id: string | undefined): FieldIds {
  const generated = useId()
  const fieldId = id ?? generated
  return { fieldId, helperId: `${fieldId}-helper`, errorId: `${fieldId}-error` }
}

/** `aria-describedby` for the control: the error when present, otherwise the helper. */
export function describedByFor(
  ids: FieldIds,
  { error, helperText }: { error?: string | undefined; helperText?: ReactNode }
): string | undefined {
  if (error) return ids.errorId
  if (helperText) return ids.helperId
  return undefined
}

/**
 * Control geometry shared by every text-like control (Input, Textarea trigger,
 * native Select): 48px tall, 16px text (no iOS focus zoom), 16px side padding,
 * white surface on the warm ground. Plain Tailwind keys only: the DS merges
 * classes with tailwind-merge, which reads any unknown `text-<name>` as a COLOUR,
 * so a brand font-size key here would silently delete the DS text colour.
 */
export const CONTROL_SIZE = 'h-12 px-4 text-base'
export const CONTROL_FILL = 'bg-brand-surface'

/**
 * Radius goes in as an inline style, not `rounded-control`: tailwind-merge does
 * not recognise `rounded-control` as a radius, so the DS `rounded-md` would stay
 * in the class list and the winner would depend on CSS emit order. The inline
 * value reads the same token (`--radius-md`, 14px).
 */
export const CONTROL_RADIUS: CSSProperties = { borderRadius: 'var(--radius-md)' }

/** Invalid outline: danger-border (4.25:1 on surface) on rest and hover; danger ring on focus. */
export const CONTROL_INVALID =
  'border-brand-danger-border hover:border-brand-danger-border focus:ring-brand-danger-fg'

/**
 * Paper's "Optional" pill: 11px uppercase, hairline border, ink-subtle text, pill
 * radius, 1px / 8px padding. Uses the brand overline size and tracking; the
 * weight drops to 400 to match Paper.
 */
export function OptionalPill() {
  return (
    <span className="inline-flex items-center rounded-pill border border-brand-border px-2 py-px font-text text-brand-overline font-normal uppercase text-brand-ink-subtle">
      Optional
    </span>
  )
}

/**
 * Label row for an optional field. Used instead of the DS FormField `label`
 * (a plain string, so the pill cannot sit inside it). Same association: the
 * label's htmlFor is the control id.
 */
export function FieldLabelRow({
  ids,
  label,
  required,
  disabled,
  error,
}: {
  ids: FieldIds
  label: string
  required?: boolean
  disabled?: boolean
  error?: string | undefined
}) {
  const tone = error
    ? 'text-brand-danger-fg'
    : disabled
      ? 'text-brand-ink-subtle'
      : 'text-brand-ink'
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor={ids.fieldId} className={`font-text text-sm font-medium ${tone}`}>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-brand-danger-fg">
            *
          </span>
        ) : null}
      </label>
      <OptionalPill />
    </div>
  )
}

/** Error then helper, under the control. */
export function FieldMessages({
  ids,
  error,
  helperText,
  className,
}: {
  ids: FieldIds
  error?: string | undefined
  helperText?: ReactNode
  className?: string
}) {
  if (error) {
    return (
      <ValidationMessage
        id={ids.errorId}
        message={error}
        variant="error"
        size="sm"
        // The DS paints the icon span ink; the child selector gives it danger-fg so
        // the icon and the words carry the same state colour.
        className={`mt-0 items-start text-brand-danger-fg [&>span:first-child]:mt-0.5 [&>span:first-child]:text-brand-danger-fg ${className ?? ''}`}
      />
    )
  }
  if (helperText) {
    return (
      <p
        id={ids.helperId}
        className={`font-text text-brand-small text-brand-ink-muted ${className ?? ''}`}
      >
        {helperText}
      </p>
    )
  }
  return null
}
