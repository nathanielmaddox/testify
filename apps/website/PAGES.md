# Website page map

Internal editor map for `apps/website`. It lists every route, what each page is made of, where its
copy lives, which placeholders are still open, and what each page tracks. It is not the public
sitemap. Read it before opening page files.

**Keep it current.** Update this file in the same commit as any change to a route, a section, a
layout, a registry entry, a placeholder or a tracking event. The sources of truth are the registries
in `lib/`, not this file. When they disagree, the code wins and this file is wrong.

**Design source.** The Paper design file is `01M4GWGM6C9YRHAYMVNKF4GSRY`. Frame names below come
from code comments and were not checked in Paper. Where no frame name appears in code, the table
says "not named in code".

**Vocabulary.** "Built" means the page is complete for its job. "Placeholder copy" means the layout
is real and the copy is not final. "Draft" means the page is served for review but not in rotation
or not indexed. "Static" means prerendered at build. "No-store" means the `Cache-Control` header
from `next.config.js` applies.

## Overview

All 25 rows. Seventeen render a page (the 404 included). Two redirect, four are API routes, and two
are generated files.

| Path                      | Type                          | Chrome             | Indexable                                      | In nav          | In sitemap    | Cache                         | Status                                                 | Paper frame                                                | Page file                                  |
| ------------------------- | ----------------------------- | ------------------ | ---------------------------------------------- | --------------- | ------------- | ----------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------ |
| `/`                       | site                          | site               | launch flag                                    | yes             | yes           | static                        | placeholder copy                                       | Testify Web - Home                                         | `app/(site)/page.tsx`                      |
| `/work`                   | site                          | site               | launch flag                                    | yes             | yes           | static                        | built, sample stories are drafts                       | Testify Web - Our work                                     | `app/(site)/work/page.tsx`                 |
| `/work/[slug]`            | site template                 | site               | launch flag, and story published and approved  | no              | stories only  | static, viewable stories only | template, drafts show in previews                      | Testify Web - Our work / Case study                        | `app/(site)/work/[slug]/page.tsx`          |
| `/about`                  | site                          | site               | launch flag                                    | yes             | yes           | static                        | placeholder copy                                       | not named in code                                          | `app/(site)/about/page.tsx`                |
| `/contact`                | site                          | site               | launch flag                                    | yes             | yes           | static                        | built, placeholder calendar until the embed URL is set | not named in code                                          | `app/(site)/contact/page.tsx`              |
| `/privacy`                | legal                         | site               | launch flag                                    | no (footer row) | yes           | static                        | draft outline, all [CONFIRM]                           | not named in code                                          | `app/(site)/privacy/page.tsx`              |
| `/terms`                  | legal                         | site               | launch flag                                    | no (footer row) | yes           | static                        | draft outline, all [CONFIRM]                           | not named in code                                          | `app/(site)/terms/page.tsx`                |
| `/get-started`            | site, step 1                  | flow               | noindex, nofollow                              | no              | no            | static                        | built                                                  | Testify Web - Get started                                  | `app/(flow)/get-started/page.tsx`          |
| `/get-started/business`   | site, step 2                  | flow               | noindex, nofollow                              | no              | no            | static                        | built                                                  | Testify Web - Get started                                  | `app/(flow)/get-started/business/page.tsx` |
| `/get-started/goals`      | site, step 3                  | flow               | noindex, nofollow                              | no              | no            | static                        | built                                                  | Testify Web - Get started                                  | `app/(flow)/get-started/goals/page.tsx`    |
| `/get-started/book`       | site, step 4                  | flow               | noindex, nofollow                              | no              | no            | static                        | built, mocked slots until a booking provider connects  | Testify Web - Get started                                  | `app/(flow)/get-started/book/page.tsx`     |
| `/get-started/booked`     | conversion, step 5            | flow               | noindex, nofollow, always                      | no              | no            | per request, no-store         | built, warning unless the booking provider created it  | not named in code                                          | `app/(flow)/get-started/booked/page.tsx`   |
| `/lp`                     | redirect (307)                | none               | n/a                                            | no              | no            | per request                   | built                                                  | n/a                                                        | `app/(lp)/lp/route.ts`                     |
| `/lp/[slug]`              | LP template                   | LP                 | noindex, follow, unless LP is live and flag on | no              | live LPs only | static                        | draft, all three LPs                                   | lp/sample-ad, lp/done-for-you-99                           | `app/(lp)/lp/[slug]/page.tsx`              |
| `/lp/[slug]/checkout`     | checkout                      | LP                 | noindex, nofollow, always                      | no              | no            | per request, no-store         | draft, one host LP                                     | lp/done-for-you-99/checkout                                | `app/(lp)/lp/[slug]/checkout/page.tsx`     |
| `/lp/[slug]/confirmation` | conversion                    | LP                 | noindex, nofollow, always                      | no              | no            | per request, private no-store | draft, placeholder copy                                | lp/done-for-you-99/confirmation, lp/sample-ad/confirmation | `app/(lp)/lp/[slug]/confirmation/page.tsx` |
| `/lp/confirmation`        | redirect (307)                | none               | n/a                                            | no              | no            | per request                   | built                                                  | n/a                                                        | `app/(lp)/lp/confirmation/route.ts`        |
| `/design`                 | utility                       | none, own `<main>` | noindex, nofollow, 404 when launch flag on     | no              | no            | static                        | internal specimen                                      | none                                                       | `app/design/page.tsx`                      |
| `/api/checkout`           | API (POST)                    | n/a                | `X-Robots-Tag: noindex, nofollow`              | no              | no            | no-store                      | 503 until a payments provider is connected             | n/a                                                        | `app/api/checkout/route.ts`                |
| `/api/bookings`           | API (GET slots, POST booking) | n/a                | `X-Robots-Tag: noindex, nofollow`              | no              | no            | no-store                      | mocked slots until a booking provider connects         | n/a                                                        | `app/api/bookings/route.ts`                |
| `/api/onboarding`         | API (POST)                    | n/a                | `X-Robots-Tag: noindex, nofollow`              | no              | no            | no-store                      | 503 until a data store is connected                    | n/a                                                        | `app/api/onboarding/route.ts`              |
| `/api/feedback`           | API (POST)                    | n/a                | `X-Robots-Tag: noindex, nofollow`              | no              | no            | no-store                      | 503 until a data store is connected                    | n/a                                                        | `app/api/feedback/route.ts`                |
| any unknown path          | 404                           | site               | Next adds noindex, canonical null              | no              | no            | static                        | placeholder copy                                       | none                                                       | `app/not-found.tsx`                        |
| `/robots.txt`             | utility                       | n/a                | n/a                                            | no              | no            | static                        | disallow all until launch                              | n/a                                                        | `app/robots.ts`                            |
| `/sitemap.xml`            | utility                       | n/a                | n/a                                            | no              | no            | static                        | empty until launch                                     | n/a                                                        | `app/sitemap.ts`                           |

