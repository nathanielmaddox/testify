/**
 * Offer LP layout for cold traffic (Paper frame `lp/done-for-you-99`), in the
 * Paper frame order: hook, trust row, opening letter, story, problem, what good
 * looks like, time cost, mechanism, sample week, honest limits, offer stack,
 * guarantee, team, objections and FAQ, next steps, final close, postscript.
 * Renders through OfferLayout, which owns the sticky buy bar.
 */
import { OfferLayout } from './offer_layout'
import type { LpLayout } from './types'

export const offer99ColdLayout: LpLayout = {
  component: OfferLayout,
  sections: [
    'hero',
    'proof',
    'letter',
    'story',
    'problem',
    'seen',
    'time',
    'mechanism',
    'sample',
    'straight',
    'offer-stack',
    'guarantee',
    'team',
    'objections-faq',
    'next',
    'final-cta',
    'ps',
  ],
}
