/**
 * Retargeting offer stack (registry section `offer-stack`). The retarget page
 * shows the same offer stack as the cold page, so the descriptor, the every
 * month and bonus lists, the price line, the scope line and the ink buy button
 * have one copy source. Server component.
 */
import { Offer99OfferStack } from './offer_99_offer_stack'
import type { LpSectionProps } from './section_props'

export function Offer99RetargetDeal(props: LpSectionProps) {
  return <Offer99OfferStack {...props} />
}
