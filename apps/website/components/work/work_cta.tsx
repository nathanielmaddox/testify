'use client'

// Work-page CTAs: the site CTA (siteConfig.cta) run through useAttributedHref. Client module because the CTA is a style-guide client composition.
import { ClosingCta } from '@/components/site/closing_cta'
import { useAttributedHref } from '@/components/lp/use_attributed_href'
import { CtaRow, type CtaTone } from '@testify/style-guide/components/CtaRow'
import type { ReactNode } from 'react'
import { siteConfig } from '@/lib/site.config'

const CTA_LABEL = 'Get started'

/** Inline CTA row for the middle and top of a work page. */
export function WorkCta({ tone = 'quiet', caption }: { tone?: CtaTone; caption?: ReactNode }) {
  const href = useAttributedHref(siteConfig.cta.href)
  return <CtaRow href={href} label={CTA_LABEL} tone={tone} caption={caption} />
}

/** The closing block of a work page: kicker, headline, sub line, violet CTA, reassurance. `headingId` names the section. */
export function WorkClosingCta({
  kicker,
  headline,
  sub,
  reassurance,
  headingId,
}: {
  kicker: string
  headline: string
  sub?: string
  reassurance?: string
  headingId?: string
}) {
  const href = useAttributedHref(siteConfig.cta.href)
  return (
    <ClosingCta
      kicker={kicker}
      headline={headline}
      sub={sub}
      ctaLabel={CTA_LABEL}
      ctaHref={href}
      reassurance={reassurance}
      headingId={headingId}
    />
  )
}
