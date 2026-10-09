# @testify/website — agent instructions

`AGENTS.md` is a byte-identical copy of this file. Edit `CLAUDE.md`, then `cp CLAUDE.md AGENTS.md`.
The root `CLAUDE.md` rules apply here too; read it first.

## What this app is

The testify public website (Next.js App Router, React 19, Tailwind v3). Skeleton only for now:
every page is a `<main>` of empty, labelled section slots; content comes later. Dev port **3200**
(`pnpm --filter @testify/website dev`, or `pnpm dev` from the root).

## Rules

1. **All UI comes from `@otesse/design-system`** (`vs_code/otesse_ds`, pinned by full sha in
   `package.json`). No hand-rolled buttons, inputs, cards, nav, footers or icons. Never edit
   or file changes against `otesse_ds`. A look or composition the DS lacks lives in
   `@testify/style-guide` (brand tokens, brand-prefixed Tailwind keys, brand compositions).
2. **DS imports only in `'use client'` files.** A server component importing the DS barrel 500s
   the page (optional peers). Wrap DS usage in a client module under `components/`.
3. **Styles:** `app/layout.tsx` imports `@otesse/design-system/styles` (it carries the Tailwind
   layers and DS CSS variables) before `app/globals.css`. Do not add `@tailwind` directives or
   `@layer` to `globals.css`.
4. **Config is shared:** tsconfig, eslint and the Tailwind preset come from `@testify/config`.
   Change them in `packages/config`, not here. Keep both DS dist globs in `tailwind.config.js`.
5. **Site data** (name, URL, routes registry, indexable flag) lives in `lib/site.config.ts`.
   Add a route there when you add a page; nav, footer, metadata and sitemap all derive from it.
6. **Indexing:** robots disallows everything until `NEXT_PUBLIC_SITE_INDEXABLE=true`, and every
   `*.vercel.app` host gets `X-Robots-Tag: noindex` from `next.config.js`.
7. **Deploy** from `apps/website` only, remote Vercel build; `vercel.json` installs via
   `node ../../scripts/vercel/install.mjs`. Never deploy from the monorepo root.

## Routes and funnel

Two route groups give the funnel its own chrome. The root `app/layout.tsx` holds only html, body
and providers; each group layout draws its header and footer, and each page draws its own `<main
id="main-content">` via `components/skeleton/page_skeleton.tsx`.

| Group        | Routes                                          | Chrome                                                                |
| ------------ | ----------------------------------------------- | --------------------------------------------------------------------- |
| `app/(site)` | `/`, `/about`, `/contact`, `/privacy`, `/terms` | `SiteHeader` (nav + CTA to `/lp`), `SiteFooter` (nav + legal)         |
| `app/(lp)`   | `/lp`, `/lp/confirmation`                       | `LpHeader` (name only, no links), `LpFooter` (legal + copyright only) |

- **Registry:** `routes` in `lib/site.config.ts` is the single list (`key`, `path`, `title`,
  `pageType` `site|lp|conversion|legal`, `indexable`, `inSitemap`, `inNav`, `funnelStep`). Header
  and footer links, `lib/metadata.ts` (`pageMetadata(key)`: title, canonical, robots) and
  `app/sitemap.ts` are generated from it. Pages export `metadata = pageMetadata('<key>')`.
- **Indexing:** a route is indexed only when `NEXT_PUBLIC_SITE_INDEXABLE=true` AND its own
  `indexable` is true. `/lp` is noindex by default (`LP_INDEXABLE` in the registry).
- **`/lp/confirmation` is the conversion page** (page type and funnel step both `conversion`):
  where the LP form/checkout lands after a successful submit. It is always noindex and never in
  the sitemap, enforced in code, not only by its flags.
- **Tracking:** `lib/tracking.ts` holds the event names (`page_view`, `lp_view`, `lead_submit`,
  `purchase_complete`), a no-op `track()` the provider is wired behind later, and
  `pageTrackingAttrs(key)`, which puts `data-page-key`, `data-page-type` and `data-funnel-step` on
  every `<main>`. Anything the LP links onward to goes through
  `withAttribution(href, searchParams)` so UTM and click-id params survive to the conversion page.
- Never add site nav links to the `(lp)` chrome: paid visitors must not be sent away.
