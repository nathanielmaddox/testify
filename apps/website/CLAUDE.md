# @testify/website — agent instructions

`AGENTS.md` is a byte-identical copy of this file. Edit `CLAUDE.md`, then `cp CLAUDE.md AGENTS.md`.
The root `CLAUDE.md` rules apply here too; read it first.

## What this app is

The testify public website (Next.js App Router, React 19, Tailwind v3). Skeleton only for now:
every page is a `<main>` of empty, labelled section slots; content comes later. Dev port **3200**
(`pnpm --filter @testify/website dev`, or `pnpm dev` from the root).

## Rules

1. **All UI comes from `@otesse/design-system`** (`vs_code/otesse_ds`, pinned by full sha in
   `package.json`) and the brand layer `@testify/style-guide`. No hand-rolled buttons, inputs,
   cards, nav, footers or icons. Never edit `otesse_ds` (owner ruling 2026-10-09): a missing
   look is a token or a brand composition in `packages/style-guide`.
2. **DS imports only in `'use client'` files.** A server component importing the DS barrel 500s
   the page (optional peers). Wrap DS usage in a client module under `components/`.
3. **Styles:** `app/layout.tsx` imports `@otesse/design-system/styles` (Tailwind layers + DS
   defaults), then `@testify/style-guide/tokens.css` (brand tokens), then `app/globals.css`, and
   puts `fontVariables` from `@testify/style-guide/fonts` on `<html>`. Do not add `@tailwind`
   directives or `@layer` to `globals.css`. Never pass `className`/`styles` to a DS component to
   get the brand look; theme it through tokens.
4. **Config is shared:** tsconfig, eslint and the Tailwind preset come from `@testify/config`,
   the brand preset from `@testify/style-guide/preset` (listed after it). Change them in
   `packages/`, not here. Keep both DS dist globs and the style-guide glob in `tailwind.config.js`.
5. **`/design`** is a throwaway, noindex specimen of the brand layer: not in the sitemap, not in
   the nav. Delete it when the real pages exist.
6. **Site data** (name, URL, nav, CTA, footer, routes, indexable flag, offer, organization,
   share image) lives in `lib/site.config.ts`. Add a route there when you add a page so the
   sitemap picks it up. Env is read with dot access (`process.env.NEXT_PUBLIC_X`, typed in
   `lib/env.d.ts`) so Next inlines it into client bundles; document every new var in
   `.env.example`.
7. **Indexing:** robots disallows everything and `sitemap.xml` is empty until
   `NEXT_PUBLIC_SITE_INDEXABLE=true`, and every `*.vercel.app` host gets `X-Robots-Tag: noindex`
   from `next.config.js`. With the flag on, the build throws unless `NEXT_PUBLIC_SITE_URL` is the
   real origin (not missing, localhost or `*.vercel.app`).
8. **Deploy** from `apps/website` only, remote Vercel build; `vercel.json` installs via
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
  `description`, `updated` (static ISO date for the sitemap), `pageType`
  `site|lp|conversion|legal`, `indexable`, `inSitemap`, `inNav`, `funnelStep`). Header and footer
  links, metadata and `app/sitemap.ts` are generated from it. Pages export
  `metadata = pageMetadata('<key>')`.
- **Metadata** (`lib/metadata.ts`): Next merges metadata shallowly, so `pageMetadata` always
  builds `openGraph`/`twitter` from the shared base (`baseOpenGraph`, `baseTwitter`: type,
  siteName, locale, image slot `siteConfig.shareImage`). The root layout uses `rootMetadata()`,
  which has NO canonical and NO og:url, so a page without `pageMetadata` never claims to be home.
  Canonical is emitted only for indexable routes. Icon: `/icon.svg` in `public/`.
- **Indexing:** a route is indexed only when `NEXT_PUBLIC_SITE_INDEXABLE=true` AND its own
  `indexable` is true. `/lp` is `noindex, follow` by default (`LP_INDEXABLE` in the registry);
  other non-indexable routes are `noindex, nofollow`.
- **`/lp/confirmation` is the conversion page** (page type and funnel step both `conversion`):
  always noindex, never in the sitemap (enforced in code), rendered per request
  (`force-dynamic`) with `Cache-Control: private, no-store`. It renders only for a valid
  conversion id, else redirects to `/lp`: `session_id` (Stripe, via `stripeSuccessUrl()`) or
  `lead` (lead token, via `leadConfirmationHref()`). `verifyConversion(params)` in
  `lib/conversion.ts` decides; today it checks shape only, the real Stripe / lead-store lookup
  goes inside it. Never put PII or UTM params in that URL; `ConversionTracker`
  (`components/lp/`) trims it to the id param.
- **Tracking:** `lib/tracking.ts` holds the event names, `pageTrackingAttrs(key)` (puts
  `data-page-key`, `data-page-type`, `data-funnel-step` on every `<main>`) and `track()`, the
  only analytics call site. `EVENT_MAP` is the one table mapping site events to provider events
  (`page_view` -> GA4 `page_view` / Meta `PageView`; `lp_view` -> `view_item` / `ViewContent`;
  `lead_submit` -> `generate_lead` / `Lead`; `purchase_complete` -> `purchase` / `Purchase`;
  the last two also send a Google Ads conversion when its label is set). Providers are off until
  their env id is set (`lib/analytics.config.ts`, `.env.example`); `initAnalytics()` installs
  the gtag/fbq queues so nothing is lost before the scripts load. `components/providers.tsx`
  loads the scripts, captures attribution once per page load, and sends `page_view` per route
  (plus `lp_view` on the landing step). Conversions fire once per id (localStorage dedupe) with
  the id as Meta `eventID` and GA4/Ads `transaction_id`; value and currency come from
  `siteConfig.offer`.
- **CSP:** third-party hosts live in the `thirdParties` array in `next.config.js`, one entry per
  provider (script, beacon = img + connect, frame, form). Add a provider there, not inline.
- **Attribution** (`lib/attribution.ts`): UTM + click ids (`ATTRIBUTION_PARAMS`, matched
  case-insensitively) are stored on first landing (any route) in a 90-day first-party cookie
  `tfy_attr` plus sessionStorage, as first touch and last touch. `getAttribution()` returns
  them for the lead / Stripe session metadata. Internal links to `/lp` (header and home CTA)
  use `useAttributedHref(href)` (`components/lp/use_attributed_href.ts`) or
  `withStoredAttribution(href)` after mount, never during render.
- **Structured data** (`lib/structured_data.ts`): Organization + WebSite JSON-LD in the root
  layout, Service + Offer on `/` and `/lp`, all from `siteConfig`. Render with
  `<script {...jsonLdScriptProps(data)} />`.
- Never add site nav links to the `(lp)` chrome: paid visitors must not be sent away.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
