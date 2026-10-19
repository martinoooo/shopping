import type { CartLine } from '@/lib/types'
import { OrderLineItems } from './OrderLineItems'
import type { PaymentFormValues, ShippingFormValues } from './validation'

interface ReviewStepProps {
  shipping: ShippingFormValues
  payment: PaymentFormValues
  lines: CartLine[]
  onEditStep: (step: number) => void
}

function SectionHeading({
  id,
  title,
  onEdit,
  editLabel,
}: {
  id: string
  title: string
  onEdit: () => void
  editLabel: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 id={id} className="eyebrow">
        {title}
      </h3>
      <button
        type="button"
        onClick={onEdit}
        className="flex h-11 items-center px-1 text-[11px] uppercase tracking-[0.12em] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        {editLabel}
      </button>
    </div>
  )
}

export function ReviewStep({ shipping, payment, lines, onEditStep }: ReviewStepProps) {
  const cardDigits = payment.cardNumber.replace(/\D/g, '')
  const lastFour = cardDigits.slice(-4)
  const fullName = `${shipping.firstName} ${shipping.lastName}`.trim()
  const email = shipping.email.trim()

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <section aria-labelledby="review-shipping-heading">
          <SectionHeading
            id="review-shipping-heading"
            title="Ship to"
            editLabel="Edit shipping"
            onEdit={() => onEditStep(0)}
          />
          <address className="mt-2 text-[13px] not-italic leading-relaxed text-ink">
            <span className="font-medium">{fullName}</span>
            <br />
            {shipping.address}
            {shipping.apartment ? `, ${shipping.apartment}` : ''}
            <br />
            {shipping.city}, {shipping.region} {shipping.postalCode}
            <br />
            United States
          </address>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            {email}
            {shipping.phone.trim() ? (
              <>
                <br />
                {shipping.phone}
              </>
            ) : null}
          </p>
        </section>

        <section aria-labelledby="review-payment-heading">
          <SectionHeading
            id="review-payment-heading"
            title="Payment"
            editLabel="Edit payment"
            onEdit={() => onEditStep(1)}
          />
          <div className="mt-2 flex items-center gap-3 border border-ink/10 bg-cream/30 px-3.5 py-3">
            <span className="flex h-8 w-11 items-center justify-center rounded-[2px] bg-ink text-[9px] font-medium uppercase tracking-[0.12em] text-paper">
              Card
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-ink">Card ending in {lastFour}</p>
              <p className="mt-0.5 text-[12px] text-muted">
                Expires {payment.expiry} · {payment.cardName}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            Demo payment — the card will not be charged.
          </p>
        </section>
      </div>

      <section aria-labelledby="review-items-heading" className="border-t border-ink/10 pt-5">
        <h3 id="review-items-heading" className="eyebrow">
          Your order
        </h3>
        <OrderLineItems lines={lines} className="mt-2" />
      </section>

      <p className="border-t border-ink/10 pt-4 text-[11px] leading-relaxed text-muted">
        By placing this order you agree to our shipping and returns policy. This is a demo store;
        no payment will be taken and no real order will be sent.
      </p>
    </div>
  )
}
