import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site.config'

/**
 * Disallow everything until launch (`siteConfig.indexable`, set by
 * NEXT_PUBLIC_SITE_INDEXABLE=true). The next.config.js host rule separately
 * keeps every *.vercel.app preview out of the index. No `Host:` line: it is a
 * Yandex-only directive that Google ignores.
 */
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.indexable) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