Notes on the table:

- "Launch flag" is `NEXT_PUBLIC_SITE_INDEXABLE=true`, read in `lib/site.config.ts`. Until it is on,
  no site route is indexed and the sitemap is empty.
- A route also needs its own `indexable` flag in `routes` (`lib/site.config.ts`).
- Conversion and checkout pages are never indexable (`isRouteIndexable` in `lib/metadata.ts`).
- `/lp/[slug]/checkout` for `done-for-you-99-back` redirects to `/lp/done-for-you-99/checkout`.
  `/lp/sample-ad/checkout` is a 404, because that LP has no offer.
- Production has no viewable work story yet. `/work` shows no featured card and no grid cards, and
  every `/work/<slug>` is a 404 until a story is published with consent approved.
- Outside services are off by default. Each one is chosen by an env switch in `lib/integrations`.
  Until a provider is connected, the routes answer honestly and the pages say so. See
  `INTEGRATIONS.md` for the switches and how to connect one.
- API routes are shared through `lib/api_guard.ts` (origin check, rate limit, status mapping).

## Pages

Each section lists the sections in render order, the copy source, open placeholders, interactive
behavior and tracking events. Every page gets `page_view` on each route change (see Tracking below).

### Home (`/`)

Purpose: the public front door. It sells the done-for-you service and sends visitors to get started.
Chrome: `SiteHeader` and `SiteFooter` from `app/(site)/layout.tsx`. Metadata:
`pageMetadata('home')`. Also emits Service JSON-LD (`serviceJsonLd('/')`) in `app/(site)/page.tsx`.

Sections in order (all in `components/home/`):

1. Hero: `HomeHero` in `home_hero.tsx`, with `HeroPhones` in `hero_phones.tsx`. Two-line H1 with no
   eyebrow (owner ruling).
2. Pain: `HomePain` in `home_pain.tsx`.
3. Reel: `HomeReel` in `home_reel.tsx`. A 16:9 placeholder tile, no video.
4. Engine: `HomeEngine` in `home_engine.tsx`.
5. What we do: `HomeWhatWeDo` in `home_what_we_do.tsx`.
6. Offer: `HomeOffer` in `home_offer.tsx`.
7. Dark panel: `HomeDarkPanel` in `home_dark_panel.tsx`.
8. Testimonials: `HomeTestimonials` in `home_testimonials.tsx`.
9. FAQ: `HomeFaq` in `home_faq.tsx`, with `FaqList` from `components/site/faq_list.tsx`.
10. Closing CTA: `HomeClosing` in `home_closing.tsx`, with `ClosingCta` from `components/site/`.

Copy lives in each section file. There is no registry for home copy.

Open placeholders:

- `home_hero.tsx`: "Day [N]", "[N]%", "[N]" stat values.
- `hero_phones.tsx`, `home_engine.tsx`, `home_pain.tsx`, `home_what_we_do.tsx`: `[BUSINESS]`,
  `[TOWN]`.
- `home_offer.tsx`: "[N] posts and videos", "day [N]", "[N] business days".
- `home_faq.tsx`: `[ANSWER: owner to supply]` in 8 of 9 answers. Only "What do you do?" is answered.
- `home_testimonials.tsx`: quote and attribution placeholders in all three cards. Lines 4-5 say the
  section renders only once two approved quotes exist. That is a comment, not a gate. The section
  always renders.

Interactive: CTAs to `/get-started` (attributed after mount) and `/work`. FAQ accordion. The reel
and video slots are not playable.

Events: `page_view`.

### Our work (`/work`)

Purpose: the case-study listing. It shows stories by trade and explains how the service runs.
Chrome: site. Metadata: `pageMetadata('work')`. Tracking attributes: `pageTrackingAttrs('work')`.
Stories come from `lib/work.ts`. Only viewable stories show.

Sections in order (`app/(site)/work/page.tsx`):

1. Hero: `SectionHeader` and `WorkTradeFilter` (`components/work/work_trade_filter.tsx`).
2. Featured story: `FeaturedStoryCard` (`components/work/work_story_cards.tsx`). Renders only when a
   viewable featured story exists.
3. Recent work grid: `WorkStoryGrid` (`work_story_cards.tsx`), filtered by `?trade=`.
4. Samples: `WorkSamples` (`components/work/work_listing_samples.tsx`). Decorative mocks only.
5. What you won't see: `ListingWontShow` (`components/work/work_listing_sections.tsx`).
6. How it runs: `ListingProcess` (`work_listing_sections.tsx`), with `WorkCta`.
7. Compare: `ListingCompare` (`work_listing_sections.tsx`), using `WorkCompareTable`
   (`components/work/work_compare_table.tsx`).
8. Closing CTA: `WorkClosingCta` (`components/work/work_cta.tsx`).

Copy: the heading copy is inline in `app/(site)/work/page.tsx`. Listing copy is in the
`components/work/` files. Story figures and captions are in `lib/work.ts`.

Open placeholders: `[N]` and `[TRADE] in [TOWN]` in `work_listing_sections.tsx`, `[BUSINESS]` and
`[TOWN]` in `work_listing_samples.tsx`, `[NAME]` and `[MONTH YEAR]` in `work_story_cards.tsx`, and
"[N] post ideas" in `app/(site)/work/page.tsx`.

Interactive: trade pills are links to `?trade=<value>`. The grid reads the query on the client. No
forms.

Events: `page_view` only.

### Case study template (`/work/[slug]`)

Purpose: one client story, told in a fixed order. There is one template and one page per viewable
story. Chrome: site. Metadata: `workStoryMetadata(story)`. Tracking attributes:
`workTrackingAttrs(slug)`, page key `work:<slug>`. Breadcrumb JSON-LD is added. Static params come
from `viewableWorkStories`. Unknown slugs 404.

Sections in order. The per-story order is `sections` in the registry entry. All three current
samples use the full list (`WORK_SECTION_IDS` in `lib/work.ts`). `StorySection` in
`components/work/work_case_sections.tsx` maps each id:

1. `story-hero`: `StoryHero`, with `WorkCta`.
2. `snapshot`: `Snapshot`.
3. `what-broken`: `WhatBroken`.
4. `timeline`: `Timeline`.
5. `before-after`: `BeforeAfter`, with `BeforeAfterPanel`.
6. `what-changed`: `WhatChanged`, using `WorkCompareTable`.
7. `in-their-words`: `Testimonial`.
8. `differently-next`: `Differently`.
9. `stats`: `StatsPanel`.
10. `next-story`: `NextStory`. Links to the next viewable story and wraps.
11. `cta`: `Cta`, using `WorkClosingCta`.

Copy: `SAMPLE_CONTENT` in `lib/work.ts` for the three draft samples. Per-story facts are in each
entry.

