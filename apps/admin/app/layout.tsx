import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Providers } from '@/components/providers'
import { rootMetadata } from '@/lib/metadata'
import { fontVariables } from '@testify/style-guide/fonts'
// Order is the contract: DS styles first (Tailwind layers + DS defaults), then the
// Testify brand tokens (unlayered, so they win over the DS defaults), then page-frame rules.
import '@otesse/design-system/styles'
import '@testify/style-guide/tokens.css'
import './globals.css'

/**
 * Root layout for @testify/admin. A SERVER component, so it never imports the
 * `@otesse/design-system` barrel directly (that resolves the DS's optional
 * peers and 500s the page). Everything drawn with DS components lives in a
 * small `'use client'` module under components/ and is rendered from here.
 *
 * Fonts: Inter Tight / Inter / Caveat through next/font (@testify/style-guide/fonts).
 */

/**
 * Root metadata (lib/metadata.ts): title template, icon and noindex. The admin
 * is internal, so there is no JSON-LD, analytics or Open Graph here.
 */
export const metadata: Metadata = rootMetadata()

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
