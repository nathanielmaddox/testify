import { OfferLayout } from './offer_layout'
import type { LpLayout } from './types'

/**
 * Retargeting (product-aware, did not buy): hook, objections first, proof,
 * offer stack, guarantee, final CTA.
 */
export const offer99RetargetLayout: LpLayout = {
  component: OfferLayout,
  sections: ['hero', 'objections', 'proof', 'offer-stack', 'guarantee', 'final-cta'],
}
