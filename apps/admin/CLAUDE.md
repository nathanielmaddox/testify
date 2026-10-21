# @testify/admin — agent instructions

`AGENTS.md` is a byte-identical copy of this file. Edit `CLAUDE.md`, then `cp CLAUDE.md AGENTS.md`.
The root `CLAUDE.md` rules apply here too; read it first.

## What this app is

The testify internal admin app (Next.js App Router, React 19, Tailwind v3). Structure only for now:
a dashboard placeholder and a settings placeholder inside an admin shell. **Auth and data are not
built yet.** Dev port **3201** (`pnpm --filter @testify/admin dev`, or `pnpm dev:admin` from the root).

**No admin route may ship publicly without auth.** Until auth lands, every route stays on local
dev or a private, non-public deployment, and nothing links to it from a public surface.

## Rules

1. **All UI comes from `@otesse/design-system`** (`vs_code/otesse_ds`, pinned by full sha in
   `package.json`) and the brand layer `@testify/style-guide`. No hand-rolled buttons, inputs,
   tables, cards, nav, dialogs or icons. Never edit `otesse_ds` (owner ruling 2026-10-09): a missing
   look is a token or a brand composition in `packages/style-guide`.
2. **DS imports only in `'use client'` files.** A server component importing the DS barrel 500s
   the page (optional peers). Wrap DS usage in a client module under `components/`.
3. **Styles:** `app/layout.tsx` imports `@otesse/design-system/styles` (Tailwind layers + DS
   defaults), then `@testify/style-guide/tokens.css` (brand tokens), then `app/globals.css`, and
   puts `fontVariables` from `@testify/style-guide/fonts` on `<html>`. Do not add `@tailwind`
   directives or `@layer` to `globals.css`. Never pass `className`/`styles` to a DS component to
   get the brand look; theme it through tokens.
4. **Config is shared:** tsconfig, eslint and the Tailwind preset come from `@testify/config`,
   the brand preset from `@testify/style-guide/preset`. Change them in `packages/`, not here. Keep
   both DS dist globs and the style-guide glob in `tailwind.config.js`.
5. **Admin config** (name, URL, `routes`, `navItems`) lives in `lib/admin.config.ts`. Add a route
   there when you add a page. `routes` is the single list: `key`, `path`, `title`, `description`,
   `inNav`. The shell nav is built from `navItems`. Pages export `metadata = pageMetadata('<key>')`
   from `lib/metadata.ts`.
6. **Env** is read with dot access (`process.env.NEXT_PUBLIC_X`, typed in `lib/env.d.ts`) so Next
   inlines it into client bundles. The only variable is `NEXT_PUBLIC_SITE_URL` (the admin origin,
   default `http://localhost:3201`). Document every new var in `.env.example`.
7. **Indexing: always noindex.** `app/robots.ts` disallows all, `next.config.js` sends
   `X-Robots-Tag: noindex, nofollow` on every response, and `lib/metadata.ts` sets robots
   `index: false`. There is no sitemap, no JSON-LD, no analytics and no attribution. Do not add any
   of them, and do not loosen these three guards.
8. **Deploy** from `apps/admin` only, remote Vercel build; `vercel.json` installs via
   `node ../../scripts/vercel/install.mjs`. The Vercel project is not created yet. Never deploy
   from the monorepo root.

## Structure

The root `app/layout.tsx` holds only html, body and providers. `app/(admin)/layout.tsx` draws the
`AdminShell` (`components/admin/admin_shell.tsx`), built from `navItems`. Each page renders inside it.

| Path                            | Role                                                   |
| ------------------------------- | ------------------------------------------------------ |
| `app/layout.tsx`                | html, body, providers, DS styles, tokens, globals      |
| `app/(admin)/layout.tsx`        | Draws `AdminShell`                                     |
| `app/(admin)/page.tsx`          | Dashboard placeholder                                  |
| `app/(admin)/settings/page.tsx` | Settings placeholder                                   |
| `app/not-found.tsx`             | 404 panel                                              |
| `app/robots.ts`                 | Disallow all                                           |
| `lib/admin.config.ts`           | Name, URL, `routes` registry, `navItems`               |
| `lib/metadata.ts`               | `rootMetadata()` and `pageMetadata(key)`, both noindex |

## Routes

| Key         | Path        | Title     | In nav | Auth     |
| ----------- | ----------- | --------- | ------ | -------- |
| `dashboard` | `/`         | Dashboard | yes    | none yet |
| `settings`  | `/settings` | Settings  | yes    | none yet |

Both routes are placeholders. Auth must land before any real data or action is added here.
