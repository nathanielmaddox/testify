// About team: the three people behind the account in a 3-up grid, portrait placeholders and the small-team note.
import { PageSection } from '@testify/style-guide/components/PageSection'
import { SectionHeader } from '@/components/site/section_header'

const TEAM = [
  { role: 'Founder', bio: 'Plans your month, sends your questions and is your one contact.' },
  { role: 'Editor', bio: 'Edits, captions and checks every post before you see it.' },
  { role: 'Replies', bio: 'Drafts replies to your comments and messages for your OK.' },
]

export function AboutTeam() {
  return (
    <PageSection flush width="grid" aria-labelledby="team-heading" className="pt-brand-section-gap">
      <SectionHeader
        kicker="The team"
        heading="The people who work on your business."
        sub="The person you talk to first stays on your account. No hand-off to someone you've never met."
        size="h2"
        id="team-heading"
      />
      <ul className="grid grid-cols-1 gap-brand-grid md:grid-cols-3">
        {TEAM.map((member) => (
          <li
            key={member.role}
            className="flex flex-col gap-6 rounded-card bg-brand-surface p-4 pb-8 shadow-raised"
          >
            <div
              aria-hidden="true"
              className="aspect-[4/5] w-full rounded-media bg-brand-done-bg md:aspect-auto md:h-[300px]"
            />
            <div className="flex flex-col gap-2 px-4">
              <h3 className="font-display text-brand-h3 text-brand-ink">[NAME]</h3>
              <p className="font-text text-brand-body-strong text-brand-ink-subtle">
                {member.role}
              </p>
              <p className="font-text text-brand-lead text-brand-ink-muted">{member.bio}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="font-text text-brand-small text-brand-ink-subtle">
        We&apos;re a small team on purpose. One of us may do two jobs, and you&apos;ll always know
        who&apos;s doing what.
      </p>
    </PageSection>
  )
}
