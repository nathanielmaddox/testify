import type { ReactNode } from 'react'
import type { RouteKey } from '@/lib/site.config'
import { pageTrackingAttrs } from '@/lib/tracking'

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

/** One empty section slot. Its id is `<routeKey>-<slot>` (stable, e.g. `home-hero`). */
export function SectionSlot({
  routeKey,
  slot,
  label: _label,
  ...rest
}: SlotSpec & { routeKey: RouteKey } & Record<`data-${string}`, string | undefined>) {
  return <section id={`${routeKey}-${slot}`} data-slot={slot} {...rest} />
}

/**
 * A page's <main>: the skip-link target (`#main-content`) carrying the page
 * tracking attributes, then one empty slot per section in order. `children`
 * render after the listed slots (for slots that need client behaviour).
 */
export function PageSkeleton({
  routeKey,
  slots,
  children,
}: {
  routeKey: RouteKey
  slots: readonly SlotSpec[]
  children?: ReactNode
}) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 focus:outline-none"
      {...pageTrackingAttrs(routeKey)}
    >
      {slots.map((spec) => (
        <SectionSlot key={spec.slot} routeKey={routeKey} {...spec} />
      ))}
      {children}
    </main>
  )
}
