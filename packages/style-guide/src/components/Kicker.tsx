import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

export interface KickerProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

/**
 * Pill label above a headline. The overline style is the only place uppercase is
 * allowed. Quiet by design: ink-muted on a white pill with a hairline.
 */
export function Kicker({ className, children, ...rest }: KickerProps) {
  return (
    <p
      className={cx(
        'inline-flex w-fit items-center rounded-pill border border-brand-border bg-brand-surface px-3 py-1',
        'font-text text-brand-overline uppercase text-brand-ink-muted',
        className
      )}
      {...rest}
    >
      {children}
    </p>
  )
}
