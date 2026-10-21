// About page: hero, origin, numbers, team, promises, who we work for, then the closing CTA. Numbers is not placed in Paper's main column, so it stays after origin.
import { AboutHero } from '@/components/about/about_hero'
import { AboutNumbers } from '@/components/about/about_numbers'
import { AboutOrigin } from '@/components/about/about_origin'
import { AboutPromises } from '@/components/about/about_promises'
import { AboutTeam } from '@/components/about/about_team'
import { AboutWho } from '@/components/about/about_who'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { ClosingCta } from '@/components/site/closing_cta'
import { pageMetadata } from '@/lib/metadata'
import { PageSection } from '@testify/style-guide/components/PageSection'

export const metadata = pageMetadata('about')

export default function AboutPage() {
  return (
    <PageSkeleton routeKey="about" slots={[]}>
      <AboutHero />
      <AboutOrigin />
      <AboutNumbers />
      <AboutTeam />
      <AboutPromises />
      <AboutWho />
      <PageSection flush width="content" aria-label="Next step" className="pt-brand-section-gap">
        <ClosingCta
          kicker="Next step"
          headline="Start with a few questions."
          ctaLabel="Get started"
          reassurance="A few quick questions, then a 15-minute call. You keep the post ideas, hire us or not."
        />
      </PageSection>
    </PageSkeleton>
  )
}
