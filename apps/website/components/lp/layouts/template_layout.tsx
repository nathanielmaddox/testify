/**
 * The "template" layout (registry layout key `template`, Paper frame
 * `lp/sample-ad`): hero, proof, process, honesty, guarantee, FAQ, then the
 * form/checkout slot. Each section is its own server component in
 * components/lp/sections/template_*.tsx; `form` stays the LpFormSlot that hands
 * off to this LP's confirmation page. No DS import here, so the page stays
 * statically rendered.
 */
import type { ComponentType } from 'react'
import { LpFormSlot } from '@/components/lp/lp_form_slot'
import { TemplateFaq } from '@/components/lp/sections/template_faq'
import { TemplateGuarantee } from '@/components/lp/sections/template_guarantee'
import { TemplateHero } from '@/components/lp/sections/template_hero'
import { TemplateHonesty } from '@/components/lp/sections/template_honesty'
import { TemplateProcess } from '@/components/lp/sections/template_process'
import { TemplateProof } from '@/components/lp/sections/template_proof'
import type { LpSectionProps } from '@/components/lp/sections/section_props'
import { PageSkeleton } from '@/components/skeleton/page_skeleton'
import type { LpSectionId } from '@/lib/landing_pages'
import { lpTrackingAttrs } from '@/lib/tracking'
import type { LpLayout, LpLayoutProps } from './types'

/** Sections rendered by this layout's own components (the form slot is separate). */
const TEMPLATE_SECTIONS = {
  hero: TemplateHero,
  proof: TemplateProof,
  process: TemplateProcess,
  honesty: TemplateHonesty,
  guarantee: TemplateGuarantee,
  faq: TemplateFaq,
} as const satisfies Partial<Record<LpSectionId, ComponentType<LpSectionProps>>>

type TemplateSectionId = keyof typeof TEMPLATE_SECTIONS

function isTemplateSection(id: LpSectionId): id is TemplateSectionId {
  return id in TEMPLATE_SECTIONS
}

function TemplateLayout({ lp }: LpLayoutProps) {
  const idPrefix = `lp-${lp.slug}`
  return (
    <PageSkeleton tracking={lpTrackingAttrs(lp.slug, 'lp')} idPrefix={idPrefix} slots={[]}>
      <div className="flex flex-col gap-brand-section-gap pb-brand-section-gap pt-12">
        {lp.sections.map((section) => {
          if (section === 'form') {
            return <LpFormSlot key={section} slug={lp.slug} idPrefix={idPrefix} />
          }
          if (!isTemplateSection(section)) {
            throw new Error(`Template layout has no component for section "${section}".`)
          }
          const Section = TEMPLATE_SECTIONS[section]
          return <Section key={section} lp={lp} />
        })}
      </div>
    </PageSkeleton>
  )
}

export const templateLayout: LpLayout = {
  component: TemplateLayout,
  sections: ['hero', 'proof', 'process', 'honesty', 'guarantee', 'faq', 'form'],
}
