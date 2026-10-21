/**
 * SERVER ONLY: the one place that picks a provider for each concern.
 *
 * `import 'server-only'` is not installed in this app (the owner ruled no new dependencies here),
 * so the guard below throws at load time if this module is bundled for the browser. Import
 * `getIntegrations()` only from route handlers, server components and server actions.
 *
 * Choosing a provider, per concern:
 *   1. An explicit switch always wins (`stripe`, `postmark`, `none`, ...). `none` means no outside call.
 *   2. An unset switch is inferred from which provider key is present (see CANDIDATES below).
 *   3. Nothing set and nothing inferred means `none`.
 *   An explicit unknown value throws. Two candidates for one unset switch also throw, so set the
 *   switch to choose. Both checks run when this module first loads on the server, not per request.
 *
 * Explicit switches:
 *   PAYMENTS_PROVIDER  stripe | none
 *   EMAIL_PROVIDER     postmark | resend | none
 *   BOOKING_PROVIDER   calcom | calendly | convex | none
 *   DATA_PROVIDER      convex | none
 *   UPLOAD_PROVIDER    convex | uploadthing | s3 | none
 */
import { createCalcomBooking } from './providers/calcom'
import { createConvexBooking, createConvexDataStore, createConvexUpload } from './providers/convex'
import { createPostmarkEmail } from './providers/postmark'
import { createResendEmail } from './providers/resend'
import { createS3Upload } from './providers/s3'
import { createStripePayments } from './providers/stripe'
import { createUploadthingUpload } from './providers/uploadthing'
import {
  noBooking,
  noDataStore,
  noEmail,
  noPayments,
  noUpload,
  notImplementedBooking,
} from './providers/none'
import type {
  BookingProvider,
  DataProvider,
  EmailProvider,
  Integrations,
  PaymentsProvider,
  UploadProvider,
} from './types'

if (typeof window !== 'undefined') {
  throw new Error('lib/integrations is server only. Import it from route handlers or server code.')
}

export * from './types'

type Concern = 'payments' | 'email' | 'booking' | 'dataStore' | 'upload'

interface Choice<T extends string> {
  provider: T
  /** How the choice was made, for the development log. Names only, never values. */
  source: string
}

interface Candidate<T extends string> {
  provider: T
  /** The env var whose presence suggests this provider. */
  envName: string
}

/** Presence of a key suggests a provider. Used only when the matching switch is unset. */
function present(value: string | undefined): boolean {
  return Boolean(value && value.trim() !== '')
}

/**
 * Chooses one provider for a concern. Throws on an unknown explicit value or an ambiguous
 * inference. Returns `none` when nothing is set and nothing is inferred.
 */
function choose<T extends 'none' | string>(
  concern: Concern,
  switchName: string,
  raw: string | undefined,
  allowed: readonly T[],
  candidates: readonly Candidate<Exclude<T, 'none'>>[]
): Choice<T> {
  const value = (raw ?? '').trim().toLowerCase()
  if (value !== '') {
    if ((allowed as readonly string[]).includes(value)) {
      return { provider: value as T, source: `${switchName}=${value}` }
    }
    throw new Error(
      `[integrations] ${switchName}="${value}" is not a known provider for ${concern}. ` +
        `Use one of: ${allowed.join(', ')}.`
    )
  }
  if (candidates.length === 0) return { provider: 'none' as T, source: 'nothing set' }
  if (candidates.length > 1) {
    const names = candidates.map((c) => c.envName).join(' and ')
    throw new Error(
      `[integrations] ${switchName} is not set and both ${names} are set for ${concern}. ` +
        `Set ${switchName} to choose one.`
    )
  }
  const only = candidates[0]
  if (!only) return { provider: 'none' as T, source: 'nothing set' }
  return { provider: only.provider as T, source: `inferred from ${only.envName}` }
}

/**
 * Key-based inference. Only applies when the matching switch is unset. Uploads use Convex only when
 * neither UploadThing nor S3 is set, so a Convex data store and a separate upload host can coexist.
 */
