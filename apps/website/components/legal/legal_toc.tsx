'use client'

// On this page: DS links to each legal section's anchor. Client module because the DS Link is interactive.

import NextLink from 'next/link'
import { Link } from '@otesse/design-system'
import type { LegalSection } from '@/lib/legal'

/** In-page contents for a legal page: one DS Link per section, anchored to its id. */
export function LegalToc({ sections }: { sections: readonly LegalSection[] }) {
  return (
    <nav aria-label="On this page">
      <ul className="flex flex-col gap-2 font-text text-brand-body">
        {sections.map((section) => (
          <li key={section.id}>
            <Link
              href={`#${section.id}`}
              linkComponent={NextLink}
              color="primary"
              underline="always"
              size="medium"
            >
              {section.heading}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
