# testify — agent instructions (READ FIRST, every session, every tool)

`AGENTS.md` is a byte-identical copy of this file for tools that read that name (`pnpm check:agents-md`
and the pre-commit hook enforce it). Edit `CLAUDE.md`, then `cp CLAUDE.md AGENTS.md` and stage both. If you
learn a rule while working here, add it HERE in the same commit, never only in a personal memory.

## Layout

| Path              | Package            | Role                                                                        |
| ----------------- | ------------------ | --------------------------------------------------------------------------- |
| `apps/website`    | `@testify/website` | Next.js marketing site. Dev port 3200.                                      |
| `packages/config` | `@testify/config`  | The ONLY home of shared tsconfig, eslint, tailwind preset, prettier.        |
| `scripts/`        | (root)             | Workspace checks and `scripts/vercel/install.mjs` (per-app Vercel install). |
| `vendor/`         | (root)             | Prebuilt design-system tarball for Vercel builds only.                      |

## Rules

1. **New apps** go in `apps/<name>` with package name `@testify/<name>`, `"private": true`, and a unique
   dev port (`next dev -p <port>`; ports from 3200 up). New shared packages go in `packages/<name>` as
   `@testify/<name>`. `pnpm check:workspace` enforces names, privacy, unique ports and one DS pin.
2. **Shared config lives only in `packages/config`.** Apps and packages extend
   `@testify/config/tsconfig/{base,nextjs}.json`, `@testify/config/eslint`, `@testify/config/tailwind-preset`
   and `@testify/config/prettier`. Never copy rules into an app; change them in `packages/config`.
3. **All UI comes from `@otesse/design-system`** (source `vs_code/otesse_ds`, pinned as
   `github:nathanielmaddox/storybook#<full sha>`). Every manifest that depends on it uses the same pin.
   No hand-rolled primitives (buttons, inputs, cards, dialogs, tables, nav, icons). **Never edit
   `otesse_ds` and never file changes against it from this repo** (owner ruling 2026-10-09). The Testify
   look lives in `packages/style-guide` (`@testify/style-guide`): role tokens mapped onto the DS CSS
   variables, NEW brand-named Tailwind keys (never redefine DS keys such as `rounded-lg`, `text-display`,
   `shadow-sm`), and brand compositions built from DS primitives (section wrapper, calendar, proof row,
   emphasis panel...). Apps import from those two packages only; they never style DS components inline.
4. **No emojis** in UI source or copy. Use DS icons.
5. **Never deploy from the root.** Each app deploys from its own folder (`DO-NOT-DEPLOY-FROM-HERE.md`,
   `scripts/vercel/README.md`). Remote Vercel build only. Delete any root `.vercel/` that holds more than
   `repo.json`.
6. **Git:** follow the lanes in "Branches and worktrees" below. Never commit to `main` or a `_staging`
   branch directly. Conventional commits (`feat:`, `fix:`, `chore:` ...), enforced by commitlint. Do not
   commit into a checkout another agent is editing; isolate work in a worktree. Author must be
   `cocoking <hello@otesse.com>` (set repo-local; Vercel blocks any other author).
7. **Installs:** `pnpm install --config.confirmModulesPurge=false` from the root. Never npm or yarn.
   Never commit `.env*` files except `.env.example`.

## Branches and worktrees

Same model as `vs_code/itibg`. Every app owns a branch pair named after its folder, plus one
repo-wide pair for work that belongs to no single app. The lanes never merge into each other; they
meet only on `main`.

```
website_migrate ---> website_staging ---+--> main ---> cd apps/<app> && remote Vercel build
testify_migrate ---> testify_staging ---+
```

| Branch            | What it is                                                        |
| ----------------- | ----------------------------------------------------------------- |
| `<app>_migrate`   | Daily work for that app. Named after the app folder               |
| `<app>_staging`   | That app's review branch. **Never deployed**                      |
| `testify_migrate` | Root toolchain, `packages/` (config, style-guide), cross-app work |
| `testify_staging` | Review branch for the same                                        |
| `main`            | Production. The only branch anything deploys from                 |

- A new app gets **both** `<app>_migrate` and `<app>_staging`, matching its folder name.
- Daily work happens in `_migrate`. When it feels real, merge it into its `_staging`.
- `_staging` is a quarantine for review, not a deploy target.
- Ship by merging `_staging` -> `main` through a pull request; `pre-push` refuses a push to `main`.
- **Never merge one lane into another.** Never auto-promote: both steps wait for a decision.
- After a promotion, bring every lane back up to `main` (`git merge main`) so shared root files and
  `packages/` do not drift.

**Worktrees:** the root checkout (`vs_code/testify`) sits on `testify_migrate`. Each app lane has a
worktree at `agent_workspace/<app>_migrate` (git-ignored); run `pnpm install
--config.confirmModulesPurge=false` inside a fresh one. Review or release checkouts
(`_staging`, `main`) are created as worktrees under `agent_workspace/` when needed and removed after.
Never leave the only copy of anything (a backup, an export) inside a worktree.

## Commands (from the root)

| Command                | What                                                    |
| ---------------------- | ------------------------------------------------------- |
| `pnpm dev`             | Website dev server (port 3200)                          |
| `pnpm build`           | Build every workspace member                            |
| `pnpm lint`            | ESLint in every member                                  |
| `pnpm type-check`      | `tsc --noEmit` in every member                          |
| `pnpm format`          | Prettier write                                          |
| `pnpm check:workspace` | Workspace invariants + AGENTS.md == CLAUDE.md           |
| `pnpm preflight`       | check:workspace + lint + type-check (run before any PR) |
