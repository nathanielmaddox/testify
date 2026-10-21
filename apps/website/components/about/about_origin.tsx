// About origin: why the business started, the four-point story and a "what a stranger sees" photo card.
import { PageSection } from '@testify/style-guide/components/PageSection'
import { SectionHeader } from '@/components/site/section_header'

const STORY = [
  {
    n: '01',
    text: "Great work. Happy customers. Last post: three years ago. A stranger checks the page to see if they're still open, finds nothing new, and calls the next name.",
    ink: true,
  },
  {
    n: '02',
    text: 'Most owners had tried. Two weeks of posting, then a busy month, then nothing.',
    ink: false,
  },
  {
    n: '03',
    text: "Some paid an agency. They got a pretty report, a long contract and a handful of posts. A few ended up coaching the people they'd hired.",
    ink: false,
  },
  {
    n: '04',
    text: 'So we built the agency an owner would keep. You talk, we do the work, and it runs every week, not as a package. You can leave any month.',
    ink: false,
  },
]

// Tile tones follow the Paper photo card: warm accent tiles in the first row, plain tiles elsewhere.
// Plain tiles use the sunken tone so they read against the single white card surface.
const TILE_TONE = [
  'bg-brand-done-bg',
  'bg-brand-surface-sunken',
  'bg-brand-done-bg',
  'bg-brand-surface-sunken',
  'bg-brand-surface-sunken',
  'bg-brand-surface-sunken',
]

export function AboutOrigin() {
  return (
    <PageSection
      flush
      width="grid"
      aria-labelledby="origin-heading"
      className="pt-brand-section-gap"
    >
      <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex flex-col gap-12 lg:w-full lg:max-w-[480px] lg:shrink">
          <SectionHeader
            kicker="Why we started"
            heading='Their work was great. Their page said "closed".'
            size="h2"
            id="origin-heading"
          />
          <ul className="flex flex-col gap-[18px]">
            {STORY.map((item) => (
              <li key={item.n} className="flex gap-4">
                <span
                  className={`w-8 shrink-0 pt-1 font-text text-brand-small tabular-nums ${item.ink ? 'text-brand-ink' : 'text-brand-ink-subtle'}`}
                >
                  {item.n}
                </span>
                <p
                  className={`font-text text-brand-lead ${item.ink ? 'text-brand-ink' : 'text-brand-ink-muted'}`}
                >
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 rounded-card bg-brand-surface p-4 shadow-raised lg:w-full lg:max-w-[356px] lg:shrink">
          <div className="flex flex-col gap-4 rounded-media p-6">
            <div className="flex items-center gap-3.5">
              <span aria-hidden="true" className="size-14 shrink-0 rounded-full bg-brand-done-bg" />
              <div className="flex flex-col gap-1">
                <p className="font-text text-brand-body-strong text-brand-ink">[BUSINESS]</p>
                <p className="font-text text-brand-small text-brand-ink-subtle">
                  Last post 3 years ago
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TILE_TONE.map((tone, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`aspect-square w-full rounded-tile ${tone}`}
                />
              ))}
            </div>
          </div>
          <p className="px-2 pb-2 font-text text-brand-overline uppercase text-brand-ink-muted">
            What a stranger sees
          </p>
        </div>
      </div>
    </PageSection>
  )
}
