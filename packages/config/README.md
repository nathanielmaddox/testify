# @testify/config

Shared tooling config for every testify app and package. Modelled on
`vs_code/rank_and_rent` (tsconfig.base.json, eslint.config.mjs, .prettierrc,
packages/style-guide/preset.cjs).

Add it to a workspace package with `"@testify/config": "workspace:*"` in `devDependencies`.

| Export                                 | File                   | Kind                      |
| -------------------------------------- | ---------------------- | ------------------------- |
| `@testify/config/tsconfig/base.json`   | `tsconfig/base.json`   | strict TS base            |
| `@testify/config/tsconfig/nextjs.json` | `tsconfig/nextjs.json` | extends base, Next.js app |
| `@testify/config/eslint`               | `eslint.mjs`           | ESM, flat config          |
| `@testify/config/tailwind-preset`      | `tailwind-preset.cjs`  | CJS, Tailwind v3 preset   |
| `@testify/config/prettier`             | `prettier.json`        | Prettier options          |

## TypeScript

`base.json` is strict: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
`noPropertyAccessFromIndexSignature`, `noUnusedLocals/Parameters`, `noImplicitReturns`,
bundler resolution, `noEmit`. `nextjs.json` adds `jsx: preserve`, the `next` plugin, DOM libs,
`allowJs`, `noEmit`, `incremental`.

Neither sets `include`, `exclude` or `paths`; those resolve relative to the file that
declares them, so each app sets its own:

```json
{
  "extends": "@testify/config/tsconfig/nextjs.json",
  "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./*"] } },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next", "out", "dist"]
}
```

## ESLint (flat config, ESLint 9)

```js
// apps/<next-app>/eslint.config.mjs
import { nextConfig } from '@testify/config/eslint'
export default nextConfig()
// options: nextConfig({ ignores: ['scripts/**'], rootDir: import.meta.dirname, rules: { ... } })
```

```js
// packages/<lib>/eslint.config.mjs
import baseConfig from '@testify/config/eslint'
export default baseConfig
```

- `nextConfig()`: TS recommended, `@next/next` recommended + core-web-vitals, React Hooks
  (`rules-of-hooks` error, `exhaustive-deps` warn), `no-img-element` warn, `no-explicit-any`
  error, unused vars error (`_` prefix ignored), the no-emoji house rule, then
  `eslint-config-prettier` last. `no-html-link-for-pages` is off unless `rootDir` is passed.
- `baseConfig` (default export): the same minus Next/React.
- Also exported: `defaultIgnores`.

The plugins are dependencies of this package; the consumer only needs `eslint` (and
`typescript`) installed.

## Tailwind preset (v3)

Wraps `@otesse/design-system/tailwind` (theme + `darkMode: 'class'`), so DS components get
the CSS-variable colors (`primary`, `secondary`, `accent`, `muted`, `card`, `popover`,
`border`, `input`, `ring`, `success`, `warning`, `error`, `destructive`, `info`,
`brand.*`), type scale (`text-display/h1/h2/normal/body/small/tiny/micro`), spacing
(`xs`..`3xl`), shadows, radii, z-index layers and keyframes.

```js
// apps/<app>/tailwind.config.js
const preset = require('@testify/config/tailwind-preset')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    preset.dsContent(__dirname), // DS dist, resolved through pnpm symlinks
    // or the literal: preset.DS_CONTENT_GLOB
    //   './node_modules/@otesse/design-system/dist/**/*.{js,mjs}'
  ],
}
```

- Tailwind v3 does not inherit `content` from presets, so the DS glob must be in the app.
- The DS is resolved from the app's cwd first, so the app must depend on
  `@otesse/design-system` itself. If it cannot be resolved the preset still loads and
  prints one warning (silence with `TESTIFY_SILENCE_DS_WARNING=1`); `preset.hasDesignSystem`
  tells you which happened.
- The colors are `rgb(var(--color-*) / <alpha-value>)`, so the CSS variables must exist at
  runtime. Import the DS stylesheet once in the root layout:
  `import '@otesse/design-system/styles'` (it carries `@tailwind base/components/utilities`
  plus the `:root` and `.dark` variable sets). Brand overrides go in the app's own CSS after it.

## Prettier

```json
// package.json
{ "prettier": "@testify/config/prettier" }
```

`semi: false`, `singleQuote: true`, `trailingComma: es5`, `printWidth: 100`, `tabWidth: 2`,
`endOfLine: lf`.
