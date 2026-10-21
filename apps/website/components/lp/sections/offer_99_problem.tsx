/**
 * Offer LP problem section (Paper "a-pain", registry section `problem`): why
 * the usual fixes fail, three cards, and the closing pair of lines. Server
 * component, no DS import. The Paper card icons (lightbulb, image, clock)
 * are not in the brand icon set, so the cards carry text only.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const FIXES = [
  {
    title: 'Great advice, from people not on the tools.',
    body: 'Everyone says it. Nobody tells you what to post, when, or where the hour to make it comes from. The posting takes a minute. Deciding what to post eats the whole evening.',
  },
  {
    title: "A design app doesn't write your caption.",
    body: 'You still need the idea, the photo, the words and the hour after dinner to put them together. A blank template is still a blank screen, just with nicer fonts.',
  },
  {
    title: 'Big retainer. Long contract. Not your voice.',
    body: 'Plenty of owners have paid thousands, waited weeks, then ended up coaching the people they hired. As one owner put it: "I can earn the money again. I can\'t get those months back."',
  },
] as const

export function Offer99Problem({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-problem-heading`
  return (
    <PageSection flush {...slotProps(lp, 'problem')} aria-labelledby={headingId} width="grid">
      <DisplayHeading
        level={2}
        id={headingId}
        size="h2"
        kicker="Tried fixing this before?"
        lead="You don't need another app, another course or another contract. You need the thinking, the writing and the designing taken off your plate entirely."
      >
        Why the Usual Fixes Don&apos;t Work
      </DisplayHeading>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FIXES.map((fix) => (
          <li
            key={fix.title}
            className="flex min-w-0 flex-col gap-4 rounded-[40px] bg-brand-surface p-brand-card shadow-raised md:last:col-span-2 lg:last:col-span-1"
          >
            <h3 className="font-display text-brand-h3 text-brand-ink">{fix.title}</h3>
            <p className="font-text text-brand-body text-brand-ink-muted">{fix.body}</p>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-4">
        <p className="max-w-measure font-display text-[32px] leading-9 tracking-[-0.02em] font-medium text-brand-ink">
          You&apos;re not lazy. You&apos;re busy doing the work. So your page goes quiet.
        </p>
        <p className="font-display text-[32px] leading-9 tracking-[-0.02em] font-semibold text-brand-ink">
          The problem was never you. It&apos;s that every fix still left the hard part on your
          plate.
        </p>
      </div>
    </PageSection>
  )
}
