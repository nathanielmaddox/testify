'use client'

import { Icon } from '@otesse/design-system'
import type { IconRegistry } from '@otesse/design-system'
import { ArrowRight, Check, ChevronDown, Menu, Minus, X } from 'lucide-react'

/**
 * The icons the brand uses, by name. The pinned DS `Icon` resolves string
 * names only through a `registry`, so every icon goes through this wrapper.
 * Add an icon here (one import + one entry) before using its name.
 */
export const brandIcons: IconRegistry = {
  ArrowRight,
  Check,
  ChevronDown,
  Menu,
  Minus,
  X,
}

export type BrandIconName = 'ArrowRight' | 'Check' | 'ChevronDown' | 'Menu' | 'Minus' | 'X'

export interface BrandIconProps {
  name: BrandIconName
  /** Icon next to visible text is decorative (default). Icon-only controls need a label instead. */
  label?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

/** DS Icon with the brand registry, in the current text colour. */
export function BrandIcon({ name, label, size = 'sm' }: BrandIconProps) {
  return label ? (
    <Icon lucide={name} registry={brandIcons} size={size} color="inherit" aria-label={label} />
  ) : (
    <Icon lucide={name} registry={brandIcons} size={size} color="inherit" decorative />
  )
}
