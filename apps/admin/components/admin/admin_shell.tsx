'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { DashboardLayout, Link, type SidebarItem } from '@otesse/design-system'
import { adminConfig, navItems } from '@/lib/admin.config'

/**
 * Admin chrome: the DS DashboardLayout (sidebar, header and the page's <main>
 * landmark) listing the routes from lib/admin.config.ts. Links are next/link
 * through the DS Link, so navigation stays client-side.
 *
 * Active state is derived from the current path: the root matches only itself,
 * every other route matches its own path and anything below it.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? ''

  const sidebarItems: SidebarItem[] = navItems.map((item) => ({
    id: item.href,
    label: item.label,
    href: item.href,
    active: item.href === '/' ? pathname === '/' : pathname.startsWith(item.href),
  }))

  return (
    <DashboardLayout
      logo={
        <Link href="/" linkComponent={NextLink} underline="never" color="inherit">
          {adminConfig.name}
        </Link>
      }
      sidebarItems={sidebarItems}
      renderSidebarItem={(item) => (
        <Link
          href={item.href ?? '/'}
          linkComponent={NextLink}
          underline="never"
          color="inherit"
          aria-current={item.active ? 'page' : undefined}
        >
          {item.label}
        </Link>
      )}
    >
      {children}
    </DashboardLayout>
  )
}
