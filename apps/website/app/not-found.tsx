import type { Metadata } from 'next'
import { NotFoundPanel } from '@/components/site/not_found_panel'
import { SiteFooter } from '@/components/site/site_footer'
import { SiteHeader } from '@/components/site/site_header'

/**
 * No canonical (a 404 has no canonical URL; null clears the root layout's).
 * No explicit robots: Next adds `noindex` to not-found responses itself.
 */
export const metadata: Metadata = {
  title: 'Page not found',
  alternates: { canonical: null },
}

/** Root 404. It renders outside the route groups, so it draws the site chrome itself. */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <NotFoundPanel />
      </main>
      <SiteFooter />
    </>
  )
}
