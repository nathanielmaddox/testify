// Checkout intro: one headline and one sub line above the two columns (owner ruling: essentials only).
// Server-safe: only the style-guide DisplayHeading and PageSection, no DS import.
// [CONFIRM copy]: headline and sub line are short placeholders until the owner approves them.
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'

export function CheckoutIntro({ idPrefix }: { idPrefix: string }) {
  const headingId = `${idPrefix}-intro-heading`
  return (
    <PageSection
      id={`${idPrefix}-intro`}
      aria-labelledby={headingId}
      width="grid"
      flush
      className="pt-brand-heading-stack"
    >
      <DisplayHeading
        level={1}
        size="h3"
        id={headingId}
        lead="Two minutes. No contract. Cancel in 2 clicks."
      >
        Turn on your Open Sign.
      </DisplayHeading>
    </PageSection>
  )
}
