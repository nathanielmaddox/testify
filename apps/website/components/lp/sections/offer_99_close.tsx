/**
 * Offer LP closing (registry section `final-cta`) and the P.S. block
 * (registry section `ps`). Server components. The close has the plain
 * pre-line, H2, sub, the [DATE] line, and the violet buy CTA with its caption.
 * The P.S. has the sign-off and the one paragraph, with no CTA.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { OPEN_SIGN_BUY_CAPTION, OPEN_SIGN_BUY_LABEL } from './open_sign_copy'
import { slotProps, type LpSectionProps } from './section_props'

export function Offer99Close({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-final-cta-heading`
  return (
    <PageSection flush {...slotProps(lp, 'final-cta')} aria-labelledby={headingId} width="grid">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <p className="font-text text-brand-body-strong text-brand-ink">
          So here&apos;s where you&apos;re at.
        </p>
        <DisplayHeading
          level={2}
          id={headingId}
          size="display-xl"
          align="center"
          lead="One road costs you less than one appointment a month. The other costs you another quiet month."
        >
          A Full Page, or Another Quiet Month?
        </DisplayHeading>
        <p className="font-text text-brand-body-lg text-brand-ink">
          Sign up today and your first week is in your portal by [DATE].
        </p>
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
      </div>
    </PageSection>
  )
}

export function Offer99Ps({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-ps-heading`
  return (
    <PageSection flush {...slotProps(lp, 'ps')} aria-labelledby={headingId} width="prose">
      <div className="flex flex-col gap-6 font-text text-brand-body-xl leading-8 text-brand-ink">
        <h2 id={headingId} className="sr-only">
          Postscript
        </h2>
        <div className="flex flex-col gap-1">
          <p>To your success,</p>
          <p>
            <strong className="font-semibold">[NAME]</strong>, [ROLE], Testify
          </p>
        </div>
        <p>
          <strong className="font-semibold">P.S.</strong> The whole thing in one breath: we make a
          post and a story for every day of the month from your real jobs, captions in your voice,
          each one telling you which day it goes out. Your part takes less time each week than one
          customer call. Then you press post. $99 a month, no contract, and your first month is love
          it or it&apos;s free. [CONFIRM P4] Even if you ask for your money back, you keep all 60
          pieces.
        </p>
      </div>
    </PageSection>
  )
}
