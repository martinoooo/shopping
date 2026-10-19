import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Reveal, SmartImage } from '@/components/ui'

const STATS = [
  { value: '2016', label: 'Founded in Portland' },
  { value: '14', label: 'Partner farms' },
  { value: '6', label: 'Countries sourced' },
  { value: '100%', label: 'Traceable lots' },
]

export function StorySection() {
  return (
    <section id="story" className="scroll-mt-28">
      <div className="container-shell py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5 lg:pt-2">
            <p className="eyebrow">Our story</p>
            <h2 className="display-2 mt-3 text-balance">A roastery, not a café.</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted">
              Ember &amp; Oak began in 2016 with a second-hand roaster on SE Ash Street and a
              stubborn idea: coffee should taste like where it came from. We still roast in small
              batches, cup every lot before it reaches the shop, and write the tasting notes by
              hand.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              No house style to hide behind, no blends stretched to hit a price. Just the coffee
              we want to drink, roasted the week it ships.
            </p>

            <Link
              to="/shop?category=coffee"
              className="group mt-8 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ink"
            >
              Meet the coffees
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>

            <blockquote className="mt-10 max-w-md border-t border-ink/10 pt-6 font-display text-lg leading-[1.45] text-ink/80">
              “Roasted on Tuesdays, shipped on Wednesdays, and never more than a week old by the
              time it reaches you.”
            </blockquote>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <SmartImage
                src="/img/story-roastery.webp"
                alt="Roasted coffee beans cooling in the drum of the roastery"
                className="aspect-[4/3] w-full"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </Reveal>
            <div className="mt-3 grid grid-cols-2 gap-3 md:mt-4">
              <Reveal delay={80}>
                <SmartImage
                  src="/img/story-harvest.webp"
                  alt="A handful of ripe coffee cherries above a harvest basket"
                  className="aspect-[4/5] w-full"
                  sizes="(max-width: 1024px) 50vw, 29vw"
                />
              </Reveal>
              <Reveal delay={140}>
                <SmartImage
                  src="/img/story-brewing.webp"
                  alt="Coffee being poured from a French press into a stoneware mug"
                  className="aspect-[4/5] w-full"
                  sizes="(max-width: 1024px) 50vw, 29vw"
                />
              </Reveal>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-ink/10 pt-8 sm:grid-cols-4 md:mt-16">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl leading-none text-ink md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div id="sourcing" className="scroll-mt-28 border-t border-ink/10 bg-forest text-paper">
        <div className="container-shell grid gap-8 py-16 md:grid-cols-[1fr_auto] md:items-end md:gap-16 md:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow text-paper/50">Sourcing</p>
            <h2 className="display-2 mt-3 text-balance text-paper">
              Fourteen farms. Six countries. One standard.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-paper/70">
              We buy through long-standing relationships rather than auctions. That means paying
              well above commodity price, visiting the farms we work with, and sticking around
              when a harvest is difficult.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-paper/70">
              Every bag carries the farm, the region and the process — because you should know
              what you are drinking, and who grew it.
            </p>
          </div>

          <div className="flex flex-col gap-5 md:items-end">
            <div className="flex gap-8">
              <div>
                <p className="font-display text-3xl leading-none text-paper md:text-4xl">40+</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-paper/50">
                  Lots cupped yearly
                </p>
              </div>
              <div>
                <p className="font-display text-3xl leading-none text-paper md:text-4xl">12</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-paper/50">
                  Years of relationships
                </p>
              </div>
            </div>
            <Link
              to="/shop?category=coffee"
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full bg-paper px-6 text-sm font-medium text-ink transition-colors duration-300 hover:bg-cream md:self-auto"
            >
              Shop the coffees
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
