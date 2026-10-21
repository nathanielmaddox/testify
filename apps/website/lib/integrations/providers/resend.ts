/**
 * SERVER ONLY. STUB EmailAdapter for Resend (the alternative to Postmark). Nothing is sent until
 * this is implemented. Selecting EMAIL_PROVIDER=resend returns `missing-env` while the env vars are
 * unset, and `not-implemented` after that.
 *
 * Env (server only): RESEND_API_KEY (starts with re_), EMAIL_FROM (a sender on a verified domain).
 *
 * Call to implement (Resend Emails API, see the Resend docs):
 *   POST https://api.resend.com/emails
 *   Headers: Authorization: Bearer <RESEND_API_KEY>, Content-Type: application/json
 *   Body:    { "from": <EMAIL_FROM>, "to": [message.to], "subject": "...", "html": "...",
 *              "text": "..." }
 *   Success: 200 with { "id": "..." } -> { ok: true, messageId }
 *   Failure: non-2xx with an error message. Map to provider-error. Log the status, not the body.
 *
 * TODO(integration): implement sendTransactional. Confirm field names in the Resend docs first.
 */
import type { EmailAdapter } from '../types'
import { stubFailure } from './none'

export function createResendEmail(): EmailAdapter {
  return {
    async sendTransactional() {
      return stubFailure(
        'Resend',
        Boolean(process.env.RESEND_API_KEY) && Boolean(process.env.EMAIL_FROM)
      )
    },
  }
}
