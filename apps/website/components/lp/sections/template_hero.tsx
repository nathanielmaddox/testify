/**
 * Template LP hero (registry section `hero`, Paper "Hero section" in frame
 * `lp/sample-ad`). Paper gives the hero frame and one primary violet CTA but no
 * headline or label copy, so the headline is a [HEADLINE] placeholder and the
 * CTA label is [CTA LABEL] until the owner writes them. An LP that sells an
 * offer links its CTA to checkout. An LP with no offer (the sample LP) links to
 * its form slot on the same page (`#lp-<slug>-form`, see lp_form_slot.tsx).
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { slotProps, type LpSectionProps } from './section_props'

export function TemplateHero({ lp }: LpSectionProps) {
  const checkoutHref = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-hero-heading`
  const formSlotHref = `#lp-${lp.slug}-form`
  return (
    <PageSection flush {...slotProps(lp, 'hero')} aria-labelledby={headingId} width="content">
      <DisplayHeading level={1} id={headingId} size="display-xl">
        [HEADLINE]
      </DisplayHeading>
      {checkoutHref ? (
        <BuyCta
          href={checkoutHref}
          lpSlug={lp.slug}
          label="[CTA LABEL]"
          caption="[PRICE, TERMS AND NEXT STEP]"
        />
      ) : (
        <BuyCta href={formSlotHref} lpSlug={lp.slug} label="[CTA LABEL]" sameDocument />
      )}
    </PageSection>
  )
}
