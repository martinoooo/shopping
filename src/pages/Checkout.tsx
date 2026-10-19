import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Info, Lock, ShoppingBag, Sparkles } from 'lucide-react'
import { Button, EmptyState, buttonStyles } from '@/components/ui'
import { useCartStore, useCartTotals } from '@/store/cart'
import { useToast } from '@/store/ui'
import { usePageTitle } from '@/lib/hooks'
import { formatMoney } from '@/lib/utils'
import { CHECKOUT_STEPS, CheckoutStepper } from '@/components/checkout/CheckoutStepper'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { ShippingStep } from '@/components/checkout/ShippingStep'
import { PaymentStep } from '@/components/checkout/PaymentStep'
import { ReviewStep } from '@/components/checkout/ReviewStep'
import {
  EMPTY_PAYMENT,
  EMPTY_SHIPPING,
  PAYMENT_FIELD_IDS,
  SHIPPING_FIELD_IDS,
  demoPayment,
  demoShipping,
  formatCardNumber,
  formatCvc,
  formatExpiry,
  toShippingDetails,
  validatePayment,
  validateShipping,
} from '@/components/checkout/validation'
import type {
  PaymentErrors,
  PaymentField,
  PaymentFormValues,
  ShippingErrors,
  ShippingField,
  ShippingFormValues,
} from '@/components/checkout/validation'

const STEP_COPY = [
  { title: 'Shipping details', description: 'Where should we send your coffee?' },
  { title: 'Payment', description: 'Enter a test card — no real charge will be made.' },
  { title: 'Review your order', description: 'One last look before we roast it.' },
] as const

function focusFirstField<T extends string>(
  ids: Record<T, string>,
  errors: Partial<Record<T, string>>,
): void {
  const firstKey = (Object.keys(errors) as T[])[0]
  if (!firstKey) return
  document.getElementById(ids[firstKey])?.focus()
}

