import { ShoppingBag } from 'lucide-react'
import type { PurchaseType } from '@/lib/types'
import { Button } from '@/components/ui'
import { useCartStore } from '@/store/cart'
import { formatMoney } from '@/lib/utils'

interface StickyBuyBarProps {
  productName: string
  unitPrice: number
  compareAt?: number
  purchaseType: PurchaseType
  soldOut: boolean
  onAddToBag: () => void
}

/**
 * Mobile-only persistent buy bar. Hidden while the cart drawer is open so the
 * drawer is never obscured, and omitted entirely for sold-out products.
 */
export function StickyBuyBar({
  productName,
  unitPrice,
  compareAt,
  purchaseType,
  soldOut,
  onAddToBag,
}: StickyBuyBarProps) {
  const isCartOpen = useCartStore((state) => state.isOpen)

  if (isCartOpen || soldOut) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 backdrop-blur-md safe-bottom lg:hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted">
            {productName}
          </p>
          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
            <span className="text-[16px] font-medium tabular-nums tracking-tight text-ink">
              {formatMoney(unitPrice)}
            </span>
            {purchaseType === 'subscribe' ? (
              <span className="text-[9.5px] font-medium uppercase tracking-[0.1em] text-forest">
                Subscribe · −15%
              </span>
            ) : compareAt && compareAt > unitPrice ? (
              <span className="text-[11px] tabular-nums text-muted line-through">
                {formatMoney(compareAt)}
              </span>
            ) : null}
          </div>
        </div>
        <Button
          type="button"
          variant="accent"
          size="md"
          onClick={onAddToBag}
          leftIcon={<ShoppingBag className="h-4 w-4" aria-hidden="true" />}
          className="shrink-0"
        >
          Add to bag
        </Button>
      </div>
    </div>
  )
}
