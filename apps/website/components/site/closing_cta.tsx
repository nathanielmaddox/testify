'use client'

// Closing block at the end of a page: kicker, display headline, action CTA and reassurance.

import { CtaRow } from '@testify/style-guide/components/CtaRow'
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { Kicker } from '@testify/style-guide/components/Kicker'
import { useAttributedHref } from '@/components/lp/use_attributed_href'
import { siteConfig } from '@/lib/site.config'

/**
 * Closing block used as the last block of a page: centered kicker pill, one
 * display headline, optional sub line, the one violet (action) CTA of the
 * page, and a reassurance line under it. Defaults to the site CTA
 * (siteConfig.cta, run through useAttributedHref) when no label or href is
 * given. Client module because the CTA is a DS Link.
 */
export function ClosingCta({
  kicker,
  headline,
  sub,
  ctaLabel,
  ctaHref,
  reassurance,
  headingId,
}: {
  kicker?: string
  headline: string
  sub?: string | undefined
  ctaLabel?: string
  ctaHref?: string
  reassurance?: string | undefined
  /** Id for the headline, so a section can name itself with aria-labelledby. */
  headingId?: string | undefined
}) {
  const href = useAttributedHref(ctaHref ?? siteConfig.cta.href)

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <DisplayHeading
        level={2}
        size="display-xl"
        {...(headingId !== undefined ? { id: headingId } : {})}
      >
        {headline}
      </DisplayHeading>
      {sub ? (
        <p className="max-w-measure-narrow font-text text-brand-lead text-brand-ink-muted">{sub}</p>
      ) : null}
      <div className="mt-4">
        <CtaRow
          href={href}
          label={ctaLabel ?? siteConfig.cta.label}
          tone="action"
          caption={
            reassurance ? (
              <p className="mt-3 font-text text-brand-body text-brand-ink-muted">{reassurance}</p>
            ) : undefined
          }
        />
      </div>
    </div>
  )
}
