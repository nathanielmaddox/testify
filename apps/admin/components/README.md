# components/

**No hand-rolled UI primitives.** Buttons, links, inputs, tables, cards, dialogs, navigation,
empty states and icons all come from `@otesse/design-system` (source: `vs_code/otesse_ds`). Files
here only _compose_ DS components and wire admin config into them. Never edit `otesse_ds`. If the
DS lacks something, it belongs in `@testify/style-guide` (brand tokens and compositions), never in
this app; never fork or restyle a DS component here.

## Rules

- **DS imports only in `'use client'` files.** A server component (anything in `app/` without
  `'use client'`) that imports the `@otesse/design-system` barrel makes the bundler resolve the
  whole barrel, hits its optional peers (`reactflow`, `@mapbox/mapbox-gl-draw`) and the page
  500s. Put DS usage in a small client module here and render it from the server page.
- Restyle with Tailwind utilities passed through a DS `className`/`classNames` prop for
  placement only (width, margin, alignment). A look the DS cannot express belongs in `@testify/style-guide`.
- Links: use the DS `Link` with `linkComponent={NextLink}` so Next client navigation and
  prefetch are kept.
- Admin data (name, nav, routes) comes from `lib/admin.config.ts`, never inline.
- No emojis in UI source or copy. Use DS icons.

## Layout

| Path                         | What                                                  |
| ---------------------------- | ----------------------------------------------------- |
| `providers.tsx`              | DS client providers (`ThemeProvider`), used by layout |
| `admin/admin_shell.tsx`      | DS sidebar and page frame, nav built from `navItems`  |
| `admin/not_found_panel.tsx`  | DS `Layout` + `EmptyState` for `app/not-found.tsx`    |
| `skeleton/page_skeleton.tsx` | Server-safe `<main>` + empty labelled section slots   |
