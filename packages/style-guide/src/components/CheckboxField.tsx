'use client'

import { Checkbox, type CheckboxProps } from '@otesse/design-system'
import { forwardRef, type ReactNode } from 'react'
import { FieldMessages, describedByFor, useFieldIds } from './field-parts'

export interface CheckboxFieldProps extends Omit<
  CheckboxProps,
  'label' | 'error' | 'helperText' | 'className' | 'classNames' | 'styles' | 'styleOverrides' | 'id'
> {
  /** The sentence beside the box; the whole line is the click target. */
  label: ReactNode
  helperText?: ReactNode
  error?: string
  id?: string
  /** Layout class for the outer box. */
  className?: string
}

/** Unchecked outline: border-strong (3.64:1 on surface), danger-border when invalid. */
const BOX_REST = 'border-brand-border-strong'
const BOX_INVALID = 'border-brand-danger-border hover:border-brand-danger-border'

/**
 * Brand checkbox: DS Checkbox with a border-strong outline (the DS default is
 * the 1.28:1 decorative hairline), radius-xs corners, a 16px label and a 48px
 * tall click row. The box sits in a 48px control column so it centres on the
 * label's first line however many lines the label wraps to.
 */
export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  function CheckboxField({ label, helperText, error, id, className, ...props }, ref) {
    const ids = useFieldIds(id)
    const describedBy = describedByFor(ids, { error, helperText })
    return (
      <div className={`flex flex-col ${className ?? ''}`}>
        <Checkbox
          {...props}
          ref={ref}
          id={ids.fieldId}
          label={label}
          aria-invalid={error ? true : undefined}
          {...(describedBy ? { 'aria-describedby': describedBy } : {})}
          classNames={{
            root: 'gap-3',
            control: 'h-12',
            input: error ? BOX_INVALID : BOX_REST,
            label: 'block py-3 text-base',
          }}
          styleOverrides={{ borderRadius: 'var(--radius-xs)' }}
        />
        {/* Indent = 20px box + 12px gap, so messages align with the label text. */}
        <FieldMessages ids={ids} error={error} helperText={helperText} className="pl-8" />
      </div>
    )
  }
)
