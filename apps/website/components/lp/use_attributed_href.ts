'use client'

import { useEffect, useState } from 'react'
import { withStoredAttribution } from '@/lib/attribution'

/**
 * `href` with the visitor's stored attribution params added (last touch,
 * else first touch). Renders the plain href on the server and first client
 * pass, then swaps in the attributed one after mount, so there is no
 * hydration mismatch. For the site header / home CTA to /lp:
 *
 *   const lpHref = useAttributedHref(siteConfig.cta.href)
 */
export function useAttributedHref(href: string): string {
  const [attributed, setAttributed] = useState(href)
  useEffect(() => {
    setAttributed(withStoredAttribution(href))
  }, [href])
  return attributed
}
