import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, ShoppingBag, X } from 'lucide-react'
import { Button, Drawer, EmptyState, buttonStyles } from '@/components/ui'
import { useCartStore, useCartTotals, FREE_SHIPPING_THRESHOLD, PROMO_CODES } from '@/store/cart'
import type { CartTotals } from '@/lib/types'
import { formatMoney } from '@/lib/utils'
import { FreeShippingMeter } from './FreeShippingMeter'
import { CartLineItem } from './CartLineItem'
import { CartUpsells } from './CartUpsells'

function CartFooter({ totals, onCheckout }: { totals: CartTotals; onCheckout: () => void }) {
  const promoCode = useCartStore((state) => state.promoCode)
  const promoLabel = promoCode ? (PROMO_CODES[promoCode]?.code ?? promoCode) : null

  return (
    <div className="px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:px-6">
      <dl className="space-y-1.5 text-[13px]">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-medium tabular-nums text-ink">{formatMoney(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && promoLabel ? (
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted">Discount · {promoLabel}</dt>
            <dd className="font-medium tabular-nums text-forest">−{formatMoney(totals.discount)}</dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        Shipping and taxes estimated at checkout. Free standard shipping over{' '}
        {formatMoney(FREE_SHIPPING_THRESHOLD)}.
      </p>

      <Button
        size="lg"
        fullWidth
        className="mt-4"
        onClick={onCheckout}
        rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
      >
        Checkout securely
      </Button>

      <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-muted">
        <Lock className="h-3 w-3" aria-hidden="true" />
        Secure checkout · Demo store
      </p>
    </div>
  )
}

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen)
  const lines = useCartStore((state) => state.lines)
  const closeCart = useCartStore((state) => state.closeCart)
  const totals = useCartTotals()
  const navigate = useNavigate()
  const closeRef = useRef<HTMLButtonElement>(null)

  // Drawer's built-in close button is hidden with `hideHeader`, so own the initial focus.
  useEffect(() => {
    if (!isOpen) return
    const timer = window.setTimeout(() => closeRef.current?.focus(), 80)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  const onCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <Drawer
      open={isOpen}
      onClose={closeCart}
      ariaLabel="Shopping bag"
      hideHeader
      footer={lines.length > 0 ? <CartFooter totals={totals} onCheckout={onCheckout} /> : undefined}
    >
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink/10 bg-paper px-5 py-5 sm:px-6">
        <div>
          <p className="eyebrow">Shopping bag</p>
          <h2 className="mt-1 font-display text-[22px] leading-tight text-ink">
            Your bag ({totals.itemCount})
          </h2>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={closeCart}
          aria-label="Close cart"
          className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {lines.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Start with a bag of freshly roasted coffee — or find the gear that makes it sing."
          className="py-20"
          action={
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  closeCart()
                  navigate('/shop?category=coffee')
                }}
                className={buttonStyles({ size: 'md' })}
              >
                Shop coffee
              </button>
              <button
                type="button"
                onClick={() => {
                  closeCart()
                  navigate('/shop')
                }}
                className="flex h-11 items-center px-2 text-[12px] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Browse all products
              </button>
            </div>
          }
        />
      ) : (
        <>
          <FreeShippingMeter
            subtotal={totals.subtotal}
            freeShippingRemaining={totals.freeShippingRemaining}
          />
          <ul className="divide-y divide-ink/10 px-5 sm:px-6" aria-label="Items in your bag">
            {lines.map((line) => (
              <CartLineItem key={line.lineId} line={line} />
            ))}
          </ul>
          <CartUpsells lines={lines} />
        </>
      )}
    </Drawer>
  )
}
