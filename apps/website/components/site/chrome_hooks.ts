'use client'

// Client hooks for the site chrome: scroll state and the reduced-motion preference.

import { useSyncExternalStore } from 'react'

/**
 * Small client hooks for the chrome. Both read browser state through
 * useSyncExternalStore, so the server render (and first hydration pass) uses
 * the resting value and no effect has to set state.
 */

function subscribeScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true })
  return () => window.removeEventListener('scroll', onChange)
}

/** True once the page has scrolled away from the very top. */
export function useScrolled(): boolean {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 0,
    () => false
  )
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/** True when the visitor asked the OS for reduced motion. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )
}
