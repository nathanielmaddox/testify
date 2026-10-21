'use client'

import NextLink from 'next/link'
import {
  Accordion,
  Card,
  Link,
  Skeleton,
  Spinner,
  Stepper,
  type AccordionItem,
  type SelectOption,
  type StepItem,
} from '@otesse/design-system'
import {
  ActionButton,
  CheckboxField,
  Notice,
  RadioGroupField,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
  TextLink,
} from '@testify/style-guide/components'
import type { ReactNode } from 'react'

/**
 * /design specimen, part 2: DS primitives under the brand layer. Form controls,
 * buttons, inline links and alerts go through the @testify/style-guide wrappers
 * (the only place DS style props are set); everything else is the DS component
 * with no className or style, exactly as the tokens leave it. All copy is
 * PLACEHOLDER.
 */

const PLAN_OPTIONS: SelectOption[] = [
  { value: 'starter', label: 'Placeholder plan A' },
  { value: 'bigger', label: 'Placeholder plan B' },
]

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: 'faq-1',
    title: 'Placeholder question one?',
    content: 'Placeholder answer. Replace when the FAQ is written.',
  },
  {
    id: 'faq-2',
    title: 'Placeholder question two?',
    content: 'Placeholder answer. Replace when the FAQ is written.',
  },
  {
    id: 'faq-3',
    title: 'Placeholder question three (disabled)?',
    content: 'Placeholder answer.',
    disabled: true,
    disabledReason: 'Placeholder: shows the disabled state',
  },
]

const CHECKOUT_STEPS: StepItem[] = [
  { id: 'details', label: 'Your details' },
  { id: 'topics', label: 'Your topics' },
  { id: 'pay', label: 'Payment' },
  { id: 'done', label: 'Done' },
]

function Group({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-brand-h4 text-brand-ink">{title}</h3>
      {note ? (
        <p className="max-w-measure font-text text-brand-small text-brand-ink-subtle">{note}</p>
      ) : null}
      {children}
    </div>
  )
}

