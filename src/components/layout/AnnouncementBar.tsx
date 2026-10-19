import { useUIStore } from '@/store/ui'
import { FREE_SHIPPING_THRESHOLD } from '@/store/cart'
import { formatMoney } from '@/lib/utils'

export function AnnouncementBar() {
  const openSearch = useUIStore((state) => state.openSearch)

  return (
    <div className="bg-ink text-paper">
      <div className="container-shell flex h-9 items-center justify-center gap-4 sm:justify-between text-[10px] font-medium uppercase tracking-[0.16em]">
        <p className="hidden sm:block">Roasted to order every Tuesday</p>
        <p className="flex items-center gap-2">
          <span className="hidden h-1 w-1 rounded-full bg-accent-soft/60 sm:block" />
          Free U.S. shipping over {formatMoney(FREE_SHIPPING_THRESHOLD)}
          <span className="hidden h-1 w-1 rounded-full bg-accent-soft/60 sm:block" />
        </p>
        <button
          type="button"
          onClick={openSearch}
          className="hidden text-paper/70 transition-colors hover:text-paper sm:block"
        >
          Subscribe &amp; save 15%
        </button>
      </div>
    </div>
  )
}
