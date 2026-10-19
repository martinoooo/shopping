import { Link } from 'react-router-dom'
import { ArrowRight, PackageSearch } from 'lucide-react'
import { buttonStyles } from '@/components/ui'
import { getBestsellers } from '@/data/products'
import { formatMoney } from '@/lib/utils'

const BESTSELLERS = getBestsellers(3)

/** Graceful fallback for an unknown / retired product slug. */
export function ProductNotFound() {
  return (
    <div className="container-shell flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink/60">
        <PackageSearch className="h-6 w-6" strokeWidth={1.4} aria-hidden="true" />
      </span>
      <p className="eyebrow mt-6">Product not found</p>
      <h1 className="display-2 mt-4 text-balance">We could not find that one.</h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
        It may have sold out for the season or moved to a new home. The good stuff is still on the
        shelf — start with a bestseller.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/shop" className={buttonStyles({ size: 'md' })}>
          Browse the shop
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link to="/shop?category=coffee" className={buttonStyles({ variant: 'outline', size: 'md' })}>
          Shop coffee
        </Link>
      </div>

      <div className="mt-12 w-full max-w-sm border-t border-ink/10 pt-6 text-left">
        <p className="eyebrow text-center">Popular right now</p>
        <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
          {BESTSELLERS.map((product) => (
            <li key={product.id}>
              <Link
                to={`/product/${product.slug}`}
                className="group flex items-center justify-between gap-4 py-3 text-[13px] text-ink transition-colors duration-200 hover:text-accent"
              >
                <span className="truncate">{product.name}</span>
                <span className="shrink-0 tabular-nums text-muted">{formatMoney(product.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
