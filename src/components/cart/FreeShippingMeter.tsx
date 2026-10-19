import { Check, Truck } from 'lucide-react'
import { FREE_SHIPPING_THRESHOLD } from '@/store/cart'
import { formatMoney } from '@/lib/utils'

interface FreeShippingMeterProps {
  subtotal: number
  freeShippingRemaining: number
}

/** Progress toward the free-shipping threshold, shown at the top of the cart. */
export function FreeShippingMeter({ subtotal, freeShippingRemaining }: FreeShippingMeterProps) {
  const unlocked = freeShippingRemaining <= 0
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))

  return (
    <div className="border-b border-ink/10 bg-cream/40 px-5 py-4 sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12.5px] font-medium leading-snug text-ink">
          {unlocked
            ? 'Free standard shipping unlocked.'
            : `${formatMoney(freeShippingRemaining)} away from free shipping.`}
        </p>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
            unlocked ? 'bg-forest text-paper' : 'bg-ink/[0.06] text-ink/60'
          }`}
          aria-hidden="true"
        >
          {unlocked ? <Check className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
        </span>
      </div>

      <div
        className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-ink/10"
        role="progressbar"
        aria-label="Progress towards free shipping"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIPPING_THRESHOLD}
        aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            unlocked ? 'bg-forest' : 'bg-accent'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-[11px] text-muted">
        Free U.S. shipping on orders over {formatMoney(FREE_SHIPPING_THRESHOLD)}.
      </p>
    </div>
  )
}
