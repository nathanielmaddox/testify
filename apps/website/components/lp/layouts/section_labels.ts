/**
 * Author-facing names of every LP section slot, for the people writing LP
 * copy and layouts. Never rendered: section components use slotProps and
 * SectionSlot ids, not these labels. `satisfies Record<LpSectionId, string>`
 * makes the build fail if a section id in lib/landing_pages.ts has no label.
 */
import type { LpSectionId } from '@/lib/landing_pages'

/** Author-facing names of every LP section slot (never rendered, see SectionSlot). */
export const LP_SECTION_LABELS = {
  hero: 'Hero',
  proof: 'Proof',
  process: 'Process',
  honesty: 'Honesty',
  guarantee: 'Guarantee',
  faq: 'FAQ',
  form: 'Form and checkout',
  problem: 'Problem and agitation',
  mechanism: 'Mechanism (how it works)',
  'offer-stack': 'Offer stack',
  objections: 'Objections',
  'objections-faq': 'Objections and FAQ',
  'final-cta': 'Final call to action',
  ps: 'Postscript',
  'first-month': 'First month (day by day)',
} as const satisfies Record<LpSectionId, string>
