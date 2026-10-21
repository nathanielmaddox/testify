// Order summary for the checkout story column (Paper "Order summary card"): a white card with the
// plan, what is included and the totals. Also exports the "What happens after you pay" steps, which
// sit below the promises card. Server-safe: style-guide compositions and the DS-free CheckList
// client module only. Copy is Paper's; prices come from the offer.
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { CheckList } from './checkout_check_list'

const INCLUDED = [
  '30 feed posts, made from your real jobs',
  '30 stories, one for every day',
  'Every caption written, in your voice',
  'The day to post each one',
  'Your private portal: copy, download, post',
] as const

const AFTER_PAY = [
  'Right away: Tell us your trade and town. Two minutes.',
  'Day 1 to 2: Your first questions arrive. About 5 minutes to answer.',
  'By [DATE]: Your first week is in your portal, ready to post.',
] as const

export function OrderSummary({
  idPrefix,
  offerName,
  amountLabel,
  priceLabel,
  currency,
  interval,
  price,
}: {
  idPrefix: string
  offerName: string
  /** Whole-dollar amount in words, for example "$99.00". */
  amountLabel: string
  /** Per-interval label, for example "$99/month". */
  priceLabel: string
  currency: string
  interval: string
  price: number
}) {
  const headingId = `${idPrefix}-order-summary-heading`
  const includedId = `${idPrefix}-included-heading`
  return (
    <section
      id={`${idPrefix}-order-summary`}
      aria-labelledby={headingId}
      data-offer-name={offerName}
      data-offer-price={String(price)}
      data-offer-currency={currency}
      data-offer-interval={interval}
      className="flex flex-col gap-6 rounded-card bg-brand-surface p-6 shadow-raised md:p-10"
    >
      <DisplayHeading
        level={2}
        size="h3"
        id={headingId}
        kicker="Your plan"
        lead="A post and a story for every day of the month, made from your real work. You press post."
      >
        Open Sign
      </DisplayHeading>

      <p className="font-text text-brand-small text-brand-ink-muted">
        Your part: about 5 minutes a week, plus about a minute to post each.
      </p>

      <div className="flex flex-col gap-5 border-t border-brand-border pt-6">
        <h3 id={includedId} className="font-display text-brand-h4 text-brand-ink">
          What you get every month
        </h3>
        <CheckList items={INCLUDED} />
      </div>

      <div className="flex flex-col gap-3 border-t border-brand-border pt-6 font-text text-brand-body text-brand-ink">
        <p className="text-brand-small text-brand-ink-muted">
          Free with your first month: Profile Tune-Up Kit · Your Trade&apos;s Question List · Ready
          Replies · &quot;Post It in a Minute&quot; Guide · Your Seasonal Content Calendar
        </p>
        <div className="flex items-center justify-between gap-4 border-t border-brand-border pt-4">
          <span>{offerName}</span>
          <span>{amountLabel}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-brand-small text-brand-ink-muted">
          {/* Paper shows this row. Stripe Tax is OFF (checkout_server.ts sets no automatic_tax), so the
              row is marked until the owner decides it. */}
          <span>Tax (Stripe Tax, only if it applies) [CONFIRM: Stripe Tax]</span>
          <span>Calculated</span>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-t border-brand-border pt-4">
          <span className="font-semibold">Total due today</span>
          <span className="font-display text-brand-h3 text-brand-ink">{amountLabel}</span>
        </div>
        <p className="text-brand-small text-brand-ink-muted">
          Then {priceLabel}. Next charge [DATE + 1 month]. Cancel any time.
        </p>
      </div>
    </section>
  )
}

export function AfterPaySteps({ idPrefix }: { idPrefix: string }) {
  const afterHeadingId = `${idPrefix}-after-pay-heading`
  return (
    <section
      aria-labelledby={afterHeadingId}
      id={`${idPrefix}-after-you-pay`}
      className="flex flex-col gap-4"
    >
      <h3 id={afterHeadingId} className="font-display text-brand-h4 text-brand-ink">
        What happens after you pay
      </h3>
      <ol className="flex flex-col gap-3 font-text text-brand-body text-brand-ink">
        {AFTER_PAY.map((line, index) => (
          <li key={line} className="flex items-start gap-3">
            <span className="w-5 shrink-0 font-semibold">{index + 1}</span>
            <span>{line}</span>
          </li>
        ))}
      </ol>
      <p className="font-text text-brand-small italic text-brand-ink-muted">
        Even if you ask for a refund after month one, you keep all 60 pieces.
      </p>
    </section>
  )
}
