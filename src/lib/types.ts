/** Shared domain types for the storefront. */

export type CategoryId = 'coffee' | 'gear' | 'accessories'

export type RoastLevel = 'Light' | 'Medium' | 'Medium-Dark' | 'Dark'

export type PurchaseType = 'one-time' | 'subscribe'

export interface ProductOption {
  id: string
  label: string
  /** Short helper text, e.g. "250 g · serves ~16 cups" */
  detail?: string
  /** Added to the base product price. */
  priceDelta?: number
  disabled?: boolean
}

export interface ProductImage {
  src: string
  alt: string
}

export interface FlavorProfile {
  acidity: number
  sweetness: number
  body: number
}

export interface ProductDetailRow {
  label: string
  value: string
}

export interface Product {
  id: string
  slug: string
  name: string
  category: CategoryId
  /** Merchandising type, e.g. "Single origin", "Brew gear". */
  type: string
  tagline: string
  description: string
  story?: string
  price: number
  compareAtPrice?: number
  images: ProductImage[]
  badges: string[]
  rating: number
  reviewCount: number
  origin?: string
  region?: string
  altitude?: string
  process?: string
  varietal?: string
  roast?: RoastLevel
  notes?: string[]
  brewMethods?: string[]
  flavor?: FlavorProfile
  sizes: ProductOption[]
  /** Label for the first option group. Defaults to "Size". */
  optionLabel?: string
  grinds?: ProductOption[]
  details: ProductDetailRow[]
  includes?: string[]
  stock: number
  bestseller?: boolean
  isNew?: boolean
  subscriptionEligible?: boolean
  pairsWith?: string[]
}

export interface CategoryMeta {
  id: CategoryId
  label: string
  shortLabel: string
  description: string
  image: string
}

export interface CartLine {
  lineId: string
  productId: string
  slug: string
  name: string
  image: string
  size: string
  grind?: string
  purchaseType: PurchaseType
  cadence?: string
  /** Effective price per unit (subscription discount already applied). */
  unitPrice: number
  /** Undiscounted price per unit. */
  listPrice: number
  quantity: number
  maxQuantity: number
}

export interface AddLineInput {
  product: Product
  size: ProductOption
  grind?: ProductOption
  purchaseType?: PurchaseType
  cadence?: string
  quantity: number
}

export interface CartTotals {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  itemCount: number
  freeShippingRemaining: number
}

export interface ShippingDetails {
  firstName: string
  lastName: string
  email: string
  address: string
  apartment?: string
  city: string
  region: string
  postalCode: string
  country: string
  phone?: string
}

export interface Order {
  id: string
  createdAt: string
  lines: CartLine[]
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  promoCode: string | null
  shippingDetails: ShippingDetails
  estimatedDelivery: string
}

export interface Review {
  id: string
  productId: string
  author: string
  location: string
  rating: number
  title: string
  body: string
  date: string
  verified: boolean
}
