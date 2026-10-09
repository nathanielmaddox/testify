import { OfferLayout } from './offer_layout'
import type { LpLayout } from './types'

/**
 * Cold traffic (problem-aware at best): hook, proof, problem/agitation,
 * mechanism, offer stack, guarantee, objections + FAQ, final CTA.
 */
export const offer99ColdLayout: LpLayout = {
  component: OfferLayout,
  sections: [
    'hero',
    'proof',
    'problem',
    'mechanism',
    'offer-stack',
    'guarantee',
    'objections-faq',
    'final-cta',
  ],
}
