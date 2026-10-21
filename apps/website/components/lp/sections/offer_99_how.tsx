/**
 * Offer LP mechanism (Paper "a-how", registry section `mechanism`): the three
 * steps (you answer, we make it, you press post), what happens after sign-up,
 * and the buy CTA. Server component; the CTA is the client BuyCta.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { slotProps, type LpSectionProps } from './section_props'

const STEPS = [
  {
    title: 'You answer.',
    body: 'Every Monday we send three or four quick questions. "What job are you proudest of this week?" "What did a customer ask you that everyone asks?" Answer by text or a voice note, from the truck, the job site or the couch. Send a couple of phone photos if you have them. No photos that week? We make graphics instead. From the supply house counter, between clients, or while the color processes.',
    chip: 'Less than a customer call',
  },
  {
    title: 'We make it.',
    body: 'Our team turns your answers into a full week: seven posts, seven stories, every caption written in your words, and the day each one goes out. It lands in your portal every [DAY] by [TIME]. On time, or that week is free.',
    chip: 'Our job',
  },
  {
    title: 'You press post.',
    body: "Open the portal. Tap Copy caption. Tap Download. Paste, post, done. That's about 2 minutes a day if you post the day's post and story.",
    chip: 'About a minute each',
  },
] as const

const AFTER_SIGNUP = [
  'Today: tell us your trade and town. Two minutes.',
  'Day 1 to 2: your first questions arrive.',
  'By day [N]: your first week of posts and stories is in your portal.',
  'Every [DAY] after: a new week, on time.',
] as const

export function Offer99How({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-mechanism-heading`
  return (
    <PageSection flush {...slotProps(lp, 'mechanism')} aria-labelledby={headingId} width="grid">
      <div className="flex flex-col gap-12">
        <DisplayHeading
          level={2}
          id={headingId}
          size="h2"
          kicker="We call it the Monday Coffee Questions."
          lead="Three steps. One of them is ours. Your part takes less time than one customer call a week, plus a minute per post."
        >
          You Answer. We Make It. You Press Post.
        </DisplayHeading>
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex min-w-0 flex-col gap-4 rounded-[40px] bg-brand-surface p-brand-card shadow-raised md:last:col-span-2 lg:last:col-span-1"
            >
              <span className="font-display text-brand-display tabular-nums text-brand-action">
                {index + 1}
              </span>
              <h3 className="font-display text-brand-h3 text-brand-ink">{step.title}</h3>
              <p className="font-text text-brand-body text-brand-ink-muted">{step.body}</p>
              <span className="mt-auto w-fit rounded-pill bg-brand-surface-sunken px-3 py-1.5 font-text text-brand-small text-brand-ink-muted">
                {step.chip}
              </span>
            </li>
          ))}
        </ol>
        <div className="flex flex-col gap-4">
          <p className="font-text text-brand-overline uppercase text-brand-ink-muted">
            After you sign up today
          </p>
          <ol className="flex flex-col gap-3">
            {AFTER_SIGNUP.map((line) => (
              <li key={line} className="font-text text-brand-body-lg leading-7 text-brand-ink">
                {line}
              </li>
            ))}
          </ol>
        </div>
        {href ? (
          <BuyCta
            href={href}
            lpSlug={lp.slug}
            label="Yes! Turn On My Open Sign: $99/Month"
            tone="action"
            caption="$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free."
          />
        ) : null}
      </div>
    </PageSection>
  )
}
