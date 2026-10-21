// The listing's middle sections: the shared 90-day process (each step with its drawn asset mock), the won't-see dark panel, and the three-way compare. Server-safe; the compare grid is the DS table in a client module.
import type { ReactNode } from 'react'
import { SectionHeader } from '@/components/site/section_header'
import { WorkCompareTable } from '@/components/work/work_compare_table'
import { WorkCta } from '@/components/work/work_cta'
import { EmphasisPanel } from '@testify/style-guide/components/EmphasisPanel'
import { ProcessSteps, type ProcessStep } from '@testify/style-guide/components/ProcessSteps'

/** Process asset 1: the call notes that become the plan. Decorative (aria-hidden). */
function CallNotesAsset() {
  return (
    <div aria-hidden="true" className={ASSET}>
      <p className="font-text text-brand-small font-semibold text-brand-ink">Call notes</p>
      <div className="flex flex-col gap-2.5">
        <AssetRow label="Trade" value="[TRADE] in [TOWN]" />
        <AssetRow label="Best jobs" value="[N] to show" />
        <AssetRow label="Wins" value="[N] reviews, [N] repeat jobs" />
        <AssetRow label="Off limits" value="[N] topics" />
      </div>
      <p className="font-text text-brand-overline uppercase text-brand-action-text">Plan drafted</p>
    </div>
  )
}

/** Process asset 2: the first post, drafted from the owner's answers. */
function FirstPostAsset() {
  return (
    <div aria-hidden="true" className={ASSET}>
      <div className="flex items-center gap-2.5">
        <span className="size-8 shrink-0 rounded-full bg-brand-done-bg" />
        <span className="font-text text-brand-small font-semibold text-brand-ink">[BUSINESS]</span>
      </div>
      <span className="h-[84px] w-full rounded-2xl bg-brand-done-bg" />
      <p className="font-text text-brand-small text-brand-ink-muted">
        [N] jobs done this week in [TOWN]. Get started before Friday.
      </p>
    </div>
  )
}

/** Process asset 3: one post waiting for the owner's approval. */
function ApprovalAsset() {
  return (
    <div aria-hidden="true" className={ASSET}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-text text-brand-small font-semibold text-brand-ink">
          Post 4 of 12
        </span>
        <span className="font-text text-brand-small text-brand-ink-subtle">Waiting for you</span>
      </div>
      <span className="h-24 w-full rounded-2xl bg-brand-done-bg" />
      <p className="font-text text-brand-small text-brand-ink-muted">
        Nothing goes out until you say yes.
      </p>
      <div className="mt-auto flex gap-2">
        <span className="rounded-pill bg-brand-ink px-4 py-2.5 font-text text-brand-small font-semibold text-brand-surface">
          Approve
        </span>
        <span className="rounded-pill border border-brand-ink px-4 py-2.5 font-text text-brand-small font-semibold text-brand-ink">
          Change this
        </span>
      </div>
    </div>
  )
}

/** Process asset 4: the monthly summary, three measures with a bar each. */
function SummaryAsset() {
  return (
    <div aria-hidden="true" className={ASSET}>
      <p className="font-text text-brand-small font-semibold text-brand-ink">[Month] summary</p>
      <div className="flex flex-col gap-3">
        <SummaryBar
          label="Posts on schedule"
          value="[N] of [N]"
          fill="w-[78%]"
          tone="bg-brand-ink"
        />
        <SummaryBar label="Replies drafted" value="[N]" fill="w-[59%]" tone="bg-brand-ink" />
        <SummaryBar
          label="Median reply time"
          value="[N] hours"
          fill="w-[35%]"
          tone="bg-brand-action"
        />
      </div>
    </div>
  )
}

const ASSET = 'flex flex-col gap-3 rounded-card bg-brand-surface p-4 shadow-raised'

function AssetRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-[88px] shrink-0 font-text text-brand-small text-brand-ink-subtle">
        {label}
      </span>
      <span className="font-text text-brand-small text-brand-ink">{value}</span>
    </div>
  )
}

function SummaryBar({
  label,
  value,
  fill,
  tone,
}: {
  label: string
  value: string
  fill: string
  tone: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between gap-3">
        <span className="font-text text-brand-small text-brand-ink-muted">{label}</span>
        <span className="font-text text-brand-small font-semibold text-brand-ink">{value}</span>
      </div>
      <span className="h-1.5 w-full rounded-full bg-brand-done-bg">
        <span className={`block h-1.5 rounded-full ${fill} ${tone}`} />
      </span>
    </div>
  )
}

function StepBody({
  asset,
  when,
  yours,
  ours,
}: {
  asset: ReactNode
  when: string
  yours: string
  ours: string
}) {
  return (
    <div className="flex flex-col gap-5">
      {asset}
      <div className="flex flex-col gap-3">
        <p className="font-text text-brand-overline uppercase text-brand-ink-subtle">{when}</p>
        <p className="font-text text-brand-body-strong text-brand-ink">{yours}</p>
        <p className="font-text text-brand-small text-brand-ink-muted">{ours}</p>
      </div>
    </div>
  )
}

