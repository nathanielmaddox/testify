'use client'

/**
 * Buy CTA for the $99 offer LPs: the violet CtaRow (DS Link) to the purchase
 * page, with the visitor's stored attribution added after mount. Keeps the
 * `data-slot="cta"` / `data-checkout-href` hooks that the LP tracking reads.
 */
import { CtaRow, type CtaTone } from '@testify/style-guide/components/CtaRow'
import { PricingLine } from '@testify/style-guide/components/PricingLine'
import { useAttributedHref } from '@/components/lp/use_attributed_href'

export interface BuyCtaProps {
  href: string
  lpSlug: string
  label: string
  tone?: CtaTone
  /** Price, terms and next step, shown under the button. */
  caption?: string
  /**
   * `href` is an anchor on this page (such as `#lp-<slug>-form`): link to it
   * as written, without adding stored attribution.
   */
  sameDocument?: boolean
}

export function BuyCta({
  href,
  lpSlug,
  label,
  tone = 'action',
  caption,
  sameDocument = false,
}: BuyCtaProps) {
  const attributed = useAttributedHref(href)
  const target = sameDocument ? href : attributed
  return (
    <div data-slot="cta" data-checkout-href={target} data-lp-slug={lpSlug}>
      <CtaRow
        href={target}
        label={label}
        tone={tone}
        caption={
          caption ? (
            <div className="mx-auto text-center">
              <PricingLine>{caption}</PricingLine>
            </div>
          ) : undefined
        }
      />
    </div>
  )
}
