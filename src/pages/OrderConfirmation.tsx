import { Link, useParams } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Check,
  Mail,
  MapPin,
  PackageSearch,
} from 'lucide-react'
import { Badge, buttonStyles } from '@/components/ui'
import { OrderLineItems } from '@/components/checkout/OrderLineItems'
import { OrderTotals } from '@/components/checkout/OrderTotals'
import { useCartStore } from '@/store/cart'
import { usePageTitle } from '@/lib/hooks'
import { SITE } from '@/lib/site'
import { formatDate, pluralize } from '@/lib/utils'

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const lastOrder = useCartStore((state) => state.lastOrder)
  const order = lastOrder && lastOrder.id === orderId ? lastOrder : undefined

  usePageTitle(order ? 'Order confirmed' : 'Order not found')

  if (!order) {
    return (
      <div className="container-shell flex min-h-[60vh] items-center justify-center py-20">
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink/60">
            <PackageSearch className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <p className="eyebrow mt-6">Order lookup</p>
          <h1 className="display-2 mt-3">We can't find that order.</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            This order may have been placed in another browser session, or the link could be
            incomplete. Your confirmation email will always have the details.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/shop" className={buttonStyles({ size: 'md' })}>
              Back to the shop
            </Link>
            <Link to="/" className={buttonStyles({ variant: 'outline', size: 'md' })}>
              Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0)
  const { shippingDetails } = order
  const fullName = `${shippingDetails.firstName} ${shippingDetails.lastName}`.trim()

  return (
    <div className="container-shell py-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-ink/10 pb-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-paper">
            <Check className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
          </span>
          <p className="eyebrow mt-6">Order confirmed</p>
          <h1 className="display-2 mt-3">Thank you, {shippingDetails.firstName || 'friend'}.</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted">
            Your order is confirmed and heading for the roastery queue. We'll email{' '}
            <span className="text-ink">{shippingDetails.email}</span> when it ships.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-muted">
            <p>
              Order <span className="font-medium tabular-nums text-ink">{order.id}</span>
            </p>
            <span className="h-1 w-1 rounded-full bg-muted/50" aria-hidden="true" />
            <p>{formatDate(order.createdAt)}</p>
            {order.promoCode ? (
              <>
                <span className="h-1 w-1 rounded-full bg-muted/50" aria-hidden="true" />
                <Badge variant="forest">{order.promoCode} applied</Badge>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:gap-8">
          <div className="space-y-6">
            <section className="surface-card p-5 sm:p-6" aria-labelledby="confirmation-order-heading">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="confirmation-order-heading" className="font-display text-[20px] text-ink">
                  Your order
                </h2>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
                  {pluralize(itemCount, 'item')}
                </p>
              </div>
              <OrderLineItems lines={order.lines} className="mt-3" />
            </section>

            <section className="surface-card p-5 sm:p-6" aria-labelledby="confirmation-address-heading">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.75} aria-hidden="true" />
                <div className="min-w-0">
                  <h2 id="confirmation-address-heading" className="font-display text-[20px] text-ink">
                    Shipping address
                  </h2>
                  <address className="mt-2 text-[13px] not-italic leading-relaxed text-ink">
                    <span className="font-medium">{fullName}</span>
                    <br />
                    {shippingDetails.address}
                    {shippingDetails.apartment ? `, ${shippingDetails.apartment}` : ''}
                    <br />
                    {shippingDetails.city}, {shippingDetails.region} {shippingDetails.postalCode}
                    <br />
                    {shippingDetails.country}
                  </address>
                  <p className="mt-2 flex items-center gap-1.5 text-[12px] text-muted">
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    {shippingDetails.email}
                  </p>
                  {shippingDetails.phone ? (
                    <p className="mt-1 text-[12px] text-muted">{shippingDetails.phone}</p>
                  ) : null}
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="surface-card p-5 sm:p-6" aria-labelledby="confirmation-delivery-heading">
              <div className="flex items-center gap-2 text-forest">
                <CalendarDays className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                <h2 id="confirmation-delivery-heading" className="eyebrow text-forest">
                  Estimated delivery
                </h2>
              </div>
              <p className="mt-2 font-display text-[21px] leading-tight text-ink">
                {formatDate(order.estimatedDelivery)}
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">
                Roasted to order and shipped with tracking. You'll get a dispatch note by email.
              </p>
            </section>

            <section className="surface-card p-5 sm:p-6" aria-labelledby="confirmation-totals-heading">
              <h2 id="confirmation-totals-heading" className="font-display text-[20px] text-ink">
                Order total
              </h2>
              <OrderTotals
                subtotal={order.subtotal}
                discount={order.discount}
                shipping={order.shipping}
                tax={order.tax}
                total={order.total}
                promoCode={order.promoCode}
                className="mt-3"
              />
            </section>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 border-t border-ink/10 pt-8 sm:flex-row">
          <Link
            to="/shop"
            className={buttonStyles({ size: 'lg' })}
          >
            Continue shopping
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link to="/" className={buttonStyles({ variant: 'outline', size: 'lg' })}>
            Back home
          </Link>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted">
          This is a demo store — no payment was processed. Questions?{' '}
          <a href={`mailto:${SITE.supportEmail}`} className="link-underline text-ink">
            {SITE.supportEmail}
          </a>
        </p>
      </div>
    </div>
  )
}
