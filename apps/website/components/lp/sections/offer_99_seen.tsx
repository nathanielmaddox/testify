'use client'

/**
 * Offer LP "seen" section (Paper "a-seen", registry section `seen`): the
 * opposite picture, an example month of posts and stories, the homeowner's
 * view on Thursday, the five things the service covers, and the buy CTA.
 * Client module because the list arrows are DS brand icons (DS imports live
 * only in client files).
 */
import { BrandIcon } from '@testify/style-guide/components/BrandIcon'
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { lpCheckoutHref } from '@/lib/landing_pages'
import { BuyCta } from './buy_cta'
import { slotProps, type LpSectionProps } from './section_props'

const BODY = 'font-text text-brand-body-lg leading-7 text-brand-ink'

const COVERS = [
  'The Monday coffee routine that turns the photos already on your phone into a full week of posts.',
  'Why the "boring" photo you\'d never post (the muddy boots by the truck door, the before shot you were embarrassed by) often makes the most human post of the week.',
  'The one kind of post that answers the question every customer has before they let a stranger into their home, and why most pros never think to make it.',
  'How we write your captions so they sound like you on a good day, not like a marketing robot or a teenager.',
  'The "story a day" habit that keeps your page from ever looking quiet again, even in your busiest month.',
] as const

const MONTH_DAYS = Array.from({ length: 30 }, (_, index) => index + 1)

export function Offer99Seen({ lp }: LpSectionProps) {
  const href = lpCheckoutHref(lp)
  const headingId = `lp-${lp.slug}-seen-heading`
  return (
    <PageSection flush {...slotProps(lp, 'seen')} aria-labelledby={headingId} width="prose">
      <div className="flex flex-col gap-12">
        <DisplayHeading
          level={2}
          id={headingId}
          size="h2"
          kicker="Now imagine the opposite…"
          lead="30 posts and 30 stories a month. A new one for every day. So whenever someone hears your name and goes looking, there's something fresh and real waiting for them."
        >
          Open, Busy and Proud, Every Single Day
        </DisplayHeading>
        <figure className="flex flex-col gap-3 rounded-card bg-brand-surface p-6 shadow-raised">
          <figcaption className="font-text text-brand-overline uppercase text-brand-ink-muted">
            Example month. Demo business.
          </figcaption>
          <div aria-hidden="true" className="flex gap-1 overflow-hidden">
            {MONTH_DAYS.map((day) => (
              <div key={day} className="flex w-[34px] shrink-0 flex-col gap-[3px]">
                <span className="h-[34px] w-[34px] rounded-lg bg-brand-canvas" />
                <span className="h-[34px] w-[20px] rounded-md bg-brand-done-bg" />
              </div>
            ))}
          </div>
          <p className="font-text text-brand-small text-brand-ink-subtle">
            A post and a story, every day of the month.
          </p>
        </figure>
        <div className="flex flex-col gap-5">
          <p className={BODY}>Picture it from their side.</p>
          <p className={BODY}>
            It&apos;s Thursday evening. A homeowner is on the couch, thumb on the screen, looking
            for someone they&apos;d trust to come into their home.
          </p>
          <p className={BODY}>They find you.</p>
          <p className={BODY}>
            Monday, there&apos;s the kitchen you finished, gleaming under the new lights, with a
            caption that sounds like an actual person wrote it. Because one did… in your words.
          </p>
          <p className={BODY}>
            Wednesday, there&apos;s a quick tip: &quot;Three signs your water heater is about to
            give up before winter does.&quot;
          </p>
          <p className={BODY}>
            Today, there&apos;s a story of your crew packing up a spotless job, tools in the truck,
            thumbs up at the door.
          </p>
          <p className={BODY}>And they feel it.</p>
          <p className={`${BODY} italic`}>
            These people are open. They&apos;re good. And they&apos;re busy for a reason.
          </p>
          <h3 className="pt-3 font-display text-[32px] leading-9 tracking-[-0.02em] text-brand-ink">
            Being seen isn&apos;t about going viral. It&apos;s about showing up.
          </h3>
          <p className={BODY}>
            You don&apos;t need a million views. You need the people who already heard your name to
            find a business that looks alive when they check.
          </p>
          <p className={BODY}>
            Every day you post is one more chance to be seen by the people around you. Every day you
            don&apos;t is one more chance gone.
          </p>
          <p className={BODY}>
            We can&apos;t promise anyone views or followers. Nobody honest can. What we promise is
            this: you show up every single day, with posts made from your real work.
          </p>
        </div>
        <ul className="flex flex-col gap-4">
          {COVERS.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 shrink-0 text-brand-ink">
                <BrandIcon name="ArrowRight" size="sm" />
              </span>
              <span className={BODY}>{item}</span>
            </li>
          ))}
        </ul>
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
