/**
 * Adapter contracts for every outside service the site can use. Server only: the implementations
 * read secrets. Each concern has one interface here, one env switch in `index.ts`, and a set of
 * providers under `providers/`. Nothing in `components/` imports a provider directly.
 *
 * Results never fake success. A missing or unimplemented provider returns a failure with a reason,
 * so the UI can show an honest notice.
 */
import type { CheckoutRequest, CheckoutResponse } from '../checkout'

/** Why an adapter call did not succeed. */
export type IntegrationFailureReason =
  /** The concern has no provider selected (the default). Nothing was sent. */
  | 'not-connected'
  /** A provider is selected, but its env vars are missing. Nothing was sent. */
  | 'missing-env'
  /** A provider is selected, but its adapter code is still a stub. Nothing was sent. */
  | 'not-implemented'
  /** The caller sent data the adapter refuses (shape, size, type). */
  | 'invalid-input'
  /** The requested slot was taken by someone else. Pick another time. */
  | 'slot-taken'
  /** The provider was reached and refused or failed. */
  | 'provider-error'

export interface IntegrationFailure {
  ok: false
  reason: IntegrationFailureReason
  /**
   * For server logs only. NEVER show this to a visitor, and never return it in an API response.
   * It can name env vars and carry raw provider text. Routes log it and answer with a generic line.
   */
  message: string
}

/**
 * Largest photo the upload adapters accept, in bytes. Shared by every upload adapter and the
 * onboarding route. 25 MB is a default the owner can change here; the form copy must match it.
 */
export const MAX_PHOTO_BYTES = 25 * 1024 * 1024

/** A success with a typed payload, or a failure. */
export type Outcome<T extends object> = ({ ok: true } & T) | IntegrationFailure

/* ----------------------------------------------------------------------------------------------
 * Payments
 * -------------------------------------------------------------------------------------------- */

/**
 * Creates the checkout for an offer LP. Input and output are the existing checkout contract in
 * `lib/checkout.ts`, so the Stripe provider delegates to `lib/checkout_server.ts` and the API route
 * keeps the same response shape.
 */
export interface PaymentsAdapter {
  createCheckoutSession(request: CheckoutRequest): Promise<CheckoutResponse>
  /** True only when the provider reports the session as paid. Any error reads as not paid. */
  verifyPaidSession(sessionId: string): Promise<boolean>
}

/* ----------------------------------------------------------------------------------------------
 * Transactional email
 * -------------------------------------------------------------------------------------------- */

/** Typed data per template. Providers render these in code, or map them onto provider templates. */
export interface EmailTemplates {
  /** Sent after a booking is created. `startsAt` is an ISO 8601 instant. */
  bookingConfirmation: {
    name: string
    startsAt: string
    timeZone: string
    /** Visitor-facing link to reschedule or cancel, when the booking provider gives one. */
    manageUrl?: string
  }
  /** Sent after a paid checkout session is verified (from the Stripe webhook, not the page load). */
  purchaseReceipt: {
    name: string
    planName: string
    amount: number
    currency: string
    /** Billing portal or account link, when one exists. */
    portalUrl?: string
  }
  /** Internal alert to the owner when a lead is saved. Goes to `EMAIL_NOTIFY_TO`. */
  leadNotification: {
    name: string
    email: string
    businessName: string
    /** Offer LP slug, or `site` for the get-started flow. */
    source: string
  }
}

export type EmailTemplateKey = keyof EmailTemplates

export type EmailMessage = {
  to: string
} & {
  [K in EmailTemplateKey]: { template: K; data: EmailTemplates[K] }
}[EmailTemplateKey]

export interface EmailAdapter {
  sendTransactional(message: EmailMessage): Promise<Outcome<{ messageId: string }>>
}

/* ----------------------------------------------------------------------------------------------
 * Bookings
 * -------------------------------------------------------------------------------------------- */

/** One bookable start time, in the visitor's zone. */
export interface BookingSlot {
  /** ISO 8601 instant of the slot start. */
  startsAt: string
  /** Label shown to the visitor, for example "10:30 AM". */
  label: string
}

export interface SlotQuery {
  /** Local calendar day, YYYY-MM-DD, in `timeZone`. */
  date: string
  /** IANA zone, for example "America/Phoenix". */
  timeZone: string
}

/**
 * The booking from `lib/get_started.ts` (`Booking`) plus the contact answers. `date`, `time` and
 * `timeZone` mirror that shape. `startsAt` is what the provider needs once a slot is chosen.
 */
