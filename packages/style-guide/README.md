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

Theme DS components through the tokens in `tokens.css` first. Where no token reaches a part
(control height, Button radius, field message size, alert fills), the look is set ONCE, through
the DS component's own props (`size`, `radius`, `className`, `classNames`, `styles`,
`styleOverrides`), inside a brand wrapper in `src/components` (TextField, ActionButton,
Notice...). Apps never pass those props to a DS component; they use the wrapper. Remaining gaps
are listed at the end of this file.

Two DS merge facts every wrapper respects (the DS joins classes with tailwind-merge 3):

- tailwind-merge reads any unknown `text-<name>` as a COLOUR. A brand font-size key
  (`text-brand-body`) passed into a DS class list deletes the DS text colour, and vice versa.
  Wrappers pass plain Tailwind sizes (`text-base`, `text-sm`) next to brand colours.
- It does not recognise `rounded-control` / `rounded-card` as radii, so the DS `rounded-md`
  stays in the list and the winner depends on CSS emit order. Wrappers set radius through a DS
  prop (`radius`, `styleOverrides.borderRadius`) or an inline `var(--radius-*)` style.

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

| Namespace                   | Keys                                                                                                                                                                                                                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| colors                      | `brand-<role>` for every role (`bg-brand-canvas`, `text-brand-ink-muted`, ...)                                                                                                                                                                                                     |
| fontFamily                  | `font-display`, `font-text`, `font-hand`                                                                                                                                                                                                                                           |
| fontSize                    | `text-brand-display-xl` (Paper 112/104, hero H1 and closing H2 only) / `-display / -h1 / -h2 / -h3 / -h4 / -lead / -body / -body-strong / -body-lg (18/28) / -body-xl (20/32) / -label / -button / -small / -caption / -overline / -hand` / `-wordmark` (footer giant word, 200px) |
| borderRadius                | `rounded-card` (24-40 fluid), `rounded-media` (22), `rounded-control` / `rounded-tile` (14), `rounded-tile-sm` (8), `rounded-pill`                                                                                                                                                 |
| boxShadow                   | `shadow-raised`, `shadow-lifted`, `shadow-overlay`, `shadow-cta`                                                                                                                                                                                                                   |
| spacing                     | `brand-section`, `brand-gutter`, `brand-card`, `brand-grid` (all fluid); `brand-section-gap` (160px between sections, fluid to 80px) and `brand-heading-stack` (64px from a heading block to its content)                                                                          |
| maxWidth                    | `max-w-measure` (65ch), `-measure-narrow` (48ch), `-measure-heading` (22ch), `-measure-caption` (70ch), `max-w-content` (880), `max-w-grid` (1200), `max-w-form` (480)                                                                                                             |
| backgroundImage             | `bg-brand-inverse` (the EmphasisPanel gradient)                                                                                                                                                                                                                                    |
| transitionDuration / timing | `duration-brand-fast/base/slow/slower`, `ease-brand-standard/enter/exit`                                                                                                                                                                                                           |
| animation                   | `animate-brand-tile-fill`                                                                                                                                                                                                                                                          |

## Components

DS-free and server-safe: `PageSection`, `Kicker`, `DisplayHeading`, `PricingLine`, `ProofRow`,
`CalendarTile`, `EmphasisPanel`, `Annotation`, `MediaFrame`, `ProcessSteps`, `HonestyBlock`,
`GuaranteeList`.
`'use client'` (import the DS barrel): `CtaRow`, `ActionButton`, `SubmitButton`, `TextLink`,
`Notice`, `TextField`, `TextAreaField`, `SelectField`, `CheckboxField`, `RadioGroupField`,
`ChoiceChip`, `ChoiceChipGroup`, `TimePill`, `BookingDayCell`, `BookingDayGrid`, `BrandIcon`
(DS Icon with the lucide-react registry); and `ProgressCalendar`
(IntersectionObserver).

