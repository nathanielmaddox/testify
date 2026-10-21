/**
 * SERVER ONLY. No-op adapters: the default for every concern. Each one answers honestly and sends
 * nothing. A call returns `not-connected` (or `not-implemented` for a provider name with no code),
 * never a fake success. See `lib/integrations/index.ts` for when each one is chosen.
 */
import type { CheckoutResponse } from '../../checkout'
import type {
  BookingAdapter,
  DataStoreAdapter,
  EmailAdapter,
  IntegrationFailure,
  PaymentsAdapter,
  UploadAdapter,
} from '../types'

function notConnected(concern: string, envName: string): IntegrationFailure {
  return {
    ok: false,
    reason: 'not-connected',
    message: `${concern} is not connected. Set ${envName} to a provider to enable it.`,
  }
}

/**
 * A provider name was chosen that has no adapter code yet, or a stub whose env vars are missing or
 * whose code is not written. `envReady` is true only when the provider's env vars are all set.
 */
export function stubFailure(label: string, envReady: boolean): IntegrationFailure {
  if (!envReady) {
    return {
      ok: false,
      reason: 'missing-env',
      message: `${label} is selected but its env vars are not set.`,
    }
  }
  return {
    ok: false,
    reason: 'not-implemented',
    message: `${label} adapter is a stub. Implement the TODO(integration) in its provider file.`,
  }
}

export function noPayments(): PaymentsAdapter {
  return {
    async createCheckoutSession(): Promise<CheckoutResponse> {
      return {
        ok: false,
        error: 'checkout_not_configured',
        message: 'Checkout is not available yet.',
      }
    },
    async verifyPaidSession() {
      return false
    },
  }
}

export function noEmail(): EmailAdapter {
  return {
    async sendTransactional() {
      return notConnected('Transactional email', 'EMAIL_PROVIDER')
    },
  }
}

export function noBooking(): BookingAdapter {
  return {
    async listSlots() {
      return notConnected('Booking', 'BOOKING_PROVIDER')
    },
    async createBooking() {
      return notConnected('Booking', 'BOOKING_PROVIDER')
    },
  }
}

export function noDataStore(): DataStoreAdapter {
  return {
    async saveLead() {
      return notConnected('Data store', 'DATA_PROVIDER')
    },
    async saveGetStartedAnswers() {
      return notConnected('Data store', 'DATA_PROVIDER')
    },
    async saveOnboardingAnswers() {
      return notConnected('Data store', 'DATA_PROVIDER')
    },
    async saveFeedback() {
      return notConnected('Data store', 'DATA_PROVIDER')
    },
  }
}

export function noUpload(): UploadAdapter {
  return {
    async createUploadTarget() {
      return notConnected('Uploads', 'UPLOAD_PROVIDER')
    },
    async finalizeUpload() {
      return notConnected('Uploads', 'UPLOAD_PROVIDER')
    },
  }
}

/** For a booking provider name with no adapter code (Calendly today). */
export function notImplementedBooking(label: string): BookingAdapter {
  const failure = (): IntegrationFailure => ({
    ok: false,
    reason: 'not-implemented',
    message: `${label} has no adapter code yet. Write one in lib/integrations/providers.`,
  })
  return {
    async listSlots() {
      return failure()
    },
    async createBooking() {
      return failure()
    },
  }
}
