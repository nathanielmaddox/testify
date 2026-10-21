// Home hero phone mocks: three simplified app screens fanned in the hero (Paper "Hero visual").
// Server-safe, no DS import. Decorative only (aria-hidden); the copy around them carries the meaning.

const TILE_TONES = ['bg-brand-done-bg', 'bg-brand-canvas-alt', 'bg-brand-done-bg-strong'] as const

/** Centre phone: a published post with a reply thread. */
function CentrePhone() {
  return (
    <div className="flex h-[700px] w-[340px] flex-col rounded-[52px] bg-brand-ink p-[10px] shadow-lifted">
      <div className="flex h-[680px] w-[320px] flex-col overflow-hidden rounded-[43px] bg-brand-surface">
        <div className="flex items-center justify-between px-[26px] pb-2 pt-4 font-text text-brand-small font-semibold text-brand-ink">
          <span>9:41</span>
          <span>Live</span>
        </div>
        <div className="flex items-center gap-3 px-5 py-3">
          <span className="h-10 w-10 shrink-0 rounded-full bg-brand-done-bg" />
          <div className="flex flex-col gap-0.5">
            <span className="font-text text-brand-small font-semibold text-brand-ink">
              [BUSINESS]
            </span>
            <span className="font-text text-brand-small text-brand-ink-subtle">
              [TOWN] · Posted 2h ago
            </span>
          </div>
        </div>
        <div className="flex h-[250px] shrink-0 items-end bg-brand-done-bg p-4">
          <span className="font-text text-brand-small font-semibold text-brand-done-fg">
            Photo: water heater swap
          </span>
        </div>
        <div className="flex items-center gap-4 px-5 py-3.5">
          <span className="h-[18px] w-[18px] shrink-0 rounded-full border-2 border-brand-ink" />
          <span className="h-[18px] w-[18px] shrink-0 rounded-[4px] border-2 border-brand-ink" />
          <span className="h-[18px] w-[18px] shrink-0 rounded-full border-2 border-brand-ink" />
        </div>
        <p className="px-5 font-text text-brand-small text-brand-ink">
          Water heater swapped by lunch. Same-day quotes across [TOWN].
        </p>
        <div className="flex flex-col gap-3 p-5">
          <div className="flex max-w-[85%] flex-col gap-1 rounded-2xl bg-brand-canvas px-3.5 py-3">
            <span className="font-text text-xs font-semibold text-brand-ink-muted">
              Dana, [TOWN]
            </span>
            <span className="font-text text-brand-small text-brand-ink">
              Do you take weekend calls?
            </span>
          </div>
          <div className="flex max-w-[80%] flex-col gap-1 self-end rounded-2xl bg-brand-ink px-3.5 py-3 text-brand-surface">
            <span className="font-text text-xs font-semibold">Reply from [BUSINESS]</span>
            <span className="font-text text-brand-small">
              Yes, Saturdays 8 to 2. Reply here or call.
            </span>
          </div>
          <div className="flex max-w-[85%] flex-col gap-1 rounded-2xl bg-brand-canvas px-3.5 py-3">
            <span className="font-text text-xs font-semibold text-brand-ink-muted">
              Marcus, [TOWN]
            </span>
            <span className="font-text text-brand-small text-brand-ink">
              Is the 2 pm slot still open?
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Left phone: a client profile grid. */
function LeftPhone() {
  return (
    <div className="flex h-[580px] w-[280px] flex-col rounded-[44px] bg-brand-ink p-[9px] shadow-lifted">
      <div className="flex h-[562px] w-[262px] flex-col overflow-hidden rounded-[36px] bg-brand-surface">
        <div className="flex flex-col gap-3 px-[18px] pb-3.5 pt-11">
          <span className="h-[60px] w-[60px] rounded-full bg-brand-done-bg" />
          <div className="flex flex-col gap-0.5">
            <span className="font-text text-brand-small font-semibold text-brand-ink">
              [BUSINESS]
            </span>
            <span className="font-text text-xs text-brand-ink-muted">
              Trades in [TOWN]. Same-day quotes.
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-[3px]">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className={`aspect-square w-full ${TILE_TONES[i % TILE_TONES.length]}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

/** Right phone: a post waiting for approval, with the caption and the two actions. */
function RightPhone() {
  return (
    <div className="flex h-[580px] w-[280px] flex-col rounded-[44px] bg-brand-ink p-[9px] shadow-lifted">
      <div className="flex h-[562px] w-[262px] flex-col overflow-hidden rounded-[36px] bg-brand-canvas pb-[18px] pt-11">
        <div className="flex items-center justify-between px-[18px] pb-3.5">
          <span className="font-text text-brand-small font-semibold text-brand-ink">
            Post 14 of 30
          </span>
          <span className="font-text text-xs text-brand-ink-subtle">Due Thu</span>
        </div>
        <div className="mx-[18px] flex flex-col gap-3 rounded-3xl bg-brand-surface p-3.5 shadow-raised">
          <div className="flex h-[150px] items-center justify-center rounded-2xl bg-brand-done-bg">
            <span className="font-text text-xs font-semibold text-brand-done-fg">
              Photo: kitchen tap fix
            </span>
          </div>
          <p className="font-text text-brand-small text-brand-ink">
            Tap leaking? Fixed before dinner. Call us in [TOWN] for a same-day look.
          </p>
        </div>
        <div className="flex flex-col gap-1.5 px-[18px] pt-4">
          <span className="font-text text-xs font-semibold text-brand-ink-muted">
            Caption you approve
          </span>
          <span className="font-text text-brand-small text-brand-ink-muted">
            Built from your answer about the tap. You OK every word.
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-2.5 px-[18px]">
          <span className="flex h-11 items-center justify-center rounded-full bg-brand-ink font-text text-brand-small font-semibold text-brand-surface">
            Approve
          </span>
          <span className="flex h-11 items-center justify-center rounded-full border border-brand-ink font-text text-brand-small font-semibold text-brand-ink">
            Change this
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * The three fanned phones. Stacked on small screens; on md and up they sit on a
 * 700px stage: centre phone in the middle, the two side phones rotated outward.
 */
export function HeroPhones() {
  return (
    <div
      aria-hidden="true"
      className="flex w-full flex-col items-center gap-10 overflow-x-clip lg:relative lg:block lg:h-[700px]"
    >
      <div className="lg:absolute lg:left-1/2 lg:top-0 lg:-translate-x-1/2">
        <CentrePhone />
      </div>
      <div className="lg:absolute lg:left-[6%] lg:top-20 lg:-rotate-6 xl:left-[12.5%]">
        <LeftPhone />
      </div>
      <div className="lg:absolute lg:right-[6%] lg:top-20 lg:rotate-6 xl:right-[12.5%]">
        <RightPhone />
      </div>
    </div>
  )
}
