// Neutral state for a purchase confirmation that Stripe has not verified as paid yet (or cannot verify
// because keys are not set). It names no product, shows no receipt promise and fires no purchase event.
// Server component: the style-guide heading and section only.
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'

export function PaymentPending({ idPrefix }: { idPrefix: string }) {
  const headingId = `${idPrefix}-pending-heading`
  return (
    <PageSection
      id={`${idPrefix}-pending`}
      aria-labelledby={headingId}
      width="grid"
      flush
      className="pt-brand-section pb-24"
    >
      <DisplayHeading
        level={1}
        size="h2"
        id={headingId}
        lead="This usually takes a few seconds. Refresh this page in a minute. Questions? [NAME] replies within [N] hours: hello@[DOMAIN]"
      >
        We&apos;re confirming your payment
      </DisplayHeading>
    </PageSection>
  )
}
