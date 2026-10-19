import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Trash2 } from 'lucide-react'
import { getBestsellers, getProductsByIds } from '@/data/products'
import { Button, EmptyState, buttonStyles } from '@/components/ui'
import { ProductCard } from '@/components/catalog/ProductCard'
import { useToast } from '@/store/ui'
import { useWishlistStore } from '@/store/wishlist'
import { usePageTitle } from '@/lib/hooks'
import { pluralize } from '@/lib/utils'

export default function Wishlist() {
  usePageTitle('Saved items')
  const ids = useWishlistStore((state) => state.ids)
  const clear = useWishlistStore((state) => state.clear)
  const pushToast = useToast()

  const products = getProductsByIds(ids)

  const onClear = () => {
    clear()
    pushToast({
      title: 'Saved list cleared',
      description: 'The items you had saved are no longer on this device.',
      tone: 'default',
    })
  }

  return (
    <div className="container-shell py-10 md:py-14">
      <nav
        aria-label="Breadcrumb"
        className="text-[10.5px] uppercase tracking-[0.16em] text-muted"
      >
        <Link to="/" className="transition-colors hover:text-ink">
          Home
        </Link>
        <span className="mx-2 text-ink/30" aria-hidden="true">
          /
        </span>
        <span className="text-ink">Saved</span>
      </nav>

      <header className="mt-6 flex flex-col gap-5 border-b border-ink/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Saved</p>
          <h1 className="display-2 mt-3">Your saved list.</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            {products.length > 0
              ? `${pluralize(products.length, 'piece')} you are keeping an eye on. Saved on this device.`
              : 'A quiet place for the things you love. Saved on this device.'}
          </p>
        </div>
        {products.length > 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Clear saved
          </Button>
        ) : null}
      </header>

      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            description="Tap the heart on any product to keep it here for later. Your list stays on this device."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/shop" className={buttonStyles({ size: 'md' })}>
                  Browse the shop
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/shop?category=coffee"
                  className={buttonStyles({ variant: 'outline', size: 'md' })}
                >
                  Shop the coffee
                </Link>
              </div>
            }
            className="border border-ink/10 bg-surface"
          />

          <section className="mt-16" aria-labelledby="saved-suggestions-heading">
            <div className="flex items-end justify-between gap-4 border-b border-ink/10 pb-5">
              <div>
                <p className="eyebrow">A place to start</p>
                <h2 id="saved-suggestions-heading" className="display-3 mt-2">
                  House favourites.
                </h2>
              </div>
              <Link
                to="/shop"
                className="link-underline shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
              >
                Shop all
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {getBestsellers(4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
