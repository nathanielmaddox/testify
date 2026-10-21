'use client'

// Contact support line: one line under the booking card for existing clients. DS Link to the support mailto.
import { Link } from '@otesse/design-system'
import { SUPPORT_EMAIL } from '@/components/contact/support_email'

export function ContactSupportLine() {
  return (
    <p className="text-center font-text text-brand-body text-brand-ink-muted">
      Already a client? Email <Link href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>.
    </p>
  )
}
