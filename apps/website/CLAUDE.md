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

| Group        | Routes                                                                   | Chrome                                                                 |
| ------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `app/(site)` | `/`, `/work`, `/work/<slug>`, `/about`, `/contact`, `/privacy`, `/terms` | `SiteHeader` (nav + CTA to the default LP), `SiteFooter` (nav + legal) |
| `app/(lp)`   | `/lp/<slug>`, `/lp/<slug>/confirmation`                                  | `LpHeader` (name only, no links), `LpFooter` (legal + copyright only)  |

- **Registry:** `routes` in `lib/site.config.ts` is the single list (`key`, `path`, `title`,
  `description`, `updated` (static ISO date for the sitemap), `pageType`
  `site|lp|conversion|legal`, `indexable`, `inSitemap`, `inNav`, `funnelStep`). Header and footer
  links, metadata and `app/sitemap.ts` are generated from it. Pages export
  `metadata = pageMetadata('<key>')`. `lp` and `lpConfirmation` are route TEMPLATES (path
  patterns `/lp/[slug]`, `/lp/[slug]/confirmation`, never linked directly, `inSitemap: false`):
  they hold the shared page type, funnel step and confirmation copy; each LP itself lives in
  `lib/landing_pages.ts` (see "Landing pages" below).
- **Metadata** (`lib/metadata.ts`): Next merges metadata shallowly, so `pageMetadata` always
  builds `openGraph`/`twitter` from the shared base (`baseOpenGraph`, `baseTwitter`: type,
  siteName, locale, image slot `siteConfig.shareImage`). The root layout uses `rootMetadata()`,
  which has NO canonical and NO og:url, so a page without `pageMetadata` never claims to be home.
  Canonical is emitted only for indexable routes. Icon: `/icon.svg` in `public/`.
- **Indexing:** a route is indexed only when `NEXT_PUBLIC_SITE_INDEXABLE=true` AND its own
  `indexable` is true. An LP is indexed only when the launch flag is on AND its registry entry has
  `indexable: true` AND `status: 'live'` (`isLpIndexable`); otherwise it is `noindex, follow`.
  Other non-indexable routes are `noindex, nofollow`.
- **`/lp/<slug>/confirmation` is that LP's conversion page** (page type and funnel step both
  `conversion`): always noindex, never in the sitemap (enforced in code), rendered per request
  (`force-dynamic`) with `Cache-Control: private, no-store` (`next.config.js` source
  `/lp/:slug/confirmation`). Unknown slug is a 404. It renders only for a valid conversion id,
  else redirects to `/lp/<slug>`: `session_id` (Stripe, via `stripeSuccessUrl(slug)`) or
  `lead` (lead token, via `leadConfirmationHref(slug, token)`). `verifyConversion(params)` in
  `lib/conversion.ts` decides; today it checks shape only, the real Stripe / lead-store lookup
  goes inside it. Never put PII or UTM params in that URL; `ConversionTracker`
  (`components/lp/`) trims it to the id param.
- **Tracking:** `lib/tracking.ts` holds the event names, `pageTrackingAttrs(key)` (puts
  `data-page-key`, `data-page-type`, `data-funnel-step` on every `<main>`; LPs use
  `lpTrackingAttrs(slug, 'lp' | 'lpConfirmation')`, which adds `data-lp-slug`) and `track()`, the
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
  them for the lead / Stripe session metadata. Each touch also stores `lpSlug`, the LP it landed
  on ('' when not an LP); `landingLpSlugs()` returns the first/last-touch slugs. Internal links
  to the default LP (header and home CTA, `siteConfig.cta`)
  use `useAttributedHref(href)` (`components/lp/use_attributed_href.ts`) or
  `withStoredAttribution(href)` after mount, never during render.
- **Structured data** (`lib/structured_data.ts`): Organization + WebSite JSON-LD in the root
  layout, Service + Offer on `/` and every LP (`serviceJsonLd(lpHref)`), BreadcrumbList on every
  work story (`breadcrumbJsonLd(items)`: Home > Our work > story), all from `siteConfig`. Render with
  `<script {...jsonLdScriptProps(data)} />`.
- Never add site nav links to the `(lp)` chrome: paid visitors must not be sent away.

## Landing pages

Every paid landing page is built for ONE ad, and every LP can have a different layout. The slug
names the ad it serves, and the page lives at `/lp/<slug>`.

- **Naming rule:** URL `/lp/<slug>` == Paper frame name `lp/<slug>` (`lpFrameName(slug)`) ==
  analytics page key `lp:<slug>` == event param `lp_slug`. Slugs are lowercase kebab-case, named
  after the ad / campaign (e.g. `spring-meta-before-after`), and never renamed once traffic has
  run on them (retire and add a new one instead). `confirmation` is reserved.
- **Registry:** `lib/landing_pages.ts` (`landingPages`, `getLandingPage(slug)`). Each entry:
  `slug`, `name` (internal), `campaign` (the ad it serves, `[CONFIRM]` until known),
  `channel` (`meta | google | tiktok | other`), `offerAngle`, `layout` (layout key),
  `sections` (ordered slot ids from `LP_SECTION_IDS`), `title`, `description`, `indexable`
  (default false), `status` (`draft | live`), `updated`. The module validates slugs, duplicates
  and `DEFAULT_LP_SLUG` at load, so a bad entry fails the build.
