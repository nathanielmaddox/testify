import type { ReactNode } from 'react'
import type { RouteKey } from '@/lib/site.config'
import { pageTrackingAttrs, type PageTrackingAttrs } from '@/lib/tracking'

/**
 * Page SKELETON primitives. Server-safe on purpose (no DS import, no
 * 'use client'): they draw no UI, only the landmarks and empty section slots
 * that real DS compositions will fill later.
 *
 * Slots carry NO accessible name: a plain <section> with an id and data-slot
 * is not a region landmark, so no placeholder name can reach a screen reader
 * or ship. When a slot gets real content with a heading, name it with
 * aria-labelledby pointing at that heading.
 */

export interface SlotSpec {
  /** Stable slot id, also the `data-slot` value. */
  slot: string
  /**
   * Human name of the slot, for authors only. Never rendered (no aria-label),
   * so it can never ship as a placeholder accessible name.
   */
  label?: string
}

/**
 * One section slot. Its id is `<idPrefix>-<slot>` (stable, e.g.
 * `home-hero`, or `lp-sample-ad-hero` on a landing page). Empty unless
 * `children` are given (nested sub-slots, such as the /work trade filter).
 */
export function SectionSlot({
  idPrefix,
  slot,
  label: _label,
  children,
  ...rest
}: SlotSpec & { idPrefix: string; children?: ReactNode } & Record<
    `data-${string}`,
    string | undefined
  >) {
  return (
    <section id={`${idPrefix}-${slot}`} data-slot={slot} {...rest}>
      {children}
    </section>
  )
}

/**
 * Who the page is, for tracking and slot ids: a site route by registry key,
 * or explicit attributes (landing pages, see `lpTrackingAttrs`) plus the
 * slot id prefix.
 */
export type PageIdentity =
  { routeKey: RouteKey } | { tracking: PageTrackingAttrs; idPrefix: string }

function resolveIdentity(identity: PageIdentity): {
  tracking: PageTrackingAttrs
  idPrefix: string
} {
  if ('routeKey' in identity) {
    return { tracking: pageTrackingAttrs(identity.routeKey), idPrefix: identity.routeKey }
  }
  return { tracking: identity.tracking, idPrefix: identity.idPrefix }
}

/**
 * A page's <main>: the skip-link target (`#main-content`) carrying the page
 * tracking attributes, then one empty slot per section in order. `children`
 * render after the listed slots (for slots that need client behaviour).
 */
export function PageSkeleton(
  props: PageIdentity & {
    slots: readonly SlotSpec[]
    children?: ReactNode
  }
) {
  const { slots, children } = props
  const { tracking, idPrefix } = resolveIdentity(props)
  return (
    <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none" {...tracking}>
      {slots.map((spec) => (
        <SectionSlot key={spec.slot} idPrefix={idPrefix} {...spec} />
      ))}
      {children}
    </main>
  )
}
