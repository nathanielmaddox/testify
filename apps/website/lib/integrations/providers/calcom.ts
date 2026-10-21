/**
 * SERVER ONLY. STUB BookingAdapter for Cal.com. Nothing is booked until this is implemented.
 * Selecting BOOKING_PROVIDER=calcom returns `missing-env` while the env vars are unset, and
 * `not-implemented` after that.
 *
 * Env (server only): CALCOM_API_KEY (starts with cal_), CALCOM_EVENT_TYPE_ID (numeric id of the
 * event type that holds the call length and the owner's availability).
 *
 * Calls to implement (Cal.com API v2). The paths and the cal-api-version header below are a sketch.
 * Confirm both in the Cal.com API docs before use:
 *   listSlots:     GET https://api.cal.com/v2/slots?eventTypeId=<id>&start=<ISO>&end=<ISO>&timeZone=<IANA>
 *                  Headers: Authorization: Bearer <CALCOM_API_KEY>, cal-api-version: <from docs>
 *                  Map the returned times to BookingSlot (startsAt, label in the visitor zone).
 *   createBooking: POST https://api.cal.com/v2/bookings
 *                  Body: { start: <startsAt>, eventTypeId, attendee: { name, email, timeZone } }
 *                  2xx returns the booking uid -> bookingId. Cal.com sends the invite, so report
 *                  inviteStatus 'sent' only after that 2xx, never before.
 *                  A taken slot is an error response. Map it to slot-taken (check its error code).
 *
 * Webhook: Cal.com "BOOKING_CREATED" should reach app/api/webhooks/calcom/route.ts (not written).
 *
 * TODO(integration): implement listSlots and createBooking. Verify every path and field first.
 */
import type { BookingAdapter } from '../types'
import { stubFailure } from './none'

export function createCalcomBooking(): BookingAdapter {
  const ready = Boolean(process.env.CALCOM_API_KEY) && Boolean(process.env.CALCOM_EVENT_TYPE_ID)
  return {
    async listSlots() {
      return stubFailure('Cal.com', ready)
    },
    async createBooking() {
      return stubFailure('Cal.com', ready)
    },
  }
}
