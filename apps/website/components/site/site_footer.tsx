'use client'

import { siteConfig } from '@/lib/site.config'
import { Wordmark } from './chrome'
import { FooterBand, FooterBottomRow, FooterLink } from './footer_parts'

/**
 * Site footer: the wordmark and the site nav column (in a "Footer" nav
 * landmark), then the shared bottom row (copyright + legal links, once).
 * Links come from the routes registry in lib/site.config.ts. No tagline,
 * newsletter or social links until they are real.
 */
export function SiteFooter() {
  return (
    <FooterBand>
      <div className="flex flex-col gap-8 py-12 sm:flex-row sm:justify-between">
        <Wordmark />
        <nav aria-label="Footer" className="flex flex-col gap-3">
          <h2 className="font-text text-brand-label text-brand-ink">Site</h2>
          <ul className="flex flex-col gap-3">
            {siteConfig.nav.map((link) => (
              <li key={link.href}>
                <FooterLink link={link} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-brand-border">
        <FooterBottomRow />
      </div>
    </FooterBand>
  )
}
