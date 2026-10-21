'use client'

import { Button, type ButtonProps } from '@otesse/design-system'
import { forwardRef } from 'react'

export type ActionTone = 'action' | 'quiet'

export interface ActionButtonProps extends Omit<
  ButtonProps,
  | 'variant'
  | 'size'
  | 'radius'
  | 'motion'
  | 'iconOnly'
  | 'className'
  | 'classNames'
  | 'styles'
  | 'styleOverrides'
  | 'style'
> {
  /**
   * `action` = the violet fill (hero, closing CTA and the one pay button on
   * /start, principle 1). `quiet` = the ink pill for everything else. Default `quiet`.
   */
  tone?: ActionTone
  /**
   * Why the button is disabled, in plain words. Shown beside the button in
   * small ink-muted and given to the DS as the accessible description. Required
   * in spirit whenever `disabled` is set: nothing silent.
   */
  disabledReason?: string
}

/** Pill, 48px, 16px/600 label, 24px sides. Plain Tailwind keys (see field-parts on tailwind-merge). */
const BASE =
  'h-12 px-6 text-base font-semibold ease-brand-enter focus:ring-0 focus:ring-offset-0 motion-safe:enabled:hover:-translate-y-0.5 enabled:active:translate-y-0'

const TONE: Record<ActionTone, string> = {
  action:
    'bg-brand-action text-brand-action-ink enabled:hover:bg-brand-action-hover enabled:hover:shadow-cta enabled:active:bg-brand-action-pressed enabled:active:shadow-none',
  quiet:
    'bg-brand-action-quiet text-brand-action-quiet-ink enabled:hover:bg-brand-action-quiet enabled:active:bg-brand-action-quiet',
}

/** Disabled: ink-disabled label on surface-sunken, full opacity (not the DS 50% wash). */
const DISABLED =
  'disabled:opacity-100 disabled:bg-brand-surface-sunken disabled:text-brand-ink-disabled'

/** Loading keeps its tone colours; the DS spinner and aria-busy say "working". */
const LOADING = 'disabled:opacity-100 disabled:cursor-wait'

/**
 * Brand button built on DS Button props: `radius="full"` (pill), `motion="none"`
 * (no press scale; pressed = no lift), the brand focus ring (2px, 3px offset
 * on the page ground) through `styleOverrides`, and the tone colours through
 * `className`. Use for in-page actions and form submits; navigation CTAs stay
 * on CtaRow (DS Link variant="button").
 */
export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(function ActionButton(
  { tone = 'quiet', disabled = false, disabledReason, loading = false, type = 'button', ...props },
  ref
) {
  const showReason = disabled && !loading && Boolean(disabledReason)
  const button = (
    <Button
      {...props}
      ref={ref}
      type={type}
      variant="primary"
      size="xl"
      radius="full"
      motion="none"
      data-brand-ring=""
      disabled={disabled}
      loading={loading}
      {...(disabledReason ? { disabledReason } : {})}
      styleOverrides={{ focusRingWidth: '2px', focusRingOffset: '3px' }}
      className={[BASE, TONE[tone], loading ? LOADING : disabled ? DISABLED : '']
        .filter(Boolean)
        .join(' ')}
    />
  )
  if (!showReason) return button
  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      {button}
      {/* aria-hidden: the DS already exposes the reason as the button's description. */}
      <span aria-hidden="true" className="font-text text-brand-small text-brand-ink-muted">
        {disabledReason}
      </span>
    </span>
  )
})

export type SubmitButtonProps = Omit<ActionButtonProps, 'type'>

/**
 * Form submit: an ActionButton with `type="submit"`. Keep it enabled and let
 * submit show the ErrorSummary and field messages; never grey it out while the
 * form is incomplete.
 */
export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  function SubmitButton(props, ref) {
    return <ActionButton {...props} ref={ref} type="submit" />
  }
)
