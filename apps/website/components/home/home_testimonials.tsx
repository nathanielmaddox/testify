'use client'

// Home testimonials (Paper "09 Testimonials"): three quote cards, two video slots and a "Your business next." card.
// Build note: this section renders only once at least two approved quotes exist. Until then the Paper placeholders
// stay visible (copy verbatim, [N] and [NAME] tokens intentional).
import { BrandIcon } from '@testify/style-guide/components/BrandIcon'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { TextLink } from '@testify/style-guide/components/TextLink'
import { SectionHeader } from '@/components/site/section_header'
import { TestimonialCard } from '@/components/site/testimonial_card'
import { useAttributedHref } from '@/components/lp/use_attributed_href'
import { siteConfig } from '@/lib/site.config'

const QUOTE_PLACEHOLDER = '[ONE SPECIFIC RESULT, IN THEIR WORDS]'
const ATTRIBUTION_PLACEHOLDER = '[NAME], [TRADE], [TOWN]'

function VideoSlot({ tone }: { tone: 'bg-brand-done-bg' | 'bg-brand-done-bg-strong' }) {
  return (
    <div
      aria-hidden="true"
      className={`flex aspect-[6/5] w-full items-center justify-center overflow-hidden rounded-[40px] ${tone}`}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-surface text-brand-ink shadow-raised">
        <BrandIcon name="Play" size="md" />
      </span>
    </div>
  )
}

export function HomeTestimonials() {
  const bookHref = useAttributedHref(siteConfig.cta.href)

  return (
    <PageSection
      flush
      width="grid"
      aria-labelledby="home-testimonials-heading"
      className="flex flex-col items-center gap-16"
    >
      <SectionHeader
        id="home-testimonials-heading"
        kicker="Clients"
        heading="Clients, in their words."
        size="h2"
        align="center"
      />

      <div className="flex w-full flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TestimonialCard quote={QUOTE_PLACEHOLDER} name={ATTRIBUTION_PLACEHOLDER} />
          <TestimonialCard quote={QUOTE_PLACEHOLDER} name={ATTRIBUTION_PLACEHOLDER} />
          <div className="md:col-span-2 lg:col-span-1">
            <TestimonialCard quote={QUOTE_PLACEHOLDER} name={ATTRIBUTION_PLACEHOLDER} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <VideoSlot tone="bg-brand-done-bg" />
          <VideoSlot tone="bg-brand-done-bg-strong" />
          <div className="flex flex-col justify-between gap-8 rounded-[40px] bg-brand-surface p-6 shadow-raised md:col-span-2 md:p-9 lg:col-span-1">
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-brand-h2 text-brand-ink">Your business next.</h3>
              <p className="font-text text-brand-lead text-brand-ink-muted">
                Your jobs, your words, on your page every week.
              </p>
            </div>
            <TextLink href={bookHref}>Get started</TextLink>
          </div>
        </div>
      </div>
    </PageSection>
  )
}
