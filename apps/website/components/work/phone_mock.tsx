// Profile-grid mock for the work pages, drawn in brand tokens with no images. PhoneMock frames it in the same bezel as the Home hero phones; ProfileGridMock is the bare screen for cards. Server-safe, no DS import. Decorative (aria-hidden); the copy around it carries the meaning.

/** Joins truthy class names. Local copy of the style-guide helper, which is not on the package exports map. */
function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

const TILE_TONES = ['bg-brand-done-bg', 'bg-brand-canvas-alt', 'bg-brand-done-bg-strong'] as const

export interface ProfileGridMockProps {
  /** Business handle under the avatar. */
  handle: string
  /** One stat line, e.g. "[N] posts". */
  stat: string
  /** Grid tiles: 9 for a full feed, 6 for a quiet one. Default 9. */
  tiles?: 6 | 9
  /** Quiet profile: every tile in the recessed tone (the "before" page). */
  quiet?: boolean
  /** Drops the mock's own outer surface and shadow, for use inside a card that already has one. */
  bare?: boolean
  className?: string
}

function ProfileScreen({
  handle,
  stat,
  tiles = 9,
  quiet = false,
}: Omit<ProfileGridMockProps, 'className'>) {
  return (
    <div className="flex flex-col gap-4 bg-brand-surface pb-5">
      <div className="flex items-center gap-4 px-5 pt-3">
        <span className="h-14 w-14 shrink-0 rounded-full bg-brand-done-bg" />
        <div className="flex flex-col gap-1">
          <span className="font-text text-brand-small font-semibold text-brand-ink">{handle}</span>
          <span className="font-text text-brand-small text-brand-ink-subtle">{stat}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[3px]">
        {Array.from({ length: tiles }, (_, i) => (
          <span
            key={i}
            className={cx(
              'aspect-square w-full',
              quiet ? 'bg-brand-canvas-alt' : TILE_TONES[i % TILE_TONES.length]
            )}
          />
        ))}
      </div>
    </div>
  )
}

/** The profile screen for a card (no bezel). `bare` drops its own card surface when it sits inside one. */
export function ProfileGridMock({
  handle,
  stat,
  tiles = 9,
  quiet = false,
  bare = false,
  className,
}: ProfileGridMockProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        !bare && 'overflow-hidden rounded-card bg-brand-surface shadow-raised',
        className
      )}
    >
      <ProfileScreen handle={handle} stat={stat} tiles={tiles} quiet={quiet} />
    </div>
  )
}

/** The profile screen inside a phone bezel. Width comes from the parent (w-full, capped at 280px). */
export function PhoneMock({
  handle,
  stat,
  tiles = 9,
  quiet = false,
  bare = false,
  className,
}: ProfileGridMockProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        'flex w-full max-w-[280px] flex-col rounded-[44px] bg-brand-ink p-[9px]',
        !bare && 'shadow-lifted',
        className
      )}
    >
      <div className="flex flex-col overflow-hidden rounded-[36px] bg-brand-surface">
        <div className="flex items-center px-[22px] pb-1 pt-4 font-text text-brand-small font-semibold text-brand-ink">
          <span>9:41</span>
        </div>
        <ProfileScreen handle={handle} stat={stat} tiles={tiles} quiet={quiet} />
      </div>
    </div>
  )
}
