/**
 * Example week mock in the offer hero (Paper: "Week of [DATE]", seven day
 * columns with a post tile, a story tile and a caption). Decorative: it
 * repeats what the page says, so the grid is hidden from assistive tech.
 * Plain layout markup, no UI primitives (an illustration, not a control).
 */

interface MockDay {
  day: string
  title: string
  /** Large overlay line on the post tile, where Paper shows one. */
  overlay?: string
  story: string
  caption: readonly [string, string]
}

const DAYS: readonly MockDay[] = [
  {
    day: 'Mon',
    title: 'Water heater swap',
    overlay: 'In by 9, hot by 11',
    story: 'Old tank, new tank. Swipe.',
    caption: ['Tank gave out Sunday night.', 'New 50-gal in before lunch Monday.'],
  },
  {
    day: 'Tue',
    title: 'Before / after: kitchen sink',
    story: 'Guess how long this took?',
    caption: ['Old sink out, new one set.', 'Seal checked, no drips.'],
  },
  {
    day: 'Wed',
    title: 'Drain clear',
    overlay: 'Cleared in one visit.',
    story: 'Tip: never pour grease down here.',
    caption: ['Line cleared with a snake.', 'Nothing else needed.'],
  },
  {
    day: 'Thu',
    title: 'Panel upgrade',
    story: 'Sign-off day.',
    caption: ['Panel upgraded, labels done.', 'Inspected and signed off.'],
  },
  {
    day: 'Fri',
    title: 'Faucet install',
    overlay: 'One visit, one faucet.',
    story: 'Tip: check the shutoffs first.',
    caption: ['New faucet set and tested.', 'Supply lines replaced.'],
  },
  {
    day: 'Sat',
    title: 'Tile repair',
    story: 'Grout matched, not guessed.',
    caption: ['Cracked tile replaced.', 'Grout matched to the old color.'],
  },
  {
    day: 'Sun',
    title: 'Thermostat swap',
    story: 'Same wiring, new control.',
    caption: ['Old thermostat out, new one in.', 'Set and tested.'],
  },
]

/**
 * `storyLabel`: a small line set above each story tile's text, where a Paper
 * frame labels it (the retargeting frame writes "Story"). Absent = no label.
 * `compact`: the retargeting frame's mock. Its post tiles are 144px tall with
 * the title set lower, the overlay is smaller, and the captions take their own
 * height. Absent = the cold frame's 168px tiles and fixed caption height.
 */
export function ExampleWeek({
  storyLabel,
  compact = false,
}: { storyLabel?: string; compact?: boolean } = {}) {
  return (
    <figure className="flex w-full flex-col gap-4">
      <div
        aria-hidden="true"
        className="flex flex-col gap-3 rounded-card bg-brand-surface p-6 shadow-raised"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="font-display text-brand-h3 text-brand-ink">Week of [DATE]</p>
          <p className="font-text text-brand-small text-brand-ink-muted">
            7 posts · 7 stories · every caption written
          </p>
        </div>
        <div className="flex snap-x gap-2 overflow-x-auto pb-2 lg:grid lg:grid-cols-7 lg:overflow-visible">
          {DAYS.map((item) => (
            <div
              key={item.day}
              className="flex w-[min(12rem,70vw)] shrink-0 snap-start flex-col gap-2.5 lg:w-auto lg:min-w-0 lg:shrink"
            >
              <div className="flex items-center justify-between gap-1">
                <p className="font-text text-brand-small font-semibold text-brand-ink">
                  {item.day}
                </p>
                <p className="truncate rounded-pill bg-brand-canvas px-2 py-0.5 font-text text-[11px] font-semibold leading-4 text-brand-ink">
                  Post on {item.day}
                </p>
              </div>
              <div
                className={
                  compact
                    ? 'relative flex h-[144px] flex-col justify-end rounded-tile bg-brand-done-bg p-3'
                    : 'relative flex h-[168px] flex-col justify-end rounded-tile bg-brand-done-bg p-3'
                }
              >
                {item.overlay ? (
                  <p
                    className={
                      compact
                        ? 'absolute left-3 top-3 w-[144px] font-text text-brand-small font-semibold leading-5 text-brand-ink'
                        : 'absolute left-4 right-4 top-4 font-display text-brand-body-xl leading-6 text-brand-ink'
                    }
                  >
                    {item.overlay}
                  </p>
                ) : null}
                <p
                  className={
                    compact
                      ? 'absolute left-3 right-3 top-[88px] font-display text-brand-body-lg font-semibold leading-[22px] tracking-[-0.02em] text-brand-ink'
                      : 'font-display text-brand-body-lg font-semibold leading-[22px] tracking-[-0.02em] text-brand-ink'
                  }
                >
                  {item.title}
                </p>
              </div>
              <div className="flex h-[171px] w-full flex-col justify-between rounded-tile bg-brand-done-bg p-2.5">
                <span className="block h-0.5 bg-brand-ink" />
                <p className="whitespace-pre-line font-text text-[12px] leading-4 text-brand-ink">
                  {storyLabel ? `${storyLabel}\n${item.story}` : item.story}
                </p>
              </div>
              <p
                className={
                  compact
                    ? 'whitespace-pre-line pb-1 font-text text-brand-small text-brand-ink-muted'
                    : 'h-[84px] whitespace-pre-line font-text text-brand-small text-brand-ink-muted'
                }
              >
                {item.caption.join('\n')}
              </p>
              <div className="flex flex-col gap-1.5">
                <span className="flex h-8 items-center justify-center rounded-pill border border-brand-ink font-text text-[12px] font-semibold text-brand-ink">
                  Copy caption
                </span>
                <span className="flex h-8 items-center justify-center rounded-pill border border-brand-ink font-text text-[12px] font-semibold text-brand-ink">
                  Download
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="font-text text-brand-small font-semibold text-brand-ink-muted">
        Example week · demo business
      </figcaption>
    </figure>
  )
}
