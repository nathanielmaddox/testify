// Home what-we-do section (Paper "06 What we do"): three alternating white rows, each with a UI mock.
// Server-safe, no DS import. Mocks are decorative (aria-hidden); the row text carries the meaning.
import type { ReactNode } from 'react'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { SectionHeader } from '@/components/site/section_header'

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const
const WEEK_CARDS = [
  { tag: 'Reel', text: 'Job site, before and after' },
  { tag: 'Carousel', text: "Five signs it's time" },
  { tag: 'Post', text: 'Team photo, one line' },
  { tag: 'Reel', text: 'Owner answers a question' },
  { tag: 'Story', text: "This week's offer" },
] as const

function RowText({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-4 lg:w-2/5 lg:shrink-0">
      <span className="font-text text-brand-label font-semibold text-brand-ink-subtle">
        {label}
      </span>
      <h3 className="font-display text-brand-h2 text-brand-ink">{title}</h3>
      <p className="font-text text-brand-lead text-brand-ink-muted">{body}</p>
    </div>
  )
}

function Row({ reverse, children }: { reverse?: boolean; children: ReactNode }) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-6 rounded-card bg-brand-surface p-6 shadow-raised md:p-10 lg:items-center lg:gap-10 ${
        reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
      }`}
    >
      {children}
    </div>
  )
}

export function HomeWhatWeDo() {
  return (
    <PageSection
      flush
      width="grid"
      aria-labelledby="home-what-we-do-heading"
      className="flex flex-col gap-16"
    >
      <SectionHeader
        id="home-what-we-do-heading"
        kicker="What we do"
        heading="Everything your page needs. None of the evenings."
        sub="Built from your answers, in your words. Nothing goes out until you say yes."
        size="h2"
        align="center"
      />

      <div className="flex flex-col gap-6">
        <Row>
          <RowText
            label="01 Plan"
            title="Your month, planned before it starts."
            body="At the start of each month you get one page: what goes out, which day, and the questions we need answered. Read it with your coffee. Reply with a thumbs-up or a change."
          />
          <div
            aria-hidden="true"
            className="flex w-full min-w-0 flex-col gap-3 overflow-x-auto rounded-3xl p-4 lg:flex-1"
          >
            <div className="grid min-w-[520px] grid-cols-5 gap-2 lg:min-w-0">
              {WEEK_DAYS.map((day) => (
                <span key={day} className="font-text text-xs font-semibold text-brand-ink-subtle">
                  {day}
                </span>
              ))}
            </div>
            <div className="grid min-w-[520px] grid-cols-5 gap-2 lg:min-w-0">
              {WEEK_CARDS.map((card) => (
                <div
                  key={card.text}
                  className="flex h-24 flex-col gap-1.5 rounded-md border border-brand-border p-2.5"
                >
                  <span className="font-text text-xs font-semibold text-brand-done-fg">
                    {card.tag}
                  </span>
                  <span className="font-text text-xs text-brand-ink">{card.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-full bg-brand-canvas px-3 py-1 font-text text-xs text-brand-ink-muted">
                Plan sent [day] of the month
              </span>
              <span className="rounded-full bg-brand-canvas px-3 py-1 font-text text-xs text-brand-ink-muted">
                Questions: 5 min
              </span>
            </div>
          </div>
        </Row>

        <Row reverse>
          <RowText
            label="02 Make"
            title="Phone clips, turned into finished posts."
            body="Film a two-minute answer between jobs, or send photos of the finished work. We cut it, caption it in your words and size it for each platform. Don't want to be on camera? Hands, tools and your voice work fine."
          />
          <div
            aria-hidden="true"
            className="flex w-full min-w-0 items-center justify-center rounded-3xl p-6 lg:flex-1"
          >
            <div className="flex h-[480px] w-[270px] max-w-full flex-col rounded-[44px] bg-brand-ink p-2 shadow-lifted">
              <div className="flex h-[464px] w-full flex-col overflow-hidden rounded-[37px] bg-brand-surface">
                <div className="flex items-center gap-2.5 px-3.5 pb-2.5 pt-[34px]">
                  <span className="h-8 w-8 shrink-0 rounded-full bg-brand-done-bg" />
                  <div className="flex flex-col">
                    <span className="font-text text-brand-small font-semibold text-brand-ink">
                      [BUSINESS]
                    </span>
                    <span className="font-text text-xs text-brand-ink-subtle">[TOWN]</span>
                  </div>
                </div>
                <div className="flex h-[260px] shrink-0 items-end bg-brand-done-bg p-3">
                  <span className="font-text text-xs font-semibold text-brand-done-fg">
                    Photo: finished job, 9:16 clip
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-3.5">
                  <span className="font-text text-brand-small text-brand-ink">
                    Cut from your two-minute answer. Captioned, timed, posted.
                  </span>
                  <span className="self-start rounded-full bg-brand-canvas px-2.5 py-1 font-text text-xs font-semibold text-brand-ink-muted">
                    Approved by you
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Row>

        <Row>
          <RowText
            label="03 Post and reply"
            title="Posted on time. Replies drafted for your OK."
            body="Every post goes out on the day we agreed. When a neighbor asks if you work weekends, a reply is waiting for your tap, so a question never sits for a week."
          />
          <div
            aria-hidden="true"
            className="flex w-full min-w-0 flex-col gap-4 rounded-3xl p-6 lg:flex-1"
          >
            <div className="flex flex-col gap-1.5 rounded-[20px] border border-brand-border px-5 py-4">
              <span className="font-text text-xs font-semibold text-brand-ink-muted">
                Comment on your post, [TOWN]
              </span>
              <span className="font-text text-base text-brand-ink">
                Do you do emergency callouts after 6?
              </span>
            </div>
            <div className="flex flex-col gap-2.5 rounded-[20px] border border-brand-border px-5 py-4">
              <span className="font-text text-xs font-semibold text-brand-done-fg">
                Draft reply, waiting for your OK
              </span>
              <span className="font-text text-base text-brand-ink">
                [REPLY TEXT: owner to supply]
              </span>
              <div className="flex gap-2.5 pt-1.5">
                <span className="flex items-center rounded-full bg-brand-ink px-5 py-2.5 font-text text-brand-small font-semibold text-brand-surface">
                  Approve
                </span>
                <span className="flex items-center rounded-full border border-brand-ink px-5 py-2.5 font-text text-brand-small font-semibold text-brand-ink">
                  Change this
                </span>
              </div>
            </div>
          </div>
        </Row>
      </div>
    </PageSection>
  )
}
