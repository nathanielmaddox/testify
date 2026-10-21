/**
 * SERVER ONLY: the request guards shared by the site's POST routes (checkout, onboarding, feedback).
 *
 * Same-origin: a present Origin header must match this host. With no Origin the body must be JSON:
 * a plain cross-site HTML form cannot send application/json, and a cross-site fetch needs a CORS
 * preflight that these routes never grant.
 *
 * JSON bodies: `parseJsonObject` accepts only a plain object. Anything else (null, arrays, numbers,
 * strings, malformed text) reads as null, so the route answers 400 instead of throwing.
 *
 * Rate limit: BEST-EFFORT. It is in-memory, per bucket and client IP, so each serverless instance
 * keeps its own counts and a burst spread across instances is not stopped. The client IP comes from
 * the platform header (`x-real-ip`), then the last `x-forwarded-for` entry (the one the nearest proxy
 * appended). Requests with no IP share one bucket. A real limit needs a shared store (Redis, Upstash,
 * or the edge rate-limit rules).
 */

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (origin) {
    try {
      return new URL(origin).host === new URL(request.url).host
    } catch {
      return false
    }
  }
  const type = request.headers.get('content-type') ?? ''
  return type.toLowerCase().startsWith('application/json')
}

/** The body as a plain JSON object, or null when it is anything else or not valid JSON. */
export async function parseJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  let parsed: unknown
  try {
    parsed = await request.json()
  } catch {
    return null
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return null
  return parsed as Record<string, unknown>
}

/** Client IP for the limiter. Platform header first; `x-forwarded-for` is trusted only by its last hop. */
function clientIp(request: Request): string {
  const real = request.headers.get('x-real-ip')?.trim()
  if (real) return real
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const entries = forwarded
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
    const last = entries[entries.length - 1]
    if (last) return last
  }
  return 'shared'
}

const hits = new Map<string, number[]>()
const MAX_KEYS = 5000

/** Records this request and returns true when the client is over `max` in `windowMs`. Best-effort. */
export function overRateLimit(
  bucket: string,
  request: Request,
  max: number,
  windowMs: number,
  now: number = Date.now()
): boolean {
  const key = `${bucket}:${clientIp(request)}`
  const recent = (hits.get(key) ?? []).filter((at) => now - at < windowMs)
  recent.push(now)
  hits.set(key, recent)
  // Keep the map bounded: drop keys with no hits left in their window.
  if (hits.size > MAX_KEYS) {
    for (const [name, list] of hits) {
      if (list.every((at) => now - at >= windowMs)) hits.delete(name)
    }
  }
  return recent.length > max
}

/** HTTP status for an adapter failure reason. Nothing is ever sent as a fake success. */
export function statusForFailure(reason: string): number {
  switch (reason) {
    case 'invalid-input':
      return 400
    case 'slot-taken':
      return 409
    case 'not-connected':
    case 'missing-env':
    case 'not-implemented':
      return 503
    default:
      return 502
  }
}

/**
 * The visitor-facing line for an adapter failure. The adapter's own message is logged on the server
 * and never sent to the browser, because it can name env vars or provider internals.
 */
export function visitorMessage(reason: string): string {
  if (reason === 'not-connected') return "This isn't connected yet."
  return 'Something went wrong on our side.'
}
