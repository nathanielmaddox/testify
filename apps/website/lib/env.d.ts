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
    /** Contact page booking embed: full https booking page URL. Unset = calendar placeholder. */
    readonly NEXT_PUBLIC_BOOKING_EMBED_URL?: string
    /** Stripe publishable key (pk_test_ / pk_live_) for the embedded checkout. Public. */
    readonly NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string
    /** SERVER ONLY. Stripe secret key (sk_ / rk_). Unset = /api/checkout answers 503. */
    readonly STRIPE_SECRET_KEY?: string
    /** SERVER ONLY. Recurring Stripe Price id (price_...) of the $99/month offer (`done-for-you-99`). */
    readonly STRIPE_PRICE_DONE_FOR_YOU_99?: string
    /** SERVER ONLY. Stripe webhook signing secret (whsec_...). Read by the webhook handler, not written yet. */
    readonly STRIPE_WEBHOOK_SECRET?: string

    /* Integration switches (lib/integrations/index.ts). Unset = `none`, which makes no outside call. */
    /** SERVER ONLY. Payments provider: `stripe` or `none`. */
    readonly PAYMENTS_PROVIDER?: string
    /** SERVER ONLY. Email provider: `postmark`, `resend` or `none`. */
    readonly EMAIL_PROVIDER?: string
    /** SERVER ONLY. Booking provider: `calcom`, `calendly`, `convex` or `none`. */
    readonly BOOKING_PROVIDER?: string
    /** SERVER ONLY. Data store provider: `convex` or `none`. */
    readonly DATA_PROVIDER?: string
    /** SERVER ONLY. Upload provider: `convex`, `uploadthing`, `s3` or `none`. */
    readonly UPLOAD_PROVIDER?: string

    /* Email. */
    /** SERVER ONLY. Verified sender for every transactional email, for example "Testify <hello@example.com>". */
    readonly EMAIL_FROM?: string
    /** SERVER ONLY. Owner address that receives lead notifications. */
    readonly EMAIL_NOTIFY_TO?: string
    /** SERVER ONLY. Postmark server API token (one Postmark server). */
    readonly POSTMARK_SERVER_TOKEN?: string
    /** SERVER ONLY. Resend API key (re_...), the alternative to Postmark. */
    readonly RESEND_API_KEY?: string

    /* Bookings. */
    /** SERVER ONLY. Cal.com API key (cal_...). */
    readonly CALCOM_API_KEY?: string
    /** SERVER ONLY. Numeric Cal.com event type id for the discovery call. */
    readonly CALCOM_EVENT_TYPE_ID?: string

    /* Data store and Convex. */
    /** Convex deployment URL (https://<name>.convex.cloud). Server reads it; not a secret. */
    readonly CONVEX_URL?: string
    /** Convex HTTP actions URL (https://<name>.convex.site). Server only. */
    readonly CONVEX_SITE_URL?: string

    /* Uploads. */
    /** SERVER ONLY. UploadThing token. */
    readonly UPLOADTHING_TOKEN?: string
    /** SERVER ONLY. AWS region for the S3 bucket, for example "us-west-2". */
    readonly AWS_REGION?: string
    /** SERVER ONLY. IAM access key id, limited to one bucket prefix. */
    readonly AWS_ACCESS_KEY_ID?: string
    /** SERVER ONLY. IAM secret access key. */
    readonly AWS_SECRET_ACCESS_KEY?: string
    /** SERVER ONLY. Private S3 bucket name for job photos. */
    readonly S3_BUCKET?: string
  }
}
