// Display labels for the work trades (filter pills, story kickers) and the trade label a story shows. Server- and client-safe.
import type { WorkStory, WorkTrade } from '@/lib/work'

export const WORK_TRADE_LABELS: Record<WorkTrade, string> = {
  'trades-home-services': 'Trades & home services',
  'clinics-med-spas': 'Clinics & med spas',
  'salons-beauty': 'Salons & beauty',
  'local-pros': 'Local pros',
}

/** The trade label a story shows: its own placeholder label when set (e.g. "[TRADE]"), else the trade's label. */
export function workTradeLabel(story: Pick<WorkStory, 'trade' | 'tradeLabel'>): string {
  return story.tradeLabel ?? WORK_TRADE_LABELS[story.trade]
}
