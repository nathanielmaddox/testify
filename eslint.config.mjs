// Root lint config: the shared base from packages/config plus repo-wide ignores.
// Apps carry their own eslint.config.mjs (Next.js rules); this one covers root files and scripts/.
import * as shared from '@testify/config/eslint'

const baseConfig = shared.baseConfig ?? shared.default

export default [
  {
    ignores: [
      '**/node_modules/**',
      'apps/*/.next/**',
      '**/.next/**',
      '**/out/**',
      '**/dist/**',
      '**/.turbo/**',
      '**/storybook-static/**',
      '**/convex/_generated/**',
      '**/next-env.d.ts',
      'vendor/**',
    ],
  },
  ...(Array.isArray(baseConfig) ? baseConfig : [baseConfig]),
]
