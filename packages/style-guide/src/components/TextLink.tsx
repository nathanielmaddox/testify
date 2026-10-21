'use client'

import { Link, type LinkProps } from '@otesse/design-system'
import NextLink from 'next/link'
import { forwardRef, type ElementType } from 'react'

export interface TextLinkProps extends Omit<
  LinkProps,
  | 'variant'
  | 'color'
  | 'size'
  | 'underline'
  | 'className'
  | 'classNames'
  | 'styles'
  | 'linkComponent'
> {
  /**
   * Element that renders the anchor. Default next/link. Only client callers can
   * pass one: a server page cannot hand a component to a client component.
   */
  linkComponent?: ElementType
  /** Use inside the EmphasisPanel: inverse ink instead of action-text. */
  inverse?: boolean
}

/**
 * Inline link inside running text: action-text (#6832c8, 6.52:1 on canvas, 7.29:1 on surface),
 * always underlined (1px, 4px offset), thickening to 2px on hover. Takes the
 * size and line height of the sentence around it and wraps like text (`inline`,
 * not the DS `inline-flex`). Built on DS Link props; the brand colours are new
 * keys, so nothing in the DS changes.
 */
export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(function TextLink(
  { linkComponent = NextLink, inverse = false, children, ...props },
  ref
) {
  return (
    <Link
      {...props}
      ref={ref}
      variant="default"
      color="primary"
      underline="always"
      linkComponent={linkComponent}
      className={[
        'inline decoration-1 underline-offset-4 hover:decoration-2',
        inverse
          ? 'text-brand-inverse-ink hover:text-brand-inverse-ink'
          : 'text-brand-action-text hover:text-brand-action-text',
      ].join(' ')}
      // The DS size scale sets 12-16px; an inline link inherits its sentence instead.
      styles={{ root: { fontSize: 'inherit', lineHeight: 'inherit' } }}
    >
      {children}
    </Link>
  )
})
