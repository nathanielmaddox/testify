# @testify/website

The testify public website. Next.js (App Router) + React 19 + Tailwind v3, with every UI
component from [`@otesse/design-system`](../../../otesse_ds). Structure only for now: a
placeholder home page, 404, robots and sitemap.

## Run

```bash
# from the monorepo root
pnpm install --config.confirmModulesPurge=false
pnpm --filter @testify/website dev     # http://localhost:3200
```

| Script       | What                       |
| ------------ | -------------------------- |
| `dev`        | `next dev -p 3200`         |
| `build`      | `next build`               |
| `start`      | `next start -p 3200`       |
| `lint`       | ESLint (`@testify/config`) |
| `type-check` | `tsc --noEmit`             |

Copy `.env.example` to `.env.local` for local overrides.

## Structure

```
app/
  layout.tsx        root layout: DS styles, metadata, header/footer shell
  page.tsx          placeholder home (DS components only)
  not-found.tsx     404 (DS EmptyState)
  robots.ts         disallow-all until NEXT_PUBLIC_SITE_INDEXABLE=true
  sitemap.ts        built from siteConfig.routes
  globals.css       app-level plain CSS (DS styles carry the Tailwind layers)
components/
  providers.tsx     DS ThemeProvider
  site/             header, footer, 404 panel (DS Navbar, Footer, EmptyState)
  home/             home placeholder (DS Hero, Layout, Card)
lib/
  site.config.ts    name, url, nav, CTA, footer, routes (placeholders)
public/
```

## Rules

See [`CLAUDE.md`](./CLAUDE.md) and [`components/README.md`](./components/README.md). In short:
compose DS components, never hand-roll UI, and import the DS only from `'use client'` files.

## Deploy

Vercel project rooted at `apps/website`; install runs `node ../../scripts/vercel/install.mjs`.
Remote build only, never from the monorepo root.
