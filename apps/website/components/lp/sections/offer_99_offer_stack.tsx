/**
 * Offer LP offer stack (Paper "a-deal", registry section `offer-stack`): what
 * the $99 monthly buys, each item with its worth to the owner, the five free
 * bonuses, and the price panel with the buy CTA. Server component.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { slotProps, type LpSectionProps } from './section_props'

interface StackItem {
  title: string
  body: string
  worth: string
}

const EVERY_MONTH: readonly StackItem[] = [
  {
    title: '1. 30 Feed Posts, Made for You From Your Real Jobs',
    body: 'Your best work, finally out in the open: the finished kitchen, the before and after, the crew, the tip only a pro would know.',
    worth:
      'a page that looks alive every time someone checks, and not one evening in a design app.',
  },
  {
    title: '2. 30 Stories, One for Every Day',
    body: 'The quick, everyday glimpses that make a business feel real and open right now.',
    worth: "your page never looks quiet again, even in the week you're flat out.",
  },
  {
    title: '3. Every Caption Written, in Your Voice',
    body: 'Made from your own answers, so it sounds like you on a good day.',
    worth: 'you never stare at a blank caption box at 9pm again.',
  },
  {
    title: '4. Your Posting Day for Every Piece',
    body: 'Each post and story tells you exactly which day it goes out.',
    worth: 'zero planning, zero "what should I post today?"',
  },
  {
    title: '5. Your Private Client Portal',
    body: 'Every week in one place: Copy caption, Download, post.',
    worth: 'about a minute a post, from anywhere, on your phone.',
  },
]

const BONUSES: readonly StackItem[] = [
  {
    title: '6. Bonus #1: The Profile Tune-Up Kit',
    body: 'Your bio, highlight covers and pinned post, written and designed for you to paste in.',
    worth:
      'the first thing a stranger sees says "open, local, professional" before they\'ve even scrolled.',
  },
  {
    title: "7. Bonus #2: Your Trade's Question List",
    body: 'The [N] questions customers in your trade ask most, each one turned into a post.',
    worth:
      'you look like the expert you are, and you answer the same question once instead of a hundred times.',
  },
  {
    title: '8. Bonus #3: Ready Replies',
    body: 'Written answers to "How much?", "Do you cover my area?" and "How do I book?"',
    worth:
      'when someone messages you, you paste a friendly, professional reply in seconds instead of typing one out between jobs.',
  },
  {
    title: '9. Bonus #4: The "Post It in a Minute" Guide',
    body: 'A one-minute walkthrough for Facebook and Instagram.',
    worth: "posting never stalls because of a button you can't find.",
  },
  {
    title: '10. Bonus #5: Your Seasonal Content Calendar',
    body: 'The busy weeks, holidays and seasons for your trade, planned 12 months ahead.',
    worth:
      'your posts land when your customers are actually thinking about you (frozen pipes in winter, AC in summer).',
  },
]

function StackList({ items }: { items: readonly StackItem[] }) {
  return (
    <ul className="flex flex-col gap-6">
      {items.map((item) => (
        <li key={item.title} className="flex flex-col gap-1">
          <h3 className="font-text text-brand-body-strong text-brand-ink">{item.title}</h3>
          <p className="font-text text-brand-body text-brand-ink">{item.body}</p>
          <p className="font-text text-brand-body italic text-brand-ink-muted">
            What it&apos;s worth to you: {item.worth}
          </p>
        </li>
      ))}
    </ul>
  )
}

export function Offer99OfferStack({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-offer-stack-heading`
  return (
    <PageSection flush {...slotProps(lp, 'offer-stack')} aria-labelledby={headingId} width="grid">
      <DisplayHeading
        level={2}
        id={headingId}
        size="h2"
        kicker="Here's everything you get."
        lead="A post and a story for every day of the month, made from your real work, ready for you to post. Every item below is built to take one more job off your plate, so you can show up every single day without giving up a single evening."
      >
        Introducing Open Sign
      </DisplayHeading>
      <div className="grid gap-12 rounded-[40px] bg-brand-surface p-10 shadow-raised lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        <aside className="flex flex-col gap-5 lg:sticky lg:top-8 lg:self-start">
          <h3 className="font-display text-brand-h3 text-brand-ink">So what does it cost?</h3>
          <p className="font-text text-brand-lead font-semibold text-brand-ink">$99 a month.</p>
          <p className="font-text text-brand-body text-brand-ink">
            That&apos;s it. [SETUP FEE]. No contract. Cancel in 2 clicks whenever you like.
          </p>
          {href ? (
            <BuyCta
              href={href}
              lpSlug={lp.slug}
              label="Yes! Turn On My Open Sign: $99/Month"
              tone="action"
              caption="$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free."
            />
          ) : null}
        </aside>
        <div className="flex flex-col gap-8">
          <p className="font-text text-brand-body text-brand-ink">
            Here&apos;s what lands in your portal, every month, laid out day by day, so you never
            once have to wonder what to post or when.
          </p>
          <p className="font-text text-brand-overline uppercase text-brand-ink-muted">
            Every month
          </p>
          <StackList items={EVERY_MONTH} />
          <p className="font-text text-brand-overline uppercase text-brand-ink-muted">
            Plus these 5 bonuses, free with your first month
          </p>
          <StackList items={BONUSES} />
          <p className="font-display text-brand-h3 text-brand-ink">
            That&apos;s 60 finished pieces a month you never have to think up, write or design. Your
            part: 20 minutes a month, less than one appointment.
          </p>
        </div>
      </div>
    </PageSection>
  )
}
