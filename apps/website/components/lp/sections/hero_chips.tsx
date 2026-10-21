'use client'

/**
 * Fact chips under the hero headline: the DS Badge (outlined, full radius), as
 * Home's engine draws its status pills. Client module (DS import).
 */
import { Badge } from '@otesse/design-system'

export function HeroChips({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap justify-center gap-3">
      {items.map((item) => (
        <li key={item}>
          <Badge
            variant="default"
            appearance="outlined"
            size="md"
            radius="full"
            fontWeight="medium"
          >
            {item}
          </Badge>
        </li>
      ))}
    </ul>
  )
}
