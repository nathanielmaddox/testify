import { NotBuiltCard } from '@/components/admin/not_built_card'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { routes } from '@/lib/admin.config'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('dashboard')

/** Dashboard placeholder. The dashboard is not built yet; no data is shown. */
export default function DashboardPage() {
  return (
    <PageSkeleton title={routes.dashboard.title}>
      <NotBuiltCard
        heading="The dashboard is not built yet"
        text="This page is a placeholder. Nothing on it is live data."
      />
    </PageSkeleton>
  )
}
