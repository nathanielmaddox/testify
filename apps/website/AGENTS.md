# @testify/website — agent instructions

`AGENTS.md` is a byte-identical copy of this file. Edit `CLAUDE.md`, then `cp CLAUDE.md AGENTS.md`.
The root `CLAUDE.md` rules apply here too; read it first.

## What this app is

The testify public website (Next.js App Router, React 19, Tailwind v3). Pages are built from the
Paper hi-fi frames ("Testify Web - ..."). Each section is a server component, or a small
`'use client'` module under `components/` that draws DS and brand compositions.

Copy is not final. Placeholders such as `[CONFIRM]`, `[N]`, `[NAME]` and `[ANSWER]` are intentional
and stay visible until the owner supplies the real copy. Never replace one with an invented fact.
Dev port **3200** (`pnpm --filter @testify/website dev`, or `pnpm dev` from the root).
Editor map: `PAGES.md` lists every route, its sections, open placeholders and tracking events.
Update it in the same commit as any route, section or placeholder change.

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
   the nav. It returns 404 when `NEXT_PUBLIC_SITE_INDEXABLE=true`. Delete it when the real pages
   exist.
6. **Site data** (name, URL, nav, CTA, footer, routes, indexable flag, offer, organization,
   share image) lives in `lib/site.config.ts`. Add a route there when you add a page so the
   header, footer, metadata and sitemap pick it up. Landing pages and client stories have their
   own registries (see below). Env is read with dot access (`process.env.NEXT_PUBLIC_X`, typed in
   `lib/env.d.ts`) so Next inlines it into client bundles; document every new var in
   `.env.example`.
7. **Indexing:** robots disallows everything and `sitemap.xml` is empty until
   `NEXT_PUBLIC_SITE_INDEXABLE=true`, and every `*.vercel.app` host gets `X-Robots-Tag: noindex`
   from `next.config.js`. With the flag on, the build throws unless `NEXT_PUBLIC_SITE_URL` is the
   real origin (not missing, localhost or `*.vercel.app`).
8. **Deploy** from `apps/website` only, remote Vercel build; `vercel.json` installs via
   `node ../../scripts/vercel/install.mjs`. Never deploy from the monorepo root.
   Outside services (payments, email, bookings, data store, uploads) go through `lib/integrations`. Read `INTEGRATIONS.md` before adding one.

## Routes and funnel

Three route groups give the site three chromes. The root `app/layout.tsx` holds html, body,
providers and the site-wide JSON-LD. Each group layout draws its own header and footer, and each
page draws its own `<main id="main-content">` through `components/skeleton/page_skeleton.tsx`.

| Group        | Routes                                                                                                    | Chrome                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `app/(site)` | `/`, `/work`, `/work/<slug>`, `/about`, `/contact`, `/privacy`, `/terms`                                  | `SiteHeader` (nav from the registry, CTA to `/get-started`), `SiteFooter` (nav, legal) |
| `app/(flow)` | `/get-started`, `/get-started/business`, `/get-started/goals`, `/get-started/book`, `/get-started/booked` | `FlowHeader` (wordmark and "Back to site", no nav), `FlowFooter` (legal row)           |
| `app/(lp)`   | `/lp/<slug>`, `/lp/<slug>/checkout`, `/lp/<slug>/confirmation`                                            | `LpHeader` (name only, no links), `LpFooter` (legal and copyright only)                |

- **Registry:** `routes` in `lib/site.config.ts` is the single list. Each entry has `key`, `path`,
  `title`, `description`, `updated` (static ISO date for the sitemap), `navLabel`, `pageType`
  (`site | lp | checkout | conversion | legal`), `indexable`, `inSitemap`, `inNav` and an optional
  `funnelStep` (`landing | checkout | conversion`). Header and footer links, metadata and
  `app/sitemap.ts` are generated from it. Most pages export `metadata = pageMetadata('<key>')`.
  Four keys are route TEMPLATES that are never linked directly: `workStory` (`/work/[slug]`), `lp`,
  `lpCheckout` and `lpConfirmation`. Each concrete page gets its own title, description and
  indexing from its registry (`lib/work.ts`, `lib/landing_pages.ts`).