export default function Checkout() {
  usePageTitle('Checkout')

  const lines = useCartStore((state) => state.lines)
  const placeOrder = useCartStore((state) => state.placeOrder)
  const totals = useCartTotals()
  const navigate = useNavigate()
  const pushToast = useToast()

  const [step, setStep] = useState(0)
  const [shipping, setShipping] = useState<ShippingFormValues>(EMPTY_SHIPPING)
  const [payment, setPayment] = useState<PaymentFormValues>(EMPTY_PAYMENT)
  const [showShippingErrors, setShowShippingErrors] = useState(false)
  const [showPaymentErrors, setShowPaymentErrors] = useState(false)
  const [touchedShipping, setTouchedShipping] = useState<Partial<Record<ShippingField, boolean>>>({})
  const [touchedPayment, setTouchedPayment] = useState<Partial<Record<PaymentField, boolean>>>({})
  const [placing, setPlacing] = useState(false)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const previousStep = useRef(step)
  const placeTimer = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      if (placeTimer.current) window.clearTimeout(placeTimer.current)
    },
    [],
  )

  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step
    headingRef.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [step])

  const shippingErrors = useMemo(() => validateShipping(shipping), [shipping])
  const paymentErrors = useMemo(() => validatePayment(payment), [payment])

  const visibleShippingErrors = useMemo<ShippingErrors>(() => {
    const visible: ShippingErrors = {}
    for (const key of Object.keys(shippingErrors) as ShippingField[]) {
      if (showShippingErrors || touchedShipping[key]) visible[key] = shippingErrors[key]
    }
    return visible
  }, [shippingErrors, showShippingErrors, touchedShipping])

  const visiblePaymentErrors = useMemo<PaymentErrors>(() => {
    const visible: PaymentErrors = {}
    for (const key of Object.keys(paymentErrors) as PaymentField[]) {
      if (showPaymentErrors || touchedPayment[key]) visible[key] = paymentErrors[key]
    }
    return visible
  }, [paymentErrors, showPaymentErrors, touchedPayment])

  const onShippingChange = (field: ShippingField, value: string) => {
    setShipping((previous) => ({ ...previous, [field]: value }))
  }

  const onPaymentChange = (field: PaymentField, value: string) => {
    const formatted =
      field === 'cardNumber'
        ? formatCardNumber(value)
        : field === 'expiry'
          ? formatExpiry(value)
          : field === 'cvc'
            ? formatCvc(value)
            : value
    setPayment((previous) => ({ ...previous, [field]: formatted }))
  }

  const onContinue = () => {
    if (step === 0) {
      if (Object.keys(shippingErrors).length > 0) {
        setShowShippingErrors(true)
        focusFirstField(SHIPPING_FIELD_IDS, shippingErrors)
        return
      }
      setStep(1)
      return
    }

    if (step === 1) {
      if (Object.keys(paymentErrors).length > 0) {
        setShowPaymentErrors(true)
        focusFirstField(PAYMENT_FIELD_IDS, paymentErrors)
        return
      }
      setStep(2)
      return
    }

    onPlaceOrder()
  }

  const onPlaceOrder = () => {
    if (placing) return
    setPlacing(true)
    placeTimer.current = window.setTimeout(() => {
      try {
        const order = placeOrder(toShippingDetails(shipping))
        navigate(`/order/${order.id}`)
      } catch (error) {
        setPlacing(false)
        pushToast({
          title: 'We could not place your order',
          description: error instanceof Error ? error.message : 'Please try again.',
          tone: 'error',
        })
      }
    }, 700)
  }

  const onAutofill = () => {
    setShipping(demoShipping())
    setPayment(demoPayment())
    setShowShippingErrors(false)
    setShowPaymentErrors(false)
    setTouchedShipping({})
    setTouchedPayment({})
    pushToast({
      title: 'Demo details filled',
      description: 'Test data is in place — continue through the flow.',
      tone: 'default',
    })
  }

  if (lines.length === 0) {
    return (
      <div className="container-shell py-16 md:py-24">
        <div className="mx-auto max-w-xl">
          <p className="eyebrow">Checkout</p>
          <h1 className="display-2 mt-3">Checkout</h1>
          <div className="surface-card mt-8">
            <EmptyState
              icon={ShoppingBag}
              title="Your bag is empty"
              description="Add a bag of coffee or a piece of brewing gear, then come back to finish your order."
              action={
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link to="/shop?category=coffee" className={buttonStyles({ size: 'md' })}>
                    Shop coffee
                  </Link>
                  <Link to="/shop" className={buttonStyles({ variant: 'outline', size: 'md' })}>
                    Browse the shop
                  </Link>
                </div>
              }
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-shell py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Checkout</p>
            <h1 className="display-2 mt-2">Checkout</h1>
          </div>
          <Link
            to="/shop"
            className="flex h-11 items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Continue shopping
          </Link>
        </div>

        <div className="mt-8 border-y border-ink/10 py-4">
          <CheckoutStepper current={step} onStepClick={setStep} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10 xl:gap-14">
          <div className="order-2 lg:order-1">
            <div className="flex flex-col gap-3 border border-ink/10 bg-cream/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2.5 text-[12px] leading-relaxed text-muted">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink/60" aria-hidden="true" />
                <span>
                  <span className="font-medium text-ink">Demo checkout.</span> No real payment will
                  be processed.
                </span>
              </p>
              {step < 2 ? (
                <Button
                  variant="surface"
                  className="h-11 w-full shrink-0 px-4 text-[12px] sm:w-auto"
                  leftIcon={<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
                  onClick={onAutofill}
                >
                  Autofill demo details
                </Button>
              ) : null}
            </div>

            <section className="surface-card mt-4" aria-labelledby="checkout-step-heading">
              <div className="border-b border-ink/10 px-5 py-5 sm:px-7">
                <p className="eyebrow">Step {step + 1} of 3</p>
                <h2
                  ref={headingRef}
                  id="checkout-step-heading"
                  tabIndex={-1}
                  className="mt-1.5 font-display text-[24px] leading-tight text-ink"
                >
                  {STEP_COPY[step].title}
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  {STEP_COPY[step].description}
                </p>
              </div>

              <form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault()
                  onContinue()
                }}
                className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7"
              >
                {step === 0 ? (
                  <ShippingStep
                    values={shipping}
                    errors={visibleShippingErrors}
                    onChange={onShippingChange}
                    onBlur={(field) =>
                      setTouchedShipping((previous) => ({ ...previous, [field]: true }))
                    }
                  />
                ) : null}

                {step === 1 ? (
                  <PaymentStep
                    values={payment}
                    errors={visiblePaymentErrors}
                    onChange={onPaymentChange}
                    onBlur={(field) =>
                      setTouchedPayment((previous) => ({ ...previous, [field]: true }))
                    }
                  />
                ) : null}

                {step === 2 ? (
                  <ReviewStep
                    shipping={shipping}
                    payment={payment}
                    lines={lines}
                    onEditStep={setStep}
                  />
                ) : null}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  {step === 0 ? (
                    <Link
                      to="/shop"
                      className="flex h-11 items-center justify-center gap-2 text-[12px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                      Back to shop
                    </Link>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep((current) => current - 1)}
                      leftIcon={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}
                    >
                      Back
                    </Button>
                  )}

                  {step < 2 ? (
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto"
                      rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                    >
                      Continue to {CHECKOUT_STEPS[step + 1].toLowerCase()}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="lg"
                      loading={placing}
                      className="w-full sm:w-auto"
                      leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
                    >
                      Place order · {formatMoney(totals.total)}
                    </Button>
                  )}
                </div>
              </form>
            </section>
          </div>

          <div className="order-1 lg:order-2">
            <OrderSummary lines={lines} totals={totals} />
          </div>
        </div>
      </div>
    </div>
  )
}
