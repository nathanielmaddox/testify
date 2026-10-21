'use client'

import { FormField, Textarea, type TextareaProps } from '@otesse/design-system'
import { forwardRef } from 'react'
import {
  CONTROL_FILL,
  CONTROL_INVALID,
  CONTROL_RADIUS,
  FieldLabelRow,
  FieldMessages,
  describedByFor,
  joinIds,
  useFieldIds,
  type FieldBaseProps,
} from './field-parts'

export type TextAreaFieldProps = FieldBaseProps &
  Omit<
    TextareaProps,
    | 'label'
    | 'error'
    | 'helperText'
    | 'className'
    | 'style'
    | 'id'
    | 'required'
    | 'disabled'
    | 'showCharacterCount'
  >

/**
 * Brand multi-line field: same anatomy as TextField (DS FormField + DS
 * Textarea). 16px text, 12px/16px padding, at least 128px tall (about four
 * lines), radius-md, border-strong outline, violet focus ring.
 */
export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField(
    {
      label,
      helperText,
      error,
      required = false,
      optional = false,
      disabled = false,
      id,
      className,
      'aria-describedby': callerDescribedBy,
      ...props
    },
    ref
  ) {
    const ids = useFieldIds(id)
    const describedBy = joinIds(callerDescribedBy, describedByFor(ids, { error, helperText }))
    return (
      <FormField
        id={ids.fieldId}
        {...(optional ? {} : { label })}
        required={required}
        disabled={disabled}
        className={`gap-2 ${className ?? ''}`}
      >
        <div className="flex flex-col gap-2">
          {optional ? (
            <FieldLabelRow
              ids={ids}
              label={label}
              required={required}
              disabled={disabled}
              error={error}
            />
          ) : null}
          <Textarea
            {...props}
            ref={ref}
            id={ids.fieldId}
            required={required}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            {...(describedBy ? { 'aria-describedby': describedBy } : {})}
            // min-h-32 replaces the DS 80px floor; text-base restores the 16px the
            // DS `text-body` class loses to tailwind-merge (it reads as a colour).
            className={[
              'min-h-32 px-4 py-3 text-base',
              !disabled && CONTROL_FILL,
              error && CONTROL_INVALID,
            ]
              .filter(Boolean)
              .join(' ')}
            style={CONTROL_RADIUS}
          />
          <FieldMessages ids={ids} error={error} helperText={helperText} />
        </div>
      </FormField>
    )
  }
)
