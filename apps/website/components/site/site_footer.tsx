'use client'

import { Footer, type FooterColumn } from '@otesse/design-system'
import { siteConfig } from '@/lib/site.config'

/**
 * Site footer: the DS Footer with the site nav column and the legal links,
 * all generated from the routes registry in lib/site.config.ts. No tagline,
 * newsletter or social links until they are real.
 */
export function SiteFooter() {
  const columns: FooterColumn[] = [
    { title: 'Site', links: siteConfig.nav },
    { title: 'Legal', links: siteConfig.legal },
  ]

  return (
    <Footer
      columns={columns}
      logo={siteConfig.name}
      bottom={{
        links: siteConfig.legal,
        copyright: `${siteConfig.name}. All rights reserved.`,
      }}
    />
  )
}
