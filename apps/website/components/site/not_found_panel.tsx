'use client'

// 404 body: heading, one lead line and a link back to the home page.

import { CtaRow } from '@testify/style-guide/components/CtaRow'
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'

/**
 * 404 copy. PLACEHOLDER: every string here is placeholder wording until the
 * client supplies its own (README "Placeholders are marked"); the block renders
 * with `data-placeholder` so a pre-launch check can find it.
 */
const NOT_FOUND_COPY = {
  // PLACEHOLDER
  headline: 'That page is not here.',
  // PLACEHOLDER
  lead: 'The link may be out of date, so start again from the home page.',
  // PLACEHOLDER
  cta: 'Go to the home page',
} as const

/**
 * 404 body, per the 404 pattern: PageSection, a heading-lg H1, one lead line
 * and a quiet (ink pill) CtaRow back home. No icon. The stack is centered
 * (README principle 5 bend: a block carrying only headline, lead and CtaRow may
 * center), so headline, lead and pill share one axis in the content container.
 * `as="div"` keeps the page's landmarks unchanged: the 404 body is not a named region.
 */
export function NotFoundPanel() {
  return (
    <PageSection as="div" width="content" data-placeholder="">
      <div className="flex flex-col items-center gap-8 text-center">
        <DisplayHeading level={1} size="h1" lead={NOT_FOUND_COPY.lead} className="items-center">
          {NOT_FOUND_COPY.headline}
        </DisplayHeading>
        <CtaRow href="/" label={NOT_FOUND_COPY.cta} tone="quiet" />
      </div>
    </PageSection>
  )
}