Open placeholders: `clientName` is `[CONFIRM] Client name` and `servicesUsed` is `[CONFIRM] Service`
in all three samples. Titles are `[CONFIRM] Client story two` and `three`. Every sample has
`consent: 'pending'`. The copy is full of `[N]`, `[NAME]`, `[TOWN]`, `[DATE RANGE]` and `[PULL
QUOTE: ...]`. `work_case_sections.tsx` also has `[business handle]`, `[DATE]` and `Source:
[SOURCE]`.

Interactive: CTAs and the next-story link. No forms.

Events: `page_view` with `data-work-slug`.

### About (`/about`)

Purpose: who the team is and what they promise. Chrome: site. Metadata: `pageMetadata('about')`.

Sections in order (`app/(site)/about/page.tsx`):

1. Hero: `AboutHero` (`components/about/about_hero.tsx`). "Get started" CTA and a link to `/work`.
2. Origin: `AboutOrigin` (`components/about/about_origin.tsx`).
3. Numbers: `AboutNumbers` (`components/about/about_numbers.tsx`).
4. Team: `AboutTeam` (`components/about/about_team.tsx`).
5. Promises: `AboutPromises` (`components/about/about_promises.tsx`).
6. Who we work for: `AboutWho` (`components/about/about_who.tsx`), with `AboutPhoneMocks`
   (`components/about/about_phone_mocks.tsx`).
7. Closing CTA: `ClosingCta` (`components/site/closing_cta.tsx`), kicker "Next step", label "Get
   started".

Copy: each section file.

Open placeholders: `about_numbers.tsx` (`[N]`, `[SOURCE]`), `about_origin.tsx` and
`about_phone_mocks.tsx` (`[BUSINESS]`, `[N] posts`), `about_promises.tsx` (`day [N]`, `[N] business
days`), `about_team.tsx` (three `[NAME]` headings), `about_hero.tsx` (`[NAME]`, `[BUSINESS]`,
`[TOWN]`). Team photos are placeholder tiles.

Interactive: CTAs only.

Events: `page_view` only.

### Contact (`/contact`)

Purpose: book a 15-minute call with the owner. There is no form. Chrome: site. Metadata:
`pageMetadata('contact')`.

Sections in order (`app/(site)/contact/page.tsx`):

1. Intro: `ContactIntro` (`components/contact/contact_intro.tsx`). Centered H1 "Book a time to
   talk." and the sub line "Pick a slot that suits you. 15 minutes, no prep." Both marked
   `[CONFIRM]` in the file.
2. Booking card: `BookingEmbed` (`components/contact/booking_embed.tsx`), one white card. With
   `NEXT_PUBLIC_BOOKING_EMBED_URL` set to an https address, it is an iframe of the owner's
   scheduling page, with an "Open it in a new tab" link. When unset, it is a calendar-style
   placeholder: a month grid and four sample times, all inert, with the line "Your booking calendar
   goes here." The placeholder note about the env var shows outside production only.
3. Support line: `ContactSupportLine` (`components/contact/contact_support_line.tsx`). "Already a
   client? Email" and the support address, a mailto link.

Not rendered: `ContactRouter` (Sales and Support cards), `ContactFootnotes` (press, partner and jobs
lines). The files stay in `components/contact/`. Do not wire them back without an owner ruling.

Env: `NEXT_PUBLIC_BOOKING_EMBED_URL` (`.env.example`, `lib/env.d.ts`). The frame host must be listed
in the "Booking embed" entry of `next.config.js` (`frame-src`). Cal.com and Calendly are listed. Any
other host is blocked until added there.

Open placeholders: `SUPPORT_EMAIL` is `'support@[DOMAIN]'` in `components/contact/support_email.ts`.
The support line uses it. The headline and sub line are `[CONFIRM]` (decision 22).

Interactive: the iframe embed (when set), the "open in a new tab" link, the support mailto link. The
placeholder calendar is inert and hidden from assistive tech.

Events: `page_view` only. Bookings made inside the embed are the provider's and fire nothing here.

### Privacy (`/privacy`)

Purpose: privacy policy. It is an outline only. Chrome: site. Metadata: `pageMetadata('privacy')`.
Linked from the footer legal row, not the header nav.

Sections in order (`app/(site)/privacy/page.tsx` uses `components/legal/legal_page.tsx`):

1. Title, effective date line (`LEGAL_EFFECTIVE_DATE`), and "Last updated" from the registry date.
2. `LegalToc` (`components/legal/legal_toc.tsx`): anchor links.
3. Nine outline sections from `PRIVACY_SECTIONS` in `lib/legal.ts`, in this order: what-we-collect,
   how-we-use, cookies-and-analytics, sharing, retention, your-choices, children, changes, contact.

Copy: `lib/legal.ts`. Every body paragraph is `[CONFIRM: legal copy for ..., reviewed by counsel]`.

Open placeholders: the effective date (`LEGAL_EFFECTIVE_DATE`, `[CONFIRM]`) and every paragraph.

Interactive: contents links only.

Events: `page_view` only.

### Terms (`/terms`)

Purpose: terms of service. It is an outline only. Chrome: site. Metadata: `pageMetadata('terms')`.

Sections in order (`app/(site)/terms/page.tsx`, same layout as privacy):

1. Title, effective date line, contents.
2. Eleven outline sections from `TERMS_SECTIONS` in `lib/legal.ts`, in this order: the-service,
   accounts, payment-and-billing, your-content, acceptable-use, no-guarantee,
   limitation-of-liability, termination, governing-law, changes, contact.

Open placeholders: the effective date, every paragraph, and `[CONFIRM: state]` under governing law
in `lib/legal.ts:113`. The payment-and-billing outline says "month to month, cancel any month",
which the owner must confirm.

Events: `page_view` only.

### Get started step 1: About you (`/get-started`)

Purpose: qualify the visitor. Step 1 of 4 in the funnel, plus the booked page as step 5. Chrome:
flow (`FlowHeader`, `FlowFooter` from `app/(flow)/layout.tsx`). Page:
`app/(flow)/get-started/page.tsx`. Metadata: `pageMetadata('getStarted')`. Noindex, not in sitemap.

Sections (rendered from `QUALIFIER_STEPS` in `lib/get_started.ts`, by `QualifierStep` in
`components/get_started/qualifier_step.tsx`): the progress rail (`FlowStepIndicator`, in
`step_indicator.tsx`), the title and lead, the fields in spec order, the confirmation line, and the
submit button.

Fields (`ABOUT_YOU`, `lib/get_started.ts:133-184`):

- `fullName`: text, required.
- `email`: email, required, format check.
- `phone`: tel, optional, at least 10 digits when given.
- `role`: choice (owner, manager, something else), required. Chips from `choice_chips.tsx`.

Submit: "Next: your business". Answers go to sessionStorage key `tfy_get_started` only.

Open placeholders: none in the step spec. The examples in the placeholders are sample text.

Interactive: client validation with focus on the first error. Writes state on change.

Events: `page_view` only.

