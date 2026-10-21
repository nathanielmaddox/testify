// Privacy policy page: placeholder outline on the shared legal layout. No approved copy yet.
import { LegalPage } from '@/components/legal/legal_page'
import { LEGAL_EFFECTIVE_DATE, PRIVACY_SECTIONS } from '@/lib/legal'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('privacy')

export default function PrivacyPage() {
  return (
    <LegalPage
      routeKey="privacy"
      effectiveDate={LEGAL_EFFECTIVE_DATE}
      sections={PRIVACY_SECTIONS}
    />
  )
}
