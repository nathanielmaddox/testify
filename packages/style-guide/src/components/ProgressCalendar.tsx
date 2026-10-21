'use client'

import { useEffect, useRef, useState } from 'react'
import { CalendarTile } from './CalendarTile'
import { buildCalendarPlan, type CalendarTileData } from './calendar-plan'
import { cx } from './cx'

export interface ProgressCalendarProps {
  /** Tiles to show. Default: the placeholder 30-day plan (buildCalendarPlan()). */
  tiles?: readonly CalendarTileData[]
  /** Accessible name for the list. */
  label?: string
  className?: string
}

type FillState = 'static' | 'pending' | 'filling'

/**
 * The signature graphic: the month filling up.
 *
 * Resting markup is COMPLETE (every tile filled): that is what renders on the
 * server, without JS, and under prefers-reduced-motion. Only after mount, with
 * motion allowed and IntersectionObserver available, does it switch to
 * `pending` (fills hidden) and then `filling` once 30% of it is in view:
 * 360ms per tile, 70ms stagger, ease-enter (30 tiles in ~2.4s).
 */
export function ProgressCalendar({
  tiles,
  label = 'Your first 30 days',
  className,
}: ProgressCalendarProps) {
  const ref = useRef<HTMLOListElement>(null)
  const [fill, setFill] = useState<FillState>('static')
  const plan = tiles ?? buildCalendarPlan()

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    setFill('pending')
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setFill('filling')
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <ol
      ref={ref}
      aria-label={label}
      data-fill={fill}
      data-tf-calendar=""
      className={cx(
        'group/calendar grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6',
        className
      )}
    >
      {plan.map((tile, index) => (
        <CalendarTile
          key={tile.day}
          day={tile.day}
          state={tile.state}
          label={tile.label}
          index={index}
        />
      ))}
    </ol>
  )
}
