const path = require('path')

/** Monorepo root: two levels up from apps/admin. */
const monorepoRoot = path.join(__dirname, '..', '..')

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
    // The admin app has no third parties, so every directive is 'self' only.
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      `connect-src 'self'${devConnect}`,
      "frame-src 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ]
      .map((directive) => directive.trim())
      .join('; ')
    return [
      // A *.vercel.app host is never the canonical site: it mirrors a site whose
      // canonicals point at its own domain, so it must never be indexed. Real
      // domains do not match this host rule, so it is safe after DNS cutover.
      {
        source: '/(.*)',
        has: [{ type: 'host', value: '(?<h>.*\.vercel\.app)' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      // The admin app is never indexed, on any host.
      {
        source: '/(.*)',
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
