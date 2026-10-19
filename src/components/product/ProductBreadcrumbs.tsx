import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Product } from '@/lib/types'
import { CATEGORIES } from '@/data/products'
import { cn } from '@/lib/utils'

interface ProductBreadcrumbsProps {
  product: Product
  className?: string
}

const linkClass =
  'text-muted transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper'

export function ProductBreadcrumbs({ product, className }: ProductBreadcrumbsProps) {
  const category = CATEGORIES.find((item) => item.id === product.category)

  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex min-w-0 items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] sm:gap-2">
        <li className="shrink-0">
          <Link to="/" className={linkClass}>
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="shrink-0 text-muted/50">
          <ChevronRight className="h-3 w-3" strokeWidth={2} />
        </li>
        <li className="shrink-0">
          <Link to="/shop" className={linkClass}>
            Shop
          </Link>
        </li>
        {category ? (
          <>
            <li aria-hidden="true" className="shrink-0 text-muted/50">
              <ChevronRight className="h-3 w-3" strokeWidth={2} />
            </li>
            <li className="min-w-0 sm:shrink-0">
              <Link
                to={`/shop?category=${category.id}`}
                className={cn(linkClass, 'block truncate')}
              >
                {category.shortLabel}
              </Link>
            </li>
          </>
        ) : null}
        <li aria-hidden="true" className="shrink-0 text-muted/50">
          <ChevronRight className="h-3 w-3" strokeWidth={2} />
        </li>
        <li className="min-w-0 flex-1">
          <span aria-current="page" className="block truncate text-ink/70 normal-case tracking-normal">
            {product.name}
          </span>
        </li>
      </ol>
    </nav>
  )
}
