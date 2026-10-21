// Quote card with optional attribution, from the Paper nav-and-footer board. Server-safe.

/**
 * Testimonial card from the Paper nav-footer board: a white card on the
 * canvas with a soft shadow and no border, the quote in the display face and
 * the attribution below it. Server-safe (no DS import). `quote` is shown as
 * given, so the caller supplies the quotation marks. The attribution lines
 * are optional and only render when given.
 */
export function TestimonialCard({
  quote,
  name,
  business,
  trade,
  source,
}: {
  quote: string
  name: string
  business?: string
  trade?: string
  source?: string
}) {
  const detail = [business, trade].filter(Boolean).join(', ')

  return (
    <figure className="flex flex-col justify-between gap-6 rounded-card bg-brand-surface p-brand-card shadow-raised">
      <blockquote className="font-display text-brand-h4 text-brand-ink">{quote}</blockquote>
      <figcaption className="flex flex-col gap-1">
        <span className="font-text text-brand-body-strong text-brand-ink">{name}</span>
        {detail ? (
          <span className="font-text text-brand-small text-brand-ink-muted">{detail}</span>
        ) : null}
        {source ? (
          <span className="font-text text-brand-caption text-brand-ink-subtle">{source}</span>
        ) : null}
      </figcaption>
    </figure>
  )
}
