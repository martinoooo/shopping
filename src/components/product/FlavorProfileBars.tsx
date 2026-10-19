import type { FlavorProfile } from '@/lib/types'
import { cn } from '@/lib/utils'

interface FlavorProfileBarsProps {
  flavor: FlavorProfile
  className?: string
}

const ROWS: Array<{ key: keyof FlavorProfile; label: string; hint: string }> = [
  { key: 'acidity', label: 'Acidity', hint: 'Brightness' },
  { key: 'sweetness', label: 'Sweetness', hint: 'Roundness' },
  { key: 'body', label: 'Body', hint: 'Weight' },
]

const MAX = 5

/** Flavour-profile meters for coffee, scored by the roasting team. */
export function FlavorProfileBars({ flavor, className }: FlavorProfileBarsProps) {
  return (
    <div className={cn('space-y-3.5', className)}>
      {ROWS.map(({ key, label, hint }) => {
        const raw = flavor[key]
        const value = Math.max(0, Math.min(MAX, raw))
        return (
          <div
            key={key}
            role="meter"
            aria-label={`${label}: ${raw} out of ${MAX} — ${hint}`}
            aria-valuemin={0}
            aria-valuemax={MAX}
            aria-valuenow={raw}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink">{label}</span>
              <span className="text-[10.5px] tabular-nums text-muted">{raw.toFixed(1)}</span>
            </div>
            <div aria-hidden="true" className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
                style={{ width: `${(value / MAX) * 100}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
