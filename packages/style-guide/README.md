# @testify/style-guide

The Testify brand layer. `@otesse/design-system` (pinned build `e7d37602`) supplies every
primitive; this package supplies the Testify look on top of it, and nothing else:

- role tokens mapped onto the DS CSS variables (`tokens.css`),
- NEW brand-named Tailwind keys (`preset`),
- the three brand faces through next/font (`fonts`),
- a matching Stripe Appearance (`stripe-appearance`),
- brand compositions built from DS primitives (`components`).

Values come from the Testify research pack (`tokens-final.json`, final-v1 2026-10-09). Change a
value there first, then here. Light only.

## The one rule: never redefine a DS key

Every Tailwind key in `preset.cjs` is new. The DS preset owns `rounded-sm/md/lg/xl/full`,
`shadow-sm/md/lg/xl/elevated/drawer-l`, `text-display/h1/h2/normal/body/small/tiny/micro`,
spacing `xs..3xl`, `duration-fast/normal/slow`, the `z-*` layers and the `primary`, `muted`,
`card`, `brand.*` ... colours. Redefining one does not error anywhere: the later preset wins
silently and every DS component built against that key changes look. Brand keys are prefixed
(`brand-*`) or brand-named (`rounded-card`, `shadow-raised`, `max-w-content`).

```bash
pnpm --filter @testify/style-guide check:keys   # fails on any overlap with the DS preset or Tailwind defaults
```

The preset also carries rank_and_rent's collision guard: it throws at load when a `boxShadow`
or `fontSize` key shares a name with a colour (`shadow-{name}` / `text-{name}` resolve against
both scales and the colour wins).

Never style a DS component with `className` / `styles` / `styleOverrides` to get the brand look;
theme it through the tokens in `tokens.css`. Where a token does not exist, the gap is listed at
the end of this file.

## Exports

| Export                                   | File                        | Kind                                    |
| ---------------------------------------- | --------------------------- | --------------------------------------- |
| `@testify/style-guide`                   | `src/index.ts`              | tokens data + Stripe appearance (TS)    |
| `@testify/style-guide/tokens.css`        | `src/tokens.css`            | CSS, `:root` variables + base rules     |
| `@testify/style-guide/tokens`            | `src/tokens.ts`             | token values as data, `contrastRatio()` |
| `@testify/style-guide/preset`            | `preset.cjs`                | CJS Tailwind v3 preset                  |
| `@testify/style-guide/fonts`             | `src/fonts.ts`              | next/font faces, `fontVariables`        |
| `@testify/style-guide/stripe-appearance` | `src/stripe-appearance.ts`  | `stripeAppearance`, `stripeFonts`       |
| `@testify/style-guide/components`        | `src/components/index.ts`   | every brand composition                 |
| `@testify/style-guide/components/<Name>` | `src/components/<Name>.tsx` | one composition                         |

## Wiring an app

```js
// apps/<app>/tailwind.config.js
module.exports = {
  presets: [require('@testify/config/tailwind-preset'), require('@testify/style-guide/preset')],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/style-guide/src/**/*.{ts,tsx}', // brand compositions
    './node_modules/@otesse/design-system/dist/**/*.{js,mjs}',
    '../../node_modules/@otesse/design-system/dist/**/*.{js,mjs}',
  ],
}
```

```tsx
// apps/<app>/app/layout.tsx (order matters)
import { fontVariables } from '@testify/style-guide/fonts'
import '@otesse/design-system/styles' // 1. Tailwind layers + DS defaults
import '@testify/style-guide/tokens.css' // 2. brand tokens (unlayered, wins)
import './globals.css' // 3. page-frame rules
// <html lang="en" className={fontVariables}>
```

`next.config.js`: add `'@testify/style-guide'` to `transpilePackages`.

## tokens.css

| Section | What                                                                                       |
| ------- | ------------------------------------------------------------------------------------------ |
| A       | Every colour role as `--<role>` (hex) and `--<role>-rgb` (triplet)                         |
| B       | DS mapping: `--color-primary` = ink, `--color-cta` / `--color-ring` = violet, ...          |
| C       | DS component tokens: `--link-button-*`, `--link-pill-*`, `--accordion-card-*`, ...         |
| D       | shadcn HSL fallbacks: only `--foreground` (Modal backdrop) and `--muted` (Skeleton)        |
| E       | `--brand-*` parity for the DS BrandProvider variables                                      |
| F       | type (`--text-*`, `--font-*-stack`, measures), space, radius, elevation, layout, motion, z |
| G       | body face/size override, `:focus-visible` ring, calendar keyframes, reduced motion         |

Deliberate choices:

- `--color-input` is `border-strong` (3.64:1), not the hairline `border` (1.28:1): input
  outlines must clear 3:1 (WCAG 1.4.11) and tokens-final names border-strong as the input role.
