'use client'

/**
 * Trade tags above the sample week (Paper "Plumbing / Electrical / Cleaning /
 * Salon / Med spa"). Display only: the sample LP shows one example week, so
 * the tags are DS Tags that do not respond to clicks. Client module (DS).
 */
import { Tag } from '@otesse/design-system'

const TRADES = ['Plumbing', 'Electrical', 'Cleaning', 'Salon', 'Med spa'] as const

export function TradeTags() {
  return (
    <ul aria-label="Example trades" className="flex flex-wrap gap-2">
      {TRADES.map((trade, index) => (
        <li key={trade}>
          <Tag variant={index === 0 ? 'filled' : 'outlined'} color="default" size="md">
            {trade}
          </Tag>
        </li>
      ))}
    </ul>
  )
}
