'use client'

import { SkipLink } from '@otesse/design-system'
import { CHROME_BAR, CHROME_CONTAINER, Wordmark } from './chrome'

/**
 * Focused header for the paid funnel (/lp, /lp/confirmation): a banner
 * landmark holding the name only, not a link, with no nav landmark, items or
 * CTA, so paid visitors are not sent away. Same container, bar height and
 * wordmark as SiteHeader, so the name sits at the same x and y in both chromes.
 */
export function LpHeader() {
  return (
    <>
      <SkipLink targetId="main-content" />
      <header className="bg-brand-canvas">
        <div className={`${CHROME_CONTAINER} ${CHROME_BAR}`}>
          <Wordmark />
        </div>
      </header>
    </>
  )
}
