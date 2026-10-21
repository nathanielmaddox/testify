'use client'

// About hero: headline, lead, the two CTAs, the reassurance line and the team photo placeholder.
import { Link } from '@otesse/design-system'
import { CtaRow } from '@testify/style-guide/components/CtaRow'
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import NextLink from 'next/link'
import { useAttributedHref } from '@/components/lp/use_attributed_href'
import { getRoute, siteConfig } from '@/lib/site.config'

export function AboutHero() {
  const href = useAttributedHref(siteConfig.cta.href)
  return (
    <PageSection flush width="grid" aria-labelledby="about-hero-heading" className="pt-[96px]">
      <DisplayHeading
        level={1}
        size="display"
        id="about-hero-heading"
        kicker="For trades, clinics, salons and local pros"
        lead="We run social media for local service businesses. You answer a few questions on your phone, about 15 minutes a week. We plan, edit, caption and post. Nothing goes live until you OK it."
      >
        We keep good businesses from looking closed.
      </DisplayHeading>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <CtaRow href={href} label="Get started" tone="action" />
          <Link
            href={getRoute('work').path}
            variant="button"
            color="outline"
            size="large"
            linkComponent={NextLink}
          >
            See our work
          </Link>
        </div>
        <p className="font-text text-brand-small text-brand-ink-subtle">
          A few quick questions, then a 15-minute call. You keep the post ideas, hire us or not.
        </p>
      </div>
      <figure className="flex flex-col gap-3">
        <div
          aria-hidden="true"
          className="aspect-[1280/549] w-full rounded-card bg-brand-surface-sunken"
        />
        <figcaption className="font-text text-brand-small text-brand-ink-subtle">
          [NAME] on a job with [BUSINESS], [TOWN]. The owner stayed off camera.
        </figcaption>
      </figure>
    </PageSection>
  )
}
