import type { ReactNode } from 'react'
import type { RouteKey } from '@/lib/site.config'
import { pageTrackingAttrs } from '@/lib/tracking'

/**
 * Page SKELETON primitives. Server-safe on purpose (no DS import, no
 * 'use client'): they draw no UI, only the landmarks and empty, labelled
 * section slots that real DS compositions will fill later.
 */

export interface SlotSpec {
  /** Stable slot id, also the `data-slot` value. */
  slot: string
  /** Accessible placeholder name for the empty region. */
  label: string
}

/** One empty, labelled section slot. Its id is `<routeKey>-<slot>`. */
export function SectionSlot({
  routeKey,
  slot,
  label,
  ...rest
}: SlotSpec & { routeKey: RouteKey } & Record<`data-${string}`, string | undefined>) {
  return (
    <section
      id={`${routeKey}-${slot}`}
      data-slot={slot}
      aria-label={`${label} (placeholder)`}
      {...rest}
    />
  )
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
