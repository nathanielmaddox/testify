'use client'

/**
 * Get started steps 1 to 3: one qualifier step rendered from its spec in
 * lib/get_started.ts. Owns the field state reads and writes, the error timing
 * and the focus move on a failed submit. Copy comes from the Paper frames.
 */

import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { SubmitButton } from '@testify/style-guide/components/ActionButton'
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { TextAreaField } from '@testify/style-guide/components/TextAreaField'
import { TextField } from '@testify/style-guide/components/TextField'
import {
  NONE_CHANNEL,
  firstIncompleteQualifierStep,
  getQualifierStep,
  validateQualifierStep,
  type FieldSpec,
  type GetStartedState,
  type StepValues,
} from '@/lib/get_started'
import { ChoiceField } from './choice_chips'
import { FlowBackButton } from './flow_actions'
import { FlowStepIndicator } from './step_indicator'
import { useGetStartedState } from './use_get_started_state'

/**
 * One qualifier step (1 About you, 2 Your business, 3 Your goals), rendered
 * from the step spec in lib/get_started.ts. Answers save to sessionStorage on
 * every change. Errors show after a field is left or after a submit attempt;
 * the primary button stays active, and a submit with errors moves focus to
 * the first invalid field. A visitor who skipped an earlier step is sent back
 * to the first incomplete one.
 */
