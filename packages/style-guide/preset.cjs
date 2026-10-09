/**
 * @testify/style-guide/preset: Tailwind v3 preset for the Testify brand layer.
 *
 *   // apps/<app>/tailwind.config.js
 *   module.exports = {
 *     presets: [require('@testify/config/tailwind-preset'), require('@testify/style-guide/preset')],
 *     content: [..., '../../packages/style-guide/src/**\/*.{ts,tsx}'],
 *   }
 *
 * RULE: every key here is NEW. Nothing may redefine a key the design system
 * preset owns (rounded-sm/md/lg/xl, shadow-sm/md/lg/xl/elevated, text-display/
 * h1/h2/body/small, spacing xs..3xl, duration fast/normal/slow, z-*...) or a
 * Tailwind default. `node scripts/check-keys.mjs` fails on any overlap.
 *
 * Every value reads a CSS variable from ./src/tokens.css, so tokens.css is the
 * one place a value changes. Colours are RGB triplets so opacity modifiers work.
 */

/** `rgb(var(--<role>-rgb) / <alpha-value>)` for a role name from tokens.css. */
const role = (name) => `rgb(var(--${name}-rgb) / <alpha-value>)`

const COLOR_ROLES = [
  'canvas',
  'canvas-alt',
  'surface',
  'surface-sunken',
  'surface-raised',
  'ink',
  'ink-muted',
  'ink-subtle',
  'ink-disabled',
  'border',
  'border-strong',
  'action',
  'action-hover',
  'action-pressed',
  'action-ink',
  'action-text',
  'action-quiet',
  'action-quiet-ink',
  'inverse-1',
  'inverse-2',
  'inverse-3',
  'inverse-ink',
  'inverse-ink-muted',
  'done-bg',
  'done-bg-strong',
  'done-fg',
  'done-border',
  'focus',
  'focus-inverse',
  'mark',
  'danger-fg',
  'danger-bg',
  'danger-border',
  'success-fg',
  'success-bg',
  'success-border',
  'warning-fg',
  'warning-bg',
  'warning-border',
  'info-fg',
  'info-bg',
  'info-border',
]

/** Top-level `brand-<role>` keys (NOT nested under the DS `brand` object). */
const colors = Object.fromEntries(COLOR_ROLES.map((name) => [`brand-${name}`, role(name)]))

/** [size var, line-height, tracking, weight] per brand type style. */
const type = (size, lineHeight, letterSpacing, fontWeight) => [
  `var(--text-${size})`,
  { lineHeight, letterSpacing, fontWeight },
]

const fontSize = {
  'brand-display': type('display', '1', '-0.03em', '800'),
  'brand-h1': type('heading-lg', '1.05', '-0.028em', '800'),
  'brand-h2': type('heading', '1.1', '-0.024em', '800'),
  'brand-h3': type('title', '1.2', '-0.02em', '700'),
  'brand-h4': type('title-sm', '1.25', '-0.015em', '700'),
  'brand-lead': type('lead', '1.45', '-0.01em', '400'),
  'brand-body': type('body', '1.6', '-0.005em', '400'),
  'brand-body-strong': type('body', '1.6', '-0.005em', '600'),
  'brand-label': type('label', '1.3', '0em', '500'),
  'brand-button': type('button', '1.2', '-0.005em', '600'),
  'brand-small': type('small', '1.5', '0em', '400'),
  'brand-caption': type('caption', '1.45', '0.005em', '400'),
  'brand-overline': type('overline', '1.3', '0.06em', '600'),
  'brand-hand': type('accent', '1.1', '0em', '700'),
}

const boxShadow = {
  // NEVER name a shadow after a colour (see the collision guard below).
  raised: 'var(--elevation-1)',
  lifted: 'var(--elevation-2)',
  overlay: 'var(--elevation-3)',
  cta: 'var(--elevation-cta)',
}

