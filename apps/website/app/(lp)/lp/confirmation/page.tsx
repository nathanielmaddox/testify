import { redirect } from 'next/navigation'
import { ConversionTracker } from '@/components/lp/conversion_tracker'
import { PageSkeleton, type SlotSpec } from '@/components/skeleton/page_skeleton'
import { verifyConversion } from '@/lib/conversion'
import { pageMetadata } from '@/lib/metadata'
import { routes } from '@/lib/site.config'

export const metadata = pageMetadata('lpConfirmation')

/** Rendered per request: the page depends on the conversion id in the URL. */
export const dynamic = 'force-dynamic'

/**
 * Confirmation skeleton: the CONVERSION page (funnel step "conversion") that
 * the LP form/checkout lands on after a successful submit. Always noindex,
 * never in the sitemap, `Cache-Control: private, no-store` (next.config.js).
 *
 * It renders only for a request carrying a valid conversion id (`session_id`
 * from Stripe or a `lead` token, see lib/conversion.ts); anything else is
 * sent back to /lp. The conversion event fires once per id from
 * `ConversionTracker`.
 */
const SLOTS: readonly SlotSpec[] = [{ slot: 'next-steps', label: 'Next steps' }]

export default async function LpConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const conversion = await verifyConversion(await searchParams)
  if (!conversion.ok) redirect(routes.lp.path)

  return (
    <PageSkeleton routeKey="lpConfirmation" slots={SLOTS}>
      <ConversionTracker event={conversion.event} id={conversion.id} param={conversion.param} />
    </PageSkeleton>
  )
}
