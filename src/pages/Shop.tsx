import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { PRODUCTS } from '@/data/products'
import type { CategoryId, RoastLevel } from '@/lib/types'
import { Button, EmptyState } from '@/components/ui'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ActiveFilterChips } from '@/components/catalog/ActiveFilterChips'
import { ShopFilterDrawer } from '@/components/catalog/ShopFilterDrawer'
import { ShopFilterPanel } from '@/components/catalog/ShopFilterPanel'
import { ShopToolbar } from '@/components/catalog/ShopToolbar'
import {
  buildShopSearchParams,
  countActiveFilters,
  filterAndSortProducts,
  parseShopFilters,
  toggleFilterValue,
  type ShopFilters,
  type SortId,
} from '@/components/catalog/shopFilters'
import { usePageTitle } from '@/lib/hooks'

export default function Shop() {
  usePageTitle('Shop')
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = parseShopFilters(searchParams)
  const [query, setQuery] = useState(filters.query)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Keep the search field in step with deep links and back/forward navigation.
  useEffect(() => {
    setQuery(filters.query)
  }, [filters.query])

  const products = filterAndSortProducts({ ...filters, query: query.trim() })
  // Counts are scoped to the active category so "2 of 9" never reads as "2 of 19".
  const categoryTotal = filters.category
    ? PRODUCTS.filter((product) => product.category === filters.category).length
    : PRODUCTS.length

  const applyFilters = (patch: Partial<ShopFilters>, replace = false) => {
    const next: ShopFilters = { ...filters, query: query.trim(), ...patch }
    setSearchParams(buildShopSearchParams(next), { replace })
  }

  const resetFilters = () => {
    setQuery('')
    applyFilters({ category: null, roasts: [], methods: [], priceBandId: null, query: '' })
  }

  const onClearQuery = () => {
    setQuery('')
    if (filters.query) applyFilters({ query: '' }, true)
  }

  const onChipChange = (patch: Partial<ShopFilters>) => {
    if (patch.query !== undefined) setQuery(patch.query)
    applyFilters(patch)
  }

  const onApplyDrawer = (next: ShopFilters) => {
    setDrawerOpen(false)
    setSearchParams(buildShopSearchParams({ ...next, query: query.trim() }))
  }

  return (
    <div className="pb-4">
      <header className="border-b border-ink/10 bg-surface">
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
            <span className="text-ink">Shop</span>
          </nav>

          <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="max-w-2xl">
              <p className="eyebrow">The shop</p>
              <h1 className="display-2 mt-3 text-balance">
                Coffee, gear and the small things.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                Considered coffee and tools for a slower morning. Roasted in Portland, shipped
                across the United States — free over $60.
              </p>
            </div>
            <p className="hidden text-[11px] uppercase tracking-[0.14em] text-muted md:block md:text-right">
              {categoryTotal} products
              <br />
              Roasted to order
            </p>
          </div>
        </div>
      </header>

      <div className="container-shell">
        <ShopToolbar
          query={query}
          onQueryChange={setQuery}
          onSubmitQuery={() => {
            if (query.trim() !== filters.query) applyFilters({ query: query.trim() })
          }}
          onClearQuery={onClearQuery}
          resultCount={products.length}
          totalCount={categoryTotal}
          sort={filters.sort}
          onSortChange={(sort: SortId) => applyFilters({ sort })}
          activeFilterCount={countActiveFilters(filters)}
          onOpenFilters={() => setDrawerOpen(true)}
        />

        <div className="mt-4">
          <ActiveFilterChips
            filters={filters}
            onChange={onChipChange}
            onClearAll={resetFilters}
          />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[236px_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2">
              <ShopFilterPanel
                filters={filters}
                onCategoryChange={(category: CategoryId) =>
                  applyFilters({
                    category: filters.category === category ? null : category,
                  })
                }
                onRoastChange={(roast: RoastLevel) =>
                  applyFilters({ roasts: toggleFilterValue(filters.roasts, roast) })
                }
                onMethodChange={(method: string) =>
                  applyFilters({ methods: toggleFilterValue(filters.methods, method) })
                }
                onPriceChange={(bandId: string) =>
                  applyFilters({
                    priceBandId: filters.priceBandId === bandId ? null : bandId,
                  })
                }
                onClearAll={resetFilters}
              />
            </div>
          </aside>

          <div className="min-w-0">
            <h2 className="sr-only">Products</h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={SearchX}
                title="No products match those filters"
                description="Try a different roast, brew method or price range — or clear everything and start again."
                action={
                  <Button variant="outline" onClick={resetFilters}>
                    Reset filters
                  </Button>
                }
                className="border border-ink/10 bg-surface"
              />
            )}

            <p className="mt-12 border-t border-ink/10 pt-5 text-[10.5px] uppercase tracking-[0.16em] text-muted">
              All prices in USD · Free U.S. shipping over $60
            </p>
          </div>
        </div>
      </div>

      {drawerOpen ? (
        <ShopFilterDrawer
          filters={filters}
          onApply={onApplyDrawer}
          onClose={() => setDrawerOpen(false)}
        />
      ) : null}
    </div>
  )
}
