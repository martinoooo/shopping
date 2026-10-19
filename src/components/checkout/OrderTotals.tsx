import { formatMoney } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface OrderTotalsProps {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  promoCode?: string | null
  className?: string
}

function Row({
  label,
  value,
  emphasis = false,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={cn('text-[13px]', emphasis ? 'font-medium text-ink' : 'text-muted')}>{label}</dt>
      <dd
        className={cn(
          'tabular-nums',
          emphasis ? 'text-[17px] font-medium tracking-tight text-ink' : 'text-[13px] text-ink',
        )}
      >
        {value}
      </dd>
    </div>
  )
}

export function OrderTotals({
  subtotal,
  discount,
  shipping,
  tax,
  total,
  promoCode,
  className,
}: OrderTotalsProps) {
  return (
    <dl className={cn('space-y-2', className)}>
      <Row label="Subtotal" value={formatMoney(subtotal)} />
      {discount > 0 ? (
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-[13px] text-muted">Discount{promoCode ? ` · ${promoCode}` : ''}</dt>
          <dd className="text-[13px] font-medium tabular-nums text-forest">−{formatMoney(discount)}</dd>
        </div>
      ) : null}
      <Row label="Standard shipping" value={shipping === 0 ? 'Free' : formatMoney(shipping)} />
      <Row label="Estimated tax" value={formatMoney(tax)} />
      <div className="border-t border-ink/10 pt-3">
        <Row label="Total" value={formatMoney(total)} emphasis />
      </div>
    </dl>
  )
}
