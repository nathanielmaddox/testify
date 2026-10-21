/**
 * Retargeting opening letter (Paper frame "Section - Letter"): a short note to
 * someone who looked at the offer and did not buy. Server component, no DS
 * import.
 */
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const PARAGRAPHS = [
  'You were here the other day, looking at Open Sign, our ready-to-post plan.',
  "You didn't sign up. That's fine. Smart, even. You've probably been promised the world before.",
  'So let me make this really simple.',
  "Here's what you get: a post and a story for every day of the month, made from your real jobs, captions written in your voice, each one telling you which day it goes out.",
  "Here's what it takes from you: a few answers a week (less time than a customer call), and a minute to press post.",
  "Here's what it costs: $99 a month, no contract.",
  "And here's what happens if you don't love it: you get your money back, and you keep everything we made.",
  "That's the whole deal. No small print hiding underneath.",
] as const

const BODY = 'font-text text-brand-body-xl leading-8 text-brand-ink'

export function Offer99RetargetLetter({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-letter-heading`
  return (
    <PageSection flush {...slotProps(lp, 'letter')} aria-labelledby={headingId} width="prose">
      <div className="flex flex-col gap-6">
        <h2
          id={headingId}
          className="font-text text-brand-body-xl font-semibold leading-8 text-brand-ink"
        >
          Dear Local Business Owner,
        </h2>
        {PARAGRAPHS.map((paragraph) => (
          <p key={paragraph} className={BODY}>
            {paragraph}
          </p>
        ))}
        <p className="font-text text-brand-body-xl font-semibold leading-8 text-brand-ink">
          So the only real question left is this: what&apos;s stopping you?
        </p>
        <p className={BODY}>Let&apos;s go through it.</p>
      </div>
    </PageSection>
  )
}
