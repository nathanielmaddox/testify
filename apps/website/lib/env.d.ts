/**
 * Typed env vars (public NEXT_PUBLIC_* plus the server-only Stripe secrets). Declared here so code can use DOT access
 * (`process.env.NEXT_PUBLIC_X`), which is the form Next inlines into client
 * bundles. Every name here is documented in `.env.example`.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    /** Canonical origin, no trailing slash. Required when indexable. */
    readonly NEXT_PUBLIC_SITE_URL?: string
    /** Launch flag: 'true' allows indexing. */
    readonly NEXT_PUBLIC_SITE_INDEXABLE?: string
    /** 'true' renders draft / unconsented work stories in a build (never with indexable). */
    readonly NEXT_PUBLIC_WORK_PREVIEW?: string
    /** GA4 measurement id (G-XXXXXXXXXX). Unset = GA4 off. */
    readonly NEXT_PUBLIC_GA4_ID?: string
    /** Google Ads tag id (AW-XXXXXXXXX). Unset = Google Ads off. */
    readonly NEXT_PUBLIC_GOOGLE_ADS_ID?: string
    /** Google Ads conversion label for lead_submit. */
    readonly NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL?: string
    /** Google Ads conversion label for purchase_complete. */
    readonly NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL?: string
    /** Meta Pixel id. Unset = Meta browser pixel off. */
    readonly NEXT_PUBLIC_META_PIXEL_ID?: string
    /** Stripe publishable key (pk_test_ / pk_live_) for the embedded checkout. Public. */
    readonly NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string
    /** SERVER ONLY. Stripe secret key (sk_ / rk_). Unset = /api/checkout answers 503. */
    readonly STRIPE_SECRET_KEY?: string
    /** SERVER ONLY. Recurring Stripe Price id (price_...) of the $99/month offer (`done-for-you-99`). */
    readonly STRIPE_PRICE_DONE_FOR_YOU_99?: string
  }
}
