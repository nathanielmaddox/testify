/**
 * Retargeting guarantees (registry section `guarantee`). The five promises in
 * the canonical wording, drawn by the cold guarantee so the wording has one
 * source. No close line and no CTA on the retarget page. Server component.
 */
import { Offer99Guarantee } from './offer_99_guarantee'
import type { LpSectionProps } from './section_props'

export function Offer99RetargetGuarantee(props: LpSectionProps) {
  return <Offer99Guarantee {...props} />
}
