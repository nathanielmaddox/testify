'use client'

import { ThemeProvider } from '@otesse/design-system'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'
import { analyticsConfig, gtagId } from '@/lib/analytics.config'
import { captureAttribution } from '@/lib/attribution'
import { track } from '@/lib/tracking'

/** Ids only ever contain these; anything else is refused before it reaches a URL. */
const SAFE_ID = /^[A-Za-z0-9-]+$/

/**
 * Provider libraries, loaded only for providers whose id is set. The command
 * queues and init calls are installed by `initAnalytics()` (lib/tracking.ts),
 * so these tags only fetch the libraries; no inline script is needed.
 * Allowed hosts are listed in next.config.js (`thirdParties`).
 */
function AnalyticsScripts() {
  const gtag = gtagId()
  const pixel = analyticsConfig.metaPixelId
  return (
    <>
      {gtag && SAFE_ID.test(gtag) ? (
        <Script
          id="gtag-js"
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gtag)}`}
          strategy="afterInteractive"
        />
      ) : null}
      {pixel && SAFE_ID.test(pixel) ? (
        <Script
          id="meta-pixel-js"
          src="https://connect.facebook.net/en_US/fbevents.js"
          strategy="afterInteractive"
        />
      ) : null}
    </>
  )
}

/**
 * Captures attribution once per full page load, then sends `page_view` on
 * every route change, plus `lp_view` on the landing step. Page identity comes
 * from the data-* attributes `pageTrackingAttrs` puts on <main>.
 */
function RouteTracker() {
  const pathname = usePathname()
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    captureAttribution()
  }, [])

  useEffect(() => {
    // Strict Mode runs effects twice in dev; one path, one page view.
    if (!pathname || lastTracked.current === pathname) return
    lastTracked.current = pathname
    const main = document.getElementById('main-content')
    const pageKey = main?.dataset['pageKey'] ?? 'unknown'
    const pageType = main?.dataset['pageType'] ?? 'unknown'
    const funnelStep = main?.dataset['funnelStep']
    const props = { page_key: pageKey, page_type: pageType, funnel_step: funnelStep }
    track('page_view', props)
    if (funnelStep === 'landing') track('lp_view', props)
  }, [pathname])

  return null
}

/**
 * Client-side providers. Rendered once by app/layout.tsx. Add further DS
 * providers (BrandProvider, toast hosts) here, never in the server layout.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      {children}
      <RouteTracker />
      <AnalyticsScripts />
    </ThemeProvider>
  )
}