### Get started step 2: Your business (`/get-started/business`)

Purpose: trade, town and team size. Chrome and metadata as step 1.

Sections: the same `QualifierStep` (`lib/get_started.ts:186-246`, `YOUR_BUSINESS`), with a back
button (`FlowBackButton`, `components/get_started/flow_actions.tsx`) to step 1.

Fields:

- `businessName`: text, required.
- `businessType`: choice (trades, clinic or med spa, salon or beauty, another local service),
  required.
- `serviceArea`: text, required, "Town or area you serve".
- `webLink`: url, optional. `normalizeWebLink` accepts a bare domain.
- `teamSize`: choice (just me, 2-5, 6-20, 21+), required.

Submit: "Next: your goals". Lead: "This is how we learn your trade, your town and how your customers
talk."

Open placeholders: none in the step spec.

Events: `page_view` only.

### Get started step 3: Your goals (`/get-started/goals`)

Purpose: the goal and current posting habits. Chrome and metadata as step 1.

Sections: `QualifierStep` (`lib/get_started.ts:248-303`, `YOUR_GOALS`), with a back button to step 2.

Fields:

- `mainGoal`: choice (look current, more calls and bookings, time back, hiring), required.
- `postingNow`: choice (not at all, now and then, most weeks), required.
- `channels`: multi choice (Facebook, Instagram, TikTok, LinkedIn, Google Business Profile, None
  yet), required. "None yet" clears the others (`NONE_CHANNEL`).
- `agencyBefore`: choice (no, went well, did not work out), required.
- `notes`: textarea, optional, 300 characters maximum (`NOTES_MAX_LENGTH`).

Submit: "Pick a time".

Events: `page_view` only.

### Get started step 4: Book a time (`/get-started/book`)

Purpose: pick a day and a time for the 15-minute call. Chrome and metadata as step 1.

Sections in order (`components/get_started/booking_step.tsx`, `BookingStep`): the progress rail, one
card with the month grid and the time column, the time zone line with a zone picker, the selected
summary, the buttons (back to goals, and submit), and an "On the call" card with three items.

Rules: days are weekdays only, from tomorrow, for 60 days (`BOOKING_WINDOW_DAYS`). The step reads
open days and times from `GET /api/bookings` for the visible month, in the visitor's zone. With no
booking provider connected, the route returns mocked slots from `SLOT_TIMES` (9:00 AM, 9:30 AM,
10:30 AM, 11:00 AM on every open weekday) and says `connected: false`. The zone list is fixed, plus
the browser zone.

Open placeholders: `booking_step.tsx:107` "[N] post ideas for your business."

Interactive: month navigation, day and time buttons, zone picker. Submit with no day or time shows
"Pick a day and a time first." Submit posts the answers and the slot to `POST /api/bookings`. The
route saves the answers, then books through the booking adapter. On success the result (`connected`,
`bookingId`, `inviteStatus`) goes to sessionStorage and the visitor goes to the booked page. On
`slot-taken` the time is cleared, the answers are kept, and the open times reload. Any other failure
shows a retry line, and the answers stay.

Not connected: with no booking provider, the booking is accepted and marked `connected: false`. No
invite is sent. Connecting a provider is covered in `INTEGRATIONS.md`.

Events: `page_view` only. No booking event exists.

### Get started step 5: Booked (`/get-started/booked`)

Purpose: confirm the call and offer the calendar file. This is the flow's conversion page. Chrome:
flow. Page: `app/(flow)/get-started/booked/page.tsx`, `dynamic = 'force-dynamic'`. Metadata:
`pageMetadata('getStartedBooked')`. Noindex always.

Sections in order (`components/get_started/booked_summary.tsx`, `BookedSummary`): the progress rail
at step 5, a warning notice unless the stored booking result has `connected: true`, the kicker
"BOOKED", the heading with the invite line, the day, time and zone, "Add to calendar", the "what
happens next" list, and a link to `/contact` to reschedule.

Warning source: the stored booking result from `POST /api/bookings` (`connected`, `inviteStatus`).
There is no `BOOKING_API_CONNECTED` flag any more. The notice reads "Booking isn't connected yet"
when `connected` is false. The invite line says an invite is on its way only when `inviteStatus` is
`sent`. Otherwise it says the invite will be sent.

Open placeholders: `booked_summary.tsx:36` "[N] post ideas", and `booked_summary.tsx:146` "[NAME],
Testify" as the signature.

Interactive: "Add to calendar" downloads `testify-call.ics` (`buildBookingIcs`, line 79). A missing
or bad booking sends the visitor back to `/get-started/book`.

Events: `page_view` only.

### Landing page: sample-ad (`/lp/sample-ad`)

Purpose: the template LP. It is a draft and has no lead form yet. Chrome: LP (`LpHeader`,
`LpFooter`). Page: `app/(lp)/lp/[slug]/page.tsx`. Layout key `template`, in
`components/lp/layouts/template_layout.tsx`. Registry entry: `lib/landing_pages.ts`. Metadata:
`lpMetadata`, `noindex, follow`.

Sections in order (registry `sections`):

1. Hero: `TemplateHero` (`components/lp/sections/template_hero.tsx`). Centered headline, still the
   placeholder `[HEADLINE]`. Buy button links to `#lp-sample-ad-form`.
2. Proof: `TemplateProof` (`template_proof.tsx`).
3. Process: `TemplateProcess` (`template_process.tsx`). Three numbered placeholder steps.
4. Honesty: `TemplateHonesty` (`template_honesty.tsx`). All lines placeholder.
5. Guarantee: `TemplateGuarantee` (`template_guarantee.tsx`). Two placeholder guarantees.
6. FAQ: `TemplateFaq` (`template_faq.tsx`). Two placeholder questions.
7. Form slot: `LpFormSlot` (`components/lp/lp_form_slot.tsx`). Empty. It carries the confirmation
   path, but no form is wired.

Open placeholders: `campaign` and `offerAngle` are `[CONFIRM]` (`lib/landing_pages.ts:174-176`). The
CTA label `[CTA LABEL]` appears twice in `template_hero.tsx`. `template_proof.tsx` has `[FIGURE]`,
`[FIGURE LABEL]` and `[SOURCE]`. `template_faq.tsx` has `[QUESTION 1]`, `[ANSWER 1]`, `[QUESTION 2]`
and `[ANSWER 2]`.

Interactive: hero button scrolls to the empty form slot. Nothing submits.

Events: `page_view` and `lp_view` (the landing funnel step).

### Landing page: done-for-you-99 (`/lp/done-for-you-99`)

Purpose: the cold offer page for paid social. It sells the $99/month content plan and sends buyers
to `/lp/done-for-you-99/checkout`. Chrome: LP. Page: `app/(lp)/lp/[slug]/page.tsx`. Layout key
`offer-99-cold`, in `components/lp/layouts/offer_99_cold_layout.tsx`, rendered by `OfferLayout`
(`offer_layout.tsx`). Section map: `components/lp/sections/offer_sections.ts`. Its frame is
`lp/done-for-you-99`. The copy spec is `apps/website/docs/lp-99-conversion-page.md` (section 4). Its
bracketed markers stay visible on the page by owner rule.

