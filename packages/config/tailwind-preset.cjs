/**
 * @testify/config/tailwind-preset — Tailwind v3 preset.
 *
 * Wraps the theme of @otesse/design-system (its exported `./tailwind` config:
 * CSS-variable colors, type scale, spacing, shadows, radii, z-index, keyframes)
 * so DS components render with the classes they were built against.
 *
 *   // apps/<app>/tailwind.config.js
 *   const preset = require('@testify/config/tailwind-preset')
 *   module.exports = {
 *     presets: [preset],
 *     content: [
 *       './app/**\/*.{ts,tsx}',
 *       './components/**\/*.{ts,tsx}',
 *       preset.dsContent(__dirname),
 *     ],
 *   }
 *
 * `content` is NOT inherited from presets in Tailwind v3 (the app's own
 * `content` wins), so every app must add the DS glob itself — use
 * `preset.dsContent(__dirname)` or the literal `preset.DS_CONTENT_GLOB`.
 *
 * The DS theme is required from this package's own devDependency (same pin as
 * the apps). The require is guarded: if @otesse/design-system is not installed
 * yet, the preset still loads (tokens missing, one warning).
 */
const path = require('path')

/** App-relative glob for the DS's built modules. */
const DS_CONTENT_GLOB = './node_modules/@otesse/design-system/dist/**/*.{js,mjs}'

function loadDesignSystemConfig() {
  try {
    // Static require so bundlers (Turbopack evaluates this file for PostCSS)
    // can resolve it. This package pins the DS as a devDependency, at the same
    // ref as every app (pnpm check:workspace enforces one pin).
    return require('@otesse/design-system/tailwind')
  } catch (error) {
    if (process.env.TESTIFY_SILENCE_DS_WARNING !== '1') {
      console.warn(
        '[@testify/config/tailwind-preset] @otesse/design-system/tailwind not resolvable; ' +
          'DS theme tokens are not applied. Install @otesse/design-system in the app. (' +
          (error && error.code ? error.code : String(error)) +
          ')'
      )
    }
    return null
  }
}

const ds = loadDesignSystemConfig()

/**
 * Only the DS's theme and darkMode are taken. Its `content` (./src/**, relative
 * to the DS repo) and empty `plugins` are deliberately dropped.
 */
const dsPreset = ds ? { darkMode: ds.darkMode || 'class', theme: ds.theme || {} } : null

const preset = {
  darkMode: 'class',
  presets: dsPreset ? [dsPreset] : [],
  theme: {
    extend: {},
  },
  plugins: [],
}

/**
 * Absolute content glob for the DS dist, resolved from an app directory.
 * Resolves the real package path when possible (pnpm symlinks), otherwise
 * falls back to `<appDir>/node_modules/@otesse/design-system/dist/...`.
 * Tailwind wants forward slashes, so Windows separators are normalised.
 *
 * @param {string} [appDir] usually `__dirname` of the app's tailwind.config.js
 * @returns {string}
 */
function dsContent(appDir = process.cwd()) {
  let root = path.join(appDir, 'node_modules', '@otesse', 'design-system')
  try {
    const pkgJson = require.resolve('@otesse/design-system/package.json', { paths: [appDir] })
    root = path.dirname(pkgJson)
  } catch {
    // not installed yet; keep the conventional path
  }
  return path.join(root, 'dist', '**', '*.{js,mjs}').replace(/\\/g, '/')
}

// Non-enumerable so Tailwind's config merge never sees them.
Object.defineProperty(preset, 'dsContent', { value: dsContent, enumerable: false })
Object.defineProperty(preset, 'DS_CONTENT_GLOB', { value: DS_CONTENT_GLOB, enumerable: false })
Object.defineProperty(preset, 'hasDesignSystem', { value: Boolean(ds), enumerable: false })

module.exports = preset
