/**
 * @testify/style-guide/tokens: the token values as data, for specimens, docs and
 * anything that must compute with them (contrast checks, Stripe, emails).
 * Mirrors tokens.css; both come from testify-research/tokens-final.json.
 * Server-safe: no React, no DS import.
 */

export interface ColorRole {
  /** Role name; the CSS variable is `--<name>` and the Tailwind key `brand-<name>`. */
  name: string
  hex: `#${string}`
  usage: string
}

export const colorRoles: readonly ColorRole[] = [
  {
    name: 'canvas',
    hex: '#f4f2ee',
    usage:
      'Page ground. Warm off-white; most of every page. Cards lift off it (owner ruling 2026-10-09: off-white page, white cards).',
  },
  {
    name: 'canvas-alt',
    hex: '#efebe4',
    usage: 'Recessed band or sunken area on the page ground. Use sparingly.',
  },
  {
    name: 'surface',
    hex: '#ffffff',
    usage: 'Card and panel fill. White lifted off the canvas with elevation-raised.',
  },
  {
    name: 'surface-sunken',
    hex: '#efebe4',
    usage: 'A well inside a card: input groups, nested blocks.',
  },
  { name: 'surface-raised', hex: '#ffffff', usage: 'Overlays, menus, dialogs.' },
  { name: 'ink', hex: '#19171c', usage: 'Headlines, strong text, primary icons.' },
  {
    name: 'ink-muted',
    hex: '#4f4c54',
    usage: 'Body copy and sub-lines. >=7:1 on every light surface, >=6:1 on done-bg.',
  },
  {
    name: 'ink-subtle',
    hex: '#6a6770',
    usage:
      'Captions, footnotes, the honesty note, metadata. >=4.5:1 on every light surface (replaces ash at 2.91:1).',
  },
  {
    name: 'ink-disabled',
    hex: '#a3a0a8',
    usage: 'Disabled labels only (WCAG-exempt). Never informational text.',
  },
  {
    name: 'border',
    hex: '#e7e3dc',
    usage:
      'Decorative hairline between areas. Never the only cue for something a user must perceive.',
  },
  {
    name: 'border-strong',
    hex: '#8d8579',
    usage:
      'Input outlines, meaningful dividers, empty/past dashed tiles. >=3:1 on canvas, canvas-alt and surface.',
  },
  {
    name: 'action',
    hex: '#7a40de',
    usage: 'Primary CTA fill, selected controls, the one "board" tile. One hero CTA per view.',
  },
  { name: 'action-hover', hex: '#6832c8', usage: 'CTA hover fill.' },
  { name: 'action-pressed', hex: '#5a2ab0', usage: 'CTA active fill.' },
  { name: 'action-ink', hex: '#ffffff', usage: 'Label on action fills.' },
  {
    name: 'action-text',
    hex: '#6832c8',
    usage:
      'Inline links / text buttons where violet text is needed. >=4.5:1 on all surfaces incl. done-bg.',
  },
  { name: 'inverse-1', hex: '#711de2', usage: 'Inverse panel gradient stop 0% (was nebula).' },
  { name: 'inverse-2', hex: '#5a14c4', usage: 'Inverse panel gradient stop 58%.' },
  { name: 'inverse-3', hex: '#3f0d8c', usage: 'Inverse panel gradient stop 100%.' },
  { name: 'inverse-ink', hex: '#ffffff', usage: 'Headlines and focus ring on the inverse panel.' },
  {
    name: 'inverse-ink-muted',
    hex: '#ddcdfc',
    usage:
      'Body and notes on the inverse panel. Solid hex; replaces white @72% / @55% (4.29:1 / 3.04:1 on the 0% stop).',
  },
  { name: 'done-bg', hex: '#e8dcc8', usage: 'Highlight / completed-work fill (was tan).' },
  {
    name: 'done-bg-strong',
    hex: '#d9c9ae',
    usage: 'Emphasised done fill (first post, done on done).',
  },
  {
    name: 'done-fg',
    hex: '#7a5a2c',
    usage: 'Text or check icon that says "done" on canvas, surface or done-bg.',
  },
  {
    name: 'done-border',
    hex: '#a8865a',
    usage: 'Outline for done tiles where the fill alone must be perceivable (3:1).',
  },
  { name: 'focus', hex: '#7a40de', usage: 'Focus ring on light grounds: 2px solid, 3px offset.' },
  {
    name: 'focus-inverse',
    hex: '#ffffff',
    usage: 'Focus ring on the inverse panel and around action fills on inverse.',
  },
  {
    name: 'mark',
    hex: '#c3a9fa',
    usage: 'Decorative annotation stroke (hand marks). Never the sole carrier of meaning.',
  },
  {
    name: 'danger-fg',
    hex: '#b42318',
    usage: 'danger text and icon; >=4.5:1 on canvas, surface and danger-bg.',
  },
  { name: 'danger-bg', hex: '#fdf1ef', usage: 'danger banner / field-message fill.' },
  {
    name: 'danger-border',
    hex: '#d9483b',
    usage: 'danger outline (inputs, banners); >=3:1 on canvas, surface and danger-bg.',
  },
  {
    name: 'success-fg',
    hex: '#1d7438',
    usage: 'success text and icon; >=4.5:1 on canvas, surface and success-bg.',
  },
  { name: 'success-bg', hex: '#edf7ef', usage: 'success banner / field-message fill.' },
  {
    name: 'success-border',
    hex: '#3d9a5a',
    usage: 'success outline (inputs, banners); >=3:1 on canvas, surface and success-bg.',
  },
  {
    name: 'warning-fg',
    hex: '#8a5300',
    usage: 'warning text and icon; >=4.5:1 on canvas, surface and warning-bg.',
  },
  { name: 'warning-bg', hex: '#fdf4e1', usage: 'warning banner / field-message fill.' },
  {
    name: 'warning-border',
    hex: '#a8700f',
    usage: 'warning outline (inputs, banners); >=3:1 on canvas, surface and warning-bg.',
  },
  {
    name: 'info-fg',
    hex: '#1c62b3',
    usage: 'info text and icon; >=4.5:1 on canvas, surface and info-bg.',
  },
  { name: 'info-bg', hex: '#edf3fb', usage: 'info banner / field-message fill.' },
  {
    name: 'info-border',
    hex: '#4a88d4',
    usage: 'info outline (inputs, banners); >=3:1 on canvas, surface and info-bg.',
  },
  {
    name: 'action-quiet',
    hex: '#19171c',
    usage:
      'Ink pill for nav CTA and mid-page repeated CTAs. Violet is reserved for the hero and closing CTA (owner ruling 2026-10-09).',
  },
  { name: 'action-quiet-ink', hex: '#f4f2ee', usage: 'Label on an action-quiet pill (15.9:1).' },
]

