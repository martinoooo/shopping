import { Link } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import type { Product } from '@/lib/types'
import { Badge, Price, SmartImage, StarRating } from '@/components/ui'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useToast } from '@/store/ui'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
  /** Tightens the card for horizontal rails. */
  compact?: boolean
}

/**
 * Shared product card — used on Home, Shop, Wishlist, related products and cart upsells.
 * Owned by the Lead so every surface stays visually consistent.
 */
export function ProductCard({ product, className, compact = false }: ProductCardProps) {
  const addLine = useCartStore((state) => state.addLine)
  const saved = useWishlistStore((state) => state.ids.includes(product.id))
  const toggleSaved = useWishlistStore((state) => state.toggle)
  const pushToast = useToast()

  const primary = product.images[0]
  const secondary = product.images[1]
  const meta =
    product.category === 'coffee'
      ? `${product.roast} roast`
      : product.type

  const onToggleSaved = () => {
    const added = toggleSaved(product.id)
    pushToast({
      title: added ? 'Saved to your list' : 'Removed from saved',
      description: product.name,
      tone: added ? 'success' : 'default',
    })
  }

  const onQuickAdd = () => {
    const size = product.sizes[0]
    if (!size) return
    addLine({
      product,
      size,
      grind: product.category === 'coffee' ? product.grinds?.[0] : undefined,
      quantity: 1,
    })
    pushToast({
      title: 'Added to your bag',
      description: `${product.name} · ${size.label}`,
      tone: 'success',
    })
  }

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="relative overflow-hidden bg-cream/60">
        <Link
          to={`/product/${product.slug}`}
          className="block aspect-[4/5] focus-visible:outline-none"
          aria-label={`View ${product.name}`}
        >
          <SmartImage
            src={primary?.src ?? ''}
            alt={primary?.alt ?? product.name}
            className="h-full w-full"
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {secondary ? (
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
              <SmartImage
                src={secondary.src}
                alt={secondary.alt}
                className="h-full w-full"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          ) : null}
        </Link>

        {product.badges.length > 0 ? (
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.badges.slice(0, 2).map((badge) => (
              <Badge key={badge} variant={badge === 'Bestseller' ? 'accent' : 'light'}>
                {badge}
              </Badge>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onToggleSaved}
          aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          aria-pressed={saved}
          className={cn(
            'absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-all duration-300',
            saved
              ? 'bg-accent text-[#FFF9F2]'
              : 'bg-paper/85 text-ink hover:bg-paper hover:text-accent',
          )}
        >
          <Heart className={cn('h-4 w-4', saved && 'fill-current')} strokeWidth={1.75} aria-hidden="true" />
        </button>

        {product.stock > 0 ? (
          <button
            type="button"
            onClick={onQuickAdd}
            aria-label={`Quick add ${product.name} to bag`}
            className="absolute bottom-3 right-3 z-20 hidden h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-paper text-ink opacity-0 shadow-md transition-all duration-300 ease-out hover:bg-ink hover:text-paper group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 sm:flex"
          >
            <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        ) : (
          <span className="absolute bottom-3 left-3 z-20 rounded-full bg-paper/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-muted">
            Sold out
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">{meta}</p>
        <h3
          className={cn(
            'mt-1.5 font-display leading-snug tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-accent',
            compact ? 'text-[17px]' : 'text-[19px]',
          )}
        >
          <Link to={`/product/${product.slug}`} className="focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted">
          {product.category === 'coffee' && product.notes?.length
            ? product.notes.join(' · ')
            : product.tagline}
        </p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <StarRating
              rating={product.rating}
              count={product.reviewCount}
              size="xs"
              countClassName="hidden sm:inline"
            />
            <Price value={product.price} compareAt={product.compareAtPrice} size="sm" />
          </div>
          {product.subscriptionEligible ? (
            <span className="hidden whitespace-nowrap pb-0.5 text-[10px] uppercase tracking-[0.1em] text-muted sm:inline">
              Subscribe&nbsp;·&nbsp;−15%
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
