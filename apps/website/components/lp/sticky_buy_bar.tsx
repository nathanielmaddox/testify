'use client'

/**
 * Sticky buy bar for the offer LPs (Paper "sticky buy bar"). Pinned to the
 * bottom of the viewport once the hero has scrolled out of view, so the buy
 * CTA stays reachable. The bar is inert and hidden while the hero is on
 * screen, and slides in only when motion is allowed (reduced motion: it
 * appears without movement).
 */
import { useEffect, useState } from 'react'
import { BuyCta } from '@/components/lp/sections/buy_cta'
import { OPEN_SIGN_STICKY_LABEL } from '@/components/lp/sections/open_sign_copy'
import { DEFAULT_STICKY_BAR_TEXT } from '@/lib/landing_pages'

export interface StickyBuyBarProps {
  /** Id of the hero section the bar waits for (`lp-<slug>-hero`). */
  heroId: string
  href: string
  lpSlug: string
  /** The bar's line, from the LP registry (`stickyBarText`). Default: the cold text. */
  text?: string | undefined
}

export function StickyBuyBar({
  heroId,
  href,
  lpSlug,
  text = DEFAULT_STICKY_BAR_TEXT,
}: StickyBuyBarProps) {
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const hero = document.getElementById(heroId)
    if (!hero || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      },
      { threshold: 0 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [heroId])

  return (
    <div
      data-slot="sticky-buy-bar"
      aria-hidden={!pastHero}
      inert={!pastHero}
      className={[
        'fixed inset-x-0 bottom-3 z-40 px-brand-gutter',
        'motion-safe:transition-[transform,opacity] motion-safe:duration-brand-base motion-safe:ease-brand-enter',
        pastHero ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0',
      ].join(' ')}
    >
      <div className="mx-auto flex w-full max-w-grid flex-col items-center gap-4 rounded-pill bg-brand-surface py-3 pl-8 pr-3 shadow-raised sm:flex-row sm:justify-between">
        <p className="font-text text-brand-small text-brand-ink">{text}</p>
        <BuyCta
          href={href}
          lpSlug={lpSlug}
          label={OPEN_SIGN_STICKY_LABEL}
          tone="quiet"
          placement="sticky"
        />
      </div>
    </div>
  )
}
