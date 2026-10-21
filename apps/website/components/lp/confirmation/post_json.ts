// Browser helper for the confirmation forms: POST a JSON body and read the adapter result. Nothing is
// put in the URL. A non-JSON or failed request reads as `provider-error`, never as success.

export type PostResult =
  { ok: true; data: Record<string, unknown> } | { ok: false; reason: string; message: string }

/** Adapter reasons that mean "not connected yet": the form stays disabled with the pending reason. */
export const PENDING_REASONS: readonly string[] = [
  'not-connected',
  'missing-env',
  'not-implemented',
]

export async function postJson(url: string, body: unknown): Promise<PostResult> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = (await response.json()) as Record<string, unknown>
    if (data['ok'] === true) return { ok: true, data }
    const reason = typeof data['reason'] === 'string' ? data['reason'] : 'provider-error'
    const message = typeof data['message'] === 'string' ? data['message'] : 'Something went wrong.'
    return { ok: false, reason, message }
  } catch {
    return {
      ok: false,
      reason: 'provider-error',
      message: 'Something went wrong on our side. Try again in a moment.',
    }
  }
}
