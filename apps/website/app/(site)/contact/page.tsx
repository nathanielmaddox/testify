// Contact page: a booking page. Intro, then one booking card (the owner's scheduling embed, or a calendar
// placeholder when NEXT_PUBLIC_BOOKING_EMBED_URL is unset), then the existing-client support line.
// The router cards, the steps, and the footnote and press lines live in components/contact but are NOT rendered.
import { BookingEmbed } from '@/components/contact/booking_embed'
import { ContactIntro } from '@/components/contact/contact_intro'
import { ContactSupportLine } from '@/components/contact/contact_support_line'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'
import { PageSection } from '@testify/style-guide/components/PageSection'

export const metadata = pageMetadata('contact')

export default function ContactPage() {
  return (
    <PageSkeleton routeKey="contact" slots={[]}>
      <ContactIntro />
      <PageSection flush width="grid" aria-label="Book a time" className="pt-brand-section-gap">
        <BookingEmbed />
        <ContactSupportLine />
      </PageSection>
    </PageSkeleton>
  )
}
