import { Star } from 'lucide-react'
import type { Product, Review } from '@/lib/types'
import { Badge, EmptyState, StarRating } from '@/components/ui'
import { getRatingBreakdown, getReviewsForProduct } from '@/data/reviews'
import { cn, formatDate } from '@/lib/utils'

interface ProductReviewsProps {
  product: Product
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-col border border-ink/10 bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <StarRating rating={review.rating} size="xs" />
        <span className="text-[10.5px] uppercase tracking-[0.12em] text-muted">
          {formatDate(review.date)}
        </span>
      </div>
      <h3 className="mt-3 font-display text-[19px] leading-snug tracking-[-0.01em] text-ink">
        {review.title}
      </h3>
      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">{review.body}</p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
        <p className="text-[12px] font-medium text-ink">
          {review.author}{' '}
          <span className="font-normal text-muted">· {review.location}</span>
        </p>
        {review.verified ? (
          <Badge variant="outline" className="shrink-0 border-forest/30 text-[9px] text-forest">
            Verified
          </Badge>
        ) : null}
      </div>
    </article>
  )
}

/** Rating summary, histogram and written reviews for the product. */
export function ProductReviews({ product }: ProductReviewsProps) {
  const reviews = getReviewsForProduct(product.id)
  const rawBreakdown = getRatingBreakdown(product.id)
  const writtenTotal = rawBreakdown.reduce((sum, row) => sum + row.count, 0)

  // The catalog carries an aggregate review count; scale the histogram to it so
  // the summary and the breakdown tell the same story.
  const breakdown = rawBreakdown.map((row) => {
    const share = writtenTotal > 0 ? row.count / writtenTotal : 0
    return {
      ...row,
      percent: Math.round(share * 100),
      count: Math.round(share * product.reviewCount),
    }
  })
  const recommendPercent =
    writtenTotal > 0
      ? Math.round(((rawBreakdown[0].count + rawBreakdown[1].count) / writtenTotal) * 100)
      : 0

  return (
    <section id="reviews" className="scroll-mt-28 py-16 md:py-24">
      <div className="container-shell">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="display-3 mt-3">Brewed, then reviewed.</h2>
          </div>
          <p className="max-w-xs text-[12.5px] leading-relaxed text-muted">
            Every review comes from a verified order. The honest ones get published too.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="border border-ink/10 bg-surface p-6">
              <div className="flex items-end gap-4">
                <p className="font-display text-[56px] leading-[0.85] tracking-[-0.03em] text-ink">
                  {product.rating.toFixed(1)}
                </p>
                <div className="pb-1">
                  <StarRating rating={product.rating} size="md" />
                  <p className="mt-1.5 text-[11.5px] text-muted">
                    Based on {product.reviewCount} reviews
                  </p>
                </div>
              </div>

              {writtenTotal > 0 ? (
                <div className="mt-6 space-y-2">
                  {breakdown.map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                      <span className="flex w-7 shrink-0 items-center gap-1 text-[11px] tabular-nums text-muted">
                        <Star className="h-2.5 w-2.5 fill-current" strokeWidth={0} aria-hidden="true" />
                        {row.stars}
                      </span>
                      <div
                        aria-hidden="true"
                        className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10"
                      >
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${row.percent}%` }}
                        />
                      </div>
                      <span className="w-7 shrink-0 text-right text-[11px] tabular-nums text-muted">
                        {row.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 border-t border-ink/10 pt-4 text-[11.5px] leading-relaxed text-muted">
                  Written reviews for this product are on their way.
                </p>
              )}

              {recommendPercent > 0 ? (
                <p className="mt-6 border-t border-ink/10 pt-4 text-[11.5px] leading-relaxed text-muted">
                  <span className="font-medium text-ink">{recommendPercent}%</span> of reviewers rated it
                  four stars or higher.
                </p>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-8">
            {reviews.length > 0 ? (
              <div className={cn('grid gap-4', reviews.length > 1 && 'sm:grid-cols-2')}>
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="border border-ink/10 bg-surface">
                <EmptyState
                  icon={Star}
                  title="No written reviews yet"
                  description="This one is new to the shelf. If you brew it, we would love to hear how it tasted."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
