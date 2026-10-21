/**
 * Template LP FAQ (registry section `faq`, Paper "FAQ section"): the shared
 * FaqList (DS Accordion, card variant) under a section heading. Paper gives an
 * accordion but no questions, so two [QUESTION] / [ANSWER] placeholders stand in.
 * Paper has only component annotations for this section, so the headline is a
 * placeholder too: [FAQ HEADLINE].
 */
import { FaqList } from '@/components/site/faq_list'
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const ITEMS = [
  { question: '[QUESTION 1]', answer: '[ANSWER 1]' },
  { question: '[QUESTION 2]', answer: '[ANSWER 2]' },
] as const

export function TemplateFaq({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-faq-heading`
  return (
    <PageSection flush {...slotProps(lp, 'faq')} aria-labelledby={headingId} width="content">
      <DisplayHeading level={2} id={headingId} size="h2">
        [FAQ HEADLINE]
      </DisplayHeading>
      <FaqList items={ITEMS} ariaLabel="Frequently asked questions" />
    </PageSection>
  )
}
