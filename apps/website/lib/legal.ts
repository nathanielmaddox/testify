// Legal page outlines (privacy policy, terms of service): section ids, headings and placeholder bodies.
// No legal copy is approved yet, so every body paragraph is a [CONFIRM] placeholder for counsel.

export interface LegalSection {
  /** Anchor id on the page, unique within one legal page. */
  id: string
  /** Plain section heading. */
  heading: string
  /** Body paragraphs, in order. */
  body: readonly string[]
}

/** Effective date placeholder until counsel confirms it. */
export const LEGAL_EFFECTIVE_DATE = '[CONFIRM]'

/** One placeholder paragraph, named after the section it stands in for. */
function confirm(topic: string): string {
  return `[CONFIRM: legal copy for ${topic}, reviewed by counsel]`
}

export const PRIVACY_SECTIONS: readonly LegalSection[] = [
  {
    id: 'what-we-collect',
    heading: 'What we collect',
    body: [confirm('what we collect')],
  },
  {
    id: 'how-we-use',
    heading: 'How we use it',
    body: [confirm('how we use it')],
  },
  {
    id: 'cookies-and-analytics',
    heading: 'Cookies and analytics',
    body: [confirm('cookies and analytics')],
  },
  {
    id: 'sharing',
    heading: 'Sharing',
    body: [confirm('sharing')],
  },
  {
    id: 'retention',
    heading: 'Retention',
    body: [confirm('retention')],
  },
  {
    id: 'your-choices',
    heading: 'Your choices',
    body: [confirm('your choices')],
  },
  {
    id: 'children',
    heading: 'Children',
    body: [confirm('children')],
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    body: [confirm('changes to this policy')],
  },
  {
    id: 'contact',
    heading: 'Contact us',
    body: [confirm('contact details')],
  },
]

export const TERMS_SECTIONS: readonly LegalSection[] = [
  {
    id: 'the-service',
    heading: 'The service',
    body: [confirm('the service')],
  },
  {
    id: 'accounts',
    heading: 'Accounts and eligibility',
    body: [confirm('accounts and eligibility')],
  },
  {
    id: 'payment-and-billing',
    heading: 'Payment and billing',
    body: [confirm('payment and billing (month to month, cancel any month)')],
  },
  {
    id: 'your-content',
    heading: 'Your content',
    body: [confirm('content ownership (the customer keeps their accounts and files)')],
  },
  {
    id: 'acceptable-use',
    heading: 'Acceptable use',
    body: [confirm('acceptable use')],
  },
  {
    id: 'no-guarantee',
    heading: 'No guarantee of views or results',
    body: [confirm('no view or results guarantee')],
  },
  {
    id: 'limitation-of-liability',
    heading: 'Limitation of liability',
    body: [confirm('limitation of liability')],
  },
  {
    id: 'termination',
    heading: 'Termination',
    body: [confirm('termination')],
  },
  {
    id: 'governing-law',
    heading: 'Governing law',
    body: [confirm('governing law'), '[CONFIRM: state]'],
  },
  {
    id: 'changes',
    heading: 'Changes to these terms',
    body: [confirm('changes to these terms')],
  },
  {
    id: 'contact',
    heading: 'Contact us',
    body: [confirm('contact details')],
  },
]
