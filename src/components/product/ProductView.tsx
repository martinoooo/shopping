import { useState } from 'react'
import type { Product, PurchaseType } from '@/lib/types'
import { SUBSCRIPTION_CADENCES } from '@/data/products'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/store/ui'
import { ProductBreadcrumbs } from './ProductBreadcrumbs'
import { ProductGallery } from './ProductGallery'
import { ProductInfo } from './ProductInfo'
import { ProductNotes } from './ProductNotes'
import { ProductReviews } from './ProductReviews'
import { PurchasePanel } from './PurchasePanel'
import { RelatedProducts } from './RelatedProducts'
import { StickyBuyBar } from './StickyBuyBar'
import { getCompareAtPrice, getDeliveryEstimate, getListPrice, getUnitPrice } from './helpers'

interface ProductViewProps {
  product: Product
}

/** Stateful PDP shell: owns the selection so the buy panel and sticky bar agree. */
export function ProductView({ product }: ProductViewProps) {
  const addLine = useCartStore((state) => state.addLine)
  const openCart = useCartStore((state) => state.openCart)
  const pushToast = useToast()

  const [sizeId, setSizeId] = useState(product.sizes[0]?.id ?? '')
  const [grindId, setGrindId] = useState(product.grinds?.[0]?.id ?? '')
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('one-time')
  const [cadence, setCadence] = useState(SUBSCRIPTION_CADENCES[1]?.id ?? SUBSCRIPTION_CADENCES[0].id)
  const [quantity, setQuantity] = useState(1)

  const size = product.sizes.find((option) => option.id === sizeId) ?? product.sizes[0]
  const grind = product.grinds?.find((option) => option.id === grindId) ?? product.grinds?.[0]

  if (!size) {
    return (
      <div className="container-shell py-24 text-center text-sm text-muted">
        This product is not available right now.
      </div>
    )
  }

  const listPrice = getListPrice(product, size)
  const unitPrice = getUnitPrice(listPrice, purchaseType)
  const compareAt = getCompareAtPrice(product, listPrice, purchaseType)
  const delivery = getDeliveryEstimate(product)
  const soldOut = product.stock <= 0

  const onAddToBag = () => {
    if (soldOut) return
    addLine({
      product,
      size,
      grind: product.category === 'coffee' ? grind : undefined,
      purchaseType,
      cadence: purchaseType === 'subscribe' ? cadence : undefined,
      quantity,
    })
    openCart()

    const cadenceLabel = SUBSCRIPTION_CADENCES.find((option) => option.id === cadence)?.label
    const details = [
      product.name,
      size.label,
      product.category === 'coffee' ? grind?.label : null,
      `Qty ${quantity}`,
      purchaseType === 'subscribe' ? `Subscription · ${cadenceLabel}` : null,
    ].filter(Boolean)

    pushToast({
      title: 'Added to your bag',
      description: details.join(' · '),
      tone: 'success',
    })
  }

  return (
    <div className="pb-24 lg:pb-0">
      <div className="container-shell pt-5 sm:pt-7">
        <ProductBreadcrumbs product={product} />
      </div>

      <div className="container-shell mt-6 lg:mt-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="-mx-5 sm:-mx-8 lg:sticky lg:top-[112px] lg:col-span-7 lg:mx-0 lg:self-start">
            <ProductGallery productName={product.name} images={product.images} />
            <ProductNotes product={product} className="mt-8 hidden lg:block" />
          </div>
          <div className="lg:col-span-5">
            <PurchasePanel
              product={product}
              size={size}
              sizeId={size.id}
              onSizeChange={setSizeId}
              grind={grind}
              grindId={grind?.id ?? ''}
              onGrindChange={setGrindId}
              purchaseType={purchaseType}
              onPurchaseTypeChange={setPurchaseType}
              cadence={cadence}
              onCadenceChange={setCadence}
              quantity={quantity}
              onQuantityChange={setQuantity}
              listPrice={listPrice}
              unitPrice={unitPrice}
              compareAt={compareAt}
              delivery={delivery}
              soldOut={soldOut}
              onAddToBag={onAddToBag}
            />
            <ProductNotes
              product={product}
              className="mt-12 border-t border-ink/10 pt-8 lg:hidden"
            />
          </div>
        </div>
      </div>

      <ProductInfo product={product} />
      <ProductReviews product={product} />
      <RelatedProducts product={product} />

      <StickyBuyBar
        productName={product.name}
        unitPrice={unitPrice}
        compareAt={compareAt}
        purchaseType={purchaseType}
        soldOut={soldOut}
        onAddToBag={onAddToBag}
      />
    </div>
  )
}
