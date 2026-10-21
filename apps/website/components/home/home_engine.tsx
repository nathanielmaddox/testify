'use client'

// Home content engine (Paper "02 Content engine"): In -> Engine -> Out, three white cards joined by arrows.
// Client module: the arrows are the brand BrandIcon and the status pills are the DS Badge. Cards grow with
// their content (no fixed height) and stretch to the tallest, so the three columns align.
import type { ReactNode } from 'react'
import { Badge } from '@otesse/design-system'
import { BrandIcon } from '@testify/style-guide/components/BrandIcon'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { SectionHeader } from '@/components/site/section_header'

const ENGINE_ROWS = [
  { label: 'Strategy', value: 'Monthly', done: false },
  { label: 'Posts and videos', value: 'Every week', done: false },
  { label: 'Captions', value: 'Every post', done: false },
  { label: 'Posting', value: 'On schedule', done: false },
  { label: 'Replies', value: 'Drafted for your OK', done: true },
] as const

const TILE_TONES = ['bg-brand-done-bg', 'bg-brand-done-bg-strong', 'bg-brand-canvas-alt'] as const

function FlowCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-5 rounded-[40px] bg-brand-surface p-6 shadow-raised lg:flex-1">
      <span className="font-text text-brand-overline uppercase text-brand-ink-subtle">{label}</span>
      {children}
    </div>
  )
}

function FlowArrow() {
  return (
    <div
      aria-hidden="true"
      className="flex h-12 items-center justify-center text-brand-ink-subtle lg:h-auto lg:w-12 lg:shrink-0"
    >
      <span className="rotate-90 lg:rotate-0">
        <BrandIcon name="ArrowRight" />
      </span>
    </div>
  )
}

export function HomeEngine() {
  return (
    <PageSection
      flush
      width="grid"
      aria-labelledby="home-engine-heading"
      className="flex flex-col items-center gap-16"
    >
      <SectionHeader
        id="home-engine-heading"
        kicker="How it runs"
        heading="Your content engine. Always on."
        sub="Each month we send the plan and a few questions. You answer on your phone, about 15 minutes a week. We turn it into finished posts, put them out on schedule and draft every reply for your OK."
        size="display"
        align="center"
      />

      <div className="flex w-full flex-col items-center lg:flex-row lg:items-stretch">
        <FlowCard label="In">
          <div className="flex aspect-square w-full shrink-0 items-end rounded-3xl bg-brand-done-bg p-4">
            <span className="font-text text-brand-label font-semibold text-brand-done-fg">
              [VIDEO 9:16 — owner answering a question on their phone, 2 min]
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-display text-brand-h2 text-brand-ink">Your answers</span>
            <span className="font-text text-brand-lead text-brand-ink-muted">
              Two-minute clips, photos of the job, a tap to approve.
            </span>
          </div>
        </FlowCard>

        <FlowArrow />

        <FlowCard label="Engine">
          <span className="font-display text-brand-h2 text-brand-ink">
            We plan, make, post and reply
          </span>
          <ul className="flex flex-col gap-2">
            {ENGINE_ROWS.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-3 rounded-2xl bg-brand-canvas px-4 py-3.5"
              >
                <span className="font-text text-brand-body-strong text-brand-ink">{row.label}</span>
                <Badge
                  variant={row.done ? 'success' : 'default'}
                  appearance="soft"
                  size="sm"
                  radius="full"
                  fontWeight="semibold"
                >
                  {row.value}
                </Badge>
              </li>
            ))}
          </ul>
        </FlowCard>

        <FlowArrow />

        <FlowCard label="Out">
          <div
            aria-hidden="true"
            className="flex w-[200px] flex-col self-center rounded-[34px] bg-brand-ink p-[7px] shadow-lifted"
          >
            <div className="flex h-[286px] flex-col overflow-hidden rounded-[28px] bg-brand-surface">
              <div className="flex items-center gap-2 px-3 pb-2.5 pt-3.5">
                <span className="h-[26px] w-[26px] shrink-0 rounded-full bg-brand-done-bg" />
                <span className="font-text text-xs font-semibold text-brand-ink">[BUSINESS]</span>
              </div>
              <div className="grid grid-cols-3 gap-[3px]">
                {Array.from({ length: 12 }, (_, i) => (
                  <span
                    key={i}
                    className={`aspect-square w-full ${TILE_TONES[i % TILE_TONES.length]}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-display text-brand-h2 text-brand-ink">
              A page that&apos;s always active
            </span>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="default"
                appearance="soft"
                size="md"
                radius="full"
                fontWeight="semibold"
              >
                New posts every week
              </Badge>
            </div>
          </div>
        </FlowCard>
      </div>

      <p className="text-center font-text text-brand-lead font-semibold text-brand-ink">
        Never wonder what to post. Never touch an edit or a schedule. About 15 minutes a week from
        you.
      </p>
    </PageSection>
  )
}
