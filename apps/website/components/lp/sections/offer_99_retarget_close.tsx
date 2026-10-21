/**
 * Retargeting closing (Paper frame "Section - Close", registry section
 * `final-cta`) and P.S. block (Paper frame "Section - P.S.", registry section
 * `ps`). Server components; the buy CTA is the client BuyCta.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { slotProps, type LpSectionProps } from './section_props'

const CLOSE_PARAGRAPHS = [
  "You've seen what you get. You've seen what it takes. You've seen that the risk is ours.",
  'So the choice is simple.',
  'Another month of "I\'ll post something tomorrow"…',
  'Or a month from now, scrolling a page full of your own best work, a post and a story for every day, and knowing you gave it less time than one appointment a month.',
] as const

export function Offer99RetargetClose({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-final-cta-heading`
  return (
    <PageSection flush {...slotProps(lp, 'final-cta')} aria-labelledby={headingId} width="content">
      <div className="flex flex-col items-center gap-8 text-center">
        <DisplayHeading
          level={2}
          id={headingId}
          size="h2"
          kicker="Last thing, then it's over to you."
          lead="One Monday coffee a week from you. You press post. Love it or it's free."
        >
          Start Showing Up Every Day From [DATE]
        </DisplayHeading>
        <div className="flex max-w-measure flex-col gap-5 text-left">
          {CLOSE_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph} className="font-text text-brand-body-xl leading-8 text-brand-ink">
              {paragraph}
            </p>
          ))}
        </div>
        <p className="font-text text-brand-small text-brand-ink-muted">
          Questions first? [NAME] replies within [N] hours: hello@[DOMAIN]
        </p>
        {href ? (
          <BuyCta
            href={href}
            lpSlug={lp.slug}
            label="Yes! Turn On My Open Sign"
            tone="action"
            caption="$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free."
          />
        ) : null}
      </div>
    </PageSection>
  )
}

export function Offer99RetargetPs({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-ps-heading`
  return (
    <PageSection flush {...slotProps(lp, 'ps')} aria-labelledby={headingId} width="prose">
      <div className="flex flex-col gap-6 font-text text-brand-body-xl leading-8 text-brand-ink">
        <p id={headingId}>[NAME], [ROLE], Testify</p>
        <p>
          P.S. The only catch is that you press post. Everything else, the ideas, the captions, the
          designs and the posting days, we make for you. $99 a month, no contract, and if the first
          month isn&apos;t worth it, your money back and all 60 pieces stay yours.
        </p>
        {href ? (
          <BuyCta
            href={href}
            lpSlug={lp.slug}
            label="Yes! Turn On My Open Sign"
            tone="action"
            caption="$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free."
          />
        ) : null}
      </div>
    </PageSection>
  )
}
