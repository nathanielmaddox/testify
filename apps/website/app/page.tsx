import type { Metadata } from 'next'
import { HomePlaceholder } from '@/components/home/home_placeholder'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/**
 * Home. Placeholder only: the real page is not built yet. The markup is the
 * `'use client'` HomePlaceholder, composed purely from DS components.
 */
export default function HomePage() {
  return <HomePlaceholder />
}
