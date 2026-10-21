/**
 * Shared shape for offer-LP section components. Each section receives its
 * registry entry and derives its own anchor id (`lp-<slug>-<slot>`, the same
 * ids SectionSlot gives the template LP), so the offer layouts keep stable
 * anchors and tracking hooks.
 */
import type { LandingPage, LpSectionId } from '@/lib/landing_pages'

export interface LpSectionProps {
  lp: LandingPage
}

/** `id` and `data-slot` for a section's <section> element. */
export function slotProps(lp: LandingPage, slot: LpSectionId) {
  return { id: `lp-${lp.slug}-${slot}`, 'data-slot': slot } as const
}
