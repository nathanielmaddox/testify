'use client'

import { Link } from '@otesse/design-system'
import NextLink from 'next/link'
import type { ElementType, ReactNode } from 'react'
import { cx } from './cx'

export type CtaTone = 'action' | 'quiet'

export interface CtaRowProps {
  href: string
  /** Button label: sentence case, verb first. */
  label: string
  /**
   * `action` = the violet CTA (hero and closing CTA ONLY, principle 1).
   * `quiet` = the ink pill for every repeated mid-page CTA. Default `quiet`.
   */
  tone?: CtaTone
  /** Caption under the CTA, usually a PricingLine. */
  caption?: ReactNode
  /**
   * Element that renders the anchor. Default next/link (client navigation and
   * prefetch). Only client callers can pass one: a server page cannot hand a
   * component to a client component.
   */
  linkComponent?: ElementType
  className?: string
}

/**
 * Centred CTA row: one DS Link (variant="button", size="large") themed entirely
 * through tokens (--color-cta / --color-primary / --link-button-*), plus an
 * optional caption. No className reaches the DS Link.
 */
export function CtaRow({
  href,
  label,
  tone = 'quiet',
  caption,
  linkComponent = NextLink,
  className,
}: CtaRowProps) {
  return (
    <div className={cx('flex flex-col items-center gap-3 text-center', className)}>
      <Link
        href={href}
        variant="button"
        color={tone === 'action' ? 'cta' : 'primary'}
        size="large"
        linkComponent={linkComponent}
      >
        {label}
      </Link>
      {caption}
    </div>
  )
}