export function QualifierStep({ step }: { step: 1 | 2 | 3 }) {
  const spec = getQualifierStep(step)
  const router = useRouter()
  const { state, update } = useGetStartedState()
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  const values: StepValues = state?.[spec.stateKey] ?? {}
  const errors = validateQualifierStep(spec, values)
  const shownError = (key: string): string | undefined =>
    submitted || touched[key] ? errors[key] : undefined
  const errorCount = Object.keys(errors).length

  useEffect(() => {
    if (!state) return
    const blocking = firstIncompleteQualifierStep(state)
    if (blocking && blocking.step < step) router.replace(blocking.path)
  }, [state, step, router])

  function setValue(key: string, next: string | string[]) {
    const nextValues: StepValues = { ...values, [key]: next }
    update(patchFor(spec.stateKey, nextValues))
  }

  function markTouched(key: string) {
    setTouched((previous) => (previous[key] ? previous : { ...previous, [key]: true }))
  }

  function focusField(key: string) {
    const root = document.querySelector<HTMLElement>(`[data-field-key="${key}"]`)
    root?.querySelector<HTMLElement>('input, textarea, button')?.focus()
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    const current = validateQualifierStep(spec, values)
    const first = spec.fields.find((field) => current[field.key])
    if (first) {
      focusField(first.key)
      return
    }
    router.push(spec.nextPath)
  }

  function renderField(field: FieldSpec) {
    const error = shownError(field.key)
    const raw = values[field.key]

    if (field.kind === 'choice' || field.kind === 'multi') {
      return (
        <ChoiceField
          key={field.key}
          fieldKey={field.key}
          label={field.label}
          required={field.required}
          mode={field.kind === 'multi' ? 'multi' : 'single'}
          options={field.options ?? []}
          value={
            field.kind === 'multi'
              ? Array.isArray(raw)
                ? raw
                : []
              : typeof raw === 'string'
                ? raw
                : ''
          }
          onChange={(next) => {
            markTouched(field.key)
            setValue(field.key, next)
          }}
          {...(field.helper ? { helper: field.helper } : {})}
          {...(error ? { error } : {})}
          {...(field.kind === 'multi' ? { exclusiveValue: NONE_CHANNEL } : {})}
        />
      )
    }

    const text = typeof raw === 'string' ? raw : ''

    if (field.kind === 'textarea') {
      return (
        <div key={field.key} data-field-key={field.key} className="flex flex-col gap-2">
          <TextAreaField
            id={`gs-${field.key}`}
            label={field.label}
            required={field.required}
            optional={!field.required}
            value={text}
            rows={4}
            onChange={(event) => setValue(field.key, event.target.value)}
            onBlur={() => markTouched(field.key)}
            aria-describedby={field.maxLength ? `gs-${field.key}-count` : undefined}
            {...(field.placeholder ? { placeholder: field.placeholder } : {})}
            {...(field.helper ? { helperText: field.helper } : {})}
            {...(error ? { error } : {})}
          />
          {field.maxLength ? (
            <p
              id={`gs-${field.key}-count`}
              className={`self-end font-text text-brand-small ${
                text.length > field.maxLength ? 'text-brand-danger-fg' : 'text-brand-ink-muted'
              }`}
            >
              {text.length} / {field.maxLength}
            </p>
          ) : null}
        </div>
      )
    }

    return (
      <div key={field.key} data-field-key={field.key}>
        <TextField
          id={`gs-${field.key}`}
          label={field.label}
          required={field.required}
          optional={!field.required}
          type={field.kind === 'email' ? 'email' : field.kind === 'tel' ? 'tel' : 'text'}
          value={text}
          onChange={(event) => setValue(field.key, event.target.value)}
          onBlur={() => markTouched(field.key)}
          {...(field.placeholder ? { placeholder: field.placeholder } : {})}
          {...(field.autoComplete ? { autoComplete: field.autoComplete } : {})}
          {...(field.helper && !field.group ? { helperText: field.helper } : {})}
          {...(error ? { error } : {})}
        />
      </div>
    )
  }

  /**
   * Renders the fields in order. Consecutive fields with one `group` share a row
   * from md up (stacked below), and the group's helper is shown once under the row.
   */
  function renderFields(fields: readonly FieldSpec[]): ReactNode[] {
    const nodes: ReactNode[] = []
    let index = 0
    while (index < fields.length) {
      const field = fields[index]
      if (!field) break
      if (!field.group) {
        nodes.push(renderField(field))
        index += 1
        continue
      }
      const members: FieldSpec[] = []
      while (index < fields.length && fields[index]?.group === field.group) {
        const member = fields[index]
        if (member) members.push(member)
        index += 1
      }
      const rowHelper = members.find((member) => member.helper)?.helper
      nodes.push(
        <div key={`group-${field.group}`} className="flex flex-col gap-2">
          <div className="grid gap-4 md:grid-cols-2">{members.map(renderField)}</div>
          {rowHelper ? (
            <p className="font-text text-brand-small text-brand-ink-muted">{rowHelper}</p>
          ) : null}
        </div>
      )
    }
    return nodes
  }

  const previousPath = spec.prevPath

  return (
    <div className="flex w-full flex-col items-center gap-12 px-brand-gutter py-16">
      <FlowStepIndicator current={step} />
      <form
        noValidate
        onSubmit={onSubmit}
        aria-labelledby="gs-step-title"
        className="flex w-full max-w-[560px] flex-col gap-8 rounded-[40px] bg-brand-surface p-6 shadow-md sm:p-14"
      >
        <DisplayHeading level={1} size="h2" lead={spec.lead} id="gs-step-title">
          {spec.title}
        </DisplayHeading>

        <div className="flex flex-col gap-6">{renderFields(spec.fields)}</div>

        <div className="flex flex-col gap-4">
          <p className="font-text text-brand-small text-brand-ink-muted">{spec.confirm}</p>
          <div className="flex flex-wrap items-center gap-3">
            {previousPath ? <FlowBackButton onClick={() => router.push(previousPath)} /> : null}
            <SubmitButton>{spec.submitLabel}</SubmitButton>
          </div>
          <p role="status" className="sr-only">
            {submitted && errorCount > 0
              ? 'Check the highlighted fields. Each one shows its error.'
              : ''}
          </p>
        </div>
      </form>
    </div>
  )
}

/** Patch for the top-level state key of one qualifier step. */
function patchFor(
  stateKey: 'aboutYou' | 'yourBusiness' | 'yourGoals',
  next: StepValues
): Partial<GetStartedState> {
  if (stateKey === 'aboutYou') return { aboutYou: next }
  if (stateKey === 'yourBusiness') return { yourBusiness: next }
  return { yourGoals: next }
}
