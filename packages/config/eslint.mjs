/**
 * @testify/config/eslint — shared ESLint 9 flat config.
 *
 *   // apps/<next-app>/eslint.config.mjs
 *   import { nextConfig } from '@testify/config/eslint'
 *   export default nextConfig()
 *
 *   // packages/<lib>/eslint.config.mjs
 *   import baseConfig from '@testify/config/eslint'
 *   export default baseConfig
 *
 * Mirrors vs_code/rank_and_rent/eslint.config.mjs.
 */
import nextPlugin from '@next/eslint-plugin-next'
import prettierConfig from 'eslint-config-prettier'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

const TS_FILES = ['**/*.{ts,tsx}']

export const defaultIgnores = [
  '**/node_modules/**',
  '**/.next/**',
  '**/out/**',
  '**/dist/**',
  '**/storybook-static/**',
  '**/convex/_generated/**',
  '**/next-env.d.ts',
]

/** Rules every package shares (TS + house rules). */
const sharedTsRules = {
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],
  '@typescript-eslint/no-explicit-any': 'error',
  // House rule: no emojis in source, icons only.
  'no-restricted-syntax': [
    'error',
    {
      selector:
        'Literal[value=/[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}]/u], JSXText[value=/[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}]/u], TemplateElement[value.raw=/[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}]/u]',
      message: 'No emojis in UI source. Use an icon component.',
    },
  ],
}

const tsRecommended = tseslint.configs.recommended.map((config) => ({
  ...config,
  files: TS_FILES,
}))

/** Flat config for non-Next packages: TS recommended + house rules + prettier compat. */
export const baseConfig = [
  { ignores: defaultIgnores },
  ...tsRecommended,
  {
    files: TS_FILES,
    rules: sharedTsRules,
  },
  prettierConfig,
]

/**
 * Flat config for a Next.js app: Next (recommended + core-web-vitals), React,
 * React Hooks, TS recommended, house rules, prettier compat (last).
 *
 * @param {object} [options]
 * @param {string[]} [options.ignores] Extra ignore globs, appended to the defaults.
 * @param {string} [options.rootDir] Next app root (sets settings.next.rootDir and
 *   re-enables @next/next/no-html-link-for-pages, which is off by default because
 *   the pages-dir probe is noise in an app-router monorepo).
 * @param {Record<string, unknown>} [options.rules] Rule overrides applied last (before prettier).
 * @returns {import('eslint').Linter.Config[]}
 */
export function nextConfig(options = {}) {
  const { ignores = [], rootDir, rules = {} } = options

  return [
    { ignores: [...defaultIgnores, ...ignores] },
    ...tsRecommended,
    {
      files: TS_FILES,
      plugins: {
        '@next/next': nextPlugin,
        react: reactPlugin,
        'react-hooks': hooksPlugin,
      },
      rules: {
        ...nextPlugin.configs.recommended.rules,
        ...nextPlugin.configs['core-web-vitals'].rules,
        '@next/next/no-img-element': 'warn',
        '@next/next/no-html-link-for-pages': rootDir ? 'error' : 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        ...sharedTsRules,
        ...rules,
      },
      settings: {
        react: { version: 'detect' },
        ...(rootDir ? { next: { rootDir } } : {}),
      },
    },
    prettierConfig,
  ]
}

export default baseConfig
