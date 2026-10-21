// Home dark panel (Paper "08 Dark panel - no view promises"): the one dark moment on the page.
// Two columns from lg up, as in Paper: kicker and title on the left, the sub and the six promises on the right.
// Server-safe: EmphasisPanel is a style-guide composition with no DS import.
import { EmphasisPanel } from '@testify/style-guide/components/EmphasisPanel'
import { PageSection } from '@testify/style-guide/components/PageSection'

const HOLD_US_TO = [
  'Your OK on every post.',
  'Your accounts stay yours.',
  'No long contracts. Leave any month.',
  'No hand-off to a stranger after the sale.',
  "No stock photos of someone else's work.",
  'No trends or dancing.',
] as const

export function HomeDarkPanel() {
  return (
    <PageSection flush width="grid" as="div">
      <EmphasisPanel
        id="home-dark-panel-heading"
        kicker="What you can hold us to"
        title="No view promises. No lock-in."
        width="wide"
        columns={2}
        bodyWidth="full"
        className="w-full"
      >
        <p>Most agencies sell you the report. We&apos;d rather you count the posts.</p>
        <div
          aria-hidden="true"
          className="flex aspect-[2/1] w-full items-end rounded-3xl border border-dashed border-brand-inverse-ink/40 p-5"
        >
          <span className="font-text text-brand-small font-semibold text-brand-inverse-ink-muted">
            Photo placeholder: owner at the truck
          </span>
        </div>
        <ul className="flex w-full flex-col">
          {HOLD_US_TO.map((item) => (
            <li
              key={item}
              className="border-t border-brand-inverse-ink/20 py-7 font-display text-brand-h3 text-brand-inverse-ink last:border-b"
            >
              {item}
            </li>
          ))}
        </ul>
      </EmphasisPanel>
    </PageSection>
  )
}
