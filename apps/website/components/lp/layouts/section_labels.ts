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
} as const satisfies Record<LpSectionId, string>
