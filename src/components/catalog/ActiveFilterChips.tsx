import { X } from 'lucide-react'
import { CATEGORIES } from '@/data/products'
import type { ShopFilters } from './shopFilters'
import { getPriceBand } from './shopFilters'

interface ActiveFilterChipsProps {
  filters: ShopFilters
  onChange: (patch: Partial<ShopFilters>) => void
  onClearAll: () => void
}

interface Chip {
  key: string
  label: string
  onRemove: () => void
}

export function ActiveFilterChips({ filters, onChange, onClearAll }: ActiveFilterChipsProps) {
  const chips: Chip[] = []

  if (filters.category) {
    const category = CATEGORIES.find((item) => item.id === filters.category)
    if (category) {
      chips.push({
        key: `category-${category.id}`,
        label: category.shortLabel,
        onRemove: () => onChange({ category: null }),
      })
    }
  }

  for (const roast of filters.roasts) {
    chips.push({
      key: `roast-${roast}`,
      label: `${roast} roast`,
      onRemove: () => onChange({ roasts: filters.roasts.filter((item) => item !== roast) }),
    })
  }

  for (const method of filters.methods) {
    chips.push({
      key: `method-${method}`,
      label: method,
      onRemove: () => onChange({ methods: filters.methods.filter((item) => item !== method) }),
    })
  }

  if (filters.priceBandId) {
    const band = getPriceBand(filters.priceBandId)
    if (band) {
      chips.push({
        key: `price-${band.id}`,
        label: band.label,
        onRemove: () => onChange({ priceBandId: null }),
      })
    }
  }

  if (filters.query) {
    chips.push({
      key: 'query',
      label: `“${filters.query}”`,
      onRemove: () => onChange({ query: '' }),
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
        Filtered by
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          aria-label={`Remove filter: ${chip.label}`}
          className="group inline-flex h-9 items-center gap-1.5 rounded-full border border-ink/15 bg-surface pl-3 pr-2 text-[11.5px] text-ink transition-colors hover:border-ink/40"
        >
          {chip.label}
          <span className="flex h-4 w-4 items-center justify-center rounded-full text-muted transition-colors group-hover:bg-ink group-hover:text-paper">
            <X className="h-3 w-3" aria-hidden="true" />
          </span>
        </button>
      ))}
      {chips.length > 1 ? (
        <button
          type="button"
          onClick={onClearAll}
          className="ml-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-accent underline-offset-2 hover:underline"
        >
          Clear all
        </button>
      ) : null}
    </div>
  )
}
