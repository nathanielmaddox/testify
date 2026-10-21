// Contact intro: centered "Book a time to talk." H1 and one sub line. No kicker pill.
// [CONFIRM copy]: the headline and sub line wait for the owner's approval.
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'

export function ContactIntro() {
  return (
    <PageSection flush width="grid" aria-labelledby="contact-heading" className="pt-[96px]">
      <DisplayHeading
        level={1}
        size="display"
        align="center"
        id="contact-heading"
        lead="Pick a slot that suits you. 15 minutes, no prep."
      >
        Book a time to talk.
      </DisplayHeading>
    </PageSection>
  )
}
