import Image from 'next/image'
import type { ReactNode } from 'react'
import { cx } from './cx'

export type MediaFrameKind = 'video' | 'image'

export interface MediaFrameProps {
  kind: MediaFrameKind
  /** Media URL. Omit to render the empty slot (placeholder state). */
  src?: string
  /** Still frame for a video: what shows before play and under reduced motion. */
  poster?: string
  /** Accessible name: image alt text, or the video's label. */
  alt: string
  /** Optional caption under the frame. */
  caption?: ReactNode
  /** next/image sizes for kind="image". */
  sizes?: string
  className?: string
}

/**
 * 9:16 video or image slot, radius-card, white-on-canvas lift (no border).
 * Videos never autoplay: the poster is the resting still, so reduced-motion
 * users (and everyone else) see a still until they press play.
 */
export function MediaFrame({
  kind,
  src,
  poster,
  alt,
  caption,
  sizes = '(min-width: 768px) 320px, 80vw',
  className,
}: MediaFrameProps) {
  return (
    <figure className={cx('flex w-full max-w-xs flex-col gap-3', className)}>
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-card bg-brand-surface-sunken shadow-raised">
        {!src ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <span className="font-text text-brand-label text-brand-ink-muted">
              {kind === 'video' ? 'Video slot' : 'Image slot'}
            </span>
            <span className="font-text text-brand-small text-brand-ink-subtle">{alt}</span>
          </div>
        ) : kind === 'video' ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={src}
            {...(poster ? { poster } : {})}
            controls
            playsInline
            preload="none"
            aria-label={alt}
          />
        ) : (
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        )}
      </div>
      {caption ? (
        <figcaption className="font-text text-brand-small text-brand-ink-subtle">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
