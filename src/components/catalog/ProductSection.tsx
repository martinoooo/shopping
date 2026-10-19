import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/types'
import { Reveal } from '@/components/ui'
import { cn } from '@/lib/utils'
import { ProductCard } from './ProductCard'

interface ProductSectionProps {
  id?: string
  eyebrow: string
  title: string
  description?: string
  products: Product[]
  ctaLabel: string
  ctaHref: string
  columns?: 3 | 4
  tone?: 'paper' | 'surface'
}

export function ProductSection({
  id,
  eyebrow,
  title,
  description,
  products,
  ctaLabel,
  ctaHref,
  columns = 4,
  tone = 'paper',
}: ProductSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-28 py-16 md:py-24',
        tone === 'surface' && 'border-y border-ink/10 bg-surface',
      )}
      aria-label={title}
    >
      <div className="container-shell">
        <div className="flex flex-col gap-5 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between md:pb-8">
          <div className="max-w-xl">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="display-2 mt-3">{title}</h2>
            {description ? (
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{description}</p>
            ) : null}
          </div>
          <Link
            to={ctaHref}
            className="group inline-flex shrink-0 items-center gap-2 self-start text-[12px] font-medium uppercase tracking-[0.14em] text-ink sm:self-auto"
          >
            {ctaLabel}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div
          className={cn(
            'mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-12 md:gap-x-6',
            columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4',
          )}
        >
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 60}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
