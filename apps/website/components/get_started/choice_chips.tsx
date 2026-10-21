'use client'

/**
 * Choice field for the get-started qualifier steps: a labelled group of
 * style-guide ChoiceChip with its helper or error line. Single choice is a
 * radio group (arrow keys move and select); multi choice is a checkbox group,
 * where picking the exclusive option clears the others and picking another
 * clears it.
 */

import { ChoiceChip, ChoiceChipGroup } from '@testify/style-guide/components/ChoiceChip'
import type { ChoiceOption } from '@/lib/get_started'

export interface ChoiceFieldProps {
  fieldKey: string
  label: string
  required: boolean
  mode: 'single' | 'multi'
  options: readonly ChoiceOption[]
  value: string | string[]
  onChange: (next: string | string[]) => void
  helper?: string
  error?: string
  /** Multi only: picking this option clears the others, and picking another clears it. */
  exclusiveValue?: string
}

/** A labelled chip group with its helper or error line, in the form field rhythm. */
export function ChoiceField({
  fieldKey,
  label,
  required,
  mode,
  options,
  value,
  onChange,
  helper,
  error,
  exclusiveValue,
}: ChoiceFieldProps) {
  const selectedValue = typeof value === 'string' ? value : ''
  const picked = Array.isArray(value) ? value : []
  const multiple = mode === 'multi'

  function isChosen(optionValue: string): boolean {
    return multiple ? picked.includes(optionValue) : selectedValue === optionValue
  }

  function toggle(optionValue: string, next: boolean) {
    if (!multiple) {
      onChange(optionValue)
      return
    }
    if (exclusiveValue !== undefined && optionValue === exclusiveValue) {
      onChange(next ? [exclusiveValue] : [])
      return
    }
    const withoutExclusive = picked.filter((item) => item !== exclusiveValue)
    onChange(
      next
        ? [...withoutExclusive, optionValue]
        : withoutExclusive.filter((item) => item !== optionValue)
    )
  }

  return (
    <ChoiceChipGroup
      name={`gs-${fieldKey}`}
      label={label}
      multiple={multiple}
      required={required}
      {...(helper && !error ? { description: helper } : {})}
      {...(error ? { error } : {})}
    >
      {options.map((option) => (
        <ChoiceChip
          key={option.value}
          multiple={multiple}
          selected={isChosen(option.value)}
          onToggle={(next) => toggle(option.value, next)}
        >
          {option.label}
        </ChoiceChip>
      ))}
    </ChoiceChipGroup>
  )
}
