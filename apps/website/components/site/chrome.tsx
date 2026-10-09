import type { ReactNode } from 'react'
import { siteConfig } from '@/lib/site.config'

/**
 * Shared chrome geometry and the plain-text wordmark. Server-safe (no DS
 * import) so both client chrome modules and server files can use it.
 *
 * ONE container for every chrome edge: SiteHeader, SiteFooter, LpHeader and
 * LpFooter all sit in `container-wide` (max-w-grid, 1200px) with the fluid
 * brand gutter (px-brand-gutter, 16 to 40px). Change it here and all four move
 * together.
 */
export const CHROME_CONTAINER = 'mx-auto w-full max-w-grid px-brand-gutter'

/** Header bar height, shared by both headers so the name sits at the same y. */
export const CHROME_BAR = 'flex h-16 items-center'

/**
 * The brand name as plain display type (README "Iconography": display face at
 * title-sm, in ink, no drawn mark). The logo is a later brand slot.
 */
export function Wordmark({ children = siteConfig.name }: { children?: ReactNode }) {
  return <span className="font-display text-brand-h4 text-brand-ink">{children}</span>
}

/** "(c) <year> Testify. All rights reserved." with the year computed at render. */
export function copyrightLine(): string {
  return `© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`
}
