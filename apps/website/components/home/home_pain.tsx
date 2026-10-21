// Home pain section (Paper "03 Pain"): four white cards, two with small UI mocks. Server-safe, no DS import.
import type { ReactNode } from 'react'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { SectionHeader } from '@/components/site/section_header'

const REPORT_BARS = [24, 70, 40, 96, 52, 30, 64, 44, 22, 58, 34, 50] as const

function PainCard({
  span,
  kicker,
  title,
  body,
  children,
}: {
  span: 'wide' | 'narrow'
  kicker: string
  title: string
  body?: string
  children?: ReactNode
}) {
  return (
    <article
      className={`flex min-w-0 flex-col justify-between gap-8 rounded-card bg-brand-surface p-6 shadow-raised md:p-10 ${
        span === 'wide' ? 'md:col-span-2 lg:col-span-7' : 'lg:col-span-5'
      }`}
    >
      <div className="flex flex-col gap-3">
        <span className="font-text text-brand-label font-semibold text-brand-ink-subtle">
          {kicker}
        </span>
        <h3 className="font-display text-brand-h2 text-brand-ink">{title}</h3>
        {body ? <p className="font-text text-brand-lead text-brand-ink-muted">{body}</p> : null}
      </div>
      {children}
    </article>
  )
}

export function HomePain() {
  return (
    <PageSection
      flush
      width="grid"
      aria-labelledby="home-pain-heading"
      className="flex flex-col gap-16"
    >
      <SectionHeader
        id="home-pain-heading"
        kicker="Sound familiar?"
        heading="Posting falls off. Every time."
        sub="You post three times in week one. Then a job runs long, the truck needs fixing, and by 9pm the last thing you want is a blank screen asking what to say. Two weeks later the page is quiet again."
        size="h2"
        align="center"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
        <PainCard
          span="wide"
          kicker="Burned by an agency"
          title="Paid for months. Got two reels and a report."
          body="And somehow you still ended up explaining your own trade to them."
        >
          <div aria-hidden="true" className="flex flex-col gap-5 rounded-3xl bg-brand-canvas p-6">
            <div className="flex items-center justify-between">
              <span className="font-text text-brand-small font-semibold text-brand-ink">
                Monthly report
              </span>
              <span className="font-text text-brand-caption text-brand-ink-subtle">
                Agency summary, 2 posts
              </span>
            </div>
            <div className="flex h-[120px] items-end gap-1.5 md:gap-3.5">
              {REPORT_BARS.map((height, i) => (
                <span
                  key={i}
                  className="min-w-0 flex-1 rounded-md bg-brand-border"
                  style={{ height }}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-text text-brand-caption text-brand-ink-subtle">Reach</span>
                <span className="font-text text-brand-small font-semibold text-brand-ink">
                  2 posts
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-text text-brand-caption text-brand-ink-subtle">Charts</span>
                <span className="font-text text-brand-small font-semibold text-brand-ink">14</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-text text-brand-caption text-brand-ink-subtle">
                  Next steps
                </span>
                <span className="font-text text-brand-small font-semibold text-brand-ink">
                  Call us
                </span>
              </div>
            </div>
          </div>
        </PainCard>

        <PainCard
          span="narrow"
          kicker="Starting and stopping"
          title="Week one goes well. Then a busy week hits."
          body="The phone keeps ringing and the page goes quiet for a month."
        >
          <div
            aria-hidden="true"
            className="flex items-center gap-3.5 rounded-[20px] bg-brand-canvas px-[18px] py-4"
          >
            <span className="h-11 w-11 shrink-0 rounded-lg bg-brand-border" />
            <span className="font-text text-brand-small font-semibold text-brand-ink">
              [BUSINESS] · Last post: [N] weeks ago
            </span>
          </div>
        </PainCard>

        <PainCard
          span="narrow"
          kicker="No time"
          title="The job comes first. It should."
          body="Nobody pays you to edit videos at 9pm."
        />

        <PainCard
          span="wide"
          kicker="What to say"
          title="Staring at a blank screen isn't a plan."
          body="You know your trade inside out. Turning it into a caption is the part that stalls."
        />
      </div>
    </PageSection>
  )
}
