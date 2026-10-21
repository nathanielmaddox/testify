/**
 * Offer LP skeleton (the $99/month ready-to-post content LPs). Renders each
 * registry section in order with its component from `OFFER_SECTIONS`. The
 * sections carry their own anchors (`lp-<slug>-<section>`) and buy CTAs
 * (`BuyCta`, to `/lp/<offer.checkoutSlug>/checkout`, attributed after mount).
 * A sticky buy bar appears once the hero scrolls away, with the registry's
 * `stickyBarText`. There is no form here: the purchase happens on the checkout
 * page. Server component.
 */
import { StickyBuyBar } from '@/components/lp/sticky_buy_bar'
import { OFFER_SECTIONS } from '@/components/lp/sections/offer_sections'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { lpTrackingAttrs } from '@/lib/tracking'
import type { LpLayoutProps } from './types'

export function OfferLayout({ lp }: LpLayoutProps) {
  const checkoutHref = lpCheckoutHref(lp)
  return (
    <PageSkeleton tracking={lpTrackingAttrs(lp.slug, 'lp')} idPrefix={`lp-${lp.slug}`} slots={[]}>
      <div className="flex flex-col gap-brand-section-gap pb-brand-section-gap pt-12">
        {lp.sections.map((section) => {
          const Section = OFFER_SECTIONS[section]
          if (!Section) throw new Error(`Offer LP section "${section}" has no component.`)
          return <Section key={section} lp={lp} />
        })}
      </div>
      {checkoutHref ? (
        <StickyBuyBar
          heroId={`lp-${lp.slug}-hero`}
          href={checkoutHref}
          lpSlug={lp.slug}
          text={lp.stickyBarText}
        />
      ) : null}
    </PageSkeleton>
  )
}
