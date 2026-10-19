import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { buttonStyles } from '@/components/ui'

export function ClosingCta() {
  return (
    <section className="container-shell pb-4 pt-16 md:pb-8 md:pt-24" aria-labelledby="closing-cta-heading">
      <div className="relative overflow-hidden border border-ink/10 bg-cream/60 px-6 py-14 sm:px-10 md:px-14 md:py-20">
        <div
          className="pointer-events-none absolute -right-24 -top-28 h-56 w-56 rounded-full border border-accent/20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-36 -left-28 h-64 w-64 rounded-full border border-ink/10"
          aria-hidden="true"
        />

        <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="eyebrow">Start here</p>
            <h2 id="closing-cta-heading" className="display-2 mt-3 max-w-xl text-balance">
              Better mornings begin with a better bag.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Not sure where to start? Tell us how you brew and we will find the right lot — or
              take the short way round and meet our house favourites.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/shop?category=coffee"
              className={buttonStyles({ variant: 'primary', size: 'lg' })}
            >
              Shop the coffee
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/shop"
              className={buttonStyles({ variant: 'outline', size: 'lg' })}
            >
              Browse all products
            </Link>
            <p className="mt-1 text-center text-[10px] uppercase tracking-[0.16em] text-muted">
              Free U.S. shipping over $60
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
