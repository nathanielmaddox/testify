/**
 * Offer LP story (Paper "a-story", registry section `story`): the Tuesday-night
 * scene and the homeowner's view of a quiet page. Long-form prose, server
 * component, no DS import.
 */
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const BODY = 'font-text text-brand-body-xl leading-8 text-brand-ink'

const OPENING = [
  'Picture a Tuesday night.',
  "The kids are finally down. The coffee's still warm. You've got your phone in one hand and a list of jobs for tomorrow in your head.",
  'You remember: "I should post something."',
  'So you open the app. You scroll through 400 photos on your phone. Half of them are close-ups of pipes, or breaker panels, or the back of a customer\'s head. None of them look "good enough".',
  'You pick one. Then you stare at the empty caption box.',
  'What do you even say? "Another job done"? You did that last time. Three months ago.',
  "Ten minutes go by. Then twenty. You've written two lines and deleted them both.",
  'So you close the app and tell yourself the same thing every owner tells themselves:',
] as const

const TOMORROW = [
  'Tomorrow, a job runs over. The truck needs sorting. A customer calls with an emergency.',
  'And tomorrow turns into next week. Next week turns into next month.',
] as const

const HOMEOWNER = [
  'A homeowner two streets from you has a problem. A leak. A fuse that keeps tripping. A wedding in three weeks and hair that needs doing.',
  'A neighbor gives them your name. Good sign.',
  'So they do what almost everyone does now. They look you up.',
  'They find your page. And the last thing on it is from [MONTH].',
  'They don\'t think "this person must be too busy to post".',
  'They think "are they still going?"',
] as const

const GAP = [
  'Not your skill. Not your prices. Not your reviews.',
  'Just the gap between how good your business really is… and what a stranger sees in the eight seconds they spend on your page.',
  'We close that gap for you, every single day. And you barely lift a finger.',
] as const

function Paragraphs({ items }: { items: readonly string[] }) {
  return (
    <>
      {items.map((item) => (
        <p key={item} className={BODY}>
          {item}
        </p>
      ))}
    </>
  )
}

export function Offer99Story({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-story-heading`
  return (
    <PageSection flush {...slotProps(lp, 'story')} aria-labelledby={headingId} width="prose">
      <div className="flex flex-col gap-6">
        <p className="font-text text-brand-body-strong text-brand-ink">
          A story you&apos;ll probably recognize…
        </p>
        <h2 id={headingId} className="font-display text-brand-h2 text-brand-ink">
          &quot;I&apos;ll Post Something Tomorrow.&quot;
        </h2>
        <p className="font-text text-brand-body-xl leading-8 text-brand-ink-muted">
          It never starts with a decision to stop. It starts with one busy week.
        </p>
        <Paragraphs items={OPENING} />
        <p className={`${BODY} italic`}>&quot;I&apos;ll post something tomorrow.&quot;</p>
        <Paragraphs items={TOMORROW} />
        <h3 className="mt-6 font-display text-[28px] leading-[34px] font-semibold text-brand-ink">
          Meanwhile, on the other side of the screen
        </h3>
        <Paragraphs items={HOMEOWNER} />
        <h3 className="mt-6 font-display text-[28px] leading-[34px] font-semibold text-brand-ink">
          That&apos;s the gap this letter is about
        </h3>
        <Paragraphs items={GAP} />
      </div>
    </PageSection>
  )
}