- **Get started keys:** `getStarted`, `getStartedBusiness`, `getStartedGoals`, `getStartedBook`
  and `getStartedBooked`. Steps 1 to 4 are `site` pages, noindex and not in the sitemap. The site
  CTA (`siteConfig.cta`) lands on step 1. The booked page is the flow's conversion page.
- **Metadata** (`lib/metadata.ts`): Next merges metadata shallowly, so `pageMetadata` always
  builds `openGraph`/`twitter` from the shared base (`baseOpenGraph`, `baseTwitter`: type,
  siteName, locale, image slot `siteConfig.shareImage`). The root layout uses `rootMetadata()`,
  which has NO canonical and NO og:url, so a page without `pageMetadata` never claims to be home.
  Canonical is emitted only for indexable routes. Icon: `/icon.svg` in `public/`. LPs, checkouts,
  confirmations and client stories use their own builders (`lpMetadata`, `lpCheckoutMetadata`,
  `lpConfirmationMetadata`, `workStoryMetadata`).
- **Indexing:** a route is indexed only when `NEXT_PUBLIC_SITE_INDEXABLE=true` AND its own
  `indexable` is true. Conversion and checkout pages are never indexable (`isRouteIndexable`).
  An LP is indexed only when `isLpIndexable` (launch flag, its `indexable`, and `status: 'live'`);
  otherwise it is `noindex, follow`. Other non-indexable routes are `noindex, nofollow`.
- **Conversion pages (two):**
  - `/get-started/booked` (route key `getStartedBooked`) is `force-dynamic`, reads its booking
    from sessionStorage, and sends the visitor back to `/get-started/book` when none is stored.
    `next.config.js` sets `Cache-Control: private, no-store, max-age=0` on it.
  - `/lp/<slug>/confirmation` (route template `lpConfirmation`) is that LP's conversion page. It
    is `force-dynamic`, with `Cache-Control: private, no-store` (`next.config.js`, source
    `/lp/:slug/confirmation`). An unknown slug is a 404. It renders only for a valid conversion id,
    else redirects to `/lp/<slug>`: `session_id` (Stripe, via `stripeSuccessUrl(slug)`) or `lead`
    (lead token, via `leadConfirmationHref(slug, token)`).
  - Both are always noindex and never in the sitemap. `verifyConversion(params)` in
    `lib/conversion.ts` decides; today it checks shape only (`verified: false`), so any
    well-formed id counts. The Stripe session and lead-store lookups go inside it.
  - Never put PII or UTM params in a conversion URL. `ConversionTracker`
    (`components/lp/conversion_tracker.tsx`) trims the address bar to the id param.
- **Tracking:** `lib/tracking.ts` holds the event names (`TRACK_EVENTS`), `pageTrackingAttrs(key)`,
  `lpTrackingAttrs(slug, 'lp' | 'lpCheckout' | 'lpConfirmation')` (adds `data-lp-slug`),
  `workTrackingAttrs(slug)` (adds `data-work-slug`), and `track()`, the only analytics call site.
  Every `<main>` carries `data-page-key`, `data-page-type`, and `data-funnel-step` where the route
  has one. `EVENT_MAP` maps each site event to its provider events:
  - `page_view` -> GA4 `page_view` / Meta `PageView`.
  - `lp_view` -> `view_item` / `ViewContent`.
  - `checkout_view` -> GA4 `checkout_view` / Meta custom `CheckoutView`.
  - `begin_checkout` -> `begin_checkout` / `InitiateCheckout`.
  - `add_payment_info` -> `add_payment_info` / `AddPaymentInfo`.
  - `lead_submit` -> `generate_lead` / `Lead`.
  - `purchase_complete` -> `purchase` / `Purchase`.
    The last two also send a Google Ads conversion when its label is set.
    Providers are off until their env id is set (`lib/analytics.config.ts`, `.env.example`).
    `initAnalytics()` installs the gtag/fbq queues so nothing is lost before the scripts load.
    `components/providers.tsx` loads the scripts, captures attribution once per page load, and sends
    `page_view` per route, plus `lp_view` on a `landing` step. Conversions fire once per id
    (localStorage key `tfy_conv:<event>:<id>`) with the id as Meta `eventID` and GA4/Ads
    `transaction_id`. Value and currency come from `siteConfig.offer`, not from an LP's `offer`, so
    keep the two prices equal.
