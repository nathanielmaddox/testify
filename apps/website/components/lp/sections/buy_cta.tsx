'use client'

/**
 * Buy CTA for the $99 offer LPs: the CtaRow (DS Link) to the purchase page,
 * with the visitor's stored attribution added after mount. Keeps the
 * `data-slot="cta"` / `data-checkout-href` hooks that the LP tracking reads.
 * A click on the link fires `checkout_click` with the LP slug and the
 * placement, when the call site passes one.
 */
import type { MouseEvent } from 'react'
import { CtaRow, type CtaTone } from '@testify/style-guide/components/CtaRow'
import { PricingLine } from '@testify/style-guide/components/PricingLine'
import { useAttributedHref } from '@/components/lp/use_attributed_href'
import { track } from '@/lib/tracking'

/** Where the button sits on the page, for `checkout_click` reporting. */
export type BuyPlacement = 'hero' | 'offer' | 'close' | 'sticky' | 'unknown'

export interface BuyCtaProps {
  href: string
  lpSlug: string
  label: string
  tone?: CtaTone
  /** Price, terms and next step, shown under the button. */
  caption?: string
  /** Where this button sits, sent with `checkout_click`. */
  placement?: BuyPlacement
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
  placement = 'unknown',
  sameDocument = false,
}: BuyCtaProps) {
  const attributed = useAttributedHref(href)
  const target = sameDocument ? href : attributed

  function onClick(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element) || !event.target.closest('a')) return
    track('checkout_click', { lp_slug: lpSlug, placement })
  }

  return (
    <div data-slot="cta" data-checkout-href={target} data-lp-slug={lpSlug} onClick={onClick}>
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
