/**
 * Offer LP layout for cold traffic (Paper frame `lp/done-for-you-99`), a short
 * conversion page: hero, problem, mechanism, offer stack, guarantee, questions,
 * close, P.S. The hero's example-week mock is the demonstration. Renders through
 * OfferLayout, which owns the sticky buy bar.
 */
import { OfferLayout } from './offer_layout'
import type { LpLayout } from './types'

export const offer99ColdLayout: LpLayout = {
  component: OfferLayout,
  sections: [
    'hero',
    'problem',
    'mechanism',
    'offer-stack',
    'guarantee',
    'objections-faq',
    'final-cta',
    'ps',
  ],
}
