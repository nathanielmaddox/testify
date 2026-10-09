'use client'

import NextLink from 'next/link'
import {
  Accordion,
  Button,
  Card,
  Checkbox,
  InlineAlert,
  Input,
  Link,
  RadioGroup,
  Select,
  Skeleton,
  Spinner,
  Stepper,
  Textarea,
  type AccordionItem,
  type SelectOption,
  type StepItem,
} from '@otesse/design-system'
import type { ReactNode } from 'react'

/**
 * /design specimen, part 2: DS primitives rendered with NO className or style
 * overrides, so what shows is exactly what the brand tokens produce. All copy is
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

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-brand-h4 text-brand-ink">{title}</h3>
      {children}
    </div>
  )
}

export function DsSpecimen() {
  return (
    <div className="flex flex-col gap-12">
      <Group title="Link variant=button">
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
          <Link href="/design" linkComponent={NextLink}>
            Inline text link
          </Link>
        </div>
      </Group>

      <Group title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="xl">
            Primary
          </Button>
          <Button variant="secondary" size="xl">
            Secondary
          </Button>
          <Button variant="outline" size="xl">
            Outline
          </Button>
          <Button variant="ghost" size="xl">
            Ghost
          </Button>
          <Button variant="destructive" size="xl">
            Destructive
          </Button>
          <Button
            variant="primary"
            size="xl"
            disabled
            disabledReason="Placeholder: add an email first"
          >
            Disabled
          </Button>
          <Button variant="primary" size="xl" loading loadingLabel="Saving">
            Loading
          </Button>
        </div>
        <p className="font-text text-brand-small text-brand-ink-subtle">
          The disabled button carries a reason (nothing silent). Loading keeps its label for screen
          readers.
        </p>
      </Group>

      <Group title="Form fields (helper, error)">
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Business email"
            type="email"
            placeholder="you@business.com"
            helperText="Placeholder helper: we only use this to send your topics."
          />
          <Input
            label="Business email"
            type="email"
            defaultValue="not-an-email"
            error="Placeholder error: enter an email like name@business.com"
          />
          <Textarea
            label="What does your business do?"
            placeholder="Placeholder"
            helperText="Placeholder helper: two or three sentences is plenty."
          />
          <Textarea
            label="What does your business do?"
            error="Placeholder error: tell us a little more (at least 20 characters)"
          />
          <Select
            label="Plan"
            options={PLAN_OPTIONS}
            placeholder="Choose a plan"
            helperText="Placeholder helper: you can change this later."
          />
          <Select
            label="Plan"
            options={PLAN_OPTIONS}
            placeholder="Choose a plan"
            error="Placeholder error: choose a plan to continue"
          />
        </div>
      </Group>

      <Group title="Checkbox and RadioGroup">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Checkbox label="Placeholder: send me a reminder" defaultChecked />
            <Checkbox label="Placeholder: unchecked" />
            <Checkbox label="Placeholder: with error" error="Placeholder error: tick to continue" />
            <Checkbox label="Placeholder: disabled" disabled disabledReason="Placeholder reason" />
          </div>
          <RadioGroup
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

      <Group title="Accordion variant=card">
        <Accordion items={FAQ_ITEMS} variant="card" defaultOpen={['faq-1']} headingLevel={4} />
      </Group>

      <Group title="Stepper">
        <Stepper steps={CHECKOUT_STEPS} currentStep={1} ariaLabel="Placeholder checkout steps" />
      </Group>

      <Group title="InlineAlert">
        <div className="flex flex-col gap-3">
          <InlineAlert
            variant="info"
            title="Placeholder info"
            description="Placeholder body copy."
          />
          <InlineAlert
            variant="success"
            title="Placeholder success"
            description="Placeholder body copy."
          />
          <InlineAlert
            variant="warning"
            title="Placeholder warning"
            description="Placeholder body copy."
          />
          <InlineAlert
            variant="error"
            title="Placeholder error"
            description="Placeholder body copy."
          />
        </div>
      </Group>

      <Group title="Card">
        <div className="grid gap-5 md:grid-cols-3">
          <Card variant="default" padding="lg" title="Default" description="Placeholder copy." />
          <Card variant="bordered" padding="lg" title="Bordered" description="Placeholder copy." />
          <Card variant="elevated" padding="lg" title="Elevated" description="Placeholder copy." />
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
