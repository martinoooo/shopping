import type { FormEvent } from 'react'
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { SORT_OPTIONS, type SortId } from './shopFilters'

interface ShopToolbarProps {
  query: string
  onQueryChange: (value: string) => void
  onSubmitQuery: () => void
  onClearQuery: () => void
  resultCount: number
  totalCount: number
  sort: SortId
  onSortChange: (sort: SortId) => void
  activeFilterCount: number
  onOpenFilters: () => void
}

export function ShopToolbar({
  query,
  onQueryChange,
  onSubmitQuery,
  onClearQuery,
  resultCount,
  totalCount,
  sort,
  onSortChange,
  activeFilterCount,
  onOpenFilters,
}: ShopToolbarProps) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmitQuery()
  }

  return (
    <div className="border-b border-ink/10 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <form role="search" onSubmit={onSubmit} className="relative w-full lg:max-w-xs">
          <label htmlFor="shop-search" className="sr-only">
            Search products
          </label>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            id="shop-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search coffee, gear or a flavour"
            autoComplete="off"
            className="h-11 w-full rounded-full border border-ink/15 bg-surface pl-11 pr-10 text-[13.5px] text-ink transition-colors placeholder:text-muted/70 hover:border-ink/30 focus:border-ink/50 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query.length > 0 ? (
            <button
              type="button"
              onClick={onClearQuery}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </form>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <p className="whitespace-nowrap text-[11.5px] text-muted" aria-live="polite">
            <span className="sm:hidden">
              {resultCount} of {totalCount}
            </span>
            <span className="hidden sm:inline">
              {resultCount} of {totalCount} products
            </span>
          </p>

          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/20 bg-surface px-4 text-[12.5px] font-medium text-ink transition-colors hover:border-ink/50 lg:hidden"
            aria-label={`Open filters${activeFilterCount ? `, ${activeFilterCount} active` : ''}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            Filters
            {activeFilterCount > 0 ? (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-[#FFF9F2]">
                {activeFilterCount}
              </span>
            ) : null}
          </button>

          <div className="relative">
            <label htmlFor="shop-sort" className="sr-only">
              Sort products
            </label>
            <select
              id="shop-sort"
              value={sort}
              onChange={(event) => onSortChange(event.target.value as SortId)}
              className="h-10 appearance-none rounded-full border border-ink/15 bg-surface pl-4 pr-9 text-[12.5px] text-ink transition-colors hover:border-ink/30 focus:border-ink/50 focus:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
