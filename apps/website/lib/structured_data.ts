import { DEFAULT_LP_SLUG, lpPath } from './landing_pages'
import { siteConfig } from './site.config'

/**
 * JSON-LD builders, all from `siteConfig`. Server-safe. Entities link by `@id`
 * (`<origin>/#organization`, `<origin>/#website`, `<origin>/#service`) so the
 * layout's Organization/WebSite and a page's Service resolve to one graph.
 *
 * Render with `<script {...jsonLdScriptProps(data)} />` in a server component.
 */

type JsonLd = Record<string, unknown>

const ids = {
  organization: `${siteConfig.url}/#organization`,
  website: `${siteConfig.url}/#website`,
  service: `${siteConfig.url}/#service`,
}

function absolute(path: string): string {
  return /^https?:\/\//i.test(path) ? path : `${siteConfig.url}${path === '/' ? '' : path}`
}

export function organizationJsonLd(): JsonLd {
  const { organization } = siteConfig
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ids.organization,
    name: siteConfig.name,
    legalName: organization.legalName,
    url: siteConfig.url,
    logo: absolute(organization.logo),
    ...(organization.sameAs.length > 0 ? { sameAs: organization.sameAs } : {}),
  }
}

export function websiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': ids.website,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: 'en',
    publisher: { '@id': ids.organization },
  }
}

/**
 * The one offer as Service + Offer. Price and currency come from
 * `siteConfig.offer`. `lpHref` is the landing page the offer points at: the
 * LP being rendered, or the default LP (lib/landing_pages.ts) on site pages.
 */
export function serviceJsonLd(lpHref: string = lpPath(DEFAULT_LP_SLUG)): JsonLd {
  const { offer } = siteConfig
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': ids.service,
    name: offer.name,
    description: offer.description,
    provider: { '@id': ids.organization },
    url: absolute(lpHref),
    offers: {
      '@type': 'Offer',
      price: offer.price.toFixed(2),
      priceCurrency: offer.currency,
      availability: 'https://schema.org/InStock',
      url: absolute(lpHref),
    },
  }
}

/**
 * Props for a JSON-LD <script>. `<` is escaped so a value containing
 * `</script>` can never break out of the tag.
 */
export function jsonLdScriptProps(data: JsonLd | JsonLd[]) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, '\\u003c') },
  }
}
