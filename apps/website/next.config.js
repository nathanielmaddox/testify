const path = require('path')

/** Monorepo root: two levels up from apps/website. */
const monorepoRoot = path.join(__dirname, '..', '..')

/**
 * Third parties the CSP allows. One entry per provider: adding a provider is
 * one entry. Keys map to directives: script -> script-src, beacon -> img-src
 * AND connect-src (pixels and fetch/sendBeacon), frame -> frame-src,
 * form -> form-action. The ids that switch each provider on are env vars
 * (lib/analytics.config.ts); listing hosts here is harmless while unset.
 */
const thirdParties = [
  {
    name: 'GA4',
    script: ['https://www.googletagmanager.com'],
    beacon: [
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://www.googletagmanager.com',
    ],
  },
  {
    name: 'Google Ads',
    script: ['https://www.googleadservices.com', 'https://googleads.g.doubleclick.net'],
    beacon: [
      'https://www.google.com',
      'https://google.com',
      'https://*.doubleclick.net',
      'https://pagead2.googlesyndication.com',
      'https://www.googleadservices.com',
    ],
    frame: ['https://td.doubleclick.net', 'https://www.googletagmanager.com'],
  },
  {
    name: 'Meta Pixel',
    script: ['https://connect.facebook.net'],
    beacon: ['https://www.facebook.com', 'https://connect.facebook.net'],
  },
  { name: 'Stripe Checkout', form: ['https://checkout.stripe.com'] },
  // Stripe.js + embedded Checkout / Payment Element on /lp/<slug>/checkout.
  {
    name: 'Stripe.js',
    script: ['https://js.stripe.com', 'https://*.js.stripe.com', 'https://checkout.stripe.com'],
    beacon: [
      'https://api.stripe.com',
      'https://checkout.stripe.com',
      'https://m.stripe.network',
      'https://q.stripe.com',
    ],
    frame: [
      'https://js.stripe.com',
      'https://*.js.stripe.com',
      'https://hooks.stripe.com',
      'https://checkout.stripe.com',
    ],
  },
]

/** Unique, space-joined host list for one key of `thirdParties`. */
function hosts(key) {
  const all = thirdParties.flatMap((party) => party[key] ?? [])
  return [...new Set(all)].join(' ')
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
  // Workspace packages ship source, so Next compiles them. Add each new
  // @testify/* runtime package here when an app starts importing it.
  transpilePackages: ['@testify/config', '@testify/style-guide'],
  experimental: {
    externalDir: true,
  },
  typescript: { ignoreBuildErrors: false },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development'
    const devConnect = isDev ? ' ws://localhost:* http://localhost:*' : ''
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} ${hosts('script')}`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: ${hosts('beacon')}`,
      "font-src 'self' data:",
      `connect-src 'self' ${hosts('beacon')}${devConnect}`,
      `frame-src 'self' ${hosts('frame')}`,
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      `form-action 'self' ${hosts('form')}`,
    ]
      .map((directive) => directive.trim())
      .join('; ')
    return [
      // A *.vercel.app host is never the canonical site: it mirrors a site whose
      // canonicals point at its own domain, so it must never be indexed. Real
      // domains do not match this host rule, so it is safe after DNS cutover.
      {
        source: '/(.*)',
        has: [{ type: 'host', value: '(?<h>.*\\.vercel\\.app)' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      // Every offer LP's purchase page is per visitor: never cache it anywhere.
      {
        source: '/lp/:slug/checkout',
        headers: [{ key: 'Cache-Control', value: 'private, no-store, max-age=0' }],
      },
      // Every LP's conversion page is per visitor: never cache it anywhere.
      {
        source: '/lp/:slug/confirmation',
        headers: [{ key: 'Cache-Control', value: 'private, no-store, max-age=0' }],
      },
      // The booked page shows one visitor's booking (kept in sessionStorage): never cache it.
      {
        source: '/get-started/booked',
        headers: [{ key: 'Cache-Control', value: 'private, no-store, max-age=0' }],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // One year, no includeSubDomains / preload until the domain is settled
          // (preload is near-permanent and binds every subdomain).
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          // Keeps window.opener for OAuth / payment popups, isolates everything else.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
}

module.exports = nextConfig
