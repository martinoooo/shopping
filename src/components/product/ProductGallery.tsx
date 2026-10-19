import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProductImage } from '@/lib/types'
import { SmartImage } from '@/components/ui'
import { useMediaQuery } from '@/lib/hooks'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  productName: string
  images: ProductImage[]
  className?: string
}

interface ThumbProps {
  image: ProductImage
  index: number
  total: number
  active: boolean
  onSelect: (index: number) => void
  className?: string
}

function Thumb({ image, index, total, active, onSelect, className }: ThumbProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`Show image ${index + 1} of ${total}`}
      aria-pressed={active}
      className={cn(
        'relative block aspect-[4/3] overflow-hidden border bg-cream/60 transition-[opacity,border-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
        active ? 'border-ink' : 'border-ink/10 opacity-60 hover:opacity-100',
        className,
      )}
    >
      <SmartImage src={image.src} alt="" className="h-full w-full" sizes="120px" eager />
    </button>
  )
}

/**
 * Editorial product gallery: full-bleed swipe rail on mobile, a vertical
 * thumbnail rail plus cursor-tracked zoom on desktop.
 */
export function ProductGallery({ productName, images, className }: ProductGalleryProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(null)
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')

  const count = images.length

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return
      const next = ((index % count) + count) % count
      setActive(next)
      const track = trackRef.current
      if (track) {
        // Keep this instant: CSS smooth scrolling inside a mandatory snap rail can
        // stall in some Chromium builds, so arrows/thumbnails jump directly.
        track.scrollTo({ left: next * track.clientWidth, behavior: 'auto' })
      }
    },
    [count],
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!track.clientWidth) return
        setActive(Math.round(track.scrollLeft / track.clientWidth))
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const onZoomMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!canHover) return
    const rect = event.currentTarget.getBoundingClientRect()
    setZoomOrigin({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    })
  }

  if (count === 0) {
    return (
      <div className={cn('aspect-[4/3] w-full bg-cream/60', className)} aria-hidden="true" />
    )
  }

  return (
    <div className={className}>
      <div className="lg:flex lg:gap-4">
        {/* Desktop thumbnail rail */}
        <div className="hidden w-[76px] shrink-0 flex-col gap-2.5 lg:flex">
          {images.map((image, index) => (
            <Thumb
              key={`${image.src}-rail`}
              image={image}
              index={index}
              total={count}
              active={active === index}
              onSelect={goTo}
              className="w-full"
            />
          ))}
        </div>

        {/* Main rail */}
        <div className="group relative min-w-0 flex-1">
          <div
            ref={trackRef}
            role="group"
            aria-label={`${productName} product images`}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          >
            {images.map((image, index) => (
              <div
                key={image.src}
                className="relative w-full shrink-0 snap-center overflow-hidden bg-cream/60"
              >
                <div
                  className={cn(
                    'relative aspect-[4/3] w-full overflow-hidden sm:aspect-[3/2]',
                    canHover && 'cursor-zoom-in',
                  )}
                  onMouseMove={onZoomMove}
                  onMouseLeave={() => setZoomOrigin(null)}
                >
                  <div
                    className="absolute inset-0 transition-transform duration-500 ease-out"
                    style={
                      canHover && active === index && zoomOrigin
                        ? {
                            transform: 'scale(1.8)',
                            transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                          }
                        : undefined
                    }
                  >
                    <SmartImage
                      src={image.src}
                      alt={image.alt}
                      eager={index === 0}
                      className="h-full w-full"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                aria-label="Show previous image"
                className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-paper/90 text-ink backdrop-blur-sm transition-all duration-300 hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:flex"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                aria-label="Show next image"
                className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-paper/90 text-ink backdrop-blur-sm transition-all duration-300 hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:flex"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </button>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-ink/55 px-2.5 py-1 text-[10px] font-medium tabular-nums tracking-[0.08em] text-paper backdrop-blur-sm"
              >
                {Math.min(active + 1, count)} / {count}
              </span>
            </>
          ) : null}
        </div>
      </div>

      {/* Mobile thumbnail row */}
      {count > 1 ? (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-5 sm:px-8 lg:hidden">
          {images.map((image, index) => (
            <Thumb
              key={`${image.src}-row`}
              image={image}
              index={index}
              total={count}
              active={active === index}
              onSelect={goTo}
              className="w-16 shrink-0"
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
