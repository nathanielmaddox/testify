/**
 * LP LAYOUT MAP: layout key (lib/landing_pages.ts `LP_LAYOUT_KEYS`) ->
 * component. `app/(lp)/lp/[slug]/page.tsx` looks the LP's layout up here.
 *
 * New layout: add its key to `LP_LAYOUT_KEYS`, write
 * `components/lp/layouts/<key>_layout.tsx` exporting an `LpLayout`, and add
 * it below. The `satisfies` makes a missing layout a type error, and
 * `assertLayoutsCoverRegistry` fails the build if an LP lists a section its
 * layout cannot render.
 */
import { landingPages, type LandingPage, type LpLayoutKey } from '@/lib/landing_pages'
import { templateLayout } from './template_layout'
import type { LpLayout } from './types'

export const LP_LAYOUTS = {
  template: templateLayout,
} as const satisfies Record<LpLayoutKey, LpLayout>

export function getLpLayout(lp: LandingPage): LpLayout {
  return LP_LAYOUTS[lp.layout]
}

function assertLayoutsCoverRegistry(): void {
  for (const lp of landingPages) {
    const supported = new Set(getLpLayout(lp).sections)
    const missing = lp.sections.filter((section) => !supported.has(section))
    if (missing.length > 0) {
      throw new Error(
        `LP "${lp.slug}" lists sections its layout "${lp.layout}" cannot render: ${missing.join(', ')}`
      )
    }
  }
}

assertLayoutsCoverRegistry()

export type { LpLayout, LpLayoutProps } from './types'
