import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import {
  Annotation,
  CalendarTile,
  CtaRow,
  DisplayHeading,
  EmphasisPanel,
  GuaranteeList,
  HonestyBlock,
  Kicker,
  MediaFrame,
  PageSection,
  PricingLine,
  ProcessSteps,
  ProgressCalendar,
  ProofRow,
  type CalendarTileState,
} from '@testify/style-guide/components'
import {
  colorRoles,
  contrastRatio,
  elevationScale,
  radiusScale,
  roleHex,
  spaceScale,
  typeScale,
} from '@testify/style-guide/tokens'
import { DsSpecimen } from '@/components/design/ds_specimen'
import { siteConfig } from '@/lib/site.config'

/**
 * /design: THROWAWAY brand-layer specimen. noindex, not in the sitemap
 * (lib/site.config.ts routes) and not in the nav, and it 404s once the launch
 * flag (siteConfig.indexable) is on. Every piece of copy is a PLACEHOLDER.
 * Delete this route when the real pages exist.
 */
export const metadata: Metadata = {
  title: 'Design specimen',
  robots: { index: false, follow: false, noarchive: true },
  alternates: { canonical: null },
}

/** Static class strings so Tailwind generates them (keys from typeScale). */
const TYPE_CLASS: Record<string, string> = {
  'brand-display': 'font-display text-brand-display',
  'brand-h1': 'font-display text-brand-h1',
  'brand-h2': 'font-display text-brand-h2',
  'brand-h3': 'font-display text-brand-h3',
  'brand-h4': 'font-display text-brand-h4',
  'brand-lead': 'font-text text-brand-lead',
  'brand-body': 'font-text text-brand-body',
  'brand-body-strong': 'font-text text-brand-body-strong',
  'brand-label': 'font-text text-brand-label',
  'brand-button': 'font-text text-brand-button',
  'brand-small': 'font-text text-brand-small',
  'brand-caption': 'font-text text-brand-caption',
  'brand-overline': 'font-text text-brand-overline uppercase',
  'brand-hand': 'font-hand text-brand-hand',
}

const SHADOW_CLASS: Record<string, string> = {
  'shadow-raised': 'shadow-raised',
  'shadow-lifted': 'shadow-lifted',
  'shadow-overlay': 'shadow-overlay',
  'shadow-cta': 'shadow-cta',
}

const TILE_STATES: { state: CalendarTileState; day: number; label: string }[] = [
  { state: 'past', day: 1, label: 'Before you started' },
  { state: 'today', day: 2, label: 'Today' },
  { state: 'milestone', day: 3, label: 'Your 30 topics arrive' },
  { state: 'waiting', day: 4, label: 'First video being made' },
  { state: 'first', day: 6, label: 'Video 1 ready' },
  { state: 'done', day: 7, label: 'Video 2 ready' },
]

const CANVAS = roleHex('canvas')
const SURFACE = roleHex('surface')

function ratio(a: string, b: string): string {
  return `${contrastRatio(a, b).toFixed(2)}:1`
}

/**
 * One specimen section. Every section sits in the same 1200px PageSection, so
 * every heading starts on the same left edge; `width="content"` caps the
 * CONTENT at 880px (left-aligned) for blocks the system sets in `container`.
 * Headings use the system h2 (heading step, weight 800), as the README sets.
 */
function SpecimenBlock({
  title,
  note,
  width = 'grid',
  tone = 'canvas',
  children,
}: {
  title: string
  note?: string
  width?: 'content' | 'grid'
  tone?: 'canvas' | 'canvas-alt'
  children: ReactNode
}) {
  return (
    <PageSection width="grid" tone={tone}>
      <div className="flex flex-col gap-6">
        <h2 className="max-w-measure-heading text-balance font-display text-brand-h2 text-brand-ink">
          {title}
        </h2>
        {note ? (
          <p className="max-w-measure font-text text-brand-small text-brand-ink-subtle">{note}</p>
        ) : null}
      </div>
      <div
        className={
          width === 'content' ? 'flex max-w-content flex-col gap-8' : 'flex flex-col gap-8'
        }
      >
        {children}
      </div>
    </PageSection>
  )
}

