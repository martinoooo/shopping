import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SmartImage, buttonStyles } from '@/components/ui'

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink" aria-labelledby="hero-heading">
      <div className="absolute inset-0">
        <SmartImage
          src="/img/hero.webp"
          alt="A barista pouring water over a pour-over coffee brewer"
          className="h-full w-full"
          eager
          sizes="100vw"
          objectPosition="center 58%"
        />
      </div>
      <div className="absolute inset-0 bg-ink/25" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent"
        aria-hidden="true"
      />

      <div className="container-shell relative z-10 flex min-h-[560px] flex-col justify-end pb-10 pt-24 sm:min-h-[620px] md:min-h-[700px] md:pb-14 lg:min-h-[740px]">
        <div className="max-w-3xl">
          <p className="eyebrow text-paper/60">Portland, Oregon · Roasting since 2016</p>
          <h1 id="hero-heading" className="display-1 mt-5 text-balance text-paper">
            Slow coffee,
            <br />
            brewed well.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/75 sm:text-base">
            Single-origin lots and considered brewing gear from a small Portland roastery.
            Roasted to order every Tuesday, on your doorstep the same week.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/shop?category=coffee"
              className={buttonStyles({ variant: 'accent', size: 'lg' })}
            >
              Shop the coffee
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/#brew-guides"
              className="inline-flex h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-full border border-paper/40 px-8 text-[15px] font-medium text-paper transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink"
            >
              Find your brew
            </Link>
          </div>
        </div>

        <div className="mt-12 hidden items-end justify-between gap-6 border-t border-paper/20 pt-4 sm:flex">
          <p className="text-[10px] uppercase tracking-[0.2em] text-paper/55">
            Fresh crop · Direct trade · Free U.S. shipping over $60
          </p>
          <Link
            to="/product/ethiopia-guji"
            className="link-underline shrink-0 text-[12px] text-paper/80 transition-colors hover:text-paper"
          >
            Try Ethiopia Guji Uraga
          </Link>
        </div>
      </div>
    </section>
  )
}
