/**
 * Retargeting LP section map (layout `offer-99-retarget`): registry section id
 * -> the component that draws it. Kept apart from offer_sections.ts, which
 * belongs to the cold LP. The deal and guarantee reuse the cold components so
 * their copy has one source. `offer_99_retarget_layout.tsx` throws for any
 * listed id missing here.
 */
import type { ComponentType } from 'react'
import type { LpSectionId } from '@/lib/landing_pages'
import { Offer99RetargetClose, Offer99RetargetPs } from './offer_99_retarget_close'
import { Offer99RetargetDeal } from './offer_99_retarget_deal'
import { Offer99RetargetFirstMonth } from './offer_99_retarget_first_month'
import { Offer99RetargetGuarantee } from './offer_99_retarget_guarantee'
import { Offer99RetargetHero } from './offer_99_retarget_hero'
import { Offer99RetargetObjections } from './offer_99_retarget_objections'
import type { LpSectionProps } from './section_props'

export const OFFER_99_RETARGET_SECTIONS: Partial<
  Record<LpSectionId, ComponentType<LpSectionProps>>
> = {
  hero: Offer99RetargetHero,
  objections: Offer99RetargetObjections,
  'first-month': Offer99RetargetFirstMonth,
  'offer-stack': Offer99RetargetDeal,
  guarantee: Offer99RetargetGuarantee,
  'final-cta': Offer99RetargetClose,
  ps: Offer99RetargetPs,
}
