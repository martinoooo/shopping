import type { Product, ProductOption, PurchaseType } from '@/lib/types'
import { SUBSCRIPTION_DISCOUNT } from '@/store/cart'
import { addBusinessDays, formatShortDate, roundCurrency } from '@/lib/utils'

/** Price of the chosen size (base product price + option delta). */
export function getListPrice(product: Product, size?: ProductOption): number {
  return roundCurrency(product.price + (size?.priceDelta ?? 0))
}

/** Effective price per unit — subscription lines carry the 15% discount. */
export function getUnitPrice(listPrice: number, purchaseType: PurchaseType): number {
  return purchaseType === 'subscribe' ? roundCurrency(listPrice * (1 - SUBSCRIPTION_DISCOUNT)) : listPrice
}

/**
 * Strikes-through price. Subscriptions are compared against the one-time price;
 * otherwise we honour the product's compare-at price (adjusted by the size delta).
 */
export function getCompareAtPrice(
  product: Product,
  listPrice: number,
  purchaseType: PurchaseType,
): number | undefined {
  if (purchaseType === 'subscribe') return listPrice
  if (!product.compareAtPrice) return undefined
  return roundCurrency(product.compareAtPrice + (listPrice - product.price))
}

export interface DeliveryEstimate {
  /** Short date range, e.g. "Oct 23 – Oct 27". */
  range: string
  /** Supporting line under the range. */
  note: string
}

/** Roast day for coffee — the roastery fires the drum on Tuesdays. */
const ROAST_WEEKDAY = 2
const BUSINESS_DAYS_EARLIEST = 2
const BUSINESS_DAYS_LATEST = 4

function atNoon(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(12, 0, 0, 0)
  return copy
}

function nextWeekday(from: Date, weekday: number): Date {
  const date = atNoon(from)
  date.setDate(date.getDate() + ((weekday - date.getDay() + 7) % 7))
  return date
}

function short(date: Date): string {
  return formatShortDate(date.toISOString())
}

/**
 * Coffee is roasted to order on Tuesdays, then ships and arrives in 2–4 business
 * days. Everything else leaves the studio within a business day.
 */
export function getDeliveryEstimate(product: Product, now = new Date()): DeliveryEstimate {
  if (product.category === 'coffee') {
    const roastDate = nextWeekday(now, ROAST_WEEKDAY)
    const earliest = addBusinessDays(roastDate, BUSINESS_DAYS_EARLIEST)
    const latest = addBusinessDays(roastDate, BUSINESS_DAYS_LATEST)
    return {
      range: `${short(earliest)} – ${short(latest)}`,
      note: `Roasted ${short(roastDate)}, shipped the same week.`,
    }
  }

  const earliest = addBusinessDays(now, BUSINESS_DAYS_EARLIEST)
  const latest = addBusinessDays(now, BUSINESS_DAYS_LATEST)
  return {
    range: `${short(earliest)} – ${short(latest)}`,
    note: 'Leaves our Portland studio within one business day.',
  }
}
