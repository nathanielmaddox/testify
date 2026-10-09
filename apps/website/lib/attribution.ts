/**
 * Ad attribution: capture UTM + click-id params on the first landing (any
 * route), persist them first-party (cookie, 90 days, plus sessionStorage), and
 * hand them back for onward links and for the lead / Stripe session later.
 *
 * Import-safe on the server: browser globals are only touched inside the
 * browser helpers, which no-op when `window` is missing. The pure helpers
 * (`parseAttributionParams`, `mergeTouch`, `encode/decodeAttribution`,
 * `applyParams`) take their inputs explicitly so they can be tested in Node.
 *
 * Never store PII here: only campaign params, click ids, the landing path and
 * the referrer HOST.
 */

/** Query params that carry ad attribution. Matched case-insensitively. */
export const ATTRIBUTION_PARAMS = [
  // UTM
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  // Google
  'gclid',
  'gbraid',
  'wbraid',
  'gad_source',
  '_gl',
  'dclid',
  // Meta
  'fbclid',
  // Microsoft
  'msclkid',
  // TikTok
  'ttclid',
  // X / Twitter
  'twclid',
  // LinkedIn
  'li_fat_id',
  // Snapchat
  'sccid',
  // Pinterest
  'epik',
  // Reddit
  'rdt_cid',
] as const

export type AttributionParam = (typeof ATTRIBUTION_PARAMS)[number]

export type AttributionParams = Partial<Record<AttributionParam, string>>

/** One visit that carried (or lacked) attribution. */
export interface AttributionTouch {
  params: AttributionParams
  /** Path the visitor landed on (no query string). */
  landingPath: string
  /** Referrer host only (never the full referrer URL), '' when direct. */
  referrerHost: string
  /** ISO timestamp. */
  at: string
}

export interface StoredAttribution {
  v: 1
  /** First landing ever (within the cookie lifetime). Never overwritten. */
  first: AttributionTouch
  /** Latest landing that carried params or came from an external referrer. */
  last: AttributionTouch
}

export const ATTRIBUTION_COOKIE = 'tfy_attr'
export const ATTRIBUTION_STORAGE_KEY = 'tfy_attr'
export const ATTRIBUTION_MAX_AGE_DAYS = 90
/** Per-value cap so the cookie stays far below 4 KB. */
const MAX_VALUE_LENGTH = 256

const CANONICAL = new Map<string, AttributionParam>(
  ATTRIBUTION_PARAMS.map((name) => [name.toLowerCase(), name])
)

type SearchLike = string | URLSearchParams | Record<string, string | string[] | undefined>

function entriesOf(search: SearchLike): Array<[string, string]> {
  if (typeof search === 'string') {
    return [...new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)]
  }
  if (search instanceof URLSearchParams) return [...search]
  const out: Array<[string, string]> = []
  for (const [key, value] of Object.entries(search)) {
    const first = Array.isArray(value) ? value[0] : value
    if (typeof first === 'string') out.push([key, first])
  }
  return out
}

/**
 * Attribution params in a query string / URLSearchParams / Next searchParams
 * record. Names match case-insensitively (`UTM_Source` -> `utm_source`);
 * empty values are ignored; the first occurrence wins.
 */
export function parseAttributionParams(search: SearchLike): AttributionParams {
  const out: AttributionParams = {}
  for (const [rawKey, rawValue] of entriesOf(search)) {
    const name = CANONICAL.get(rawKey.toLowerCase())
    const value = rawValue.trim().slice(0, MAX_VALUE_LENGTH)
    if (name && value && out[name] === undefined) out[name] = value
  }
  return out
}

export function hasParams(params: AttributionParams): boolean {
  return Object.keys(params).length > 0
}

/**
 * Fold a new touch into what is stored. `first` is set once; `last` moves
 * only for a touch that carries params or arrives from another site, so
 * internal navigation and direct returns never wipe a paid click.
 */
export function mergeTouch(
  existing: StoredAttribution | null,
  touch: AttributionTouch,
  ownHost: string
): StoredAttribution {
  const external = touch.referrerHost !== '' && touch.referrerHost !== ownHost.toLowerCase()
  const meaningful = hasParams(touch.params) || external
  if (!existing) return { v: 1, first: touch, last: touch }
  return { v: 1, first: existing.first, last: meaningful ? touch : existing.last }
}

export function encodeAttribution(value: StoredAttribution): string {
  return encodeURIComponent(JSON.stringify(value))
}

