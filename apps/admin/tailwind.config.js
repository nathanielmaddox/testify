/** @type {import('tailwindcss').Config} */
const preset = require('@testify/config/tailwind-preset')
const brandPreset = require('@testify/style-guide/preset')

/**
 * Presets, in order: the DS theme through @testify/config/tailwind-preset (it
 * wraps `@otesse/design-system/tailwind`), then the Testify brand layer
 * (@testify/style-guide/preset), which only ADDS brand-named keys and never
 * redefines a DS key (`pnpm --filter @testify/style-guide check:keys`).
 *
 * `content` is never inherited from a preset in Tailwind v3, so the DS dist
 * globs and the style-guide sources are listed here: without them the classes
 * those components use are never generated and they render unstyled. Both DS
 * globs are needed: pnpm may link the DS into this app or hoist it to the
 * monorepo root.
 */
module.exports = {
  presets: [preset, brandPreset],
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    '../../packages/style-guide/src/**/*.{ts,tsx}',
    './node_modules/@otesse/design-system/dist/**/*.{js,mjs}',
    '../../node_modules/@otesse/design-system/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