export interface TypeStyle {
  /** Tailwind key: `text-<key>`. */
  key: string
  /** Token name in tokens-final.json. */
  token: string
  size: string
  lineHeight: string
  tracking: string
  weight: number
  family: 'display' | 'text' | 'hand'
  usage: string
}

export const typeScale: readonly TypeStyle[] = [
  {
    key: 'brand-display',
    token: 'display',
    size: 'clamp(3rem, 2.2174rem + 3.4783vw, 5rem)',
    lineHeight: '1',
    tracking: '-0.03em',
    weight: 800,
    family: 'display',
    usage: 'One hero H1 per page. Max ~14ch per line.',
  },
  {
    key: 'brand-h1',
    token: 'heading-lg',
    size: 'clamp(2.5rem, 1.913rem + 2.6087vw, 4rem)',
    lineHeight: '1.05',
    tracking: '-0.028em',
    weight: 800,
    family: 'display',
    usage: 'H1 on interior pages, or one closing statement. Max ~18ch.',
  },
  {
    key: 'brand-h2',
    token: 'heading',
    size: 'clamp(2.0625rem, 1.6957rem + 1.6304vw, 3rem)',
    lineHeight: '1.1',
    tracking: '-0.024em',
    weight: 800,
    family: 'display',
    usage: 'Section headline (H2), one per section. Max ~22ch.',
  },
  {
    key: 'brand-h3',
    token: 'title',
    size: 'clamp(1.75rem, 1.5543rem + 0.8696vw, 2.25rem)',
    lineHeight: '1.2',
    tracking: '-0.02em',
    weight: 700,
    family: 'display',
    usage: 'Sub-section / feature title (H3).',
  },
  {
    key: 'brand-h4',
    token: 'title-sm',
    size: 'clamp(1.375rem, 1.2283rem + 0.6522vw, 1.75rem)',
    lineHeight: '1.25',
    tracking: '-0.015em',
    weight: 700,
    family: 'display',
    usage: 'Card and list-item titles (H4).',
  },
  {
    key: 'brand-lead',
    token: 'lead',
    size: 'clamp(1.125rem, 1.0516rem + 0.3261vw, 1.3125rem)',
    lineHeight: '1.45',
    tracking: '-0.01em',
    weight: 400,
    family: 'text',
    usage: 'One sub-line under a headline, ink-muted, max 48ch.',
  },
  {
    key: 'brand-body',
    token: 'body',
    size: '1rem',
    lineHeight: '1.6',
    tracking: '-0.005em',
    weight: 400,
    family: 'text',
    usage: 'Running copy, ink-muted, max 65ch.',
  },
  {
    key: 'brand-body-strong',
    token: 'body-strong',
    size: '1rem',
    lineHeight: '1.6',
    tracking: '-0.005em',
    weight: 600,
    family: 'text',
    usage: 'Inline emphasis and stat labels.',
  },
  {
    key: 'brand-label',
    token: 'label',
    size: '0.875rem',
    lineHeight: '1.3',
    tracking: '0em',
    weight: 500,
    family: 'text',
    usage: 'Form labels, nav links, chips.',
  },
  {
    key: 'brand-button',
    token: 'button',
    size: '1rem',
    lineHeight: '1.2',
    tracking: '-0.005em',
    weight: 600,
    family: 'text',
    usage: 'Button label. Sentence case, verb first.',
  },
  {
    key: 'brand-small',
    token: 'small',
    size: '0.875rem',
    lineHeight: '1.5',
    tracking: '0em',
    weight: 400,
    family: 'text',
    usage: 'Helper text, field messages, figure sources and caveats (>=14px).',
  },
  {
    key: 'brand-caption',
    token: 'caption',
    size: 'clamp(0.75rem, 0.7255rem + 0.1087vw, 0.8125rem)',
    lineHeight: '1.45',
    tracking: '0.005em',
    weight: 400,
    family: 'text',
    usage: 'Non-essential footnotes only; disclosures use brand-small (>=14px).',
  },
  {
    key: 'brand-overline',
    token: 'overline',
    size: 'clamp(0.75rem, 0.7255rem + 0.1087vw, 0.8125rem)',
    lineHeight: '1.3',
    tracking: '0.06em',
    weight: 600,
    family: 'text',
    usage: 'Eyebrow / badge text. The only place uppercase is allowed.',
  },
  {
    key: 'brand-hand',
    token: 'accent',
    size: 'clamp(1.375rem, 1.2283rem + 0.6522vw, 1.75rem)',
    lineHeight: '1.1',
    tracking: '0em',
    weight: 700,
    family: 'hand',
    usage: 'Optional brand slot for annotations. Decorative; the page must read without it.',
  },
]

