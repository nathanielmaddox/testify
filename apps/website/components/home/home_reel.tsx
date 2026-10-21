'use client'

// Home reel section (Paper "04 Reel"): kicker, a contained 16:9 reel placeholder with the play glyph,
// then the heading and sub. Client module only because the play glyph is a brand icon (DS under the hood).
import { BrandIcon } from '@testify/style-guide/components/BrandIcon'
import { Kicker } from '@testify/style-guide/components/Kicker'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { SectionHeader } from '@/components/site/section_header'

export function HomeReel() {
  return (
    <PageSection
      flush
      width="grid"
      aria-labelledby="home-reel-heading"
      className="flex flex-col items-center gap-16"
    >
      <Kicker>Your page</Kicker>

      <div
        aria-hidden="true"
        className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-[40px] bg-brand-done-bg"
      >
        <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-brand-surface text-brand-ink shadow-raised">
          <BrandIcon name="Play" size="lg" />
        </span>
        <span className="absolute bottom-8 left-10 font-text text-brand-small font-semibold text-brand-done-fg">
          Reel still: owner at the job, warm placeholder
        </span>
      </div>

      <SectionHeader
        id="home-reel-heading"
        heading="Customers check you online before they call."
        sub="They find a last post from months ago and quietly wonder if you're still in business. A page full of last week's jobs answers that before they ask."
        size="h2"
        align="center"
      />
    </PageSection>
  )
}
