import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

export interface PricingLineProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

/**
 * The caption under a CTA: price, terms, what happens next. 14px, ink-subtle
 * (>=4.5:1 on every light surface), tabular figures, centred under the CtaRow.
 */
export function PricingLine({ className, children, ...rest }: PricingLineProps) {
  return (
    <p
      className={cx(
        'max-w-measure-narrow text-center font-text text-brand-small tabular-nums text-brand-ink-subtle',
        className
      )}
      {...rest}
    >
      {children}
    </p>
  )
}
