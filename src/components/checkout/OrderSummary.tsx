import { useState } from 'react'
import type { FormEvent } from 'react'
import { ChevronDown, ShoppingBag, Tag, X } from 'lucide-react'
import type { CartLine, CartTotals } from '@/lib/types'
import { Button } from '@/components/ui'
import { useCartStore, PROMO_CODES } from '@/store/cart'
import { useToast } from '@/store/ui'
import { cn, formatMoney } from '@/lib/utils'
import { OrderLineItems } from './OrderLineItems'
import { OrderTotals } from './OrderTotals'

interface OrderSummaryProps {
  lines: CartLine[]
  totals: CartTotals
}

function PromoCodeForm() {
  const promoCode = useCartStore((state) => state.promoCode)
  const applyPromo = useCartStore((state) => state.applyPromo)
  const setPromoCode = useCartStore((state) => state.setPromoCode)
  const pushToast = useToast()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onApply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = applyPromo(code)
    if (result.ok) {
      setCode('')
      setError(null)
      pushToast({ title: 'Promo code applied', description: result.message, tone: 'success' })
    } else {
      setError(result.message)
    }
  }

  if (promoCode) {
    return (
      <div className="mt-5 border-t border-ink/10 pt-4">
        <p className="field-label">Promo code</p>
        <div className="border border-forest/25 bg-forest/[0.05] px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-[13px] font-medium text-forest">
              <Tag className="h-3.5 w-3.5" aria-hidden="true" />
              {promoCode}
            </span>
            <button
              type="button"
              onClick={() => setPromoCode(null)}
              className="flex h-11 items-center gap-1 px-1 text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Remove
            </button>
          </div>
          <p className="mt-1 text-[11px] text-forest/80">
            {PROMO_CODES[promoCode]?.label ?? 'Applied'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onApply} className="mt-5 border-t border-ink/10 pt-4" noValidate>
      <label htmlFor="promo-code" className="field-label">
        Promo code
      </label>
      <div className="flex gap-2">
        <input
          id="promo-code"
          name="promoCode"
          type="text"
          value={code}
          onChange={(event) => {
            setCode(event.target.value.toUpperCase())
            if (error) setError(null)
          }}
          placeholder="WELCOME10"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'promo-code-error' : 'promo-code-hint'}
          className={cn(
            'field h-11 flex-1 text-[13px] uppercase placeholder:normal-case placeholder:tracking-normal',
            error && 'border-[#8F3A1D]/60 focus:border-[#8F3A1D]',
          )}
        />
        <Button type="submit" variant="surface" className="h-11 shrink-0 px-4">
          Apply
        </Button>
      </div>
      {error ? (
        <p id="promo-code-error" role="alert" className="mt-1.5 text-[12px] leading-snug text-[#8F3A1D]">
          {error}
        </p>
      ) : (
        <p id="promo-code-hint" className="mt-1.5 text-[11px] text-muted">
          Try <span className="font-medium text-ink">WELCOME10</span> for 10% off your first order.
        </p>
      )}
    </form>
  )
}

/** Sticky order summary; collapses into a toggleable panel on small screens. */
export function OrderSummary({ lines, totals }: OrderSummaryProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const promoCode = useCartStore((state) => state.promoCode)
  const freeShippingRemaining = totals.freeShippingRemaining

  return (
    <aside aria-label="Order summary" className="lg:sticky lg:top-28">
      <div className="surface-card">
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="order-summary-body"
          className="flex min-h-[56px] w-full items-center justify-between gap-3 px-5 py-4 text-left lg:hidden"
        >
          <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Order summary
          </span>
          <span className="flex items-center gap-2">
            <span className="text-[15px] font-medium tabular-nums text-ink">{formatMoney(totals.total)}</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted transition-transform duration-300',
                mobileOpen && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </span>
        </button>

        <div
          id="order-summary-body"
          className={cn('px-5 pb-5 pt-1 lg:block lg:px-6 lg:pb-6 lg:pt-6', mobileOpen ? 'block' : 'hidden')}
        >
          <h2 className="hidden font-display text-[19px] leading-tight text-ink lg:block">Order summary</h2>
          <p className="hidden text-[12px] text-muted lg:block">
            {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'} in your bag
          </p>

          <OrderLineItems lines={lines} className="mt-1 lg:mt-4" />

          {freeShippingRemaining > 0 ? (
            <p className="mt-4 border-t border-ink/10 pt-3 text-[11px] leading-relaxed text-muted">
              Add {formatMoney(freeShippingRemaining)} more for free standard shipping.
            </p>
          ) : (
            <p className="mt-4 border-t border-ink/10 pt-3 text-[11px] leading-relaxed text-muted">
              Free standard shipping unlocked.
            </p>
          )}

          <PromoCodeForm />

          <OrderTotals
            subtotal={totals.subtotal}
            discount={totals.discount}
            shipping={totals.shipping}
            tax={totals.tax}
            total={totals.total}
            promoCode={promoCode}
            className="mt-5 border-t border-ink/10 pt-4"
          />
          <p className="mt-4 text-[10.5px] leading-relaxed text-muted">
            Taxes are estimated for Oregon. Shipping is calculated for U.S. addresses only.
          </p>
        </div>
      </div>
    </aside>
  )
}
