'use client'

import { FooterBand, FooterBottomRow } from './footer_parts'

/**
 * Focused footer for the paid funnel: only the shared bottom row (copyright +
 * legal links), in the same band and container as the site footer, so the
 * two bottom rows line up exactly. No site nav: paid visitors are not sent away.
 */
export function LpFooter() {
  return (
    <FooterBand>
      <FooterBottomRow />
    </FooterBand>
  )
}
