/**
 * Offer LP objections and FAQ (registry section `objections-faq`): plain
 * pre-line, H2, the eight questions in the shared accordion with the first
 * three open, and the email line under it. Server component; the accordion is
 * the client FaqList.
 */
import { FaqList } from '@/components/site/faq_list'
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const ITEMS = [
  {
    question: 'Do I still have to post it?',
    answer:
      "Yes. Each piece takes about a minute: copy the caption, download the file, post. Every piece tells you which day. Want us to post for you? That's our full service, not this plan.",
  },
  {
    question: 'How much of my time does it really take?',
    answer:
      'About 5 minutes a week to answer our questions. Then about a minute to post each piece, about 20 minutes a week in all. The thinking, writing and designing is ours.',
  },
  {
    question: "What's the catch at $99?",
    answer:
      "You press post. We make the content; we don't run your accounts. Running accounts is the expensive part of any agency, and it isn't in this plan. That's why it costs $99.",
  },
  {
    question: 'Do I have to be on camera?',
    answer:
      'No. No dancing, no trends, no filming days. We make posts from your job photos, your tools and your finished work, or graphics with no photo at all.',
  },
  {
    question: 'Will it sound like me?',
    answer:
      "It's made from your answers, so it uses your words. You see everything before you post it. Want a change? Ask and we redo it, as many times as you like.",
  },
  {
    question: 'Do you need my passwords?',
    answer: 'No. Never. Nothing goes out unless you post it.',
  },
  {
    question: 'Can I cancel?',
    answer:
      "Yes. Cancel in your portal in 2 clicks, any month. Everything you've received stays yours. [CONFIRM P4]",
  },
  {
    question: 'Will this get me more views or jobs?',
    answer:
      "We can't promise that, and we won't. We promise you show up every day, with posts made from your real work, on time.",
  },
] as const

export function Offer99Faq({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-objections-faq-heading`
  return (
    <PageSection
      flush
      {...slotProps(lp, 'objections-faq')}
      aria-labelledby={headingId}
      width="content"
    >
      <div className="flex flex-col gap-3">
        <p className="font-text text-brand-body-strong text-brand-ink">
          Questions? Straight answers.
        </p>
        <DisplayHeading level={2} id={headingId} size="h2">
          Straight Answers, Including &quot;What&apos;s the Catch?&quot;
        </DisplayHeading>
      </div>
      <div className="flex flex-col gap-6">
        <FaqList items={ITEMS} ariaLabel="Frequently asked questions" defaultOpenCount={3} />
        <p className="font-text text-brand-body text-brand-ink-muted">
          Something else? Email [NAME]: hello@[DOMAIN]. A real person answers within [N] hours.
          [CONFIRM]
        </p>
      </div>
    </PageSection>
  )
}
