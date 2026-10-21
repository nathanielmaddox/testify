/**
 * Offer LP offer stack (registry section `offer-stack`): plain pre-line, H2,
 * descriptor, two white cards side by side from md (every month, free with
 * the first month), the bold price line and the ink buy button with its
 * caption. Server component; the button is the client BuyCta.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { OPEN_SIGN_BUY_CAPTION, OPEN_SIGN_BUY_LABEL } from './open_sign_copy'
import { slotProps, type LpSectionProps } from './section_props'

interface StackItem {
  title: string
  body: string
}

const EVERY_MONTH: readonly StackItem[] = [
  {
    title: '30 feed posts, made from your real jobs.',
    body: 'The finished kitchen, the before and after, the crew, the tip only a pro would know.',
  },
  {
    title: '30 stories, one for every day.',
    body: "So your page never looks quiet, even in the week you're flat out.",
  },
  {
    title: 'Every caption written, in your voice.',
    body: 'From your own answers, so it sounds like you on a good day.',
  },
  {
    title: 'The posting day for every piece.',
    body: 'No planning. No "what should I post today?"',
  },
  {
    title: 'Your private portal.',
    body: 'Copy the caption, download the file, post. About a minute each, from your phone.',
  },
]

const BONUSES: readonly StackItem[] = [
  {
    title: 'Profile Tune-Up Kit.',
    body: 'Bio, highlight covers and a pinned post, ready to paste in.',
  },
  {
    title: "Your Trade's Question List.",
    body: 'The [N] questions your customers ask most, each one turned into a post.',
  },
  {
    title: 'Ready Replies.',
    body: 'Written answers to "How much?", "Do you cover my area?" and "How do I book?"',
  },
  {
    title: '"Post It in a Minute" Guide.',
    body: 'A one-minute walkthrough for Facebook and Instagram.',
  },
  {
    title: 'Your Seasonal Content Calendar.',
    body: "Your trade's busy weeks and holidays, planned 12 months ahead.",
  },
]

function StackCard({ heading, items }: { heading: string; items: readonly StackItem[] }) {
  return (
    <div className="flex min-w-0 flex-col gap-6 rounded-card bg-brand-surface p-brand-card shadow-raised">
      <h3 className="font-display text-brand-h3 text-brand-ink">{heading}</h3>
      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <li key={item.title} className="font-text text-brand-body text-brand-ink">
            <strong className="font-semibold">{item.title}</strong> {item.body}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Offer99OfferStack({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-offer-stack-heading`
  return (
    <PageSection flush {...slotProps(lp, 'offer-stack')} aria-labelledby={headingId} width="grid">
      <div className="flex flex-col gap-3">
        <p className="font-text text-brand-body-strong text-brand-ink">
          Here&apos;s everything you get.
        </p>
        <DisplayHeading
          level={2}
          id={headingId}
          size="h2"
          lead="A post and a story for every day of the month, made from your real work, ready for you to post."
        >
          Introducing Open Sign
        </DisplayHeading>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StackCard heading="Every month" items={EVERY_MONTH} />
        <StackCard heading="Free with your first month [CONFIRM each bonus]" items={BONUSES} />
      </div>
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-2">
          <p className="font-text text-brand-body-lg font-semibold text-brand-ink">
            $99 a month. [SETUP FEE]. No contract. Cancel in 2 clicks. [CONFIRM P4]
          </p>
          <p className="font-text text-brand-small text-brand-ink-muted">
            Not in this plan: posting to your accounts, replies, paid ads, photo shoots. Want that
            too? That&apos;s our full service. [CONFIRM D8]
          </p>
        </div>
        {href ? (
          <BuyCta
            href={href}
            lpSlug={lp.slug}
            label={OPEN_SIGN_BUY_LABEL}
            tone="quiet"
            caption={OPEN_SIGN_BUY_CAPTION}
            placement="offer"
          />
        ) : null}
      </div>
    </PageSection>
  )
}