Sections in order (registry `sections`; files are in `components/lp/sections/`):

1. `hero`: `Offer99Hero` (`offer_99_hero.tsx`). Pre-line, H1, one sub line, two fact chips, the buy
   CTA with the trust row under it, then `ExampleWeek` labeled "Example. Demo business.". The example
   week is the page's demonstration.
2. `problem`: `Offer99Problem` (`offer_99_problem.tsx`). Six short paragraphs, no CTA.
3. `mechanism`: `Offer99How` (`offer_99_how.tsx`). Three step cards and the "After you sign up" list, no CTA.
4. `offer-stack`: `Offer99OfferStack` (`offer_99_offer_stack.tsx`). Two cards, the price line, the
   scope line ("Not in this plan"), and `BuyCta` in the ink (`quiet`) tone.
5. `guarantee`: `Offer99Guarantee` (`offer_99_guarantee.tsx`), the five promises through `GuaranteeList`, no CTA.
6. `objections-faq`: `Offer99Faq` (`offer_99_faq.tsx`), `FaqList` with `defaultOpenCount` 3 (the first three open).
7. `final-cta`: `Offer99Close` (`offer_99_close.tsx`), with `BuyCta` in the violet (`action`) tone.
8. `ps`: `Offer99Ps` (`offer_99_close.tsx`). Sign-off and P.S., no CTA.

Retired from this page (council review, 2026-10-21): `sample` and `straight`. The sample week is the
hero mock, and the honest-limits lines live in the guarantee, the offer stack and FAQ Q8.

The buy button label and caption are `OPEN_SIGN_BUY_LABEL` and `OPEN_SIGN_BUY_CAPTION` in
`components/lp/sections/open_sign_copy.ts`. The hero, offer stack and close read them. The sticky bar reads `OPEN_SIGN_STICKY_LABEL` from the same file.

After the sections, `StickyBuyBar` (`components/lp/sticky_buy_bar.tsx`) appears once the hero
scrolls away. Its text is `DEFAULT_STICKY_BAR_TEXT` in `lib/landing_pages.ts`, and its button uses `OPEN_SIGN_STICKY_LABEL` (the shorter label) in the ink tone.

Copy: the section files, plus `lib/landing_pages.ts` for name, title and description. The title is
"A Post and a Story Every Day, Made for You" (the site template adds "| Testify"). The `heroVariant`
field is not set on any LP, so every hero uses the default copy.

Open decisions and placeholders (all visible on the page):

- Campaign and offer angle: `[CONFIRM]`.
- Guarantee P4 ("No contract", "Cancel in 2 clicks") is unconfirmed (`[CONFIRM P4]`, FAQ Q7). Until the
  owner confirms it, it gates the caption in `open_sign_copy.ts`, the offer-stack price line, the P.S.
  and FAQ Q7. The caption, the price line and the P.S. carry `[CONFIRM P4]`. Strip them together when P4 is confirmed.
- Full-service and scope line: `[CONFIRM D8]` in `offer_99_offer_stack.tsx`.
- `[MONTH]`: `offer_99_problem.tsx`.
- `[N]`, `[DAY]`, `[TIME]`: `offer_99_how.tsx`, `offer_99_guarantee.tsx`, `offer_99_offer_stack.tsx`
  (the bonus list) and `offer_99_faq.tsx`.
- `[DATE]`: `offer_99_close.tsx`.
- `[NAME]` and `[ROLE]`: `offer_99_close.tsx` (P.S.) and `offer_99_faq.tsx` (email line).
- `[SETUP FEE]`: `offer_99_offer_stack.tsx`.
- Guarantee windows and terms (`[7]`, `[DAY]`, `[TIME]`, `[N]`): `offer_99_guarantee.tsx`.
- Trust row reads "Secure checkout" (no Stripe name) until the payment element is mounted:
  `offer_99_hero.tsx`.

Interactive: buy CTAs to the checkout, with attribution after mount (hero, offer stack, close, sticky
bar). Each click fires `checkout_click` with `placement` (`hero`, `offer`, `close`, `sticky`, or
`unknown`), with no value. Accordion. No forms.

Events: `page_view`, `lp_view` and `checkout_click`.

### Landing page: done-for-you-99-back (`/lp/done-for-you-99-back`)

Purpose: retargeting for visitors who looked and did not buy. It opens on the trial, objects, then
repeats the offer. Chrome: LP. Layout key `offer-99-retarget`, in
`components/lp/layouts/offer_99_retarget_layout.tsx`. Its section map is
`components/lp/sections/offer_99_retarget_sections.ts`. The section files hold the copy; no separate
brief exists for this page.

Sections in order (registry `sections`, seven ids; the P.S. follows the close):

1. `hero`: `Offer99RetargetHero` (`offer_99_retarget_hero.tsx`). Headline "Try a Month. Love It or
   It's Free.", one sub line, the two fact chips (`CHIPS` from `offer_99_hero.tsx`), the violet
   `BuyCta`, the trust row (`TRUST_ROW`, shared with the cold hero), and `ExampleWeek` (compact).
2. `objections`: `Offer99RetargetObjections` (`offer_99_retarget_objections.tsx`). Six cards, three per
   row from lg, no CTA.
3. `first-month`: `Offer99RetargetFirstMonth` (`offer_99_retarget_first_month.tsx`). Day-by-day list, no CTA.
4. `offer-stack`: `Offer99RetargetDeal` (`offer_99_retarget_deal.tsx`). Renders the cold
   `Offer99OfferStack`, so the copy and the ink `BuyCta` (placement `offer`) are the cold ones.
5. `guarantee`: `Offer99RetargetGuarantee` (`offer_99_retarget_guarantee.tsx`). Renders the cold
   `Offer99Guarantee`: the five promises in canonical wording, no close line, no CTA.
6. `final-cta`: `Offer99RetargetClose` (`offer_99_retarget_close.tsx`). Violet `BuyCta` (placement `close`)
   and the reply line.
7. `ps`: `Offer99RetargetPs` (same file). Signed P.S., no CTA.

`StickyBuyBar` follows, with the registry's `stickyBarText`.

Removed in the rebuild: the opening letter, the team block and the feed-post mock in the first-month
section. Their files are deleted.

Open placeholders: `[N]` and `[DAY]` in `offer_99_retarget_first_month.tsx`, `[DATE]` in
`offer_99_retarget_close.tsx` (twice), `[NAME]`, `[ROLE]` and `[N]` in `offer_99_retarget_close.tsx`
(P.S. signature and reply line), `hello@[DOMAIN]` in the same close file. `[SETUP FEE]` and the
bonus `[CONFIRM]` markers are in the cold `offer_99_offer_stack.tsx` (shared with this page).

