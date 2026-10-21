/**
 * Retargeting LP skeleton (layout `offer-99-retarget`, Paper frame order):
 * hero, opening letter, catches, first month, team, offer stack, guarantees,
 * close, P.S. Renders each registry section in order through
 * OFFER_99_RETARGET_SECTIONS. Server component.
 */
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { OFFER_99_RETARGET_SECTIONS } from '@/components/lp/sections/offer_99_retarget_sections'
import { StickyBuyBar } from '@/components/lp/sticky_buy_bar'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { lpTrackingAttrs } from '@/lib/tracking'
import type { LpLayout, LpLayoutProps } from './types'

function RetargetLayout({ lp }: LpLayoutProps) {
  const checkoutHref = lpCheckoutHref(lp)
  return (
    <PageSkeleton tracking={lpTrackingAttrs(lp.slug, 'lp')} idPrefix={`lp-${lp.slug}`} slots={[]}>
      <div className="flex flex-col gap-brand-section-gap pb-brand-section-gap pt-12">
        {lp.sections.map((section) => {
          const Section = OFFER_99_RETARGET_SECTIONS[section]
          if (!Section) throw new Error(`Retarget LP section "${section}" has no component.`)
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

export const offer99RetargetLayout: LpLayout = {
  component: RetargetLayout,
  sections: [
    'hero',
    'letter',
    'objections',
    'first-month',
    'team',
    'offer-stack',
    'guarantee',
    'final-cta',
    'ps',
  ],
}
