/**
 * Offer LP letter (Paper "a-letter", registry section `letter`): the opening
 * letter to the owner, with the pull line set in the display face between
 * rules. Server component, no DS import.
 */
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const BEFORE_PULL = [
  'If you\'ve ever pulled into the driveway after a ten-hour day, opened Facebook to "quickly post something"… and closed it again five minutes later with nothing posted…',
  'This letter is for you.',
  "Because here's the thing.",
  "You're not bad at social media. You're not lazy. And you're definitely not \"behind the times\".",
  "You're busy. You're busy doing the actual work. The work that pays the bills, keeps the crew paid and keeps your customers coming back.",
  'The trouble is, nobody online can see any of it.',
  "While you're under a sink at 8am, or on a roof in the heat, or finishing a client's color at 7pm, your page just sits there. Quiet. Same old post from [MONTH]. Same blurry photo of the truck.",
  "And every day, people you'll never meet are looking you up.",
] as const

const PULL = "Your work is the best advert you've got. It just never gets posted."

const AFTER_PULL = [
  'So I want to show you a simple way to fix that.',
  'A way to have a fresh post and a fresh story go up on your page every single day of the month… without you thinking up a single idea, writing a single caption or opening a single design app.',
  'It takes less of your week than one customer phone call. Then you press post.',
  "That's it. That's the whole deal.",
  'Let me show you exactly how it works.',
] as const

const BODY = 'font-text text-brand-body-xl leading-8 text-brand-ink'

export function Offer99Letter({ lp }: LpSectionProps) {
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
        {BEFORE_PULL.map((paragraph) => (
          <p key={paragraph} className={BODY}>
            {paragraph}
          </p>
        ))}
        <p className="flex flex-col gap-4 border-y border-brand-ink py-8 text-center font-display text-[36px] italic leading-[44px] tracking-[-0.02em] text-brand-ink">
          {PULL}
        </p>
        {AFTER_PULL.map((paragraph) => (
          <p key={paragraph} className={BODY}>
            {paragraph}
          </p>
        ))}
      </div>
    </PageSection>
  )
}
