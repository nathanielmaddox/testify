/**
 * Offer LP objections and FAQ (Paper "a-faq", registry section
 * `objections-faq`): sixteen questions in the shared DS accordion. Paper gives
 * the questions only, so each answer is the [ANSWER] placeholder until the
 * owner writes it. Server component; the accordion is the client FaqList.
 */
import { FaqList } from '@/components/site/faq_list'
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const QUESTIONS = [
  'Do I still have to post it?',
  'How much of my time does it really take?',
  "What's the catch at $99?",
  'Do I have to be on camera?',
  'Will it sound like me?',
  "What if I don't like a post?",
  'Do you need my passwords?',
  'Who answers my comments and messages?',
  'Do I need to send photos?',
  'Which platforms is it made for?',
  'Can I cancel?',
  'Will this get me more views or jobs?',
  'Is this AI?',
  'What happens after I sign up?',
  'Can I talk to someone first?',
  "What if I don't like the first month?",
] as const

const ITEMS = QUESTIONS.map((question) => ({ question, answer: '[ANSWER]' }))

export function Offer99Faq({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-objections-faq-heading`
  return (
    <PageSection
      flush
      {...slotProps(lp, 'objections-faq')}
      aria-labelledby={headingId}
      width="content"
    >
      <DisplayHeading
        level={2}
        id={headingId}
        size="h2"
        kicker="Questions? Straight answers."
        lead="No fine print, no runaround. If your question isn't here, email us and a real person answers."
      >
        Straight Answers, Including &quot;What&apos;s the Catch?&quot;
      </DisplayHeading>
      <FaqList items={ITEMS} ariaLabel="Frequently asked questions" />
    </PageSection>
  )
}
