import type { Product } from '@/lib/types'
import { FlavorProfileBars } from './FlavorProfileBars'

interface ProductNotesProps {
  product: Product
  className?: string
}

/**
 * Editorial notes that sit under the gallery on desktop (and after the buy panel
 * on mobile): the roasting story plus the flavour profile or key specs.
 */
export function ProductNotes({ product, className }: ProductNotesProps) {
  const isCoffee = product.category === 'coffee'

  return (
    <div className={className}>
      <p className="eyebrow">{isCoffee ? 'In the cup' : 'Why we chose it'}</p>
      {product.story ? (
        <p className="mt-3 text-[13px] leading-relaxed text-muted">{product.story}</p>
      ) : null}

      {isCoffee && product.flavor ? (
        <div className="mt-5 border-t border-ink/10 pt-5">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted">
            Flavour profile
          </p>
          <FlavorProfileBars flavor={product.flavor} className="mt-4 max-w-sm" />
        </div>
      ) : (
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink/10 pt-5">
          {product.details.slice(0, 4).map((row) => (
            <div key={row.label}>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">{row.label}</dt>
              <dd className="mt-1 text-[12px] leading-snug text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
