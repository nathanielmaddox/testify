import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin_shell'
import { NotFoundPanel } from '@/components/admin/not_found_panel'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'

/**
 * No canonical (a 404 has no canonical URL; null clears the root layout's).
 * No explicit robots: Next adds `noindex` to not-found responses itself.
 */
export const metadata: Metadata = {
  title: 'Page not found',
  alternates: { canonical: null },
}

/** Root 404. It renders outside the (admin) group, so it draws the admin chrome itself. */
export default function NotFound() {
  return (
    <AdminShell>
      <PageSkeleton title="Page not found">
        <NotFoundPanel />
      </PageSkeleton>
    </AdminShell>
  )
}
