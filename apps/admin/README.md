# @testify/admin

The testify internal admin app. Next.js (App Router) + React 19 + Tailwind v3, with every UI
component from [`@otesse/design-system`](../../../otesse_ds). Structure only for now: an admin shell,
a dashboard placeholder, a settings placeholder and a 404. **Auth and data are not built yet.** No
admin route may ship publicly without auth.

## Run

```bash
# from the monorepo root
pnpm install --config.confirmModulesPurge=false
pnpm dev:admin                          # http://localhost:3201
pnpm --filter @testify/admin dev        # same thing, via the filter
```

| Script       | What                       |
| ------------ | -------------------------- |
| `dev`        | `next dev -p 3201`         |
| `build`      | `next build`               |
| `start`      | `next start -p 3201`       |
| `lint`       | ESLint (`@testify/config`) |
| `type-check` | `tsc --noEmit`             |

Copy `.env.example` to `.env.local` for local overrides. The only variable is `NEXT_PUBLIC_SITE_URL`,
the admin origin (default `http://localhost:3201`).

## Structure

```
app/
  layout.tsx          root layout: html, body, providers, DS styles, tokens
  (admin)/
    layout.tsx        draws AdminShell
    page.tsx          dashboard placeholder
    settings/page.tsx settings placeholder
  not-found.tsx       404 (DS EmptyState)
  robots.ts           disallow all
  globals.css         app-level plain CSS (DS styles carry the Tailwind layers)
components/
  providers.tsx       DS ThemeProvider
  admin/              admin shell, nav, not-found panel (DS Layout, Navbar, EmptyState)
  skeleton/           page skeleton (server-safe main + labelled section slots)
lib/
  admin.config.ts     name, URL, typed routes registry, navItems
  metadata.ts         rootMetadata(), pageMetadata(key), both noindex
public/
  icon.svg
```

## Indexing

Always noindex, on every host. `robots.ts` disallows all, `next.config.js` sends
`X-Robots-Tag: noindex, nofollow` on every response, and `lib/metadata.ts` sets robots `index: false`.
There is no sitemap, no JSON-LD, no analytics and no attribution.

## Rules

See [`CLAUDE.md`](./CLAUDE.md) and [`components/README.md`](./components/README.md). In short:
compose DS components, never hand-roll UI, and import the DS only from `'use client'` files.

## Deploy

Not yet. The Vercel project is not created. When it is, the project is rooted at `apps/admin`, the
install runs `node ../../scripts/vercel/install.mjs`, and the build is remote only. Never deploy from
the monorepo root (see `DO-NOT-DEPLOY-FROM-HERE.md`).
