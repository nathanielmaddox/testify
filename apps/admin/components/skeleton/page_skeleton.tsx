import type { ReactNode } from 'react'
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { PageSection } from '@testify/style-guide/components/PageSection'

/**
 * Page SKELETON for @testify/admin. Server-safe on purpose (no DS import, no
 * 'use client'): it draws the page title and a content slot, nothing more.
 *
 * The DS DashboardLayout already renders the one <main> landmark, so this
 * wrapper is a <div> carrying the skip-link target (`#main-content`). Two
 * <main> elements on one page would be invalid HTML.
 */
export function PageSkeleton({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <div id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
      <PageSection width="content">
        <DisplayHeading level={1} size="h1" lead={description}>
          {title}
        </DisplayHeading>
        {children}
      </PageSection>
    </div>
  )
}
