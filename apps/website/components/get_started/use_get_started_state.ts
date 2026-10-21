'use client'

/**
 * Hook for the get-started flow's sessionStorage state (lib/get_started.ts).
 * Reads after mount so server HTML and the first client render agree.
 */

import { useCallback, useEffect, useState } from 'react'
import { readGetStartedState, writeGetStartedState, type GetStartedState } from '@/lib/get_started'

/**
 * The flow's sessionStorage state. `state` is null until the first client
 * render reads storage (so server HTML and the first client render agree),
 * and `ready` is true from then on. `update` merges top-level keys into the
 * stored state and writes it at once, before any navigation, so Back and a
 * refresh keep every answer and the booked page always finds the booking.
 */
export function useGetStartedState() {
  const [state, setState] = useState<GetStartedState | null>(null)

  useEffect(() => {
    setState(readGetStartedState())
  }, [])

  const update = useCallback((patch: Partial<GetStartedState>) => {
    const next: GetStartedState = { ...readGetStartedState(), ...patch }
    writeGetStartedState(next)
    setState(next)
  }, [])

  return { state, ready: state !== null, update }
}
