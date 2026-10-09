'use client'

import NextLink from 'next/link'
import type { ReactNode } from 'react'
import { Link } from '@otesse/design-system'
import { siteConfig, type NavLink } from '@/lib/site.config'
import { CHROME_CONTAINER, copyrightLine } from './chrome'

/**
 * Footer pieces shared by SiteFooter and LpFooter so both footers carry the
 * same band, container and bottom row.
 *
 * Why not the DS Footer: at the pinned build (e7d37602) its inner container is
 * fixed (max-w-7xl, px-6/8/12) with no prop or token to change it, its column
 * labels are hard-coded <h3>, columns are not wrapped in a <nav>, and the
 * default variant paints border-gray-200 / text-gray-600 instead of the
 * themed tokens. None of that is reachable without restyling DS internals,
 * so the footer is composed here from semantic landmarks, the brand layout
 * keys and the DS Link (every link is still a DS primitive).
 */

/** Footer landmark: the recessed canvas-alt band with the brand hairline on top. */
export function FooterBand({ children }: { children: ReactNode }) {
  return (
    <footer className="border-t border-brand-border bg-brand-canvas-alt">
      <div className={CHROME_CONTAINER}>{children}</div>
    </footer>
  )
}

/** One footer link: DS Link, ink-muted, underline on hover, Next client navigation. */
export function FooterLink({ link }: { link: NavLink }) {
  return (
    <Link href={link.href} linkComponent={NextLink} color="muted" underline="hover" size="small">
      {link.label}
    </Link>
  )
}

/**
 * Bottom row: the copyright line and the legal links (the ONLY place legal
 * links appear). Identical in both footers so their edges and baseline agree.
 */
export function FooterBottomRow() {
  return (
    <div className="flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
      {/* The year is computed at render; a static page built in December may differ by one on the client. */}
      <p className="font-text text-brand-small text-brand-ink-subtle" suppressHydrationWarning>
        {copyrightLine()}
      </p>
      <nav aria-label="Legal">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {siteConfig.legal.map((link) => (
            <li key={link.href}>
              <FooterLink link={link} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
