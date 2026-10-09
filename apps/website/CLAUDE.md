# @testify/website — agent instructions

`AGENTS.md` is a byte-identical copy of this file. Edit `CLAUDE.md`, then `cp CLAUDE.md AGENTS.md`.
The root `CLAUDE.md` rules apply here too; read it first.

## What this app is

The testify public website (Next.js App Router, React 19, Tailwind v3). Structure only for now:
the home page is a placeholder and no other pages exist yet. Dev port **3200**
(`pnpm --filter @testify/website dev`, or `pnpm dev` from the root).

## Rules

1. **All UI comes from `@otesse/design-system`** (`vs_code/otesse_ds`, pinned by full sha in
   `package.json`). No hand-rolled buttons, inputs, cards, nav, footers or icons. Missing
   something? Add it to the DS, bump the pin everywhere, re-pack the vendored tarball.
2. **DS imports only in `'use client'` files.** A server component importing the DS barrel 500s
   the page (optional peers). Wrap DS usage in a client module under `components/`.
3. **Styles:** `app/layout.tsx` imports `@otesse/design-system/styles` (it carries the Tailwind
   layers and DS CSS variables) before `app/globals.css`. Do not add `@tailwind` directives or
   `@layer` to `globals.css`.
4. **Config is shared:** tsconfig, eslint and the Tailwind preset come from `@testify/config`.
   Change them in `packages/config`, not here. Keep both DS dist globs in `tailwind.config.js`.
5. **Site data** (name, URL, nav, CTA, footer, routes, indexable flag) lives in
   `lib/site.config.ts`. Add a route there when you add a page so the sitemap picks it up.
6. **Indexing:** robots disallows everything until `NEXT_PUBLIC_SITE_INDEXABLE=true`, and every
   `*.vercel.app` host gets `X-Robots-Tag: noindex` from `next.config.js`.
7. **Deploy** from `apps/website` only, remote Vercel build; `vercel.json` installs via
   `node ../../scripts/vercel/install.mjs`. Never deploy from the monorepo root.
