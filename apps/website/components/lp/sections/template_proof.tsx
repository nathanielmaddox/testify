/**
 * Template LP proof (registry section `proof`, Paper "Proof section"): one
 * ProofRow with figure, label, source and caveat. Paper gives no figures or
 * copy, so every value is a bracketed placeholder until the owner supplies
 * sourced figures. Paper has only component annotations for this section
 * (`PROOF — ProofRow with figure, label, source and required caveat`), so the
 * headline is a placeholder too: [PROOF HEADLINE] until the owner writes it.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { ProofRow, type ProofFigure } from '@testify/style-guide/components/ProofRow'
import { slotProps, type LpSectionProps } from './section_props'

const FIGURES: readonly [ProofFigure, ...ProofFigure[]] = [
  { value: '[FIGURE]', label: '[FIGURE LABEL]', source: '[SOURCE]' },
]

export function TemplateProof({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-proof-heading`
  return (
    <PageSection flush {...slotProps(lp, 'proof')} aria-labelledby={headingId} width="content">
      <DisplayHeading level={2} id={headingId} size="h2">
        [PROOF HEADLINE]
      </DisplayHeading>
      <ProofRow figures={FIGURES} caveat="[CAVEAT]" />
    </PageSection>
  )
}