export function DsSpecimen() {
  return (
    <div className="flex flex-col gap-12">
      <Group
        title="Link variant=button (navigation CTAs)"
        note="Pills from the --link-button-* tokens. Violet is the hero and closing CTA only."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/design" linkComponent={NextLink} variant="button" color="cta" size="large">
            Action: hero and close only
          </Link>
          <Link
            href="/design"
            linkComponent={NextLink}
            variant="button"
            color="primary"
            size="large"
          >
            Quiet ink pill
          </Link>
          <Link
            href="/design"
            linkComponent={NextLink}
            variant="button"
            color="primary"
            size="medium"
          >
            Quiet, medium (nav)
          </Link>
          <Link
            href="/design"
            linkComponent={NextLink}
            variant="button"
            color="outline"
            size="medium"
          >
            Outline
          </Link>
          <Link href="/design" linkComponent={NextLink} variant="pill">
            Pill chip
          </Link>
        </div>
      </Group>

      <Group
        title="TextLink (inline, in running text)"
        note="action-text, always underlined, thicker on hover. Takes the size of its sentence."
      >
        <p className="max-w-measure font-text text-brand-body text-brand-ink-muted">
          Placeholder sentence with an <TextLink href="/design">inline text link</TextLink> in the
          middle, so the underline, colour and wrapping read in context.
        </p>
      </Group>

      <Group
        title="ActionButton and SubmitButton"
        note="DS Button through brand props: pill, 48px, 16px/600. A disabled button always says why, beside it."
      >
        <div className="flex flex-wrap items-center gap-3">
          <ActionButton tone="action">Action: the one pay button</ActionButton>
          <ActionButton>Quiet</ActionButton>
          <SubmitButton>Submit (quiet)</SubmitButton>
          <ActionButton loading loadingLabel="Saving">
            Loading
          </ActionButton>
        </div>
        <ActionButton disabled disabledReason="Placeholder: add an email first">
          Disabled
        </ActionButton>
      </Group>

      <Group title="Form fields (helper, error)" note="48px controls, 16px text, 14px messages.">
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            label="Business email"
            type="email"
            placeholder="you@business.com"
            helperText="Placeholder helper: we only use this to send your topics."
          />
          <TextField
            label="Business email"
            type="email"
            defaultValue="not-an-email"
            error="Placeholder error: enter an email like name@business.com"
          />
          <TextAreaField
            label="What does your business do?"
            placeholder="Placeholder"
            helperText="Placeholder helper: two or three sentences is plenty."
          />
          <TextAreaField
            label="What does your business do?"
            error="Placeholder error: tell us a little more (at least 20 characters)"
          />
          <SelectField
            label="Plan"
            options={PLAN_OPTIONS}
            placeholder="Choose a plan"
            helperText="Placeholder helper: you can change this later."
          />
          <SelectField
            label="Plan"
            options={PLAN_OPTIONS}
            placeholder="Choose a plan"
            error="Placeholder error: choose a plan to continue"
          />
          <TextField
            label="Business name"
            required
            helperText="Placeholder helper: required fields carry the mark."
          />
          <TextField
            label="Promo code"
            disabled
            helperText="Placeholder: codes open after launch."
          />
        </div>
      </Group>

      <Group
        title="CheckboxField and RadioGroupField"
        note="Unselected outlines are border-strong (3.64:1). Every row is 48px tall."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col">
            <CheckboxField label="Placeholder: send me a reminder" defaultChecked />
            <CheckboxField label="Placeholder: unchecked" />
            <CheckboxField
              label="Placeholder: with error"
              error="Placeholder error: tick to continue"
            />
            <CheckboxField
              label="Placeholder: disabled"
              disabled
              helperText="Placeholder reason: shown while this is unavailable."
            />
          </div>
          <RadioGroupField
            name="cadence"
            label="How often?"
            defaultValue="daily"
            helperText="Placeholder helper."
            options={[
              { value: 'daily', label: 'Placeholder: daily' },
              { value: 'weekly', label: 'Placeholder: weekly' },
              { value: 'never', label: 'Placeholder: disabled option', disabled: true },
            ]}
          />
        </div>
      </Group>

      <Group
        title="Accordion variant=card"
        note="Hairline card at elevation-0 (border, no shadow): --accordion-card-* tokens."
      >
        <Accordion items={FAQ_ITEMS} variant="card" defaultOpen={['faq-1']} headingLevel={4} />
      </Group>

      <Group title="Stepper">
        <Stepper steps={CHECKOUT_STEPS} currentStep={1} ariaLabel="Placeholder checkout steps" />
      </Group>

      <Group
        title="Notice (DS InlineAlert)"
        note="Fills are the -bg roles, edges the -border roles, text ink, icon the state -fg."
      >
        <div className="flex flex-col gap-3">
          <Notice tone="info" title="Placeholder info" description="Placeholder body copy." />
          <Notice tone="success" title="Placeholder success" description="Placeholder body copy." />
          <Notice tone="warning" title="Placeholder warning" description="Placeholder body copy." />
          <Notice tone="error" title="Placeholder error" description="Placeholder body copy." />
        </div>
      </Group>

      <Group
        title="Card"
        note="Only variant=bordered is used: border, no shadow. DS default and elevated pair the border with a shadow (and look alike), so the brand never uses them; lifted white surfaces are the brand compositions above (HonestyBlock, GuaranteeList, ProcessSteps)."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Card variant="bordered" padding="lg" title="Bordered" description="Placeholder copy." />
        </div>
      </Group>

      <Group title="Skeleton and Spinner">
        <div className="grid items-center gap-5 md:grid-cols-2">
          <Skeleton variant="text" />
          <Spinner label="Placeholder: loading" />
        </div>
      </Group>
    </div>
  )
}
