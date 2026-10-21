/**
 * Offer LP trust row (Paper "Trust row", registry section `proof`): four
 * plain promises in one line. Server component, no DS import.
 */
import { PageSection } from '@testify/style-guide/components/PageSection'
import { slotProps, type LpSectionProps } from './section_props'

const PROMISES = [
  'We never need your passwords',
  'Nothing goes out unless you post it',
  'Every file is yours to keep',
  'Secure checkout by Stripe',
] as const

export function Offer99Trust({ lp }: LpSectionProps) {
  const headingId = `lp-${lp.slug}-proof-heading`
  return (
    <PageSection
      {...slotProps(lp, 'proof')}
      aria-labelledby={headingId}
      width="grid"
      flush
      className="border-t border-brand-border py-8"
    >
      <h2 id={headingId} className="sr-only">
        Our promises
      </h2>
      <ul className="flex flex-wrap gap-x-6 gap-y-3">
        {PROMISES.map((promise) => (
          <li key={promise} className="font-text text-brand-small text-brand-ink-subtle">
            {promise}
          </li>
        ))}
      </ul>
    </PageSection>
  )
}
