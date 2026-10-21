/**
 * Shared types for LP layouts. A layout draws one LP's <main> from its
 * registry entry (lib/landing_pages.ts). Server-safe: type-only imports.
 */
import type { ComponentType } from 'react'
import type { LandingPage, LpSectionId } from '@/lib/landing_pages'

/** Props every LP layout receives: its registry entry. */
export interface LpLayoutProps {
  lp: LandingPage
}

/**
 * A layout: the component that draws an LP's <main>, plus the section ids it
 * knows how to render. An LP may list only sections its layout supports.
 */
export interface LpLayout {
  component: ComponentType<LpLayoutProps>
  sections: readonly LpSectionId[]
}
