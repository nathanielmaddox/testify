/** @type {import('tailwindcss').Config} */
const preset = require('@testify/config/tailwind-preset')

/**
 * The DS theme arrives through @testify/config/tailwind-preset (it wraps
 * `@otesse/design-system/tailwind`). `content` is never inherited from a
 * preset in Tailwind v3, so the DS dist globs are listed here: without them
 * the classes DS components use are never generated and they render unstyled.
 * Both globs are needed: pnpm may link the DS into this app or hoist it to the
 * monorepo root.
 */
module.exports = {
  presets: [preset],
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './node_modules/@otesse/design-system/dist/**/*.{js,mjs}',
    '../../node_modules/@otesse/design-system/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