const PROCESS_STEPS = [
  {
    title: 'Plan',
    body: (
      <StepBody
        asset={<CallNotesAsset />}
        when="Start of the month"
        yours="Your part: [N] min to read the plan"
        ours="Our part: We write the month's posts and your question list."
      />
    ),
  },
  {
    title: 'Answer',
    body: (
      <StepBody
        asset={<FirstPostAsset />}
        when="Through the month"
        yours="Your part: A few questions, a minute or two each"
        ours="Our part: We tell you what to film, or use your voice and photos."
      />
    ),
  },
  {
    title: 'Approve',
    body: (
      <StepBody
        asset={<ApprovalAsset />}
        when="Every week"
        yours="Your part: Tap Approve or Change this"
        ours="Our part: We edit, caption and post on the planned day. We draft replies for your OK."
      />
    ),
  },
  {
    title: 'Summary',
    body: (
      <StepBody
        asset={<SummaryAsset />}
        when="End of the month"
        yours="Your part: [N] min to read"
        ours="Our part: One page, a source for every number."
      />
    ),
  },
] as const satisfies readonly ProcessStep[]

/** "How it runs": the four-step monthly track, then the quiet mid-page CTA. */
export function ListingProcess() {
  return (
    <>
      <SectionHeader
        id="work-process-heading"
        kicker="How it runs"
        heading="Your part, our part. Every month."
        size="display"
      />
      <ProcessSteps steps={PROCESS_STEPS} />
      <WorkCta
        caption={
          <p className="font-text text-brand-body text-brand-ink-muted">
            Three short questions, then pick a time.
          </p>
        }
      />
    </>
  )
}

const WONT_SHOW_ROWS = [
  'Follower counts',
  'View totals',
  'A glossy report',
  'Trend videos and stock footage',
  '"Results guaranteed"',
]

const WONT_SHOW_VALUES = [
  'Posts that went out on the planned day',
  'The minutes a week the owner spent',
  'One page, a source for every number',
  'Your own jobs, team and town',
  'What we put in writing, and whether we kept it',
]

/**
 * "What you won't see here": the listing's one dark panel. Two columns, what agencies
 * often show against what we show instead. The body is widened past the panel's
 * measure cap so the rows fill the panel, as in Paper.
 */
export function ListingWontShow() {
  return (
    <EmphasisPanel
      id="work-wont-show-heading"
      kicker="Straight talk"
      title="What you won't see here."
      width="full"
      className="[&>div]:w-full [&>div]:max-w-none"
    >
      <div className="flex w-full flex-col">
        <div className="flex flex-col gap-2 pb-6 md:flex-row md:gap-8">
          <p className="min-w-0 flex-1 font-text text-brand-overline uppercase text-brand-inverse-ink-muted">
            What agencies often show
          </p>
          <p className="min-w-0 flex-1 font-text text-brand-overline uppercase text-brand-inverse-ink">
            What we show instead
          </p>
        </div>
        {WONT_SHOW_ROWS.map((name, index) => (
          <div
            key={name}
            className="flex flex-col gap-2 border-t border-brand-inverse-ink/20 py-6 md:flex-row md:gap-8"
          >
            <p className="min-w-0 flex-1 font-text text-brand-body text-brand-inverse-ink-muted">
              {name}
            </p>
            <p className="min-w-0 flex-1 font-text text-brand-body-strong text-brand-inverse-ink">
              {WONT_SHOW_VALUES[index]}
            </p>
          </div>
        ))}
      </div>
    </EmphasisPanel>
  )
}

const COMPARE_ROWS = [
  'Your time',
  'Who decides what to post',
  'Who edits',
  'A busy week',
  'Sounds like you',
  'In writing',
  'If it ends',
]

/** "Compare": doing it yourself, hiring, and Testify, row by row. */
export function ListingCompare() {
  return (
    <>
      <SectionHeader
        id="work-compare-heading"
        kicker="Compare"
        heading="Three ways to get it done."
        size="display"
      />
      <div className="rounded-card bg-brand-surface p-brand-card shadow-raised">
        <WorkCompareTable
          rows={COMPARE_ROWS.map((name) => ({ name }))}
          highlightColumn={2}
          columns={[
            {
              name: 'Doing it yourself',
              values: [
                '[N] hours a week, when you get to it',
                'You, staring at a blank screen',
                'You, on your phone',
                'Posting stops',
                'Yes, if you find the time',
                'Nothing to hold anyone to',
                'The feed goes quiet',
              ],
            },
            {
              name: 'Hiring a freelancer or agency',
              values: [
                'Time spent briefing, checking and fixing',
                'Them, from what you brief',
                'Them',
                'Depends on their schedule',
                'Their guess at your voice',
                'Depends on the contract',
                'Check who holds the logins',
              ],
            },
            {
              name: 'Testify',
              values: [
                'About 15 minutes a week',
                'We do, from your answers',
                'We do. You OK every post.',
                'Still posts. The month was planned before it started.',
                'Built from your answers. You OK every word.',
                'Posts, dates and a monthly summary',
                'Leave any month. Your accounts and files stay yours.',
              ],
            },
          ]}
        />
      </div>
    </>
  )
}
