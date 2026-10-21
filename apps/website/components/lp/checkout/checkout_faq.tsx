'use client'

// Two collapsed questions under the order summary (Paper "Do I post it myself?" and "Can I cancel?",
// JOX-0). DS Accordion does the disclosure. Paper shows the questions only, with no answer copy, so
// each answer is a placeholder until the owner supplies it. Do not write answers here.
import { Accordion, type AccordionItem } from '@otesse/design-system'

const ANSWER_PLACEHOLDER = '[ANSWER: owner to supply]'

const ITEMS: AccordionItem[] = [
  {
    id: 'post-it-myself',
    title: 'Do I post it myself?',
    content: ANSWER_PLACEHOLDER,
  },
  {
    id: 'can-i-cancel',
    title: 'Can I cancel?',
    content: ANSWER_PLACEHOLDER,
  },
]

export function CheckoutFaq({ idPrefix }: { idPrefix: string }) {
  return (
    <div id={`${idPrefix}-faq`}>
      <Accordion items={ITEMS} mode="multiple" headingLevel={3} />
    </div>
  )
}
