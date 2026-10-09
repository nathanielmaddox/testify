import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Providers } from '@/components/providers'
import { rootMetadata } from '@/lib/metadata'
import { jsonLdScriptProps, organizationJsonLd, websiteJsonLd } from '@/lib/structured_data'
import { fontVariables } from '@testify/style-guide/fonts'
// Order is the contract: DS styles first (Tailwind layers + DS defaults), then the
// Testify brand tokens (unlayered, so they win over the DS defaults), then page-frame rules.
import '@otesse/design-system/styles'
import '@testify/style-guide/tokens.css'
import './globals.css'

/**
 * Root layout. A SERVER component, so it never imports the
 * `@otesse/design-system` barrel directly (that resolves the DS's optional
 * peers and 500s the page). Everything drawn with DS components lives in a
 * small `'use client'` module under components/ and is rendered from here.
 *
 * Fonts: Inter Tight / Inter / Caveat through next/font (@testify/style-guide/fonts).
 * The className on <html> defines --font-display / --font-text / --font-hand;
 * tokens.css builds the stacks and sets the body face and size.
 */

/**
 * Root metadata (lib/metadata.ts): title template, description, icons and the
 * shared Open Graph / Twitter base. No canonical and no og:url here, so a page
 * without `pageMetadata` never claims to be the home page.
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
        {/* Site-wide JSON-LD: Organization + WebSite, from lib/site.config.ts. */}
        <script {...jsonLdScriptProps([organizationJsonLd(), websiteJsonLd()])} />
        {/* Header, <main> and footer come from the (site) and (lp) group layouts. */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
