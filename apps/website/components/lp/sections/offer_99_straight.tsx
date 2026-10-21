'use client'

/**
 * Offer LP honesty block (Paper "a-straight", registry section `straight`):
 * what the service will not promise and what is not in the plan. The dark
 * panel is the brand EmphasisPanel (wide, two columns: heading beside body).
 * The list markers are DS brand icons, so this is a client module (DS imports
 * live only in client files). The closing lines sit on the canvas below the
 * panel, in ink.
 *
 * The body is full width (`bodyWidth="full"`), so the two lists sit side by
 * side from md up and stack on small screens, as in Paper's frame KE7-0.
 */
import { BrandIcon } from '@testify/style-guide/components/BrandIcon'
import { EmphasisPanel } from '@testify/style-guide/components/EmphasisPanel'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const WONT = [
  'Promise you views, followers, calls or jobs. Nobody honest can.',
  'Lock you into a contract.',
  'Ask for your passwords.',
  "Use stock photos of someone else's work and pretend it's yours.",
  'Make you dance, film yourself or chase trends.',
  'Post anything in your name. You press post. Always.',
] as const

const NOT_IN_PLAN = [
  'Posting to your accounts',
  'Answering comments and messages',
  'Paid ads',
  'Photo shoots or filming days',
] as const

const ITEM = 'flex items-start gap-3 font-text text-brand-body-lg leading-7 text-brand-inverse-ink'
const LABEL = 'font-text text-brand-overline uppercase text-brand-inverse-ink-muted'

export function Offer99Straight({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-straight-heading`
  return (
    <PageSection flush {...slotProps(lp, 'straight')} aria-labelledby={headingId} width="grid">
      <EmphasisPanel
        id={headingId}
        headingLevel={2}
        kicker="Before we go further, a little honesty."
        title="What We Won't Promise, and What's Not Included"
        width="wide"
        columns={2}
        bodyWidth="full"
      >
        <p className="text-brand-body-xl leading-[30px]">
          You&apos;ve heard the big promises before. Here are the plain terms instead, so nothing
          surprises you later.
        </p>
        <div className="grid w-full gap-16 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <h3 className={LABEL}>We won&apos;t</h3>
            <ul className="flex flex-col gap-4">
              {WONT.map((item) => (
                <li key={item} className={ITEM}>
                  <span className="mt-1.5 shrink-0">
                    <BrandIcon name="X" size="sm" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <h3 className={LABEL}>Not in this plan</h3>
            <ul className="flex flex-col gap-4">
              {NOT_IN_PLAN.map((item) => (
                <li key={item} className={ITEM}>
                  <span className="mt-1.5 shrink-0">
                    <BrandIcon name="Minus" size="sm" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-text text-brand-small text-brand-inverse-ink-muted">
              Want us to post and reply for you too? That&apos;s our full service. Start here and
              move up any time.
            </p>
          </div>
        </div>
      </EmphasisPanel>
      <div className="flex flex-col gap-4">
        <p className="font-text text-brand-body-lg leading-7 text-brand-ink">
          Want us to post and reply for you as well? That&apos;s our full service. Start here, and
          move up whenever you like.
        </p>
        <p className="font-display text-brand-h3 text-brand-ink">
          What we do promise is simple: 60 finished pieces a month, made from your work, in your
          voice, on time.
        </p>
      </div>
    </PageSection>
  )
}
