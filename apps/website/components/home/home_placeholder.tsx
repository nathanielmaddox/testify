'use client'

import { Card, Hero, Layout } from '@otesse/design-system'
import { siteConfig } from '@/lib/site.config'

/**
 * Home page PLACEHOLDER. Composed only from DS components (Hero, Layout,
 * Card); replace the copy and sections when the real page is designed.
 */
const PLACEHOLDER_SECTIONS = [
  { title: 'Section one', description: 'Placeholder copy. Replace when the page is designed.' },
  { title: 'Section two', description: 'Placeholder copy. Replace when the page is designed.' },
  { title: 'Section three', description: 'Placeholder copy. Replace when the page is designed.' },
]

export function HomePlaceholder() {
  return (
    <>
      <Hero
        title={siteConfig.name}
        subtitle={siteConfig.description}
        primaryCTA={{ text: siteConfig.cta.label, href: siteConfig.cta.href, variant: 'primary' }}
      />
      <Layout variant="container" maxWidth="xl" className="py-16">
        <Layout variant="grid" columns={3} gap="md">
          {PLACEHOLDER_SECTIONS.map((section) => (
            <Card
              key={section.title}
              variant="default"
              padding="lg"
              title={section.title}
              description={section.description}
            />
          ))}
        </Layout>
      </Layout>
    </>
  )
}
