# components/

**No hand-rolled UI primitives.** Buttons, links, inputs, cards, dialogs, tables, navigation,
headers, footers, empty states and icons all come from `@otesse/design-system`
(source: `vs_code/otesse_ds`). Files here only _compose_ DS components and wire site data into
them. Never edit `otesse_ds`. If the DS lacks something, it belongs in `@testify/style-guide` (brand
tokens and compositions), never in this app; never fork or restyle a DS component here.

## Rules

- **DS imports only in `'use client'` files.** A server component (anything in `app/` without
  `'use client'`) that imports the `@otesse/design-system` barrel makes the bundler resolve the
  whole barrel, hits its optional peers (`reactflow`, `@mapbox/mapbox-gl-draw`) and the page
  500s. Put DS usage in a small client module here and render it from the server page.
- Restyle with Tailwind utilities passed through a DS `className`/`classNames` prop for
  placement only (width, margin, alignment). A look the DS cannot express belongs in `@testify/style-guide`.
- Links: use the DS `Link` with `linkComponent={NextLink}` so Next client navigation and
  prefetch are kept. Button-looking links are `Link variant="button"`.
- Site data (name, nav, CTA, legal links) comes from the routes registry in
  `lib/site.config.ts`, never inline.

## Layout

| Path                         | What                                                                         |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `providers.tsx`              | DS client providers (`ThemeProvider`), used by layout                        |
| `site/site_header.tsx`       | DS `SkipLink` + `Navbar` + `Link`, `(site)` header                           |
| `site/site_footer.tsx`       | `(site)` footer composed from `footer_parts` (Paper layout)                  |
| `site/section_header.tsx`    | Server-safe kicker + H2 + sub opener for every section                       |
| `site/closing_cta.tsx`       | DS-backed closing block: kicker, headline, violet CTA                        |
| `site/faq_list.tsx`          | DS `Accordion` (card variant) for FAQ items                                  |
| `site/testimonial_card.tsx`  | Server-safe quote card with attribution                                      |
| `site/lp_header.tsx`         | DS `SkipLink` + `Navbar`, name only, `(lp)` header                           |
| `site/lp_footer.tsx`         | Legal + copyright bottom row only, `(lp)` footer                             |
| `site/not_found_panel.tsx`   | Style-guide `PageSection` + `DisplayHeading` + `CtaRow`, `app/not-found.tsx` |
| `skeleton/page_skeleton.tsx` | Server-safe `<main>` + empty labelled section slots                          |
| `lp/lp_form_slot.tsx`        | LP form slot naming its LP confirmation page                                 |
| `lp/layouts/`                | LP layout map (`LP_LAYOUTS`) + one file per layout                           |
| `legal/legal_page.tsx`       | Legal page layout: TOC, dates, sections (server-safe)                        |
