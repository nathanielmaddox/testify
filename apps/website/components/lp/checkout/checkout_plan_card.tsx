// Plan card, the left column of the checkout page: the offer name, the price line and the four
// strongest included items, in Paper wording. No kicker, no secondary headings (owner ruling).
// Server component; the check list is a client module.
import { CheckList } from './checkout_check_list'

/** The four strongest included items, in Paper wording (from order_summary.tsx). */
const INCLUDED = [
  '30 feed posts, made from your real jobs',
  '30 stories, one for every day',
  'Every caption written, in your voice',
  'Your private portal: copy, download, post',
] as const

export function CheckoutPlanCard({
  idPrefix,
  offerName,
  priceLabel,
}: {
  idPrefix: string
  offerName: string
  /** Per-interval price, for example "$99/month". */
  priceLabel: string
}) {
  return (
    <section
      id={`${idPrefix}-plan`}
      aria-label="Your plan"
      className="flex flex-col gap-6 rounded-card bg-brand-surface p-6 shadow-raised md:p-10"
    >
      <div className="flex flex-col gap-2">
        <p className="font-display text-brand-h3 text-brand-ink">{offerName}</p>
        <p className="font-text text-brand-body text-brand-ink-muted">
          {`${priceLabel}, billed monthly`}
        </p>
      </div>
      <CheckList items={INCLUDED} />
    </section>
  )
}
