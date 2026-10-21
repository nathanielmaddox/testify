'use client'

import NextLink from 'next/link'
import { EmptyState, Link } from '@otesse/design-system'

/**
 * 404 body for @testify/admin: a DS EmptyState with one link back to the
 * dashboard. The copy is plain and final, not placeholder wording.
 */
export function NotFoundPanel() {
  return (
    <EmptyState
      variant="no-data"
      title="No page at this address"
      description="The link may be out of date. Start again from the dashboard."
    >
      <Link href="/" linkComponent={NextLink} variant="button" color="primary" size="medium">
        Go to the dashboard
      </Link>
    </EmptyState>
  )
}
