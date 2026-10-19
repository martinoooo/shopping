import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { BREW_METHODS, CATEGORIES, PRICE_BANDS, ROAST_LEVELS } from '@/data/products'
import type { CategoryId, RoastLevel } from '@/lib/types'
import { cn } from '@/lib/utils'
import { countActiveFilters, FACET_COUNTS, type ShopFilters } from './shopFilters'

interface FilterOptionProps {
  label: string
  count: number
  selected: boolean
  onChange: () => void
}

function FilterOption({ label, count, selected, onChange }: FilterOptionProps) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-3 py-2 text-[13px] text-ink/80 transition-colors hover:text-ink">
      <span className="flex min-w-0 items-center gap-2.5">
        <input type="checkbox" checked={selected} onChange={onChange} className="peer sr-only" />
        <span
          aria-hidden="true"
          className={cn(
            'flex h-4 w-4 shrink-0 items-center justify-center border transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper',
            selected
              ? 'border-ink bg-ink text-paper'
              : 'border-ink/25 bg-surface group-hover:border-ink/50',
          )}
        >
          {selected ? <Check className="h-3 w-3" strokeWidth={2.5} /> : null}
        </span>
        <span className="truncate">{label}</span>
      </span>
      <span className="shrink-0 text-[11px] tabular-nums text-muted">{count}</span>
    </label>
  )
}

function FilterGroup({
  title,
  children,
  first = false,
}: {
  title: string
  children: ReactNode
  first?: boolean
}) {
  return (
    <div
      role="group"
      aria-label={title}
      className={cn('py-5', first ? 'pt-0' : 'border-t border-ink/10')}
    >
      <h3 className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  )
}

interface ShopFilterPanelProps {
  filters: ShopFilters
  onCategoryChange: (category: CategoryId) => void
  onRoastChange: (roast: RoastLevel) => void
  onMethodChange: (method: string) => void
  onPriceChange: (bandId: string) => void
  onClearAll: () => void
  showHeader?: boolean
  className?: string
}

export function ShopFilterPanel({
  filters,
  onCategoryChange,
  onRoastChange,
  onMethodChange,
  onPriceChange,
  onClearAll,
  showHeader = true,
  className,
}: ShopFilterPanelProps) {
  const activeCount = countActiveFilters(filters)
  const showRoast = filters.category === null || filters.category === 'coffee'

  return (
    <div className={cn('text-ink', className)}>
      {showHeader ? (
        <div className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-4">
          <h2 className="font-display text-lg">Filters</h2>
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-accent underline-offset-2 hover:underline"
            >
              Clear all
            </button>
          ) : null}
        </div>
      ) : null}

      <div className={cn(showHeader && 'mt-4')}>
        <FilterGroup title="Category" first>
          {CATEGORIES.map((category) => (
            <FilterOption
              key={category.id}
              label={category.shortLabel}
              count={FACET_COUNTS.category[category.id]}
              selected={filters.category === category.id}
              onChange={() => onCategoryChange(category.id)}
            />
          ))}
        </FilterGroup>

        {showRoast ? (
          <FilterGroup title="Roast">
            {ROAST_LEVELS.map((roast) => (
              <FilterOption
                key={roast}
                label={roast}
                count={FACET_COUNTS.roast[roast]}
                selected={filters.roasts.includes(roast)}
                onChange={() => onRoastChange(roast)}
              />
            ))}
          </FilterGroup>
        ) : null}

        <FilterGroup title="Brew method">
          {BREW_METHODS.map((method) => (
            <FilterOption
              key={method}
              label={method}
              count={FACET_COUNTS.method[method]}
              selected={filters.methods.includes(method)}
              onChange={() => onMethodChange(method)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Price">
          {PRICE_BANDS.map((band) => (
            <FilterOption
              key={band.id}
              label={band.label}
              count={FACET_COUNTS.price[band.id]}
              selected={filters.priceBandId === band.id}
              onChange={() => onPriceChange(band.id)}
            />
          ))}
        </FilterGroup>
      </div>
    </div>
  )
}
