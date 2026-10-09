'use client'

import { RadioGroup, type RadioGroupProps } from '@otesse/design-system'
import { forwardRef, type ReactNode } from 'react'
import { FieldMessages, describedByFor, useFieldIds } from './field-parts'

export interface RadioGroupFieldProps extends Omit<
  RadioGroupProps,
  | 'label'
  | 'error'
  | 'helperText'
  | 'className'
  | 'classNames'
  | 'styles'
  | 'partProps'
  | 'radioProps'
  | 'size'
  | 'id'
> {
  /** Group question, e.g. "How often?". */
  label: string
  helperText?: ReactNode
  error?: string
  id?: string
  /** Layout class for the outer box. */
  className?: string
}

/**
 * Brand radio group: DS RadioGroup with border-strong rings on unselected
 * options (the DS default is the 1.28:1 hairline), the 14px/500 ink group
 * label, 16px option labels and 48px rows. Rows carry their own 12px top and
 * bottom padding, so the list needs no extra gap.
 */
export const RadioGroupField = forwardRef<HTMLDivElement, RadioGroupFieldProps>(
  function RadioGroupField({ label, helperText, error, id, className, ...props }, ref) {
    const ids = useFieldIds(id)
    const describedBy = describedByFor(ids, { error, helperText })
    return (
      <div className={`flex flex-col ${className ?? ''}`}>
        <RadioGroup
          {...props}
          ref={ref}
          id={ids.fieldId}
          label={label}
          aria-invalid={error ? true : undefined}
          {...(describedBy ? { 'aria-describedby': describedBy } : {})}
          classNames={{
            label: 'mb-0 text-sm font-medium text-foreground',
            list: 'gap-0',
            radio: error
              ? 'border-brand-danger-border hover:border-brand-danger-border'
              : 'border-brand-border-strong',
          }}
          radioProps={{
            classNames: {
              root: 'gap-3',
              control: 'h-12',
              label: 'block py-3 text-base',
            },
          }}
        />
        <FieldMessages ids={ids} error={error} helperText={helperText} className="pl-8" />
      </div>
    )
  }
)
