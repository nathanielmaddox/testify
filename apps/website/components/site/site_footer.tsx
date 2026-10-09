'use client'

import { Footer, type FooterColumn } from '@otesse/design-system'
import { siteConfig } from '@/lib/site.config'

/**
 * Site footer shell: the DS Footer fed from lib/site.config.ts. No newsletter
 * or social links until they are real.
 */
export function SiteFooter() {
  const columns: FooterColumn[] = siteConfig.footer.map((column) => ({
    title: column.title,
    links: column.links,
  }))

  return (
    <Footer
      columns={columns}
      logo={siteConfig.name}
      tagline={siteConfig.description}
      copyright={`${siteConfig.name}. All rights reserved.`}
    />
  )
}
