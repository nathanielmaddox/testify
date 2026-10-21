// Payment error copy for the checkout pay form, keyed by Stripe decline and error codes (Paper
// "checkout, inline errors" K48-0). The submit path shows the entry for the API's error code. The
// Payment Element handler reuses the same map once it is mounted. Unknown codes fall back to
// `stripe_error`, the network line, because a code we do not map is not a card decline.

export type PaymentErrorCode =
  | 'card_declined'
  | 'insufficient_funds'
  | 'expired_card'
  | 'authentication_required'
  | 'rate_limit'
  | 'email_already_active'
  | 'stripe_error'

export interface PaymentErrorCopy {
  /** Banner title. Only the generic decline has one in Paper. */
  title?: string
  body: string
}

export const PAYMENT_ERROR_COPY: Record<PaymentErrorCode, PaymentErrorCopy> = {
  card_declined: {
    title: "Payment didn't go through",
    body: 'Your bank declined this card. Try another card, or pay with Apple Pay, Google Pay or Link.',
  },
  insufficient_funds: {
    body: "This card doesn't have enough funds right now. Try another card.",
  },
  expired_card: {
    body: 'This card has expired. Try another card.',
  },
  authentication_required: {
    body: "Your bank couldn't confirm this payment. Try again, or use another card.",
  },
  rate_limit: {
    body: 'Too many tries. Wait a few minutes, then try again, or email hello@[DOMAIN].',
  },
  email_already_active: {
    body: 'This email already has a plan. Check your inbox for your portal link, or email hello@[DOMAIN].',
  },
  stripe_error: {
    body: "Something went wrong on our side. You haven't been charged. Try again in a moment.",
  },
}

/** Copy for an API or Stripe error code. Any code without an entry gets the network line. */
export function paymentErrorCopy(code: string | undefined): PaymentErrorCopy {
  if (code && Object.prototype.hasOwnProperty.call(PAYMENT_ERROR_COPY, code)) {
    return PAYMENT_ERROR_COPY[code as PaymentErrorCode]
  }
  return PAYMENT_ERROR_COPY.stripe_error
}
