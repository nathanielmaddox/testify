// Shared chrome geometry, plain-text wordmark and copyright line. Server-safe.

import type { ReactNode } from 'react'
import { siteConfig } from '@/lib/site.config'

/**
 * Shared chrome geometry and the plain-text wordmark. Server-safe (no DS
 * import) so both client chrome modules and server files can use it.
 *
 * ONE container for every chrome edge: SiteHeader, SiteFooter, LpHeader and
 * LpFooter all sit in the same box: 1200px of content (max-w-grid, box-content)
 * with the fluid brand gutter (px-brand-gutter, 16 to 40px) outside it. That is
 * the same content width PageSection gives every section, so chrome and sections
 * share one left and right edge. Change it here and all four move together.
 */
export const CHROME_CONTAINER = 'mx-auto box-content max-w-grid px-brand-gutter'

/** Header bar height, shared by both headers so the name sits at the same y. */
export const CHROME_BAR = 'flex h-16 items-center'

/**
 * The brand name as plain display type (README "Iconography": display face at
 * title-sm, in ink, no drawn mark). The logo is a later brand slot.
 */
export function Wordmark({ children = siteConfig.name }: { children?: ReactNode }) {
  return <span className="font-display text-brand-h4 text-brand-ink">{children}</span>
}

/**
 * "© <year> Testify." as on the Paper footer. The year is computed at render, so
 * the page must be rebuilt or revalidated once a year or the prerendered year goes
 * stale. Kept server-side on purpose: no client-side date logic, so server and client agree.
 */
export function copyrightLine(): string {
  return `© ${new Date().getFullYear()} ${siteConfig.name}.`
}
