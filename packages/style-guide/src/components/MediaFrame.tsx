import Image from 'next/image'
import type { ReactNode } from 'react'
import { cx } from './cx'

export type MediaFrameKind = 'video' | 'image'

/**
 * Frame aspect. '9:16' is the default (portrait video). 'auto' takes the media's
 * own ratio (the frame grows with the media) and keeps a 160px floor for the
 * empty slot.
 */
export type MediaFrameRatio = '9:16' | '16:9' | '4:3' | '1:1' | 'auto'

const RATIO: Record<MediaFrameRatio, string> = {
  '9:16': 'aspect-[9/16]',
  '16:9': 'aspect-[16/9]',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  auto: 'min-h-40',
}

/**
 * For ratio="auto" only: next/image needs width and height. They are an intrinsic
 * ratio hint, not a size; the class `h-auto` lets the image's own ratio decide.
 */
const AUTO_HINT = { width: 1600, height: 1200 } as const

export interface MediaFrameProps {
  kind: MediaFrameKind
  /** Aspect of the frame. Default '9:16'. */
  ratio?: MediaFrameRatio
  /** Media URL. Omit to render the empty slot (placeholder state). */
  src?: string
  /** Still frame for a video: what shows before play and under reduced motion. */
  poster?: string | undefined
  /**
   * Caption track for a video (WebVTT at `src`, language `srcLang`, shown as `label`).
   * Do not ship video without captions: spoken content is otherwise inaccessible.
   * Ignored for images.
   */
  captions?: { src: string; srcLang: string; label: string } | undefined
  /** Accessible name: image alt text, or the video's label. */
  alt: string
  /** Optional caption under the frame. */
  caption?: ReactNode
  /** next/image sizes for kind="image". */
  sizes?: string
  className?: string
}

/**
 * Video or image slot, radius-card, white-on-canvas lift (no border). Default
 * ratio is 9:16; pass `ratio` for 16:9, 4:3, 1:1 or auto.
 * Videos never autoplay: the poster is the resting still, so reduced-motion
 * users (and everyone else) see a still until they press play.
 */
export function MediaFrame({
  kind,
  ratio = '9:16',
  src,
  poster,
  captions,
  alt,
  caption,
  sizes = '(min-width: 768px) 320px, 80vw',
  className,
}: MediaFrameProps) {
  // 'auto' has no fixed box: the media sets its own height, so it is not absolutely positioned.
  const natural = ratio === 'auto'
  return (
    <figure className={cx('flex w-full max-w-xs flex-col gap-3', className)}>
      <div
        className={cx(
          'relative w-full overflow-hidden rounded-card bg-brand-surface-sunken shadow-raised',
          RATIO[ratio]
        )}
      >
        {!src ? (
          <div
            className={cx(
              'flex flex-col items-center justify-center gap-2 p-6 text-center',
              natural ? 'min-h-40' : 'absolute inset-0'
            )}
          >
            <span className="font-text text-brand-label text-brand-ink-muted">
              {kind === 'video' ? 'Video slot' : 'Image slot'}
            </span>
            <span className="font-text text-brand-small text-brand-ink-subtle">{alt}</span>
          </div>
        ) : kind === 'video' ? (
          <video
            className={cx(
              natural ? 'block h-auto w-full' : 'absolute inset-0 h-full w-full object-cover'
            )}
            src={src}
            {...(poster ? { poster } : {})}
            controls
            playsInline
            preload="none"
            aria-label={alt}
          >
            {captions ? (
              <track
                kind="captions"
                src={captions.src}
                srcLang={captions.srcLang}
                label={captions.label}
              />
            ) : null}
          </video>
        ) : natural ? (
          <Image
            src={src}
            alt={alt}
            width={AUTO_HINT.width}
            height={AUTO_HINT.height}
            sizes={sizes}
            className="block h-auto w-full"
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
