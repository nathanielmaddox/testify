/**
 * Offer LP team (Paper "a-team", registry section `team`): who makes the
 * posts. Three person slots with placeholder name, role and line, plus the
 * contact line. Server component. The photo slots are placeholders (Paper
 * shows a blank tile), so they render as plain tiles, not MediaFrame.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const PEOPLE = [0, 1, 2] as const

export function Offer99Team({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-team-heading`
  return (
    <PageSection flush {...slotProps(lp, 'team')} aria-labelledby={headingId} width="grid">
      <DisplayHeading
        level={2}
        id={headingId}
        size="h2"
        kicker={'"Who are you people, anyway?" Fair question.'}
        lead="You'll know exactly who's working on your page, and how to reach them."
      >
        Real People Make Every Post
      </DisplayHeading>
      <p className="max-w-measure font-text text-brand-lead text-brand-ink">
        Behind every post is a real person on our team who learns how you talk, what you&apos;re
        proud of and what your customers always ask, so your page sounds like you on a good day.
      </p>
      <ul className="grid gap-6 md:grid-cols-3">
        {PEOPLE.map((index) => (
          <li
            key={index}
            className="flex flex-col gap-4 rounded-[40px] bg-brand-surface p-4 pb-6 shadow-raised"
          >
            <div aria-hidden="true" className="aspect-[4/5] rounded-[24px] bg-brand-done-bg" />
            <div className="flex flex-col gap-1 px-2">
              <h3 className="font-display text-brand-h3 text-brand-ink">[NAME]</h3>
              <p className="font-text text-brand-small font-semibold text-brand-ink-muted">
                [ROLE]
              </p>
              <p className="font-text text-brand-body text-brand-ink">
                [One plain sentence about what they do for you]
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-3">
        <p className="font-text text-brand-lead text-brand-ink-muted">
          Questions? [NAME] replies within [N] hours: hello@[DOMAIN]
        </p>
        <p className="font-text text-brand-small text-brand-ink-subtle">
          We use tools to work faster. A person on our team checks every piece before you see it.
        </p>
      </div>
    </PageSection>
  )
}