const preset = {
  theme: {
    extend: {
      colors,
      fontFamily: {
        display: ['var(--font-display-stack)'],
        text: ['var(--font-text-stack)'],
        hand: ['var(--font-hand-stack)'],
      },
      fontSize,
      borderRadius: {
        card: 'var(--radius-xl)',
        media: 'var(--radius-lg)',
        control: 'var(--radius-md)',
        tile: 'var(--radius-md)',
        'tile-sm': 'var(--radius-sm)',
        pill: 'var(--radius-pill)',
      },
      boxShadow,
      spacing: {
        'brand-section': 'var(--section-y)',
        'brand-gutter': 'var(--gutter)',
        'brand-card': 'var(--card-pad)',
        'brand-grid': 'var(--grid-gap)',
      },
      maxWidth: {
        measure: 'var(--measure)',
        'measure-narrow': 'var(--measure-narrow)',
        'measure-heading': 'var(--measure-heading)',
        'measure-caption': 'var(--measure-caption)',
        content: 'var(--container)',
        grid: 'var(--container-wide)',
        form: 'var(--container-form)',
      },
      backgroundImage: {
        'brand-inverse': 'var(--gradient-inverse)',
      },
      transitionDuration: {
        'brand-fast': 'var(--duration-fast)',
        'brand-base': 'var(--duration-base)',
        'brand-slow': 'var(--duration-slow)',
        'brand-slower': 'var(--duration-slower)',
      },
      transitionTimingFunction: {
        'brand-standard': 'var(--ease-standard)',
        'brand-enter': 'var(--ease-enter)',
        'brand-exit': 'var(--ease-exit)',
      },
      animation: {
        'brand-tile-fill': 'tf-tile-fill var(--calendar-fill-duration) var(--ease-enter) both',
      },
    },
  },
  plugins: [],
}

/*
 * COLLISION GUARD (copied from rank_and_rent/apps/copy_site_city/tailwind.config.js).
 *
 * `shadow-{name}` resolves against BOTH `boxShadow` and the colour palette, so a
 * shared name emits two utilities and the colour wins: the shadow renders in that
 * colour instead of its own. rank_and_rent shipped `boxShadow.card` against
 * `colors.card` (white) and painted a white shadow on a white ground. The same
 * ambiguity exists for `text-{name}` (fontSize vs colour). Resolving against the
 * DS theme makes this fire in both directions: a shadow named after an existing
 * colour, and a colour added later with the name of an existing shadow.
 */
function flattenColorNames(colorMap, prefix = '') {
  const names = []
  for (const [key, value] of Object.entries(colorMap || {})) {
    const name = key === 'DEFAULT' ? prefix.replace(/-$/, '') : `${prefix}${key}`
    if (value && typeof value === 'object') names.push(...flattenColorNames(value, `${name}-`))
    else names.push(name)
  }
  return names
}

function loadDsTheme() {
  try {
    const ds = require('@otesse/design-system/tailwind')
    return { darkMode: ds.darkMode || 'class', theme: ds.theme || {} }
  } catch {
    return null
  }
}

function guard() {
  let resolveConfig
  try {
    resolveConfig = require('tailwindcss/resolveConfig')
  } catch {
    return // tailwindcss not resolvable from here: the app build will catch it.
  }
  const dsTheme = loadDsTheme()
  const resolved = resolveConfig({
    content: [],
    presets: dsTheme ? [dsTheme, preset] : [preset],
  })
  const colourNames = new Set(flattenColorNames(resolved.theme.colors))
  const problems = []
  for (const key of Object.keys(boxShadow)) {
    if (colourNames.has(key)) problems.push(`  boxShadow.${key}  collides with  colors.${key}`)
  }
  for (const key of Object.keys(fontSize)) {
    if (colourNames.has(key)) problems.push(`  fontSize.${key}  collides with  colors.${key}`)
  }
  if (problems.length > 0) {
    throw new Error(
      '@testify/style-guide/preset: utility name collision.\n' +
        problems.join('\n') +
        '\nshadow-{name} / text-{name} resolve against two scales and the COLOUR wins. ' +
        'Rename the key (check it against every colour in the DS preset and this file).'
    )
  }
}

guard()

Object.defineProperty(preset, 'COLOR_ROLES', { value: COLOR_ROLES, enumerable: false })

module.exports = preset
