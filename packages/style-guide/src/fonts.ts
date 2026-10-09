import { Caveat, Inter, Inter_Tight } from 'next/font/google'

/**
 * @testify/style-guide/fonts: the three brand faces through next/font (self-hosted
 * at build time, so the CSP `font-src 'self'` holds).
 *
 *   // app/layout.tsx
 *   import { fontVariables } from '@testify/style-guide/fonts'
 *   <html lang="en" className={fontVariables}>
 *
 * Each face only defines a CSS variable; tokens.css builds the stacks
 * (--font-display-stack, --font-text-stack, --font-hand-stack) on top of them,
 * and the preset's font-display / font-text / font-hand read those stacks.
 * Put the class on <html> so :root-level tokens can resolve the variables.
 *
 * Weights: Inter 400-600 (body, labels, buttons), Inter Tight 600-800 (titles,
 * display), Caveat 700 (the optional hand annotation slot).
 */
const display = Inter_Tight({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const text = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-text',
  display: 'swap',
})

const hand = Caveat({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-hand',
  display: 'swap',
})

/** className for <html>: defines --font-display, --font-text and --font-hand. */
export const fontVariables = [display.variable, text.variable, hand.variable].join(' ')
