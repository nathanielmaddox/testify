import { cx } from './cx'

export interface ProofFigure {
  /** The figure as displayed, e.g. "3.1x". Rendered with tabular figures. */
  value: string
  /** What the figure measures. */
  label: string
  /** Where the figure comes from. Required: no figure ships without a source. */
  source: string
}

export interface ProofRowProps {
  /** One to four figures. */
  figures: readonly [ProofFigure, ...ProofFigure[]]
  /**
   * The caveat paragraph under the row: who the figures describe and what they
   * do not promise. Optional. Pass it whenever the figures need a limit stated
   * (principle 3: honest means legible). Omit or leave empty and no caveat
   * element renders.
   */
  caveat?: string | undefined
  className?: string | undefined
}

/**
 * Figures + label + per-figure source + an optional caveat. Sources and the
 * caveat are 14px ink-subtle: quiet by size and position, never by contrast.
 * Markup is a description list; the value shows first visually but is read
 * label-first.
 */
export function ProofRow({ figures, caveat, className }: ProofRowProps) {
  return (
    <div className={cx('flex flex-col gap-6', className)}>
      <dl className="grid gap-brand-grid md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
        {figures.map((figure, index) => (
          <div
            key={`${index}-${figure.label}`}
            className="flex flex-col gap-1 border-t border-brand-border-strong pt-4"
          >
            <dt className="order-2 font-text text-brand-body-strong text-brand-ink">
              {figure.label}
            </dt>
            <dd className="order-1 font-display text-brand-h2 tabular-nums text-brand-ink">
              {figure.value}
            </dd>
            <dd className="order-3 font-text text-brand-small text-brand-ink-subtle">
              Source: {figure.source}
            </dd>
          </div>
        ))}
      </dl>
      {caveat ? (
        <p className="max-w-measure-caption font-text text-brand-small text-brand-ink-subtle">
          {caveat}
        </p>
      ) : null}
    </div>
  )
}
