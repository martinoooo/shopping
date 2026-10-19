import { useState } from 'react'
import { Coffee } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SmartImageProps {
  src: string
  alt: string
  /** Sizing classes for the wrapper, e.g. "aspect-[4/5] w-full" */
  className?: string
  imgClassName?: string
  eager?: boolean
  sizes?: string
  objectPosition?: string
}

/**
 * Image wrapper with skeleton, fade-in and an on-brand fallback.
 * Load state is tracked per-URL instead of via a reset effect, so a cached image that
 * finishes loading before the effect runs can never be left stuck behind the skeleton.
 */
export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  eager = false,
  sizes,
  objectPosition,
}: SmartImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const [errorSrc, setErrorSrc] = useState<string | null>(null)

  const ready = loadedSrc === src
  const failed = errorSrc === src

  return (
    <div className={cn('relative overflow-hidden bg-cream/70', className)}>
      {!ready && !failed ? (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-cream via-paper to-cream/60"
          aria-hidden="true"
        />
      ) : null}

      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-cream/80 text-muted">
          <Coffee className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
          <span className="text-[10px] uppercase tracking-[0.18em]">Image coming soon</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          sizes={sizes}
          onLoad={() => setLoadedSrc(src)}
          onError={() => setErrorSrc(src)}
          style={objectPosition ? { objectPosition } : undefined}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out',
            ready ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0',
            imgClassName,
          )}
        />
      )}
    </div>
  )
}
