import { LpFormSlot } from '@/components/lp/lp_form_slot'
import { PageSkeleton, SectionSlot } from '@/components/skeleton/page_skeleton'
import type { LpSectionId } from '@/lib/landing_pages'
import { lpTrackingAttrs } from '@/lib/tracking'
import type { LpLayout, LpLayoutProps } from './types'

/** Author-facing names of the sections this layout renders (never shown). */
const SECTION_LABELS = {
  hero: 'Hero',
  proof: 'Proof',
  process: 'Process',
  honesty: 'Honesty',
  guarantee: 'Guarantee',
  faq: 'FAQ',
  form: 'Form and checkout',
} as const satisfies Record<LpSectionId, string>

/**
 * The "template" layout: the original LP skeleton. A single column of empty
 * section slots in the order the registry entry lists them; `form` is the
 * form/checkout slot that hands off to this LP's confirmation page. Server
 * component (no DS import), so the page stays statically rendered.
 */
function TemplateLayout({ lp }: LpLayoutProps) {
  const idPrefix = `lp-${lp.slug}`
  return (
    <PageSkeleton tracking={lpTrackingAttrs(lp.slug, 'lp')} idPrefix={idPrefix} slots={[]}>
      {lp.sections.map((section) =>
        section === 'form' ? (
          <LpFormSlot key={section} slug={lp.slug} idPrefix={idPrefix} />
        ) : (
          <SectionSlot
            key={section}
            idPrefix={idPrefix}
            slot={section}
            label={SECTION_LABELS[section]}
          />
        )
      )}
    </PageSkeleton>
  )
}

export const templateLayout: LpLayout = {
  component: TemplateLayout,
  sections: ['hero', 'proof', 'process', 'honesty', 'guarantee', 'faq', 'form'],
}
