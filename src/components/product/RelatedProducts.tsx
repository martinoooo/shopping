import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/types'
import { ProductCard } from '@/components/catalog/ProductCard'
import { buttonStyles } from '@/components/ui'
import { getRelatedProducts } from '@/data/products'
import { cn } from '@/lib/utils'

interface RelatedProductsProps {
  product: Product
}

export function RelatedProducts({ product }: RelatedProductsProps) {
  const related = getRelatedProducts(product, 4)
  if (related.length === 0) return null

  return (
    <section className="border-t border-ink/10 py-16 md:py-24">
      <div className="container-shell">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Keep exploring</p>
            <h2 className="display-3 mt-3">Pairs well with.</h2>
          </div>
          <Link
            to="/shop"
            className={cn(buttonStyles({ variant: 'outline', size: 'sm' }), 'hidden shrink-0 sm:inline-flex')}
          >
            Shop all
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-6 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>

        <div className="mt-10 sm:hidden">
          <Link to="/shop" className={buttonStyles({ variant: 'outline', size: 'md', fullWidth: true })}>
            Shop all
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
