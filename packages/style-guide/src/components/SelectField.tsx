'use client'

import { FormField, Select, type SelectProps } from '@otesse/design-system'
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

export type SelectFieldProps = FieldBaseProps &
  Omit<
    SelectProps,
    | 'label'
    | 'error'
    | 'helperText'
    | 'size'
    | 'className'
    | 'classNames'
    | 'styles'
    | 'partProps'
    | 'id'
    | 'required'
    | 'disabled'
    | 'multiple'
    | 'selectedValues'
    | 'defaultSelectedValues'
    | 'maxSelected'
    | 'onSelectedValuesChange'
  >

/**
 * Brand single select: DS FormField + DS Select (native <select>, so the
 * platform picker opens on phones). Same 48px / 16px / radius-md /
 * border-strong control as TextField; geometry goes through the DS
 * `classNames` / `styles` part props.
 */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, helperText, error, required = false, disabled = false, id, className, ...props },
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
        <Select
          {...props}
          ref={ref}
          id={ids.fieldId}
          size="lg"
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          {...(describedBy ? { 'aria-describedby': describedBy } : {})}
          classNames={{
            // DS Input and Textarea always render an empty 4px message row under
            // the control; the same 4px here keeps control-to-message spacing equal.
            control: 'mb-1',
            // pr-12 after the size: the DS `px-*` size class erases its own pr-10
            // in the merge, which would run long option text under the chevron.
            select: [
              CONTROL_SIZE,
              'py-0 pr-12',
              !disabled && CONTROL_FILL,
              error && CONTROL_INVALID,
            ]
              .filter(Boolean)
              .join(' '),
          }}
          styles={{ select: CONTROL_RADIUS }}
        />
        <FieldMessages ids={ids} error={error} helperText={helperText} />
      </div>
    </FormField>
  )
})
