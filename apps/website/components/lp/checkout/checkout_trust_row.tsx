'use client'

// Trust row under the checkout columns (Paper "Trust row - checkout"): Stripe, no contract, cancel,
// and the legal links. TextLink (DS Link through the style guide) keeps Next client navigation.
// Paper's "[SETUP FEE]" is shown as-is until the owner decides it (it is a [CONFIRM] placeholder).
import { routes } from '@/lib/site.config'
import { TextLink } from '@testify/style-guide/components/TextLink'

export function CheckoutTrustRow({ idPrefix }: { idPrefix: string }) {
  const headingId = `${idPrefix}-trust-heading`
  return (
    <section
      id={`${idPrefix}-trust-row`}
      aria-labelledby={headingId}
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-brand-border pt-8 font-text text-brand-small text-brand-ink-muted"
    >
      <h2 id={headingId} className="sr-only">
        Trust and terms
      </h2>
      <span>Powered by Stripe</span>
      <span aria-hidden="true" className="text-brand-border-strong">
        ·
      </span>
      <span>No contract</span>
      <span aria-hidden="true" className="text-brand-border-strong">
        ·
      </span>
      <span>[SETUP FEE]</span>
      <span aria-hidden="true" className="text-brand-border-strong">
        ·
      </span>
      <span>Cancel in 2 clicks</span>
      <span aria-hidden="true" className="text-brand-border-strong">
        ·
      </span>
      <TextLink href={routes.terms.path}>Terms</TextLink>
      <span aria-hidden="true" className="text-brand-border-strong">
        ·
      </span>
      <TextLink href={routes.privacy.path}>Privacy</TextLink>
      <span aria-hidden="true" className="text-brand-border-strong">
        ·
      </span>
      <TextLink href={`${routes.terms.path}#payment-and-billing`}>Refund policy</TextLink>
    </section>
  )
}
