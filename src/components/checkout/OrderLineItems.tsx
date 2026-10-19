import type { CartLine } from '@/lib/types'
import { SmartImage } from '@/components/ui'
import { cn, formatMoney } from '@/lib/utils'

interface OrderLineItemsProps {
  lines: CartLine[]
  className?: string
}

/** Read-only line list used by the checkout summary and the confirmation page. */
export function OrderLineItems({ lines, className }: OrderLineItemsProps) {
  return (
    <ul className={cn('divide-y divide-ink/10', className)}>
      {lines.map((line) => (
        <li key={line.lineId} className="flex gap-3 py-4 first:pt-0 last:pb-0">
          <div className="relative shrink-0">
            <SmartImage
              src={line.image}
              alt={line.name}
              className="h-[76px] w-[60px] rounded-[2px]"
              sizes="60px"
            />
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-medium tabular-nums text-paper">
              {line.quantity}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-display text-[15px] leading-snug text-ink">{line.name}</p>
            <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.12em] text-muted">
              {line.size}
              {line.grind ? ` · ${line.grind}` : ''}
            </p>
            {line.purchaseType === 'subscribe' ? (
              <p className="mt-1 text-[11px] text-forest">
                Subscription · {line.cadence ?? 'Recurring'}
              </p>
            ) : null}
            <div className="mt-1.5 flex items-baseline justify-between gap-3 text-[12.5px]">
              <span className="text-muted">
                {formatMoney(line.unitPrice)} × {line.quantity}
              </span>
              <span className="font-medium tabular-nums text-ink">
                {formatMoney(line.unitPrice * line.quantity)}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
