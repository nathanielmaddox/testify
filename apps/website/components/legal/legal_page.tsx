// Legal page layout: title, effective and last-updated lines, in-page contents, then one section per outline entry.
// Server-safe: the contents render through the client LegalToc module, so this file never imports the design system.
import { LegalToc } from '@/components/legal/legal_toc'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import type { LegalSection } from '@/lib/legal'
import { getRoute } from '@/lib/site.config'
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'

export interface LegalPageProps {
  routeKey: 'privacy' | 'terms'
  /** Effective date line, shown as given (a [CONFIRM] placeholder until counsel signs off). */
  effectiveDate: string
  sections: readonly LegalSection[]
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

/** Formats a static ISO date (YYYY-MM-DD) as "October 9, 2026" without locale or time zone effects. */
function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return `${MONTHS[(month ?? 1) - 1]} ${day}, ${year}`
}

export function LegalPage({ routeKey, effectiveDate, sections }: LegalPageProps) {
  const route = getRoute(routeKey)
  const updated = formatIsoDate(route.updated)

  return (
    <PageSkeleton routeKey={routeKey} slots={[]}>
      <PageSection as="div" width="prose" className="pt-16 md:pt-24">
        <DisplayHeading level={1} size="h1" id="legal-title">
          {route.title}
        </DisplayHeading>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 font-text text-brand-small text-brand-ink-subtle">
            <p>Effective date: {effectiveDate}</p>
            <p>Last updated: {updated}</p>
          </div>
          <LegalToc sections={sections} />
        </div>
      </PageSection>

      <PageSection as="div" flush width="prose" className="pb-brand-section">
        {sections.map((section) => {
          const headingId = `${section.id}-heading`
          return (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={headingId}
              className="flex scroll-mt-24 flex-col gap-4"
            >
              <DisplayHeading level={2} size="h3" id={headingId}>
                {section.heading}
              </DisplayHeading>
              {section.body.map((paragraph, index) => (
                <p
                  key={`${section.id}-${index}`}
                  className="font-text text-brand-body text-brand-ink"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          )
        })}
      </PageSection>
    </PageSkeleton>
  )
}