- Status `--color-{success,warning,error,info}` take the `-fg` values (text-safe), because the DS
  renders field messages as `text-error`; `-strong` matches.
- `--background`, `--border`, `--card` are not set as HSL: DS chart/map parts read
  `var(--background)` and Tabs reads `var(--border)` as full colours.

## Tailwind keys (preset)

| Namespace                   | Keys                                                                                                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| colors                      | `brand-<role>` for every role (`bg-brand-canvas`, `text-brand-ink-muted`, ...)                                                                                         |
| fontFamily                  | `font-display`, `font-text`, `font-hand`                                                                                                                               |
| fontSize                    | `text-brand-display / -h1 / -h2 / -h3 / -h4 / -lead / -body / -body-strong / -label / -button / -small / -caption / -overline / -hand`                                 |
| borderRadius                | `rounded-card` (24-40 fluid), `rounded-media` (22), `rounded-control` / `rounded-tile` (14), `rounded-tile-sm` (8), `rounded-pill`                                     |
| boxShadow                   | `shadow-raised`, `shadow-lifted`, `shadow-overlay`, `shadow-cta`                                                                                                       |
| spacing                     | `brand-section`, `brand-gutter`, `brand-card`, `brand-grid` (all fluid)                                                                                                |
| maxWidth                    | `max-w-measure` (65ch), `-measure-narrow` (48ch), `-measure-heading` (22ch), `-measure-caption` (70ch), `max-w-content` (880), `max-w-grid` (1200), `max-w-form` (480) |
| backgroundImage             | `bg-brand-inverse` (the EmphasisPanel gradient)                                                                                                                        |
| transitionDuration / timing | `duration-brand-fast/base/slow/slower`, `ease-brand-standard/enter/exit`                                                                                               |
| animation                   | `animate-brand-tile-fill`                                                                                                                                              |

## Components

DS-free and server-safe: `PageSection`, `Kicker`, `DisplayHeading`, `PricingLine`, `ProofRow`,
`CalendarTile`, `EmphasisPanel`, `Annotation`, `MediaFrame`, `ProcessSteps`.
`'use client'`: `CtaRow`, `HonestyBlock`, `GuaranteeList` (import the DS barrel) and
`ProgressCalendar` (IntersectionObserver).

| Component        | Notes                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------ |
| PageSection      | fluid section padding + gutter; `width` content (880) / grid (1200) / form / prose         |
| Kicker           | overline pill above a headline (the only uppercase)                                        |
| DisplayHeading   | h1-h4, display face, 22ch; optional `kicker` and one `lead`                                |
| CtaRow           | DS Link `variant="button"`; `tone="action"` (violet, hero + close only) or `"quiet"` (ink) |
| PricingLine      | 14px ink-subtle caption under the CTA, tabular figures                                     |
| ProofRow         | figures with per-figure `source`; `caveat` is required by type                             |
| ProgressCalendar | 30 tiles; complete without JS and under reduced motion; fills on scroll-in (~2.4s)         |
| CalendarTile     | states past / today / milestone / waiting / first / done; milestone is white + 2px ink     |
| EmphasisPanel    | the inverse gradient block; focus rings inside switch to white                             |
| Annotation       | circle / underline / arrow / note; marks are aria-hidden; `enabled={false}` turns it off   |
| HonestyBlock     | "what we do not do" list in a DS Card                                                      |
| GuaranteeList    | guarantees in DS Cards with a done-fg check                                                |
| MediaFrame       | 9:16 slot, radius-card; video never autoplays (poster is the still)                        |
| ProcessSteps     | exactly four steps (tuple type)                                                            |

## Gaps (not themeable through DS tokens at e7d37602)

Recorded instead of patched with className overrides:

- DS `Button` sizes top out at 40px tall (`xl`) and its radius is a prop, not a token, so a
  `Button` cannot match the 44px+ pill CTA. Use DS `Link variant="button"` for CTAs.
- DS `Button` writes `--button-ring-width` / `--button-ring-offset` inline (2px/2px), so the
  root values do not reach it; its offset colour is `ring-offset-background` (canvas).
- DS `Link` button has no hover-shadow token, so `elevation-cta` + the 2px lift on the violet
  CTA is not applied.
- DS `Card` radius options stop at 12px (`xl`) and `variant="default"` pairs a border with
  `shadow-sm`; there is no token for card radius or elevation, so DS Cards cannot take
  `rounded-card` / `shadow-raised`. Brand compositions use `variant="bordered"`.
- DS `Checkbox` outlines with `border-border` (the decorative hairline, 1.28:1 on white);
  there is no checkbox-border token, and retuning `--color-border` would darken every hairline.
- DS `Skeleton` writes `--skeleton-background` inline per tone, so only `--muted` steers it.