- **CSP:** third-party hosts live in the `thirdParties` array in `next.config.js`, one entry per
  provider (script, beacon = img + connect, frame, form). Current entries: GA4, Google Ads, Meta
  Pixel, Stripe Checkout and `Stripe.js`. Add a provider there, not inline.
- **Attribution** (`lib/attribution.ts`): UTM + click ids (`ATTRIBUTION_PARAMS`, matched
  case-insensitively) are stored on first landing (any route) in a 90-day first-party cookie
  `tfy_attr` plus sessionStorage, as first touch and last touch. `getAttribution()` returns
  them for the lead / Stripe session metadata. Each touch also stores `lpSlug`, the LP it landed
  on ('' when not an LP); `landingLpSlugs()` returns the first/last-touch slugs. Internal links
  to the get-started flow (the header CTA and any `ClosingCta` that defaults to it) use
  `useAttributedHref(href)` (`components/lp/use_attributed_href.ts`) or
  `withStoredAttribution(href)` after mount, never during render.
- **Structured data** (`lib/structured_data.ts`): Organization + WebSite JSON-LD in the root
  layout, Service with a nested Offer on `/` and on every LP (`serviceJsonLd(lpHref)`), and
  BreadcrumbList on every work story (`breadcrumbJsonLd(items)`: Home > Our work > story). All
  come from `siteConfig`. Render with `<script {...jsonLdScriptProps(data)} />`.
- **Contact** (`app/(site)/contact/page.tsx`): a booking page. An intro, one booking card, and one
  support line. `BookingEmbed` (`components/contact/booking_embed.tsx`) iframes the owner's
  scheduling page when `NEXT_PUBLIC_BOOKING_EMBED_URL` is an https URL. Its host must be in the
  "Booking embed" `frame` entry in `next.config.js`. Otherwise it shows an inert calendar
  placeholder. `ContactRouter`, `ContactFootnotes` and their copy are not rendered. The support
  address is in `components/contact/support_email.ts`. The headline copy is `[CONFIRM]`.
- **Nav rule:** never add site nav links to the `(lp)` or `(flow)` chrome. Paid visitors must not
  be sent away, and the get-started flow keeps its one job.

## Shared page pieces

Sections import these rather than drawing their own headings, closing blocks, FAQs or
testimonials. A page composes them; it does not copy them.

| File                                   | What                                                                                                                                                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `components/site/section_header.tsx`   | `SectionHeader`: kicker, one H2, one sub line. `size` is `display-xl` (Paper hero), `display` or `h2`. `id` lands on the heading for `aria-labelledby`. Server-safe.                                   |
| `components/site/closing_cta.tsx`      | `ClosingCta`: the closing block of a page. Kicker, display headline, optional sub, the one violet CTA and a reassurance line. Defaults to `siteConfig.cta` through `useAttributedHref`. Client module. |
| `components/site/faq_list.tsx`         | `FaqList`: the DS `Accordion` in its card variant, collapsed on load. Client module.                                                                                                                   |
| `components/site/testimonial_card.tsx` | `TestimonialCard`: quote in the display face, attribution below. The caller supplies the quotation marks. Server-safe.                                                                                 |

