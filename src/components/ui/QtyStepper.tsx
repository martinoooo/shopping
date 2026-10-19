import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QtyStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  label?: string
  className?: string
}

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 12,
  size = 'md',
  label = 'Quantity',
  className,
}: QtyStepperProps) {
  const buttonClass =
    'flex items-center justify-center text-ink transition-colors duration-200 hover:bg-ink/[0.06] disabled:cursor-not-allowed disabled:opacity-30'
  const dimensions = size === 'sm' ? 'h-9' : 'h-11'

  return (
    <div
      className={cn(
        'inline-flex items-stretch overflow-hidden rounded-full border border-ink/20 bg-surface',
        dimensions,
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={cn(buttonClass, size === 'sm' ? 'w-9' : 'w-11')}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span
        className={cn(
          'flex min-w-9 items-center justify-center text-sm font-medium tabular-nums',
          size === 'sm' ? 'px-1' : 'px-2',
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={cn(buttonClass, size === 'sm' ? 'w-9' : 'w-11')}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
