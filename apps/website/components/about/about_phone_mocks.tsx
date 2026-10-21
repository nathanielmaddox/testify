// About phone mocks: two simplified phone screens (a profile grid and a post approval) for the "Who we work for" card.
// Decorative only: no images, no live controls, so the whole mock is aria-hidden.
import type { ReactNode } from 'react'

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[260/460] w-[min(260px,100%)] flex-col rounded-[44px] bg-brand-ink p-2.5"
    >
      <div className="flex grow flex-col gap-3.5 rounded-[36px] bg-brand-canvas px-[18px] pb-[18px] pt-7">
        {children}
      </div>
    </div>
  )
}

function ProfileScreen() {
  return (
    <PhoneFrame>
      <div className="flex items-center gap-3">
        <span className="size-11 shrink-0 rounded-full bg-brand-done-bg" />
        <p className="font-text text-brand-body-strong text-brand-ink">[BUSINESS]</p>
      </div>
      <div className="flex gap-3 font-text text-brand-caption text-brand-ink-muted">
        <span>[N] posts</span>
        <span>[N] reviews</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 6 }, (_, i) => (
          <span
            key={i}
            className={`aspect-square w-full rounded-tile-sm ${i % 2 === 0 ? 'bg-brand-done-bg' : 'bg-brand-surface-sunken'}`}
          />
        ))}
      </div>
    </PhoneFrame>
  )
}

function ApprovalScreen() {
  return (
    <PhoneFrame>
      <p className="font-text text-brand-overline uppercase text-brand-ink-muted">
        Post for approval
      </p>
      <span className="h-[200px] shrink-0 rounded-media bg-brand-done-bg" />
      <p className="font-text text-brand-small text-brand-ink">
        Drain clearing before the weekend. Call us today.
      </p>
      <span className="flex h-11 shrink-0 items-center justify-center rounded-pill bg-brand-ink font-text text-brand-button text-brand-surface">
        Approve
      </span>
      <span className="flex h-11 shrink-0 items-center justify-center rounded-pill border border-brand-ink font-text text-brand-button text-brand-ink">
        Change this
      </span>
    </PhoneFrame>
  )
}

export function AboutPhoneMocks() {
  return (
    <div
      aria-hidden="true"
      className="flex w-full min-w-0 flex-1 flex-wrap items-end justify-center gap-6 xl:flex-nowrap"
    >
      <ProfileScreen />
      <ApprovalScreen />
    </div>
  )
}