## Our work

Two pages and one registry (`lib/work.ts`), mirroring the landing-page pattern. Direction:
`docs/work-page-direction.md` in the main checkout.

- **Listing `/work`** (`app/(site)/work/page.tsx`, static, route key `work`, Paper frame
  "Testify Web - Our work"). Sections in order: `hero` (holds the trade filter), `featured`,
  `grid`, `samples`, `wont-show`, `process`, `compare`, `cta`. `featured` shows the first viewable
  `featured: true` story. `grid` shows the other viewable stories. `compare` uses
  `WorkCompareTable` (`components/work/work_compare_table.tsx`), a wrapper over the DS
  `ComparisonTable`.
- **Trade filter:** `?trade=<trade>` (`trades-home-services | clinics-med-spas | salons-beauty |
local-pros`; anything else is `all`, via `parseWorkTrade`). `WorkTradeFilter`
  (`components/work/work_trade_filter.tsx`) draws DS Link pills to `?trade=` and sets
  `data-active-trade` on `#work-hero-trade-filter`. Its client read sits in a Suspense boundary,
  so the prerendered HTML says `all` and `/work` stays static. The story grid
  (`WorkStoryGrid`, `components/work/work_story_cards.tsx`) filters by the same parameter on the
  client and ends with a next-story card.
- **Detail `/work/<slug>`** (`app/(site)/work/[slug]/page.tsx`, the case-study TEMPLATE, Paper
  frame "Testify Web - Our work / Case study"). Static, with `generateStaticParams` from
  `viewableWorkStories`, `dynamicParams = false`, and `notFound()`. An unknown OR not-viewable
  slug is a 404. Sections render in the entry's `sections` order, drawn by `StorySection`
  (`components/work/work_case_sections.tsx`). That switch must stay in step with
  `WORK_SECTION_IDS`: `story-hero`, `snapshot`, `what-broken`, `timeline`, `before-after`,
  `what-changed`, `in-their-words`, `differently-next`, `stats`, `next-story`, `cta`. The page's
  `idPrefix` is `work-<slug>`. `<main>` carries `data-page-key="work:<slug>"`,
  `data-page-type="site"`, `data-work-slug` (`workTrackingAttrs`; the `workStory` route template
  holds the page type and is `inSitemap: false`).
- **Registry entry:** `slug`, `clientName`, `trade`, `town`, `outcomeHeadline`, `timeframe`,
  `servicesUsed`, `featured`, `status` (`draft | published`), `consent` (`pending | approved`),
  `stats` (`{ label, value, source }`, every stat needs a source), `sections`, `content` (the
  story copy for each section, verbatim from the frame with placeholders kept), `title`,
  `description`, `updated`. Client facts stay `[CONFIRM]` until signed off. The module validates
  slugs, duplicates, sourceless stats and more than one public featured story at load, so a bad
  entry fails the build.
- **Add a story:** add one entry (`status: 'draft'`, `consent: 'pending'`). Review it in `next dev`
  or a preview build, then flip to `published` and `approved` only once the client's written
  consent is on file. Params, listing, metadata, sitemap, breadcrumb and tracking follow the entry.
- **Consent rule:** a story is PUBLIC only when `status: 'published'` AND `consent: 'approved'`
  (`isWorkPublic`). Public stories are always served in a production build. With the launch flag
  on, they are also indexed and in the sitemap (`isWorkIndexable`). Every other story is a
  PREVIEW. It renders only in `next dev` or a build with `NEXT_PUBLIC_WORK_PREVIEW=true`, is always
  `noindex, nofollow`, and is never in the sitemap. The listing and grid show viewable stories, so
  previews appear there only while previews are on. With previews off, a preview is a 404 and is
  not listed. The build fails if `NEXT_PUBLIC_WORK_PREVIEW=true` and
  `NEXT_PUBLIC_SITE_INDEXABLE=true` are set together.
