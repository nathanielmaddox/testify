// Contact footnotes: the returning-client line, then the press, partner and jobs lines, under the router.
import { PageSection } from '@testify/style-guide/components/PageSection'

export function ContactFootnotes() {
  return (
    <PageSection
      flush
      width="grid"
      aria-label="Other ways to reach us"
      className="pt-brand-section-gap"
    >
      <div className="flex flex-col gap-3 text-center">
        <p className="font-text text-brand-body text-brand-ink-muted">
          Worked with us before? Email [EMAIL] and we&apos;ll pick up where we left off, no form. ·
          Just a question first? Read the FAQ or email hello@[DOMAIN]. Pricing questions too.
        </p>
        <p className="font-text text-brand-body text-brand-ink-muted">
          Press: press@[DOMAIN] · Partners and vendors: partners@[DOMAIN] · Jobs: careers@[DOMAIN]
        </p>
      </div>
    </PageSection>
  )
}
