import type { ReactNode } from 'react'
import { LpFooter } from '@/components/site/lp_footer'
import { LpHeader } from '@/components/site/lp_header'

/**
 * Paid-funnel chrome: name-only header and a legal-only footer, so a paid
 * visitor has no nav links leading away from the offer.
 */
export default function LpLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LpHeader />
      {children}
      <LpFooter />
    </>
  )
}
