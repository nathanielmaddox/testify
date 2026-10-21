/**
 * Template LP guarantee (registry section `guarantee`, Paper "Guarantee
 * section"): the brand GuaranteeList under a section heading. Paper has only
 * component annotations for this section, so two bracketed placeholder
 * guarantees and the headline ([GUARANTEE HEADLINE]) stand in until the owner
 * writes them.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { GuaranteeList, type Guarantee } from '@testify/style-guide/components/GuaranteeList'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const GUARANTEES: readonly Guarantee[] = [
  { title: '[GUARANTEE 1 TITLE]', body: '[GUARANTEE 1 BODY]' },
  { title: '[GUARANTEE 2 TITLE]', body: '[GUARANTEE 2 BODY]' },
]

export function TemplateGuarantee({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-guarantee-heading`
  return (
    <PageSection flush {...slotProps(lp, 'guarantee')} aria-labelledby={headingId} width="grid">
      <DisplayHeading level={2} id={headingId} size="h2">
        [GUARANTEE HEADLINE]
      </DisplayHeading>
      <GuaranteeList guarantees={GUARANTEES} headingLevel={3} />
    </PageSection>
  )
}
