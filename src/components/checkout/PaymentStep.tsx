import { Lock } from 'lucide-react'
import { TextField } from './FormField'
import { PAYMENT_FIELD_IDS } from './validation'
import type { PaymentErrors, PaymentField, PaymentFormValues } from './validation'

interface PaymentStepProps {
  values: PaymentFormValues
  errors: PaymentErrors
  onChange: (field: PaymentField, value: string) => void
  onBlur: (field: PaymentField) => void
}

export function PaymentStep({ values, errors, onChange, onBlur }: PaymentStepProps) {
  const fieldProps = (field: PaymentField) => ({
    id: PAYMENT_FIELD_IDS[field],
    error: errors[field],
    onBlur: () => onBlur(field),
  })

  return (
    <div className="space-y-4">
      <TextField
        {...fieldProps('cardName')}
        label="Name on card"
        value={values.cardName}
        onChange={(event) => onChange('cardName', event.target.value)}
        autoComplete="cc-name"
        autoCapitalize="words"
        required
      />

      <TextField
        {...fieldProps('cardNumber')}
        label="Card number"
        value={values.cardNumber}
        onChange={(event) => onChange('cardNumber', event.target.value)}
        autoComplete="cc-number"
        inputMode="numeric"
        maxLength={19}
        placeholder="4242 4242 4242 4242"
        hint="Demo card: 4242 4242 4242 4242. No real payment is processed."
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          {...fieldProps('expiry')}
          label="Expiry"
          value={values.expiry}
          onChange={(event) => onChange('expiry', event.target.value)}
          autoComplete="cc-exp"
          inputMode="numeric"
          maxLength={5}
          placeholder="MM/YY"
          required
        />
        <TextField
          {...fieldProps('cvc')}
          label="Security code"
          value={values.cvc}
          onChange={(event) => onChange('cvc', event.target.value)}
          autoComplete="cc-csc"
          inputMode="numeric"
          maxLength={4}
          placeholder="123"
          required
        />
      </div>

      <div className="mt-6 flex items-start gap-3 border border-ink/10 bg-cream/30 px-4 py-4">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.75} aria-hidden="true" />
        <p className="text-[12px] leading-relaxed text-muted">
          <span className="font-medium text-ink">Test data only.</span> Card details stay in your
          browser and are never sent anywhere. No charge will be made.
        </p>
      </div>
    </div>
  )
}
