/**
 * Retargeting closing (registry section `final-cta`) and P.S. block (registry
 * section `ps`). The close has a plain pre-line, H2, one sub line, the violet
 * buy CTA with its caption, and the reply line. The P.S. is the signed
 * paragraph with no CTA. Server components; the buy CTA is the client BuyCta.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { OPEN_SIGN_BUY_CAPTION, OPEN_SIGN_BUY_LABEL } from './open_sign_copy'
import { slotProps, type LpSectionProps } from './section_props'

export function Offer99RetargetClose({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-final-cta-heading`
  return (
    <PageSection flush {...slotProps(lp, 'final-cta')} aria-labelledby={headingId} width="grid">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <p className="font-text text-brand-body-strong text-brand-ink">
          You&apos;ve seen the whole deal.
        </p>
        <DisplayHeading
          level={2}
          id={headingId}
          size="display-xl"
          align="center"
          lead="Your first week is in your portal by [DATE]. Love it or it's free."
        >
          Start Showing Up Every Day From [DATE]
        </DisplayHeading>
        {href ? (
          <BuyCta
            href={href}
            lpSlug={lp.slug}
            label={OPEN_SIGN_BUY_LABEL}
            tone="action"
            caption={OPEN_SIGN_BUY_CAPTION}
            placement="close"
          />
        ) : null}
        <p className="font-text text-brand-small text-brand-ink-muted">
          Questions first? [NAME] replies within [N] hours: hello@[DOMAIN]
        </p>
      </div>
    </PageSection>
  )
}

export function Offer99RetargetPs({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-ps-heading`
  return (
    <PageSection flush {...slotProps(lp, 'ps')} aria-labelledby={headingId} width="prose">
      <div className="flex flex-col gap-6 font-text text-brand-body-xl leading-8 text-brand-ink">
        <p id={headingId}>[NAME], [ROLE], Testify</p>
        <p>
          <strong className="font-semibold">P.S.</strong> The only catch is that you press post.
          Everything else, the ideas, the captions, the designs and the posting days, we make for
          you. $99 a month, no contract, and if the first month isn&apos;t worth it, your money back
          and all 60 pieces stay yours.
        </p>
      </div>
    </PageSection>
  )
}