- **Metadata:** `workStoryMetadata(story)` in `lib/metadata.ts` (canonical only when indexable).
  `/work` itself uses `pageMetadata('work')` and is in the sitemap via the routes registry.

## Landing pages

Every paid landing page is built for ONE ad, and each LP can have its own layout. The slug names
the ad it serves, and the page lives at `/lp/<slug>`.

- **Naming rule:** URL `/lp/<slug>` == Paper frame name `lp/<slug>` ==
  analytics page key `lp:<slug>` == event param `lp_slug`. Slugs are lowercase kebab-case, named
  after the ad or campaign, and never renamed once traffic has run on them (retire and add a new
  one instead). `confirmation` and `checkout` are reserved.
- **Registry:** `lib/landing_pages.ts` (`landingPages`, `getLandingPage(slug)`). Each entry has
  `slug`, `name` (internal), `campaign` (`[CONFIRM]` until known), `channel`
  (`meta | google | tiktok | other`), `offerAngle`, `layout` (layout key), `sections` (ordered ids
  from `LP_SECTION_IDS`), optional `heroVariant` (`default | closed | busiest`, offer LPs only; no
  entry sets it yet, so every hero is the default), `title`, `description`, `indexable` (default
  false), `status` (`draft | live`), `updated`, and an optional `offer`. The module validates slugs,
  duplicates, sections listed twice, `DEFAULT_LP_SLUG` and every `offer.checkoutSlug` at load.
  `draft` LPs are SERVED (200, `noindex, follow`) for review. Only indexing and the sitemap are
  gated.
- **Current entries:**

  | Slug                   | Layout              | Offer                                           | Status |
  | ---------------------- | ------------------- | ----------------------------------------------- | ------ |
  | `sample-ad`            | `template`          | none (the default LP, `DEFAULT_LP_SLUG`)        | draft  |
  | `done-for-you-99`      | `offer-99-cold`     | $99/month, hosts the shared checkout            | draft  |
  | `done-for-you-99-back` | `offer-99-retarget` | the same offer, checks out on `done-for-you-99` | draft  |

- **Offer field:** an LP that sells directly has `offer` (`LpOffer`: `name`, `price`, `currency`,
  `interval`, `checkoutSlug`). Its buy CTAs go to `/lp/<offer.checkoutSlug>/checkout`
  (`lpCheckoutHref(lp)`), with stored attribution added after mount. Several LPs share one checkout
  by naming the same `checkoutSlug`, which must be an LP that hosts its own checkout. The Stripe
  price is not in the registry: `stripePriceId(checkoutSlug)` in `lib/checkout_server.ts` maps it
  to an env var. The offer is content CREATION delivered ready to post (placeholder name
  "Ready-to-Post Content, monthly"), never account management. No placeholder says we post or
  manage accounts.
- **Layouts** (`components/lp/layouts/`): `LP_LAYOUT_KEYS` lists the keys, and `LP_LAYOUTS` in
  `index.ts` maps each to an `LpLayout` (its `component` plus the section ids it supports). The
  build throws at import if an LP lists a section its layout cannot render.
  - `template` (`template_layout.tsx`): hero, proof, process, honesty, guarantee, faq, each a
    `template_*` section component in `components/lp/sections/`. Then `form`, which is
    `LpFormSlot` (`components/lp/lp_form_slot.tsx`). That slot is empty for now, and its
    `data-success-path` is the LP's confirmation page. No sticky bar.
  - `offer-99-cold` (`offer_99_cold_layout.tsx`, drawn by `OfferLayout` in `offer_layout.tsx`):
    hero, proof, letter, story, problem, seen, time, mechanism, sample, straight, offer-stack,
    guarantee, team, objections-faq, next, final-cta, ps. Section components come from
    `OFFER_SECTIONS` in `offer_sections.ts`.
  - `offer-99-retarget` (`offer_99_retarget_layout.tsx`): hero, letter, objections, first-month,
    team, offer-stack, guarantee, final-cta, ps. Its own map, `OFFER_99_RETARGET_SECTIONS` in
    `offer_99_retarget_sections.ts`, is kept apart from the cold map.
