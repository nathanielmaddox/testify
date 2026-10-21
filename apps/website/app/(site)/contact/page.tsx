// Contact page: the router page (intro, Sales and Support cards, footnote lines). No form.
import { ContactFootnotes } from '@/components/contact/contact_footnotes'
import { ContactIntro } from '@/components/contact/contact_intro'
import { ContactRouter } from '@/components/contact/contact_router'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('contact')

export default function ContactPage() {
  return (
    <PageSkeleton routeKey="contact" slots={[]}>
      <ContactIntro />
      <ContactRouter />
      <ContactFootnotes />
    </PageSkeleton>
  )
}
