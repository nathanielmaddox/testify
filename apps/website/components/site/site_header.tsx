'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { Link, Navbar, SkipLink, type NavbarItem } from '@otesse/design-system'
import { siteConfig } from '@/lib/site.config'

/**
 * Site header shell: DS SkipLink + DS Navbar. Nav items, wordmark and CTA all
 * come from lib/site.config.ts. Layout and look belong to the DS; this file
 * only wires data in.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const items: NavbarItem[] = siteConfig.nav.map((link) => ({
    id: link.href,
    label: link.label,
    href: link.href,
  }))

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
        actions={
          <Link
            href={siteConfig.cta.href}
            linkComponent={NextLink}
            variant="button"
            color="primary"
            size="medium"
          >
            {siteConfig.cta.label}
          </Link>
        }
      />
    </>
  )
}
