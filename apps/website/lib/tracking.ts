/**
 * Page and funnel tracking contract. Server-safe (no DS, no browser globals at
 * import time), so server pages can spread `pageTrackingAttrs` onto <main>.
 *
 * `track(event, props)` is the ONE call site for analytics. `EVENT_MAP` maps
 * each site event to its provider events (GA4, Google Ads, Meta Pixel); each
 * provider no-ops until its id is set (lib/analytics.config.ts) and its script
 * is loaded (`AnalyticsScripts` in components/providers.tsx).
 *
 * Attribution (UTM + click ids) lives in lib/attribution.ts.
 */
import { analyticsConfig, gtagId } from './analytics.config'
import { lpPageKey } from './landing_pages'
import { getRoute, siteConfig, type FunnelStep, type PageType, type RouteKey } from './site.config'
import { workPageKey } from './work'

export const PAGE_TYPES = [
  'site',
  'lp',
  'checkout',
  'conversion',
  'legal',
] as const satisfies readonly PageType[]

export const FUNNEL_STEPS = [
  'landing',
  'checkout',
  'conversion',
] as const satisfies readonly FunnelStep[]

/** Every event the site will emit. Add a name here before emitting it. */
export const TRACK_EVENTS = [
  'page_view',
  'lp_view',
  'checkout_view',
  'begin_checkout',
  'add_payment_info',
  'lead_submit',
  'purchase_complete',
] as const

export type TrackEvent = (typeof TRACK_EVENTS)[number]

export type TrackProps = Record<string, string | number | boolean | null | undefined>

interface ProviderEvents {
  /** GA4 event name (recommended events where one exists). */
  ga4: string
  /** Meta Pixel event name. */
  meta: string
  /** Standard Meta event (`fbq('track')`) or custom (`fbq('trackCustom')`). */
  metaStandard: boolean
  /** Sent as a Google Ads conversion (label from analyticsConfig). */
  googleAdsConversion: boolean
}

/** Site event -> provider events. The single mapping table. */
export const EVENT_MAP = {
  page_view: { ga4: 'page_view', meta: 'PageView', metaStandard: true, googleAdsConversion: false },
  lp_view: {
    ga4: 'view_item',
    meta: 'ViewContent',
    metaStandard: true,
    googleAdsConversion: false,
  },
  // Checkout page rendered (custom: reporting only, not an ad optimization event).
  checkout_view: {
    ga4: 'checkout_view',
    meta: 'CheckoutView',
    metaStandard: false,
    googleAdsConversion: false,
  },
  // Visitor starts the purchase (first interaction with the checkout form).
  begin_checkout: {
    ga4: 'begin_checkout',
    meta: 'InitiateCheckout',
    metaStandard: true,
    googleAdsConversion: false,
  },
  // Payment details complete in the Stripe element. Stub: not fired until the element exists.
  add_payment_info: {
    ga4: 'add_payment_info',
    meta: 'AddPaymentInfo',
    metaStandard: true,
    googleAdsConversion: false,
  },
  lead_submit: {
    ga4: 'generate_lead',
    meta: 'Lead',
    metaStandard: true,
    googleAdsConversion: true,
  },
  purchase_complete: {
    ga4: 'purchase',
    meta: 'Purchase',
    metaStandard: true,
    googleAdsConversion: true,
  },
} as const satisfies Record<TrackEvent, ProviderEvents>

