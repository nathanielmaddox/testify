/**
 * Page and funnel tracking contract. Server-safe (no DS, no browser globals at
 * import time), so server pages can spread `pageTrackingAttrs` onto <main>.
 *
 * The analytics provider (Meta Pixel / GA) is wired in later behind `track`;
 * pages and components already call the names below, so wiring it is a change
 * to this file only.
 */
import { getRoute, type FunnelStep, type PageType, type RouteKey } from './site.config'

export const PAGE_TYPES = [
  'site',
  'lp',
  'conversion',
  'legal',
] as const satisfies readonly PageType[]

export const FUNNEL_STEPS = ['landing', 'conversion'] as const satisfies readonly FunnelStep[]

/** Every event the site will emit. Add a name here before emitting it. */
export const TRACK_EVENTS = ['page_view', 'lp_view', 'lead_submit', 'purchase_complete'] as const

export type TrackEvent = (typeof TRACK_EVENTS)[number]

export type TrackProps = Record<string, string | number | boolean | null | undefined>

export interface PageTrackingAttrs {
  'data-page-key': RouteKey
  'data-page-type': PageType
  'data-funnel-step'?: FunnelStep
}

/** data-* attributes for a page's <main>, so tags and tests can key off them. */
export function pageTrackingAttrs(routeKey: RouteKey): PageTrackingAttrs {
  const route = getRoute(routeKey)
  return {
    'data-page-key': route.key,
    'data-page-type': route.pageType,
    ...(route.funnelStep ? { 'data-funnel-step': route.funnelStep } : {}),
  }
}

/**
 * Emit an analytics event. Intentionally a no-op: the provider (Meta Pixel /
 * GA, server-side conversions) is wired in later behind this one function.
 */
export function track(_event: TrackEvent, _props?: TrackProps): void {}

/** Query params that carry ad attribution and must survive every LP hop. */
export const ATTRIBUTION_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
  'ttclid',
] as const

type SearchParamsLike =
  Pick<URLSearchParams, 'get'> | Record<string, string | string[] | undefined> | null | undefined

function readParam(searchParams: SearchParamsLike, name: string): string | undefined {
  if (!searchParams) return undefined
  if (typeof (searchParams as Pick<URLSearchParams, 'get'>).get === 'function') {
    return (searchParams as Pick<URLSearchParams, 'get'>).get(name) ?? undefined
  }
  const value = (searchParams as Record<string, string | string[] | undefined>)[name]
  return Array.isArray(value) ? value[0] : value
}

/**
 * Copy the attribution params (UTM + click ids) from the current request onto
 * an onward href, without overwriting params the href already sets. Relative
 * hrefs stay relative.
 */
export function withAttribution(href: string, searchParams: SearchParamsLike): string {
  const isAbsolute = /^[a-z][a-z\d+.-]*:\/\//i.test(href)
  const target = new URL(href, 'http://relative.invalid')
  for (const name of ATTRIBUTION_PARAMS) {
    const value = readParam(searchParams, name)
    if (value && !target.searchParams.has(name)) target.searchParams.set(name, value)
  }
  return isAbsolute ? target.toString() : `${target.pathname}${target.search}${target.hash}`
}
