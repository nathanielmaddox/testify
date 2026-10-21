'use client'

// Checkout pay form: email, first and last name, business name, the Stripe Payment Element slot, the charge notice,
// the submit button, the risk reversal and the support line (Paper "Checkout two columns", form column).
// Inline errors follow Paper "checkout, inline errors": field messages under the field, one payment
// banner above the button, values kept. A submit with field errors moves focus to the first invalid
// field. The payment banner sits in an always-mounted role="alert" region so screen readers announce it.
// add_payment_info is NOT fired on submit: it fires from the Payment Element hook once details exist.
import { useState, type FormEvent } from 'react'
import { startCheckout, CHECKOUT_LIMITS, type CheckoutContact } from '@/lib/checkout'
import { trackAddPaymentInfo } from '@/components/lp/checkout_tracker'
import { SubmitButton } from '@testify/style-guide/components/ActionButton'
import { BrandIcon } from '@testify/style-guide/components/BrandIcon'
import { Notice } from '@testify/style-guide/components/Notice'
import { TextField } from '@testify/style-guide/components/TextField'
import { PaymentElementSlot } from './payment_element_slot'
import { paymentErrorCopy, type PaymentErrorCopy } from './payment_errors'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Paper "checkout, inline errors" field copy. Payment copy lives in payment_errors.ts. */
const COPY = {
  emailEmpty: 'Enter your email so we can send your receipt and portal link.',
  emailInvalid: "That email doesn't look right. Check for a typo.",
  firstNameEmpty: 'Enter your first name.',
  lastNameEmpty: 'Enter your last name.',
  businessEmpty: 'Enter your business name so we can start your posts.',
} as const

type Field = 'email' | 'firstName' | 'lastName' | 'businessName'
type Errors = Partial<Record<Field, string>>

/** Fields in form order. The first invalid one takes focus on a failed submit. */
const FIELD_ORDER: readonly Field[] = ['email', 'firstName', 'lastName', 'businessName']
const FIELD_SUFFIX: Record<Field, string> = {
  email: 'email',
  firstName: 'first-name',
  lastName: 'last-name',
  businessName: 'business',
}

export function validateCheckoutContact(input: Record<Field, string>): Errors {
  const errors: Errors = {}
  const email = input.email.trim()
  if (!email) errors.email = COPY.emailEmpty
  else if (email.length > CHECKOUT_LIMITS.email || !EMAIL_RE.test(email)) {
    errors.email = COPY.emailInvalid
  }
  if (!input.firstName.trim()) errors.firstName = COPY.firstNameEmpty
  if (!input.lastName.trim()) errors.lastName = COPY.lastNameEmpty
  if (!input.businessName.trim()) errors.businessName = COPY.businessEmpty
  return errors
}

