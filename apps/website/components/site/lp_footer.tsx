'use client'

import { Footer } from '@otesse/design-system'
import { siteConfig } from '@/lib/site.config'

/** Focused footer for the paid funnel: legal links and copyright only. */
export function LpFooter() {
  return (
    <Footer
      variant="minimal"
      bottom={{
        links: siteConfig.legal,
        copyright: `${siteConfig.name}. All rights reserved.`,
      }}
    />
  )
}
