// Contact intro: centered "CONTACT" pill, the "Talk to the right person." H1 and its lead line.
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { Kicker } from '@testify/style-guide/components/Kicker'
import { PageSection } from '@testify/style-guide/components/PageSection'

export function ContactIntro() {
  return (
    <PageSection flush width="grid" aria-labelledby="contact-heading" className="pt-[96px]">
      <div className="flex flex-col items-center gap-6 text-center">
        <Kicker>CONTACT</Kicker>
        <DisplayHeading level={1} size="display" id="contact-heading">
          Talk to the right person.
        </DisplayHeading>
        <p className="max-w-measure-narrow font-text text-brand-lead text-brand-ink-muted">
          Pick one. We&apos;ll take you to the right place in one click.
        </p>
      </div>
    </PageSection>
  )
}
