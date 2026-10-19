import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Heart,
  RotateCcw,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import type { Product, ProductOption, PurchaseType } from '@/lib/types'
import { Badge, Button, Price, QtyStepper, StarRating } from '@/components/ui'
import { FREE_SHIPPING_THRESHOLD, MAX_LINE_QUANTITY } from '@/store/cart'
import { useToast } from '@/store/ui'
import { useWishlistStore } from '@/store/wishlist'
import { cn, formatMoney } from '@/lib/utils'
import type { DeliveryEstimate } from './helpers'
import { OptionGroup } from './OptionGroup'
import { SubscribePicker } from './SubscribePicker'

interface PurchasePanelProps {
  product: Product
  size: ProductOption
  sizeId: string
  onSizeChange: (id: string) => void
  grind?: ProductOption
  grindId: string
  onGrindChange: (id: string) => void
  purchaseType: PurchaseType
  onPurchaseTypeChange: (type: PurchaseType) => void
  cadence: string
  onCadenceChange: (id: string) => void
  quantity: number
  onQuantityChange: (quantity: number) => void
  listPrice: number
  unitPrice: number
  compareAt?: number
  delivery: DeliveryEstimate
  soldOut: boolean
  onAddToBag: () => void
}

export function PurchasePanel({
  product,
  size,
  sizeId,
  onSizeChange,
  grind,
  grindId,
  onGrindChange,
  purchaseType,
  onPurchaseTypeChange,
  cadence,
  onCadenceChange,
  quantity,
  onQuantityChange,
  listPrice,
  unitPrice,
  compareAt,
  delivery,
  soldOut,
  onAddToBag,
}: PurchasePanelProps) {
  const pushToast = useToast()
  const saved = useWishlistStore((state) => state.ids.includes(product.id))
  const toggleSaved = useWishlistStore((state) => state.toggle)

  const isCoffee = product.category === 'coffee'
  const lowStock = !soldOut && product.stock <= 20
  const compareAtSaving = compareAt ? Math.max(0, compareAt - unitPrice) : 0
  const orderTotal = unitPrice * quantity
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - orderTotal)
  const meta = [product.type, product.roast ? `${product.roast} roast` : null]
    .filter(Boolean)
    .join(' · ')

  const onToggleSaved = () => {
    const added = toggleSaved(product.id)
    pushToast({
      title: added ? 'Saved to your list' : 'Removed from saved',
      description: product.name,
      tone: added ? 'success' : 'default',
    })
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {product.badges.map((badge) => (
          <Badge
            key={badge}
            variant={badge === 'Bestseller' ? 'accent' : badge === 'New' ? 'forest' : 'light'}
          >
            {badge}
          </Badge>
        ))}
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{meta}</p>
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        <h1 className="display-3 max-w-[30ch] text-balance">{product.name}</h1>
        <button
          type="button"
          onClick={onToggleSaved}
          aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          aria-pressed={saved}
          className={cn(
            '-mr-1 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            saved
              ? 'border-accent bg-accent text-[#FFF9F2]'
              : 'border-ink/15 bg-surface text-ink hover:border-ink/40 hover:text-accent',
          )}
        >
          <Heart className={cn('h-4 w-4', saved && 'fill-current')} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-muted">{product.tagline}</p>

      <a
        href="#reviews"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
        className="mt-4 inline-flex flex-wrap items-center gap-2 text-[12px] text-muted transition-colors duration-200 hover:text-accent"
        aria-label={`Read ${product.reviewCount} reviews of ${product.name}`}
      >
        <StarRating rating={product.rating} showValue size="sm" />
        <span className="link-underline">{product.reviewCount} reviews</span>
      </a>

      <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-2">
        <Price value={unitPrice} compareAt={compareAt} size="lg" />
        {purchaseType === 'subscribe' ? (
          <Badge variant="forest">Subscribe · −15%</Badge>
        ) : compareAtSaving > 0 ? (
          <Badge variant="accent">Save {formatMoney(compareAtSaving)}</Badge>
        ) : null}
      </div>
      <p className="mt-1.5 text-[12px] text-muted">
        {purchaseType === 'subscribe'
          ? `Per delivery · ${formatMoney(listPrice)} one-time`
          : [size.label, size.detail].filter(Boolean).join(' · ')}
      </p>

      <p
        className={cn(
          'mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]',
          lowStock ? 'text-accent' : 'text-muted',
        )}
      >
        <span
          aria-hidden="true"
          className={cn('h-1.5 w-1.5 rounded-full', soldOut ? 'bg-muted' : lowStock ? 'bg-accent' : 'bg-forest')}
        />
        {soldOut ? (
          <span>Sold out — this batch is spoken for.</span>
        ) : lowStock ? (
          <span>Only {product.stock} left</span>
        ) : (
          <span>In stock</span>
        )}
        <span className="text-muted">
          · {isCoffee ? 'Roasted to order in small batches' : 'Ships from our Portland studio'}
        </span>
      </p>

      <p className="mt-5 text-[13.5px] leading-relaxed text-muted">{product.description}</p>

      {isCoffee && product.notes && product.notes.length > 0 ? (
        <div className="mt-5">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted">Tasting notes</p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {product.notes.map((note) => (
              <li
                key={note}
                className="rounded-full border border-ink/15 bg-surface px-3 py-1 text-[12px] leading-none text-ink"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-7 border-t border-ink/10 pt-6">
        <OptionGroup
          label={product.optionLabel ?? 'Size'}
          name="product-size"
          options={product.sizes}
          value={sizeId}
          onChange={onSizeChange}
          columns={product.sizes.length === 1 ? 1 : product.sizes.length === 2 ? 2 : 3}
        />

        {isCoffee && product.grinds && product.grinds.length > 0 ? (
          <OptionGroup
            label="Grind"
            name="product-grind"
            options={product.grinds}
            value={grind?.id ?? grindId}
            onChange={onGrindChange}
            columns={2}
            className="mt-6"
          />
        ) : null}

        {product.subscriptionEligible ? (
          <SubscribePicker
            purchaseType={purchaseType}
            onPurchaseTypeChange={onPurchaseTypeChange}
            cadence={cadence}
            onCadenceChange={onCadenceChange}
            listPrice={listPrice}
            className="mt-6"
          />
        ) : null}
      </div>

      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted">Quantity</p>
          <QtyStepper
            value={quantity}
            onChange={onQuantityChange}
            min={1}
            max={MAX_LINE_QUANTITY}
            className="mt-2"
          />
        </div>
        <div className="text-right">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted">Total</p>
          <p className="mt-1.5 text-[17px] font-medium tabular-nums tracking-tight text-ink">
            {formatMoney(orderTotal)}
          </p>
        </div>
      </div>

      <Button
        id="add-to-bag"
        variant="accent"
        size="lg"
        fullWidth
        onClick={onAddToBag}
        disabled={soldOut}
        leftIcon={<ShoppingBag className="h-4 w-4" aria-hidden="true" />}
        className="mt-4"
      >
        {soldOut ? 'Sold out' : `Add to bag — ${formatMoney(orderTotal)}`}
      </Button>

      {soldOut ? (
        <p className="mt-3 text-center text-[12.5px] text-muted">
          This one is between harvests.{' '}
          <Link to="/shop?category=coffee" className="text-ink underline decoration-ink/30 underline-offset-4 hover:text-accent">
            Browse available lots
          </Link>
        </p>
      ) : null}

      <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
        <div className="flex items-start gap-3 py-3">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} aria-hidden="true" />
          <p className="text-[12.5px] leading-snug text-ink">
            <span className="font-medium">Arrives {delivery.range}</span>
            <span className="mt-0.5 block text-muted">{delivery.note}</span>
          </p>
        </div>
        <div className="flex items-start gap-3 py-3">
          <Truck className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} aria-hidden="true" />
          <p className="text-[12.5px] leading-snug text-muted">
            {freeShippingRemaining > 0 ? (
              <>
                Add <span className="font-medium text-ink">{formatMoney(freeShippingRemaining)}</span> more for
                free U.S. shipping.
              </>
            ) : (
              <>
                <span className="font-medium text-ink">Free U.S. shipping</span> on this order — over{' '}
                {formatMoney(FREE_SHIPPING_THRESHOLD)}.
              </>
            )}
          </p>
        </div>
        <div className="flex items-start gap-3 py-3">
          <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} aria-hidden="true" />
          <p className="text-[12.5px] leading-snug text-muted">
            <span className="font-medium text-ink">30-day happiness guarantee.</span> Easy returns, no questions.
          </p>
        </div>
      </div>
    </div>
  )
}
