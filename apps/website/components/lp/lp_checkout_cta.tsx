'use client'

import { useAttributedHref } from './use_attributed_href'

/**
 * Buy-CTA anchor point inside an offer LP section (hero, offer-stack,
 * final-cta). Skeleton only: no visible UI yet. `data-checkout-href` is the
 * purchase page (`/lp/<offer.checkoutSlug>/checkout`) with the visitor's
 * stored attribution added AFTER mount (`useAttributedHref`), so the server
 * HTML and first client render match. The real DS button, when it lands,
 * links to exactly this href.
 */
export function LpCheckoutCta({ href, lpSlug }: { href: string; lpSlug: string }) {
  const attributed = useAttributedHref(href)
  return <div data-slot="cta" data-checkout-href={attributed} data-lp-slug={lpSlug} hidden />
}
