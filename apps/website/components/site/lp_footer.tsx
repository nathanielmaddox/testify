'use client'

// Paid-funnel footer: the shared bottom row only, with no site nav.

import { FooterBand, FooterBottomRow } from './footer_parts'

/**
 * Focused footer for the paid funnel: only the shared bottom row (copyright +
 * legal links), in the same band and container as the site footer, so the
 * two bottom rows line up exactly. No site nav: paid visitors are not sent away.
 */
export function LpFooter() {
  return (
    <FooterBand>
      {/* Paper's legal-only footer has no band padding of its own; 40px top and bottom matches the site footer. */}
      <div className="py-10">
        <FooterBottomRow />
      </div>
    </FooterBand>
  )
}
