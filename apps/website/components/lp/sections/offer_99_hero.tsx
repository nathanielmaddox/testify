/**
 * Offer LP hero (Paper `a-hero`, and the `closed` and `busiest` hero variants
 * from the Paper frames): eyebrow, display headline, lead, two fact chips, the
 * violet buy CTA with its price line, and the example-week mock. Only the copy
 * changes between variants (`LandingPage.heroVariant`). Server component; the
 * buy CTA is the client BuyCta.
 */
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref, type LpHeroVariant } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { ExampleWeek } from './example_week'
import { slotProps, type LpSectionProps } from './section_props'

const CHIPS = ['60 pieces a month', 'Your part: less than one customer call a week'] as const

interface HeroCopy {
  eyebrow: string
  headline: string
  lead: string
  caption: string
}

const HERO_COPY: Record<LpHeroVariant, HeroCopy> = {
  default: {
    eyebrow: 'For local pros too busy to post.',
    headline: 'A Fresh Post and Story, Every Single Day',
    lead: "So when a homeowner looks you up on the couch tonight, they don't find a page that went quiet in [MONTH]. They find a business that's open, busy and proud of its work. You never write a caption, design a post or think up an idea again. You just press post. $99/month. No contract.",
    caption: "$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free.",
  },
  closed: {
    eyebrow: 'Before they call, they look you up.',
    headline: "Your Page Looks Closed. You're Not.",
    lead: "Somewhere right now, a homeowner is scrolling your page, landing on a last post from [MONTH], and quietly wondering if you're still trading. Let's give them a page full of fresh, finished work instead: the before and after, the crew, the little tips only a pro would know. We make 30 posts and 30 stories a month from about 5 minutes of your week. You press post. $99/month.",
    caption: "No contract. Cancel in 2 clicks. First month: love it or it's free.",
  },
  busiest: {
    eyebrow: 'For pros who are flat out every day.',
    headline: 'Look as Busy Online as You Are',
    lead: 'Your days are full of good work nobody online ever sees: the bathroom you turned around in a day, the leak you caught before it brought a ceiling down, the van packed and gone by 7am. We turn those moments into a post and a story for every day, so your page finally looks as busy as your diary. About 5 minutes a week from you. You press post.',
    caption: "No contract. Cancel in 2 clicks. First month: love it or it's free.",
  },
}

export function Offer99Hero({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const copy = HERO_COPY[lp.heroVariant ?? 'default']
  const headingId = `lp-${lp.slug}-hero-heading`
  return (
    <PageSection flush {...slotProps(lp, 'hero')} aria-labelledby={headingId} width="grid">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <p className="font-text text-brand-body-strong text-brand-ink">{copy.eyebrow}</p>
        <DisplayHeading level={1} id={headingId} lead={copy.lead} align="center">
          {copy.headline}
        </DisplayHeading>
        <ul className="flex flex-wrap justify-center gap-3">
          {CHIPS.map((chip) => (
            <li
              key={chip}
              className="flex h-11 items-center rounded-pill border border-brand-border-strong bg-brand-surface px-5 font-text text-brand-label text-brand-ink"
            >
              {chip}
            </li>
          ))}
        </ul>
        {href ? (
          <BuyCta
            href={href}
            lpSlug={lp.slug}
            label="Yes! Turn On My Open Sign: $99/Month"
            tone="action"
            caption={copy.caption}
          />
        ) : null}
      </div>
      <ExampleWeek />
    </PageSection>
  )
}
