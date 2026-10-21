/**
 * Retargeting team (Paper frame "Section - Team", registry section `team`):
 * who makes the posts, three person slots with placeholder name, role and line
 * (the first card carries the "Your point of contact" tag), and the contact
 * line. Server component. Photo slots are plain placeholder tiles, not
 * MediaFrame, because Paper shows blank tiles.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const PEOPLE = [0, 1, 2] as const

export function Offer99RetargetTeam({ lp }: LpSectionProps) {
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
            <div
              aria-hidden="true"
              className="flex aspect-[4/5] items-start rounded-[24px] bg-brand-done-bg p-4"
            >
              {index === 0 ? (
                <span className="rounded-pill bg-brand-surface px-3.5 py-1.5 font-text text-brand-caption font-semibold text-brand-ink">
                  Your point of contact
                </span>
              ) : null}
            </div>
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
