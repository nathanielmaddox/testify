/**
 * Analytics provider config. Each provider is OFF until its env var is set,
 * so turning one on is a config change (env var on Vercel), not a code
 * change. Ids are public by nature (they ship in the page), hence
 * NEXT_PUBLIC_. Dot access so Next inlines them into the client bundle.
 *
 * The CSP host list for these providers lives in next.config.js
 * (`thirdParties`).
 */

function clean(value: string | undefined): string | null {
  const trimmed = (value ?? '').trim()
  return trimmed ? trimmed : null
}

export const analyticsConfig = {
  /** GA4 measurement id, `G-XXXXXXXXXX`. */
  ga4Id: clean(process.env.NEXT_PUBLIC_GA4_ID),
  /** Google Ads tag id, `AW-XXXXXXXXX`. Loaded through the same gtag.js. */
  googleAdsId: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
  /** Google Ads conversion labels, per conversion action. */
  googleAdsLabels: {
    lead_submit: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL),
    purchase_complete: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL),
  },
  /**
   * Meta Pixel id (browser side). Server-side Conversions API is added later
   * and dedupes against the browser event through the shared `eventID`.
   */
  metaPixelId: clean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
} as const

/** gtag.js is needed when either Google product is on. */
export function gtagId(): string | null {
  return analyticsConfig.ga4Id ?? analyticsConfig.googleAdsId
}