- **Layout contract:** a layout renders its `<main>` through `PageSkeleton` with
  `tracking={lpTrackingAttrs(slug, 'lp')}` and `idPrefix="lp-<slug>"`. Offer section components
  take `lp` and derive their ids with `slotProps(lp, slot)` (`section_props.ts`), so anchors read
  `lp-<slug>-<section>`. Author-facing names for every section id are in `section_labels.ts`.
  Offer layouts have no form: the purchase happens on the checkout page. Their buy CTA is
  `BuyCta` (`components/lp/sections/buy_cta.tsx`), a violet DS CtaRow to the checkout href with
  stored attribution added after mount. `StickyBuyBar` (`components/lp/sticky_buy_bar.tsx`) shows
  once the hero (`lp-<slug>-hero`) scrolls out of view. It is inert and hidden until then, and
  slides in only under `motion-safe`. Do not use `LpCheckoutCta`
  (`components/lp/lp_checkout_cta.tsx`): no section renders it now.
- **Routes:** `app/(lp)/lp/[slug]/page.tsx` (static, `dynamicParams = false`, unknown slug is a
  404, Service JSON-LD). `app/(lp)/lp/[slug]/checkout/page.tsx` and
  `app/(lp)/lp/[slug]/confirmation/page.tsx` are described in the next two sections. Bare `/lp`
  and the old `/lp/confirmation` are route handlers that 307 to `DEFAULT_LP_SLUG` (and its
  confirmation), keeping the query string, so old ad links and success URLs keep working.
- **Add an LP:** add one entry (slug = the ad). To reuse a layout, nothing else changes:
  `generateStaticParams` prerenders it, and metadata, sitemap and tracking follow the entry. To
  add a layout, put its key in `LP_LAYOUT_KEYS`, write `components/lp/layouts/<key>_layout.tsx`
  exporting an `LpLayout`, and register it in `LP_LAYOUTS`. Layouts are server components; DS UI
  goes in client modules.
- **Tracking fields:** `<main>` carries `data-page-key="lp:<slug>"`, `data-page-type` (`lp`,
  `checkout` or `conversion`), `data-funnel-step` and `data-lp-slug`. `page_view` and `lp_view`
  carry `page_key`, `page_type`, `funnel_step` and `lp_slug`. `checkout_view` and
  `begin_checkout` add `value` and `currency`. `lead_submit` and `purchase_complete` carry
  `lp_slug` plus `first_lp_slug` / `last_lp_slug` from stored attribution.
- **Metadata / sitemap:** `lpMetadata(lp)`, `lpCheckoutMetadata(lp)` and
  `lpConfirmationMetadata(lp)` in `lib/metadata.ts`. The sitemap lists an LP only when
  `isLpIndexable(lp)`.

## Checkout and confirmation

- **Purchase page** `app/(lp)/lp/[slug]/checkout/page.tsx` (route template `lpCheckout`, page type
  and funnel step `checkout`): `force-dynamic`, `Cache-Control: private, no-store`
  (`next.config.js`), always `noindex, nofollow`, never in the sitemap. It is served only for an LP
  with an `offer`; other slugs are a 404. An LP that shares another LP's offer 307s to its host's
  checkout (`/lp/<checkoutSlug>/checkout`), keeping the query string. It uses the same focused (lp)
  chrome.
