/**
 * Site-wide settings. Every value here is a PLACEHOLDER until the real brand,
 * domain and page list are decided. Pages, metadata, robots, sitemap, header
 * and footer all read from this one object, so changing a name or a nav item
 * happens here and nowhere else.
 */

export interface NavLink {
  label: string
  href: string
}

export interface FooterLinkColumn {
  title: string
  links: NavLink[]
}

export interface SiteConfig {
  /** Brand name shown in the header, footer, metadata and title template. */
  name: string
  /** One-line description for metadata and the footer tagline. */
  description: string
  /** Canonical origin, no trailing slash. Read from NEXT_PUBLIC_SITE_URL. */
  url: string
  /** Primary navigation (header). Only list routes that exist. */
  nav: NavLink[]
  /** Header call to action. */
  cta: NavLink
  /** Footer link columns. */
  footer: FooterLinkColumn[]
  /** Every indexable route, for app/sitemap.ts. */
  routes: string[]
  /**
   * Robots gate. Stays false until launch, so a placeholder site is never
   * indexed. Flip with NEXT_PUBLIC_SITE_INDEXABLE=true on the production
   * environment only.
   */
  indexable: boolean
}

const url = (process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3200').replace(/\/+$/, '')

export const siteConfig: SiteConfig = {
  name: 'Testify',
  description: 'Placeholder description for the Testify website.',
  url,
  nav: [{ label: 'Home', href: '/' }],
  cta: { label: 'Get started', href: '/' },
  footer: [
    {
      title: 'Site',
      links: [{ label: 'Home', href: '/' }],
    },
  ],
  routes: ['/'],
  indexable: process.env['NEXT_PUBLIC_SITE_INDEXABLE'] === 'true',
}
