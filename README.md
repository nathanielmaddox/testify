# testify

The Testify public website and its internal admin app, in one pnpm monorepo. Every UI
component comes from `@otesse/design-system`. The Testify look lives in `packages/style-guide`.

## Fork and run

1. Clone the repo and open the root folder.
2. Use Node 22 (see `.nvmrc`) and enable pnpm 10.11.0 (pinned in `packageManager`):

   ```sh
   corepack enable
   ```

3. Install dependencies from the root. This needs design system access (see below):

   ```sh
   pnpm install --config.confirmModulesPurge=false
   ```

4. Copy the environment template. Every variable is documented in it, and every outside
   service stays off until its key is set:

   ```sh
   cp apps/website/.env.example apps/website/.env.local
   ```

5. Start the website and the admin app:

   ```sh
   pnpm dev          # website on http://localhost:3200
   pnpm dev:admin    # admin on http://localhost:3201
   ```

The page map is [`apps/website/PAGES.md`](./apps/website/PAGES.md): routes, sections,
placeholder copy, and tracking events. The providers are in
[`apps/website/INTEGRATIONS.md`](./apps/website/INTEGRATIONS.md).

> **Design system access.** `@otesse/design-system` is a private GitHub dependency. This repo
> is public, but its design system repo, `nathanielmaddox/storybook`, is not. You need one of:
>
> - Read access to `nathanielmaddox/storybook`, so the git pin resolves.
> - The vendored tarball. Put `vendor/otesse-design-system-0.1.0-e7d37602.tgz` in `vendor/`,
>   then run `node ../../scripts/vercel/install.mjs` from `apps/website` in place of step 3.
>   That script writes a `pnpm.overrides` entry into the root `package.json` and may change
>   `pnpm-lock.yaml`. Do not commit either change.
>
> Without one of these, the install fails. The tarball is not in `vendor/` and is not in this
> repo. Making it available to forks is an open item.

## Layout

```
testify/
├── apps/
│   ├── admin/                @testify/admin        internal admin, port 3201, noindex
│   └── website/              @testify/website      marketing site, port 3200
├── packages/
│   ├── config/               @testify/config       tsconfig, eslint, tailwind, prettier
│   └── style-guide/          @testify/style-guide  Testify brand tokens and compositions
├── scripts/                  workspace checks and per-app Vercel install
├── vendor/                   design system tarball for Vercel builds (empty in a clone)
└── CLAUDE.md / AGENTS.md     agent rules, identical copies
```

## Requirements

- Node 22 (`.nvmrc`) and pnpm 10.11.0 through corepack (`corepack enable`).
- Design system access (see **Design system access** above).

## Commands

```sh
pnpm install --config.confirmModulesPurge=false
pnpm dev              # website on http://localhost:3200
pnpm dev:admin        # admin on http://localhost:3201
pnpm build            # build every workspace member
pnpm lint             # eslint in every member
pnpm type-check       # tsc --noEmit in every member
pnpm format           # prettier --write
pnpm check:workspace  # workspace invariants
pnpm preflight        # check:workspace + lint + type-check
```

Single app: `pnpm --filter @testify/website <script>`.

## Design system

All UI comes from `@otesse/design-system`, developed in `vs_code/otesse_ds` and consumed as a
pinned GitHub ref:

```
"@otesse/design-system": "github:nathanielmaddox/storybook#e7d37602c89615c3403f8a68a27b56675bb6902f"
```

The pin appears in `apps/website`, `apps/admin`, `packages/config`, and `packages/style-guide`.

- **Pin rule.** Every manifest uses the same full 40-character sha. `pnpm check:workspace`
  fails on a mismatch or a short pin.
- **Never edit the design system from this repo.** Changes to it belong in its own repo. This
  is an owner rule, set 2026-10-09.
- **Testify styling goes in `packages/style-guide`.** Add brand tokens, new brand-named Tailwind
  keys, and brand compositions there. Never redefine a design system Tailwind key. Run
  `pnpm --filter @testify/style-guide check:keys` to catch overlaps. Do not hand-roll buttons,
  inputs, cards, dialogs, navigation, or icons.

### Bumping the pin

1. Land the change in `otesse_ds`, push it to `nathanielmaddox/storybook`, and note the full sha.
2. Replace the sha in all four manifests, run `pnpm check:workspace`, then install and run
   `pnpm preflight`.
3. Re-pack the vendored tarball as `vendor/otesse-design-system-0.1.0-<first 8 of sha>.tgz` and
   delete the old one. The steps are in `scripts/vercel/README.md`. Without it, Vercel installs
   fail.

## Working on it

- **Lanes.** Each app has an `<app>_migrate` branch. `testify_migrate` holds root tooling and
  `packages/`. Lanes merge into `staging` by pull request. `main` moves only from `staging`,
  and only to deploy. After `staging` moves, merge it into every lane.
- **Commits and worktrees.** Use conventional messages (`feat:`, `fix:`, `chore:`). Isolate work
  in a git worktree, and never commit into a checkout someone else is editing.
- **Before a PR.** Run `pnpm preflight`. The pre-push hook runs `check:workspace` and
  `type-check` from the root and needs `node_modules` in the checkout you push from, so run the
  install in every new checkout or worktree.

Agent and contributor rules are in [`CLAUDE.md`](./CLAUDE.md).

## Deploying

Never from the root. Each app deploys from its own folder: see `DO-NOT-DEPLOY-FROM-HERE.md` and
`scripts/vercel/README.md`.
