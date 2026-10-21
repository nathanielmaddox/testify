'use client'

/**
 * Footer for the get-started flow: the legal-only bottom row in the shared
 * footer band. No site navigation, so the flow keeps its one job.
 */

import { FooterBand, FooterBottomRow } from '@/components/site/footer_parts'

/**
 * Legal-only footer for the get-started flow: the shared bottom row (copyright
 * and legal links) in the same band as the site footer. No site nav.
 */
export function FlowFooter() {
  return (
    <FooterBand>
      <FooterBottomRow />
    </FooterBand>
  )
}
