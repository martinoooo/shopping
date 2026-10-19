import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  count?: number
  size?: 'xs' | 'sm' | 'md'
  showValue?: boolean
  className?: string
  countClassName?: string
}

const starSize = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
} as const

export function StarRating({
  rating,
  count,
  size = 'sm',
  showValue = false,
  className,
  countClassName,
}: StarRatingProps) {
  const stars = [0, 1, 2, 3, 4]
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        className="relative inline-flex"
        role="img"
        aria-label={`Rated ${rating.toFixed(1)} out of 5`}
      >
        <span className="flex gap-0.5 text-ink/15" aria-hidden="true">
          {stars.map((star) => (
            <Star key={star} className={cn(starSize[size], 'fill-current')} strokeWidth={0} />
          ))}
        </span>
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${Math.max(0, Math.min(1, rating / 5)) * 100}%` }}
          aria-hidden="true"
        >
          <span className="flex gap-0.5 text-accent">
            {stars.map((star) => (
              <Star key={star} className={cn(starSize[size], 'fill-current')} strokeWidth={0} />
            ))}
          </span>
        </span>
      </span>
      {showValue ? <span className="text-[13px] font-medium tabular-nums text-ink">{rating.toFixed(1)}</span> : null}
      {typeof count === 'number' ? (
        <span className={cn('text-[12px] tabular-nums text-muted', countClassName)}>
          {count > 999 ? `${(count / 1000).toFixed(1)}k` : count} reviews
        </span>
      ) : null}
    </span>
  )
}
