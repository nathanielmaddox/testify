# testify

A pnpm monorepo for the testify web properties. Today it holds one Next.js app (`apps/website`) and one
shared config package (`packages/config`). Every UI component comes from the Otesse design system.

Agent and contributor rules: [`CLAUDE.md`](./CLAUDE.md) (mirrored byte-for-byte in `AGENTS.md`).

## Layout

```
testify/
├── apps/
│   └── website/            @testify/website  Next.js site, dev port 3200
├── packages/
│   └── config/             @testify/config   tsconfig, eslint, tailwind preset, prettier
├── scripts/
│   ├── check-workspace.mjs workspace invariants (names, ports, single DS pin)
│   ├── check-agents-md.mjs AGENTS.md must equal CLAUDE.md
│   └── vercel/             per-app Vercel install + deploy notes
├── vendor/                 prebuilt design-system tarball (Vercel builds only)
├── .husky/                 pre-commit (lint-staged), commit-msg (commitlint), pre-push (no main, checks)
├── CLAUDE.md / AGENTS.md   agent rules
└── DO-NOT-DEPLOY-FROM-HERE.md
```

## Requirements

Node 22 (`.nvmrc`), pnpm 10.11.0 (`packageManager`; `corepack enable`).

## Commands

```sh
pnpm install --config.confirmModulesPurge=false
pnpm dev              # website on http://localhost:3200
pnpm build            # build every workspace member
pnpm lint             # eslint in every member
pnpm type-check       # tsc --noEmit in every member
pnpm format           # prettier --write
pnpm check:workspace  # workspace invariants
pnpm preflight        # check:workspace + lint + type-check
```

Single app: `pnpm --filter @testify/website <script>`.

## Design system

All UI comes from `@otesse/design-system`, developed at `vs_code/otesse_ds` and consumed as a pinned
GitHub ref:

```
"@otesse/design-system": "github:nathanielmaddox/storybook#e7d37602c89615c3403f8a68a27b56675bb6902f"
```

No hand-rolled primitives. If a component is missing, add it to `otesse_ds` first.

The DS builds its `dist/` in a `prepare` script on install, which is why it is listed under
`onlyBuiltDependencies` in `pnpm-workspace.yaml` and `.npmrc` enables pre/post scripts.

### Bumping the pin

1. Land the change in `otesse_ds` and push it to `nathanielmaddox/storybook`; note the full commit sha.
2. Replace the sha in **every** manifest that depends on `@otesse/design-system` (`pnpm check:workspace`
   fails if two pins differ or a pin is not a full 40-char sha).
3. `pnpm install --config.confirmModulesPurge=false`, then `pnpm preflight` and check the site in the
   browser.
4. Re-pack the Vercel tarball into `vendor/otesse-design-system-0.1.0-<first 8 of sha>.tgz` and delete
   the old one (steps in `scripts/vercel/README.md`). Without it, Vercel installs fail.

## Deploying

Never from the root. Each app deploys from its own folder: see `DO-NOT-DEPLOY-FROM-HERE.md` and
`scripts/vercel/README.md`.
