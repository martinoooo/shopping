import { Check } from 'lucide-react'
import type { Product, ProductDetailRow } from '@/lib/types'
import { Accordion, SmartImage } from '@/components/ui'
import type { AccordionItemData } from '@/components/ui'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT } from '@/store/cart'
import { SITE } from '@/lib/site'
import { formatMoney } from '@/lib/utils'

interface ProductInfoProps {
  product: Product
}

const chipClass =
  'rounded-full border border-ink/15 bg-paper px-3 py-1 text-[11.5px] leading-none text-ink'

function DetailsList({ rows }: { rows: ProductDetailRow[] }) {
  return (
    <dl className="grid gap-x-8 sm:grid-cols-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-2.5"
        >
          <dt className="text-[10.5px] uppercase tracking-[0.14em] text-muted">{row.label}</dt>
          <dd className="text-right text-[12.5px] text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function BrewGuide({ product, methods }: { product: Product; methods: string[] }) {
  if (product.category === 'coffee') {
    return (
      <div className="space-y-3">
        <p>
          We brew this as {methods.join(', ')}. Start with 18 g of coffee to 290 g of filtered water
          at 94°C — a medium-fine grind suits most pour-overs.
        </p>
        <p>
          Rinse the filter, bloom with 40 g of water for 30 seconds, then pour in slow circles. Give
          the cup a minute to open up before drinking.
        </p>
        <p className="text-ink">
          Every bag ships with a printed brew card, and our full brew guides are free online.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p>
        Built for {methods.join(', ')}. Start with 18 g of coffee to 300 g of water at 94°C and a
        medium-fine grind, then change one variable at a time — dose, grind, temperature.
      </p>
      <p>
        Small adjustments, repeated, are how good cups happen. Keep the gear clean and it will
        outlast the habit.
      </p>
      <p className="text-ink">
        Need a hand dialling it in? Write to {SITE.supportEmail} — a real person answers.
      </p>
    </div>
  )
}

function CareContent({ product }: { product: Product }) {
  const care = product.details.find((row) => row.label.toLowerCase() === 'care')
  return (
    <div className="space-y-3">
      <p>{care ? `Care — ${care.value}.` : 'A soft cloth and warm water are all this needs.'}</p>
      <p>
        Made in small batches, so slight variation in finish is expected — and part of the
        character. Treat it gently and it will keep earning its place on the shelf.
      </p>
    </div>
  )
}

function ShippingReturns() {
  return (
    <div className="space-y-3">
      <p>
        Coffee is roasted to order every Tuesday and shipped within 2–4 business days. Gear and
        accessories leave our Portland studio within one business day.
      </p>
      <p>
        Free U.S. shipping over {formatMoney(FREE_SHIPPING_THRESHOLD)}; a flat{' '}
        {formatMoney(SHIPPING_FLAT)} below that. All deliveries are carbon-neutral.
      </p>
      <p>
        Changed your mind? You have 30 days on unopened coffee and gear in original condition.
        Write to {SITE.supportEmail} and we will sort it out.
      </p>
    </div>
  )
}

function IncludesList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Editorial image plus the accordion of specs, guides and policies. */
export function ProductInfo({ product }: ProductInfoProps) {
  const isCoffee = product.category === 'coffee'
  const methods = product.brewMethods ?? []
  const includes = product.includes ?? []
  const hasCare = product.details.some((row) => row.label.toLowerCase() === 'care')
  const editorialImage = product.images[1] ?? product.images[0]

  const items: AccordionItemData[] = [
    { id: 'details', title: 'Details', content: <DetailsList rows={product.details} /> },
  ]

  if (methods.length > 0) {
    items.push({
      id: 'guide',
      title: isCoffee ? 'Brew guide' : 'How to use',
      content: <BrewGuide product={product} methods={methods} />,
    })
  } else if (hasCare) {
    items.push({ id: 'care', title: 'Care & keeping', content: <CareContent product={product} /> })
  }

  items.push({ id: 'shipping', title: 'Shipping & returns', content: <ShippingReturns /> })

  if (includes.length > 0) {
    items.push({ id: 'includes', title: 'In the box', content: <IncludesList items={includes} /> })
  }

  return (
    <section className="mt-16 border-y border-ink/10 bg-surface py-16 md:mt-20 md:py-24">
      <div className="container-shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow">From the roastery</p>
          <h2 className="display-3 mt-3 text-balance">
            {isCoffee ? 'Considered in the making.' : 'Made to be used.'}
          </h2>

          {editorialImage ? (
            <figure className="mt-7">
              <SmartImage
                src={editorialImage.src}
                alt={editorialImage.alt}
                className="aspect-[4/3] w-full"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <figcaption className="mt-2.5 text-[11px] leading-relaxed text-muted">
                {editorialImage.alt}
              </figcaption>
            </figure>
          ) : null}

          {methods.length > 0 ? (
            <div className="mt-7">
              <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted">
                {isCoffee ? 'Brew it as' : 'Made for'}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {methods.map((method) => (
                  <li key={method} className={chipClass}>
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-7">
          <p className="eyebrow">Good to know</p>
          <h2 className="mt-3 font-display text-[26px] leading-tight tracking-[-0.01em]">
            The fine print.
          </h2>
          <Accordion items={items} defaultOpen={['details']} className="mt-6" />
        </div>
      </div>
    </section>
  )
}
