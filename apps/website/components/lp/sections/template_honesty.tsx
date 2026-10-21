/**
 * Template LP honesty (registry section `honesty`, Paper "Honesty section"):
 * the brand HonestyBlock with a section heading above it. Paper has only
 * component annotations for this section, so every line, the title and the
 * headline are bracketed placeholders until the owner writes them.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { HonestyBlock } from '@testify/style-guide/components/HonestyBlock'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const ITEMS = ['[LIMIT 1]', '[LIMIT 2]', '[LIMIT 3]'] as const

export function TemplateHonesty({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-honesty-heading`
  return (
    <PageSection flush {...slotProps(lp, 'honesty')} aria-labelledby={headingId} width="content">
      <DisplayHeading level={2} id={headingId} size="h2">
        [HONESTY HEADLINE]
      </DisplayHeading>
      <HonestyBlock title="[HONESTY TITLE]" items={ITEMS} note="[NOTE]" />
    </PageSection>
  )
}
