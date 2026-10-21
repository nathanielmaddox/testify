import type { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/admin_shell'

/** Admin chrome (sidebar and header) around every page in the (admin) group. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
