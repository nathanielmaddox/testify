'use client'

// Home hero (Paper "01 Hero"): kicker, two-line H1, sub, violet "Get started" and outline "See our work",
// reassurance line, the three fanned phones, four stat cards and the trust line. Nav is the chrome's job.
import { Link } from '@otesse/design-system'
import NextLink from 'next/link'
import { useAttributedHref } from '@/components/lp/use_attributed_href'
import { getRoute, siteConfig } from '@/lib/site.config'
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { Kicker } from '@testify/style-guide/components/Kicker'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { HeroPhones } from './hero_phones'

// Stat cards: Paper gives no source line for these figures, so ProofRow (which needs one) does not apply.
const HERO_STATS = [
  { value: 'Day [N]', label: 'First posts ready for your OK' },
  { value: '15 min', label: 'Your time, each week' },
  { value: '[N]%', label: 'Posted on schedule' },
  { value: '[N]', label: 'Local businesses on board' },
] as const

export function HomeHero() {
  const bookHref = useAttributedHref(siteConfig.cta.href)
  const workHref = getRoute('work').path

  return (
    <PageSection
      flush
      width="grid"
      aria-labelledby="home-hero-heading"
      className="flex flex-col items-center gap-24"
    >
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-6">
          <Kicker>For trades, clinics, salons and local pros</Kicker>
          <div className="flex justify-center text-center">
            <DisplayHeading level={1} size="display-xl" id="home-hero-heading">
              <span className="block font-semibold">Social Media That</span>
              <span className="block font-medium italic">Grows Your Business</span>
            </DisplayHeading>
          </div>
        </div>
        <p className="max-w-measure text-center font-text text-brand-lead text-brand-ink-muted">
          While you&apos;re under a sink or behind the chair, your page keeps moving. We plan the
          month, turn your own jobs into finished posts, put them out on schedule and draft every
          reply for your OK. About 15 minutes a week from you.
        </p>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={bookHref}
              variant="button"
              color="cta"
              size="large"
              linkComponent={NextLink}
            >
              Get started
            </Link>
            <Link
              href={workHref}
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
      </div>

      <HeroPhones />

      <div className="flex w-full flex-col items-center gap-8">
        <ul className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {HERO_STATS.map((stat) => (
            <li
              key={stat.label}
              className="flex flex-col gap-4 rounded-card bg-brand-surface p-7 shadow-raised"
            >
              <span className="font-display text-brand-h2 text-brand-ink">{stat.value}</span>
              <span className="font-text text-brand-label font-semibold text-brand-ink">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
        <p className="font-text text-brand-small text-brand-ink-subtle">
          Month to month. Your accounts stay yours.
        </p>
      </div>
    </PageSection>
  )
}