export interface BookingRequest {
  date: string
  time: string
  timeZone: string
  startsAt: string
  contact: { name: string; email: string }
  businessName: string
}

/** Whether the provider sent the invite. Only `sent` may be shown as "invite sent". */
export type InviteStatus = 'sent' | 'not-sent' | 'pending'

export interface BookingAdapter {
  listSlots(query: SlotQuery): Promise<Outcome<{ slots: BookingSlot[] }>>
  createBooking(
    request: BookingRequest
  ): Promise<Outcome<{ bookingId: string; inviteStatus: InviteStatus }>>
  /** Optional: providers that cannot move bookings leave these out. */
  rescheduleBooking?(
    bookingId: string,
    request: BookingRequest
  ): Promise<Outcome<{ bookingId: string }>>
  cancelBooking?(bookingId: string): Promise<Outcome<{ bookingId: string }>>
}

/* ----------------------------------------------------------------------------------------------
 * Data store (append-only)
 * -------------------------------------------------------------------------------------------- */

/** Every saved record gets a new id. Records are appended, never edited in place. */
export interface SaveLeadInput {
  name: string
  email: string
  businessName: string
  /** Offer LP slug, or `site` for the get-started flow. */
  source: string
  /** Stored first and last touch, from `getAttribution()`. Allow-listed params only. */
  attribution?: Record<string, string>
}

export interface SaveGetStartedInput {
  /** Answers per qualifier step, keyed as `GetStartedState` in `lib/get_started.ts`. */
  answers: Record<string, Record<string, string | string[]>>
  booking?: { date: string; time: string; timeZone: string }
}

export interface SaveOnboardingInput {
  /** Lead or purchase reference the answers belong to. */
  referenceId: string
  /** Field values from `components/lp/confirmation/onboarding_form.tsx`. */
  answers: Record<string, string | string[]>
}

export interface SaveFeedbackInput {
  /** Route key or path the feedback came from. */
  page: string
  message: string
  contactEmail?: string
}

export interface DataStoreAdapter {
  saveLead(input: SaveLeadInput): Promise<Outcome<{ id: string }>>
  saveGetStartedAnswers(input: SaveGetStartedInput): Promise<Outcome<{ id: string }>>
  saveOnboardingAnswers(input: SaveOnboardingInput): Promise<Outcome<{ id: string }>>
  saveFeedback(input: SaveFeedbackInput): Promise<Outcome<{ id: string }>>
}

/* ----------------------------------------------------------------------------------------------
 * Uploads (job photos)
 * -------------------------------------------------------------------------------------------- */

/** MIME types the onboarding form accepts (`onboarding_form.tsx`). Size limit is set by the owner. */
export const UPLOAD_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/heic'] as const

export interface UploadTargetRequest {
  purpose: 'job-photo'
  fileName: string
  contentType: string
  sizeBytes: number
  /** Reference the upload belongs to, such as a lead id. */
  referenceId: string
}

/** Where the browser sends the file. Short-lived, single use. */
export interface UploadTarget {
  uploadId: string
  url: string
  method: 'PUT' | 'POST'
  headers: Record<string, string>
  expiresAt: string
}

export interface UploadAdapter {
  createUploadTarget(request: UploadTargetRequest): Promise<Outcome<UploadTarget>>
  /** Called after the browser finishes the upload. Confirms the file exists and records it. */
  finalizeUpload(uploadId: string): Promise<Outcome<{ uploadId: string; publicUrl?: string }>>
}

/* ----------------------------------------------------------------------------------------------
 * Bundle
 * -------------------------------------------------------------------------------------------- */

export type PaymentsProvider = 'stripe' | 'none'
export type EmailProvider = 'postmark' | 'resend' | 'none'
export type BookingProvider = 'calcom' | 'calendly' | 'convex' | 'none'
export type DataProvider = 'convex' | 'none'
export type UploadProvider = 'convex' | 'uploadthing' | 's3' | 'none'

export interface Integrations {
  payments: PaymentsAdapter
  email: EmailAdapter
  booking: BookingAdapter
  dataStore: DataStoreAdapter
  upload: UploadAdapter
  /** The provider each concern resolved to, for logs and the status line. */
  providers: {
    payments: PaymentsProvider
    email: EmailProvider
    booking: BookingProvider
    dataStore: DataProvider
    upload: UploadProvider
  }
}