export default function DesignSpecimenPage() {
  // Internal only: the route disappears the moment the site is allowed into search.
  if (siteConfig.indexable) notFound()

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
      <PageSection width="grid">
        <DisplayHeading
          level={1}
          kicker="Internal specimen, noindex"
          lead="Placeholder: every token, brand composition and themed DS primitive on one page. Not linked, not in the sitemap. Delete when real pages exist."
        >
          Testify brand layer
        </DisplayHeading>
      </PageSection>

      {/* ------------------------------------------------ Foundations */}
      <SpecimenBlock
        title="Colour roles"
        tone="canvas-alt"
        note="Contrast is WCAG 2.x against canvas (the page) and surface (cards). Text needs 4.5:1; borders and graphics need 3:1. ink-disabled and mark are exempt (disabled / decorative)."
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colorRoles.map((role) => (
            <li
              key={role.name}
              className="flex flex-col gap-3 rounded-card bg-brand-surface p-5 shadow-raised"
            >
              {/* The swatch carries the hairline so white roles still read on the white card. */}
              <span
                aria-hidden="true"
                className="h-14 w-full rounded-control border border-brand-border"
                style={{ backgroundColor: `var(--${role.name})` }}
              />
              <div className="flex flex-col gap-1">
                <p className="font-text text-brand-body-strong text-brand-ink">
                  {role.name} <span className="tabular-nums text-brand-ink-muted">{role.hex}</span>
                </p>
                <p className="font-text text-brand-small tabular-nums text-brand-ink-muted">
                  on canvas {ratio(role.hex, CANVAS)} / on surface {ratio(role.hex, SURFACE)}
                </p>
                <p className="font-text text-brand-small text-brand-ink-subtle">{role.usage}</p>
              </div>
            </li>
          ))}
        </ul>
      </SpecimenBlock>

      <SpecimenBlock
        title="Type scale"
        note="Fluid: about 1.2 at 360px opening to about 1.3 at 1280px. Display face Inter Tight, text face Inter, hand Caveat (optional brand slot)."
      >
        <ul className="flex flex-col gap-6">
          {typeScale.map((style) => (
            <li
              key={style.key}
              className="flex flex-col gap-2 border-b border-brand-border pb-6 last:border-b-0"
            >
              <p className="font-text text-brand-small tabular-nums text-brand-ink-subtle">
                text-{style.key} / {style.size} / lh {style.lineHeight} / {style.tracking} /{' '}
                {style.weight}
              </p>
              <p className={`${TYPE_CLASS[style.key] ?? ''} text-brand-ink`}>
                Placeholder: talk for two minutes, we do the rest.
              </p>
              <p className="font-text text-brand-small text-brand-ink-muted">{style.usage}</p>
            </li>
          ))}
        </ul>
      </SpecimenBlock>

      <SpecimenBlock
        title="Spacing"
        tone="canvas-alt"
        note="4px base. Section padding, gutter and card padding are fluid."
      >
        <ul className="flex flex-col gap-3">
          {spaceScale.map((step) => (
            <li key={step.name} className="flex items-center gap-4">
              {/* w-32 (128px) holds the longest label, "space-32 128px", on one line. */}
              <span className="w-32 shrink-0 whitespace-nowrap font-text text-brand-small tabular-nums text-brand-ink-muted">
                {step.name} {step.value}
              </span>
              <span className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-3 shrink-0 rounded-pill bg-brand-ink"
                  style={{ width: `var(--${step.name})` }}
                />
                <span className="font-text text-brand-small text-brand-ink-subtle">
                  {step.usage}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </SpecimenBlock>

      <SpecimenBlock title="Radius" note="Nested rule: inner = max(outer minus padding, 4px).">
        <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {radiusScale.map((step) => (
            <li key={step.name} className="flex flex-col gap-2">
              <span
                aria-hidden="true"
                className="h-24 border-2 border-brand-ink bg-brand-surface"
                style={{ borderRadius: `var(--${step.name})` }}
              />
              <span className="font-text text-brand-small text-brand-ink">{step.name}</span>
              <span className="font-text text-brand-small text-brand-ink-subtle">
                {step.tailwind}: {step.usage}
              </span>
            </li>
          ))}
        </ul>
      </SpecimenBlock>

      <SpecimenBlock
        title="Elevation"
        tone="canvas-alt"
        note="One family, three distances, plus the CTA glow. Never border and shadow together."
      >
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {elevationScale.map((step) => (
            <li
              key={step.name}
              className={`flex h-32 flex-col justify-end gap-1 rounded-card bg-brand-surface p-5 ${SHADOW_CLASS[step.tailwind] ?? ''}`}
            >
              <span className="font-text text-brand-body-strong text-brand-ink">
                {step.tailwind}
              </span>
              <span className="font-text text-brand-small text-brand-ink-subtle">{step.usage}</span>
            </li>
          ))}
        </ul>
      </SpecimenBlock>

      {/* ------------------------------------------------ Brand compositions */}
      <SpecimenBlock
        title="Hero stack: Kicker, DisplayHeading, CtaRow, PricingLine"
        width="content"
      >
        <DisplayHeading
          level={3}
          size="display"
          kicker="Placeholder"
          lead="Placeholder sub-line: two minutes a day, into your phone. We do the rest."
        >
          Placeholder: we make 30 videos for your <Annotation kind="underline">business</Annotation>
          .
        </DisplayHeading>
        <CtaRow
          href="/design"
          label="Placeholder: build my 30 videos"
          tone="action"
          caption={<PricingLine>Placeholder: $000 once. Topics in 24 hours.</PricingLine>}
        />
      </SpecimenBlock>

      <SpecimenBlock
        title="CtaRow, quiet (the repeated mid-page CTA)"
        tone="canvas-alt"
        width="content"
      >
        <CtaRow href="/design" label="Placeholder: see how it works" />
      </SpecimenBlock>

      <SpecimenBlock
        title="ProgressCalendar"
        note="Complete without JS and under reduced motion. With motion allowed, the fills clear on mount and land in sequence once 30% of the calendar is in view (~2.4s)."
      >
        <ProgressCalendar />
      </SpecimenBlock>

      <SpecimenBlock
        title="CalendarTile states"
        tone="canvas-alt"
        width="content"
        note="past, today, milestone (white + 2px ink, never violet), waiting, first, done."
      >
        <ol aria-label="Calendar tile states" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TILE_STATES.map((tile, index) => (
            <CalendarTile key={tile.state} {...tile} index={index} />
          ))}
        </ol>
      </SpecimenBlock>

      <SpecimenBlock
        title="ProofRow"
        width="content"
        note="Every figure has a source; the caveat is required by type."
      >
        <ProofRow
          figures={[
            { value: '0.0x', label: 'Placeholder figure one', source: 'placeholder source A' },
            { value: '00%', label: 'Placeholder figure two', source: 'placeholder source B' },
            { value: '000', label: 'Placeholder figure three', source: 'placeholder source C' },
          ]}
          caveat="Placeholder caveat: these numbers come from a placeholder group of clients and are not a promise of what you will see."
        />
      </SpecimenBlock>

      <SpecimenBlock
        title="EmphasisPanel (CTA sits under it, on the canvas)"
        tone="canvas-alt"
        width="content"
      >
        <EmphasisPanel
          id="specimen-emphasis"
          kicker="Placeholder"
          title="Placeholder: the only bit nobody can do for you."
        >
          <p>Placeholder body on the inverse panel, inverse-ink-muted at 48ch.</p>
        </EmphasisPanel>
        <CtaRow href="/design" label="Placeholder: start today" tone="action" />
      </SpecimenBlock>

      <SpecimenBlock
        title="Annotation"
        width="content"
        note="Decorative and aria-hidden. The page reads the same with enabled={false}."
      >
        <p className="font-display text-brand-h3 text-brand-ink">
          Placeholder: <Annotation kind="circle">thirty</Annotation> videos, one{' '}
          <Annotation kind="underline">month</Annotation>.
        </p>
        <div className="flex items-end gap-2">
          <Annotation kind="arrow" />
          <Annotation kind="note" note="placeholder note" />
        </div>
        <p className="font-display text-brand-h3 text-brand-ink">
          Switched off:{' '}
          <Annotation kind="circle" enabled={false}>
            thirty
          </Annotation>{' '}
          videos.
        </p>
      </SpecimenBlock>

      <SpecimenBlock
        title="HonestyBlock and GuaranteeList"
        tone="canvas-alt"
        width="content"
        note="Brand surfaces: white, radius-card, elevation-1, no border. Title and body share one left edge."
      >
        <HonestyBlock
          title="Placeholder: what we do not do"
          items={[
            'Placeholder: we do not post on your behalf.',
            'Placeholder: we do not promise a number of followers.',
            'Placeholder: we do not lock you into a contract.',
          ]}
          note="Placeholder note."
        />
        <GuaranteeList
          guarantees={[
            { title: 'Placeholder guarantee one', body: 'Placeholder body copy.' },
            { title: 'Placeholder guarantee two', body: 'Placeholder body copy.' },
          ]}
        />
      </SpecimenBlock>

      <SpecimenBlock
        title="MediaFrame"
        width="content"
        note="9:16 slot. Empty states shown; videos never autoplay, the poster is the still."
      >
        <div className="flex flex-wrap gap-6">
          <MediaFrame kind="video" alt="Placeholder: client video" caption="Placeholder caption." />
          <MediaFrame kind="image" alt="Placeholder: client still" />
        </div>
      </SpecimenBlock>

      <SpecimenBlock
        title="ProcessSteps"
        tone="canvas-alt"
        note="Exactly four. Finished steps take the done fill."
      >
        <ProcessSteps
          steps={[
            { title: 'Placeholder step one', body: 'Placeholder body.', done: true },
            { title: 'Placeholder step two', body: 'Placeholder body.' },
            { title: 'Placeholder step three', body: 'Placeholder body.' },
            { title: 'Placeholder step four', body: 'Placeholder body.' },
          ]}
        />
      </SpecimenBlock>

      {/* ------------------------------------------------ DS primitives */}
      <SpecimenBlock
        title="Design-system primitives under the theme"
        width="content"
        note="Form controls, buttons, inline links and alerts render through the brand wrappers in @testify/style-guide (DS props set in one place, never in the app). Everything else is the DS component exactly as the tokens leave it."
      >
        <Kicker>@otesse/design-system e7d37602</Kicker>
        <DsSpecimen />
      </SpecimenBlock>
    </main>
  )
}
