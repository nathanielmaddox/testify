/**
 * SERVER ONLY. STUB EmailAdapter for Postmark. Nothing is sent until this is implemented.
 * Selecting EMAIL_PROVIDER=postmark returns `missing-env` while the env vars are unset, and
 * `not-implemented` after that.
 *
 * Env (server only): POSTMARK_SERVER_TOKEN (the server API token of one Postmark server),
 * EMAIL_FROM (a sender address or domain verified in Postmark).
 *
 * Call to implement (Postmark Email API, see the Postmark developer docs):
 *   POST https://api.postmarkapp.com/email
 *   Headers: Accept: application/json, Content-Type: application/json,
 *            X-Postmark-Server-Token: <POSTMARK_SERVER_TOKEN>
 *   Body:    { "From": <EMAIL_FROM>, "To": message.to, "Subject": "...", "HtmlBody": "...",
 *              "TextBody": "...", "MessageStream": "outbound" }
 *   Success: 200 with { "MessageID": "..." } -> { ok: true, messageId }
 *   Failure: JSON with "ErrorCode" and "Message". Map to provider-error. Log the code, not the body.
 *
 * Render each EmailTemplates key in code (one subject and body per key), or use Postmark templates
 * (POST /email/withTemplate with TemplateAlias) and pass the same typed data.
 *
 * TODO(integration): implement sendTransactional. Confirm field names in the Postmark docs first.
 */
import type { EmailAdapter } from '../types'
import { stubFailure } from './none'

export function createPostmarkEmail(): EmailAdapter {
  return {
    async sendTransactional() {
      return stubFailure(
        'Postmark',
        Boolean(process.env.POSTMARK_SERVER_TOKEN) && Boolean(process.env.EMAIL_FROM)
      )
    },
  }
}
