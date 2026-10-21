// About numbers: the three headline figures with their sources, shown as a proof row.
import { PageSection } from '@testify/style-guide/components/PageSection'
import { ProofRow } from '@testify/style-guide/components/ProofRow'
import { SectionHeader } from '@/components/site/section_header'

export function AboutNumbers() {
  return (
    <PageSection
      flush
      width="grid"
      aria-labelledby="numbers-heading"
      className="pt-brand-section-gap"
    >
      <SectionHeader
        kicker="The numbers"
        heading="[N] posts. [N] businesses. [N]% on time."
        size="h2"
        id="numbers-heading"
      />
      <ProofRow
        figures={[
          { value: '[N]', label: 'Posts published', source: '[SOURCE]' },
          { value: '[N]', label: 'Local businesses', source: '[SOURCE]' },
          { value: '[N]%', label: 'Posts on time', source: '[SOURCE]' },
        ]}
      />
    </PageSection>
  )
}
