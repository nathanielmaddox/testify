// Sample rail for /work: six sample mocks (post, carousel, story, profile grid, drafted reply, client video) drawn in brand tokens with no media. Each mock is aria-hidden and carries a visible caption under it; the rail stays decorative until real media is signed off.
import { ProfileGridMock } from '@/components/work/phone_mock'

const FRAME =
  'flex min-h-[300px] flex-col gap-3 overflow-hidden rounded-card bg-brand-surface p-4 shadow-raised'
const DARK_FRAME =
  'flex min-h-[300px] flex-col gap-2.5 overflow-hidden rounded-card bg-brand-ink p-3'
const AVATAR_ROW = 'flex items-center gap-2'
const AVATAR = 'size-7 shrink-0 rounded-full bg-brand-done-bg'
const NAME = 'font-text text-brand-small font-semibold text-brand-ink'
const BODY = 'font-text text-brand-small text-brand-ink-muted'

function PostMock() {
  return (
    <div aria-hidden="true" className={FRAME}>
      <div className={AVATAR_ROW}>
        <span className={AVATAR} />
        <span className={NAME}>[BUSINESS]</span>
      </div>
      <span className="h-[168px] w-full rounded-2xl bg-brand-done-bg" />
      <p className={BODY}>
        Finished this [JOB] in [TOWN] on Tuesday. Here&apos;s what we found behind the wall.
      </p>
    </div>
  )
}

function CarouselMock() {
  return (
    <div aria-hidden="true" className={FRAME}>
      <div className={AVATAR_ROW}>
        <span className={AVATAR} />
        <span className={NAME}>[BUSINESS]</span>
      </div>
      <span className="h-[168px] w-full rounded-2xl bg-brand-done-bg-strong" />
      <div className="flex justify-center gap-1.5">
        <span className="size-1.5 rounded-full bg-brand-ink" />
        <span className="size-1.5 rounded-full bg-brand-done-bg-strong" />
        <span className="size-1.5 rounded-full bg-brand-done-bg-strong" />
      </div>
      <p className={BODY}>Before and after. Swipe to see the job.</p>
    </div>
  )
}

function StoryMock() {
  return (
    <div aria-hidden="true" className={DARK_FRAME}>
      <div className="flex gap-1">
        <span className="h-[3px] flex-1 rounded-full bg-brand-inverse-ink" />
        <span className="h-[3px] flex-1 rounded-full bg-brand-inverse-ink/40" />
        <span className="h-[3px] flex-1 rounded-full bg-brand-inverse-ink/40" />
      </div>
      <span className="min-h-0 flex-1 rounded-2xl bg-brand-done-bg-strong" />
      <p className="font-text text-brand-small font-semibold text-brand-inverse-ink">
        Booking open for [TOWN] this week.
      </p>
    </div>
  )
}

function ProfileMock() {
  return (
    <div className="min-h-[300px]">
      <ProfileGridMock handle="[BUSINESS]" stat="[N] posts" className="h-full" />
    </div>
  )
}

function ReplyMock() {
  return (
    <div aria-hidden="true" className={FRAME}>
      <div className="flex flex-col gap-1.5 rounded-2xl bg-brand-canvas-alt px-3 py-2.5">
        <span className="font-text text-brand-small text-brand-ink-subtle">Customer</span>
        <span className="font-text text-brand-small text-brand-ink">
          Do you do weekends in [TOWN]?
        </span>
      </div>
      <div className="flex flex-col gap-1.5 rounded-2xl bg-brand-ink px-3 py-2.5">
        <span className="font-text text-brand-small text-brand-inverse-ink-muted">
          Reply drafted
        </span>
        <span className="font-text text-brand-small text-brand-inverse-ink">
          Yes, Saturdays. Want us to hold a slot?
        </span>
      </div>
      <div className="mt-auto flex gap-3">
        <span className="font-text text-brand-small font-semibold text-brand-ink">Send</span>
        <span className="font-text text-brand-small text-brand-ink-subtle">Change</span>
      </div>
    </div>
  )
}

function VideoMock() {
  return (
    <div aria-hidden="true" className={FRAME}>
      <div className="flex h-[200px] items-center justify-center rounded-2xl bg-brand-done-bg-strong">
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-surface">
          <span className="ml-1 block size-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-brand-ink" />
        </span>
      </div>
      <p className={BODY}>Client video, 20 seconds, captioned.</p>
    </div>
  )
}

const SAMPLES = [
  { label: 'Sample: social post', Mock: PostMock },
  { label: 'Sample: before-and-after carousel', Mock: CarouselMock },
  { label: 'Sample: story', Mock: StoryMock },
  { label: 'Sample: profile grid', Mock: ProfileMock },
  { label: "Sample: drafted reply, waiting for the owner's OK", Mock: ReplyMock },
  { label: 'Client work: 20-second job video, captioned', Mock: VideoMock },
] as const

export function WorkSamples() {
  return (
    <div
      data-slot="sample-rail"
      role="region"
      aria-label="Sample posts, carousels, stories and replies"
      tabIndex={0}
      className="flex gap-4 overflow-x-auto pb-4"
    >
      {SAMPLES.map(({ label, Mock }) => (
        <figure key={label} className="flex w-[200px] shrink-0 flex-col gap-3">
          <Mock />
          <figcaption className="font-text text-brand-small text-brand-ink-subtle">
            {label}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
