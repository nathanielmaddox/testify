import { useId, type ReactNode } from 'react'
import { cx } from './cx'

export type EmphasisPanelWidth = 'content' | 'wide' | 'full'

export interface EmphasisPanelProps {
  /** Panel headline. */
  title: ReactNode
  /** Heading level for the title. Default 2. */
  headingLevel?: 2 | 3 | undefined
  /** Optional overline above the title. */
  kicker?: ReactNode | undefined
  /** Body copy (inverse-ink-muted, 48ch). */
  children?: ReactNode | undefined
  /**
   * Panel width. Omit for today's behaviour (no width cap, the panel takes its
   * container's width). 'content' caps at 880px, 'wide' at 1200px, 'full' fills
   * the container explicitly.
   */
  width?: EmphasisPanelWidth | undefined
  /**
   * 1 (default) stacks kicker, title and body. 2 sets the heading block beside the
   * body from lg up, so a dark panel can hold a two-column grid.
   */
  columns?: 1 | 2 | undefined
  /**
   * Body column width. 'narrow' (default) caps the body at about 48ch, today's
   * behaviour. 'full' removes the cap so children can lay out their own grid, for
   * example two side-by-side lists.
   */
  bodyWidth?: 'narrow' | 'full' | undefined
  /** Id for the title. Generated when omitted; the section is named by this id. */
  id?: string | undefined
  className?: string | undefined
}

const WIDTH: Record<EmphasisPanelWidth, string> = {
  content: 'max-w-content',
  wide: 'max-w-grid',
  full: 'w-full',
}

/**
 * The one loud surface: the inverse gradient in a contained, radius-card block.
 * At most two per page, never full-bleed, no border + shadow. The CTA sits UNDER
 * it on the canvas (CtaRow), not inside it. Focus rings inside switch to
 * focus-inverse (white, >=7:1 on every gradient stop) by re-pointing --focus and
 * the DS --color-ring for this subtree. The section is named by its title; an id
 * is generated when none is passed, so aria-labelledby always resolves.
 */
export function EmphasisPanel({
  title,
  headingLevel = 2,
  kicker,
  children,
  width,
  columns = 1,
  bodyWidth = 'narrow',
  id,
  className,
}: EmphasisPanelProps) {
  const generatedId = useId()
  const titleId = id ?? generatedId
  const Heading = `h${headingLevel}` as const
  const two = columns === 2
  const header = (
    <>
      {kicker ? (
        <p className="font-text text-brand-overline uppercase text-brand-inverse-ink-muted">
          {kicker}
        </p>
      ) : null}
      <Heading
        id={titleId}
        className="max-w-measure-heading text-balance font-display text-brand-h2 text-brand-inverse-ink"
      >
        {title}
      </Heading>
    </>
  )
  const body = children ? (
    <div
      className={cx(
        bodyWidth === 'full' ? 'flex w-full flex-col' : 'flex max-w-measure-narrow flex-col',
        'gap-4 font-text text-brand-lead text-brand-inverse-ink-muted'
      )}
    >
      {children}
    </div>
  ) : null
  return (
    <section
      aria-labelledby={titleId}
      className={cx(
        'rounded-card bg-brand-inverse p-brand-card',
        two
          ? 'grid items-start gap-6 lg:grid-cols-2 lg:gap-brand-grid'
          : 'flex flex-col items-start gap-6',
        '[--color-ring:var(--focus-inverse-rgb)] [--focus:var(--focus-inverse)]',
        width ? WIDTH[width] : undefined,
        className
      )}
    >
      {two ? (
        <>
          <div className="flex flex-col items-start gap-6">{header}</div>
          {body}
        </>
      ) : (
        <>
          {header}
          {body}
        </>
      )}
    </section>
  )
}