export function CheckoutForm({
  idPrefix,
  slug,
  successPath,
  amountLabel,
  priceLabel,
  guaranteeTitle,
  guaranteeBody,
  value,
  currency,
}: {
  idPrefix: string
  slug: string
  successPath: string
  /** Charge amount in words, for example "$99". */
  amountLabel: string
  /** Button label price, for example "$99/month". */
  priceLabel: string
  guaranteeTitle: string
  guaranteeBody: string
  /** Offer price in whole units, for the add_payment_info event (fired from the Payment Element hook). */
  value: number
  currency: string
}) {
  const [values, setValues] = useState<Record<Field, string>>({
    email: '',
    firstName: '',
    lastName: '',
    businessName: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [paymentError, setPaymentError] = useState<PaymentErrorCopy | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const headingId = `${idPrefix}-form-heading`
  const paymentHeadingId = `${idPrefix}-payment-heading`

  function update(field: Field, next: string) {
    setValues((prev) => ({ ...prev, [field]: next }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  /** Payment Element hook: wired to the element's change handler once it mounts (see payment_element_slot.tsx). */
  function onPaymentDetailsEntered() {
    trackAddPaymentInfo(slug, value, currency)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validateCheckoutContact(values)
    setErrors(found)
    setPaymentError(null)
    const firstInvalid = FIELD_ORDER.find((field) => found[field])
    if (firstInvalid) {
      document.getElementById(`${idPrefix}-${FIELD_SUFFIX[firstInvalid]}`)?.focus()
      return
    }

    const contact: CheckoutContact = {
      email: values.email.trim(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      businessName: values.businessName.trim(),
    }
    setSubmitting(true)
    const result = await startCheckout(slug, contact)
    if (!result.ok) {
      setPaymentError(paymentErrorCopy(result.error))
      setSubmitting(false)
      return
    }
    if (result.mode === 'hosted_page') {
      window.location.assign(result.url)
      return
    }
    setClientSecret(result.clientSecret)
    setSubmitting(false)
  }

  return (
    <section
      id={`${idPrefix}-form`}
      aria-labelledby={headingId}
      data-lp-slug={slug}
      data-checkout-api="/api/checkout"
      data-success-path={successPath}
      className="flex flex-col gap-6 rounded-card bg-brand-surface p-6 shadow-lifted md:p-10"
    >
      <h2 id={headingId} className="sr-only">
        Your details and payment
      </h2>

      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
        <TextField
          id={`${idPrefix}-email`}
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@business.com"
          value={values.email}
          onChange={(event) => update('email', event.target.value)}
          {...(errors.email !== undefined ? { error: errors.email } : {})}
          {...(errors.email ? {} : { helperText: 'We send your receipt and portal link here.' })}
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            id={`${idPrefix}-first-name`}
            label="First name"
            name="firstName"
            autoComplete="given-name"
            placeholder="e.g. Maria"
            value={values.firstName}
            onChange={(event) => update('firstName', event.target.value)}
            {...(errors.firstName !== undefined ? { error: errors.firstName } : {})}
            maxLength={CHECKOUT_LIMITS.firstName}
            required
          />
          <TextField
            id={`${idPrefix}-last-name`}
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            placeholder="e.g. Lopez"
            value={values.lastName}
            onChange={(event) => update('lastName', event.target.value)}
            {...(errors.lastName !== undefined ? { error: errors.lastName } : {})}
            maxLength={CHECKOUT_LIMITS.lastName}
            required
          />
        </div>
        <TextField
          id={`${idPrefix}-business`}
          label="Business name"
          name="businessName"
          autoComplete="organization"
          placeholder="e.g. Mesa Plumbing"
          value={values.businessName}
          onChange={(event) => update('businessName', event.target.value)}
          {...(errors.businessName !== undefined ? { error: errors.businessName } : {})}
          {...(errors.businessName ? {} : { helperText: 'So we can start making your posts.' })}
          maxLength={CHECKOUT_LIMITS.businessName}
          required
        />

        <PaymentElementSlot
          idPrefix={idPrefix}
          clientSecret={clientSecret}
          headingId={paymentHeadingId}
          onPaymentDetailsEntered={onPaymentDetailsEntered}
        />

        <p className="font-text text-brand-body text-brand-ink">
          You post it yourself. We make your posts and stories and put them in your portal, ready to
          post. We never need your passwords.
        </p>

        <p className="font-text text-brand-small text-brand-ink-muted">
          {`You'll be charged ${amountLabel} today, then ${amountLabel} every month on the [DAY OF MONTH] until you cancel. Cancel any time in your portal in 2 clicks. By clicking "Start my plan for ${priceLabel}", you agree to the Terms and authorize these charges.`}
        </p>

        {/* Always mounted so screen readers announce the message when it appears. */}
        <div role="alert">
          {paymentError ? (
            <Notice
              tone="error"
              {...(paymentError.title ? { title: paymentError.title } : {})}
              description={paymentError.body}
            />
          ) : null}
        </div>

        <SubmitButton
          tone="action"
          fullWidth
          loading={submitting}
          loadingLabel="Setting up your plan..."
          disabled={clientSecret !== null}
          {...(clientSecret !== null ? { disabledReason: 'Payment fields are open above.' } : {})}
        >
          {`Start my plan for ${priceLabel}`}
        </SubmitButton>
      </form>

      <div className="flex flex-col gap-2 border-t border-brand-border pt-6">
        <div className="flex items-center gap-2 text-brand-ink">
          <BrandIcon name="Check" size="sm" />
          <h3 className="font-display text-brand-h4 text-brand-ink">{guaranteeTitle}</h3>
        </div>
        <p className="font-text text-brand-body text-brand-ink-muted">{guaranteeBody}</p>
      </div>

      <p className="font-text text-brand-small text-brand-ink-subtle">
        Questions? [NAME] replies within [N] hours: hello@[DOMAIN]
      </p>
    </section>
  )
}
