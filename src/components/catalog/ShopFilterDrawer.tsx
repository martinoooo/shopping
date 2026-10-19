import { useState } from 'react'
import { Button, Drawer } from '@/components/ui'
import type { CategoryId, RoastLevel } from '@/lib/types'
import { pluralize } from '@/lib/utils'
import {
  filterAndSortProducts,
  toggleFilterValue,
  type ShopFilters,
} from './shopFilters'
import { ShopFilterPanel } from './ShopFilterPanel'

interface ShopFilterDrawerProps {
  filters: ShopFilters
  onApply: (filters: ShopFilters) => void
  onClose: () => void
}

/**
 * Mobile filter sheet. Filters are staged locally and committed with the "Show results"
 * button, so the page does not re-render (and close the sheet) on every tap.
 */
export function ShopFilterDrawer({ filters, onApply, onClose }: ShopFilterDrawerProps) {
  const [draft, setDraft] = useState<ShopFilters>(filters)

  const resultCount = filterAndSortProducts(draft).length
  const draftCount =
    (draft.category ? 1 : 0) +
    draft.roasts.length +
    draft.methods.length +
    (draft.priceBandId ? 1 : 0)

  return (
    <Drawer
      open
      onClose={onClose}
      title="Filters"
      description="Refine by category, roast, method and price."
      footer={
        <div className="flex items-center gap-3 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:px-6">
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              setDraft((previous) => ({
                ...previous,
                category: null,
                roasts: [],
                methods: [],
                priceBandId: null,
              }))
            }
            disabled={draftCount === 0}
          >
            Clear
          </Button>
          <Button size="lg" fullWidth onClick={() => onApply(draft)}>
            Show {pluralize(resultCount, 'product')}
          </Button>
        </div>
      }
    >
      <div className="px-5 py-4 sm:px-6">
        <ShopFilterPanel
          filters={draft}
          showHeader={false}
          onCategoryChange={(category: CategoryId) =>
            setDraft((previous) => ({
              ...previous,
              category: previous.category === category ? null : category,
            }))
          }
          onRoastChange={(roast: RoastLevel) =>
            setDraft((previous) => ({
              ...previous,
              roasts: toggleFilterValue(previous.roasts, roast),
            }))
          }
          onMethodChange={(method: string) =>
            setDraft((previous) => ({
              ...previous,
              methods: toggleFilterValue(previous.methods, method),
            }))
          }
          onPriceChange={(bandId: string) =>
            setDraft((previous) => ({
              ...previous,
              priceBandId: previous.priceBandId === bandId ? null : bandId,
            }))
          }
          onClearAll={() =>
            setDraft((previous) => ({
              ...previous,
              category: null,
              roasts: [],
              methods: [],
              priceBandId: null,
            }))
          }
        />
      </div>
    </Drawer>
  )
}
