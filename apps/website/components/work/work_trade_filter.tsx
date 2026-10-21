'use client'

// Trade filter pills in the /work hero. Each pill is a DS Link to `?trade=<value>`; the slot carries `data-active-trade` for the story grid. Reads the query on the client so /work stays static (the prerendered HTML says `all`).
import { Link } from '@otesse/design-system'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { WORK_TRADE_LABELS } from '@/components/work/work_labels'
import { routes } from '@/lib/site.config'
import { WORK_TRADES, parseWorkTrade, type WorkTradeFilter } from '@/lib/work'

const PILLS: readonly { value: WorkTradeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...WORK_TRADES.map((trade) => ({ value: trade, label: WORK_TRADE_LABELS[trade] })),
]

function pillHref(value: WorkTradeFilter): string {
  return value === 'all' ? routes.work.path : `${routes.work.path}?trade=${value}`
}

function TradeFilterSlot({ trade }: { trade: WorkTradeFilter }) {
  return (
    <div
      id="work-hero-trade-filter"
      data-slot="trade-filter"
      role="group"
      aria-label="Filter stories by trade"
      data-active-trade={trade}
      data-trades={WORK_TRADES.join(' ')}
      className="flex flex-wrap gap-2"
    >
      {PILLS.map((pill) => {
        const active = pill.value === trade
        return (
          <Link
            key={pill.value}
            href={pillHref(pill.value)}
            variant="button"
            size="medium"
            color={active ? 'primary' : 'outline'}
            active={active}
            aria-current={active ? 'true' : undefined}
            linkComponent={NextLink}
          >
            {pill.label}
          </Link>
        )
      })}
    </div>
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
