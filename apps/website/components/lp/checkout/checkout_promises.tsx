// "You're covered five ways" card in the checkout story column (Paper "Promises card - compact"): a
// small white card with the five promises as checked lines. Server component; the checks come from
// the client CheckList.
import { CheckList } from './checkout_check_list'

const COVERED = [
  "First month: love it or it's free.",
  'Late week? That week is free.',
  'Unlimited edits.',
  'No contract. Cancel in 2 clicks.',
  'We never need your passwords.',
] as const

export function CheckoutPromises({ idPrefix }: { idPrefix: string }) {
  const headingId = `${idPrefix}-covered-heading`
  return (
    <section
      id={`${idPrefix}-covered`}
      aria-labelledby={headingId}
      className="flex flex-col gap-5 rounded-media bg-brand-surface p-6 shadow-raised"
    >
      <h3 id={headingId} className="font-display text-brand-h4 text-brand-ink">
        You&apos;re covered five ways
      </h3>
      <CheckList items={COVERED} />
    </section>
  )
}
