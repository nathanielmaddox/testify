'use client'

/**
 * Progress rail for the get-started flow (About you, Your business, Your goals,
 * Book a time), drawn on the DS StepIndicator. Completed steps link back.
 */

import { useRouter } from 'next/navigation'
import { StepIndicator } from '@otesse/design-system'
import { BrandIcon } from '@testify/style-guide/components/BrandIcon'
import type { ComponentProps } from 'react'
import { GET_STARTED_STEP_LABELS, GET_STARTED_STEP_PATHS } from '@/lib/get_started'

type DsSteps = ComponentProps<typeof StepIndicator>['steps']

export interface FlowStepIndicatorProps {
  /** 1 to 4 while the visitor is on that step. 5 on the booked page (every step done). */
  current: 1 | 2 | 3 | 4 | 5
}

/**
 * The four-step progress rail (About you, Your business, Your goals, Book a
 * time) on the DS StepIndicator. Steps before the current one are completed
 * and clickable, so a visitor can go back without losing answers. On the
 * booked page every step shows done and none is clickable.
 */
export function FlowStepIndicator({ current }: FlowStepIndicatorProps) {
  const router = useRouter()
  const booked = current === 5
  const activeIndex = booked ? GET_STARTED_STEP_LABELS.length - 1 : current - 1

  const steps: DsSteps = GET_STARTED_STEP_LABELS.map((label) => ({ label }))

  const total = GET_STARTED_STEP_LABELS.length
  const compactLine = booked
    ? 'All steps done'
    : `Step ${activeIndex + 1} of ${total}: ${GET_STARTED_STEP_LABELS[activeIndex] ?? ''}`

  return (
    <>
      {/* Below sm the full rail is too narrow for four labels: one plain line says where the visitor is. */}
      <p className="font-text text-brand-small font-semibold text-brand-ink sm:hidden">
        {compactLine}
      </p>
      <div className="hidden w-full sm:block">
        <StepIndicator
          steps={steps}
          currentStep={activeIndex}
          clickable={!booked}
          showNumbers
          ariaLabel="Get started progress"
          onStepClick={(index) => {
            const path = GET_STARTED_STEP_PATHS[index]
            if (index < activeIndex && path) router.push(path)
          }}
          className="w-full justify-center"
          {...(booked ? { renderCircle: allDoneCircle } : {})}
        />
      </div>
    </>
  )
}

/** Every step done: the check circle, in the done colors (Paper booked frame). */
function allDoneCircle() {
  return (
    <span className="flex size-8 items-center justify-center rounded-full bg-brand-done-bg text-brand-done-fg">
      <BrandIcon name="Check" />
    </span>
  )
}