| Component        | Notes                                                                                                                                                                                                                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PageSection      | fluid section padding + gutter; `width` content (880) / grid (1200 at 1440; below that, the viewport minus the fluid gutter on each side) / form / prose; `stack` default (48px gap) / heading (64px)                                                                                                                               |
| BrandIcon        | `name` ArrowRight / Check / ChevronDown / ChevronLeft / ChevronRight / Info / Menu / Minus / Play / ShieldCheck / X; `size` xs-lg; decorative unless `label`                                                                                                                                                                        |
| Kicker           | overline pill above a headline (the only uppercase)                                                                                                                                                                                                                                                                                 |
| DisplayHeading   | h1-h4, display face, 22ch; `size` display-xl / display / h1-h4; optional `kicker` and one `lead`; `align` left (default) or center (centers kicker, headline and lead)                                                                                                                                                              |
| CtaRow           | DS Link `variant="button"`; `tone="action"` (violet, hero + close only) or `"quiet"` (ink)                                                                                                                                                                                                                                          |
| PricingLine      | 14px ink-subtle caption under the CTA, tabular figures                                                                                                                                                                                                                                                                              |
| ProofRow         | figures with per-figure `source`; `caveat` optional (no element when absent or empty). One column at base, two from md, auto-fit columns from lg                                                                                                                                                                                    |
| ProgressCalendar | 30 tiles in 2 columns at base, 3 from sm, 5 from md, 6 from lg; complete without JS and under reduced motion; fills on scroll-in (~2.4s)                                                                                                                                                                                            |
| CalendarTile     | states past / today / milestone / waiting / first / done; milestone is white + 2px ink                                                                                                                                                                                                                                              |
| EmphasisPanel    | the inverse gradient block; `width` content (880) / wide (1200) / full, omit for today's; `columns` 1 (default) or 2 (heading beside body from lg); `bodyWidth` narrow (default, about 48ch) or full (no cap, for a child grid); focus rings inside switch to white                                                                 |
| Annotation       | circle / underline / arrow / note; marks are aria-hidden; `enabled={false}` turns it off                                                                                                                                                                                                                                            |
| HonestyBlock     | "what we do not do" list on a brand surface; ink-subtle list bullets                                                                                                                                                                                                                                                                |
| GuaranteeList    | guarantees on brand surfaces; title and body share one left edge. One column at base, two from md. `columns` 3 (for three guarantees) adds three columns from lg                                                                                                                                                                    |
| MediaFrame       | `ratio` 9:16 (default) / 16:9 / 4:3 / 1:1 / auto; radius-card; video never autoplays (poster is the still); `captions` adds a caption track. Do not ship video without captions                                                                                                                                                     |
| ProcessSteps     | three to six steps (union of tuples); four is the original layout. One column at base, two from md, three (four for four steps) from lg                                                                                                                                                                                             |
| TextField        | DS FormField + Input: 48px, 16px text, radius-md, border-strong, white fill, 14px messages                                                                                                                                                                                                                                          |
| TextAreaField    | DS FormField + Textarea: same anatomy, at least 128px tall                                                                                                                                                                                                                                                                          |
| SelectField      | DS FormField + native DS Select: same anatomy as TextField                                                                                                                                                                                                                                                                          |
| CheckboxField    | DS Checkbox: border-strong box, radius-xs, 16px label, 48px row                                                                                                                                                                                                                                                                     |
| RadioGroupField  | DS RadioGroup: border-strong rings, 14px/500 group label, 16px options, 48px rows                                                                                                                                                                                                                                                   |
| ActionButton     | DS Button: pill, 48px, `tone` action / quiet, loading, `disabledReason` shown beside it                                                                                                                                                                                                                                             |
| SubmitButton     | ActionButton with `type="submit"`; keep it enabled and validate on submit                                                                                                                                                                                                                                                           |
| TextLink         | DS Link, inline: action-text, always underlined, 2px underline on hover, inherits size                                                                                                                                                                                                                                              |
| Notice           | DS InlineAlert with the `-bg` fill, `-border` edge and `-fg` icon per state                                                                                                                                                                                                                                                         |
| ChoiceChip       | DS Button, 44px pill. `multiple` = checkbox (`role="checkbox"`, 16px check when selected); default radio (`role="radio"`). `selected`, `disabled`, `onToggle(next)`                                                                                                                                                                 |
| ChoiceChipGroup  | `label` (required), `description`, `error`, `required` (asterisk, `aria-required` in single choice), `multiple`, `name` (id base). Single choice: radiogroup with a roving tabindex (selected chip, else the first), arrow keys move and select, Home/End go to the ends. Multiple: every chip tabbable. Chips wrap, never truncate |
| TimePill         | DS Button, 40px pill, full column width. `selected` (ink fill, `aria-pressed`), `disabled` (struck through), `onSelect`                                                                                                                                                                                                             |
| BookingDayCell   | DS Button, 40px circle. `day`, `selected` (ink, `aria-pressed`), `today` (ring, `aria-current="date"`), `disabled`, `onSelect`, `label` (accessible name), `aria-current` override. Use inside BookingDayGrid                                                                                                                       |
| BookingDayGrid   | `label` (required), 7-column group for the cells. One tab stop: the selected day, else today, else the first enabled day. Left/right move one day, up/down one week (skipping disabled days), Home/End to the ends. Weekday headers are the caller's                                                                                |

