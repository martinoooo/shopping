import type { ProductOption } from '@/lib/types'
import { cn } from '@/lib/utils'

interface OptionGroupProps {
  label: string
  name: string
  options: ProductOption[]
  value: string
  onChange: (id: string) => void
  /** Number of columns in the option grid. */
  columns?: 1 | 2 | 3
  className?: string
}

const columnClass: Record<1 | 2 | 3, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
}

/**
 * Accessible radio-card group for product options (size, glaze, grind, …).
 * Uses native radios inside a fieldset so arrow keys and screen readers work.
 */
export function OptionGroup({
  label,
  name,
  options,
  value,
  onChange,
  columns = 3,
  className,
}: OptionGroupProps) {
  const selected = options.find((option) => option.id === value)

  return (
    <fieldset className={cn('min-w-0', className)}>
      <legend className="flex w-full items-baseline justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        <span>{label}</span>
        {selected ? <span className="normal-case tracking-normal text-muted/80">{selected.label}</span> : null}
      </legend>
      <div className={cn('mt-3 grid gap-2', columnClass[columns])}>
        {options.map((option) => {
          const active = option.id === value
          return (
            <label
              key={option.id}
              className={cn(
                'relative flex cursor-pointer flex-col justify-center rounded-[2px] border px-3 py-2.5 text-left transition-colors duration-200 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent',
                active
                  ? 'border-ink bg-ink/[0.045]'
                  : 'border-ink/15 bg-surface hover:border-ink/40',
                option.disabled && 'cursor-not-allowed opacity-40 hover:border-ink/15',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={active}
                disabled={option.disabled}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              <span className="text-[12.5px] font-medium leading-snug text-ink">{option.label}</span>
              {option.detail ? (
                <span className="mt-0.5 text-[10.5px] leading-snug text-muted">{option.detail}</span>
              ) : null}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
