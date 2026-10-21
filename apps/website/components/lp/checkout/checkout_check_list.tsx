'use client'

// Check list for the checkout story (Paper "What you get" and "You're covered" rows): one brand
// Check icon per line, in the current text color. Client module because BrandIcon is a DS Icon.
import { BrandIcon } from '@testify/style-guide/components/BrandIcon'

export function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 font-text text-brand-body text-brand-ink">
          <span className="mt-1 shrink-0 text-brand-ink">
            <BrandIcon name="Check" size="sm" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
