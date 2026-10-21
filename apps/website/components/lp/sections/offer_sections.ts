/**
 * Offer LP section map: registry section id -> the component that draws it.
 * The cold offer layout (`offer_layout.tsx`) renders each id in the order the
 * registry entry lists them. Every id the cold layout lists must be here. The
 * retargeting LP has its own map (`offer_99_retarget_sections.ts`).
 */
import type { ComponentType } from 'react'
import type { LpSectionId } from '@/lib/landing_pages'
import { Offer99Close, Offer99Ps } from './offer_99_close'
import { Offer99Faq } from './offer_99_faq'
import { Offer99Guarantee } from './offer_99_guarantee'
import { Offer99Hero } from './offer_99_hero'
import { Offer99How } from './offer_99_how'
import { Offer99OfferStack } from './offer_99_offer_stack'
import { Offer99Problem } from './offer_99_problem'
import type { LpSectionProps } from './section_props'

export const OFFER_SECTIONS: Partial<Record<LpSectionId, ComponentType<LpSectionProps>>> = {
  hero: Offer99Hero,
  problem: Offer99Problem,
  mechanism: Offer99How,
  'offer-stack': Offer99OfferStack,
  guarantee: Offer99Guarantee,
  'objections-faq': Offer99Faq,
  'final-cta': Offer99Close,
  ps: Offer99Ps,
}
