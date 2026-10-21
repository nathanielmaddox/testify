// Home page (Paper frame "Testify Web - Home"): sections in Paper order, nav and footer come from the (site) chrome.
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { HomeClosing } from '@/components/home/home_closing'
import { HomeDarkPanel } from '@/components/home/home_dark_panel'
import { HomeEngine } from '@/components/home/home_engine'
import { HomeFaq } from '@/components/home/home_faq'
import { HomeHero } from '@/components/home/home_hero'
import { HomeOffer } from '@/components/home/home_offer'
import { HomePain } from '@/components/home/home_pain'
import { HomeReel } from '@/components/home/home_reel'
import { HomeTestimonials } from '@/components/home/home_testimonials'
import { HomeWhatWeDo } from '@/components/home/home_what_we_do'
import { pageMetadata } from '@/lib/metadata'
import { jsonLdScriptProps, serviceJsonLd } from '@/lib/structured_data'

export const metadata = pageMetadata('home')

/**
 * Home. Sections in Paper order. Sections are flush (no own padding); this stack sets the Paper rhythm:
 * 48px top, the 160px section gap between sections and 160px at the foot. Carries the offer as Service +
 * Offer JSON-LD (lib/structured_data.ts).
 */
export default function HomePage() {
  return (
    <>
      <script {...jsonLdScriptProps(serviceJsonLd('/'))} />
      <PageSkeleton routeKey="home" slots={[]}>
        <div className="flex flex-col gap-brand-section-gap pb-brand-section-gap pt-12">
          <HomeHero />
          <HomePain />
          <HomeReel />
          <HomeEngine />
          <HomeWhatWeDo />
          <HomeOffer />
          <HomeDarkPanel />
          <HomeTestimonials />
          <HomeFaq />
          <HomeClosing />
        </div>
      </PageSkeleton>
    </>
  )
}