- **Layout** (`components/lp/checkout/checkout_body.tsx`): the intro (`CheckoutIntro`), then two
  columns. The left is `CheckoutPlanCard` (offer name, price, four included items). The right is
  one sticky pay card (`CheckoutForm`): email, first and last name, business name, the payment
  slot, the reassurance line, the auto-renewal line and the submit button ("Start my plan for
  $99/month"). `CheckoutPromises`, `CheckoutFaq`, `CheckoutTrustRow`, `AfterPaySteps` and
  `OrderSummary` stay in the folder but are not rendered (owner ruling: the checkout page does only
  this).
- **Payment is NOT wired yet.** `PaymentElementSlot`
  (`components/lp/checkout/payment_element_slot.tsx`) is a placeholder box ("Secure payment fields
  load here."). The Stripe.js client packages are not in `package.json`, and no Payment Element
  mounts. Owner ruling: payment details are collected ONLY by the Stripe Payment Element (card,
  Apple Pay, Google Pay, Link). No custom wallet buttons and no card fields. Keep that rule when
  the element lands.
- **Session flow:** `startCheckout(slug, contact)` in `lib/checkout.ts` POSTs `{ slug, contact,
attribution }` to `/api/checkout`. The attribution is `encodeAttribution(getAttribution())`, and
  the server re-validates it. The route calls `getIntegrations().payments.createCheckoutSession`
  (`lib/integrations`, Stripe in `lib/integrations/providers/stripe.ts`). That creates a Checkout
  Session in mode `subscription`, with the price from `stripePriceId`, `ui_mode` `embedded_page`,
  and the return URL `stripeSuccessUrl(slug)`. It returns the client secret. With no payments
  provider connected it answers 503 `checkout_not_configured` and makes no call. Cross-origin
  POSTs get 403. Rate limiting and origin checks come from `lib/api_guard.ts`. A failed call shows
  the copy for its error code, from `components/lp/checkout/payment_errors.ts`. An unmapped code,
  such as `checkout_not_configured`, shows the network line. After a secret comes back, the button
  disables, but the payment slot is still a placeholder, so nothing can be paid yet. The
  hosted-page branch (`CHECKOUT_UI_MODE = 'hosted_page'`, a redirect) exists but is off
  ([CONFIRM] with the owner). Provider switches and how to connect one: `INTEGRATIONS.md`.
- **Events on the page:** `CheckoutTracker` (`components/lp/checkout_tracker.tsx`) fires
  `checkout_view` on mount, and `begin_checkout` on the first focus or pointer-down in the form.
  `add_payment_info` does not fire yet. `CheckoutForm` defines `onPaymentDetailsEntered`
  (`components/lp/checkout/checkout_form.tsx`) and passes it to `PaymentElementSlot`
  (`components/lp/checkout/payment_element_slot.tsx`), which does not call it yet. The Payment
  Element's change handler must call it once details are complete, and that fires
  `trackAddPaymentInfo` (`components/lp/checkout_tracker.tsx`). It never fires on submit or on
  session creation.
- **Confirmation** `app/(lp)/lp/[slug]/confirmation/page.tsx`: a `session_id` is verified by
  `verifyConversion` (`lib/conversion_server.ts`, which asks the payments adapter whether the
  session is paid). A verified session renders `PurchaseConfirmation`, passing the session id as
  `referenceId`. An unverified one renders `PaymentPending`. The purchase page has three forms:
  - Onboarding (`OnboardingForm`) posts to `/api/onboarding` with the session id.
  - Feedback (`QuietExtrasForm`) posts to `/api/feedback`.
  - Both stay disabled with a reason when the adapter answers not connected, and no success is
    shown. Only an adapter `ok` shows the thanks line. Photo upload stays disabled until the
    upload adapter is connected.
    A `lead` token renders `LeadConfirmation`, a placeholder with `[CONFIRM]` copy. No code issues
    a lead token yet. `ConversionTracker` fires `purchase_complete` once per verified id.
- **Server side:** `lib/checkout_server.ts` (SERVER ONLY) builds the Stripe session params and the
  metadata (`lp_slug`, business name, first and last touch). Outside services go through
  `lib/integrations` (`getIntegrations()`); read `INTEGRATIONS.md` before connecting one. The
  Stripe SDK loads only once a payments provider is selected. Env vars are documented in
  `.env.example` and typed in `lib/env.d.ts`.
- **API routes:** `POST /api/checkout`, `POST /api/onboarding`, `POST /api/feedback`, and the
  bookings route `GET` and `POST /api/bookings` (see the get-started flow). All are `no-store` and
  noindex, and answer with the adapter result, never a fake success.

## Get started flow

- **Steps:** `/get-started` (About you), `/get-started/business` (Your business),
  `/get-started/goals` (Your goals), `/get-started/book` (Book a time), then `/get-started/booked`
  (the conversion page). The qualifier steps render `QualifierStep` from the specs in
  `lib/get_started.ts` (`QUALIFIER_STEPS`). Their copy and options are verbatim from the Paper
  frames, and the validation messages follow the skill audit. Step 4 is `BookingStep`, and the
  booked page is `BookedSummary`. Every step shows `FlowStepIndicator`.
- **State:** answers live in sessionStorage under the key `tfy_get_started`
  (`GET_STARTED_STORAGE_KEY`), read and written through `useGetStartedState`
  (`components/get_started/use_get_started_state.ts`). The keys are `aboutYou`, `yourBusiness`,
  `yourGoals` and `booking`. Never put an answer in a URL. State is read after mount, so the server
  HTML and the first client render agree.
- **Gates:** `BookingStep` sends the visitor back to the first incomplete qualifier step
  (`firstIncompleteQualifierStep`). `BookedSummary` sends the visitor to `/get-started/book` when
  no booking is stored.
- **Booking API:** `GET /api/bookings?month=YYYY-MM&timeZone=<IANA>` returns the open slots of a
  month, keyed by day. `POST /api/bookings` re-validates the answers and the slot, saves the
  answers through the data store, then books through the booking adapter. Both are in
  `app/api/bookings/route.ts`, and the adapters are in `lib/integrations`.
- **Mocked slots:** with no booking provider connected, slots come from `mockSlotsForDay`
  (`lib/get_started.ts`, from `SLOT_TIMES`), and the GET response says `connected: false`. Days
  run for `BOOKING_WINDOW_DAYS` (60). Weekends and past days are closed. The time zone list is
  fixed, plus the browser's zone. The call length is `CALL_LENGTH_MINUTES`.
- **Booked page result:** `BookingStep` stores the POST result on the booking (`connected`,
  `bookingId`, `inviteStatus`). `BookedSummary` (`components/get_started/booked_summary.tsx`) shows
  its warning notice unless `connected` is true. It says the invite was sent only when
  `inviteStatus` is `sent`. There is no `BOOKING_API_CONNECTED` flag any more.
- **Booked page extras:** "Add to calendar" downloads `testify-call.ics` (`buildBookingIcs`), and
  the page links to `/contact` to reschedule.
- **Not wired:** no lead event fires from this flow, because `lead_submit` has no source yet, and
  the answers are not sent anywhere.

## Legal pages

- **Routes:** `/privacy` and `/terms` (in `(site)`, page type `legal`, linked from the footer
  legal row, not in the header nav). Both are `indexable: true` in the registry.
- **Content:** `lib/legal.ts` holds the outlines, `PRIVACY_SECTIONS` and `TERMS_SECTIONS`. Each
  section has an id, a heading and body paragraphs. Every body is a
  `[CONFIRM: legal copy for <topic>, reviewed by counsel]` placeholder, and `LEGAL_EFFECTIVE_DATE`
  is `[CONFIRM]`. `components/legal/legal_page.tsx` draws the title, the effective date, a
  "Last updated" line from the registry's `updated`, an in-page contents list, and one anchored
  section per outline entry.
- **Counsel review before launch:** both routes are indexable, so placeholder text must not reach
  the sitemap. Counsel or the owner signs off every section before `NEXT_PUBLIC_SITE_INDEXABLE`
  goes true.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
