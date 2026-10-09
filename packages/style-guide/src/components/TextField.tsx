'use client'

import { FormField, Input, type InputProps } from '@otesse/design-system'
import { forwardRef } from 'react'
import {
  CONTROL_FILL,
  CONTROL_INVALID,
  CONTROL_RADIUS,
  CONTROL_SIZE,
  FieldMessages,
  describedByFor,
  useFieldIds,
  type FieldBaseProps,
} from './field-parts'

export type TextFieldProps = FieldBaseProps &
  Omit<
    InputProps,
    | 'label'
    | 'error'
    | 'helperText'
    | 'size'
    | 'className'
    | 'style'
    | 'id'
    | 'required'
    | 'disabled'
    | 'icon'
    | 'prefix'
    | 'suffix'
    | 'showCharacterCount'
  >

/**
 * Brand text input: DS FormField (label, required mark, field context) around a
 * DS Input. 48px tall, 16px text, radius-md, border-strong outline (3.64:1 via
 * --color-input), 2px violet focus ring, white surface. Helper and error are
 * 14px and the error carries an icon (see field-parts).
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, helperText, error, required = false, disabled = false, id, className, ...inputProps },
  ref
) {
  const ids = useFieldIds(id)
  const describedBy = describedByFor(ids, { error, helperText })
  return (
    <FormField
      id={ids.fieldId}
      label={label}
      required={required}
      disabled={disabled}
      className={`gap-2 ${className ?? ''}`}
    >
      <div className="flex flex-col gap-2">
        <Input
          {...inputProps}
          ref={ref}
          id={ids.fieldId}
          size="lg"
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          {...(describedBy ? { 'aria-describedby': describedBy } : {})}
          className={[CONTROL_SIZE, !disabled && CONTROL_FILL, error && CONTROL_INVALID]
            .filter(Boolean)
            .join(' ')}
          style={CONTROL_RADIUS}
        />
        <FieldMessages ids={ids} error={error} helperText={helperText} />
      </div>
    </FormField>
  )
})
