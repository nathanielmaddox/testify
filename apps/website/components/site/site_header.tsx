'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { Link, Navbar, SkipLink, type NavbarItem } from '@otesse/design-system'
import { siteConfig } from '@/lib/site.config'

/**
 * Site header: DS SkipLink + DS Navbar (built-in mobile menu). Nav items
 * (Home, About, Contact) and the CTA (the paid landing page) are generated
 * from the routes registry in lib/site.config.ts. The wordmark is plain text
 * until the brand logo exists.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const items: NavbarItem[] = siteConfig.nav.map((link) => ({
    id: link.href,
    label: link.label,
    href: link.href,
  }))
  const cta = (
    <Link
      href={siteConfig.cta.href}
      linkComponent={NextLink}
      variant="button"
      color="primary"
      size="medium"
    >
      {siteConfig.cta.label}
    </Link>
  )

  return (
    <>
      <SkipLink targetId="main-content" />
      <Navbar
        variant="solid"
        ariaLabel="Primary"
        items={items}
        currentPath={pathname}
        logo={
          <Link href="/" linkComponent={NextLink} underline="never" color="inherit">
            {siteConfig.name}
          </Link>
        }
        actions={cta}
        mobileActions={cta}
      />
    </>
  )
}
