'use client'

// Home closing CTA (Paper "System - Closing CTA"): the shared ClosingCta with Home's copy and the attributed
// default-LP href. Client module because the CTA reads stored attribution after mount.
import { PageSection } from '@testify/style-guide/components/PageSection'
import { ClosingCta } from '@/components/site/closing_cta'
import { useAttributedHref } from '@/components/lp/use_attributed_href'
import { siteConfig } from '@/lib/site.config'

export function HomeClosing() {
  const bookHref = useAttributedHref(siteConfig.cta.href)

  return (
    <PageSection flush width="grid" as="div">
      <ClosingCta
        kicker="Your next step"
        headline="Leave the call with your first month planned."
        ctaLabel="Get started"
        ctaHref={bookHref}
        reassurance="A few quick questions, then a 15-minute call. You keep the post ideas, hire us or not."
      />
    </PageSection>
  )
}
