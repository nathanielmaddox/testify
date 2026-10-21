import { NotBuiltCard } from '@/components/admin/not_built_card'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import { routes } from '@/lib/admin.config'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata('settings')

/** Settings placeholder. Settings are not built yet; nothing here saves anything. */
export default function SettingsPage() {
  return (
    <PageSkeleton title={routes.settings.title}>
      <NotBuiltCard
        heading="Settings are not built yet"
        text="This page is a placeholder. Nothing on it can be changed yet."
      />
    </PageSkeleton>
  )
}
