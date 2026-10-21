/**
 * SERVER ONLY. STUBS for Convex: the data store, the upload target and a booking table. Nothing is
 * written until these are implemented. Selecting a Convex switch returns `missing-env` while the env
 * vars are unset, and `not-implemented` after that.
 *
 * Env (server only): CONVEX_URL (https://<deployment>.convex.cloud, the client URL),
 * CONVEX_SITE_URL (https://<deployment>.convex.site, the HTTP actions URL). CONVEX_DEPLOY_KEY is
 * for the Convex CLI in CI only. This app never reads it.
 *
 * Shape to implement:
 *   - Schema and functions live in a `convex/` folder at the Convex project root (add it when the
 *     deployment exists). Writes are mutations (or HTTP actions that call them). Every save is an
 *     insert, never a patch, so records stay append-only.
 *   - The Next server reaches Convex either with the Convex HTTP client (npm `convex`, not installed
 *     here) or with a POST to CONVEX_SITE_URL. Auth between this server and Convex is an open
 *     decision (see INTEGRATIONS.md). Do not ship a public write endpoint.
 *   - Uploads: a mutation calls ctx.storage.generateUploadUrl(). The browser POSTs the file to that
 *     URL and gets a storageId back. finalizeUpload then saves the storageId with the reference id.
 *   - Booking table: only if Cal.com is not used. Store slots and bookings in Convex tables.
 *
 * TODO(integration): implement the three factories below and the convex/ functions they call.
 */
import type { BookingAdapter, DataStoreAdapter, UploadAdapter } from '../types'
import { stubFailure } from './none'

const convexReady = (): boolean => Boolean(process.env.CONVEX_URL)

export function createConvexDataStore(): DataStoreAdapter {
  // TODO(integration): saveLead, saveGetStartedAnswers, saveOnboardingAnswers, saveFeedback each
  // insert one row and return its _id as { id }.
  return {
    async saveLead() {
      return stubFailure('Convex data store', convexReady())
    },
    async saveGetStartedAnswers() {
      return stubFailure('Convex data store', convexReady())
    },
    async saveOnboardingAnswers() {
      return stubFailure('Convex data store', convexReady())
    },
    async saveFeedback() {
      return stubFailure('Convex data store', convexReady())
    },
  }
}

export function createConvexUpload(): UploadAdapter {
  // TODO(integration): createUploadTarget calls the mutation that returns ctx.storage.generateUploadUrl()
  // and returns it as UploadTarget (method POST, Content-Type header). finalizeUpload checks the
  // storageId and records it against referenceId.
  return {
    async createUploadTarget() {
      return stubFailure('Convex uploads', convexReady())
    },
    async finalizeUpload() {
      return stubFailure('Convex uploads', convexReady())
    },
  }
}

export function createConvexBooking(): BookingAdapter {
  // TODO(integration): only when Cal.com is not used. listSlots reads open slots from a table;
  // createBooking holds the slot in one mutation so two visitors cannot take it (slot-taken).
  return {
    async listSlots() {
      return stubFailure('Convex booking', convexReady())
    },
    async createBooking() {
      return stubFailure('Convex booking', convexReady())
    },
  }
}
