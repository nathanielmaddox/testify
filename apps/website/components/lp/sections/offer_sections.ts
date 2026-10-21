/**
 * Offer LP section map: registry section id -> the component that draws it.
 * The offer layouts (`offer_layout.tsx`) render each id in the order the
 * registry entry lists them. Every id an offer layout lists must be here.
 */
import type { ComponentType } from 'react'
import type { LpSectionId } from '@/lib/landing_pages'
import { Offer99Close, Offer99Ps } from './offer_99_close'
import { Offer99Faq } from './offer_99_faq'
import { Offer99Guarantee } from './offer_99_guarantee'
import { Offer99Hero } from './offer_99_hero'
import { Offer99How } from './offer_99_how'
import { Offer99Letter } from './offer_99_letter'
import { Offer99Next } from './offer_99_next'
import { Offer99OfferStack } from './offer_99_offer_stack'
import { Offer99Problem } from './offer_99_problem'
import { Offer99Sample } from './offer_99_sample'
import { Offer99Seen } from './offer_99_seen'
import { Offer99Straight } from './offer_99_straight'
import { Offer99Story } from './offer_99_story'
import { Offer99Team } from './offer_99_team'
import { Offer99Time } from './offer_99_time'
import { Offer99Trust } from './offer_99_trust'
import type { LpSectionProps } from './section_props'

export const OFFER_SECTIONS: Partial<Record<LpSectionId, ComponentType<LpSectionProps>>> = {
  hero: Offer99Hero,
  proof: Offer99Trust,
  letter: Offer99Letter,
  story: Offer99Story,
  problem: Offer99Problem,
  seen: Offer99Seen,
  time: Offer99Time,
  mechanism: Offer99How,
  sample: Offer99Sample,
  straight: Offer99Straight,
  'offer-stack': Offer99OfferStack,
  guarantee: Offer99Guarantee,
  team: Offer99Team,
  'objections-faq': Offer99Faq,
  next: Offer99Next,
  'final-cta': Offer99Close,
  ps: Offer99Ps,
}