export interface ScaleStep {
  name: string
  value: string
  usage: string
}

export const spaceScale: readonly ScaleStep[] = [
  { name: 'space-1', value: '4px', usage: 'Icon-to-label, hairline offsets.' },
  { name: 'space-2', value: '8px', usage: 'Tight inline gaps, chip padding-y.' },
  { name: 'space-3', value: '12px', usage: 'Sibling gap in rows: buttons, chips, tiles.' },
  { name: 'space-4', value: '16px', usage: 'Default stack gap, input padding-x, mobile gutter.' },
  { name: 'space-5', value: '20px', usage: 'Field-to-field stack in forms.' },
  { name: 'space-6', value: '24px', usage: 'Card padding (mobile), headline-to-lead.' },
  { name: 'space-8', value: '32px', usage: 'Content-to-CTA row, card padding desktop.' },
  { name: 'space-10', value: '40px', usage: 'Group separation inside a section.' },
  { name: 'space-12', value: '48px', usage: 'Headline block to section content.' },
  { name: 'space-16', value: '64px', usage: 'Section padding mobile.' },
  { name: 'space-20', value: '80px', usage: 'Section padding tablet.' },
  { name: 'space-24', value: '96px', usage: 'Section padding desktop.' },
  { name: 'space-32', value: '128px', usage: 'Hero / final-CTA breathing room on wide screens.' },
]

export const radiusScale: readonly (ScaleStep & { tailwind: string })[] = [
  {
    name: 'radius-xs',
    value: '4px',
    tailwind: '(var only)',
    usage: 'Checkbox, floor for nesting.',
  },
  { name: 'radius-sm', value: '8px', tailwind: 'rounded-tile-sm', usage: 'Chips, tiles <48px.' },
  {
    name: 'radius-md',
    value: '14px',
    tailwind: 'rounded-control / rounded-tile',
    usage: 'Inputs, tiles >=48px.',
  },
  { name: 'radius-lg', value: '22px', tailwind: 'rounded-media', usage: 'Media inset in a card.' },
  {
    name: 'radius-xl',
    value: 'clamp(1.5rem, 1.1087rem + 1.7391vw, 2.5rem)',
    tailwind: 'rounded-card',
    usage: 'Cards, panels, inverse panel (24 to 40px).',
  },
  {
    name: 'radius-pill',
    value: '9999px',
    tailwind: 'rounded-pill',
    usage: 'Buttons, badges, toggles.',
  },
]

export const elevationScale: readonly (ScaleStep & { tailwind: string })[] = [
  {
    name: 'elevation-1',
    value: 'var(--elevation-1)',
    tailwind: 'shadow-raised',
    usage: 'Rest: white card on canvas.',
  },
  {
    name: 'elevation-2',
    value: 'var(--elevation-2)',
    tailwind: 'shadow-lifted',
    usage: 'Hover lift, featured card.',
  },
  {
    name: 'elevation-3',
    value: 'var(--elevation-3)',
    tailwind: 'shadow-overlay',
    usage: 'Menus, modals, drawers.',
  },
  {
    name: 'elevation-cta',
    value: 'var(--elevation-cta)',
    tailwind: 'shadow-cta',
    usage: 'Primary CTA hover only.',
  },
]

/** WCAG 2.x relative luminance of a #rrggbb hex. */
export function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r = 0, g = 0, b = 0] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.x contrast ratio between two #rrggbb hexes (1 to 21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/** Hex for a role name; throws on an unknown role so a typo fails loudly. */
export function roleHex(name: string): `#${string}` {
  const found = colorRoles.find((c) => c.name === name)
  if (!found) throw new Error(`Unknown colour role: ${name}`)
  return found.hex
}
