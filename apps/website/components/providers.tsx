'use client'

import { ThemeProvider } from '@otesse/design-system'
import type { ReactNode } from 'react'

/**
 * Client-side providers from the design system. Rendered once by
 * app/layout.tsx. Add further DS providers (BrandProvider, toast hosts) here,
 * never in the server layout.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
}
