import { cn, formatMoney } from '@/lib/utils'

interface PriceProps {
  value: number
  compareAt?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClass = {
  sm: 'text-[15px]',
  md: 'text-base',
  lg: 'text-2xl',
} as const

export function Price({ value, compareAt, size = 'md', className }: PriceProps) {
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span className={cn('font-medium tabular-nums tracking-tight text-ink', sizeClass[size])}>
        {formatMoney(value)}
      </span>
      {compareAt && compareAt > value ? (
        <span className="text-[13px] tabular-nums text-muted line-through">{formatMoney(compareAt)}</span>
      ) : null}
    </span>
  )
}
