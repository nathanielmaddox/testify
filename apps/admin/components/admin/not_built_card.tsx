'use client'

import { Card } from '@otesse/design-system'

/**
 * Placeholder body for admin pages that are not built yet. States that in
 * plain words. Strings only, so a server page can pass it props directly.
 */
export function NotBuiltCard({ heading, text }: { heading: string; text: string }) {
  return <Card variant="bordered" padding="lg" radius="md" heading={heading} description={text} />
}
