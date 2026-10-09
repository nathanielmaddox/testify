import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Providers } from '@/components/providers'
import { siteConfig } from '@/lib/site.config'
// DS styles first: they carry the Tailwind layers and the DS CSS variables.
import '@otesse/design-system/styles'
import './globals.css'

/**
 * Root layout. A SERVER component, so it never imports the
 * `@otesse/design-system` barrel directly (that resolves the DS's optional
 * peers and 500s the page). Everything drawn with DS components lives in a
 * small `'use client'` module under components/ and is rendered from here.
 *
 * Fonts: the DS type stack is the system sans stack (its Tailwind preset and
 * globals.css), so no next/font face is loaded.
 */

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: siteConfig.indexable ? { index: true, follow: true } : { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        {/* Header, <main> and footer come from the (site) and (lp) group layouts. */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
