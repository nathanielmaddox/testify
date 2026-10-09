'use client'

import { Navbar, SkipLink } from '@otesse/design-system'
import { siteConfig } from '@/lib/site.config'

/**
 * Focused header for the paid funnel (/lp, /lp/confirmation): the name only,
 * not a link, with no nav items or CTA, so paid visitors are not sent away.
 */
export function LpHeader() {
  return (
    <>
      <SkipLink targetId="main-content" />
      <Navbar
        variant="solid"
        ariaLabel="Site"
        items={[]}
        showMobileToggle={false}
        logo={<span>{siteConfig.name}</span>}
      />
    </>
  )
}
