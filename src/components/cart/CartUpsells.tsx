import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { CartLine, Product } from '@/lib/types'
import { getProductById } from '@/data/products'
import { SmartImage } from '@/components/ui'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/store/ui'
import { formatMoney } from '@/lib/utils'

interface CartUpsellsProps {
  lines: CartLine[]
}

/** Up to two compact add-on suggestions drawn from the pairsWith graph. */
export function CartUpsells({ lines }: CartUpsellsProps) {
  const addLine = useCartStore((state) => state.addLine)
  const closeCart = useCartStore((state) => state.closeCart)
  const pushToast = useToast()

  const suggestions = useMemo<Product[]>(() => {
    const inCart = new Set(lines.map((line) => line.productId))
    const picked = new Set<string>()
    const result: Product[] = []

    for (const line of lines) {
      const product = getProductById(line.productId)
      for (const id of product?.pairsWith ?? []) {
        if (inCart.has(id) || picked.has(id)) continue
        const candidate = getProductById(id)
        if (!candidate || candidate.stock === 0) continue
        picked.add(id)
        result.push(candidate)
        if (result.length >= 2) return result
      }
    }
    return result
  }, [lines])

  if (suggestions.length === 0) return null

  const onAdd = (product: Product) => {
    const size = product.sizes[0]
    if (!size) return
    addLine({
      product,
      size,
      grind: product.category === 'coffee' ? product.grinds?.[0] : undefined,
      quantity: 1,
    })
    pushToast({
      title: 'Added to your bag',
      description: `${product.name} · ${size.label}`,
      tone: 'success',
    })
  }

  return (
    <section className="border-t border-ink/10 px-5 py-5 sm:px-6" aria-labelledby="cart-upsells-heading">
      <h3 id="cart-upsells-heading" className="eyebrow">
        Pairs well with
      </h3>
      <ul className="mt-3 space-y-2">
        {suggestions.map((product) => {
          const image = product.images[0]
          return (
            <li
              key={product.id}
              className="flex items-center gap-3 border border-ink/10 bg-surface p-2 pr-3"
            >
              <SmartImage
                src={image?.src ?? ''}
                alt={image?.alt ?? product.name}
                className="h-14 w-14 shrink-0 rounded-[2px]"
                sizes="56px"
              />
              <div className="min-w-0 flex-1">
                <Link
                  to={`/product/${product.slug}`}
                  onClick={closeCart}
                  className="block truncate font-display text-[14px] leading-snug text-ink transition-colors hover:text-accent"
                >
                  {product.name}
                </Link>
                <p className="mt-0.5 text-[11px] text-muted">
                  {product.type} · {formatMoney(product.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onAdd(product)}
                aria-label={`Add ${product.name} to bag`}
                className="flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-ink/20 px-3.5 text-[12px] font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Add
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
