/**
 * Offer LP sample (Paper "a-sample", registry section `sample`): one example
 * week for a demo trade, the trade tags, and the buy CTA. Server component;
 * the tags and the CTA are client modules.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { slotProps, type LpSectionProps } from './section_props'
import { TradeTags } from './trade_tags'

export function Offer99Sample({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-sample-heading`
  return (
    <PageSection flush {...slotProps(lp, 'sample')} aria-labelledby={headingId} width="grid">
      <DisplayHeading
        level={2}
        id={headingId}
        size="h2"
        kicker="Don't take our word for it. Look."
        lead="Pick your trade. This is an example week for a demo business. Yours is made from your jobs, your photos and your words."
      >
        See a Full Week, Ready to Post
      </DisplayHeading>
      <TradeTags />
      <div className="flex h-[360px] items-center justify-center rounded-[40px] bg-brand-surface-sunken p-8 text-center">
        <p className="font-text text-brand-lead text-brand-ink-muted">
          [SAMPLE WEEK: [TRADE], 7 posts + 7 stories, real design work]
        </p>
      </div>
      <p className="font-text text-brand-lead text-brand-ink">
        Seven posts. Seven stories. Every caption written. Every day planned. Four weeks of this is
        your month.
      </p>
      <p className="font-text text-brand-small text-brand-ink-subtle">
        Example. Demo business. Your posts are made from your answers and your photos.
      </p>
      {href ? (
        <BuyCta
          href={href}
          lpSlug={lp.slug}
          label="Yes! Turn On My Open Sign: $99/Month"
          tone="action"
          caption="$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free."
        />
      ) : null}
    </PageSection>
  )
}
