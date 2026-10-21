'use client'

// FAQ list on the DS Accordion (card variant), collapsed on load.

import { Accordion, type AccordionItem } from '@otesse/design-system'

/**
 * FAQ list: the DS Accordion in its card variant (one hairline card per
 * question, flat, radius and gap from the DS). Items are collapsed on load.
 * Client module because the DS Accordion is interactive.
 */
export function FaqList({
  items,
  ariaLabel,
}: {
  items: readonly { question: string; answer: string }[]
  ariaLabel?: string
}) {
  const accordionItems: AccordionItem[] = items.map((item, index) => ({
    id: `faq-${index}`,
    title: item.question,
    content: item.answer,
  }))

  return (
    <Accordion
      items={accordionItems}
      variant="card"
      headingLevel={3}
      ariaLabel={ariaLabel ?? 'Frequently asked questions'}
    />
  )
}
