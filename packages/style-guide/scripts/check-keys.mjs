#!/usr/bin/env node
/**
 * check-keys: the brand preset must only ADD Tailwind keys.
 *
 * Loads the @otesse/design-system preset and @testify/style-guide/preset, flattens
 * every theme namespace the brand preset touches (colours to their utility names,
 * e.g. `brand.primary` -> `brand-primary`), and fails when a brand key also exists
 * in the DS preset or in Tailwind's default theme. A redefined key does not error
 * anywhere else: the later preset silently wins and every DS component that used
 * the key changes look.
 *
 *   node packages/style-guide/scripts/check-keys.mjs   (or: pnpm --filter @testify/style-guide check:keys)
 */
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const dsConfig = require('@otesse/design-system/tailwind')
const brandPreset = require('../preset.cjs')
const resolveConfig = require('tailwindcss/resolveConfig')

/** Utility-name keys of one theme namespace; colours flatten like Tailwind does. */
function keysOf(namespace, value) {
  if (!value || typeof value !== 'object') return []
  if (namespace !== 'colors') return Object.keys(value)
  const out = []
  const walk = (map, prefix) => {
    for (const [key, v] of Object.entries(map)) {
      const name = key === 'DEFAULT' ? prefix.replace(/-$/, '') : `${prefix}${key}`
      if (v && typeof v === 'object') walk(v, `${name}-`)
      else out.push(name)
    }
  }
  walk(value, '')
  return out
}

/** Every key a theme defines for a namespace, top-level and under `extend`. */
function themeKeys(theme, namespace) {
  return new Set([
    ...keysOf(namespace, theme?.[namespace]),
    ...keysOf(namespace, theme?.extend?.[namespace]),
  ])
}

const brandTheme = brandPreset.theme ?? {}
const namespaces = [
  ...new Set([...Object.keys(brandTheme.extend ?? {}), ...Object.keys(brandTheme)]),
].filter((ns) => ns !== 'extend')

// Tailwind's own default theme, resolved (functions evaluated), with no presets.
const defaults = resolveConfig({ content: [], presets: [] }).theme

const failures = []
let checked = 0
for (const ns of namespaces) {
  const brandKeys = themeKeys(brandTheme, ns)
  const dsKeys = themeKeys(dsConfig.theme, ns)
  const defaultKeys = new Set(keysOf(ns, defaults[ns]))
  for (const key of brandKeys) {
    checked += 1
    if (dsKeys.has(key)) failures.push(`${ns}.${key}: redefines a @otesse/design-system key`)
    else if (defaultKeys.has(key)) failures.push(`${ns}.${key}: redefines a Tailwind default key`)
  }
}

if (failures.length > 0) {
  console.error('check-keys: the brand preset must only add keys.')
  for (const f of failures) console.error(`  ${f}`)
  process.exit(1)
}
console.log(
  `check-keys: ok (${checked} brand keys across ${namespaces.length} namespaces, no overlap with the DS preset or Tailwind defaults)`
)