Interactive: buy CTAs to `/lp/done-for-you-99/checkout`. No forms.

Events: `page_view` and `lp_view`.

### Checkout (`/lp/done-for-you-99/checkout`)

Purpose: the purchase page for the $99/month plan. The retargeting LP redirects here. Chrome: LP.
Page: `app/(lp)/lp/[slug]/checkout/page.tsx`, `dynamic = 'force-dynamic'`. Metadata:
`lpCheckoutMetadata`, always noindex, nofollow. Served only for an LP with an `offer`
(`lib/landing_pages.ts`).

Sections in order (`components/lp/checkout/checkout_body.tsx`, two columns under the intro):

1. Intro: `CheckoutIntro` (`checkout_intro.tsx`). Headline "Turn on your Open Sign.", lead "Two
   minutes. No contract. Cancel in 2 clicks."
2. Left column: `CheckoutPlanCard` (`checkout_plan_card.tsx`). The offer name, "$99/month, billed
   monthly", and four included items (`CheckList`, `checkout_check_list.tsx`).
3. Right column: `CheckoutForm` (`checkout_form.tsx`), sticky at large sizes. It holds the email
   field, first and last name, the business name, `PaymentElementSlot` (`payment_element_slot.tsx`),
   the payment error alert, the submit button "Start my plan for $99/month", the reassurance line
   `REASSURANCE_LINE` and the auto-renewal line.
4. `CheckoutTracker` (`components/lp/checkout_tracker.tsx`). Renders nothing.

Not rendered on this page (components kept in the folder): `CheckoutPromises`, `CheckoutFaq`,
`CheckoutTrustRow`, `AfterPaySteps` and `OrderSummary`. The footer carries the legal links on the LP
chrome. The confirmation page explains the next steps. The guarantee and the support line are folded
into `REASSURANCE_LINE`. There is no person card and no sticky buy bar on this page.

Copy: the component files. Prices come from the registry `offer`. Payment error copy is in
`payment_errors.ts`.

Open placeholders:

- `[7]-day refund` in `REASSURANCE_LINE` (`checkout_form.tsx:31`).
- `hello@[DOMAIN]` in two payment errors (`payment_errors.ts:36,39`).
- The reassurance and auto-renewal lines state refund and charge terms the owner has not signed off
  (decision 3).

Interactive:

- Field errors appear under each field. Submit with errors moves focus to the first invalid field.
  The fields are email, first name, last name and business name.
- Submit calls `startCheckout` (`lib/checkout.ts`), which POSTs to `/api/checkout`.
- A failed call shows a payment banner. Unknown codes use the network line.
  `checkout_not_configured` (503, no payments provider connected) falls into this fallback.
- A successful call stores the client secret and disables the button. No Payment Element is mounted,
  so nothing can be paid yet. This is a dead end until the Stripe packages and the element are
  added.
- The hosted-page branch exists but `CHECKOUT_UI_MODE` is `embedded_page` (`lib/checkout.ts:22`).

Not connected: Stripe.js and `@stripe/react-stripe-js` are not in `package.json`. The `TODO(stripe)`
in `payment_element_slot.tsx` lists the steps. Only the payments adapter in `lib/integrations` calls
Stripe on the server. Connecting it is covered in `INTEGRATIONS.md`.

Events:

- `checkout_view` on mount.
- `begin_checkout` on the first focus or pointer-down in the form.
- `add_payment_info` never fires yet. See Known gaps.

### Confirmation: purchase variant (`/lp/done-for-you-99/confirmation?session_id=...`)

Purpose: the page after a paid Stripe session. Chrome: LP. Page:
`app/(lp)/lp/[slug]/confirmation/page.tsx`, `dynamic = 'force-dynamic'`. Metadata:
`lpConfirmationMetadata`, always noindex, nofollow. Cache: `private, no-store`.

The page shows this variant only when `verifyConversion` (`lib/conversion_server.ts`) asks the
payments adapter and gets "paid". With no payments provider connected, the answer is not paid, and
the page shows `PaymentPending`. The session id is passed to the page's forms as `referenceId`.

Sections in order (`components/lp/confirmation/purchase_confirmation.tsx`):

1. Hero: "You're in" heading.
2. Onboarding form: `OnboardingForm` (`onboarding_form.tsx`). Fields are trade, town, mobile and
   where they post. Submit posts to `/api/onboarding` with `referenceId`. The route checks the
   session is paid, then saves the answers through the data store. The form stays disabled with a
   reason until the store answers connected. Photo upload stays disabled until the upload adapter is
   connected.
3. Next steps: `ProcessSteps` with `NEXT_STEPS` in the same file.
4. The person: a name, a role and a quote placeholder.
5. Quiet extras: `QuietExtrasForm` (`quiet_extras_form.tsx`). Send posts to `/api/feedback`. It
   stays disabled with a reason until the feedback store is connected.
6. Closing line: "Just ask [NAME]."

Shared behavior: both forms use `postJson` (`post_json.ts`). A thanks line shows only after an
adapter success. A not-connected answer (`not-connected`, `missing-env`, `not-implemented`) keeps
the form disabled with the pending reason, and no success is shown.

Copy: `purchase_confirmation.tsx`, `onboarding_form.tsx` and `quiet_extras_form.tsx`.

Open placeholders: `[DATE]` and `[DAY]` in the next steps. `[EMAIL]`. `[NAME]`, `[ROLE]`, `[FIRST
NAME]`. `hello@[DOMAIN]`. In `onboarding_form.tsx`, `[PHONE]` and the upload limit `[N] MB`.

Interactive: both forms post to their routes. Each stays disabled with a reason until its store or
adapter is connected. `pendingReason` shows "Coming soon." in production.

Events: `purchase_complete` (`ConversionTracker`, `components/lp/conversion_tracker.tsx`), once per
session id, and only when verified. The dedupe key is in localStorage (`tfy_conv:<event>:<id>`).

### Confirmation: lead variant (`/lp/<slug>/confirmation?lead=...`)

Purpose: the page after a lead form submit. No code issues a lead token, and no LP has a lead form
yet, so this variant is not reachable in practice.

Sections in order (`components/lp/confirmation/lead_confirmation.tsx`): a headline, a lead line and
four `ProcessSteps`. Every string is `[CONFIRM]`.

Events: `lead_submit` only when a valid `lead` token is present. Nothing emits one yet.

### Confirmation: pending variant (any session not verified as paid)

Purpose: neutral state while Stripe has not confirmed payment, or while keys are not set. Component:
`components/lp/confirmation/payment_pending.tsx`. It names no product, promises no receipt and fires
no purchase event. Copy line: "This usually takes a few seconds. Refresh this page in a minute."
Contains `[NAME]`, `[N]` and `hello@[DOMAIN]`.

### 404 (any unknown path)

