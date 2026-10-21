'use client'

// FAQ list on the DS Accordion (card variant), collapsed on load unless told otherwise.

import { Accordion, type AccordionItem } from '@otesse/design-system'

/**
 * FAQ list: the DS Accordion in its card variant (one hairline card per
 * question, flat, radius and gap from the DS). Items are collapsed on load.
 * `defaultOpenCount` opens the first N items on load (default 0). Opening
 * more than one item at a time needs the accordion's multiple mode, so that
 * switches on only when N is above 0. Client module because the DS Accordion
 * is interactive.
 */
export function FaqList({
  items,
  ariaLabel,
  defaultOpenCount = 0,
}: {
  items: readonly { question: string; answer: string }[]
  ariaLabel?: string
  defaultOpenCount?: number
}) {
  const accordionItems: AccordionItem[] = items.map((item, index) => ({
    id: `faq-${index}`,
    title: item.question,
    content: item.answer,
  }))
  const openOnLoad =
    defaultOpenCount > 0
      ? {
          mode: 'multiple' as const,
          defaultOpen: accordionItems.slice(0, defaultOpenCount).map((item) => item.id),
        }
      : {}

  return (
    <Accordion
      items={accordionItems}
      {...openOnLoad}
      variant="card"
      headingLevel={3}
      ariaLabel={ariaLabel ?? 'Frequently asked questions'}
    />
  )
}
