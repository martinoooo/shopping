import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AddLineInput,
  CartLine,
  CartTotals,
  Order,
  ProductOption,
  PurchaseType,
  ShippingDetails,
} from '@/lib/types'
import { addBusinessDays, clamp, roundCurrency } from '@/lib/utils'
import { SITE } from '@/lib/site'

export const SHIPPING_FLAT = 7.95
export const TAX_RATE = 0.08
export const SUBSCRIPTION_DISCOUNT = 0.15
export const FREE_SHIPPING_THRESHOLD = SITE.freeShippingThreshold
export const MAX_LINE_QUANTITY = 12

export interface PromoDefinition {
  code: string
  label: string
  kind: 'percent' | 'shipping'
  value: number
}

export const PROMO_CODES: Record<string, PromoDefinition> = {
  WELCOME10: {
    code: 'WELCOME10',
    label: '10% off your first order',
    kind: 'percent',
    value: 10,
  },
  FREESHIP: {
    code: 'FREESHIP',
    label: 'Free standard shipping',
    kind: 'shipping',
    value: 0,
  },
}

interface LineIdentity {
  productId: string
  size: ProductOption
  grind?: ProductOption
  purchaseType?: PurchaseType
  cadence?: string
}

export function buildLineId({ productId, size, grind, purchaseType = 'one-time', cadence }: LineIdentity): string {
  return [productId, size.id, grind?.id ?? 'whole-bean', purchaseType, cadence ?? 'once'].join('::')
}

export interface CartState {
  lines: CartLine[]
  promoCode: string | null
  lastOrder: Order | null
  isOpen: boolean
  addLine: (input: AddLineInput) => void
  removeLine: (lineId: string) => void
  updateQuantity: (lineId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  setPromoCode: (code: string | null) => void
  applyPromo: (code: string) => { ok: boolean; message: string }
  placeOrder: (details: ShippingDetails) => Order
}

export function computeSubtotal(lines: CartLine[]): number {
  return roundCurrency(lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0))
}

export function computeDiscount(lines: CartLine[], promoCode: string | null): number {
  const promo = promoCode ? PROMO_CODES[promoCode] : undefined
  if (!promo || promo.kind !== 'percent') return 0
  return roundCurrency(computeSubtotal(lines) * (promo.value / 100))
}

export function computeShipping(lines: CartLine[], promoCode: string | null): number {
  if (lines.length === 0) return 0
  const promo = promoCode ? PROMO_CODES[promoCode] : undefined
  if (promo?.kind === 'shipping') return 0
  return computeSubtotal(lines) >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT
}

export function computeTax(lines: CartLine[], promoCode: string | null): number {
  const taxable = Math.max(0, computeSubtotal(lines) - computeDiscount(lines, promoCode))
  return roundCurrency(taxable * TAX_RATE)
}

export function computeTotals(lines: CartLine[], promoCode: string | null): CartTotals {
  const subtotal = computeSubtotal(lines)
  const discount = computeDiscount(lines, promoCode)
  const shipping = computeShipping(lines, promoCode)
  const tax = computeTax(lines, promoCode)
  return {
    subtotal,
    discount,
    shipping,
    tax,
    total: roundCurrency(subtotal - discount + shipping + tax),
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    freeShippingRemaining: Math.max(0, roundCurrency(FREE_SHIPPING_THRESHOLD - subtotal)),
  }
}

function createOrderId(): string {
  return `EO-${Math.floor(10000 + Math.random() * 89999)}`
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      promoCode: null,
      lastOrder: null,
      isOpen: false,

      addLine: ({ product, size, grind, purchaseType = 'one-time', cadence, quantity }) => {
        const listPrice = roundCurrency(product.price + (size.priceDelta ?? 0))
        const unitPrice =
          purchaseType === 'subscribe'
            ? roundCurrency(listPrice * (1 - SUBSCRIPTION_DISCOUNT))
            : listPrice
        const lineId = buildLineId({
          productId: product.id,
          size,
          grind,
          purchaseType,
          cadence: purchaseType === 'subscribe' ? cadence : undefined,
        })

        set((state) => {
          const existing = state.lines.find((line) => line.lineId === lineId)
          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.lineId === lineId
                  ? { ...line, quantity: clamp(line.quantity + quantity, 1, MAX_LINE_QUANTITY) }
                  : line,
              ),
            }
          }

          const newLine: CartLine = {
            lineId,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images[0]?.src ?? '',
            size: size.label,
            grind: grind?.label,
            purchaseType,
            cadence: purchaseType === 'subscribe' ? cadence : undefined,
            unitPrice,
            listPrice,
            quantity: clamp(quantity, 1, MAX_LINE_QUANTITY),
            maxQuantity: MAX_LINE_QUANTITY,
          }
          return { lines: [...state.lines, newLine] }
        })
      },

      removeLine: (lineId) =>
        set((state) => ({ lines: state.lines.filter((line) => line.lineId !== lineId) })),

      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          lines: state.lines.map((line) =>
            line.lineId === lineId
              ? { ...line, quantity: clamp(quantity, 1, line.maxQuantity) }
              : line,
          ),
        })),

      clearCart: () => set({ lines: [], promoCode: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setPromoCode: (code) => set({ promoCode: code }),

      applyPromo: (code) => {
        const normalized = code.trim().toUpperCase()
        if (!normalized) {
          return { ok: false, message: 'Enter a promo code first.' }
        }
        const promo = PROMO_CODES[normalized]
        if (!promo) {
          return { ok: false, message: `“${normalized}” isn’t a valid code. Try WELCOME10.` }
        }
        set({ promoCode: promo.code })
        return { ok: true, message: `${promo.code} applied — ${promo.label}.` }
      },

      placeOrder: (details) => {
        const state = get()
        if (state.lines.length === 0) {
          throw new Error('Cannot place an order with an empty cart.')
        }
        const totals = computeTotals(state.lines, state.promoCode)
        const order: Order = {
          id: createOrderId(),
          createdAt: new Date().toISOString(),
          lines: state.lines.map((line) => ({ ...line })),
          subtotal: totals.subtotal,
          discount: totals.discount,
          shipping: totals.shipping,
          tax: totals.tax,
          total: totals.total,
          promoCode: state.promoCode,
          shippingDetails: details,
          estimatedDelivery: addBusinessDays(new Date(), 3).toISOString(),
        }
        set({ lastOrder: order, lines: [], promoCode: null, isOpen: false })
        return order
      },
    }),
    {
      name: 'ember-oak-cart-v1',
      partialize: (state) => ({
        lines: state.lines,
        promoCode: state.promoCode,
        lastOrder: state.lastOrder,
      }),
    },
  ),
)

export function useCartCount(): number {
  return useCartStore((state) => state.lines.reduce((sum, line) => sum + line.quantity, 0))
}

export function useCartTotals(): CartTotals {
  const lines = useCartStore((state) => state.lines)
  const promoCode = useCartStore((state) => state.promoCode)
  return useMemo(() => computeTotals(lines, promoCode), [lines, promoCode])
}
