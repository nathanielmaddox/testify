import type { MetadataRoute } from 'next'

/**
 * Disallow every crawler on every path. The admin is internal and is never
 * indexed. There is no sitemap, by design.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/' },
  }
}
