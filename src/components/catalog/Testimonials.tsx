import { useState } from 'react'
import { StarRating } from '@/components/ui'
import { TESTIMONIALS } from '@/data/reviews'
import { cn } from '@/lib/utils'

export function Testimonials() {
  const [active, setActive] = useState(0)
  const testimonial = TESTIMONIALS[active]

  return (
    <section
      className="border-y border-ink/10 bg-surface py-16 md:py-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-shell grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="eyebrow">Kind words</p>
          <h2 id="testimonials-heading" className="display-2 mt-3 text-balance">
            Brewed, then written about.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Notes from the people who drink our coffee every morning. We read every one.
          </p>

          <div
            className="mt-8 flex flex-col"
            role="group"
            aria-label="Choose a testimonial"
          >
            {TESTIMONIALS.map((item, index) => {
              const selected = index === active
              return (
                <button
                  key={item.author}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={selected}
                  className={cn(
                    'flex items-center justify-between gap-4 border-t border-ink/10 py-3.5 text-left transition-colors duration-200',
                    index === TESTIMONIALS.length - 1 && 'border-b',
                    selected ? 'text-ink' : 'text-muted hover:text-ink',
                  )}
                >
                  <span>
                    <span className="block text-[13px] font-medium">{item.author}</span>
                    <span className="mt-0.5 block text-[11px] text-muted">{item.location}</span>
                  </span>
                  <span
                    className={cn(
                      'h-px w-6 shrink-0 transition-colors duration-200',
                      selected ? 'bg-accent' : 'bg-ink/15',
                    )}
                    aria-hidden="true"
                  />
                </button>
              )
            })}
          </div>
        </div>

        <figure className="flex flex-col justify-center lg:col-span-8" aria-live="polite">
          <span
            className="font-display text-6xl leading-none text-accent/25"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <blockquote key={testimonial.author} className="mt-2 animate-fade-up">
            <p className="text-balance font-display text-[clamp(1.35rem,2.4vw,2.05rem)] leading-[1.35] text-ink">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
          </blockquote>
          <figcaption className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink/10 pt-5">
            <StarRating rating={testimonial.rating} />
            <span className="text-[12px] text-muted">On {testimonial.product}</span>
            <span className="text-[12px] font-medium text-ink">
              {testimonial.author}, {testimonial.location}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