Purpose: the root not-found page. Chrome: `SiteHeader`, `SiteFooter`, drawn by `app/not-found.tsx`.
Metadata: canonical cleared. Next adds noindex.

Sections: `NotFoundPanel` (`components/site/not_found_panel.tsx`) in `main`. The panel is marked
`data-placeholder`, so a pre-launch check can find it. Its copy is placeholder wording.

### Design specimen (`/design`)

Purpose: internal brand specimen for the style guide. It is noindex and not linked. It returns 404
when the launch flag is on. The page says to delete it once real pages exist. Chrome: none. It draws
its own `<main>` (`app/design/page.tsx`).

Sections in order (all placeholder copy):

1. Heading and lead (`DisplayHeading`).
2. Colour roles, type scale, spacing, radius, elevation.
3. Hero stack, CtaRow (quiet), ProgressCalendar, CalendarTile states, ProofRow, EmphasisPanel,
   Annotation, HonestyBlock and GuaranteeList, MediaFrame, ProcessSteps.
4. Design-system primitives under the theme: `DsSpecimen` (`components/design/ds_specimen.tsx`).

Copy: `app/design/page.tsx` and `ds_specimen.tsx`.

## How to add

**A site page** (for example `/pricing`):

1. Add a key to `RouteKey` and an entry to `routes` in `lib/site.config.ts`. Set `pageType`,
   `indexable`, `inSitemap`, `inNav` and an `updated` date.
2. Create `app/(site)/pricing/page.tsx`. Export `metadata = pageMetadata('<key>')` and wrap the body
   in `PageSkeleton routeKey="<key>"`.
3. Build the sections in `components/<area>/`. Use the shared pieces listed below.
4. Nav, footer, metadata and sitemap update from the registry. Legal pages also need an outline in
   `lib/legal.ts`.
5. Add the page here, and add its row to the overview table.

**A landing page** (one entry per ad):

1. Add an entry to `ENTRIES` in `lib/landing_pages.ts`. Set `slug`, `name`, `campaign`, `channel`,
   `offerAngle`, `layout`, `sections` (in order), `title`, `description`, `indexable: false`,
   `status: 'draft'` and `updated`. Add `offer` only if the LP sells directly. The slug is never
   renamed once it has traffic.
2. For a new layout, add its key to `LP_LAYOUT_KEYS`, write
   `components/lp/layouts/<key>_layout.tsx`, and register it in `LP_LAYOUTS` in
   `components/lp/layouts/index.ts`.
3. For a new section id, add it to `LP_SECTION_IDS`, add a label to `LP_SECTION_LABELS` in
   `components/lp/layouts/section_labels.ts`, and map it to a component in that layout's section
   map. The build fails if a layout cannot render a listed section.
4. For a new offer, add a case to `stripePriceId` in `lib/checkout_server.ts`, its env var to
   `lib/env.d.ts` and `.env.example`, and a Stripe price. Set the offer's checkout host.
5. Add the LP here.

**A work story** (the consent rule applies):

1. Add an entry to `ENTRIES` in `lib/work.ts`. Set `slug`, `clientName`, `trade`, `town`, the
   outcome, `timeframe`, `servicesUsed`, `featured`, `status`, `consent`, `cardFigures`, `stats`,
   `sections` and `content`.
2. Every listing figure caption needs "Source:". Every stat needs a source.
3. The story is public only when `status` is `published` and `consent` is `approved`. Anything else
   is a preview, visible only in `next dev` or with `NEXT_PUBLIC_WORK_PREVIEW=true`.
4. At most one public story can be `featured`.
5. Never publish a story whose client has not approved it. Placeholder copy alone does not keep a
   story private. Only the two fields do.

**A get-started field:**

1. Add a `FieldSpec` to the step's `fields` in `lib/get_started.ts` (`ABOUT_YOU`, `YOUR_BUSINESS` or
   `YOUR_GOALS`). Set `key`, `kind`, `label`, `required`, and the error copy.
2. For a choice, add a constant of options, such as `TEAM_SIZE_OPTIONS`.
3. The value is stored in sessionStorage under the step's `stateKey`. Nothing is sent anywhere.
4. Check the booked page and the booking step if the field must show up there.
5. Update this file's step section.

**Connect an outside provider** (payments, email, booking, data store, uploads):

1. Read `INTEGRATIONS.md` first. It lists the env switches and what each provider needs.
2. Add or fill the provider file under `lib/integrations/providers/`, and select it in the switch
   logic in `lib/integrations/index.ts`.
3. Call it only through `getIntegrations()` from route handlers or server code. Never import a
   provider from `components/`.
4. Document every new env var in `.env.example` and `lib/env.d.ts`.
5. Update the affected page section here, and the route's status in the overview table.

## Shared pieces

| Piece                  | File                                                                                                          | Notes                                                                                                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Site header            | `components/site/site_header.tsx`                                                                             | DS navbar. Nav from `siteConfig.nav` (Home, Our work, About, Contact). CTA from `siteConfig.cta`. Mobile menu. Scroll state from `chrome_hooks.ts`.                                                                  |
| Site footer            | `components/site/site_footer.tsx`                                                                             | Four columns: "Pages" from `siteConfig.nav`. "What we do" (four fixed lines). "Who we help" (four fixed lines). "Talk to us" (Get started, Contact support, and `[PHONE]`, `[EMAIL]`, `[AREA SERVED]` placeholders). |
| Footer bottom row      | `components/site/footer_parts.tsx`                                                                            | Copyright and `siteConfig.legal` (Privacy, Terms). Shared with the flow and LP footers.                                                                                                                              |
| Flow chrome            | `components/get_started/flow_header.tsx`, `flow_footer.tsx`                                                   | Wordmark and "Back to site". Legal row only.                                                                                                                                                                         |
| LP chrome              | `components/site/lp_header.tsx`, `lp_footer.tsx`                                                              | Wordmark only, and the legal row. No links.                                                                                                                                                                          |
| Shared chrome geometry | `components/site/chrome.tsx`                                                                                  | `CHROME_CONTAINER`, `Wordmark`, `copyrightLine`.                                                                                                                                                                     |
| SectionHeader          | `components/site/section_header.tsx`                                                                          | Kicker, one H2, one sub line. `size`: `display-xl`, `display`, `h2`.                                                                                                                                                 |
| ClosingCta             | `components/site/closing_cta.tsx`                                                                             | Closing block with the page's one violet CTA. Defaults to `siteConfig.cta`, attributed after mount.                                                                                                                  |
| FaqList                | `components/site/faq_list.tsx`                                                                                | DS accordion, card variant, collapsed on load.                                                                                                                                                                       |
| TestimonialCard        | `components/site/testimonial_card.tsx`                                                                        | Quote in the display face, optional attribution. The caller adds the quotation marks.                                                                                                                                |
| Phone mocks            | `components/home/hero_phones.tsx`, `components/work/phone_mock.tsx`, `components/about/about_phone_mocks.tsx` | Decorative, `aria-hidden`. `PhoneMock` and `ProfileGridMock` are in the work file.                                                                                                                                   |
| Sticky buy bar         | `components/lp/sticky_buy_bar.tsx`                                                                            | Props: `heroId`, `href`, `lpSlug`, `text`. Hidden while the hero is on screen. Appears without motion under reduced motion. Used by the offer layouts.                                                               |
| Buy CTA                | `components/lp/sections/buy_cta.tsx`                                                                          | Violet CTA to the checkout, attributed after mount. Keeps the `data-slot="cta"` hook.                                                                                                                                |
| Page skeleton          | `components/skeleton/page_skeleton.tsx`                                                                       | The `<main id="main-content">` with tracking attributes, and empty section slots.                                                                                                                                    |
| Providers              | `components/providers.tsx`                                                                                    | Analytics scripts, attribution capture, and `page_view` on each route change.                                                                                                                                        |