export interface PageTrackingAttrs {
  /** Route key for site pages; `lp:<slug>` for a landing page and its confirmation. */
  'data-page-key': RouteKey | `lp:${string}` | `work:${string}`
  'data-page-type': PageType
  'data-funnel-step'?: FunnelStep
  /** The LP slug (= the ad it serves), on LP and LP confirmation pages only. */
  'data-lp-slug'?: string
  /** The story slug, on /work/<slug> pages only. */
  'data-work-slug'?: string
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
 * data-* attributes for an LP page (`template: 'lp'`), its checkout page
 * (`'lpCheckout'`) or its confirmation page (`'lpConfirmation'`): page type and funnel step from the route
 * template, page key `lp:<slug>`, plus `data-lp-slug`. The route tracker
 * reads `data-lp-slug` into the `lp_slug` event param.
 */
export function lpTrackingAttrs(
  slug: string,
  template: Extract<RouteKey, 'lp' | 'lpCheckout' | 'lpConfirmation'>
): PageTrackingAttrs {
  return {
    ...pageTrackingAttrs(template),
    'data-page-key': lpPageKey(slug),
    'data-lp-slug': slug,
  }
}

/**
 * data-* attributes for a client story page (`/work/<slug>`): page type from
 * the `workStory` route template (`site`), page key `work:<slug>`, plus
 * `data-work-slug`.
 */
export function workTrackingAttrs(slug: string): PageTrackingAttrs {
  return {
    ...pageTrackingAttrs('workStory'),
    'data-page-key': workPageKey(slug),
    'data-work-slug': slug,
  }
}

type QueueFn = ((...args: unknown[]) => void) & Record<string, unknown>

interface AnalyticsWindow {
  dataLayer?: unknown[]
  gtag?: QueueFn
  fbq?: QueueFn
  _fbq?: QueueFn
  __testifyAnalyticsInit?: boolean
}

/**
 * Install the providers' standard command queues and send their init calls,
 * once per page load. Events queue until gtag.js / fbevents.js (loaded by
 * `AnalyticsScripts`) arrive and drain them, so the first page_view is never
 * lost to script timing. No-op on the server and when nothing is configured.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as AnalyticsWindow
  if (w.__testifyAnalyticsInit) return
  w.__testifyAnalyticsInit = true

  if (gtagId()) {
    w.dataLayer = w.dataLayer ?? []
    if (!w.gtag) {
      const dataLayer = w.dataLayer
      // gtag.js only reads real `arguments` objects from the dataLayer.
      w.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        dataLayer.push(arguments)
      } as QueueFn
    }
    w.gtag('js', new Date())
    // page_view is sent by the route listener, so turn off the automatic one.
    if (analyticsConfig.ga4Id) w.gtag('config', analyticsConfig.ga4Id, { send_page_view: false })
    if (analyticsConfig.googleAdsId) w.gtag('config', analyticsConfig.googleAdsId)
  }

  if (analyticsConfig.metaPixelId) {
    if (!w.fbq) {
      // Meta's documented stub: queue calls until fbevents.js replaces callMethod.
      const fbq: QueueFn = function (...args: unknown[]) {
        const callMethod = fbq['callMethod'] as ((...a: unknown[]) => void) | undefined
        if (callMethod) callMethod.apply(fbq, args)
        else (fbq['queue'] as unknown[]).push(args)
      } as QueueFn
      fbq['push'] = fbq
      fbq['loaded'] = true
      fbq['version'] = '2.0'
      fbq['queue'] = []
      w.fbq = fbq
      if (!w._fbq) w._fbq = fbq
    }
    // No automatic PageView: the route listener sends it.
    w.fbq('init', analyticsConfig.metaPixelId)
  }
}

/** The offer as a GA4 item / Meta content, from siteConfig. */
function offerItem() {
  const { offer } = siteConfig
  return { item_id: offer.id, item_name: offer.name, price: offer.price, quantity: 1 }
}

function compact(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined))
}

/**
 * Emit an analytics event to every configured provider. No-op on the server
 * and for any provider whose id is unset. Before a provider script loads,
 * calls queue (see initAnalytics).
 *
 * Props understood: `event_id` (dedupe id, sent as Meta `eventID` and GA4
 * `transaction_id` for purchases), `value`, `currency`, `lp_slug` (the LP the
 * event belongs to; GA4 and Meta custom data), plus any extra key/values
 * (sent to GA4 only). Never pass PII.
 */
export function track(event: TrackEvent, props: TrackProps = {}): void {
  if (typeof window === 'undefined') return
  initAnalytics()
  const map: ProviderEvents = EVENT_MAP[event]
  const w = window as unknown as AnalyticsWindow
  const { event_id: eventId, value, currency, ...rest } = props
  const isCommerce = event !== 'page_view'
  const money = isCommerce
    ? {
        value: value ?? siteConfig.offer.price,
        currency: currency ?? siteConfig.offer.currency,
      }
    : {}

  // Debug/test hook: listen for 'testify:track' on window.
  window.dispatchEvent(new CustomEvent('testify:track', { detail: { event, props } }))

  if (w.gtag && analyticsConfig.ga4Id) {
    w.gtag(
      'event',
      map.ga4,
      compact({
        ...rest,
        ...money,
        ...(isCommerce ? { items: [offerItem()] } : {}),
        ...(event === 'purchase_complete' && eventId ? { transaction_id: eventId } : {}),
        ...(eventId ? { event_id: eventId } : {}),
        send_to: analyticsConfig.ga4Id,
      })
    )
  }

  const adsLabel =
    event === 'lead_submit' || event === 'purchase_complete'
      ? analyticsConfig.googleAdsLabels[event]
      : null
  if (w.gtag && map.googleAdsConversion && analyticsConfig.googleAdsId && adsLabel) {
    w.gtag(
      'event',
      'conversion',
      compact({
        send_to: `${analyticsConfig.googleAdsId}/${adsLabel}`,
        ...money,
        ...(eventId ? { transaction_id: eventId } : {}),
      })
    )
  }

  if (w.fbq && analyticsConfig.metaPixelId) {
    const metaProps = isCommerce
      ? compact({
          ...money,
          content_ids: [siteConfig.offer.id],
          content_type: 'product',
          content_name: siteConfig.offer.name,
          lp_slug: rest['lp_slug'] ?? undefined,
        })
      : {}
    w.fbq(
      map.metaStandard ? 'track' : 'trackCustom',
      map.meta,
      metaProps,
      ...(eventId ? [{ eventID: String(eventId) }] : [])
    )
  }
}