Optional fields: `TextField`, `TextAreaField` and `SelectField` take `optional` (default off).
It draws Paper's "Optional" pill beside the label. With it set, the label renders in a row
of its own instead of the DS FormField `label`, which accepts only a string. Same `htmlFor`,
same required mark and error colour.

A caller's `aria-describedby` is joined with the field's helper and error ids, not overwritten.

Field messages: the DS prints helper and error text at 12px with no icon and offers no slot for it
on Input / Textarea, so the field wrappers keep `helperText` / `error` out of the DS control,
wire `aria-invalid` + `aria-describedby` themselves and render the error with DS
`ValidationMessage` (14px, icon + words, danger-fg).

## Gaps (not themeable through DS tokens at e7d37602)

Closed by a brand wrapper (DS props, set once in this package):

- DS `Button` tops out at 40px and defaults to `rounded-md`: use `ActionButton` /
  `SubmitButton` (`radius="full"`, 48px, brand focus ring via `styleOverrides`).
- DS `Input` / `Select` / `Textarea` default to 24-36px with 12-14px text (iOS zooms on focus
  below 16px): use the field wrappers.
- DS `Checkbox` and `Radio` outline with `border-border` (1.28:1): use `CheckboxField` /
  `RadioGroupField` (border-strong, 3.64:1 on surface).
- DS `Link` default is ink with a hover-only underline: inline links use `TextLink`.
- DS `InlineAlert` fills are `bg-<state>/10` over the ground, grey on canvas with the text-safe
  `-fg` bases: use `Notice`.

Still open:

- DS `Icon` resolves `lucide="Name"` only through a `registry` prop at e7d37602, and the DS
  exports no registry. `BrandIcon` supplies that registry from `lucide-react`, a dependency of
  this package. Use `BrandIcon` for named icons; a `lucide` string passed to a DS Icon renders
  nothing.
- DS `SkipLink` takes no style prop where it is rendered; `tokens.css` section G restyles it
  through its `href="#main-content"` (inset 12px, ink pill, one 2px outline at 3px offset).
- DS `Accordion variant="card"` puts a `ring-offset-2` keyboard ring inside an
  `overflow-hidden` item, so the outer edge of the ring is clipped at the card edge.
- DS `Button` writes `--button-ring-width` / `--button-ring-offset` inline (2px/2px), so the
  root values do not reach it; `ActionButton` sets them through `styleOverrides`.
- DS `Link` button has no hover-shadow token, so `elevation-cta` + the 2px lift on the violet
  CTA is not applied.
- DS `Card` radius options stop at 12px (`xl`) and `variant="default"` pairs a border with
  `shadow-sm`; there is no token for card radius or elevation, so DS Cards cannot take
  `rounded-card` / `shadow-raised`. Only `variant="bordered"` (elevation-0) is used; default
  and elevated pair the border with a shadow and look alike.
- DS `Skeleton` writes `--skeleton-background` inline per tone, so only `--muted` steers it.
- Focus: the global outline in `tokens.css` skips brand DS Buttons, which carry `data-brand-ring`
  (ActionButton, ChoiceChip, TimePill, BookingDayCell). Those draw one ring through the DS
  focus-ring overrides. Confirm one ring per chip, pill and day cell in the browser check.
