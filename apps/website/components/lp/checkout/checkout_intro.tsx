// Checkout intro: the headline and lead above the two columns (Paper "Checkout intro").
// Server-safe: only the style-guide DisplayHeading and PageSection, no DS import.
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'

export function CheckoutIntro({ idPrefix }: { idPrefix: string }) {
  const headingId = `${idPrefix}-intro-heading`
  // Paper "Checkout intro" frame (JP6-0) has 72px top padding under the 72px LP chrome. The nearest
  // brand key is the 64px heading stack; the top padding does not sit flush against the header.
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
        lead="Two minutes from now, your first week starts taking shape. Next, you'll tell us your trade and town, and we get to work. No contract. Cancel in 2 clicks."
      >
        Start Getting a Fresh Post and Story for Every Day of the Month, Made for Your Business and
        Ready for You to Post
      </DisplayHeading>
    </PageSection>
  )
}
