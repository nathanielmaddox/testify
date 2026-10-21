/**
 * Chrome for the get-started flow (route group (flow)): focused header, the
 * flow's page, and a legal-only footer. Owned by the get-started flow.
 */

import type { ReactNode } from 'react'
import { FlowFooter } from '@/components/get_started/flow_footer'
import { FlowHeader } from '@/components/get_started/flow_header'

/**
 * Chrome for the get-started flow: the wordmark with a way back to the site,
 * and a legal-only footer. No nav links, so the flow keeps its one job.
 */
export default function FlowLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <FlowHeader />
      {children}
      <FlowFooter />
    </div>
  )
}
