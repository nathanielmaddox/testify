// Layout for the (site) route group: header and footer around every public page.

import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site/site_footer'
import { SiteHeader } from '@/components/site/site_header'

/** Site chrome: full header (nav + CTA to /get-started via siteConfig.cta) and full footer (nav + legal). */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  )
}