- **Add an LP:** add one entry (slug = the ad). Reuse a layout, or add a layout: put its key in
  `LP_LAYOUT_KEYS`, write `components/lp/layouts/<key>_layout.tsx` exporting an `LpLayout`
  (`component` + supported `sections`), register it in `LP_LAYOUTS`
  (`components/lp/layouts/index.ts`). The build fails if an LP lists a section its layout cannot
  render. Nothing else changes: `generateStaticParams` prerenders it, metadata, sitemap and
  tracking follow the entry. Layouts are server components; DS UI goes in client modules.
- **Routes:** `app/(lp)/lp/[slug]/page.tsx` (static, `dynamicParams = false`, unknown slug -> 404) and `app/(lp)/lp/[slug]/confirmation/page.tsx` (dynamic, see above). Bare `/lp` and the
  old `/lp/confirmation` are route handlers that 307 to `DEFAULT_LP_SLUG` (and its confirmation),
  keeping the query string, so old ad links and success URLs keep working.
- **Layout contract:** a layout renders the page's `<main>` through `PageSkeleton` with
  `tracking={lpTrackingAttrs(slug, 'lp')}` and `idPrefix="lp-<slug>"` (slot ids
  `lp-<slug>-<section>`), and the `form` section through `LpFormSlot`, whose
  `data-success-path` is that LP's confirmation page.
- **Tracking fields:** `<main>` carries `data-page-key="lp:<slug>"`, `data-page-type="lp"` (or
  `conversion`), `data-funnel-step` and `data-lp-slug`. `page_view` and `lp_view` carry
  `page_key`, `page_type`, `funnel_step`, `lp_slug`; `lead_submit` / `purchase_complete`
  carry `lp_slug` plus `first_lp_slug` / `last_lp_slug` from stored attribution.
- **Metadata / sitemap:** `lpMetadata(lp)` and `lpConfirmationMetadata(lp)` in `lib/metadata.ts`;
  the sitemap lists an LP only when `isLpIndexable(lp)` (launch flag + `indexable` + `live`).

## Our work

Two pages, one registry (`lib/work.ts`), mirroring the landing-page pattern. Direction:
`docs/work-page-direction.md` in the main checkout. Both are skeletons (empty labelled slots).

- **Listing `/work`** (`app/(site)/work/page.tsx`, static, route key `work`, Paper frame
  "Testify Web - Our work"): slots `hero` (holds the `trade-filter` sub-slot), `featured`,
  `grid`, `process`, `questions`, `samples`, `wont-show`, `cta`. `featured` holds the first
  viewable `featured: true` story, `grid` the other viewable stories, each as an empty
  `<article data-story-slug data-story-href data-trade>` placeholder.
- **Trade filter:** `?trade=<trade>` (`trades-home-services | clinics-med-spas | salons-beauty |
local-pros`, anything else = `all`, `parseWorkTrade`). `WorkTradeFilter`
  (`components/work/work_trade_filter.tsx`, client, inside Suspense) reads it after hydration
  and sets `data-active-trade` on `#work-hero-trade-filter`; the prerendered HTML says `all`, so
  `/work` stays static. No visible UI yet.
- **Detail `/work/<slug>`** (`app/(site)/work/[slug]/page.tsx`, the case-study TEMPLATE, Paper
  frame "Testify Web - Our work / Case study"): static, `generateStaticParams` from
  `viewableWorkStories`, `dynamicParams = false` plus `notFound()`, so an unknown OR
  not-viewable slug is a 404. Slots from the entry's `sections` (ids `work-<slug>-<section>`,
  from `WORK_SECTION_IDS`): `story-hero`, `stats`, `snapshot`, `before-after`, `what-broken`,
  `timeline` (90-day swimlane), `what-changed`, `can-show-cant-claim`, `in-their-words`,
  `differently-next`, `next-story`, `cta`. `<main>` carries `data-page-key="work:<slug>"`,
  `data-page-type="site"`, `data-work-slug` (`workTrackingAttrs`; the `workStory` route
  template in `site.config.ts` holds the shared page type, `inSitemap: false`).
- **Registry entry:** `slug`, `clientName`, `trade`, `town`, `outcomeHeadline`, `timeframe`,
  `servicesUsed`, `featured`, `status` (`draft | published`), `consent` (`pending | approved`),
  `stats` (`{ label, value, source }`, every stat needs a source), `sections`, `title`,
  `description`, `updated`. Client facts stay `[CONFIRM]` placeholders until signed off. The
  module validates slugs, duplicates, sourceless stats and more than one featured public story
  at load, so a bad entry fails the build.
- **Add a story:** add one entry (`status: 'draft'`, `consent: 'pending'`), review it in
  `next dev` or a preview build, then flip to `published` + `approved` only once the client's
  written consent is on file. Nothing else changes: params, listing, metadata, sitemap,
  breadcrumb and tracking follow the entry.
- **Consent rule:** a story is PUBLIC only when `status: 'published'` AND `consent:
'approved'` (`isWorkPublic`). Only public stories are listed, served in a production build,
  and (with the launch flag on) indexed + in the sitemap (`isWorkIndexable`). Every other story
  is a PREVIEW: it renders only in `next dev` or a build with `NEXT_PUBLIC_WORK_PREVIEW=true`,
  always `noindex, nofollow`, never in the sitemap; with previews off it is a 404 and not
  listed. The build fails if `NEXT_PUBLIC_WORK_PREVIEW=true` and `NEXT_PUBLIC_SITE_INDEXABLE=true`
  are set together.
- **Metadata:** `workStoryMetadata(story)` in `lib/metadata.ts` (canonical only when
  indexable). `/work` itself uses `pageMetadata('work')` and is in the sitemap via the routes
  registry.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