const CANDIDATES = {
  payments: (): Candidate<Exclude<PaymentsProvider, 'none'>>[] =>
    present(process.env.STRIPE_SECRET_KEY)
      ? [{ provider: 'stripe', envName: 'STRIPE_SECRET_KEY' }]
      : [],
  email: (): Candidate<Exclude<EmailProvider, 'none'>>[] => {
    const out: Candidate<Exclude<EmailProvider, 'none'>>[] = []
    if (present(process.env.POSTMARK_SERVER_TOKEN)) {
      out.push({ provider: 'postmark', envName: 'POSTMARK_SERVER_TOKEN' })
    }
    if (present(process.env.RESEND_API_KEY)) {
      out.push({ provider: 'resend', envName: 'RESEND_API_KEY' })
    }
    return out
  },
  booking: (): Candidate<Exclude<BookingProvider, 'none'>>[] =>
    present(process.env.CALCOM_API_KEY) ? [{ provider: 'calcom', envName: 'CALCOM_API_KEY' }] : [],
  dataStore: (): Candidate<Exclude<DataProvider, 'none'>>[] =>
    present(process.env.CONVEX_URL) ? [{ provider: 'convex', envName: 'CONVEX_URL' }] : [],
  upload: (): Candidate<Exclude<UploadProvider, 'none'>>[] => {
    const out: Candidate<Exclude<UploadProvider, 'none'>>[] = []
    if (present(process.env.UPLOADTHING_TOKEN)) {
      out.push({ provider: 'uploadthing', envName: 'UPLOADTHING_TOKEN' })
    }
    if (present(process.env.S3_BUCKET)) out.push({ provider: 's3', envName: 'S3_BUCKET' })
    if (out.length === 0 && present(process.env.CONVEX_URL)) {
      out.push({ provider: 'convex', envName: 'CONVEX_URL' })
    }
    return out
  },
}

const PAYMENTS_PROVIDERS: readonly PaymentsProvider[] = ['stripe', 'none']
const EMAIL_PROVIDERS: readonly EmailProvider[] = ['postmark', 'resend', 'none']
const BOOKING_PROVIDERS: readonly BookingProvider[] = ['calcom', 'calendly', 'convex', 'none']
const DATA_PROVIDERS: readonly DataProvider[] = ['convex', 'none']
const UPLOAD_PROVIDERS: readonly UploadProvider[] = ['convex', 'uploadthing', 's3', 'none']

function build(): { integrations: Integrations; choices: Record<Concern, Choice<string>> } {
  const choices = {
    payments: choose<PaymentsProvider>(
      'payments',
      'PAYMENTS_PROVIDER',
      process.env.PAYMENTS_PROVIDER,
      PAYMENTS_PROVIDERS,
      CANDIDATES.payments()
    ),
    email: choose<EmailProvider>(
      'email',
      'EMAIL_PROVIDER',
      process.env.EMAIL_PROVIDER,
      EMAIL_PROVIDERS,
      CANDIDATES.email()
    ),
    booking: choose<BookingProvider>(
      'booking',
      'BOOKING_PROVIDER',
      process.env.BOOKING_PROVIDER,
      BOOKING_PROVIDERS,
      CANDIDATES.booking()
    ),
    dataStore: choose<DataProvider>(
      'dataStore',
      'DATA_PROVIDER',
      process.env.DATA_PROVIDER,
      DATA_PROVIDERS,
      CANDIDATES.dataStore()
    ),
    upload: choose<UploadProvider>(
      'upload',
      'UPLOAD_PROVIDER',
      process.env.UPLOAD_PROVIDER,
      UPLOAD_PROVIDERS,
      CANDIDATES.upload()
    ),
  }

  const providers: Integrations['providers'] = {
    payments: choices.payments.provider as PaymentsProvider,
    email: choices.email.provider as EmailProvider,
    booking: choices.booking.provider as BookingProvider,
    dataStore: choices.dataStore.provider as DataProvider,
    upload: choices.upload.provider as UploadProvider,
  }

  const integrations: Integrations = {
    providers,
    payments: providers.payments === 'stripe' ? createStripePayments() : noPayments(),
    email:
      providers.email === 'postmark'
        ? createPostmarkEmail()
        : providers.email === 'resend'
          ? createResendEmail()
          : noEmail(),
    booking:
      providers.booking === 'calcom'
        ? createCalcomBooking()
        : providers.booking === 'convex'
          ? createConvexBooking()
          : providers.booking === 'calendly'
            ? notImplementedBooking('Calendly')
            : noBooking(),
    dataStore: providers.dataStore === 'convex' ? createConvexDataStore() : noDataStore(),
    upload:
      providers.upload === 'convex'
        ? createConvexUpload()
        : providers.upload === 'uploadthing'
          ? createUploadthingUpload()
          : providers.upload === 's3'
            ? createS3Upload()
            : noUpload(),
  }
  return { integrations, choices }
}

/**
 * Built when this module first loads on the server, so a bad or ambiguous switch fails at startup.
 * In development, logs once which provider each concern chose and why.
 */
const built = build()
if (process.env.NODE_ENV === 'development') {
  for (const [concern, choice] of Object.entries(built.choices)) {
    console.info(`[integrations] ${concern}: ${choice.provider} (${choice.source})`)
  }
}

/** The adapters for this deploy. Built once per server process. */
export function getIntegrations(): Integrations {
  return built.integrations
}
