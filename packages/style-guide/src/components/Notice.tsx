'use client'

import { InlineAlert, type InlineAlertProps } from '@otesse/design-system'
import { forwardRef } from 'react'

export type NoticeTone = 'info' | 'success' | 'warning' | 'error'

export interface NoticeProps extends Omit<
  InlineAlertProps,
  'variant' | 'className' | 'classNames' | 'styles'
> {
  tone?: NoticeTone
}

/**
 * Why this exists: the DS InlineAlert paints `bg-<state>/10` and
 * `border-<state>/30`, i.e. the state BASE colour at 10% alpha over whatever is
 * behind it. The base must stay the text-safe `-fg` value (field messages render
 * as `text-error`), and -fg at 10% over the warm canvas lands grey
 * (info: #dfe3e8 instead of #edf3fb). No token mapping fixes that: even the
 * `-border` values, which hit the `-bg` fills exactly on white, go grey on canvas.
 * So the fills are set to the `-bg` / `-border` roles directly through the DS
 * `classNames` slots. Text stays ink (AA on every -bg); the icon takes the -fg.
 */
const ROOT: Record<NoticeTone, string> = {
  info: 'bg-brand-info-bg border-brand-info-border',
  success: 'bg-brand-success-bg border-brand-success-border',
  warning: 'bg-brand-warning-bg border-brand-warning-border',
  error: 'bg-brand-danger-bg border-brand-danger-border',
}

const ICON: Record<NoticeTone, string> = {
  info: 'text-brand-info-fg',
  success: 'text-brand-success-fg',
  warning: 'text-brand-warning-fg',
  error: 'text-brand-danger-fg',
}

/** Brand inline alert: the DS InlineAlert with the -bg / -border / -fg state roles. */
export const Notice = forwardRef<HTMLDivElement, NoticeProps>(function Notice(
  { tone = 'info', ...props },
  ref
) {
  return (
    <InlineAlert
      {...props}
      ref={ref}
      variant={tone}
      classNames={{ root: ROOT[tone], icon: ICON[tone] }}
    />
  )
})