function isTouch(value: unknown): value is AttributionTouch {
  if (!value || typeof value !== 'object') return false
  const touch = value as Record<string, unknown>
  return (
    typeof touch['landingPath'] === 'string' &&
    typeof touch['referrerHost'] === 'string' &&
    typeof touch['at'] === 'string' &&
    !!touch['params'] &&
    typeof touch['params'] === 'object'
  )
}

/** Parse a stored value; anything malformed reads as nothing stored. */
export function decodeAttribution(raw: string | null | undefined): StoredAttribution | null {
  if (!raw) return null
  try {
    const value = JSON.parse(decodeURIComponent(raw)) as Record<string, unknown>
    if (value['v'] !== 1 || !isTouch(value['first']) || !isTouch(value['last'])) return null
    // Re-run the params through the allow-list so a tampered cookie adds nothing else.
    return {
      v: 1,
      first: { ...value['first'], params: parseAttributionParams(toRecord(value['first'].params)) },
      last: { ...value['last'], params: parseAttributionParams(toRecord(value['last'].params)) },
    }
  } catch {
    return null
  }
}

function toRecord(params: AttributionParams): Record<string, string | undefined> {
  return { ...params }
}

/**
 * Add params to an href without overwriting params it already sets. Relative
 * hrefs stay relative; the hash is kept.
 */
export function applyParams(href: string, params: AttributionParams): string {
  const isAbsolute = /^[a-z][a-z\d+.-]*:\/\//i.test(href)
  const target = new URL(href, 'http://relative.invalid')
  const present = new Set([...target.searchParams.keys()].map((key) => key.toLowerCase()))
  for (const name of ATTRIBUTION_PARAMS) {
    const value = params[name]
    if (value && !present.has(name)) target.searchParams.set(name, value)
  }
  return isAbsolute ? target.toString() : `${target.pathname}${target.search}${target.hash}`
}

/**
 * Copy the attribution params of the CURRENT request onto an onward href
 * (server or client: pass the page's searchParams).
 */
export function withAttribution(href: string, searchParams: SearchLike | null | undefined): string {
  return searchParams ? applyParams(href, parseAttributionParams(searchParams)) : href
}

// ---------------------------------------------------------------------------
// Browser helpers. Safe to import anywhere; they no-op without `window`.
// ---------------------------------------------------------------------------

function inBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim()
    if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length)
  }
  return null
}

function writeStored(value: StoredAttribution): void {
  const encoded = encodeAttribution(value)
  const maxAge = ATTRIBUTION_MAX_AGE_DAYS * 24 * 60 * 60
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${ATTRIBUTION_COOKIE}=${encoded}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`
  try {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, encoded)
  } catch {
    // Storage blocked (private mode, policy): the cookie still holds it.
  }
}

/**
 * The stored first/last touch, for attaching to a lead or a Stripe Checkout
 * session (metadata) once those exist. sessionStorage first, then the cookie.
 * Returns null on the server or when nothing was captured.
 */
export function getAttribution(): StoredAttribution | null {
  if (!inBrowser()) return null
  let fromSession: string | null = null
  try {
    fromSession = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)
  } catch {
    fromSession = null
  }
  return decodeAttribution(fromSession) ?? decodeAttribution(readCookie(ATTRIBUTION_COOKIE))
}

/**
 * Record this page load as a touch. Called once per full page load from
 * components/providers.tsx (client navigations keep the same referrer, so
 * they are not new touches). Returns what is stored afterwards.
 */
export function captureAttribution(): StoredAttribution | null {
  if (!inBrowser()) return null
  let referrerHost = ''
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : ''
  } catch {
    referrerHost = ''
  }
  const touch: AttributionTouch = {
    params: parseAttributionParams(window.location.search),
    landingPath: window.location.pathname,
    referrerHost,
    at: new Date().toISOString(),
  }
  const next = mergeTouch(getAttribution(), touch, window.location.hostname)
  writeStored(next)
  return next
}

/** Last-touch params, falling back to first-touch. Empty when none. */
export function storedParams(
  stored: StoredAttribution | null = getAttribution()
): AttributionParams {
  if (!stored) return {}
  return hasParams(stored.last.params) ? stored.last.params : stored.first.params
}

/**
 * An internal href (e.g. the header/home CTA to /lp) with the stored
 * attribution params added, so a visitor who landed on / with a paid click
 * still reaches /lp attributed. Browser only: on the server it returns `href`
 * unchanged, so call it AFTER mount (effect or click handler), never during
 * render, or the server and client HTML differ. `useAttributedHref` in
 * components/lp/use_attributed_href.ts wraps that for components.
 */
export function withStoredAttribution(href: string): string {
  if (!inBrowser()) return href
  return applyParams(href, storedParams())
}
