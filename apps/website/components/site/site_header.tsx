'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Button,
  Link,
  MobileMenu,
  Navbar,
  SkipLink,
  type MobileMenuItem,
  type NavbarItem,
} from '@otesse/design-system'
import { BrandIcon } from '@testify/style-guide/components'
import { useAttributedHref } from '@/components/lp/use_attributed_href'
import { siteConfig } from '@/lib/site.config'
import { CHROME_CONTAINER, Wordmark } from './chrome'
import { usePrefersReducedMotion, useScrolled } from './chrome_hooks'

/**
 * Site header: DS SkipLink, then a sticky banner landmark (<header>) holding
 * the DS Navbar (its own "Primary" nav landmark). Flat at rest; it takes the
 * elevation-2 shadow (shadow-lifted) only once the page has scrolled.
 *
 * Below md the Navbar's in-flow panel (which pushes the page down) is never
 * opened: the toggle opens the DS MobileMenu instead, an overlay sheet from the
 * right with a dimmed backdrop, focus trap, Esc / backdrop close, body scroll
 * lock and focus returned to the toggle on close.
 *
 * Nav items (Home, About, Contact) and the CTA (the paid landing page) come
 * from the routes registry in lib/site.config.ts. The wordmark is plain text
 * until the brand logo exists.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const scrolled = useScrolled()
  const reducedMotion = usePrefersReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  // The CTA goes to /lp: carry the visitor's stored UTM / click ids (after mount).
  const ctaHref = useAttributedHref(siteConfig.cta.href)

  const items: NavbarItem[] = siteConfig.nav.map((link) => ({
    id: link.href,
    label: link.label,
    href: link.href,
  }))
  const menuItems: MobileMenuItem[] = siteConfig.nav.map((link) => ({
    id: link.href,
    label: link.label,
    href: link.href,
  }))

  const cta = (
    <Link href={ctaHref} linkComponent={NextLink} variant="button" color="primary" size="medium">
      {siteConfig.cta.label}
    </Link>
  )

  const menuToggle = (
    <Button
      type="button"
      variant="ghost"
      radius="full"
      size="md"
      iconLeft={<BrandIcon name="Menu" />}
      aria-haspopup="dialog"
      aria-expanded={menuOpen}
      onClick={() => setMenuOpen(true)}
    >
      Menu
    </Button>
  )

  return (
    <>
      <SkipLink targetId="main-content" />
      <header
        className={`sticky top-0 z-sticky bg-brand-canvas transition-shadow duration-brand-base ease-brand-standard ${
          scrolled ? 'shadow-lifted' : 'shadow-none'
        }`}
      >
        <div className={CHROME_CONTAINER}>
          <Navbar
            variant="transparent"
            maxWidth="full"
            containerPadding="none"
            ariaLabel="Primary"
            items={items}
            currentPath={pathname}
            logo={
              <Link href="/" linkComponent={NextLink} underline="never" color="inherit">
                <Wordmark />
              </Link>
            }
            actions={cta}
            mobileMenuOpen={false}
            mobileToggle={menuToggle}
          />
        </div>
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          items={menuItems}
          currentHref={pathname}
          linkComponent={NextLink}
          position="right"
          width="md"
          overlay="muted"
          elevation="lg"
          motion={reducedMotion ? 'none' : 'slide'}
          header={<Wordmark />}
          footer={cta}
          labels={{ dialog: 'Menu', navigation: 'Site' }}
        />
      </header>
    </>
  )
}
