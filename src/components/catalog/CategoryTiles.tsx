import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIES, getProductsByCategory } from '@/data/products'
import { SmartImage } from '@/components/ui'

const COUNT_LABEL = {
  coffee: 'lots',
  gear: 'pieces',
  accessories: 'pieces',
} as const

export function CategoryTiles() {
  return (
    <section className="container-shell py-16 md:py-20" aria-labelledby="category-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Shop by category</p>
          <h2 id="category-heading" className="display-2 mt-3">
            Three ways in.
          </h2>
        </div>
        <Link
          to="/shop"
          className="link-underline self-start text-[13px] font-medium text-ink sm:self-auto"
        >
          Shop all products
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3 md:mt-12 md:gap-4">
        {CATEGORIES.map((category) => {
          const count = getProductsByCategory(category.id).length
          return (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="group relative block overflow-hidden bg-cream focus-visible:outline-none"
            >
              <SmartImage
                src={category.image}
                alt={category.label}
                className="aspect-[4/3] w-full sm:aspect-[3/4]"
                imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-paper/60">
                    {count} {COUNT_LABEL[category.id]}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl text-paper md:text-[26px]">
                    {category.shortLabel}
                  </h3>
                  <p className="mt-1 hidden max-w-[26ch] text-[12.5px] leading-relaxed text-paper/65 sm:block">
                    {category.description}
                  </p>
                </div>
                <span className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-paper/40 text-paper transition-colors duration-300 group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
