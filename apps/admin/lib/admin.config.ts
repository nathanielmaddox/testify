/**
 * Admin settings and the ROUTES REGISTRY for @testify/admin. Pages, metadata,
 * the sidebar and robots all read from this one file, so adding a page means
 * adding a route here and nowhere else.
 *
 * Imported by client components too, so env is read with DOT access
 * (`process.env.NEXT_PUBLIC_X`, typed in lib/env.d.ts), the form Next inlines.
 */

/** Stable id for each admin route. Pages pass it to `pageMetadata`. Never rename. */
export type AdminRouteKey = 'dashboard' | 'settings'

export interface AdminRoute {
  key: AdminRouteKey
  /** URL path, leading slash, no trailing slash except the root. */
  path: string
  /** Page title, fed through the "%s | Testify Admin" template. */
  title: string
  /** Meta description. The admin is internal, so this is for operators only. */
  description: string
  /** Listed in the admin sidebar. */
  inNav: boolean
}

export const routes = {
  dashboard: {
    key: 'dashboard',
    path: '/',
    title: 'Dashboard',
    description: 'Testify admin dashboard. Not built yet.',
    inNav: true,
  },
  settings: {
    key: 'settings',
    path: '/settings',
    title: 'Settings',
    description: 'Testify admin settings. Not built yet.',
    inNav: true,
  },
} as const satisfies Record<AdminRouteKey, AdminRoute>

export const adminRouteList: readonly AdminRoute[] = Object.values(routes)

export interface NavItem {
  label: string
  href: string
}

/** Sidebar entries, generated from the registry. */
export const navItems: readonly NavItem[] = adminRouteList
  .filter((route) => route.inNav)
  .map((route) => ({ label: route.title, href: route.path }))

/**
 * Admin app identity. The URL falls back to the local dev port so dev and
 * previews keep working when NEXT_PUBLIC_SITE_URL is unset or empty.
 */
export const adminConfig = {
  name: 'Testify Admin',
  description: 'Internal admin for Testify.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3201',
  /** Favicon / app icon in public/. */
  icon: '/icon.svg',
}
