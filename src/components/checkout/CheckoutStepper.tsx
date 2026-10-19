import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const CHECKOUT_STEPS = ['Shipping', 'Payment', 'Review'] as const

interface CheckoutStepperProps {
  current: number
  onStepClick: (index: number) => void
}

export function CheckoutStepper({ current, onStepClick }: CheckoutStepperProps) {
  return (
    <nav aria-label="Checkout progress">
      <ol className="flex items-center gap-2 sm:gap-3">
        {CHECKOUT_STEPS.map((label, index) => {
          const complete = index < current
          const active = index === current
          const reachable = index < current

          return (
            <li key={label} className={cn('flex items-center gap-2 sm:gap-3', index < 2 && 'flex-1')}>
              <button
                type="button"
                onClick={() => reachable && onStepClick(index)}
                disabled={!reachable}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-2.5 rounded-full py-2 text-left transition-colors',
                  reachable ? 'cursor-pointer' : 'cursor-default',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium tabular-nums transition-colors',
                    complete && 'border-forest bg-forest text-paper',
                    active && 'border-ink bg-ink text-paper',
                    !complete && !active && 'border-ink/25 bg-transparent text-muted',
                  )}
                  aria-hidden="true"
                >
                  {complete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span
                  className={cn(
                    'whitespace-nowrap text-[12px] font-medium tracking-[0.02em] transition-colors',
                    active ? 'text-ink' : complete ? 'text-forest' : 'text-muted',
                  )}
                >
                  {label}
                </span>
              </button>
              {index < CHECKOUT_STEPS.length - 1 ? (
                <span
                  className={cn('h-px flex-1', complete ? 'bg-forest/40' : 'bg-ink/15')}
                  aria-hidden="true"
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
