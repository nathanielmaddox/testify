'use client'

import { useEffect } from 'react'
import { getAttribution, landingLpSlugs } from '@/lib/attribution'
import { CONVERSION_CURRENCY, CONVERSION_VALUE } from '@/lib/conversion'
import { track } from '@/lib/tracking'

/** Ids already fired in this page load (covers Strict Mode and blocked storage). */
const firedThisLoad = new Set<string>()

const STORAGE_PREFIX = 'tfy_conv:'

export function conversionDedupeKey(event: string, id: string): string {
  return `${STORAGE_PREFIX}${event}:${id}`
}

function alreadyFired(key: string): boolean {
  if (firedThisLoad.has(key)) return true
  try {
    return window.localStorage.getItem(key) !== null
  } catch {
    return false
  }
}

function markFired(key: string): void {
  firedThisLoad.add(key)
  try {
    window.localStorage.setItem(key, new Date().toISOString())
  } catch {
    // Storage blocked: the in-memory set still stops a repeat in this load.
  }
}

/**
 * Fires the conversion event ONCE per conversion id (reloads, back/forward
 * and revisits do not refire), with the id as the dedupe key: Meta `eventID`
 * and GA4/Google Ads `transaction_id`. The server Conversions API sends the
 * same id later so Meta dedupes browser + server.
 *
 * Every conversion carries `lp_slug` (the LP whose confirmation page this
 * is) plus the LP slugs of the first and last stored touch.
 *
 * Also trims the address bar to the id param only, so nothing else (stray
 * params) is kept in history or shared by copy-paste.
 */
export function ConversionTracker({
  event,
  id,
  param,
  lpSlug,
}: {
  event: 'purchase_complete' | 'lead_submit'
  id: string
  param: string
  /** The LP this conversion belongs to (`/lp/<slug>/confirmation`). */
  lpSlug: string
}) {
  useEffect(() => {
    const clean = `${window.location.pathname}?${param}=${encodeURIComponent(id)}`
    if (`${window.location.pathname}${window.location.search}` !== clean) {
      window.history.replaceState(window.history.state, '', clean)
    }

    const key = conversionDedupeKey(event, id)
    if (alreadyFired(key)) return
    markFired(key)

    const attribution = getAttribution()
    const landing = landingLpSlugs(attribution)
    track(event, {
      event_id: id,
      value: CONVERSION_VALUE,
      currency: CONVERSION_CURRENCY,
      // Campaign context for GA4 (no PII): last-touch source/medium/campaign.
      utm_source: attribution?.last.params.utm_source,
      utm_medium: attribution?.last.params.utm_medium,
      utm_campaign: attribution?.last.params.utm_campaign,
      lp_slug: lpSlug,
      first_lp_slug: landing.first || undefined,
      last_lp_slug: landing.last || undefined,
    })
  }, [event, id, param, lpSlug])

  return null
}
