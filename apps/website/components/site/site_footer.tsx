'use client'

// Site footer: tagline with Get started, four link columns, wordmark, then the shared bottom row.

import NextLink from 'next/link'
import type { ReactNode } from 'react'
import { Link } from '@otesse/design-system'
import { useAttributedHref } from '@/components/lp/use_attributed_href'
import { routes, siteConfig } from '@/lib/site.config'
import { FooterBand, FooterBottomRow, FooterLink } from './footer_parts'

/** Audience labels from the Paper footer ("System - Footer"). No routes behind them yet, so they are plain text. */
const WHO_WE_HELP = ['Trades', 'Cleaning', 'Salons and clinics', 'Builders']

/**
 * One footer column: overline label in ink-subtle, then its items. The title is a
 * <p> with the label classes, so the footer adds no headings to the page outline.
 */
function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-text text-brand-overline uppercase text-brand-ink-subtle">{title}</p>
      {children}
    </div>
  )
}

/** A plain text item in a column (no route behind it yet). */
function FooterText({ children }: { children: ReactNode }) {
  return <p className="font-text text-brand-small leading-5 text-brand-ink">{children}</p>
}

/**
 * Site footer, as drawn on the Paper nav-and-footer board: a tagline with the
 * ink "Get started" pill, four link columns (Pages from the routes registry,
 * What we do, Who we help, Talk to us), the giant wordmark, then the hairline
 * and the shared bottom row (copyright left, legal links right). Same on every
 * page. Contact details stay [PHONE] / [EMAIL] / [AREA SERVED] placeholders.
 */
export function SiteFooter() {
  // The CTA goes to /get-started via siteConfig.cta: carry the visitor's stored UTM / click ids (after mount).
  const ctaHref = useAttributedHref(siteConfig.cta.href)

  return (
    <FooterBand>
      {/* Paper footer: 96 top, 40 bottom, 64 between the top row, wordmark, hairline and bottom row. */}
      <div className="flex flex-col gap-12 pb-10 pt-16 lg:gap-16 lg:pt-24">
        <div className="flex flex-col gap-12 xl:flex-row xl:items-start xl:gap-16">
          <div className="flex w-full flex-col items-start gap-6 xl:w-[360px] xl:shrink-0">
            <p className="font-display text-brand-h3 font-semibold leading-[36px] text-brand-ink">
              Done-for-you social media for service businesses.
            </p>
            <Link
              href={ctaHref}
              linkComponent={NextLink}
              variant="button"
              color="primary"
              size="medium"
            >
              Get started
            </Link>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            <FooterColumn title="Pages">
              <nav aria-label="Footer">
                <ul className="flex flex-col gap-3">
                  {siteConfig.nav.map((link) => (
                    <li key={link.href}>
                      <FooterLink link={link} color="inherit" />
                    </li>
                  ))}
                </ul>
              </nav>
            </FooterColumn>
            <FooterColumn title="What we do">
              <FooterText>Social media management</FooterText>
              <FooterText>Content creation</FooterText>
              <FooterText>Short videos</FooterText>
              <FooterText>Strategy and planning</FooterText>
            </FooterColumn>
            <FooterColumn title="Who we help">
              {WHO_WE_HELP.map((label) => (
                <FooterText key={label}>{label}</FooterText>
              ))}
            </FooterColumn>
            <FooterColumn title="Talk to us">
              <Link
                href={ctaHref}
                linkComponent={NextLink}
                color="inherit"
                underline="hover"
                size="medium"
              >
                Get started
              </Link>
              <Link
                href={routes.contact.path}
                linkComponent={NextLink}
                color="inherit"
                underline="hover"
                size="medium"
              >
                Contact support
              </Link>
              <FooterText>[PHONE]</FooterText>
              <FooterText>[EMAIL]</FooterText>
              <FooterText>[AREA SERVED]</FooterText>
            </FooterColumn>
          </div>
        </div>
        <p
          aria-hidden="true"
          className="select-none font-display font-bold leading-[0.93] tracking-[-0.06em] text-brand-ink [font-size:clamp(3rem,23vw,17.5rem)]"
        >
          {siteConfig.name}
        </p>
        <div aria-hidden="true" className="h-px bg-brand-border" />
        <FooterBottomRow />
      </div>
    </FooterBand>
  )
}
