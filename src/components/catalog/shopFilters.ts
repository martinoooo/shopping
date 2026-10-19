import type { CategoryId, Product, RoastLevel } from '@/lib/types'
import { BREW_METHODS, CATEGORIES, PRICE_BANDS, PRODUCTS, ROAST_LEVELS } from '@/data/products'

export type SortId = 'featured' | 'price-asc' | 'price-desc' | 'rating'

export const SORT_OPTIONS: ReadonlyArray<{ id: SortId; label: string }> = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
]

export interface ShopFilters {
  category: CategoryId | null
  roasts: RoastLevel[]
  methods: string[]
  priceBandId: string | null
  sort: SortId
  query: string
}

const uniq = <T,>(values: T[]): T[] => Array.from(new Set(values))

/** Reads the shop state out of the URL, ignoring anything malformed. */
export function parseShopFilters(params: URLSearchParams): ShopFilters {
  const rawCategory = params.get('category')
  const category = CATEGORIES.find((item) => item.id === rawCategory)?.id ?? null

  const roasts = uniq(
    (params.get('roast') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter((value): value is RoastLevel =>
        (ROAST_LEVELS as readonly string[]).includes(value),
      ),
  )

  const methods = uniq(
    (params.get('method') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter((value) => (BREW_METHODS as readonly string[]).includes(value)),
  )

  const rawPrice = params.get('price')
  const priceBandId = PRICE_BANDS.some((band) => band.id === rawPrice) ? rawPrice : null

  const rawSort = params.get('sort')
  const sort = SORT_OPTIONS.find((option) => option.id === rawSort)?.id ?? 'featured'

  return {
    category,
    roasts,
    methods,
    priceBandId,
    sort,
    query: (params.get('q') ?? '').trim(),
  }
}

/** Serialises shop state back into a canonical query string. */
export function buildShopSearchParams(filters: ShopFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.roasts.length > 0) params.set('roast', filters.roasts.join(','))
  if (filters.methods.length > 0) params.set('method', filters.methods.join(','))
  if (filters.priceBandId) params.set('price', filters.priceBandId)
  if (filters.sort !== 'featured') params.set('sort', filters.sort)
  if (filters.query) params.set('q', filters.query)
  return params
}

export function getPriceBand(id: string | null) {
  return id ? PRICE_BANDS.find((band) => band.id === id) : undefined
}

export function toggleFilterValue<T>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

/** Loose full-text match across the fields a shopper is likely to type. */
export function matchesSearch(product: Product, query: string): boolean {
  const term = query.trim().toLowerCase()
  if (!term) return true
  const haystack = [
    product.name,
    product.type,
    product.category,
    product.origin ?? '',
    product.region ?? '',
    product.roast ?? '',
    product.tagline,
    ...(product.notes ?? []),
    ...(product.brewMethods ?? []),
  ]
    .join(' ')
    .toLowerCase()
  return term.split(/\s+/).every((token) => haystack.includes(token))
}

const featuredRank = (product: Product): number =>
  product.bestseller ? 0 : product.isNew ? 1 : 2

/** Applies every filter, then sorts the result for display. */
export function filterAndSortProducts(filters: ShopFilters): Product[] {
  const band = getPriceBand(filters.priceBandId)

  const results = PRODUCTS.filter((product) => {
    if (filters.category && product.category !== filters.category) return false
    if (
      filters.roasts.length > 0 &&
      (!product.roast || !filters.roasts.includes(product.roast))
    ) {
      return false
    }
    if (
      filters.methods.length > 0 &&
      !(product.brewMethods ?? []).some((method) => filters.methods.includes(method))
    ) {
      return false
    }
    if (band && (product.price < band.min || product.price >= band.max)) return false
    return matchesSearch(product, filters.query)
  })

  return results.sort((a, b) => {
    switch (filters.sort) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating || b.reviewCount - a.reviewCount
      case 'featured':
      default:
        return (
          featuredRank(a) - featuredRank(b) ||
          b.rating - a.rating ||
          b.reviewCount - a.reviewCount
        )
    }
  })
}

export function countActiveFilters(filters: ShopFilters): number {
  return (
    (filters.category ? 1 : 0) +
    filters.roasts.length +
    filters.methods.length +
    (filters.priceBandId ? 1 : 0) +
    (filters.query ? 1 : 0)
  )
}

/** Static option counts used by the filter panel. */
export const FACET_COUNTS = {
  category: Object.fromEntries(
    CATEGORIES.map((category) => [
      category.id,
      PRODUCTS.filter((product) => product.category === category.id).length,
    ]),
  ) as Record<CategoryId, number>,
  roast: Object.fromEntries(
    ROAST_LEVELS.map((roast) => [
      roast,
      PRODUCTS.filter((product) => product.roast === roast).length,
    ]),
  ) as Record<RoastLevel, number>,
  method: Object.fromEntries(
    BREW_METHODS.map((method) => [
      method,
      PRODUCTS.filter((product) => product.brewMethods?.includes(method)).length,
    ]),
  ) as Record<string, number>,
  price: Object.fromEntries(
    PRICE_BANDS.map((band) => [
      band.id,
      PRODUCTS.filter((product) => product.price >= band.min && product.price < band.max)
        .length,
    ]),
  ) as Record<string, number>,
}