## Open owner decisions

These are gathered from placeholders and code comments. Each one blocks real copy or a real feature.

1. **Refund and guarantee terms.** The `[7]`-day refund in the checkout reassurance line
   (`checkout_form.tsx:31`). The late-week-is-free promise and the redo window `[N] business days`
   (`offer_99_guarantee.tsx`, `offer_99_retarget_guarantee.tsx`, `home_offer.tsx`,
   `about_promises.tsx`).
2. **Time figures.** Posts a month `[N]`, first posts by day `[N]`, and the post count in `[N] post
ideas` (`booking_step.tsx:107`). Reply time `[N] hours` appears in the LP team and close
   sections.
3. **Billing terms.** Setup fee `[SETUP FEE]` (`offer_99_offer_stack.tsx:114`,
   `offer_99_retarget_deal.tsx:64`). Tax treatment and the next charge date are not rendered on the
   checkout page now. The "Cancel in 2 clicks" claim stays on the checkout intro
   (`checkout_intro.tsx`).
4. **FAQ answers.** Eight of nine on home (`home_faq.tsx`). Two on checkout (`checkout_faq.tsx`).
   Sixteen on the cold offer (`offer_99_faq.tsx`). Two on the template LP (`template_faq.tsx`).
5. **Legal copy.** Every paragraph in `lib/legal.ts`. The effective date (`LEGAL_EFFECTIVE_DATE`).
   The governing-law state (`lib/legal.ts:113`). The legal entity:
   `siteConfig.organization.legalName` is "Testify" (`lib/site.config.ts:362`), and
   `lib/get_started.ts:7` names `[LEGAL ENTITY]`.
6. **Stripe.** Embedded or hosted checkout (`lib/checkout.ts:22`, marked `[CONFIRM]`). Whether to
   install the Stripe client packages and mount the Payment Element. The keys and price id in
   `.env.example`.
7. **Booking provider.** Which provider to connect (Cal.com, Calendly or Convex in
   `lib/integrations`). Who sends the confirmation email, so the visitor gets one email, not two.
   Whether to keep the fixed `SLOT_TIMES` fallback (`lib/get_started.ts:355`) for the mocked slots.
   The time zone list.
8. **Support email and domain.** `[DOMAIN]` in `support_email.ts`, `payment_errors.ts` and the LP
   team and close sections. The site URL, `NEXT_PUBLIC_SITE_URL`. Footer `[PHONE]`, `[EMAIL]`,
   `[AREA SERVED]` (`site_footer.tsx:105-107`). Press, partner and careers addresses. The receipt
   sender.
9. **Case-study consent.** All three samples are `consent: 'pending'`. No client has approved. The
   client names, services and quotes are placeholders (`lib/work.ts`).
10. **Offer name and price.** Both `siteConfig.offer.name` (`lib/site.config.ts:376`) and the LP
    offer (`lib/landing_pages.ts:162`) are "The Ready-to-Post Plan, monthly". The names match, but
    the owner has not signed them off. The offer description is still a placeholder. Keep both
    prices equal to 99.
11. **Campaign and offer angle for each LP.** All `[CONFIRM]` in `lib/landing_pages.ts`.
12. **Sample LP content.** The CTA label, proof figures and questions, and the process, honesty and
    guarantee copy on the template LP. Also whether the template LP gets a lead form at all.
13. **Lead confirmation copy.** Every string in `lead_confirmation.tsx`.
14. **Purchase confirmation.** The photo upload limit `[N] MB` and the upload endpoint
    (`onboarding_form.tsx:19,133`). The person card and the quote.
15. **Testimonials rule.** `home_testimonials.tsx:4-5` says the section renders only once two
    approved quotes exist. That line is a comment. No gate exists, and the section always renders.
    Decide whether to add the gate.
16. **Team.** Names, roles and photos on `about_team.tsx` and the offer team sections.
17. **Route titles and descriptions.** Each `routes` entry is marked "Placeholder" in
    `lib/site.config.ts`. So are the LP and story titles.
18. **Share image.** `siteConfig.shareImage` is `null` (`lib/site.config.ts:359`). `public/` holds
    only `icon.svg`.
19. **Analytics ids.** GA4, Google Ads and Meta Pixel are off until their env ids are set.
20. **Hero variants.** `closed` and `busiest` exist in code but no LP uses them. Decide whether to
    use them, or remove them.
21. **The `/design` route.** Delete it once real pages exist (`app/design/page.tsx:37`).
22. **Contact booking embed.** The owner's scheduling URL for `NEXT_PUBLIC_BOOKING_EMBED_URL`, and
    the host to allow in `next.config.js` if it is not Cal.com or Calendly. Until it is set, the
    page shows a placeholder calendar. Also confirm the headline "Book a time to talk." and its sub
    line "Pick a slot that suits you. 15 minutes, no prep."
    (`components/contact/contact_intro.tsx`). Support address: `components/contact/support_email.ts`
    still has `support@[DOMAIN]`.
23. **Contact router and footnotes.** The Sales and Support cards and the press, partner and jobs
    lines are no longer rendered (`app/(site)/contact/page.tsx`). Decide whether they return, or the
    files are deleted.

## Known gaps

These are code gaps, not owner decisions. They are listed so editors do not assume the behavior
works.

- `add_payment_info` never fires. `CheckoutForm` defines `onPaymentDetailsEntered`
  (`checkout_form.tsx:95`) and passes it down. `PaymentElementSlot` receives it
  (`payment_element_slot.tsx:22`) and discards it (`:36`). Nothing calls it.
- The checkout dead end: after a session is created, the button stays disabled with no payment
  fields.
- `lead_submit` has no source. No form posts a lead, and no code issues a `lead` token.
- The `sample-ad` form slot is empty.
- The rate limit is in memory, per serverless instance (`lib/api_guard.ts`). It only slows a single
  instance. A real limit needs a shared store.
- The `saveLead` method exists on the data-store adapter (`lib/integrations/types.ts`), but no code
  calls it. A lead flow is not built.
