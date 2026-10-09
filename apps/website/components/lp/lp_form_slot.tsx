import { SectionSlot } from '@/components/skeleton/page_skeleton'
import { routes } from '@/lib/site.config'

/**
 * LP form/checkout slot. Empty for now. `data-success-path` is the conversion
 * page; the form wired in later sends the visitor there with ONLY the
 * conversion id (`leadConfirmationHref(token)` or Stripe's
 * `stripeSuccessUrl()`, both in lib/conversion.ts). UTM and click ids are not
 * carried in that URL: they are in first-party storage (`getAttribution()` in
 * lib/attribution.ts), to attach to the lead or Stripe session metadata.
 */
export function LpFormSlot() {
  return (
    <SectionSlot
      routeKey="lp"
      slot="form"
      label="Form and checkout"
      data-success-path={routes.lpConfirmation.path}
    />
  )
}
