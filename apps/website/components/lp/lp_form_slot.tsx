/**
 * LP form/checkout slot (registry section `form`, template layout only). Empty
 * for now. Its id is `<idPrefix>-form` (`lp-<slug>-form`), which the sample
 * LP's hero CTA links to. `data-success-path` is THIS LP's conversion page
 * (`/lp/<slug>/confirmation`); the form wired in later sends the visitor there
 * with ONLY the conversion id (`leadConfirmationHref(slug, token)` or Stripe's
 * `stripeSuccessUrl(slug)`, both in lib/conversion.ts). UTM and click ids are
 * not carried in that URL: they are in first-party storage
 * (`getAttribution()` in lib/attribution.ts), to attach to the lead or Stripe
 * session metadata.
 */
import { SectionSlot } from '@/components/skeleton/page_skeleton'
import { lpConfirmationPath } from '@/lib/landing_pages'

export function LpFormSlot({ slug, idPrefix }: { slug: string; idPrefix: string }) {
  return (
    <SectionSlot
      idPrefix={idPrefix}
      slot="form"
      label="Form and checkout"
      data-lp-slug={slug}
      data-success-path={lpConfirmationPath(slug)}
    />
  )
}
