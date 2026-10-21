'use client'

// Home offer section (Paper "07 The offer"): one white card with the Content Engine and the On-Time Promise,
// then the quiet CTA row. Client module: CtaRow is DS-backed and the CTA uses the attributed href.
import { CtaRow } from '@testify/style-guide/components/CtaRow'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { SectionHeader } from '@/components/site/section_header'
import { useAttributedHref } from '@/components/lp/use_attributed_href'
import { siteConfig } from '@/lib/site.config'

const ENGINE_ITEMS = [
  'Your month planned before it starts',
  '[N] posts and videos a month, edited and captioned',
  'Posted on the days we agree',
  'Replies drafted for your OK',
  'A one-page summary in plain words: what went out, what came back',
  'One named person who knows your business',
  'Every file is yours to keep',
] as const

const PROMISE_ITEMS = [
  'Your first posts are ready for your OK by day [N].',
  'If a planned post misses its day, you hear it from us first, then [remedy].',
  'Not right? Flag it and we redo it within [N] business days.',
] as const

function OfferColumn({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <h3 className="font-display text-brand-h2 text-brand-ink">{title}</h3>
      <ul className="flex flex-col gap-3.5">
        {items.map((item) => (
          <li key={item} className="font-text text-brand-lead text-brand-ink">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function HomeOffer() {
  const bookHref = useAttributedHref(siteConfig.cta.href)

  return (
    <PageSection
      flush
      width="grid"
      aria-labelledby="home-offer-heading"
      className="flex flex-col items-center gap-16"
    >
      <SectionHeader
        id="home-offer-heading"
        kicker="In writing"
        heading="What you get, written down."
        sub="If an agency has burned you before, start here. Every line below is something you can count."
        size="h2"
        align="center"
      />

      <div className="grid w-full grid-cols-1 gap-6 rounded-card bg-brand-surface p-6 shadow-raised md:grid-cols-2 md:gap-12 md:p-14">
        <OfferColumn title="The Content Engine" items={ENGINE_ITEMS} />
        <OfferColumn title="The On-Time Promise" items={PROMISE_ITEMS} />
      </div>

      <CtaRow
        href={bookHref}
        label="Get started"
        caption={
          <p className="font-text text-brand-lead text-brand-ink-muted">
            A few quick questions, then pick a time that suits you.
          </p>
        }
      />
    </PageSection>
  )
}
