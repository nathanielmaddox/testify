// Terms of service page: placeholder outline on the shared legal layout. No approved copy yet.
import { LegalPage } from '@/components/legal/legal_page'
import { LEGAL_EFFECTIVE_DATE, TERMS_SECTIONS } from '@/lib/legal'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('terms')

export default function TermsPage() {
  return (
    <LegalPage routeKey="terms" effectiveDate={LEGAL_EFFECTIVE_DATE} sections={TERMS_SECTIONS} />
  )
}
