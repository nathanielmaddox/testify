'use client'

/**
 * Header for the get-started flow: skip link, the wordmark and "Back to site".
 * No navigation items, so the flow keeps its one job.
 */

import NextLink from 'next/link'
import { Link, SkipLink } from '@otesse/design-system'
import { CHROME_BAR, CHROME_CONTAINER, Wordmark } from '@/components/site/chrome'
import { routes } from '@/lib/site.config'

/**
 * Focused header for the get-started flow: the wordmark (not a link) and one
 * way out, "Back to site". No nav items, so the flow keeps its one job. Same
 * container and bar height as the other chromes, so the name sits where it
 * sits everywhere else.
 */
export function FlowHeader() {
  return (
    <>
      <SkipLink targetId="main-content" />
      <header className="bg-brand-canvas">
        <div className={`${CHROME_CONTAINER} ${CHROME_BAR} justify-between`}>
          <Wordmark />
          <span className="text-brand-body-strong text-brand-ink">
            <Link
              href={routes.home.path}
              linkComponent={NextLink}
              color="inherit"
              underline="hover"
            >
              Back to site
            </Link>
          </span>
        </div>
      </header>
    </>
  )
}
