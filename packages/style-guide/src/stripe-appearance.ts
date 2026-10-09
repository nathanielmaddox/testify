/**
 * @testify/style-guide/stripe-appearance: the Stripe Payment Element Appearance
 * matching tokens.css. Stripe renders in an iframe and cannot read our CSS
 * variables, so the values are the token hexes, written once here.
 *
 *   import { stripeAppearance, stripeFonts } from '@testify/style-guide/stripe-appearance'
 *   <Elements stripe={stripePromise} options={{ appearance: stripeAppearance, fonts: stripeFonts, clientSecret }} />
 *
 * Typed structurally so this package does not depend on @stripe/stripe-js; the
 * object is assignable to its `Appearance` type.
 */

export interface StripeAppearance {
  theme: 'stripe' | 'night' | 'flat'
  labels: 'above' | 'floating'
  variables: Record<string, string>
  rules: Record<string, Record<string, string>>
}

export interface StripeCssFontSource {
  cssSrc: string
}

/** Token hexes used below (tokens-final.json, final-v1 2026-10-09). */
const t = {
  canvas: '#FAF9F6',
  surface: '#ffffff',
  surfaceSunken: '#efebe4',
  ink: '#19171c',
  inkMuted: '#4f4c54',
  inkSubtle: '#6a6770',
  inkDisabled: '#a3a0a8',
  border: '#e7e3dc',
  borderStrong: '#8d8579',
  action: '#7a40de',
  focus: '#7a40de',
  dangerFg: '#b42318',
  dangerBorder: '#d9483b',
  successFg: '#1d7438',
  warningFg: '#8a5300',
} as const

const textStack = 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'

export const stripeAppearance: StripeAppearance = {
  theme: 'stripe',
  labels: 'above',
  variables: {
    colorPrimary: t.action,
    colorBackground: t.surface,
    colorText: t.ink,
    colorTextSecondary: t.inkMuted,
    colorTextPlaceholder: t.inkSubtle,
    colorIcon: t.inkMuted,
    colorDanger: t.dangerFg,
    colorSuccess: t.successFg,
    colorWarning: t.warningFg,
    fontFamily: textStack,
    fontSizeBase: '16px',
    fontWeightNormal: '400',
    fontWeightMedium: '500',
    fontWeightBold: '600',
    fontLineHeight: '1.5',
    spacingUnit: '4px',
    gridRowSpacing: '20px',
    gridColumnSpacing: '16px',
    borderRadius: '14px',
    focusBoxShadow: `0 0 0 3px ${t.canvas}, 0 0 0 5px ${t.focus}`,
    focusOutline: 'none',
  },
  rules: {
    '.Label': { color: t.ink, fontSize: '14px', fontWeight: '500', marginBottom: '8px' },
    '.Input': {
      backgroundColor: t.surface,
      border: `1px solid ${t.borderStrong}`,
      boxShadow: 'none',
      padding: '12px 16px',
    },
    '.Input:hover': { borderColor: t.ink },
    '.Input:focus': {
      borderColor: t.focus,
      boxShadow: `0 0 0 3px ${t.canvas}, 0 0 0 5px ${t.focus}`,
    },
    '.Input--invalid': { borderColor: t.dangerBorder, boxShadow: 'none' },
    '.Input:disabled': { backgroundColor: t.surfaceSunken, color: t.inkDisabled },
    '.Error': { color: t.dangerFg, fontSize: '14px' },
    '.Tab': { border: `1px solid ${t.borderStrong}`, boxShadow: 'none' },
    '.Tab:hover': { borderColor: t.ink },
    '.Tab--selected': { borderColor: t.ink, boxShadow: `inset 0 0 0 1px ${t.ink}` },
    '.Block': { backgroundColor: t.surface, border: `1px solid ${t.border}`, boxShadow: 'none' },
  },
}

/** Load Inter inside the Stripe iframe (pass as Elements `fonts`). */
export const stripeFonts: StripeCssFontSource[] = [
  { cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' },
]
