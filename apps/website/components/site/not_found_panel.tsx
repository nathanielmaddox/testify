'use client'

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
 * and a quiet (ink pill) CtaRow back home. No icon. The stack is centred
 * (README principle 5 bend: a block carrying only headline, lead and CtaRow may
 * centre), so headline, lead and pill share one axis in the content container.
 */
export function NotFoundPanel() {
  return (
    <PageSection width="content" data-placeholder="">
      <div className="flex flex-col items-center gap-8 text-center">
        <DisplayHeading level={1} size="h1" lead={NOT_FOUND_COPY.lead} className="items-center">
          {NOT_FOUND_COPY.headline}
        </DisplayHeading>
        <CtaRow href="/" label={NOT_FOUND_COPY.cta} tone="quiet" />
      </div>
    </PageSection>
  )
}
