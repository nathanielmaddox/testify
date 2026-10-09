'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { WORK_TRADES, parseWorkTrade, type WorkTradeFilter } from '@/lib/work'

/**
 * The trade filter slot inside the /work hero. Skeleton only: no visible UI
 * yet, just the slot and `data-active-trade` (the parsed `?trade=` value, or
 * `all`) so the pills, the story grid and the samples rail can key off it
 * later. Reads the query string on the client so /work stays static; the
 * prerendered HTML carries `all` until hydration.
 */
function TradeFilterSlot({ trade }: { trade: WorkTradeFilter }) {
  return (
    <div
      id="work-hero-trade-filter"
      data-slot="trade-filter"
      data-active-trade={trade}
      data-trades={WORK_TRADES.join(' ')}
    />
  )
}

function TradeFilterFromQuery() {
  const trade = parseWorkTrade(useSearchParams().get('trade'))
  return <TradeFilterSlot trade={trade} />
}

export function WorkTradeFilter() {
  return (
    <Suspense fallback={<TradeFilterSlot trade="all" />}>
      <TradeFilterFromQuery />
    </Suspense>
  )
}
