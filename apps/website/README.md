# @testify/website

The testify public website. Next.js (App Router) + React 19 + Tailwind v3, with every UI
component from [`@otesse/design-system`](../../../otesse_ds). Pages follow the Paper hi-fi frames:
the home, work and case-study pages, about, contact, the get-started flow, paid landing pages with
their checkout and confirmation pages, and the legal pages. Copy placeholders (`[CONFIRM]`, `[N]`,
`[NAME]`, `[ANSWER]`) stay visible until the owner supplies the real text.

The page map (every route, section, placeholder and tracking event) is in [`PAGES.md`](./PAGES.md).

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
| `lint:fix`   | ESLint with `--fix`        |
| `type-check` | `tsc --noEmit`             |

Copy `.env.example` to `.env.local` for local overrides. Every variable is documented there.

Integrations: see [INTEGRATIONS.md](INTEGRATIONS.md). Every outside service is off until its switch is set.

## Structure

```
app/
  layout.tsx            root layout: html, body, providers, site JSON-LD, DS and brand styles
  globals.css           app-level plain CSS (DS styles carry the Tailwind layers)
  robots.ts             disallow-all until NEXT_PUBLIC_SITE_INDEXABLE=true
  sitemap.ts            built from the routes registry and the LP and work registries
  not-found.tsx         404
  design/page.tsx       throwaway noindex brand specimen (404 when indexable)
  api/checkout/         POST: Stripe Checkout Session (503 until keys are set)
  (site)/               home, work, work/[slug], about, contact, privacy, terms
  (flow)/get-started/   steps 1 to 4 and the booked page (FlowHeader, FlowFooter)
  (lp)/                 lp/[slug], lp/[slug]/checkout, lp/[slug]/confirmation,
                        and 307 redirects for /lp and /lp/confirmation (LpHeader, LpFooter)
components/
  providers.tsx         DS ThemeProvider, route tracking, analytics scripts
  site/                 site and LP headers and footers, shared section pieces
  skeleton/             page_skeleton.tsx: the <main> and its section slots
  home/                 home page sections
  about/                about page sections
  contact/              contact page sections
  work/                 work listing, case-study sections, trade filter, story cards
  get_started/          flow steps, booking step, booked summary, flow state hook
  legal/                legal page layout
  lp/                   LP layouts, sections, checkout and confirmation, trackers, sticky buy bar
  design/               specimen components for /design
lib/
  site.config.ts        routes registry, nav, CTA, offer, organization, site settings
  landing_pages.ts      landing page registry (one entry per ad)
  work.ts               client story registry and consent rule
  get_started.ts        flow steps, options, validation, sessionStorage contract
  legal.ts              privacy and terms outlines (placeholder bodies)
  checkout.ts           checkout contract shared by client and API
  checkout_server.ts    server only: Stripe session params and price ids
  conversion.ts         confirmation page contract (session_id or lead token)
  tracking.ts           event names, EVENT_MAP, page attributes, track()
  analytics.config.ts   provider ids from env (off until set)
  attribution.ts        UTM and click ids, first and last touch
  metadata.ts           metadata builders and indexing rules
  structured_data.ts    Organization, WebSite, Service, BreadcrumbList JSON-LD
  env.d.ts              typed env vars
public/
  icon.svg
```

## Rules

See [`CLAUDE.md`](./CLAUDE.md) and [`components/README.md`](./components/README.md). In short:
compose DS components, never hand-roll UI, and import the DS only from `'use client'` files.

## Deploy

Vercel project rooted at `apps/website`; install runs `node ../../scripts/vercel/install.mjs`.
Remote build only, never from the monorepo root.
