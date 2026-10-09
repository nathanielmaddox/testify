import { LpCheckoutCta } from '@/components/lp/lp_checkout_cta'
import { PageSkeleton, SectionSlot } from '@/components/skeleton/page_skeleton'
import { lpCheckoutHref, type LpSectionId } from '@/lib/landing_pages'
import { lpTrackingAttrs } from '@/lib/tracking'
import { LP_SECTION_LABELS } from './section_labels'
import type { LpLayoutProps } from './types'

/** Sections that carry a buy CTA (to the offer's checkout page). */
const CTA_SECTIONS = new Set<LpSectionId>(['hero', 'offer-stack', 'final-cta'])

/**
 * Offer LP skeleton (the $99/month ready-to-post content LPs): one empty
 * slot per registry section, in order. The hero, offer-stack and final-cta
 * slots each hold a `cta` sub-slot pointing at `/lp/<offer.checkoutSlug>/checkout`
 * (attributed after mount). There is no form here: the purchase happens on
 * the separate checkout page. Server component (no DS import).
 */
export function OfferLayout({ lp }: LpLayoutProps) {
  const idPrefix = `lp-${lp.slug}`
  const checkoutHref = lpCheckoutHref(lp)
  return (
    <PageSkeleton tracking={lpTrackingAttrs(lp.slug, 'lp')} idPrefix={idPrefix} slots={[]}>
      {lp.sections.map((section) => (
        <SectionSlot
          key={section}
          idPrefix={idPrefix}
          slot={section}
          label={LP_SECTION_LABELS[section]}
        >
          {checkoutHref && CTA_SECTIONS.has(section) ? (
            <LpCheckoutCta href={checkoutHref} lpSlug={lp.slug} />
          ) : null}
        </SectionSlot>
      ))}
    </PageSkeleton>
  )
}
