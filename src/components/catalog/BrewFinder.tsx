import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { BREW_METHODS, PRODUCTS } from '@/data/products'
import { Price, SmartImage } from '@/components/ui'
import { cn } from '@/lib/utils'

const METHOD_COPY: Record<string, string> = {
  'Pour-over':
    'A slow, even pour that rewards clarity. Light roasts show their florals and acidity best here.',
  'French press':
    'Full immersion and a rich, textured body. Medium and medium-dark roasts have the weight to hold up.',
  Espresso:
    'Nine bars of pressure. Look for sweetness and body — the kind of coffee that cuts through milk.',
  AeroPress:
    'Fast, forgiving and endlessly tweakable. A natural fit for fruit-forward coffees and busy mornings.',
  'Moka pot':
    'Stovetop pressure, strong and syrupy. Chocolatey, medium-dark roasts are the classic pairing.',
  'Cold brew':
    'Twelve hours of cold extraction. Sweeter, rounder and lower in acidity — made for warm afternoons.',
}

const DEFAULT_METHOD = 'Pour-over'

export function BrewFinder() {
  const [method, setMethod] = useState(DEFAULT_METHOD)

  const matches = PRODUCTS.filter((product) => product.brewMethods?.includes(method))
    .sort(
      (a, b) =>
        Number(a.category !== 'coffee') - Number(b.category !== 'coffee') ||
        b.rating - a.rating,
    )
    .slice(0, 4)

  return (
    <section
      id="brew-guides"
      className="scroll-mt-28 border-b border-ink/10 bg-cream/50 py-16 md:py-24"
      aria-labelledby="brew-heading"
    >
      <div className="container-shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Find your brew</p>
          <h2 id="brew-heading" className="display-2 mt-3 text-balance">
            Start with how you brew.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Every coffee on our shelf is a little different. Choose your method and we will point
            you towards the lots that suit it — no guesswork, no wasted bags.
          </p>
        </div>

        <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Choose a brew method"
            >
              {BREW_METHODS.map((option) => {
                const active = option === method
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMethod(option)}
                    aria-pressed={active}
                    className={cn(
                      'h-10 rounded-full border px-4 text-[12.5px] font-medium transition-colors duration-200',
                      active
                        ? 'border-ink bg-ink text-paper'
                        : 'border-ink/20 bg-transparent text-ink hover:border-ink/50 hover:bg-surface',
                    )}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            <p className="mt-6 min-h-[4.5rem] max-w-md text-[14px] leading-relaxed text-muted">
              {METHOD_COPY[method]}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ink/10 pt-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'} · {method}
              </p>
              <Link
                to={`/shop?method=${encodeURIComponent(method)}`}
                className="group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ink"
              >
                Shop the collection
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h3 className="sr-only">Recommended for {method}</h3>
            <ul>
              {matches.map((product, index) => (
                <li key={product.id}>
                  <Link
                    to={`/product/${product.slug}`}
                    className="group flex items-center gap-4 border-b border-ink/10 py-4 transition-colors first:border-t md:gap-5"
                  >
                    <span className="hidden w-6 shrink-0 text-[10px] tabular-nums text-muted sm:block">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <SmartImage
                      src={product.images[0]?.src ?? ''}
                      alt={product.images[0]?.alt ?? product.name}
                      className="h-16 w-16 shrink-0 rounded-[2px] sm:h-[72px] sm:w-[72px]"
                      sizes="72px"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[9.5px] uppercase tracking-[0.18em] text-muted">
                        {product.roast ? `${product.roast} roast` : product.type}
                        {product.origin ? ` · ${product.origin}` : ''}
                      </p>
                      <p className="mt-1 truncate font-display text-[17px] leading-snug text-ink transition-colors group-hover:text-accent sm:text-lg">
                        {product.name}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[12px] leading-relaxed text-muted">
                        {product.category === 'coffee' && product.notes?.length
                          ? product.notes.join(' · ')
                          : product.tagline}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Price value={product.price} size="sm" />
                      <ArrowUpRight
                        className="hidden h-4 w-4 text-muted transition-colors group-hover:text-accent sm:block"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
